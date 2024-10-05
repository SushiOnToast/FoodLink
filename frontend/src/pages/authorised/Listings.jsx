import React, { useState, useEffect } from "react";
import MapView from "../../components/MapView";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";
import Listing from "../../components/Listing";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

function Listings() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const username = localStorage.getItem(tokens.USERNAME);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]); // all listings
  const [filteredListings, setFilteredListings] = useState([]); // filtered listings
  const [allFoodTypes, setAllFoodTypes] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonors();
    fetchUserDetails();
    fetchFoodTypes();
    fetchListings();
  }, [username]);

  const fetchFoodTypes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/listings/food_types/");
      setAllFoodTypes(response.data);
    } catch (error) {
      alert(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/users/donors/");
      setDonors(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch donor data.");
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
      setError("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/listings/all");
      setListings(response.data); // store all listings
      setFilteredListings(response.data); // initialize filtered listings with all
    } catch (error) {
      console.error(
        "Error fetching listings:",
        error.response?.data || error.message
      );
      setError("Failed to fetch listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleFoodTypeChange = (id) => {
    const updatedSelectedFoodTypes = selectedFoodTypes.includes(id)
      ? selectedFoodTypes.filter((foodTypeId) => foodTypeId !== id)
      : [...selectedFoodTypes, id];
    
    setSelectedFoodTypes(updatedSelectedFoodTypes);

    // Filter listings based on the selected food types
    if (updatedSelectedFoodTypes.length > 0) {
      const filtered = listings.filter((listing) =>
        listing.food_types.some((foodType) =>
          updatedSelectedFoodTypes.includes(foodType.id)
        )
      );
      setFilteredListings(filtered);
    } else {
      setFilteredListings(listings); // show all if no filter is selected
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Show error if any */}
      <MapView
        latitude={latitude}
        longitude={longitude}
        viewType="DonorMap"
        donorLocations={donors}
      />
      <h2>Listings</h2>
      <MultiSelectDropdown
        items={allFoodTypes}
        selectedItems={selectedFoodTypes}
        onSelectItem={handleFoodTypeChange}
        placeholder="Filter by food type"
      />
      {userRole === "donor" && (
        <button onClick={() => navigate("/listings/yourlistings/")}>
          Your listings
        </button>
      )}
      {filteredListings.length > 0 ? (
        filteredListings
          .slice()
          .reverse()
          .map((listing) => (
            <Listing key={listing.id} listing={listing} onDelete={() => {}} />
          ))
      ) : (
        <p>No listings found.</p>
      )}
    </>
  );
}

export default Listings;
