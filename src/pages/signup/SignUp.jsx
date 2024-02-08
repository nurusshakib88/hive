import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase/Setup";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./Signup.scss";
import { toast } from "react-toastify";

const SignUp = () => {
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null); // New state for the user image
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true); // Start loading
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Upload user image to Firebase Storage
      let imageUrl = "";
      if (image) {
        const name = new Date().getTime() + image.name;
        const storageRef = ref(storage, name);
        const uploadTask = uploadBytesResumable(storageRef, image);
        const uploadSnapshot = await uploadTask;
        imageUrl = await getDownloadURL(uploadSnapshot.ref);
      }

      // Set display name and photo URL for the user
      await updateProfile(userCredential.user, {
        displayName: displayName,
        photoURL: imageUrl, // Set the user's photo URL
      });

      const user = userCredential.user;

      // Add user data to Firestore
      const userDocRef = await addDoc(collection(db, "users"), {
        userId: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: imageUrl, // Save the user's photo URL in Firestore
        // Add other user-related data as needed
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userDocId", userDocRef.id); // Store the user document ID

      navigate("/");
      toast.success("Successfully Signed Up !!");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return !token ? (
    <div className="signup-page">
      <Container>
        <Row className="vh-100 align-items-center justify-content-center position-relative">
          <Col lg="6" md="5" className="d-none d-md-block">
            <div className="signup-text me-5 pe-5">
              <span className="free">Join For Free</span>
              <h1>Welcome</h1>
              <h2>
                To the World Of <span>Hive</span>rs
              </h2>
              <h3>Join Now It's Free</h3>
            </div>
          </Col>
          <Col lg="6" md="7">
            <div className="signup">
              <h1 className="signup-header">Signup</h1>

              <form onSubmit={handleSubmit} className="signup-form">
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
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
                <label
                  id="customFileLabel"
                  className="custom-file-label"
                  htmlFor="customFileInput"
                >
                  {!image ? <>Choose File</> : image.name}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="customFileInput"
                  className="custom-file-input"
                  required
                />

                <Button
                  type="submit"
                  className="signup-button"
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Signup"}
                </Button>
              </form>

              <p className="signup-link">
                Need to Login? <Link to="/login">Login</Link>
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

export default SignUp;
