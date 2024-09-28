import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VzaGlvbnRvYXN0IiwiYSI6ImNtMW0wM2VnazBoOWMycHF0NGhwdGk4OXIifQ.mfTvxz6r8ESIZCKVibTTJQ";

function MapView({ latitude, longitude }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return; // Prevent re-initializing the map

    const initialiseMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current, // Fix typo here
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude || 77.5946, latitude || 12.9716], // Default coordinates if none provided
        zoom: 12,
      });

      mapInstance.current = map;

      // Add a marker at the given latitude and longitude
      const marker = new mapboxgl.Marker()
        .setLngLat([longitude || 77.5946, latitude || 12.9716]) // Use default coords if none provided
        .addTo(map);
    };

    initialiseMap(); // Initialize the map when the component mounts

    // Cleanup function to remove the map instance on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null; // Reset the map instance
      }
    };
  }, [latitude, longitude]); // Re-run effect if latitude or longitude changes

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

export default MapView;
