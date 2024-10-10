import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import api from "../api";

function Request({ request }) {
  const [loading, setLoading] = useState(false); // To handle the loading state during status updates
  const navigate = useNavigate(); // Hook for navigation
  const userRole = localStorage.getItem("user_role"); // Get the user's role from localStorage (e.g., donor)

  // Navigate to the request's detailed page
  const handleClick = () => {
    navigate(`/requests/${request.id}/`);
  };

  // Function to update the request status (e.g., "accepted", "rejected", or "delivered")
  const updateRequestStatus = async (newStatus) => {
    setLoading(true); // Show loading indicator while the update is in progress
    try {
      // Send a PATCH request to update the status of the request
      const response = await api.patch(`/api/requests/${request.id}/`, {
        status: newStatus,
      });
      alert(`Request ${newStatus} successfully`); // Notify the user on success
      location.reload(); // Reload the page to reflect the updated status
    } catch (error) {
      console.log(error); // Log any error that occurs
      alert(`Failed to ${newStatus} request`); // Notify the user on failure
    } finally {
      setLoading(false); // Stop the loading indicator once the process is complete
    }
  };

  return (
    <div className="request-item">
      {/* Display request information */}
      <h3>Requested by: {request.recipient_name}</h3>
      <p>{request.listing_name}</p>
      <p>Status: {request.status}</p>
      <p>Quantity requested: {request.quantity_requested}</p>
      <p>{request.additional_notes ? request.additional_notes : "No additional notes"}</p>

      {/* Button to navigate to the detailed view of the request */}
      <button onClick={handleClick}>View Details</button>

      {/* If the request is pending and the user is a donor, show Accept/Reject buttons */}
      {request.status === "pending" && userRole === "donor" && (
        <>
          {loading ? (
            <LoadingIndicator /> // Show loading indicator while request is being updated
          ) : (
            <div>
              {/* Accept button to update the request status to "accepted" */}
              <button onClick={() => updateRequestStatus("accepted")}>Accept</button>
              {/* Reject button to update the request status to "rejected" */}
              <button onClick={() => updateRequestStatus("rejected")}>Reject</button>
            </div>
          )}
        </>
      )}

      {/* If the request is accepted and the user is a donor, show "Mark as Delivered" button */}
      {request.status === "accepted" && userRole === "donor" && (
        <>
          {loading ? (
            <LoadingIndicator /> // Show loading indicator while the request is being updated
          ) : (
            <button onClick={() => updateRequestStatus("delivered")}>Mark as Delivered</button>
          )}
        </>
      )}
    </div>
  );
}

export default Request;
