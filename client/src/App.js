import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Join from "./components/Join/Join";
import Broadcast from "./components/Broadcast/Broadcast";
import Watch from "./components/Watch/Watch";
import Wipeout from "./components/Wipeout/Wipeout";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Join} />
        <Route path="/broadcast" component={Broadcast} />
        <Route path="/watch/:broadcasterId" component={Watch} />
        <Route path="/wipeout" component={Wipeout} />
      </Switch>
    </Router>
  );
};

export default App;
