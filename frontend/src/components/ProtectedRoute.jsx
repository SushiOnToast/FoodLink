import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import tokens from "../constants";
import LoadingIndicator from "./LoadingIndicator";

function ProtectedRoute({ children }) {
  const [isAuthorised, setIsAuthorised] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorised(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(tokens.REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(tokens.ACCESS_TOKEN, res.data.access);
        setIsAuthorised(true);
      } else {
        setIsAuthorised(false);
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      setIsAuthorised(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(tokens.ACCESS_TOKEN);
    if (!token) {
      setIsAuthorised(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorised(true);
    }
  };

  if (isAuthorised === null) {
    return <LoadingIndicator />;
  }

  return isAuthorised ? children : <Navigate to="/landing"/>
}

export default ProtectedRoute
