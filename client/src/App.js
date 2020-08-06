import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Join from "./components/Join/Join";
import Broadcast from "./components/Broadcast/Broadcast";
import Watch from "./components/Watch/Watch";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Join} />
        <Route path="/broadcast" component={Broadcast} />
        <Route path="/watch/:broadcasterId" component={Watch} />
      </Switch>
    </Router>
  );
};

export default App;
