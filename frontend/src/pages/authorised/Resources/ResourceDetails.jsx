import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import LoadingIndicator from "../../../components/LoadingIndicator";
import tokens from "../../../constants";

function ResourceDetails() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null); // Initially null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const viewerUsername = localStorage.getItem(tokens.USERNAME);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResource();
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      const response = await api.get(`/api/resources/${resourceId}/`);
      setResource(response.data);
    } catch (error) {
      console.error("Error fetching resource:", error);
      setError("Failed to load resource. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`../resources`); // Navigate back to the resources list
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await api.delete(`/api/resources/${resourceId}/delete/`); // Adjust the API endpoint accordingly
        alert("Resource deleted successfully.");
        navigate(`../resources`);
      } catch (error) {
        console.error(
          "Error deleting resource:",
          error.response?.data || error.message
        );
        alert("Failed to delete resource. Please try again.");
      }
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="error-message">{error}</div>; // Display error message
  if (!resource) return <div className="error-message">No resource found.</div>;

  const isOwner = resource.author_username === viewerUsername;

  return (
    <div className="resource-details-container">
      <button className="back-button" onClick={handleClick}>
        Back to resources
      </button>
      <div className="resource-details-card">
        <div className="resource-details-content">
          <h2>{resource.title}</h2>
          <small>
            Created on{" "}
            <i>{new Date(resource.created_at).toLocaleDateString("en-US")}</i>
          </small>
          <p>{resource.content}</p>

          {resource.categories && resource.categories.length > 0 && (
            <div className="resource-details-categories">
              <div>
                {resource.categories.map((category) => (
                  <span key={category.id} className="resource-details-category">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isOwner && (
            <div className="resource-buttons">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/resources/${resource.id}/edit`); // Navigate to edit page
                }}
              >
                Edit Resource
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from navigating
                  handleDeleteResource(resource.id); // Call the onDelete function
                }}
              >
                Delete Resource
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourceDetails;
