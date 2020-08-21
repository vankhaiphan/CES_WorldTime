import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import "../App.css";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Login from "./Login";
import SignUp from "./SignUp";

class Main extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <NavBar></NavBar>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" component={SignUp} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default Main;
