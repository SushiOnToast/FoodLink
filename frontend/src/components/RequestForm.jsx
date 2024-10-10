import React, { useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";

function RequestForm({ listing }) {
  const { listingId } = useParams(); // Get the listing ID from the URL parameters
  const [quantity, setQuantity] = useState(""); // State to manage the quantity requested
  const [additionalNotes, setAdditionalNotes] = useState(""); // State to manage additional notes
  const [successMessage, setSuccessMessage] = useState(null); // State for success message after form submission
  const [errorMessage, setErrorMessage] = useState(null); // State for error messages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrorMessage(null); // Reset any previous error message

    try {
      // Send a POST request to create a new request for the listing
      const response = await api.post(
        `/api/requests/listing/${listingId}/create/`,
        {
          quantity_requested: quantity, // Ensure this is the correct field name
          additional_notes: additionalNotes,
        }
      );
      // Show success message upon successful request submission
      setSuccessMessage("Request submitted successfully");
      setQuantity(""); // Clear the quantity input field
      setAdditionalNotes(""); // Clear the additional notes input field
      location.reload(); // Reload the page to reflect the new request (consider improving UX)
    } catch (error) {
      // Log the error response for better debugging
      console.log("Response data:", error.response?.data);
      console.log("Response status:", error.response?.status);

      // Set a more meaningful error message for the user
      if (error.response) {
        // If the server responds with an error
        if (error.response.status === 400) {
          setErrorMessage("Please check your input and try again."); // Bad Request
        } else if (error.response.status === 404) {
          setErrorMessage("Listing not found. Please try again."); // Not Found
        } else {
          setErrorMessage("Failed to submit request. Please try again."); // General error for other status codes
        }
      } else {
        // If no response was received from the server
        setErrorMessage(
          "Network error. Please check your internet connection and try again."
        );
      }
    }
  };

  return (
    <div>
      <h3>Request this listing</h3>
      {successMessage && <p>{successMessage}</p>}{" "}
      {/* Display success message if available */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
      {/* Display error message if available */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Quantity to request</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1" // Minimum quantity that can be requested
            max={listing.quantity} // Maximum quantity based on listing availability
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
        <button type="submit">Submit Request</button>{" "}
        {/* Submit button for the form */}
      </form>
    </div>
  );
}

export default RequestForm;
