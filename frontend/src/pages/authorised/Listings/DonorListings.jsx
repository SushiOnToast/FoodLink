import React, { useState, useEffect } from "react";
import api from "../../../api";
import Listing from "../../../components/Listing";
import LoadingIndicator from "../../../components/LoadingIndicator";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import "../../../styles/DonorListings.css";

function DonorListings() {
  const [listings, setListings] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [specialNotes, setSpecialNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    fetchFoodTypes();
    fetchListings();
  }, []);

  const fetchFoodTypes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/listings/food_types/");
      setFoodTypes(response.data);
    } catch (error) {
      alert("Failed to load food types. Please try again.");
      console.error("Error fetching food types:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/listings/");
      setListings(response.data);
    } catch (error) {
      alert("Failed to load listings. Please try again.");
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("quantity", parseInt(quantity, 10));
      formData.append("special_notes", specialNotes);
      formData.append("food_type_ids", selectedFoodTypes);
      if (coverImage) formData.append("cover_image", coverImage);

      const response = await api.post("/api/listings/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        alert("Resource created successfully!");
        setName("");
        setQuantity(0);
        setSpecialNotes("");
        setSelectedFoodTypes([]);
        setCoverImage(null);
        fetchListings();
      } else {
        alert("Failed to create listing. Please try again.");
      }
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to create listing. Please check your input."
      );
      console.error("Error creating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const response = await api.delete(`/api/listings/delete/${id}/`);
      if (response.status === 204) {
        alert("Listing deleted successfully!");
        fetchListings();
      } else {
        alert("Failed to delete listing. Please try again.");
      }
    } catch (error) {
      alert("Error deleting listing. Please try again.");
      console.error("Error deleting listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodTypeSelection = (id) => {
    const updatedSelectedFoodTypes = selectedFoodTypes.includes(id)
      ? selectedFoodTypes.filter((foodTypeId) => foodTypeId !== id)
      : [...selectedFoodTypes, id];
    setSelectedFoodTypes(updatedSelectedFoodTypes);
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="donor-listings-container">
      <form onSubmit={(e) => createListing(e)} className="create-listing-form">
        <div className="form-image-preview">
          <div className="image-preview">
            {coverImage ? (
              <img src={URL.createObjectURL(coverImage)} alt="Cover preview" />
            ) : (
              <div className="image-placeholder"></div>
            )}
          </div>
          <label className="upload-btn">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
            <span>Upload image</span>
          </label>
        </div>
        <div className="form-fields">
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name of Food"
            className="input-field"
          />
          <div className="inline-fields">
            <MultiSelectDropdown
              items={foodTypes}
              selectedItems={selectedFoodTypes}
              onSelectItem={handleFoodTypeSelection}
              placeholder="Type of Food"
              className="input-field"
            />
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              required
              placeholder="Quantity"
              className="input-field"
            />
          </div>
          <textarea
            name="special_notes"
            id="special_notes"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="Special Notes..."
            className="textarea-field"
          ></textarea>
          <button type="submit" className="post-btn">
            Post!
          </button>
        </div>
      </form>
      <h2>Your Listings</h2>
      <div className="listings-grid">
        {listings.length > 0 ? (
          listings
            .slice()
            .reverse()
            .map((listing) => (
              <Listing
                key={listing.id}
                listing={listing}
                onDelete={deleteListing}
                DonorListingsPage={true}
              />
            ))
        ) : (
          <p>No listings yet, consider creating one!</p>
        )}
      </div>
    </div>
  );
}

export default DonorListings;
