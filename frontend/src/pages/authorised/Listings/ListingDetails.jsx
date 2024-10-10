import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import LoadingIndicator from "../../../components/LoadingIndicator";
import RequestForm from "../../../components/RequestForm";
import tokens from "../../../constants";
import MapView from "../../../components/MapView"; // Import the MapView component

function ListingDetails() {
  const { listingId } = useParams(); // Get the listing ID from the URL parameters
  const [listing, setListing] = useState(null); // State for storing the listing data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const userRole = localStorage.getItem(tokens.USER_ROLE); // Retrieve user role from local storage
  const navigate = useNavigate(); // Hook for programmatic navigation
  const viewerUsername = localStorage.getItem(tokens.USERNAME); // Retrieve the username of the viewer

  // Get user latitude and longitude from localStorage
  const userLatitude = parseFloat(localStorage.getItem(tokens.USER_LATITUDE));
  const userLongitude = parseFloat(localStorage.getItem(tokens.USER_LONGITUDE));

  // Fetch the listing details when the component mounts or the listingId changes
  useEffect(() => {
    fetchListing();
  }, [listingId]);

  // Function to fetch listing details from the API
  const fetchListing = async () => {
    try {
      const response = await api.get(`/api/listings/${listingId}/`);
      setListing(response.data); // Set the fetched listing data to state
    } catch (error) {
      console.error("Error fetching listing:", error);
      alert("Failed to load listing details. Please try again later."); // User-friendly error message
    } finally {
      setLoading(false); // Update loading state
    }
  };

  // Navigate back to the listings page
  const handleClick = () => {
    navigate("../listings");
  };

  // Function to delete the listing
  const handleDeleteListing = async (listingId) => {
    try {
      await api.delete(`/api/listings/delete/${listingId}/`);
      navigate("../listings"); // Navigate back after deletion
    } catch (error) {
      console.error(
        "Error deleting listing:",
        error.response?.data || error.message
      );
      alert("Failed to delete the listing. Please try again later."); // User-friendly error message
    }
  };

  // Show loading indicator while fetching data
  if (loading) return <LoadingIndicator />;

  // Display a message if no listing is found
  if (!listing) return <div>No listing found.</div>;

  // Check if the viewer is the owner of the listing
  const isOwner = listing.donor_username === viewerUsername;

  return (
    <div>
      <button onClick={handleClick}>Back to listings</button>
      {listing.cover_image && (
        <img
          src={listing.cover_image} // Display cover image
          alt={listing.name}
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      )}
      <h2>{listing.name}</h2>
      <p>Quantity: {listing.quantity}</p>
      <p>Special notes:</p>
      <p>{listing.special_notes}</p>

      {/* Display food types if available */}
      {listing.food_types && listing.food_types.length > 0 && (
        <div>
          {listing.food_types.map((food_type) => (
            <p key={food_type.id}>{food_type.name}</p>
          ))}
        </div>
      )}

      {/* Show edit and delete buttons for the owner of the listing */}
      {isOwner && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling up
              navigate(`/listings/${listing.id}/edit`); // Navigate to edit page
            }}
          >
            Edit Listing
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling up
              handleDeleteListing(listing.id); // Call the delete function
            }}
          >
            Delete listing
          </button>
        </>
      )}

      {/* Show request form if the user is a recipient and the quantity is available */}
      {userRole === "recipient" && listing.quantity > 0 && (
        <RequestForm listing={listing} />
      )}

      {/* MapView displaying the user's and donor's location */}
      <MapView
        latitude={userLatitude} // User's latitude from localStorage
        longitude={userLongitude} // User's longitude from localStorage
        listingLatitude={listing.listing_latitude} // Donor's latitude from listing
        listingLongitude={listing.listing_longitude} // Donor's longitude from listing
        showRoute={true} // Show route between user and donor
      />
    </div>
  );
}

export default ListingDetails;
