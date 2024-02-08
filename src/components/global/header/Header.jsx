import React, { useState } from "react";
import "./Header.scss";
import {
  HomeOutlined,
  NotificationsOutlined,
  PersonOutline,
  Search,
  SettingsOutlined,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";
import { Button, Col, Container, Dropdown, Row } from "react-bootstrap";
import Logout from "../../logout/Logout";

import DefaultUser from "../../../assets/default-user.jpg";

const Header = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <Row className="header align-items-center">
      <Col lg="3" md="4" sm="5" xs="8">
        <div className="logo-search">
          <div className="logo">
            <NavLink to="/">|-|</NavLink>
          </div>
          <form className="searchbar">
            <input type="text" placeholder="Search..." />

            <button type="submit">
              <Search />
            </button>
          </form>
        </div>
      </Col>

      <Col
        lg="6"
        md="4"
        sm="5"
        className="text-center d-none d-sm-block"
      >
        <div className="menubar ">
          <NavLink to="/">
            <HomeOutlined />
          </NavLink>
          <NavLink to="/profile">
            <PersonOutline />
          </NavLink>
          <NavLink to="/notifications">
            <NotificationsOutlined />
          </NavLink>
        </div>
      </Col>

      <Col lg="3" md="4" sm="2" xs="4">
        <Dropdown className="userprofile ms-auto">
          <Dropdown.Toggle id="dropdown-basic">
            <img
              className="profile-pic img-fluid"
              src={user.photoURL || DefaultUser}
              alt=""
            />
            <span className=" d-md-block d-none">{user.displayName}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <NavLink to="/profile">
                <PersonOutline /> Profile
              </NavLink>
            </Dropdown.Item>
            <Dropdown.Item>
              <Logout />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default Header;
