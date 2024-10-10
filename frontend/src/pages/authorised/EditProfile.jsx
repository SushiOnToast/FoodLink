import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";
import MapSelector from "../../components/MapSelector";
import "../../styles/EditProfile.css";

function EditProfile() {
  const username = localStorage.getItem(tokens.USERNAME); // Get the current username from local storage
  const navigate = useNavigate(); // Hook for navigation
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [formData, setFormData] = useState({
    first_name: "",
    username: username,
    email: "",
    about: "",
    latitude: null,
    longitude: null,
    profile_picture: null,
    profile_picture_preview: null, // For previewing the uploaded profile picture
  });

  useEffect(() => {
    // Fetch the user's profile data on component mount
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/users/profile/${username}/`);
        // Update formData with fetched profile details
        setFormData({
          first_name: response.data.first_name,
          username: response.data.username,
          email: response.data.email,
          about: response.data.about,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          profile_picture: response.data.profile_picture,
          profile_picture_preview: response.data.profile_picture, // Set preview to current profile picture
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert(`Failed to fetch profile: ${err.message}`); // User-friendly error message
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile picture file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setFormData({
      ...formData,
      profile_picture: file, // Update profile picture state
      profile_picture_preview: URL.createObjectURL(file), // Create a preview URL for the selected file
    });
  };

  // Handle form submission to update the profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state

    try {
      const formDataToSubmit = new FormData(); // Create FormData object to handle form submission
      formDataToSubmit.append("first_name", formData.first_name);
      formDataToSubmit.append("username", formData.username);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("about", formData.about);
      formDataToSubmit.append("latitude", formData.latitude);
      formDataToSubmit.append("longitude", formData.longitude);

      // Append profile picture if a new one is selected
      if (
        formData.profile_picture &&
        formData.profile_picture !== formData.profile_picture_preview
      ) {
        formDataToSubmit.append("profile_picture", formData.profile_picture);
      }

      // Make API request to update the user's profile
      await api.put(`/api/users/profile/${username}/edit/`, formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update localStorage with new latitude and longitude
      localStorage.setItem(tokens.USER_LATITUDE, formData.latitude);
      localStorage.setItem(tokens.USER_LONGITUDE, formData.longitude);

      alert("Profile updated successfully!"); // Notify user of successful update
      navigate(`/profile/${username}/`); // Navigate to the user's profile
    } catch (err) {
      console.error("Error changing profile:", err);
      alert(`Failed to update profile: ${err.message}`); // User-friendly error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Show loading indicator while data is being fetched
  if (loading) return <LoadingIndicator />;

  return (
    <div className="profile-edit-page">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Input for first name */}
        <label htmlFor="first_name">Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Name"
          required // Required field for validation
        />
        {/* Input for email */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required // Required field for validation
        />
        {/* Input for username (disabled as it shouldn't be changed) */}
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          disabled
        />
        <br />
        {/* Textarea for 'about' section */}
        <label htmlFor="about">About me</label>
        <textarea
          name="about"
          value={formData.about || ""}
          onChange={handleChange}
          placeholder="About me"
        />
        <br />
        <h2>Edit Location</h2>
        {/* Map selector for location input */}
        <div className="map-container">
          <MapSelector
            setLatitude={(lat) => setFormData({ ...formData, latitude: lat })}
            setLongitude={(lng) => setFormData({ ...formData, longitude: lng })}
            initialLatitude={formData.latitude} // Pass existing latitude
            initialLongitude={formData.longitude} // Pass existing longitude
          />
        </div>

        <br />
        <h2>Edit Profile Picture</h2>
        {/* Display profile picture preview if available */}
        {formData.profile_picture_preview && (
          <img
            src={formData.profile_picture_preview}
            alt="Profile Preview"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
        )}
        {/* Input for file selection */}
        <input type="file" name="profile_picture" onChange={handleFileChange} />
        <br />
        {/* Submit button */}
        <button type="submit" disabled={loading}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
