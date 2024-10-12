import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import api from "../api";
import "../styles/Requests.css";

function Request({ request }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("user_role");

  const handleClick = () => {
    navigate(`/requests/${request.id}/`);
  };

  const updateRequestStatus = async (newStatus) => {
    setLoading(true);
    try {
      const response = await api.patch(`/api/requests/${request.id}/`, {
        status: newStatus,
      });
      alert(`Request ${newStatus} successfully`);
      location.reload();
    } catch (error) {
      console.log(error);
      alert(`Failed to ${newStatus} request`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-item">
      <div className="request-info">
        <h3 className="recipient-name">Requested by: {request.recipient_name}</h3>
        <p className="listing-name">{request.listing_name}</p>
        <p className={`status status-${request.status}`}>
          Status: {request.status}
        </p>
        <p className="quantity">
          Quantity requested: {request.quantity_requested}
        </p>
        <p className="additional-notes">
          {request.additional_notes || "No additional notes"}
        </p>
      </div>
      
      <div className="request-actions">
        <button className="details-btn" onClick={handleClick}>
          View Details
        </button>

        {request.status === "pending" && userRole === "donor" && (
          <>
              <div className="status-buttons">
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
            
          </>
        )}

        {request.status === "accepted" && userRole === "donor" && (
          <>
              <button
                className="deliver-btn"
                onClick={() => updateRequestStatus("delivered")}
              >
                Mark as Delivered
              </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Request;
