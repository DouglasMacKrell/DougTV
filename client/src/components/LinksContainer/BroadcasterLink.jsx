import React from "react"
import { Link } from 'react-router-dom'

const BroadcasterLink = ({ broadcaster }) => {
    let id = broadcaster.socket_id
    let name = broadcaster.username

    return <li><Link to={`/watch/${id}`}>{name}</Link></li>
}

export default BroadcasterLink