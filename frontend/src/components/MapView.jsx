import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Use the Vite environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapView({ latitude, longitude }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    const initialiseMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude || 77.5946, latitude || 12.9716], // Default coordinates if none provided
        zoom: 12,
      });

      mapInstance.current = map;

      const marker = new mapboxgl.Marker()
        .setLngLat([longitude || 77.5946, latitude || 12.9716]) // Use default coords if none provided
        .addTo(map);
    };

    initialiseMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

export default MapView;
