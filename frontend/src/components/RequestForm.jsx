import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

function RequestForm({ listing }) {
  const { listingId } = useParams();
  const [quantity, setQuantity] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await api.post(
        `/api/requests/listing/${listingId}/create`,
        {
          quantity_requested: quantity, // Ensure this is the correct field name
          additional_notes: additionalNotes,
        }
      );
      setSuccessMessage("Request submitted successfully");
      setQuantity("");
      setAdditionalNotes("");
      location.reload()
    } catch (error) {
      console.log("Response data:", error.response.data); // Log the error response for better debugging
      console.log("Response status:", error.response.status);
      setErrorMessage("Failed to submit request. Please try again.");
    }
  };

  return (
    <div>
      <h3>Request this listing</h3>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Quantity to request</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
            max={listing.quantity}
          />
        </div>
        <div>
          <label>Additional Notes</label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional information"
          />
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default RequestForm;
