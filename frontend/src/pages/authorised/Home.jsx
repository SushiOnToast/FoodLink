import React, { useState, useEffect } from "react";
import api from "../../api";
import Request from "../../components/Request";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";

// Constants for request statuses
const REQUEST_STATUSES = {
  ACCEPTED: "accepted",
  PENDING: "pending",
  REJECTED: "rejected",
  DELIVERED: "delivered",
};

// Custom hook for fetching requests
const useFetchRequests = (userRole) => {
  const [requests, setRequests] = useState({
    accepted: [],
    pending: [],
    rejected: [],
    delivered: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    const url =
      userRole === "donor"
        ? "/api/listings/requests/"
        : "/api/requests/recipient/";
    try {
      const response = await api.get(url);
      const allRequests = response.data;

      setRequests({
        accepted: allRequests.filter(
          (request) => request.status === REQUEST_STATUSES.ACCEPTED
        ),
        pending: allRequests.filter(
          (request) => request.status === REQUEST_STATUSES.PENDING
        ),
        rejected: allRequests.filter(
          (request) => request.status === REQUEST_STATUSES.REJECTED
        ),
        delivered: allRequests.filter(
          (request) => request.status === REQUEST_STATUSES.DELIVERED
        ),
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userRole]);

  return { requests, loading, error, fetchRequests };
};

function Home() {
  const userRole = localStorage.getItem(tokens.USER_ROLE);
  const { requests, loading, error, fetchRequests } =
    useFetchRequests(userRole);
  const [isDeliveredVisible, setIsDeliveredVisible] = useState(false);

  const deleteRequest = async (requestId) => {
    try {
      await api.delete(`/api/requests/${requestId}/`);
      fetchRequests(); // Refetch the requests after deletion
    } catch (error) {
      alert("Failed to delete the request. Please try again.");
    }
  };

  // Toggle visibility of delivered requests
  const toggleDeliveredVisibility = () => {
    setIsDeliveredVisible(!isDeliveredVisible);
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <p>Error fetching requests: {error.message}</p>;

  return (
    <div className="home-page">
      <h1>Home</h1>

      {/* Accepted Requests Section */}
      <section>
        <h2>Accepted Requests</h2>
        {requests.accepted.length > 0 ? (
          requests.accepted.map((request) => (
            <Request key={request.id} request={request} />
          ))
        ) : (
          <p>No accepted requests found.</p>
        )}
      </section>

      {/* Pending Requests Section */}
      <section>
        <h2>Pending Requests</h2>
        {requests.pending.length > 0 ? (
          requests.pending.map((request) => (
            <Request key={request.id} request={request} />
          ))
        ) : (
          <p>No pending requests found.</p>
        )}
      </section>

      {/* Rejected Requests Section */}
      {userRole === "recipient" && (
        <section>
          <h2>Rejected Requests</h2>
          {requests.rejected.length > 0 ? (
            requests.rejected.map((request) => (
              <div key={request.id} className="rejected-request">
                <Request request={request} />
                <button onClick={() => deleteRequest(request.id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No rejected requests found.</p>
          )}
        </section>
      )}

      {/* Delivered Requests Section */}
      <section>
        <h2>
          Delivered Requests{" "}
          <button onClick={toggleDeliveredVisibility}>
            {isDeliveredVisible ? "Hide" : "Show"}
          </button>
        </h2>
        {isDeliveredVisible && (
          <div className="delivered-requests-list">
            {requests.delivered.length === 0 ? (
              <p>No delivered requests.</p>
            ) : (
              requests.delivered.map((request) => (
                <Request key={request.id} request={request} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
