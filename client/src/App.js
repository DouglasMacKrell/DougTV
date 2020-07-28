import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Join from "./components/Join/Join";
import Broadcast from "./components/Broadcast/Broadcast";
import Watch from "./components/Watch/Watch";

import '.App.css'

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/broadcast" component={Broadcast} />
      <Route path="/watch/:broadcasterId" component={Watch} />
    </Router>
  );
};

export default App;
