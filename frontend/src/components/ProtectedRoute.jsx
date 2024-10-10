import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Utility to decode JWT tokens
import api from "../api"; // Import your custom API handler
import tokens from "../constants"; // Constants for token storage keys
import LoadingIndicator from "./LoadingIndicator"; // A component that shows a loading state

function ProtectedRoute({ children }) {
  const [isAuthorised, setIsAuthorised] = useState(null); // State to track if the user is authorized

  // This effect will run once when the component mounts
  useEffect(() => {
    auth().catch(() => setIsAuthorised(false)); // Try to authenticate the user, set unauthorized if it fails
  }, []);

  // Function to refresh the access token if it has expired
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(tokens.REFRESH_TOKEN); // Get the refresh token from localStorage
    try {
      // Send a request to refresh the token
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      // If the refresh is successful, store the new access token
      if (res.status === 200) {
        localStorage.setItem(tokens.ACCESS_TOKEN, res.data.access);
        setIsAuthorised(true); // Set the user as authorized
      } else {
        setIsAuthorised(false); // If the refresh fails, set as unauthorized
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      setIsAuthorised(false); // If there's an error during the refresh, set as unauthorized
    }
  };

  // Function to authenticate the user by checking the token's validity
  const auth = async () => {
    const token = localStorage.getItem(tokens.ACCESS_TOKEN); // Get the access token from localStorage

    if (!token) {
      setIsAuthorised(false); // No token found, set as unauthorized
      return;
    }

    const decoded = jwtDecode(token); // Decode the token to get expiration time
    const tokenExpiration = decoded.exp; // Token's expiration time
    const now = Date.now() / 1000; // Current time in seconds

    // If the token has expired, try to refresh it
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorised(true); // Token is still valid, set as authorized
    }
  };

  // If the authorization status is still being determined, show a loading indicator
  if (isAuthorised === null) {
    return <LoadingIndicator />;
  }

  // If the user is authorized, render the protected content (children), otherwise redirect to the landing page
  return isAuthorised ? children : <Navigate to="/landing" />;
}

export default ProtectedRoute;
