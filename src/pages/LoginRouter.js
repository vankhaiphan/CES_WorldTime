import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import NavBar from "./NavBar";
import "./Login_Signup.css";

class LoginRouter extends Component {
  render() {
    
    return (
      
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

         
          </body>
    
    );
  }
}
export default LoginRouter;
