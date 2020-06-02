import React, { useEffect, useState } from 'react';
import useSocket from 'use-socket.io-client';
import axios from 'axios';


const Broadcast = () => {
    const [broadcaster, setBroadcaster] = useState('');
    const [name, setName] = useState('');

    const ENDPOINT = 'http://localhost:4004';
    const [socket] = useSocket(ENDPOINT);

    useEffect(() => {
        socket.on('broadcaster', id => {
            setBroadcaster(id);

        })
        console.log(broadcaster)
    }, [socket, broadcaster])

    const handleNewBroadcaster = () => {
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