import React, { useState, useEffect } from "react";
import api from "../../api";
import Request from "../../components/Request";
import LoadingIndicator from "../../components/LoadingIndicator";
import tokens from "../../constants";

function Home() {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem(tokens.USER_ROLE);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const url = userRole === "donor" ? "/api/listings/requests" : "/api/requests/recipient";
    try {
      const response = await api.get(url);
      const allRequests = response.data;

      // Separate accepted and pending requests
      const accepted = allRequests.filter((request) => request.status === "accepted");
      const pending = allRequests.filter((request) => request.status !== "accepted");

      setAcceptedRequests(accepted);
      setPendingRequests(pending);
      
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="home-page">
      <h1>Home</h1>

      {/* Accepted Requests Section */}
      <section>
        <h2>Accepted Requests</h2>
        {acceptedRequests.length > 0 ? (
          acceptedRequests.map((request) => (
            <Request key={request.id} request={request} />
          ))
        ) : (
          <p>No accepted requests found</p>
        )}
      </section>

      {/* Pending Requests Section */}
      <section>
        <h2>Pending Requests</h2>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <Request key={request.id} request={request} />
          ))
        ) : (
          <p>No pending requests found</p>
        )}
      </section>
    </div>
  );
}

export default Home;
