import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";
import MapSelector from "../../components/MapSelector";

function EditProfile() {
  const username = localStorage.getItem(tokens.USERNAME);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    username: username,
    about: "",
    latitude: null,
    longitude: null,
    profile_picture: null,
    profile_picture_preview: null, // For preview
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/users/profile/${username}`);
        setFormData({
          first_name: response.data.first_name,
          email: response.data.email,
          username: response.data.username,
          about: response.data.about,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          profile_picture: response.data.profile_picture,
          profile_picture_preview: response.data.profile_picture, // Set preview to current profile picture
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert(`Error fetching profile: ${err.message}`);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0],  // New profile picture
      profile_picture_preview: URL.createObjectURL(e.target.files[0]),  // Update preview
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("first_name", formData.first_name);
      formDataToSubmit.append("username", formData.username);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("about", formData.about);
      formDataToSubmit.append("latitude", formData.latitude);
      formDataToSubmit.append("longitude", formData.longitude);
      if (formData.profile_picture) {
        formDataToSubmit.append("profile_picture", formData.profile_picture);
      }

      await api.put(`/api/users/profile/${username}/edit/`, formDataToSubmit, {
        headers: {"Content-Type": "multipart/form-data"},
      });

      // Update localStorage with new latitude and longitude
      localStorage.setItem(tokens.USER_LATITUDE, formData.latitude);
      localStorage.setItem(tokens.USER_LONGITUDE, formData.longitude);

      alert("Profile updated successfully!");
      navigate(`/profile/${username}/`);
    } catch (err) {
      console.error("Error changing profile:", err);
      alert(`Error changing profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="profile-edit-page">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          disabled
        />
        <br />
        <textarea
          type="textarea"
          name="about"
          value={formData.about || ""}
          onChange={handleChange}
          placeholder="About me"
        />
        <br />
        <h2>Select Location</h2>
        <MapSelector
          setLatitude={(lat) => setFormData({ ...formData, latitude: lat })}
          setLongitude={(lng) => setFormData({ ...formData, longitude: lng })}
          initialLatitude={formData.latitude} // Pass existing latitude
          initialLongitude={formData.longitude} // Pass existing longitude
        />
        <br />
        <h2>Profile Picture</h2>
        {formData.profile_picture_preview && (
          <img
            src={formData.profile_picture_preview}
            alt="Profile Preview"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
        )}
        <input type="file" name="profile_picture" onChange={handleFileChange} />
        <br />
        <button type="submit" disabled={loading}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
