import React, { useState, useEffect } from "react";
import MapView from "../../components/MapView";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import { USERNAME } from "../../constants";

function Listings() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const username = localStorage.getItem(USERNAME);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    fetchDonors();
    fetchUserDetails();
    console.log(donors);
    console.log(user);
  }, [username]); // Added username as dependency in useEffect

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/users/donors/");
      setDonors(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch donor data."); // Handle error more gracefully
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/users/profile/${username}/`);
      const userData = response.data;
      setUser(userData);
      setLatitude(userData.latitude);
      setLongitude(userData.longitude);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch user details."); // Handle error more gracefully
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <>
      {error && <div className="error-message">{error}</div>} {/* Show error if any */}
      <MapView
        latitude={latitude}
        longitude={longitude}
        viewType="DonorMap"
        donorLocations={donors}
      />
    </>
  );
}

export default Listings;
