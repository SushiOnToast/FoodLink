import React, { useState, useEffect } from "react";
import api from "../../../api";
import LoadingIndicator from "../../../components/LoadingIndicator";
import tokens from "../../../constants";
import Resource from "../../../components/Resource"; // Component for displaying individual resources
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import "../../../styles/Resource.css";

function Resources() {
  const [resources, setResources] = useState([]); // All available resources
  const [filteredResources, setFilteredResources] = useState([]); // Resources after filtering
  const [categories, setCategories] = useState([]); // Categories for filtering resources
  const [selectedCategories, setSelectedCategories] = useState([]); // Categories selected by user
  const [loading, setLoading] = useState(false); // Loading state for API requests
  const [error, setError] = useState(null); // State to manage errors
  const userRole = localStorage.getItem(tokens.USER_ROLE); // Get user role from local storage
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    // Fetch categories and resources on component mount
    fetchCategories();
    fetchResources();
  }, []);

  useEffect(() => {
    // Re-filter resources when selected categories change or resources are updated
    filterResources();
  }, [selectedCategories, resources]);

  // Fetch available categories from the API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/resources/categories/");
      setCategories(response.data); // Set categories state
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again later."); // User-friendly error message
    } finally {
      setLoading(false);
    }
  };

  // Fetch all resources from the API
  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/resources/");
      setResources(response.data); // Store all resources
      setFilteredResources(response.data); // Initialize filtered resources with all
    } catch (error) {
      console.error(
        "Error fetching resources:",
        error.response?.data || error.message
      );
      setError("Failed to fetch resources. Please try again later."); // User-friendly error message
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on selected categories
  const filterResources = () => {
    if (selectedCategories.length === 0) {
      setFilteredResources(resources); // If no category selected, show all resources
      return;
    }

    const filtered = resources.filter(
      (resource) =>
        resource.categories.some((category) =>
          selectedCategories.includes(category.id)
        ) // Check if any category matches
    );

    setFilteredResources(filtered); // Update the filtered resources state
  };

  // Handle category selection changes
  const handleCategoryChange = (id) => {
    const updatedSelectedCategories = selectedCategories.includes(id)
      ? selectedCategories.filter((categoryId) => categoryId !== id) // Remove category if already selected
      : [...selectedCategories, id]; // Add new category to selected

    setSelectedCategories(updatedSelectedCategories); // Update selected categories state
  };

  // Handle resource deletion
  const handleDeleteResource = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await api.delete(`/api/resources/${resourceId}/delete/`); // API call to delete resource
        // Update the local state to reflect the deletion
        setResources(
          resources.filter((resource) => resource.id !== resourceId)
        );
        setFilteredResources(
          filteredResources.filter((resource) => resource.id !== resourceId)
        );
        alert("Resource deleted successfully."); // Notify user of successful deletion
      } catch (error) {
        console.error(
          "Error deleting resource:",
          error.response?.data || error.message
        );
        setError("Failed to delete the resource. Please try again."); // User-friendly error message
      }
    }
  };

  // Show loading indicator while fetching data
  if (loading) return <LoadingIndicator />;

  return (
    <div className="resources-page">
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Display error message if exists */}
      <h1>Resources</h1>
      <div className="resources-buttons">
        {/* Multi-select dropdown for filtering resources by categories */}
        <MultiSelectDropdown
          items={categories}
          selectedItems={selectedCategories}
          onSelectItem={handleCategoryChange}
          placeholder="Filter by category"
        />
        {userRole === "donor" && (
          <button
            className="create-listing-btn"
            onClick={() => navigate("/resources/yourresources")}
          >
            Your resources
          </button>
        )}
      </div>
      <div className="resource-grid">
        {/* Display filtered resources or a message if none found */}
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <Resource
              key={resource.id}
              resource={resource}
              onDelete={handleDeleteResource}
            />
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </div>
    </div>
  );
}

export default Resources;
