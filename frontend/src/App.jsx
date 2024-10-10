import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";

// Non-authorised pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

// Authorised pages
import Home from "./pages/authorised/Home";
import ProfileView from "./pages/authorised/ProfileView";
import EditProfile from "./pages/authorised/EditProfile";
import EditListing from "./pages/authorised/EditListing";
import EditResource from "./pages/authorised/EditResource";
import Listings from "./pages/authorised/Listings";
import Resources from "./pages/authorised/Resources";
import DonorListings from "./pages/authorised/DonorListings";
import DonorResources from "./pages/authorised/DonorResources";
import ListingDetails from "./pages/authorised/ListingDetails";
import RequestDetails from "./pages/authorised/RequestDetails";
import ResourceDetails from "./pages/authorised/ResourceDetails";

function Logout() {
  localStorage.clear();
  return <Navigate to="/landing" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings"
            element={
              <ProtectedRoute>
                <Listings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/yourlistings"
            element={
              <ProtectedRoute>
                <DonorListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/yourResources"
            element={
              <ProtectedRoute>
                <DonorResources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/:listingId"
            element={
              <ProtectedRoute>
                <ListingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listings/:listingId/edit"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/:requestId"
            element={
              <ProtectedRoute>
                <RequestDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/:resourceId"
            element={
              <ProtectedRoute>
                <ResourceDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/:resourceId/edit"
            element={
              <ProtectedRoute>
                <EditResource />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
