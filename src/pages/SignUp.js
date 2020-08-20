import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Login_Signup.css";
import authService from "../api/authService";

import {
  PASSWORD_MIN_LENGTH,
  NAME_MIN_LENGTH,
  emailRegex,
  formValid,
  userConstants,
} from "./formValidation";
class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,

      formErrors: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      //CAll API Signup

      const firstname = this.state.firstName;
      const lastname = this.state.lastName;
      const email = this.state.email;
      const password = this.state.password;
      authService
        .signup(firstname, lastname, email, password)

        .then(function (response) {
          console.log(response);
          alert(userConstants.SIGNUP_SUCCESS);
          window.location.reload();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }
  };

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "firstName":
        formErrors.firstName =
          value.length < NAME_MIN_LENGTH
            ? "minimum 3 characaters required"
            : "";
        break;
      case "lastName":
        formErrors.lastName =
          value.length < NAME_MIN_LENGTH
            ? "minimum 3 characaters required"
            : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      case "password":
        formErrors.password =
          value.length < PASSWORD_MIN_LENGTH
            ? "minimum 6 characaters required"
            : "";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    var logged = localStorage.getItem("email");
    if (logged !== null) {
      return <Redirect to="/dashboard"></Redirect>;
    }
    const { formErrors } = this.state;

    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>Sign Up</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="firstName">
              <label htmlFor="firstName">First Name</label>
              <input
                className={formErrors.firstName.length > 0 ? "error" : null}
                placeholder="First Name"
                type="text"
                name="firstName"
                noValidate
                required
                onChange={this.handleChange}
              />
              {formErrors.firstName.length > 0 && (
                <span className="errorMessage">{formErrors.firstName}</span>
              )}
            </div>
            <div className="lastName">
              <label htmlFor="lastName">Last Name</label>
              <input
                className={formErrors.lastName.length > 0 ? "error" : null}
                placeholder="Last Name"
                type="text"
                name="lastName"
                noValidate
                required
                onChange={this.handleChange}
              />
              {formErrors.lastName.length > 0 && (
                <span className="errorMessage">{formErrors.lastName}</span>
              )}
            </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                className={formErrors.email.length > 0 ? "error" : null}
                placeholder="Email"
                type="email"
                name="email"
                noValidate
                required
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
                required
                onChange={this.handleChange}
              />
              {formErrors.password.length > 0 && (
                <span className="errorMessage">{formErrors.password}</span>
              )}
            </div>
            <div className="signUp">
              <button type="submit">Sign Up</button>
              <Link to="/login">I have an account!</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default SignUp;
