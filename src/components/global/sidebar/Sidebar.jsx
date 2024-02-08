import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { Button, Card, Container, Row } from "react-bootstrap";
import ProfileBg from "../../../assets/profile-bg.jpg";
import DefaultUser from "../../../assets/default-user.jpg";
import Logout from "../../logout/Logout";
import {
  DarkModeOutlined,
  HomeOutlined,
  LightModeOutlined,
  NotificationsOutlined,
  PersonOutline,
} from "@mui/icons-material";

const Sidebar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  //dark mode start
  const storedDarkMode = localStorage.getItem("darkMode");
  const [isDarkMode, setIsDarkMode] = useState(
    storedDarkMode ? JSON.parse(storedDarkMode) : false
  );
  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  //dark mode end

  return (
    <div className="sidebar">
      <Card className="profile-card">
        <Card.Img className="" variant="top" src={ProfileBg} />

        <div className="sidebar-profile">
          <div className="follower d-lg-block d-none">
            <h4>500</h4>
            <span>Followers</span>
          </div>
          <NavLink to="/profile">
            <img
              src={user.photoURL || DefaultUser}
              className="sidebar-profile-img load"
              alt=""
            />
          </NavLink>
          <div className="following d-lg-block d-none">
            <h4>20</h4>
            <span>Following</span>
          </div>
        </div>

        <Card.Body className="d-lg-block d-none">
          <Card.Title>{user.displayName}</Card.Title>
          <Card.Text>
            This is a Demo Bio Lorem ipsum dolor sit amet consectetur
            adipisicing elit.
          </Card.Text>
          <Button>
            <NavLink to="/profile">Profile</NavLink>
          </Button>
        </Card.Body>
      </Card>

      <div className="menubar d-block d-sm-none">
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

      <div className="sidebar-btn">
        <Button onClick={toggleDarkMode} className="theme-toggle">
          {isDarkMode ? (
            <>
              <LightModeOutlined />
              <span className="d-none d-md-block">Go Light</span>
            </>
          ) : (
            <>
              <DarkModeOutlined />
              <span className="d-none d-md-block">Go Dark</span>
            </>
          )}
        </Button>
        <div className="sidebar-logout">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
