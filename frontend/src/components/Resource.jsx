import React from "react";
import tokens from "../constants";
import { useNavigate } from "react-router-dom";

function Resource({ resource, onDelete }) {
  const formattedDate = new Date(resource.created_at).toLocaleDateString("en-US");
  const viewerUsername = localStorage.getItem(tokens.USERNAME);
  const isOwner = resource.author_username === viewerUsername; // Assuming `author_username` is the field for the resource's author
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/resources/${resource.id}/`); // Navigates to the resource detail page using ID
  };

  return (
    <div onClick={handleClick} >
      <h3>{resource.title}</h3>
      <small>
        Created on <i>{formattedDate}</i>
      </small>
      <p>{resource.content.slice(0, 100)}...</p> {/* Show a preview of the content */}
      {resource.categories && resource.categories.length > 0 && (
        <div>
          <strong>Categories:</strong>
          <div>
            {resource.categories.map((category) => (
              <span key={category.id}>
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}
      <p>
        By{" "}
        <a
          href={`/profile/${resource.author_username}/`}
          onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking the profile link
        >
          {resource.author_username}
        </a>
      </p>
      {isOwner && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              navigate(`/resources/${resource.id}/edit`); // Navigate to edit page using ID
            }}
          >
            Edit Resource
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from navigating to the resource details
              onDelete(resource.id); // Call the onDelete function
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
