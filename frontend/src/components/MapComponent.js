import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import DeliveryDetails from "./DeliveryDetails";


const MapComponent = () => {
  const [apiKey, setApiKey] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [markerPositions, setMarkerPositions] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  // 1. Load Google Maps API Key
  useEffect(() => {
    fetch("http://localhost:5000/api/maps-key")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded API Key:", data.key);
        setApiKey(data.key);
      })
      .catch((err) => console.error("API key fetch error:", err));
  }, []);

  // 2. Load delivery rows
  useEffect(() => {
    fetch("http://localhost:5000/api/markers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Deliveries from backend:", data);
        setDeliveries(data);
      })
      .catch((err) => console.error("Error loading deliveries:", err));
  }, []);

  // 3. Geocode whenever deliveries OR apiKey change
  useEffect(() => {
    if (!apiKey) return; // wait for Google Maps key
    if (!window.google) return; // wait for Google Maps script
    if (!deliveries.length) return; // wait for backend data

    console.log("Re-running geocoding because deliveries are available.");

    const geocoder = new window.google.maps.Geocoder();

    const runGeocoding = async () => {
      const positions = [];

      for (const d of deliveries) {
        console.log("Geocoding:", d.pickup_address);

        try {
          const result = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: d.pickup_address }, (res, status) => {
              if (status === "OK") resolve(res);
              else reject(status);
            });
          });

          positions.push({
            id: d.delivery_id,
            lat: result[0].geometry.location.lat(),
            lng: result[0].geometry.location.lng(),
            address: d.pickup_address,
          });

        } catch (err) {
          console.error("Geocode failed for", d.pickup_address, err);
        }

        await sleep(300)
      }

      console.log("Final marker positions:", positions);
      setMarkerPositions(positions);
    };

    runGeocoding();
  }, [deliveries, apiKey]);

  if (!apiKey) return <div>Loading Map…</div>;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "800px" }}
        center={{ lat: 43.6532, lng: -79.3832 }} // Toronto
        zoom={4}
      >
        {markerPositions.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.address}
            onClick={() => setActiveMarker(marker)}
          />
        ))}

        {activeMarker && (
            <InfoWindow
                position={{lat: activeMarker.lat, lng: activeMarker.lng}}
                onCloseClick={() =>setActiveMarker(null)}>
                    <DeliveryDetails></DeliveryDetails>
            </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
