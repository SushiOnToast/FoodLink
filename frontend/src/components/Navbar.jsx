import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { USERNAME } from "../constants";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem(USERNAME);

  return (
    <div className="nav-container">
      <nav className="navbar-home">
        <div>FoodLink</div>
        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to={`/profile/${username}`} className="nav-link">
            Profile
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
