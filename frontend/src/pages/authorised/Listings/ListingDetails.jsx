import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import LoadingIndicator from "../../../components/LoadingIndicator";
import RequestForm from "../../../components/RequestForm";
import tokens from "../../../constants";
import MapView from "../../../components/MapView";
import "../../../styles/ListingDetails.css";

function ListingDetails() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  const navigate = useNavigate();
  const viewerUsername = localStorage.getItem(tokens.USERNAME);

  const userLatitude = parseFloat(localStorage.getItem(tokens.USER_LATITUDE));
  const userLongitude = parseFloat(localStorage.getItem(tokens.USER_LONGITUDE));

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/api/listings/${listingId}/`);
      setListing(response.data);
    } catch (error) {
      console.error("Error fetching listing:", error);
      alert("Failed to load listing details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate("../listings");
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await api.delete(`/api/listings/delete/${listingId}/`);
      navigate("../listings");
    } catch (error) {
      console.error(
        "Error deleting listing:",
        error.response?.data || error.message
      );
      alert("Failed to delete the listing. Please try again later.");
    }
  };

  if (loading) return <LoadingIndicator />;
  if (!listing) return <div>No listing found.</div>;

  const isOwner = listing.donor_username === viewerUsername;

  return (
    <div className="listing-details-container">
      <button className="back-button" onClick={handleClick}>
        Back to listings
      </button>

      <div className="listing-card">
        {listing.cover_image && (
          <img
            src={listing.cover_image}
            alt={listing.name}
            className="listing-image-details"
          />
        )}

        <div className="listing-content">
          <div className="normal-info">
            <div>
              <h2>{listing.name}</h2>
              <p>Quantity: {listing.quantity}</p>
              <p>Special notes:</p>
              <p>{listing.special_notes}</p>

              {listing.food_types && listing.food_types.length > 0 && (
                <div className="food-types">
                  {listing.food_types.map((food_type) => (
                    <span key={food_type.id} className="food-type">
                      {food_type.name}
                    </span>
                  ))}
                </div>
              )}

              {isOwner && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/listings/${listing.id}/edit`);
                    }}
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteListing(listing.id);
                    }}
                  >
                    Delete Listing
                  </button>
                </>
              )}
            </div>

            {userRole === "recipient" && listing.quantity > 0 && (
              <RequestForm listing={listing} />
            )}
          </div>

          <div className="map-container">
            <MapView
              latitude={userLatitude}
              longitude={userLongitude}
              listingLatitude={listing.listing_latitude}
              listingLongitude={listing.listing_longitude}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
