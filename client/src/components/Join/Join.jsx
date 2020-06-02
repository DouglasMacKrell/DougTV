import React, { useEffect, useState } from "react";
import useSocket from 'use-socket.io-client';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LinksContainer from '../LinksContainer/LinksContainer'
// import Links from '../LinksContainer/Links'

const Join = () => {
    const [inRoom, setInRoom] = useState(false);
    const [broadcasters, setBroadcasters] = useState([])
    const [messageCount, setMessageCount] = useState(0)
    const [watchInput, setWatchInput] = useState('')

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
        socket.on('active-broadcaster', (broadcaster) => {
            console.log("active-broadcaster emitted")
            console.log("broadcasters active-broadcasters", broadcasters)
            console.log("broadcaster active-broadcasters", broadcaster)
            let broadcastersCopy = [...broadcasters, broadcaster]
            setBroadcasters(broadcastersCopy);
            setMessageCount(messageCount + 1);
            document.title = `${messageCount} new messages have been emitted`;
        })
    }, [socket, messageCount, broadcasters])


    // const handleNewBroadcaster = () => {
    //     socket.emit('broadcaster', socket.id)
    // }

    // const handleWatch = () => {
    //     let searchName = watchInput
    //     console.log("watchInput", watchInput)
    //     for(let broadcaster in broadcasters){
    //         if (searchName === broadcaster.username) {
    //             return `/watch?id=${broadcaster.socket_id}`
    //         }
    //     }
    // }

    const handleInRoom = () => {
        inRoom
            ? setInRoom(false)
            : setInRoom(true);
    }

    const findActiveStreams = async () => {
        console.log("findActiveStreams called")
        let activeStreams = await axios.get(`http://localhost:4004/api/broadcasters/active`)
        let streams = activeStreams.data.payload
        setBroadcasters(streams)
        // handleLinks(streams)
        // console.log("handleLinks", fillLinks)
    }

    // const addActiveStreams = async (broadcaster) => {
    //     console.log("updateActiveStreams called");
    //     let activeStreams = await axios.get(`http://localhost:4004/api/broadcasters/${}`)
    //     let streams = activeStreams.data.payload
    //     setBroadcasters(streams)
    //     // console.log("updated with new", broadcasters)
    // }

    useEffect(() => {
        findActiveStreams()
    }, [])

    // useEffect(() => {
    //     if (broadcasters) {
    //         console.log("gotcha2", broadcasters)
    //         // buildLinks();
    //     }
    // }, [broadcasters])
    console.log("state broadcasters", broadcasters)

    return (
        <div className="Join-OuterContainer">
            <div className="Join-InnerContainer">
                <h1 className="heading">Join A Stream or Start Your Own!</h1>
                <h1>
                    {inRoom && `You Have Entered The Room`}
                    {!inRoom && `Outside Room`}
                </h1>
                <p>{messageCount} messages have been emitted</p>
                <button onClick={() => handleInRoom()}>
                    {inRoom && `Leave Room`}
                    {!inRoom && `Enter Room`}
                </button>
                {/* <button onClick={() => handleNewBroadcaster()}>Start Broadcast</button> */}
                <Link to={`/broadcast`}>
                    <button className={'button mt-20'} type="submit">Start Broadcasting</button>
                </Link>
                <div>
                    <LinksContainer broadcasters={ broadcasters } />
                </div>
            
            </div>
        </div>
    )
}

export default Join;