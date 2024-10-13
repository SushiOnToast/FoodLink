import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import tokens from "../../constants";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import MapView from "../../components/MapView";
import Listing from "../../components/Listing"; // Assuming you have a component to display individual listings
import "../../styles/ProfileView.css";

// Constants for fallback values
const DEFAULT_PROFILE_PICTURE = "/media/profile_pictures/default.jpg";

// Hook for fetching user data
const useFetchUserData = (username) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/users/profile/${username}/`);
      setUser(response.data);
    } catch (error) {
      setError("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  return { user, loading, error };
};

// Hook for fetching donor listings
const useFetchUserListings = (username) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/listings/${username}/`);
      setListings(response.data);
    } catch (error) {
      setError("Failed to fetch listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchListings();
    }
  }, [username]);

  return { listings, loading, error };
};

function ProfileView() {
  const { username } = useParams();
  const viewerUsername = localStorage.getItem(tokens.USERNAME);
  const navigate = useNavigate();
  const { user, loading, error } = useFetchUserData(username);
  const { listings, loading: listingsLoading, error: listingsError } = useFetchUserListings(username);

  const profilePictureUrl = user.profile_picture || DEFAULT_PROFILE_PICTURE; // Fallback to default

  if (loading || listingsLoading) return <LoadingIndicator />;
  if (error || listingsError) return <p>{error || listingsError}</p>;

  return (
    <div className="profile-page">
      <div className="profile-details">
        <div id="basic-details">
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="profile-picture"
          />
          <h1 className="name">{user.first_name}</h1>
          <p className="username">@{username}</p>
          <p className="role">{user.role}</p>
          <br />
          {viewerUsername === username && (
            <button
              className="edit-profile"
              onClick={() => navigate("/profile/edit/")}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div id="longer-details">
          <div className="about">
            <h2>About me</h2>
            <p>{user.about}</p>
          </div>

          {/* Map container styling */}
          <div className="map-container">
            <MapView latitude={user.latitude} longitude={user.longitude} />
          </div>
        </div>
      </div>

      {/* Show listings if the user is a donor */}
      {user.role === "donor" && (
        <div className="profile-listings">
          <h1>Listings</h1>
          <div className="listings-grid">
            {listings.length > 0 ? (
              listings.map((listing) => (
                <Listing key={listing.id} listing={listing} />
              ))
            ) : (
              <p>This donor has no listings yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileView;
