import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";
import MapView from "../../components/MapView";

function RequestDetails() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem(tokens.USERNAME);
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      const response = await api.get(`/api/requests/${requestId}`);
      setRequest(response.data);
    } catch (error) {
      console.log(error);
      alert(error);
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
      alert(`Request ${newStatus} successfully`);
    } catch (error) {
      console.log(error);
      alert(`Failed to ${newStatus} request`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div>
      <h3>Requested by: {request.recipient_name}</h3>
      <p>Status: {request.status}</p>

      {userRole === "donor" && request.status === "pending" && (
        <>
          <button onClick={() => updateRequestStatus("accepted")}>Accept</button>
          <button onClick={() => updateRequestStatus("rejected")}>Reject</button>
        </>
      )}

      <p>Listing: {request.listing_name}</p>
      <p>Quantity requested: {request.quantity_requested}</p>
      <p>
        {request.additional_notes
          ? request.additional_notes
          : "No additional notes"}
      </p>

      {/* MapView displaying the recipient and listing locations */}
      <MapView
        latitude={request.recipient_latitude}
        longitude={request.recipient_longitude}
        listingLatitude={request.listing_latitude}
        listingLongitude={request.listing_longitude}
      />
    </div>
  );
}

export default RequestDetails;
