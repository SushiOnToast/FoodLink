import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// Use the Vite environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapSelector({ setLatitude, setLongitude, initialLatitude, initialLongitude }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return; // Prevent re-initialization

    const initialiseMap = (lat, lng) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat], // Use initial coordinates
        zoom: 12,
      });

      mapInstance.current = map;

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: "Search for an address",
        marker: false,
      });

      map.addControl(geocoder);

      // Update marker and coordinates on geocoder search
      geocoder.on("result", (e) => {
        const { lng, lat } = e.result.center;
        updateMarkerAndFlyTo(map, lat, lng);
      });

      // Initialize marker at the user's current location
      if (lat && lng) {
        const userMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
        markerRef.current = userMarker;
      }

      // Update marker and coordinates on map click
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        updateMarkerAndFlyTo(map, lat, lng);
      });

      map.on("styleimagemissing", (e) => {
        const missingImageId = e.id;
        console.warn(`Image missing: ${missingImageId}`);
      });
    };

    // Update the map center and marker
    const updateMarkerAndFlyTo = (map, lat, lng) => {
      setLatitude(lat);
      setLongitude(lng);

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const newMarker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
      markerRef.current = newMarker;

      map.flyTo({
        center: [lng, lat],
        essential: true,
      });
    };

    // Initialise the map with the initial coordinates
    initialiseMap(initialLatitude, initialLongitude);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [initialLatitude, initialLongitude]); // Re-run effect when location updates

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

export default MapSelector;
