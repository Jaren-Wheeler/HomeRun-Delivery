import { useState, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";

import DeliveryDetailsCard from "../deliverer/DeliveryDetailsCard";
import RadiusSelector from "./RadiusSelector";
import { loadGoogleMaps } from "../../lib/loadGoogleMaps"; // we'll create this



export default function MapComponent({ searchCenter }) {
  const [apiKey, setApiKey] = useState(null);
  const [mapsReady, setMapsReady] = useState(false);

  const [deliveries, setDeliveries] = useState([]);
  const [markerPositions, setMarkerPositions] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [radius, setRadius] = useState(null);

  const [mapCenter, setMapCenter] = useState({
    lat: 43.6532,
    lng: -79.3832,
  });

  //
  // 1. Load API key
  //
  useEffect(() => {
    fetch("http://localhost:5000/api/maps/maps-key")
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.apiKey);
      })
      .catch((err) => console.error("Failed to load key:", err));
  }, []);

  //
  // 2. Load Google Maps script manually (NO DUPLICATES)
  //
  useEffect(() => {
    if (!apiKey) return;

    loadGoogleMaps(apiKey)
      .then(() => {
        setMapsReady(true);
      })
      .catch((err) => console.error("Google Maps failed:", err));
  }, [apiKey]);

  //
  // 3. Load deliveries from backend
  //
  useEffect(() => {
    fetch("http://localhost:5000/api/maps/markers")
      .then((r) => r.json())
      .then((data) => setDeliveries(data))
      .catch((err) => console.error("Error loading deliveries:", err));
  }, []);

  //
  // 4. Geocode all markers once maps + deliveries are ready
  //
  useEffect(() => {
    if (!mapsReady || !deliveries.length) return;

    const geocoder = new window.google.maps.Geocoder();

    async function geocodeAll() {
      const positions = [];

      for (const d of deliveries) {
        try {
          const result = await geocoder.geocode({ address: d.pickup_address });

          if (!result?.results?.length) continue;

          positions.push({
            id: d.delivery_id,
            lat: result.results[0].geometry.location.lat(),
            lng: result.results[0].geometry.location.lng(),
            address: d.pickup_address,
            delivery: d,
          });
        } catch (err) {
          console.error("Geocode error:", err);
        }
      }

      setMarkerPositions(positions);
    }

    geocodeAll();
  }, [mapsReady, deliveries]);

  //
  // 5. Handle Place Autocomplete
  //
  const onAutocompleteLoaded = (ac) => setAutocomplete(ac);

  const onPlaceChanged = () => {
    const place = autocomplete?.getPlace();
    if (!place?.geometry) return;

    setMapCenter({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  //
  // 6. Radius filter (unchanged logic)
  //
  const filteredMarkers = markerPositions.filter((m) => {
    if (!radius) return true;

    const R = 6371;
    const dLat = ((m.lat - mapCenter.lat) * Math.PI) / 180;
    const dLng = ((m.lng - mapCenter.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(mapCenter.lat * Math.PI / 180) *
        Math.cos(m.lat * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;

    const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return distance <= radius;
  });

  //
  // Loading states
  //
  if (!apiKey) return <div>Loading Google Maps API key…</div>;
  if (!mapsReady) return <div>Loading Google Maps…</div>;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Floating Search + Radius Box */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "10px",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <Autocomplete
            onLoad={onAutocompleteLoaded}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search cities…"
              style={{
                width: "240px",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </Autocomplete>

          <RadiusSelector onChange={(km) => setRadius(km)} />
        </div>
      </div>

      {/* Actual Map */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={searchCenter ? 10 : 4}
      >
        {filteredMarkers.map((m) => (
          <MarkerF
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            onClick={() => setActiveMarker(m)}
          />
        ))}

        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <DeliveryDetailsCard delivery={activeMarker.delivery} />
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
