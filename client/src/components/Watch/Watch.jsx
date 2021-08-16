import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useSocket from "use-socket.io-client";

import "./Watch.css";

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
    socket.on("disconnectPeer", () => {
      peerConnection.close();
    });
  }, [socket]);

  useEffect(() => {
    window.onunload = window.onbeforeunload = () => {
      socket.emit("watcher-disconnect");
      peerConnection.close();
      socket.close();
    };
  }, [window, socket]);

  const handleWatcher = () => {
    socket.emit("watcher", broadcasterId);
  };

  return (
    <div className="watch__main-container">
      <div className="watch__sub-container">
        <h1 className="watch__header">Watch page</h1>
        <video className="video" autoPlay={true} ref={videoRef} />
      </div>
      <button className="watch__button" onClick={() => handleWatcher()}>
        Connect
      </button>
    </div>
  );
};

export default Watch;
