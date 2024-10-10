import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import tokens from "../constants";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem(tokens.USERNAME);

  return (
    <div className="nav-container">
      <nav className="navbar-home">
        <div className="foodLink">FoodLink</div>
        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to={`/profile/${username}`} className="nav-link">
            Profile
          </NavLink>
          <NavLink to={`/listings`} className="nav-link">
            Listings
          </NavLink>
          <NavLink to={`/resources`} className="nav-link">
            Resources
          </NavLink>
        </div>
        <button className="logout-button" onClick={() => navigate("/logout")}>
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
