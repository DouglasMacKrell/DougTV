import React, { useEffect, useState } from "react";
import useSocket from "use-socket.io-client";
import { Link } from "react-router-dom";
import axios from "axios";
import LinksContainer from "../LinksContainer/LinksContainer";

import Logo from "./DougTV-Logo.svg";
import "./Join.css";

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
    <div className="join__outer-container">
      <div className="join__logo-container">
        <img src={Logo} alt="Doug TV" className="site-logo" />
      </div>
      <div className="join__inner-container">
        <h1 className="join__header">Join A Stream or Start Your Own!</h1>
        <h2>
          Find out more about Douglas MacKrell at{" "}
          <a target="__blank" href="https://douglasmackrell.com">douglasmackrell.com</a>
        </h2>
        <Link to={`/broadcast`}>
          <button className={"join__button mt-20"} type="submit">
            Start Broadcasting
          </button>
        </Link>
        <h3>Available livestreams are listed below!</h3>
        <div className="join__links-container">
          <LinksContainer broadcasters={broadcasters} />
        </div>
      </div>
    </div>
  );
};

export default Join;
