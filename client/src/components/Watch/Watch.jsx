import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import useSocket from 'use-socket.io-client'

const Watch = () => {
    let { broadcasterId } = useParams();
    console.log(broadcasterId)

    const config = {
        iceServers: [
            {
                urls: ["stun:stun.l.google.com:19302"]
            }
        ]
    };

    const ENDPOINT = 'http://localhost:4004';
    const [socket] = useSocket(ENDPOINT);

    let peerConnection
    const videoRef = useRef();

    useEffect(() => {
        socket.on("offer", (id, description) => {
            peerConnection = new RTCPeerConnection(config);
            peerConnection
                .setRemoteDescription(description)
                // we call the createAnswer() function to send back a connection
                // answer to the request of the broadcaster.
                .then(() => peerConnection.createAnswer())
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("answer", id, peerConnection.localDescription);
                });
            // After the connection is established we can continue by getting
            // the video stream using the ontrack event listener of the
            // peerConnection object.
            peerConnection.ontrack = event => {
                videoRef.current.srcObject = event.streams[0];
            };
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };
        });
    }, [socket])

    useEffect(() => {
        socket.on("candidate", (id, candidate) => {
            peerConnection
                .addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error(e));
        });
    }, [socket])

    useEffect(() => {
        socket.on("Peer", () => {
            peerConnection.close();
        });
        window.onunload = window.onbeforeunload = () => {
            socket.close();
        };
    }, [socket])

    const handleWatcher = () => {
        socket.emit("watcher", broadcasterId);
    }

    return (
        <div>
            Watch page
            <video className="video" autoPlay={true} ref={videoRef} />
            <button onClick={() => handleWatcher()}>Connect</button>
        </div>
    )
}

export default Watch