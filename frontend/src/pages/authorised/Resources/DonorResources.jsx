import React, { useState, useEffect } from "react";
import api from "../../../api";
import Resource from "../../../components/Resource";
import LoadingIndicator from "../../../components/LoadingIndicator";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import "../../../styles/Resource.css";

function DonorResources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    fetchCategories();
    fetchResources();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/resources/categories/"); // Adjust the API endpoint for categories
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/resources/"); // Adjust the API endpoint for resources
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError("Failed to fetch resources. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createResource = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resourceData = {
        title,
        content,
        category_ids: selectedCategories, // Assuming category IDs are passed
      };

      const response = await api.post("/api/resources/create/", resourceData);
      if (response.status === 201) {
        alert("Resource created successfully.");
        setTitle("");
        setContent("");
        setSelectedCategories([]);
        fetchResources();
      } else {
        alert("Failed to create resource. Please try again.");
      }
    } catch (error) {
      console.error("Error creating resource:", error);
      alert(
        error.response?.data?.detail ||
          "Failed to create resource. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/api/resources/${id}/delete/`); // Adjust the API endpoint for deletion
      if (response.status === 204) {
        alert("Resource deleted successfully.");
        fetchResources(); // Fetch resources again to refresh the list
      } else {
        alert("Failed to delete resource. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelection = (id) => {
    const updatedSelectedCategories = selectedCategories.includes(id)
      ? selectedCategories.filter((categoryId) => categoryId !== id)
      : [...selectedCategories, id];

    setSelectedCategories(updatedSelectedCategories); // Update the state with the new array
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="error-message">{error}</div>; // Display error message

  return (
    <div className="donor-resources-page">
      <div className="resource-creation-form">
        <form onSubmit={createResource}>
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Enter Title"
          />
          <MultiSelectDropdown
            items={categories}
            selectedItems={selectedCategories}
            onSelectItem={handleCategorySelection}
            placeholder="Select Categories"
          />
          <textarea
            name="content"
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing!"
          ></textarea>
          <input
            type="submit"
            name="post-resource"
            id="post-resource"
            value="Post!"
          />
        </form>
      </div>
      <h2>Your Resources</h2>
      <div className="resource-grid">
        {resources.length > 0 ? (
          resources
            .slice()
            .reverse()
            .map((resource) => (
              <Resource
                key={resource.id}
                resource={resource}
                onDelete={deleteResource}
              />
            ))
        ) : (
          <p>No resources yet, consider creating one!</p>
        )}
      </div>
    </div>
  );
}

export default DonorResources;
