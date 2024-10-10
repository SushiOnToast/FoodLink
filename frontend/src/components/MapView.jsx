import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set Mapbox access token using environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapView({
  latitude,
  longitude,
  viewType,
  donorLocations = [],
  listingLatitude,
  listingLongitude,
}) {
  // Refs to store map container, map instance, markers, and popup
  const mapContainer = useRef(null);
  const mapInstance = useRef(null); // For storing the Mapbox instance
  const donorMarkers = useRef([]); // For keeping track of donor markers
  const popup = useRef(null); // For a persistent popup on the map
  const navigate = useNavigate(); // React router hook for navigation

  // Initialize the map only once when the component mounts
  useEffect(() => {
    if (!mapInstance.current) {
      // Set default coordinates (Bangalore by default if no lat/lng)
      const defaultCoords = [longitude || 77.5946, latitude || 12.9716];

      // Create a new Mapbox map instance
      const map = new mapboxgl.Map({
        container: mapContainer.current, // Reference to the div containing the map
        style: "mapbox://styles/mapbox/streets-v11", // Default map style
        center: defaultCoords, // Initial map center
        zoom: 12, // Initial zoom level
      });

      mapInstance.current = map; // Store map instance for future use

      // Add a marker to indicate the user's current location
      new mapboxgl.Marker().setLngLat(defaultCoords).addTo(map);
    }
  }, [latitude, longitude]); // Run this effect when latitude or longitude changes

  // Fly to updated coordinates when latitude or longitude changes
  useEffect(() => {
    if (mapInstance.current && latitude && longitude) {
      // Fly smoothly to the updated coordinates
      mapInstance.current.flyTo({
        center: [longitude, latitude], // Set new center
        essential: true, // Make this an essential animation
        zoom: 12, // Maintain zoom level
      });

      // Add a new marker at the updated location
      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(mapInstance.current);
    }
  }, [latitude, longitude]); // Trigger re-fly when lat/lng changes

  // Add or update the listing marker, if listing coordinates are provided
  useEffect(() => {
    if (mapInstance.current && listingLatitude && listingLongitude) {
      // Remove any existing popup before adding a new one
      if (popup.current) {
        popup.current.remove();
      }

      // Create a new green marker at the listing's location
      const listingMarker = new mapboxgl.Marker({ color: "green" })
        .setLngLat([listingLongitude, listingLatitude])
        .addTo(mapInstance.current);

      // Add a popup to the listing marker indicating the location
      const listingPopup = new mapboxgl.Popup()
        .setText("Listing Location") // Popup text
        .setLngLat([listingLongitude, listingLatitude]) // Popup position
        .addTo(mapInstance.current); // Attach the popup to the map

      // Link the marker and popup together
      listingMarker.setPopup(listingPopup);
    }
  }, [listingLatitude, listingLongitude]); // Run when listing coordinates are updated

  // Add markers for donor locations, updating when donorLocations changes
  useEffect(() => {
    if (mapInstance.current && donorLocations.length) {
      // Remove existing donor markers before adding new ones
      donorMarkers.current.forEach((marker) => marker.remove());

      // Iterate over each donor location to create a new marker
      donorMarkers.current = donorLocations.map((donor) => {
        // Create a blue marker for each donor
        const marker = new mapboxgl.Marker({ color: "blue" })
          .setLngLat([donor.longitude, donor.latitude]) // Set marker position
          .addTo(mapInstance.current); // Attach marker to the map

        // Add click event listener to display a popup on marker click
        marker.getElement().addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent map click from firing

          // Remove any existing popup before creating a new one
          if (popup.current) {
            popup.current.remove();
          }

          // Create a persistent popup with donor information and a button
          popup.current = new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat([donor.longitude, donor.latitude]) // Position of the popup
            .setHTML(
              `
              <div>
                <strong>${donor.username}</strong><br />
                <button style="margin-top: 5px; cursor: pointer;">View Profile</button>
              </div>
            `
            )
            .addTo(mapInstance.current); // Add popup to the map

          // Add click event listener to the "View Profile" button in the popup
          const button = popup.current.getElement().querySelector("button");
          if (button) {
            button.addEventListener("click", () => {
              navigate(`/profile/${donor.username}`); // Navigate to donor's profile page
            });
          }
        });

        return marker; // Return the created marker
      });
    }
  }, [donorLocations, navigate]); // Re-run when donor locations or navigate changes

  // Change map style (viewType) when it changes, e.g., satellite, dark, etc.
  useEffect(() => {
    if (mapInstance.current && viewType) {
      // Define available map styles
      const styles = {
        streets: "mapbox://styles/mapbox/streets-v11",
        satellite: "mapbox://styles/mapbox/satellite-v9",
        dark: "mapbox://styles/mapbox/dark-v10",
        light: "mapbox://styles/mapbox/light-v10",
      };

      // Update the map style to the selected viewType
      mapInstance.current.setStyle(styles[viewType] || styles.streets); // Default to streets
    }
  }, [viewType]); // Re-run if viewType prop changes

  // Return the map container which will display the map
  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
}

export default MapView;
