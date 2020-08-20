import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Login_Signup.css";
import authService from "../api/authService";
import { PASSWORD_MIN_LENGTH, emailRegex, formValid,userConstants } from "./formValidation";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      isLogin :false,
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
    if (formValid(this.state)) {
    const email =this.state.email;
    const password = this.state.password;
     authService.login(email, password)
     .then(() =>{
      alert(userConstants.LOGIN_SUCCESS);
     
      window.location.reload();
      
     },
     (error) => {
      alert(userConstants.LOGIN_FAILURE);
    }

   );
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

    this.setState({ formErrors, [name]: value }, );
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
            <Link to="./signup">I don't have an account!</Link>
          </form>
        </div>
      </div>
    );
  }
}
export default Login;
