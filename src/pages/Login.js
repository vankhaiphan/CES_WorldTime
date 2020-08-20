import React, { useState, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Login_Signup.css";
import authService from "../api/authService";
import { PASSWORD_MIN_LENGTH, emailRegex, formValid } from "./formValidation";

class Login extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      email: null,
      password: null,
      message: null,
      Loading: false,
      message: null,
      formErrors: {
        email: "",
        password: "",
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.state.Loading= true;
    

    if (formValid(this.state)) {
      //CAll API login
      //Need URL
      authService.login( this.state.email,  this.state.password).then(
        () => {
          this.history.push("/account");
          window.location.reload();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(error);
          this.state.Loading = false;
          this.state.message= resMessage;
        }
      );

      console.log(`
            --SUBMITTING--
           
            Email: ${this.state.email}
            Password: ${this.state.password}
          `);
    } else {
      this.state.Loading = false;
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case "password":
        formErrors.password =
          value.length < PASSWORD_MIN_LENGTH
            ? "minimum 6 characters required"
            : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value });
  };

  render() {
    const { email, password, loggedIn } = this.state;

    if (this.state.LoggedIn) {
      return <Redirect to="/dashboard" />;
    }
    const { formErrors } = this.state;

    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>Login</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                className={formErrors.email.length > 0 ? "error" : null}
                placeholder="Email"
                type="email"
                name="email"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.email.length > 0 && (
                <span className="errorMessage">{formErrors.email}</span>
              )}
            </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <input
                className={formErrors.password.length > 0 ? "error" : null}
                placeholder="Password"
                type="password"
                name="password"
                noValidate
                onChange={this.handleChange}
              />
              {formErrors.password.length > 0 && (
                <span className="errorMessage">{formErrors.password}</span>
              )}
            </div>
            <div className="logIn">
              <button type="submit">Login</button>
            </div>
            <Link to="./signup">I don't have an account'</Link>
          </form>
        </div>
      </div>
    );
  }
}
export default Login;
