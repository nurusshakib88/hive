import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Error = () => {
  return (
    <Container>
      <Row className="vh-100 align-items-center">
        <Col lg="12" className="text-center">
          <h1 className="fw-bold">404 ERROR</h1>
          <h3>Page Not Found</h3>
          <NavLink to="/">Back to Home</NavLink>
        </Col>
      </Row>
    </Container>
  );
};

export default Error;
