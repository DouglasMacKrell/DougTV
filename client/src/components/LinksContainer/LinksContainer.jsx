import React from "react";
import BroadcasterLink from "./BroadcasterLink";

const LinksContainer = ({ broadcasters }) => {
  let links = [];
  if (broadcasters.length > 0) {
    for (let broadcaster of broadcasters) {
      links.push(
        <BroadcasterLink
          broadcaster={broadcaster}
          key={broadcaster.socket_id}
        />
      );
    }
    return <ul className="links-container">{links}</ul>;
  }
  return <p>No Streams</p>;
};

export default LinksContainer;
