import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/global/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <ToastContainer className="custom_toast"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        transition:Bounce
      />
      <Outlet />
    </>
  );
};

export default App;
