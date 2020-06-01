import React, { useEffect, useState } from "react";
import useSocket from 'use-socket.io-client';
import { Link } from 'react-router-dom'

const Join = () => {
    const [inRoom, setInRoom] = useState(false);
    const [broadcasters, setBroadcasters] = useState([])
    const [broadcaster, setBroadcaster] = useState('')

    const ENDPOINT = 'http://localhost:4004';
    const [socket] = useSocket(ENDPOINT);

    useEffect(() => {

        if (inRoom) {
            console.log('joining room');
            socket.emit('room', { room: 'test-room' });
        }

        return () => {
            if (inRoom) {
                console.log('leaving room');
                socket.emit('leave room', {
                    room: 'test-room'
                })
            }
        }
    });

    useEffect(() => {
        socket.on('broadcaster', id => {
            setBroadcaster(id);
        })
        console.log(broadcaster)
    },[socket, broadcaster])

    useEffect(() => {
        if (broadcaster) {
            let updatedBroadcasters = broadcasters
            updatedBroadcasters.push(broadcaster)
            console.log("updated broadcasters", updatedBroadcasters)
            setBroadcasters(updatedBroadcasters)
        }
        console.log(broadcasters)
        for (let caster of broadcasters) {
            console.log("Broadcaster on", caster)
        }
    }, [broadcaster, broadcasters])

    const handleNewBroadcaster = () => {
        socket.emit('broadcaster', socket.id)
    }

    const handleInRoom = () => {
        inRoom
            ? setInRoom(false)
            : setInRoom(true);
    }

    return (
        <div className="Join-OuterContainer">
            <div className="Join-InnerContainer">
                <h1 className="heading">Join A Stream or Start Your Own!</h1>
                <h1>
                    {inRoom && `You Have Entered The Room`}
                    {!inRoom && `Outside Room`}
                </h1>
                <button onClick={() => handleInRoom()}>
                    {inRoom && `Leave Room`}
                    {!inRoom && `Enter Room`}
                </button>
                <button onClick={() => handleNewBroadcaster()}>Start Broadcast</button>
                <Link to={`/broadcast`}>
                    <button className={'button mt-20'} type="submit">Sign In</button>
                </Link>
                <div className="streamcontainer">

                </div>
            </div>
        </div>
    )
}

export default Join;