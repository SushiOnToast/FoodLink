import React, { useState, useEffect } from "react";
import MapView from "../../../components/MapView";
import api from "../../../api";
import LoadingIndicator from "../../../components/LoadingIndicator";
import tokens from "../../../constants";
import Listing from "../../../components/Listing";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

function Listings() {
  const [donors, setDonors] = useState([]); // Store donor data
  const [loading, setLoading] = useState(false); // Loading state
  const [user, setUser] = useState({}); // User data
  const username = localStorage.getItem(tokens.USERNAME); // Current username from localStorage
  const [latitude, setLatitude] = useState(null); // User's latitude
  const [longitude, setLongitude] = useState(null); // User's longitude
  const [error, setError] = useState(null); // Error state
  const [listings, setListings] = useState([]); // All listings
  const [filteredListings, setFilteredListings] = useState([]); // Filtered listings based on user input
  const [allFoodTypes, setAllFoodTypes] = useState([]); // Available food types
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]); // Selected food types for filtering
  const [minQuantity, setMinQuantity] = useState(0); // Minimum quantity filter
  const [maxQuantity, setMaxQuantity] = useState(100); // Maximum quantity filter
  const userRole = localStorage.getItem(tokens.USER_ROLE); // User role
  const navigate = useNavigate(); // Navigation function

  // Fetch initial data when the component mounts or when username changes
  useEffect(() => {
    fetchData();
  }, [username]);

  // Re-filter listings whenever relevant state changes
  useEffect(() => {
    filterListings();
  }, [listings, selectedFoodTypes, minQuantity, maxQuantity]);

  // Fetch all required data (donors, user details, food types, and listings)
  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      await Promise.all([
        fetchDonors(),
        fetchUserDetails(),
        fetchFoodTypes(),
        fetchListings(),
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setError("Failed to fetch initial data. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch food types for filtering options
  const fetchFoodTypes = async () => {
    try {
      const response = await api.get("/api/listings/food_types/");
      setAllFoodTypes(response.data); // Set available food types
    } catch (error) {
      console.error("Error fetching food types:", error);
      setError("Failed to fetch food types. Please try again.");
    }
  };

  // Fetch donor data
  const fetchDonors = async () => {
    try {
      const response = await api.get("/api/users/donors/");
      setDonors(response.data); // Set donors
    } catch (error) {
      console.error("Error fetching donors:", error);
      setError("Failed to fetch donor data. Please try again.");
    }
  };

  // Fetch user details including location
  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/api/users/profile/${username}/`);
      const userData = response.data;
      setUser(userData);
      setLatitude(userData.latitude);
      setLongitude(userData.longitude);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch your profile. Please try again.");
    }
  };

  // Fetch all listings available
  const fetchListings = async () => {
    try {
      const response = await api.get("/api/listings/all/");
      setListings(response.data); // Set all listings
      setFilteredListings(response.data); // Initialize filtered listings
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to fetch listings. Please try again.");
    }
  };

  // Filter listings based on selected food types and quantity range
  const filterListings = () => {
    const filteredByQuantity = listings.filter(
      (listing) =>
        listing.quantity >= minQuantity && listing.quantity <= maxQuantity
    );

    // Filter by food types if any are selected
    const filteredByFoodTypes = selectedFoodTypes.length
      ? filteredByQuantity.filter((listing) =>
          listing.food_types.some((foodType) =>
            selectedFoodTypes.includes(foodType.id)
          )
        )
      : filteredByQuantity;

    setFilteredListings(filteredByFoodTypes); // Update filtered listings
  };

  // Handle food type selection changes
  const handleFoodTypeChange = (id) => {
    setSelectedFoodTypes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((foodTypeId) => foodTypeId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle changes to minimum quantity filter
  const handleMinQuantityChange = (e) => {
    setMinQuantity(parseInt(e.target.value) || 0); // Default to 0 if invalid
  };

  // Handle changes to maximum quantity filter
  const handleMaxQuantityChange = (e) => {
    setMaxQuantity(parseInt(e.target.value) || 100); // Default to 100 if invalid
  };

  // Handle listing deletion
  const handleDeleteListing = async (listingId) => {
    try {
      await api.delete(`/api/listings/delete/${listingId}/`);
      // Update the listings state to remove the deleted listing
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== listingId)
      );
      setFilteredListings((prevFiltered) =>
        prevFiltered.filter((listing) => listing.id !== listingId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
      setError("Failed to delete the listing. Please try again.");
    }
  };

  // Show loading indicator if data is being fetched
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Display error messages */}
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
      <input
        type="number"
        value={minQuantity}
        onChange={handleMinQuantityChange}
        placeholder="Select min quantity for filter"
      />
      <input
        type="number"
        value={maxQuantity}
        onChange={handleMaxQuantityChange}
        placeholder="Select max quantity for filter"
      />
      {userRole === "donor" && (
        <button onClick={() => navigate("/listings/yourlistings/")}>
          Your Listings
        </button>
      )}
      {filteredListings.length > 0 ? (
        filteredListings
          .slice() // Create a copy of the array
          .reverse() // Reverse for latest first
          .map((listing) => (
            <Listing
              key={listing.id}
              listing={listing}
              onDelete={handleDeleteListing}
            />
          ))
      ) : (
        <p>No listings found.</p> // Message if no listings match the filter
      )}
    </>
  );
}

export default Listings;
