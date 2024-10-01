import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import { USERNAME } from "../../constants";
import MapSelector from "../../components/MapSelector";

function EditProfile() {
  const username = localStorage.getItem(USERNAME);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    username: "",
    about: "",
    latitude: null, 
    longitude: null, 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/api/users/profile/${username}/edit/`, {
        ...formData,
        latitude: formData.latitude, 
        longitude: formData.longitude, 
      });
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
          value={formData.about}
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
        <button type="submit" disabled={loading}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
