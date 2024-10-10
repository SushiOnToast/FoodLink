import React, { useState, useEffect } from "react";
import api from "../../api";
import Resource from "../../components/Resource"; 
import LoadingIndicator from "../../components/LoadingIndicator";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

function DonorResources() {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
      alert(error);
      console.log(error);
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
      console.error("error fetching resources", error);
      alert(error);
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
        alert("Resource created");
        setTitle("");
        setContent("");
        setSelectedCategories([]);
        fetchResources();
      } else {
        alert("failed to create resource");
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to create resource");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/api/resources/${id}/delete/`); // Adjust the API endpoint for deletion
      if (response.status === 204) {
        alert("Resource deleted");
        fetchResources(); // Fetch resources again to refresh the list
      } else {
        alert("failed to delete resource");
      }
    } catch (error) {
      alert(error);
      console.log(error);
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

  return (
    <div>
      <form onSubmit={(e) => createResource(e)}>
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Enter title of resource"
        />
        <br />
        <textarea
          name="content"
          id="content"
          required
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          placeholder="Type the content of the resource here..."
        ></textarea>
        <br />
        <MultiSelectDropdown
          items={categories}
          selectedItems={selectedCategories}
          onSelectItem={handleCategorySelection}
          placeholder="Select categories that apply"
        />
        <br />
        <input
          type="submit"
          name="post-resource"
          id="post-resource"
          value="Post Resource"
        />
      </form>
      <div>
        <h2>Your Resources</h2>
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
