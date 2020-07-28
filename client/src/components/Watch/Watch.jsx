import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useSocket from "use-socket.io-client";

const Watch = () => {
  let { broadcasterId } = useParams();

  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
    ],
  };

  const ENDPOINT = "https://dougtv.herokuapp.com/";
  const [socket] = useSocket(ENDPOINT);

  let peerConnection;
  const videoRef = useRef();

  useEffect(() => {
    socket.on("offer", (id, description) => {
      peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answer", id, peerConnection.localDescription);
        });
      peerConnection.ontrack = (event) => {
        videoRef.current.srcObject = event.streams[0];
      };
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
    });
  }, [socket]);

  useEffect(() => {
    socket.on("candidate", (id, candidate) => {
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e));
    });
  }, [socket]);

  useEffect(() => {
    socket.on("Peer", () => {
      peerConnection.close();
    });
    window.onunload = window.onbeforeunload = () => {
      socket.close();
    };
  }, [socket]);

  const handleWatcher = () => {
    socket.emit("watcher", broadcasterId);
  };

  return (
    <div>
      <h1>Watch page</h1>
      <video className="video" autoPlay={true} ref={videoRef} />
      <button onClick={() => handleWatcher()}>Connect</button>
    </div>
  );
};

export default Watch;
