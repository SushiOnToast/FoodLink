import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import RequestForm from "../../components/RequestForm";
import tokens from "../../constants";
import MapView from "../../components/MapView"; // Import the MapView component

function ListingDetails() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  const navigate = useNavigate();

  // Get user latitude and longitude from localStorage
  const userLatitude = parseFloat(localStorage.getItem(tokens.USER_LATITUDE));
  const userLongitude = parseFloat(localStorage.getItem(tokens.USER_LONGITUDE));

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/api/listings/${listingId}`);
      setListing(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`../listings`);
  };

  if (loading) return <LoadingIndicator />;

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

      {listing.food_types && listing.food_types.length > 0 && (
        <div>
          {listing.food_types.map((food_type) => (
            <p key={food_type.id}>{food_type.name}</p>
          ))}
        </div>
      )}

      {userRole === "recipient" && listing.quantity !== 0 && (
        <RequestForm listing={listing} />
      )}

      {/* MapView displaying the user's location and the donor's location */}
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
