import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from './hooks/useHistory'
import useLocomotiveAndGSAP from "./hooks/useLocomotiveAndGSAP";
import Home from "./pages/Home";


export default function App() {

  useLocomotiveAndGSAP();
  
  return (
    <>
      <Router history={history}>
        <Switch>
          <Route path="/" component={Home}/>
        </Switch>
      </Router>
    </>
  );
}
