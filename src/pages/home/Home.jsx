import React, { useState } from "react";
import Posts from "../../components/posts/Posts";
import Logout from "../../components/logout/Logout";
import AllUsers from "../../components/allUsers/AllUsers";
import { Container } from "react-bootstrap";
import UserStories from "../../components/userStories/UserStories";
const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <Container fluid>
      <UserStories />

      <Posts />
    </Container>
  );
};

export default Home;
