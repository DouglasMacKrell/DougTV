import React, { useEffect, useState, useRef } from "react";
import useSocket from "use-socket.io-client";
import axios from "axios";

import "./Broadcast.css";

import useUserMedia from "../useUserMedia/useUserMedia";

const Broadcast = () => {
  const [broadcaster, setBroadcaster] = useState("");
  const [name, setName] = useState("");
  const [peerConnections, setPeerConnections] = useState({});
  const [numberOfViewers, setNumberOfViewers] = useState(0);
  const [broadcastLaunched, setBroadcastLaunched] = useState(false);
  const [constraints, setConstraints] = useState({
    audio: true,
    video: { facingMode: "user" },
  });

  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
    ],
  };

  const ENDPOINT = "https://dougtv.herokuapp.com/";
  const [socket] = useSocket(ENDPOINT);

  const videoRef = useRef();
  const mediaStream = useUserMedia(constraints);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  useEffect(() => {
    socket.on("broadcaster", (id) => {
      setBroadcaster(id);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("watcher", (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;

      setPeerConnections((peerConnections[id] = peerConnection));
      let stream = videoRef.current.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offer", id, peerConnection.localDescription);
        });
      setNumberOfViewers(Object.keys(peerConnections).length);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("answer", (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, [socket]);

  useEffect(() => {
    socket.on("disconnectPeer", (id) => {
      peerConnections[id].close();
      delete peerConnections[id];
      setNumberOfViewers(Object.keys(peerConnections).length);
    });
  }, [socket]);

  useEffect(() => {
    window.onunload = window.onbeforeunload = () => {
      disconnectBroadcaster();
      socket.close();
    };
  }, [window]);

  const handleCanPlay = () => {
    videoRef.current.play();
  };

  const handleNewBroadcaster = () => {
    socket.emit("broadcaster", socket.id);
  };

  const launchBroadcast = async () => {
    try {
      let response = await axios.post(`/api/broadcasters/new/${broadcaster}`, {
        username: name,
      });
      setBroadcastLaunched(true);
      let broadcasterData = response.data.payload;
      socket.emit("new-broadcaster", broadcasterData);
      return broadcasterData;
    } catch (error) {
      console.log("err:", error);
    }
  };

  const disconnectBroadcaster = async () => {
    try {
      let offTheAir = await axios.patch(`/api/broadcasters/${broadcaster}`, {
        broadcaster_active: "false",
      });
      socket.emit("stop-broadcaster");
      return offTheAir;
    } catch (error) {
      console.log("err:", error);
    }
  };

  return (
    <div className="broadcast__main-container">
      <div className="broadcast__sub-container">
        <h1 className="broadcast__header">Smile! You're on camera!</h1>
        <video
          className="video"
          autoPlay={true}
          muted
          ref={videoRef}
          onCanPlay={handleCanPlay}
          playsInline
          muted
        />
        <div className="name-input">
          <input
            placeholder="Enter your username"
            className="joinInput"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <button
          className="broadcast__button"
          onClick={() => handleNewBroadcaster()}
        >
          Connect
        </button>
        <button
          disabled={broadcastLaunched ? true : false}
          className="broadcast__button"
          onClick={(e) => (!name ? e.preventDefault : launchBroadcast())}
        >
          Start Broadcast
        </button>
        <button
          className="broadcast__button"
          onClick={() => disconnectBroadcaster()}
        >
          End Broadcast
        </button>
        <h3>Viewers: {numberOfViewers}</h3>
        <p>
          To start a stream, first enter a publicly visible USERNAME and click
          CONNECT to connect to the server.
        </p>
        <p>
          Don't worry, your livestream broadcast won't be accessible until you
          click the START BROADCAST button!
        </p>
        <p>
          When you're done with your broadcast, click END BROADCAST to delete and
          remove your stream from public view!
        </p>
        <p>
          Finally, close your tab! This will automatically close and disconnect
          your camera and microphone.
        </p>
      </div>
    </div>
  );
};

export default Broadcast;
