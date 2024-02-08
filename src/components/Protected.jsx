import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./global/sidebar/Sidebar";
import RightSidebar from "./global/rightSidebar/RightSidebar";
import Header from "./global/header/Header";
import { Col, Container, Row } from "react-bootstrap";

const Protected = () => {
  const token = localStorage.getItem("token");

  return token ? (
    <Container fluid>
      {/* <Header /> */}
      <Row className="gx-xl-4 gx-lg-2 gx-1 ">
        <Col lg="12">
          <Header />
        </Col>
        <Col lg="3" sm="2">
          <Sidebar />
        </Col>
        <Col
          className="main-content"
          lg="6"
          sm="8"
          xs="10"
          style={{ maxHeight: "88vh", overflowY: "auto" }}
        >
          <Outlet />
        </Col>

        <Col lg="3" xs="2">
          <RightSidebar />
        </Col>
      </Row>
    </Container>
  ) : (
    <Navigate to="/login" />
  );
};

export default Protected;
