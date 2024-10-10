import React from "react";
import tokens from "../constants";
import { useNavigate } from "react-router-dom";
import "../styles/Resource.css";

function Resource({ resource, onDelete }) {
  const formattedDate = new Date(resource.created_at).toLocaleDateString(
    "en-US"
  );
  const viewerUsername = localStorage.getItem(tokens.USERNAME);
  const isOwner = resource.author_username === viewerUsername;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/resources/${resource.id}/`);
  };

  return (
    <div className="resource-card" onClick={handleClick}>
      <div className="resource-header"></div> {/* Pink gradient background */}
      <div className="resource-content">
        <h3>{resource.title}</h3>
        <small>
          Created on <i>{formattedDate}</i>
        </small>
        <p>{resource.content.slice(0, 100)}...</p>

        {/* Display categories */}
        {resource.categories && resource.categories.length > 0 && (
          <div className="resource-categories">
            {resource.categories.map((category) => (
              <span key={category.id} className="resource-category">
                {category.name}
              </span>
            ))}
          </div>
        )}

        <p>
          By{" "}
          <a
            href={`/profile/${resource.author_username}/`}
            onClick={(e) => e.stopPropagation()}
          >
            {resource.author_username}
          </a>
        </p>

        {/* Edit/Delete buttons for owners */}
        {isOwner && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/resources/${resource.id}/edit`);
              }}
            >
              Edit Resource
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this resource?"
                );
                if (confirmDelete) {
                  onDelete(resource.id)
                    .then(() => {
                      alert("Resource deleted successfully.");
                    })
                    .catch((error) => {
                      console.error("Failed to delete resource:", error);
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
    </div>
  );
}

export default Resource;
