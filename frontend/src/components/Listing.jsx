import React from "react";
import tokens from "../constants";
import { useNavigate } from "react-router-dom";

function Listing({ listing, onDelete }) {
  // Correct the locale format
  const formattedDate = new Date(listing.created_at).toLocaleDateString("en-US");
  
  // Retrieve user role from localStorage
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  
  // Navigation hook
  const navigate = useNavigate();

  return (
    <div>
      <h3>{listing.name}</h3>
      {listing.food_types && listing.food_types.length > 0 && (
          <div>
            {listing.food_types.map((food_type) => (
              <p key={food_type.id}>
                {food_type.name}
              </p>
            ))}
          </div>
        )}
      <small>
        Created on <i>{formattedDate}</i>
      </small>
      <p>Quantity available: {listing.quantity}</p>
      <p>
        By{" "}
        <a href={`/profile/${listing.donor_username}/`}>
          {listing.donor_username}
        </a>
      </p>
      {/* Use listing.special_notes instead of donor.special_notes */}
      <p>{listing.special_notes ? listing.special_notes : "No special notes"}</p>
      <button onClick={(e) => { e.stopPropagation(); onDelete(listing.id); }}>Delete listing</button>
    </div>
  );
}

export default Listing;
