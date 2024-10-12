import React, { useState, useEffect } from "react";
import api from "../../api";
import Request from "../../components/Request";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";
import { useNavigate } from "react-router-dom";
import "../../styles/Requests.css";

const REQUEST_STATUSES = {
  ACCEPTED: "accepted",
  PENDING: "pending",
  REJECTED: "rejected",
  DELIVERED: "delivered",
};

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
  const navigate = useNavigate();

  const deleteRequest = async (requestId) => {
    try {
      await api.delete(`/api/requests/${requestId}/`);
      fetchRequests();
    } catch (error) {
      alert("Failed to delete the request. Please try again.");
    }
  };

  const toggleDeliveredVisibility = () => {
    setIsDeliveredVisible(!isDeliveredVisible);
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <p>Error fetching requests: {error.message}</p>;

  return (
    <div className="home-page">
      <div className="welcome">
        <h1>Welcome!</h1>
        <p>What would you like to do?</p>
        <div className="actions">
          {userRole == "donor" ? (
            <>
              <button onClick={() => navigate("/listings/yourlistings")}>
                Create a listing
              </button>
              <button onClick={() => navigate("/resources/yourresources")}>
                Create a resource
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/listings")}>
                Browse listings
              </button>
              <button onClick={() => navigate("/resources")}>
                Browse resources
              </button>
            </>
          )}
        </div>
      </div>

      <div className="request-section">
        <h1 className="requests-overview">Requests Overview</h1>

        <section>
          <h2>Accepted Requests</h2>
          <div className="request-list">
            {requests.accepted.length > 0 ? (
              requests.accepted.map((request) => (
                <Request key={request.id} request={request} />
              ))
            ) : (
              <p>No accepted requests found.</p>
            )}
          </div>
        </section>

        <section>
          <h2>Pending Requests</h2>
          <div className="request-list">
            {requests.pending.length > 0 ? (
              requests.pending.map((request) => (
                <Request key={request.id} request={request} />
              ))
            ) : (
              <p>No pending requests found.</p>
            )}
          </div>
        </section>

        {userRole === "recipient" && (
          <section>
            <h2>Rejected Requests</h2>
            <div className="request-list">
              {requests.rejected.length > 0 ? (
                requests.rejected.map((request) => (
                  <div key={request.id} className="rejected-request">
                    <Request request={request} />
                    <button
                      className="delete-request"
                      onClick={() => deleteRequest(request.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p>No rejected requests found.</p>
              )}
            </div>
          </section>
        )}

        <section>
          <h2>
            Delivered Requests{" "}
            <button className="show-hide" onClick={toggleDeliveredVisibility}>
              {isDeliveredVisible ? "Hide" : "Show"}
            </button>
          </h2>
          {isDeliveredVisible && (
            <div className="request-list delivered-requests">
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
    </div>
  );
}

export default Home;
