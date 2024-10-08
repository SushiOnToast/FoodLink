import React from "react";
import tokens from "../constants";
import { useNavigate } from "react-router-dom";

function Listing({ listing, onDelete }) {
  const formattedDate = new Date(listing.created_at).toLocaleDateString("en-US");
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  const viewerUsername = localStorage.getItem(tokens.USERNAME);
  const isOwner = listing.donor_username === viewerUsername;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listings/${listing.id}/`);
  };

  return (
    <div onClick={handleClick}>
      <h3>{listing.name}</h3>
      {listing.food_types && listing.food_types.length > 0 && (
        <div>
          {listing.food_types.map((food_type) => (
            <p key={food_type.id}>{food_type.name}</p>
          ))}
        </div>
      )}
      <small>
        Created on <i>{formattedDate}</i>
      </small>
      {listing.quantity > 0 ? (
        <p>Quantity available: {listing.quantity}</p>
      ) : (
        <p>No more available!</p>
      )}
      <p>
        By{" "}
        <a
          href={`/profile/${listing.donor_username}/`}
          onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking the profile link
        >
          {listing.donor_username}
        </a>
      </p>
      <p>{listing.special_notes ? listing.special_notes : "No special notes"}</p>
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from navigating to the listing details
            onDelete(listing.id); // Call the onDelete function
          }}
        >
          Delete listing
        </button>
      )}
    </div>
  );
}

export default Listing;
