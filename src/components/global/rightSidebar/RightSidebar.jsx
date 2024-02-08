import React from "react";
import "./RightSidebar.scss";
import AllUsers from "../../allUsers/AllUsers";
import { Container } from "react-bootstrap";

const RightSidebar = () => {
  return (
    <div className="RightSidebar p-xl-3 p-lg-1">
      <h1 className="all-user-header">All the hivers</h1>
      <AllUsers />
    </div>
  );
};

export default RightSidebar;
