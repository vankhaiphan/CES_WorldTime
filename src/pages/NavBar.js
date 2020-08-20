import authService from "../api/authService";
import React, { useState } from "react";


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
  const logout = (e) => {
    authService.logout();
  };
  var currentUser = localStorage.getItem("email");
  return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">World Clock</NavbarBrand>
        <NavbarToggler onClick={toggle}></NavbarToggler>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            {currentUser && 
              (<NavItem>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </NavItem>)
              
            }
            
            {!currentUser && (
              <NavItem>
                <NavLink href="/login">Login</NavLink>
              </NavItem>
            )}
          </Nav>
          <Nav className="mr-2">
            {currentUser && (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {currentUser}
                </DropdownToggle>
                <DropdownMenu right>
                  
                  <DropdownItem divider />
                  <DropdownItem href="login" onClick={logout}>Log out</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Collapse>
      </Navbar>
      
    
  );
};
export default NavBar;
