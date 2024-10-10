import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import tokens from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import MapSelector from "./MapSelector";
import { jwtDecode } from "jwt-decode";

// Default fallback coordinates (Hyderabad) if geolocation is unavailable
const DEFAULT_LATITUDE = 17.385044;
const DEFAULT_LONGITUDE = 78.486671;

function Form({ route, method }) {
  // State variables for form fields
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isRecipient, setIsRecipient] = useState(true); // Toggle between recipient and donor
  const [loading, setLoading] = useState(false); // For handling loading state
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);

  const navigate = useNavigate();

  // Fetch the user's current location on component mount
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: userLat, longitude: userLng } = position.coords;
            setLatitude(userLat); // Set user's latitude
            setLongitude(userLng); // Set user's longitude
          },
          () => {
            // Fallback to default coordinates if permission is denied
            setLatitude(DEFAULT_LATITUDE);
            setLongitude(DEFAULT_LONGITUDE);
          }
        );
      } else {
        // Fallback to default if geolocation is not supported
        setLatitude(DEFAULT_LATITUDE);
        setLongitude(DEFAULT_LONGITUDE);
      }
    };

    fetchLocation(); // Call the location fetch function
  }, []);

  // Toggle text for login/register functionality
  const type = method === "login" ? "Login" : "Register";
  const toggleRoute = method === "login" ? "/register" : "/login";
  const toggleName = method === "login" ? "Register" : "Login";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on submit
    setLoading(true); // Set loading state to true

    // Check if passwords match when registering
    if (method === "register" && password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    // Prepare form data for API call
    const data =
      method === "register"
        ? {
            username,
            password,
            email,
            first_name: name,
            role: isRecipient ? "recipient" : "donor", // Role selection
            latitude, // User's selected latitude
            longitude, // User's selected longitude
          }
        : { username, password }; // Only username and password for login

    try {
      // Post data to API
      const res = await api.post(route, data);

      if (method === "login") {
        // Handle login response, storing tokens and user data
        localStorage.setItem(tokens.ACCESS_TOKEN, res.data.access);
        localStorage.setItem(tokens.REFRESH_TOKEN, res.data.refresh);

        const token = localStorage.getItem(tokens.ACCESS_TOKEN);
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        // Store username, user role, and location in localStorage
        localStorage.setItem(tokens.USERNAME, username);
        localStorage.setItem(tokens.USER_ROLE, userRole);
        localStorage.setItem(tokens.USER_LATITUDE, latitude.toString());
        localStorage.setItem(tokens.USER_LONGITUDE, longitude.toString());

        navigate("/"); // Navigate to homepage after login
      } else {
        navigate("/login"); // Navigate to login after registration
      }
    } catch (err) {
      // Handle specific error responses
      if (err.response) {
        switch (err.response.status) {
          case 400:
            alert("Invalid input. Please check your details and try again.");
            break;
          case 401:
            alert("Unauthorized. Please check your credentials.");
            break;
          case 403:
            alert(
              "Access denied. You do not have permission to access this resource."
            );
            break;
          case 404:
            alert("Resource not found. Please try again later.");
            break;
          case 500:
            alert("Server error. Please try again later.");
            break;
          default:
            alert("An unexpected error occurred. Please try again.");
        }
      } else {
        // Generic error message for other issues (e.g., network problems)
        alert(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      }
    } finally {
      setLoading(false); // Turn off loading state
    }
  };

  if (loading) return <LoadingIndicator />; // Show loading indicator when in loading state

  return (
    <div className="login-register-page">
      <h1 className="form-title">{type}</h1>
      <p className="or">or</p>
      <button
        type="button"
        className="toggle-button"
        onClick={() => navigate(toggleRoute)} // Toggle between login and register
      >
        {toggleName}
      </button>
      <form onSubmit={handleSubmit} className="form-container">
        {type === "Register" && (
          <>
            {/* Role selection: Recipient or Donor */}
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
            {/* Name field for registration */}
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
        {/* Username field for both login and registration */}
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
            {/* Email field for registration */}
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
            {/* Map selector for choosing user's location */}
            <MapSelector
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              initialLatitude={latitude} // Pass initial latitude
              initialLongitude={longitude} // Pass initial longitude
            />
            <br />
            <br />
          </>
        )}
        <br />
        {/* Password fields */}
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
            {/* Confirm password for registration */}
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
        {/* Submit button */}
        <button className="form-button" type="submit" disabled={loading}>
          {type}
        </button>
      </form>
    </div>
  );
}

export default Form;
