import React from "react";
import tokens from "../constants";
import { useNavigate } from "react-router-dom";

function Listing({ listing, onDelete, DonorListingsPage }) {
  // Format the date the listing was created
  const formattedDate = new Date(listing.created_at).toLocaleDateString(
    "en-US"
  );

  // Get the logged-in user's username from localStorage
  const viewerUsername = localStorage.getItem(tokens.USERNAME);

  // Check if the logged-in user is the owner of the listing
  const isOwner = listing.donor_username === viewerUsername;

  // Navigation hook
  const navigate = useNavigate();

  // Function to handle clicking on the listing, which navigates to the listing's detail page
  const handleClick = () => {
    navigate(`/listings/${listing.id}/`);
  };

  // Base URL for images (environment variable)
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL;

  const imageUrl = DonorListingsPage ? listing.cover_image : `${baseUrl}${listing.cover_image}` ;

  return (
    <div onClick={handleClick} className="listing-container">
      {listing.cover_image && (
        <img
          src={imageUrl} // Display cover image
          alt={listing.name}
          style={{ width: "100px", height: "100px", objectFit: "cover" }} // Styling for the image
        />
      )}
      <h3>{listing.name}</h3>

      {/* Render food types if available */}
      {listing.food_types && listing.food_types.length > 0 && (
        <div>
          {listing.food_types.map((food_type) => (
            <p key={food_type.id}>{food_type.name}</p> // Display each food type
          ))}
        </div>
      )}
      <small>
        Created on <i>{formattedDate}</i>
      </small>

      {/* Display quantity available or a notice if none are left */}
      {listing.quantity > 0 ? (
        <p>Quantity available: {listing.quantity}</p>
      ) : (
        <p>No more available!</p>
      )}

      {/* Link to the donor's profile */}
      <p>
        By{" "}
        <a
          href={`/profile/${listing.donor_username}/`}
          onClick={(e) => e.stopPropagation()} // Prevent navigation to listing details when clicking the donor's name
        >
          {listing.donor_username}
        </a>
      </p>

      {/* Display special notes if available, otherwise show a placeholder */}
      <p>
        {listing.special_notes ? listing.special_notes : "No special notes"}
      </p>

      {/* Display options for the owner to edit or delete the listing */}
      {isOwner && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from navigating to the listing details
              navigate(`/listings/${listing.id}/edit`); // Navigate to the edit page
            }}
          >
            Edit Listing
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from navigating to the listing details
              if (
                window.confirm("Are you sure you want to delete this listing?")
              ) {
                onDelete(listing.id); // Call the onDelete function passed from the parent component
              }
            }}
          >
            Delete listing
          </button>
        </>
      )}
    </div>
  );
}

export default Listing;
