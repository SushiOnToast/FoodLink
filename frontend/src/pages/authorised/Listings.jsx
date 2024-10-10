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
  const [listings, setListings] = useState([]); // All listings
  const [filteredListings, setFilteredListings] = useState([]); // Filtered listings
  const [allFoodTypes, setAllFoodTypes] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(100);
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching data...");
    fetchDonors();
    fetchUserDetails();
    fetchFoodTypes();
    fetchListings();
  }, [username]);

  useEffect(() => {
    filterListings(); // Re-filter whenever listings or selected food types change
  }, [listings, selectedFoodTypes, minQuantity, maxQuantity]);

  const fetchFoodTypes = async () => {
    setLoading(true);
    try {
      console.log("Fetching food types...");
      const response = await api.get("/api/listings/food_types/");
      setAllFoodTypes(response.data);
      console.log("Food types fetched:", response.data);
    } catch (error) {
      alert(error);
      console.log("Error fetching food types:", error);
      setError("Failed to fetch food types.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    setLoading(true);
    try {
      console.log("Fetching donor data...");
      const response = await api.get("/api/users/donors/");
      setDonors(response.data);
      console.log("Donor data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching donors:", error);
      setError("Failed to fetch donor data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      console.log("Fetching user details for:", username);
      const response = await api.get(`/api/users/profile/${username}/`);
      const userData = response.data;
      setUser(userData);
      setLatitude(userData.latitude);
      setLongitude(userData.longitude);
      console.log("User details fetched:", userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      console.log("Fetching listings...");
      const response = await api.get("/api/listings/all");
      setListings(response.data);
      setFilteredListings(response.data); // Initialize filtered listings
      console.log("Listings fetched:", response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to fetch listings.");
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    console.log("Filtering listings...");

    // If no quantity range is set, reset filtered listings to all listings
    const filteredByQuantity = listings.filter((listing) => {
      const isInQuantityRange =
        listing.quantity >= minQuantity && listing.quantity <= maxQuantity;

      console.log(
        `Listing ID: ${listing.id}, Quantity: ${listing.quantity}, In Range: ${isInQuantityRange}`
      );

      return isInQuantityRange;
    });

    // If no food types are selected, reset filtered listings to the ones filtered by quantity
    if (selectedFoodTypes.length === 0) {
      setFilteredListings(filteredByQuantity);
      return;
    }

    const filtered = filteredByQuantity.filter((listing) => {
      // Check for food type matches
      const isInSelectedFoodTypes = listing.food_types.some((foodType) =>
        selectedFoodTypes.includes(foodType.id)
      );

      console.log(
        `Listing ID: ${listing.id}, Food Types Match: ${isInSelectedFoodTypes}`
      );

      // Return true only if both checks pass
      return isInSelectedFoodTypes;
    });

    setFilteredListings(filtered);
    console.log("Filtered listings:", filtered);
  };

  const handleFoodTypeChange = (id) => {
    const updatedSelectedFoodTypes = selectedFoodTypes.includes(id)
      ? selectedFoodTypes.filter((foodTypeId) => foodTypeId !== id)
      : [...selectedFoodTypes, id];

    setSelectedFoodTypes(updatedSelectedFoodTypes);
    console.log("Selected Food Types:", updatedSelectedFoodTypes);
  };

  const handleMinQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0; // Default to 0 if NaN
    setMinQuantity(value);
    console.log("Min Quantity changed to:", value);
  };

  const handleMaxQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 100; // Default to 100 if NaN
    setMaxQuantity(value);
    console.log("Max Quantity changed to:", value);
  };

  const handleDeleteListing = async (listingId) => {
    try {
      console.log("Deleting listing with ID:", listingId);
      await api.delete(`/api/listings/delete/${listingId}/`);
      // Remove deleted listing from state
      setListings(listings.filter((listing) => listing.id !== listingId));
      setFilteredListings(
        filteredListings.filter((listing) => listing.id !== listingId)
      );
      console.log("Listing deleted successfully");
    } catch (error) {
      console.error("Error deleting listing:", error);
      setError("Failed to delete the listing.");
    }
  };

  if (loading) {
    console.log("Loading...");
    return <LoadingIndicator />;
  }

  return (
    <>
      {error && <div className="error-message">{error}</div>}
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
          Your listings
        </button>
      )}
      {filteredListings.length > 0 ? (
        filteredListings
          .slice()
          .reverse()
          .map((listing) => (
            <Listing
              key={listing.id}
              listing={listing}
              onDelete={handleDeleteListing}
            />
          ))
      ) : (
        <p>No listings found.</p>
      )}
    </>
  );
}

export default Listings;
