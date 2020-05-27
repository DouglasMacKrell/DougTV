import React from 'react';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/broadcast" component={Broadcast} />
      <Route path="/watch" component={Watch} />
    </Router>
  );
}

export default App;
