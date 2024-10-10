import React, { useState, useEffect } from "react";
import api from "../../../api";
import Listing from "../../../components/Listing";
import LoadingIndicator from "../../../components/LoadingIndicator";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";

function DonorListings() {
  // State variables to manage listings and form inputs
  const [listings, setListings] = useState([]); // To store the list of food listings
  const [name, setName] = useState(""); // To store the name of the food item
  const [quantity, setQuantity] = useState(0); // To store the quantity of food
  const [specialNotes, setSpecialNotes] = useState(""); // To store any special notes
  const [loading, setLoading] = useState(true); // To manage loading state
  const [foodTypes, setFoodTypes] = useState([]); // To store the list of food types
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]); // To store selected food types
  const [coverImage, setCoverImage] = useState(null); // To store the uploaded cover image

  // Fetch food types and listings on component mount
  useEffect(() => {
    fetchFoodTypes();
    fetchListings();
  }, []);

  // Function to fetch available food types from the API
  const fetchFoodTypes = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await api.get("/api/listings/food_types/");
      setFoodTypes(response.data); // Store fetched food types in state
    } catch (error) {
      alert("Failed to load food types. Please try again."); // User-friendly error message
      console.error("Error fetching food types:", error); // Log error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to fetch existing listings from the API
  const fetchListings = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await api.get("/api/listings/");
      setListings(response.data); // Store fetched listings in state
    } catch (error) {
      alert("Failed to load listings. Please try again."); // User-friendly error message
      console.error("Error fetching listings:", error); // Log error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to create a new food listing
  const createListing = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
    try {
      const formData = new FormData(); // Create a FormData object to handle form inputs
      formData.append("name", name);
      formData.append("quantity", parseInt(quantity, 10)); // Parse quantity as an integer
      formData.append("special_notes", specialNotes);
      formData.append("food_type_ids", selectedFoodTypes); // Append selected food types
      if (coverImage) formData.append("cover_image", coverImage); // Append cover image if provided

      const response = await api.post("/api/listings/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set header for image upload
        },
      });
      if (response.status === 201) {
        alert("Resource created successfully!"); // Success message
        // Reset form fields after successful submission
        setName("");
        setQuantity(0);
        setSpecialNotes("");
        setSelectedFoodTypes([]);
        setCoverImage(null);
        fetchListings(); // Refresh listings after creation
      } else {
        alert("Failed to create listing. Please try again."); // User-friendly error message
      }
    } catch (error) {
      alert(
        error.response?.data?.detail ||
          "Failed to create listing. Please check your input."
      ); // Detailed error message
      console.error("Error creating listing:", error); // Log error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function to delete a listing by ID
  const deleteListing = async (id) => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return; // Abort if user cancels

    setLoading(true); // Set loading state to true
    try {
      const response = await api.delete(`/api/listings/delete/${id}/`);
      if (response.status === 204) {
        alert("Listing deleted successfully!"); // Success message
        fetchListings(); // Refresh listings after deletion
      } else {
        alert("Failed to delete listing. Please try again."); // User-friendly error message
      }
    } catch (error) {
      alert("Error deleting listing. Please try again."); // User-friendly error message
      console.error("Error deleting listing:", error); // Log error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle selection of food types from the multi-select dropdown
  const handleFoodTypeSelection = (id) => {
    const updatedSelectedFoodTypes = selectedFoodTypes.includes(id)
      ? selectedFoodTypes.filter((foodTypeId) => foodTypeId !== id) // Remove from selection if already selected
      : [...selectedFoodTypes, id]; // Add to selection if not already selected

    setSelectedFoodTypes(updatedSelectedFoodTypes); // Update state with the new selection
  };

  // Show loading indicator while data is being fetched
  if (loading) return <LoadingIndicator />;

  return (
    <div>
      {/* Form for creating a new listing */}
      <form onSubmit={(e) => createListing(e)}>
        <input
          type="text"
          id="name"
          name="name"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter name of food"
        />
        <br />
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          onChange={(e) => {
            setQuantity(e.target.value);
          }}
          value={quantity}
          required
        />
        <br />
        <textarea
          name="special_notes"
          id="special_notes"
          value={specialNotes}
          onChange={(e) => {
            setSpecialNotes(e.target.value);
          }}
          placeholder="Type any specific information here (Allergies, nutrition info, etc.)"
        ></textarea>
        <br />
        <MultiSelectDropdown
          items={foodTypes}
          selectedItems={selectedFoodTypes}
          onSelectItem={handleFoodTypeSelection}
          placeholder="Select food types that apply"
        />
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverImage(e.target.files[0])} // Handle image upload
        />
        <br />
        <input
          type="submit"
          name="post-listing"
          id="post-listing"
          value="Post!"
        />
      </form>

      {/* Display existing listings */}
      <div>
        <h2>Your Listings</h2>
        {listings.length > 0 ? (
          listings
            .slice()
            .reverse()
            .map((listing) => (
              <Listing
                key={listing.id} // Provide a unique key for each listing
                listing={listing}
                onDelete={deleteListing}
                DonorListingsPage={true}
              />
            ))
        ) : (
          <p>No listings yet, consider creating one!</p> // Message when no listings are available
        )}
      </div>
    </div>
  );
}

export default DonorListings;
