import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import tokens from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import MapSelector from "./MapSelector";
import { jwtDecode } from "jwt-decode";

const DEFAULT_LATITUDE = 17.385044; // Fallback latitude (Hyderabad)
const DEFAULT_LONGITUDE = 78.486671; // Fallback longitude (Hyderabad)

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isRecipient, setIsRecipient] = useState(true);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: userLat, longitude: userLng } = position.coords;
            setLatitude(userLat);
            setLongitude(userLng);
          },
          () => {
            // If the user denies permission, fall back to default coordinates
            setLatitude(DEFAULT_LATITUDE);
            setLongitude(DEFAULT_LONGITUDE);
          }
        );
      } else {
        // Fallback if geolocation is not supported
        setLatitude(DEFAULT_LATITUDE);
        setLongitude(DEFAULT_LONGITUDE);
      }
    };

    fetchLocation(); // Call the fetchLocation function
  }, []); // Empty dependency array to run once on mount

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
            first_name: name,
            role: isRecipient ? "recipient" : "donor",
            latitude,
            longitude,
          }
        : { username, password };

    console.log(data);

    try {
      const res = await api.post(route, data);

      if (method === "login") {
        localStorage.setItem(tokens.ACCESS_TOKEN, res.data.access);
        localStorage.setItem(tokens.REFRESH_TOKEN, res.data.refresh);

        const token = localStorage.getItem(tokens.ACCESS_TOKEN);
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        localStorage.setItem(tokens.USERNAME, username);
        localStorage.setItem(tokens.USER_ROLE, userRole);

        // Storing the user's latitude and longitude in localStorage
        localStorage.setItem(tokens.USER_LATITUDE, latitude.toString());
        localStorage.setItem(tokens.USER_LONGITUDE, longitude.toString());

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
            <div id="role-selector">
              <label>
                <input
                  className="role"
                  type="radio"
                  checked={isRecipient}
                  onChange={() => setIsRecipient(true)}
                />
                Recipient
              </label>
              <label>
                <input
                  className="role"
                  type="radio"
                  checked={!isRecipient}
                  onChange={() => setIsRecipient(false)}
                />
                Donor
              </label>
            </div>
            <br />
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
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
          <>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <br />
            <br />
            <h2>Select Location</h2>
            <MapSelector
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              initialLatitude={latitude} // Pass the latitude to MapSelector
              initialLongitude={longitude} // Pass the longitude to MapSelector
            />
            <br />
            <br />
          </>
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
