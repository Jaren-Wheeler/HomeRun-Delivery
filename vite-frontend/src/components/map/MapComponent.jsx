import { useState, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";

import DeliveryDetailsCard from "../deliverer/DeliveryDetailsCard";
import RadiusSelector from "./RadiusSelector";
import { loadGoogleMaps } from "../../lib/loadGoogleMaps";

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

  // ----------------------------------------------------------
  // 1. Load API Key
  // ----------------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:5000/api/maps/maps-key")
      .then((res) => res.json())
      .then((data) => setApiKey(data.apiKey))
      .catch((err) => console.error("Failed to load key:", err));
  }, []);

  // ----------------------------------------------------------
  // 2. Load Google Maps Script
  // ----------------------------------------------------------
  useEffect(() => {
    if (!apiKey) return;

    loadGoogleMaps(apiKey)
      .then(() => setMapsReady(true))
      .catch((err) => console.error("Google Maps failed:", err));
  }, [apiKey]);

  // ----------------------------------------------------------
  // 3. Load open deliveries
  // ----------------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:5000/api/maps/markers")
      .then((r) => r.json())
      .then((data) => setDeliveries(data))
      .catch((err) => console.error("Error loading deliveries:", err));
  }, []);

  // ----------------------------------------------------------
  // 4. Convert delivery addresses → coordinates
  // ----------------------------------------------------------
  useEffect(() => {
    if (!mapsReady || !deliveries.length) return;

    const geocoder = new window.google.maps.Geocoder();

    async function geocodeAll() {
      const positions = [];

      for (const d of deliveries) {
        try {
          const result = await geocoder.geocode({
            address: d.pickupAddress, // FIXED camelCase
          });

          if (!result?.results?.length) continue;

          positions.push({
            id: d.deliveryId,
            lat: result.results[0].geometry.location.lat(),
            lng: result.results[0].geometry.location.lng(),
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

  // ----------------------------------------------------------
  // 5. Autocomplete
  // ----------------------------------------------------------
  const onAutocompleteLoaded = (ac) => setAutocomplete(ac);

  const onPlaceChanged = () => {
    const place = autocomplete?.getPlace();
    if (!place?.geometry) return;

    setMapCenter({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  // ----------------------------------------------------------
  // 6. Radius Filter
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // Loading States
  // ----------------------------------------------------------
  if (!apiKey) return <div>Loading Google Maps API key…</div>;
  if (!mapsReady) return <div>Loading Google Maps…</div>;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="w-full h-full relative">

      {/* Float Search + Radius Box */}
      <div className="absolute top-0 left-0 w-full flex justify-center pt-4 z-50">
        <div className="flex gap-3 bg-white shadow-lg rounded-xl px-4 py-3 items-center">

          <Autocomplete onLoad={onAutocompleteLoaded} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Search cities…"
              className="
                w-60 px-3 py-2 rounded-md
                border border-gray-300
                text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </Autocomplete>

          <RadiusSelector onChange={(km) => setRadius(km)} />
        </div>
      </div>

      {/* MAP */}
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
            options={{
              pixelOffset: new window.google.maps.Size(0, -35), // lifts box above pin
            }}
          >
            <div className="p-0 bg-transparent">
              <div className="bg-slate-900 p-4 rounded-xl shadow-lg text-white w-64">
                <DeliveryDetailsCard delivery={activeMarker.delivery} />
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
