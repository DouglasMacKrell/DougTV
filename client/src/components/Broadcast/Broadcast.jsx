import React, { useEffect, useState, useRef } from 'react';
import useSocket from 'use-socket.io-client';
import axios from 'axios';

import useUserMedia from '../useUserMedia/useUserMedia'

const Broadcast = () => {
    const [broadcaster, setBroadcaster] = useState('');
    const [name, setName] = useState('');
    const [peerConnections, setPeerConnections] = useState({});
    const [constraints, setConstraints] = useState({
        audio: true,
        video: { facingMode: "user" }
    });

    const config = {
        iceServers: [
            {
                urls: ["stun:stun.l.google.com:19302"]
            }
        ]
    };

    const ENDPOINT = "https://dougtv.herokuapp.com/";
    const [socket] = useSocket(ENDPOINT);

    const videoRef = useRef();
    const mediaStream = useUserMedia(constraints);

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    console.log("videoRef =", videoRef);

    useEffect(() => {
        socket.on("broadcaster", id => {
            setBroadcaster(id)
            console.log("broadcaster id:", broadcaster);
        })
    }, [socket]);

    useEffect(() => {
        socket.on("watcher", id => {
            console.log("watcher received from Server")
            const peerConnection = new RTCPeerConnection(config);
            peerConnections[id] = peerConnection;

            setPeerConnections(peerConnections[id] = peerConnection)
            let stream = videoRef.current.srcObject
            console.log("stream used by Watcher", stream)
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };

            peerConnection
                .createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("offer", id, peerConnection.localDescription);
                });
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
        // closes connection when client disconnects
        socket.on("disconnectPeer", id => {
            peerConnections[id].close();
            delete peerConnections[id];
        });
        // close the socket if the user closes the window
        window.onunload = window.onbeforeunload = () => {
            socket.close();
        };
    }, [socket, window]);

    const handleCanPlay = () => {
        videoRef.current.play();
    };

    const handleNewBroadcaster = () => {
        socket.emit('broadcaster', socket.id)
        console.log("broadcaster emitted", socket.id)
    };

    const launchBroadcast = async () => {
        try {
            let response = await axios.post(`/api/broadcasters/new/${broadcaster}`, {
                username: name
            })
            let broadcasterData = response.data.payload
            socket.emit('new-broadcaster', broadcasterData)
            console.log(broadcasterData)
            return broadcasterData
        } catch (error) {
            console.log('err:', error);
        }
    };

    const disconnectBroadcaster = async () => {
        try {
            let offTheAir = await axios.patch(`/api/broadcasters/${broadcaster}`, {
                broadcaster_active: "false"
            })
            socket.emit('stop-broadcaster')
            console.log(offTheAir)
            return offTheAir
        } catch (error) {
            console.log('err:', error)
        }
    };

    return (
        <div>
            <h1>Smile! You're on camera!</h1>
            <video className="video" autoPlay={true} muted ref={videoRef} onCanPlay={handleCanPlay} playsInline muted />
            <div>
                <input placeholder="Enter your username" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
            </div>
            <button onClick={() => handleNewBroadcaster()}>Connect</button>
            <button onClick={(e) => (!name) ? e.preventDefault : launchBroadcast()}>Start Broadcast</button>
            <button onClick={() => disconnectBroadcaster()}>Disconnect</button>
            <p>To start a stream, first click CONNECT to connect to the server, your livestream broadcast won't be publicly listed until you click the START BROADCAST button. When you're done, click DISCONNECT to remove your stream from public view and then close your tab to close your camera!</p>
        </div>
    )
}

export default Broadcast