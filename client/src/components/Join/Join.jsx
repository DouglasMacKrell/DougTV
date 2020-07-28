import React, { useEffect, useState } from "react";
import useSocket from "use-socket.io-client";
import { Link } from "react-router-dom";
import axios from "axios";
import LinksContainer from "../LinksContainer/LinksContainer";

const Join = () => {
  const [broadcasters, setBroadcasters] = useState([]);

  const ENDPOINT = "https://dougtv.herokuapp.com/";
  const [socket] = useSocket(ENDPOINT);

  useEffect(() => {
    socket.on("active-broadcaster", (broadcaster) => {
      let broadcastersCopy = [...broadcasters, broadcaster];
      setBroadcasters(broadcastersCopy);
    });
  }, [socket, broadcasters]);

  const findActiveStreams = async () => {
    let activeStreams = await axios.get(`/api/broadcasters/active`);
    let streams = activeStreams.data.payload;
    setBroadcasters(streams);
  };

  useEffect(() => {
    findActiveStreams();
  }, []);

  return (
    <div className="Join-OuterContainer">
      <div className="Join-InnerContainer">
        <h1 className="heading">Join A Stream or Start Your Own!</h1>
        <h3>Available livestreams are listed below!</h3>
        <Link to={`/broadcast`}>
          <button className={"button mt-20"} type="submit">
            Start Broadcasting
          </button>
        </Link>
        <div>
          <LinksContainer broadcasters={broadcasters} />
        </div>
      </div>
    </div>
  );
};

export default Join;
