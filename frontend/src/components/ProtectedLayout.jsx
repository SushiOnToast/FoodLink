import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * ProtectedLayout component serves as a layout wrapper for protected routes.
 *
 * @returns {JSX.Element} The ProtectedLayout component.
 */
const ProtectedLayout = () => {
  return (
    <>
      {/* Render the Navbar component */}
      <Navbar />
      {/* Render child routes */}
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
