import React from "react"
import { Link } from 'react-router-dom'

const BroadcasterLink = ({ broadcaster }) => {
    let broadcasterId = broadcaster.socket_id
    let name = broadcaster.username

    return <li><Link to={`/watch/${broadcasterId}`}>{name}</Link></li>
}

export default BroadcasterLink