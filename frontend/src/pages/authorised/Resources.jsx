import React, { useState, useEffect } from "react";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";
import Resource from "../../components/Resource"; // Assuming you have a Resource component for displaying resources
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

function Resources() {
  const [resources, setResources] = useState([]); // All resources
  const [filteredResources, setFilteredResources] = useState([]); // Filtered resources
  const [categories, setCategories] = useState([]); // All categories for filtering
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources(); // Filter resources whenever selected categories change
  }, [selectedCategories, resources]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/resources/categories/"); 
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/resources/"); 
      setResources(response.data); // Store all resources
      setFilteredResources(response.data); // Initialize filtered resources with all
    } catch (error) {
      console.error("Error fetching resources:", error.response?.data || error.message);
      setError("Failed to fetch resources.");
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    if (selectedCategories.length === 0) {
      setFilteredResources(resources);
      return;
    }

    const filtered = resources.filter((resource) =>
      resource.categories.some((category) => selectedCategories.includes(category.id))
    );
    
    setFilteredResources(filtered);
  };

  const handleCategoryChange = (id) => {
    const updatedSelectedCategories = selectedCategories.includes(id)
      ? selectedCategories.filter((categoryId) => categoryId !== id)
      : [...selectedCategories, id];

    setSelectedCategories(updatedSelectedCategories);
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      await api.delete(`/api/resources/${resourceId}/delete/`); 
      setResources(resources.filter((resource) => resource.id !== resourceId));
      setFilteredResources(filteredResources.filter((resource) => resource.id !== resourceId));
    } catch (error) {
      console.error("Error deleting resource:", error.response?.data || error.message);
      setError("Failed to delete the resource.");
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <>
      {error && <div className="error-message">{error}</div>} {/* Show error if any */}
      <h2>Resources</h2>
      <MultiSelectDropdown
        items={categories}
        selectedItems={selectedCategories}
        onSelectItem={handleCategoryChange}
        placeholder="Filter by category"
      />
      {userRole === "donor" && (
        <button onClick={() => navigate("/resources/yourresources")}>Your resources</button>
      )}
      {filteredResources.length > 0 ? (
        filteredResources.map((resource) => (
          <Resource key={resource.id} resource={resource} onDelete={handleDeleteResource} />
        ))
      ) : (
        <p>No resources found.</p>
      )}
    </>
  );
}

export default Resources;
