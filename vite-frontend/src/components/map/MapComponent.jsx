import { useState, useEffect } from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import mapsService from "../../api/mapsService";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const GOOGLE_LIBRARIES = ["places"];

export default function MapComponent() {
  const [googleKey, setGoogleKey] = useState(null);
  const [markers, setMarkers] = useState([]);

  /** --------------------------------------------------
   * 1️⃣ Load Google Maps API key from backend
   -------------------------------------------------- */
  useEffect(() => {
    async function fetchKey() {
      try {
        const res = await mapsService.getMapsKey();

        const key =
          res.key ||
          res.apiKey || // your backend uses this
          res.googleKey;

        console.log("Backend maps key:", res);

        if (!key) {
          console.error("❌ Backend did not return a valid key");
          return;
        }

        setGoogleKey(key);
      } catch (err) {
        console.error("❌ Failed to load Google Maps key:", err);
      }
    }

    fetchKey();
  }, []);

  /** --------------------------------------------------
   * 2️⃣ Load marker positions AFTER the key is ready
   -------------------------------------------------- */
  useEffect(() => {
    if (!googleKey) return;

    async function fetchMarkers() {
      try {
        const data = await mapsService.getMarkers();
        setMarkers(data);
      } catch (err) {
        console.error("❌ Failed to load markers:", err);
      }
    }

    fetchMarkers();
  }, [googleKey]);

  /** --------------------------------------------------
   * 3️⃣ Load Google Maps script (must NOT reload)
   -------------------------------------------------- */
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleKey || "",
    libraries: GOOGLE_LIBRARIES,
  });

  if (!googleKey) return <p className="text-white">Loading maps key…</p>;
  if (!isLoaded) return <p className="text-white">Loading Google Maps…</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: 52.268, lng: -113.811 }} // Red Deer center
      zoom={12}
    >
      {markers.map((m) =>
        m.latitude && m.longitude ? (
          <MarkerF
            key={m.delivery_id}
            position={{ lat: m.latitude, lng: m.longitude }}
            title={m.item_description}
          />
        ) : null
      )}
    </GoogleMap>
  );
}
