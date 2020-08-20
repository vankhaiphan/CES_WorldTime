import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Navbar from "./NavBar";
import "./Login_Signup.css";

class LoginRouter extends Component {
  render() {
    return (
      <Router>
        <body>
          <div className="BTN  ">
            <button >
              <Link className="nav-link" to={"/login"}>
                Login
              </Link>
            </button>
            <button>
              <Link className="nav-link" to={"/signup"}>
                Sign up
              </Link>
            </button>
          </div>

          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/signup" component={SignUp} />
          </Switch>
          </body>
      </Router>
    );
  }
}
export default LoginRouter;
