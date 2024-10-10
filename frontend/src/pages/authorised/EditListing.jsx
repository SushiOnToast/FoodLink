import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

function EditListing() {
  const navigate = useNavigate();
  const { listingId } = useParams(); // Get listing ID from the URL
  const [loading, setLoading] = useState(true);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    special_notes: "",
    cover_image: null, // For new image upload
    cover_image_preview: null, // For displaying the current image preview
  });

  // Fetch existing food types and the specific listing data when the component mounts
  useEffect(() => {
    fetchFoodTypes();
    fetchListing();
  }, [listingId]);

  // Fetch all available food types from the API
  const fetchFoodTypes = async () => {
    try {
      const response = await api.get("/api/listings/food_types/");
      setFoodTypes(response.data);
    } catch (error) {
      console.error("Error fetching food types:", error);
      alert("Failed to load food types.");
    }
  };

  // Fetch the listing data to pre-fill the form
  const fetchListing = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/listings/${listingId}/`);
      const listing = response.data;
      setFormData({
        name: listing.name,
        quantity: listing.quantity,
        special_notes: listing.special_notes,
        cover_image_preview: listing.cover_image,
      });
      setSelectedFoodTypes(listing.food_types.map((food) => food.id)); // Set the selected food types
    } catch (error) {
      console.error("Error fetching listing:", error);
      alert("Failed to load listing data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle changes in form fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle food type selection
  const handleFoodTypeSelection = (id) => {
    const updatedSelectedFoodTypes = selectedFoodTypes.includes(id)
      ? selectedFoodTypes.filter((foodTypeId) => foodTypeId !== id)
      : [...selectedFoodTypes, id];
    setSelectedFoodTypes(updatedSelectedFoodTypes);
  };

  // Handle cover image file change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      cover_image: e.target.files[0], // Set new image file
      cover_image_preview: URL.createObjectURL(e.target.files[0]), // Set preview for the new image
    });
  };

  // Handle form submission to update the listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("quantity", formData.quantity);
      formDataToSubmit.append("special_notes", formData.special_notes);

      // Append food type IDs one by one
      selectedFoodTypes.forEach((id) => {
        formDataToSubmit.append("food_type_ids", id);
      });

      // Only append cover image if it's available
      if (formData.cover_image) {
        formDataToSubmit.append("cover_image", formData.cover_image);
      }

      await api.put(`/api/listings/${listingId}/edit/`, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Listing updated successfully!");
      navigate(`/listings/${listingId}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("Failed to update listing.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="edit-listing-page">
      <h1>Edit Listing</h1>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter name of food"
          required
        />
        <br />

        {/* Quantity Input */}
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          min="1"
          required
        />
        <br />

        {/* Special Notes */}
        <textarea
          name="special_notes"
          value={formData.special_notes}
          onChange={handleInputChange}
          placeholder="Any specific information (e.g., allergies, nutrition info)"
        ></textarea>
        <br />

        {/* Food Types Dropdown */}
        <MultiSelectDropdown
          items={foodTypes}
          selectedItems={selectedFoodTypes}
          onSelectItem={handleFoodTypeSelection}
          placeholder="Select food types"
        />
        <br />

        {/* Cover Image Upload and Preview */}
        <h3>Cover Image</h3>
        {formData.cover_image_preview && (
          <img
            src={formData.cover_image_preview}
            alt="Cover Preview"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />

        <button type="submit">Update Listing</button>
      </form>
    </div>
  );
}

export default EditListing;
