import React, { Component } from "react";
import {  Redirect } from "react-router-dom";
import ListEvents from "../components/ListEvents/ListEvents";
class Dashboard extends Component {
  render() {
    var logged = localStorage.getItem("email");
    if (logged == null) {
      return <Redirect to="/login"></Redirect>;
    }
    return <ListEvents></ListEvents>;
  }
}
export default Dashboard;
