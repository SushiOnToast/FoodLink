import React from "react";
import tokens from "../constants";
import { useNavigate } from "react-router-dom";

function Resource({ resource, onDelete }) {
  // Format the resource creation date to "MM/DD/YYYY" format for display
  const formattedDate = new Date(resource.created_at).toLocaleDateString(
    "en-US"
  );

  // Retrieve the logged-in user's username from localStorage
  const viewerUsername = localStorage.getItem(tokens.USERNAME);

  // Check if the logged-in user is the owner of the resource
  const isOwner = resource.author_username === viewerUsername; // Assuming `author_username` is the field for the resource's author

  // Initialize the navigate function from the useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // Handle navigation to the resource detail page when the resource is clicked
  const handleClick = () => {
    navigate(`/resources/${resource.id}/`); // Navigates to the resource detail page using the resource ID
  };

  return (
    <div onClick={handleClick}>
      {/* Display the title of the resource */}
      <h3>{resource.title}</h3>

      {/* Display the formatted creation date */}
      <small>
        Created on <i>{formattedDate}</i>
      </small>

      {/* Show a preview of the content (first 100 characters) */}
      <p>{resource.content.slice(0, 100)}...</p>

      {/* Display categories if the resource has any */}
      {resource.categories && resource.categories.length > 0 && (
        <div>
          <strong>Categories:</strong>
          <div>
            {resource.categories.map((category) => (
              <span key={category.id}>
                {category.name} {/* Display the name of each category */}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Display the author's username with a link to their profile */}
      <p>
        By{" "}
        <a
          href={`/profile/${resource.author_username}/`} // Link to the author's profile
          onClick={(e) => e.stopPropagation()} // Prevent the link click from navigating to the resource details
        >
          {resource.author_username}
        </a>
      </p>

      {/* If the logged-in user is the owner of the resource, show Edit and Delete buttons */}
      {isOwner && (
        <>
          {/* Button to navigate to the resource edit page */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from navigating to the resource details
              navigate(`/resources/${resource.id}/edit`); // Navigate to the resource edit page using the resource ID
            }}
          >
            Edit Resource
          </button>

          {/* Button to delete the resource */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from navigating to the resource details

              // Confirm deletion with the user
              const confirmDelete = window.confirm(
                "Are you sure you want to delete this resource?"
              );
              if (confirmDelete) {
                // If confirmed, call the onDelete function passed as a prop and handle possible errors
                onDelete(resource.id)
                  .then(() => {
                    // Notify the user about the successful deletion
                    alert("Resource deleted successfully.");
                  })
                  .catch((error) => {
                    // Log error for debugging
                    console.error("Failed to delete resource:", error);
                    // Display a user-friendly error message
                    alert("Failed to delete the resource. Please try again.");
                  });
              }
            }}
          >
            Delete Resource
          </button>
        </>
      )}
    </div>
  );
}

export default Resource;
