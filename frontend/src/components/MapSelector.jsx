import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

// Use the Vite environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapSelector({ setLatitude, setLongitude }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    const initialiseMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [77.5946, 12.9716], // Set to your desired initial location
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

      geocoder.on("result", (e) => {
        const { lng, lat } = e.result.center;
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
      });

      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        setLatitude(lat);
        setLongitude(lng);

        if (markerRef.current) {
          markerRef.current.remove();
        }

        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
        markerRef.current = newMarker;
      });

      map.on("styleimagemissing", (e) => {
        const missingImageId = e.id;
        console.warn(`Image missing: ${missingImageId}`);
      });
    };

    initialiseMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [setLatitude, setLongitude]);

  return (
    <div>
      <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

export default MapSelector;
