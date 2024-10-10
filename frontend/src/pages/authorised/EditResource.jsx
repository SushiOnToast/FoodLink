import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

function EditResource() {
  const navigate = useNavigate();
  const { resourceId } = useParams(); // Get resource ID from the URL
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Fetch existing categories and the specific resource data when the component mounts
  useEffect(() => {
    fetchCategories();
    fetchResource();
  }, [resourceId]);

  // Fetch all available categories from the API
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/resources/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories.");
    }
  };

  // Fetch the resource data to pre-fill the form
  const fetchResource = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/resources/${resourceId}/`);
      const resource = response.data;
      setFormData({
        title: resource.title,
        content: resource.content,
      });
      setSelectedCategories(resource.categories.map((category) => category.id)); // Set the selected categories
    } catch (error) {
      console.error("Error fetching resource:", error);
      alert("Failed to load resource data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle changes in form fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle category selection
  const handleCategorySelection = (id) => {
    const updatedSelectedCategories = selectedCategories.includes(id)
      ? selectedCategories.filter((categoryId) => categoryId !== id)
      : [...selectedCategories, id];
    setSelectedCategories(updatedSelectedCategories);
  };

  // Handle form submission to update the resource
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSubmit = {
        title: formData.title,
        content: formData.content,
        category_ids: selectedCategories,
      };

      await api.put(`/api/resources/${resourceId}/edit/`, formDataToSubmit);

      alert("Resource updated successfully!");
      navigate(`/resources/${resourceId}`);
    } catch (error) {
      console.error("Error updating resource:", error);
      alert("Failed to update resource.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="edit-resource-page">
      <h1>Edit Resource</h1>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter resource title"
          required
        />
        <br />

        {/* Content Input */}
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Enter resource content"
          required
        ></textarea>
        <br />

        {/* Categories Dropdown */}
        <MultiSelectDropdown
          items={categories}
          selectedItems={selectedCategories}
          onSelectItem={handleCategorySelection}
          placeholder="Select categories"
        />
        <br />

        <button type="submit">Update Resource</button>
      </form>
    </div>
  );
}

export default EditResource;
