import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Use the Vite environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapView({ latitude, longitude, viewType, donorLocations = [] }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const donorMarkers = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapInstance.current) {
      // Default coordinates if none provided
      const defaultCoords = [longitude || 77.5946, latitude || 12.9716];

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: defaultCoords,
        zoom: 12,
      });

      mapInstance.current = map;

      // Create user marker
      new mapboxgl.Marker().setLngLat(defaultCoords).addTo(map);
    }
  }, []); // Only runs once on mount

  // This effect ensures the map updates when latitude or longitude change
  useEffect(() => {
    if (mapInstance.current && latitude && longitude) {
      // Fly to the new location smoothly
      mapInstance.current.flyTo({
        center: [longitude, latitude],
        essential: true, // Ensures the animation is smooth
        zoom: 12,
      });

      // Update the user marker position
      new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(mapInstance.current);
    }
  }, [latitude, longitude]); // This effect now runs whenever latitude or longitude change

  useEffect(() => {
    if (viewType === "DonorMap" && mapInstance.current) {
      // Clear existing donor markers
      donorMarkers.current.forEach((marker) => marker.remove());
      donorMarkers.current = [];

      // Add new donor markers
      donorLocations.forEach((donor) => {
        const marker = new mapboxgl.Marker({ color: "red" })
          .setLngLat([donor.longitude, donor.latitude])
          .addTo(mapInstance.current);

        // Create a popup but don't add it to the map yet
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        }).setText(donor.first_name);

        marker.setPopup(popup).togglePopup();

        marker.getElement().addEventListener("click", () => {
          navigate(`/profile/${donor.username}/`);
        });

        donorMarkers.current.push(marker);
      });
    }
  }, [donorLocations, viewType]);

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

export default MapView;
