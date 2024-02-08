import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/Setup";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./Login.scss";
import GoogleIcon from "../../assets/google.png";
import { ToastContainer, toast } from "react-toastify";

const login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true); // Start loading
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Check if the user already exists in Firestore using their email
      const userDocRef = collection(db, "users");
      const querySnapshot = await getDocs(
        query(userDocRef, where("email", "==", user.email))
      );

      if (querySnapshot.empty) {
        // User does not exist, add user data to Firestore
        await addDoc(collection(db, "users"), {
          userId: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        });
      }
      navigate("/");
      toast.success("Successfully Logged in");
    } catch (error) {
      toast.error("Something Went Wrong!!");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Start loading
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      toast.success("Successfully Logged in");
    } catch (error) {
      toast.error("Wrong Username or Password!!");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return !token ? (
    <div className="login-page">
      <Container>
        <Row className="vh-100 align-items-center justify-content-center position-relative">
          <Col lg="6" md="5" className="d-none d-md-block">
            <div className="login-text me-5 pe-5">
              <span className="free">Join For Free</span>
              <h1>Welcome</h1>
              <h2>
                To the World Of <span>Hive</span>rs
              </h2>
              <h3>Join Now It's Free</h3>
            </div>
          </Col>
          <Col lg="6" md="7">
            <div className="login">
              <h1 className="login-header">Login</h1>

              <form onSubmit={handleSubmit} className="login-form">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Enter Your Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
              {/* Google login button */}
              <Button
                onClick={handleGoogleSignIn}
                className="google-login-button"
                disabled={loading}
              >
                <img src={GoogleIcon} className="img-fluid" alt="" /> Login with
                Google
              </Button>

              <p className="login-link">
                Need to Signup? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default login;
