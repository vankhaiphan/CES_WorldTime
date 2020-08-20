import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./Home";
import Dashboard from "./Dashboard";
import LoginRouter from "./LoginRouter";
// import "./Nav.css";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <Router>
      <Navbar color="light" light expand ="md">
        <NavbarBrand href="/">World Clock</NavbarBrand>
        <NavbarToggler onClick={toggle}></NavbarToggler>
        <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink href="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/dashboard">Dashboard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/login">Login</NavLink>
          </NavItem>
		</Nav>
		<Nav className="mr-2">
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              User
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href="/dashboard">
                Account
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="#">
                Log out
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        </Collapse>
      </Navbar>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/login" component={LoginRouter} />
      </Switch>
    </Router>
  );
}
export default NavBar;
