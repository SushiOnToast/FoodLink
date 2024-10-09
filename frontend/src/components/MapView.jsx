import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapView({ latitude, longitude, viewType, donorLocations = [], listingLatitude, listingLongitude }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const donorMarkers = useRef([]);
  const directionsControl = useRef(null);
  const navigate = useNavigate();

  // Initialize the map
  useEffect(() => {
    if (!mapInstance.current) {
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
  }, []); 

  // Update the map view if latitude or longitude change
  useEffect(() => {
    if (mapInstance.current && latitude && longitude) {
      mapInstance.current.flyTo({
        center: [longitude, latitude],
        essential: true,
        zoom: 12,
      });

      new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(mapInstance.current);
    }
  }, [latitude, longitude]);

  // Add listing marker if available
  useEffect(() => {
    if (mapInstance.current && listingLatitude && listingLongitude) {
      const listingMarker = new mapboxgl.Marker({ color: "green" })
        .setLngLat([listingLongitude, listingLatitude])
        .addTo(mapInstance.current);

      const listingPopup = new mapboxgl.Popup()
        .setText("Listing Location")
        .setLngLat([listingLongitude, listingLatitude])
        .addTo(mapInstance.current);

      listingMarker.setPopup(listingPopup);
    }
  }, [listingLatitude, listingLongitude]);

  // Add markers for donor locations
  useEffect(() => {
    if (mapInstance.current && donorLocations.length) {
      donorMarkers.current.forEach((marker) => marker.remove()); // Clear old markers
      donorMarkers.current = donorLocations.map((donor) => {
        const marker = new mapboxgl.Marker({ color: "blue" })
          .setLngLat([donor.longitude, donor.latitude])
          .addTo(mapInstance.current);
        marker.getElement().addEventListener('click', () => {
          // Navigate to donor listing page or show details on click
          navigate(`/profile/${donor.username}`);
        });
        return marker;
      });
    }
  }, [donorLocations, navigate]);


  // Optional: Change the map view type based on `viewType` prop (e.g., satellite, streets, etc.)
  useEffect(() => {
    if (mapInstance.current && viewType) {
      const styles = {
        streets: "mapbox://styles/mapbox/streets-v11",
        satellite: "mapbox://styles/mapbox/satellite-v9",
        dark: "mapbox://styles/mapbox/dark-v10",
        light: "mapbox://styles/mapbox/light-v10",
      };
      mapInstance.current.setStyle(styles[viewType] || styles.streets);
    }
  }, [viewType]);

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
}

export default MapView;
