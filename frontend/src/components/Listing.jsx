import React from "react";
import tokens from "../constants";
import { useNavigate } from "react-router-dom";
import "../styles/Listing.css";

function Listing({ listing, onDelete, DonorListingsPage }) {
  const formattedDate = new Date(listing.created_at).toLocaleDateString(
    "en-US"
  );
  const viewerUsername = localStorage.getItem(tokens.USERNAME);
  const isOwner = listing.donor_username === viewerUsername;
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL;
  const imageUrl = DonorListingsPage
    ? listing.cover_image
    : `${baseUrl}${listing.cover_image}`;

  const handleClick = () => {
    navigate(`/listings/${listing.id}/`);
  };

  return (
    <div onClick={handleClick} className="listing-card">
      {listing.cover_image && (
        <img src={imageUrl} alt={listing.name} className="listing-image" />
      )}
      <div className="listing-content">
        <h3>{listing.name}</h3>
        {listing.food_types && listing.food_types.length > 0 && (
          <div className="food-types">
            {listing.food_types.map((food_type) => (
              <span key={food_type.id} className="food-type">
                {food_type.name}
              </span>
            ))}
          </div>
        )}
        <small>
          Created on <i>{formattedDate}</i>
        </small>
        <p>
          {listing.quantity > 0
            ? `Serves ${listing.quantity}`
            : "No more available!"}
        </p>
        <p>
          By{" "}
          <a
            href={`/profile/${listing.donor_username}/`}
            onClick={(e) => e.stopPropagation()}
          >
            {listing.donor_username}
          </a>
        </p>
        <p>{listing.special_notes || "No special notes"}</p>
        {isOwner && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/listings/${listing.id}/edit`);
              }}
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (
                  window.confirm(
                    "Are you sure you want to delete this listing?"
                  )
                ) {
                  onDelete(listing.id);
                }
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Listing;
