import React from "react";
import { auth } from "../../firebase/Setup";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { LogoutOutlined } from "@mui/icons-material";
import { Button } from "react-bootstrap";
import "./Logout.scss";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    toast.info("You've Logged Out !!");
  };
  return (
    <Button className="logout-btn" onClick={handleLogout}>
      <LogoutOutlined /> <span>Log Out</span>
    </Button>
  );
};

export default Logout;
