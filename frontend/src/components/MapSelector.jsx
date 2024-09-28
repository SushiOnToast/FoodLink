import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3VzaGlvbnRvYXN0IiwiYSI6ImNtMW0wM2VnazBoOWMycHF0NGhwdGk4OXIifQ.mfTvxz6r8ESIZCKVibTTJQ";

function MapSelector({ setLatitude, setLongitude }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null); // Use ref for the map instance
  const markerRef = useRef(null); // Use ref for the marker

  useEffect(() => {
    if (mapInstance.current) return; // Prevent re-initializing map on every render

    // Initialize the map
    const initialiseMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [77.5946, 12.9716], // Set to your desired initial location
        zoom: 12, // Adjust zoom level
      });

      // Store the map instance in the ref
      mapInstance.current = map;

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: "Search for an address",
        marker: false, // disable default marker
      });

      map.addControl(geocoder);

      geocoder.on("result", (e) => {
        const { lng, lat } = e.result.center;
        setLatitude(lat);
        setLongitude(lng);

        if (markerRef.current) {
          markerRef.current.remove();
        }

        const newMarker = new mapboxgl.Marker()
          .getLngLat([lng, lat])
          .addTo(map);
        markerRef.current = newMarker;

        map.flyTo({
            center: [lng, lat],
            essential: true
        })
      });

      // Handle click events on the map
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        setLatitude(lat);
        setLongitude(lng);

        // Remove the existing marker if there is one
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Create a new marker and add it to the map
        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
        markerRef.current = newMarker; // Store the new marker in the ref
      });

      // Handle missing images
      map.on("styleimagemissing", (e) => {
        const missingImageId = e.id;
        console.warn(`Image missing: ${missingImageId}`);
      });
    };

    initialiseMap(); // Initialize the map when the component mounts

    // Cleanup function to remove the map instance on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null; // Reset the map instance
      }
    };
  }, [setLatitude, setLongitude]); // Remove 'map' and 'marker' from dependencies

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

export default MapSelector;
