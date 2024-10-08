import React from "react";
import { useNavigate } from "react-router-dom";

function Request({ request }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/requests/${request.id}/`);
  };

  return (
    <div onClick={handleClick}>
        <h3>Requested by: {request.recipient_name}</h3>
        <p>{request.listing_name}</p>
        <p>Status: {request.status}</p>
        <p>Quantity requested: {request.quantity_requested}</p>
        <p>{request.additional_notes ? request.additional_notes : "No additional notes"}</p>
    </div>
  );
}

export default Request;
