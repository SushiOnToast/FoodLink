import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// Use the Vite environment variable for the Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapSelector({
  setLatitude,
  setLongitude,
  initialLatitude,
  initialLongitude,
}) {
  const mapContainer = useRef(null); // Reference to the map container DOM element
  const mapInstance = useRef(null); // Store the map instance to prevent re-initialization
  const markerRef = useRef(null); // Store a reference to the marker

  useEffect(() => {
    // Ensure the map is only initialized once
    if (mapInstance.current) return;

    const lat = initialLatitude ?? 0; // Default latitude if not provided
    const lng = initialLongitude ?? 0; // Default longitude if not provided

    // Initialize the Mapbox map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: initialLatitude && initialLongitude ? 12 : 2, // Zoom out if no initial coordinates
    });

    mapInstance.current = map; // Store the map instance

    // Initialize the Geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for an address",
      marker: false, // Disable the default marker
    });

    // Add the geocoder control to the map
    map.addControl(geocoder);

    // Handle the geocoder result event to update the marker position
    geocoder.on("result", (e) => {
      const { lng, lat } = e.result.center;
      updateMarkerAndFlyTo(map, lat, lng, 14); // Fly the map and update the marker
    });

    // Add a marker if initial latitude and longitude are provided
    if (lat && lng) {
      const initialMarker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
      markerRef.current = initialMarker; // Store the marker reference
    }

    // Update marker position on map click
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      updateMarkerAndFlyTo(map, lat, lng, 14); // Fly and update with zoom 14
    });

    // Cleanup map instance on component unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []); // Empty dependency array to run this effect only once

  // Function to update the marker position and fly the map
  const updateMarkerAndFlyTo = (map, lat, lng, zoom = 12) => {
    if (!isNaN(lat) && !isNaN(lng)) {
      setLatitude(lat); // Update latitude in parent component
      setLongitude(lng); // Update longitude in parent component

      // Remove the previous marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create and add a new marker at the new coordinates
      const newMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      markerRef.current = newMarker; // Update marker reference

      // Fly the map to the new coordinates smoothly with adjustable zoom
      map.flyTo({
        center: [lng, lat],
        zoom: zoom, // Set zoom level
        essential: true, // Ensures the animation is considered essential
      });
    }
  };

  return (
    <div>
      {/* Map container with a defined size */}
      <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

export default MapSelector;
