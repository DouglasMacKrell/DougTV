import React from "react"
import BroadcasterLink from './BroadcasterLink'

const LinksContainer = ({ broadcasters }) => {
    let links = []
    if (broadcasters.length > 0) {
        // console.log("linksContainer", broadcasters)
        for (let broadcaster of broadcasters){
            // console.log("broadcaster", broadcaster)
            links.push(<BroadcasterLink broadcaster={broadcaster} key={broadcaster.socket_id} />)
        }
        return <ul className="links-container" >{ links }</ul>
    }
    return <p>No Streams</p>
}

export default LinksContainer