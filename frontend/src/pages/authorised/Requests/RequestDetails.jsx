import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import LoadingIndicator from "../../../components/LoadingIndicator";
import tokens from "../../../constants";
import MapView from "../../../components/MapView";
import "../../../styles/Requests.css";

function RequestDetails() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const userRole = localStorage.getItem(tokens.USER_ROLE); // Get the user role
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const response = await api.get(`/api/requests/${requestId}/`);
      setRequest(response.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
      setError("Failed to fetch request details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (newStatus) => {
    setLoading(true);
    try {
      const response = await api.patch(`/api/requests/${requestId}/`, {
        status: newStatus,
      });
      setRequest(response.data);
      alert(`Request ${newStatus} successfully.`);
    } catch (error) {
      console.error(`Error updating request status to ${newStatus}:`, error);
      alert(`Failed to ${newStatus} request. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="error-message">{error}</div>; // Display error message

  return (
    <div className="request-details-container">
      <h3>Requested by: {request.recipient_name}</h3>
      <p>
        Status:{" "}
        <span className={`status ${request.status}`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </p>

      {/* Accept/Reject buttons for donors if the status is pending */}
      {userRole === "donor" && request.status === "pending" && (
        <div className="request-buttons">
          <button
            className="accept-btn"
            onClick={() => updateRequestStatus("accepted")}
          >
            Accept
          </button>
          <button
            className="reject-btn"
            onClick={() => updateRequestStatus("rejected")}
          >
            Reject
          </button>
        </div>
      )}

      {/* Mark as Delivered button for accepted requests, only visible to the donor */}
      {userRole === "donor" && request.status === "accepted" && (
        <div className="request-buttons">
          <button
            className="deliver-btn"
            onClick={() => updateRequestStatus("delivered")}
          >
            Mark as Delivered
          </button>
        </div>
      )}

      <p>Listing: {request.listing_name}</p>
      <p>Quantity requested: {request.quantity_requested}</p>

      <div className="notes-section">
        <p>{request.additional_notes || "No additional notes"}</p>
      </div>

      {/* MapView displaying the recipient and listing locations */}
      <div className="map-container">
        <MapView
          latitude={request.recipient_latitude}
          longitude={request.recipient_longitude}
          listingLatitude={request.listing_latitude}
          listingLongitude={request.listing_longitude}
        />
      </div>
    </div>
  );
}

export default RequestDetails;
