import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { jwtDecode } from "jwt-decode";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const type = method === "login" ? "Login" : "Register";
  const toggleRoute = method === "login" ? "/register" : "/login";
  const toggleName = method === "login" ? "Register" : "Login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (method === "register" && password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    const data =
      method === "register"
        ? {
            username,
            password,
            email,
            first_name: firstName,
            last_name: lastName,
          }
        : { username, password };

    try {
      const res = await api.post(route, data);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        const decodedToken = jwtDecode(localStorage.getItem(ACCESS_TOKEN));
        localStorage.setItem(USERNAME, username);

        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="login-register-page">
      <h1 className="form-title">{type}</h1>
      <p className="or">or</p>
      <button
        type="button"
        className="toggle-button"
        onClick={() => navigate(toggleRoute)}
      >
        {toggleName}
      </button>
      <form onSubmit={handleSubmit} className="form-container">
        {type === "Register" && (
          <>
            <input
              className="form-input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
            />
            <input
              className="form-input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </>
        )}
        <br />
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <br />
        {type === "Register" && (
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        )}
        <br />
        <input
          className="form-input password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {type === "Register" && (
          <>
            <br />
            <input
              className="form-input password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </>
        )}
        <br />
        <button className="form-button" type="submit" disabled={loading}>
          {type}
        </button>
      </form>
    </div>
  );
}
export default Form;
