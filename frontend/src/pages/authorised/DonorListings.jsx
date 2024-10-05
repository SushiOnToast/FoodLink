import React, { useState, useEffect } from "react";
import api from "../../api";
import Listing from "../../components/Listing";
import LoadingIndicator from "../../components/LoadingIndicator";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

function DonorListings() {
  const [listings, setListings] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [specialNotes, setSpecialNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);

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
      alert(error);
      console.log(error);
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
      console.error("error fetching listings", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/listings/", {
        name,
        quantity: parseInt(quantity, 10), // Convert quantity to number
        special_notes: specialNotes,
        food_type_ids: selectedFoodTypes,
      });
      if (response.status === 201) {
        alert("Resource created");
        setName("");
        setQuantity(0); // Reset quantity to 0
        setSpecialNotes("");
        setSelectedFoodTypes([]);
        fetchListings();
      } else {
        alert("failed to create listing");
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to create listing");
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/api/listings/delete/${id}/`);
      if (response.status === 204) {
        alert("listing deleted");
        FetchListings();
      } else {
        alert("failed to delete listing");
      }
    } catch (error) {
      alert(error);
      console.log(error);
    } finally {
      setLoading(false);
    }

  };

  const handleFoodTypeSelection = (id) => {
    const updatedSelectedFoodTypes = selectedFoodTypes.includes(id)
      ? selectedFoodTypes.filter((foodTypeId) => foodTypeId !== id)
      : [...selectedFoodTypes, id];
  
    setSelectedFoodTypes(updatedSelectedFoodTypes); // Update the state with the new array
  };  

  if (loading) return <LoadingIndicator />;

  return (
    <div>
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
          placeholder="Type any specific information here (Allergies, nutrition info, etc."
        ></textarea>
        <br />
        <MultiSelectDropdown
          items={foodTypes}
          selectedItems={selectedFoodTypes}
          onSelectItem={handleFoodTypeSelection}
          placeholder="select food types that apply"
        />
        <br />
        <input
          type="submit"
          name="post-listing"
          id="post-listng"
          value="Post!"
        />
      </form>
      <div>
        <h2>Your listings</h2>
        {listings.length > 0 ? (
          listings
            .slice()
            .reverse()
            .map((listing) => (
              <Listing
                key={listing.id} // Add this line to provide a unique key
                listing={listing}
                onDelete={deleteListing}
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
