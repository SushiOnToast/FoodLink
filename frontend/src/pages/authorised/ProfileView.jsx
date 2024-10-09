import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import tokens from "../../constants";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import MapView from "../../components/MapView";

function ProfileView() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const viewerUsername = localStorage.getItem(tokens.USERNAME);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/users/profile/${username}/`);
        setUser(response.data);
      } catch (error) {
        alert("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const profilePictureUrl =
    user.profile_picture || "/media/profile_pictures/default.jpg"; // Fallback to default

  if (loading) return <LoadingIndicator />;

  return (
    <div className="profile-page">
      <div className="profile-details">
        <img
          src={profilePictureUrl}
          alt="Profile"
          className="profile-picture"
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
        <h1 className="name">{user.first_name}</h1>
        <p className="username">@{username}</p>
        <p className="role">{user.role}</p>
        <p className="about">{user.about}</p>
        <MapView latitude={user.latitude} longitude={user.longitude} />
        {viewerUsername === username && (
          <button
            className="edit-profile"
            onClick={() => navigate("/profile/edit/")}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileView;
