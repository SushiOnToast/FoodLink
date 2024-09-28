import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { USERNAME } from "../../constants";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

function ProfileView() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const viewerUsername = localStorage.getItem(USERNAME);
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

  if (loading) return <LoadingIndicator />;

  return (
    <div className="profile-page">
      <div className="profile-details">
        <h1 className="name">
          {user.first_name} {user.last_name}
        </h1>
        <p className="username">@{username}</p>
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
