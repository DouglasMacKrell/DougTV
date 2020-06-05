import React, { useEffect, useState } from "react";
import useSocket from 'use-socket.io-client';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LinksContainer from '../LinksContainer/LinksContainer'

const Join = () => {
    const [broadcasters, setBroadcasters] = useState([])

    const ENDPOINT = window.location.hostname;
    const [socket] = useSocket(ENDPOINT);

    useEffect(() => {
        socket.on('active-broadcaster', (broadcaster) => {
            console.log("active-broadcaster emitted")
            console.log("broadcasters active-broadcasters", broadcasters)
            console.log("broadcaster active-broadcasters", broadcaster)
            let broadcastersCopy = [...broadcasters, broadcaster]
            setBroadcasters(broadcastersCopy);
        })
    }, [socket, broadcasters])

    const findActiveStreams = async () => {
        console.log("findActiveStreams called")
        let activeStreams = await axios.get(`/api/broadcasters/active`)
        let streams = activeStreams.data.payload
        setBroadcasters(streams)
    }

    useEffect(() => {
        findActiveStreams()
    }, [])

    console.log("state broadcasters", broadcasters)

    return (
        <div className="Join-OuterContainer">
            <div className="Join-InnerContainer">
                <h1 className="heading">Join A Stream or Start Your Own!</h1>
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