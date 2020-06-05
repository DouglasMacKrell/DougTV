import React, { useEffect, useState, useRef } from 'react';
import useSocket from 'use-socket.io-client';
import axios from 'axios';

import useUserMedia from '../useUserMedia/useUserMedia'

const Broadcast = () => {
    const [broadcaster, setBroadcaster] = useState('');
    const [name, setName] = useState('');
    const [peerConnections, setPeerConnections] = useState({})
    const [constraints, setConstraints] = useState({
        audio: true,
        video: { facingMode: "user" }
    })

    const config = {
        iceServers: [
            {
                urls: ["stun:stun.l.google.com:19302"]
            }
        ]
    };

    const ENDPOINT = 'http://localhost:4004';
    const [socket] = useSocket(ENDPOINT);

    const videoRef = useRef();
    const mediaStream = useUserMedia(constraints);

    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    console.log("videoRef =", videoRef)

    useEffect(() => {
        socket.on("broadcaster", id => {
            setBroadcaster(id)
            console.log("broadcaster id:", broadcaster);
        })
    }, [socket])

    // useEffect(() => {
    //     socket.on('broadcaster', id => {
    //         setBroadcaster(id);
    //         if (!videoEl) {
    //             return
    //         }
    //         navigator.mediaDevices.getUserMedia(constraints)
    //             .then(stream => {
    //                 let video = videoEl.current
    //                 video.srcObject = stream
    //                 // setVideoEl(stream)
    //             })
    //     })
    //     console.log(broadcaster)
    //     console.log("first set videoEl", videoEl)
    // }, [videoEl])

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
    }, [socket])

    useEffect(() => {
        socket.on("answer", (id, description) => {
            peerConnections[id].setRemoteDescription(description);
        });
    }, [socket]);

    useEffect(() => {
        socket.on("candidate", (id, candidate) => {
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });
    }, [socket])

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
    }, [socket, window])

    const handleCanPlay = () => {
        videoRef.current.play();
    }

    const handleNewBroadcaster = () => {
        console.log("broadcaster emitted")
        socket.emit('broadcaster', socket.id)
    }

    const launchBroadcast = async () => {
        try {
            let response = await axios.post(`http://localhost:4004/api/broadcasters/new/${broadcaster}`, {
                username: name
            })
            let broadcasterData = response.data.payload
            socket.emit('new-broadcaster', broadcasterData)
            console.log(broadcasterData)
            return broadcasterData
        } catch (error) {
            console.log('err:', error)
        }
    }

    const disconnectBroadcaster = async () => {
        try {
            let offTheAir = await axios.patch(`http://localhost:4004/api/broadcasters/${broadcaster}`, {
                broadcaster_active: "false"
            })
            socket.emit('stop-broadcaster')
            console.log(offTheAir)
            return offTheAir
        } catch (error) {
            console.log('err:', error)
        }
    }

    return (
        <div>
            <h1>Smile! You're on camera!</h1>
            <video className="video" autoPlay={true} muted ref={videoRef} onCanPlay={handleCanPlay} playsInline muted />
            <div>
                <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
            </div>
            <button onClick={() => handleNewBroadcaster()}>Connect</button>
            <button onClick={(e) => (!name) ? e.preventDefault : launchBroadcast()}>Start Broadcast</button>
            <button onClick={() => disconnectBroadcaster()}>Disconnect</button>
        </div>
    )
}

export default Broadcast