import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";

function ResourceDetails() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null); // Initially null
  const [loading, setLoading] = useState(true);
  const viewerUsername = localStorage.getItem(tokens.USERNAME);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResource();
  }, [resourceId]);

  const fetchResource = async () => {
    try {
      const response = await api.get(`/api/resources/${resourceId}`); // Adjust the API endpoint accordingly
      setResource(response.data);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`../resources`); // Navigate back to the resources list
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      await api.delete(`/api/resources/${resourceId}/delete/`); // Adjust the API endpoint accordingly
      navigate(`../resources`); 
    } catch (error) {
      console.error(
        "Error deleting resource:",
        error.response?.data || error.message
      );
    }
  };

  if (loading) return <LoadingIndicator />;

  if (!resource) return <div>No resource found.</div>;

  const isOwner = resource.author_username === viewerUsername;

  return (
    <div>
      <button onClick={handleClick}>Back to resources</button>
      <h2>{resource.title}</h2>
      <small>
        Created on <i>{new Date(resource.created_at).toLocaleDateString("en-US")}</i>
      </small>
      <p>{resource.content}</p> 

      {resource.categories && resource.categories.length > 0 && (
        <div>
          <strong>Categories:</strong>
          <div>
            {resource.categories.map((category) => (
              <span
                key={category.id}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {isOwner && (
        <>
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
        </>
      )}
    </div>
  );
}

export default ResourceDetails;
