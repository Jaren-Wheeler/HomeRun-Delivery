import { useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from '@react-google-maps/api';
import mapsService from '../../api/mapsService';
import DeliveryDetailsCard from '../deliverer/DeliveryDetailsCard';

const containerStyle = {
  width: '100%',
  height: '100%',
};

export default function MapComponent() {
  const [markers, setMarkers] = useState([]);
  const [googleKey, setGoogleKey] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Load Google Maps API key from backend
  useEffect(() => {
    async function fetchKey() {
      try {
        const res = await mapsService.getMapsKey();
        setGoogleKey(res.key);
      } catch (err) {
        console.error('Failed fetching maps key:', err);
      }
    }
    fetchKey();
  }, []);

  // Load script after key exists
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleKey,
  });

  // Load open delivery markers from backend
  useEffect(() => {
    if (!isLoaded) return;

    async function loadMarkers() {
      try {
        const data = await mapsService.getMarkers();
        setMarkers(data);
      } catch (err) {
        console.error('Loading markers failed:', err);
      }
    }

    loadMarkers();
  }, [isLoaded]);

  if (!googleKey)
    return <p className="text-center text-gray-400">Loading key…</p>;
  if (!isLoaded)
    return <p className="text-center text-gray-400">Loading map…</p>;

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        center={{ lat: 53.5461, lng: -113.4938 }} // Edmonton default
      >
        {/* Markers */}
        {markers.map((m) => (
          <Marker
            key={m.delivery_id}
            position={{
              lat: m.latitude ?? 53.5461,
              lng: m.longitude ?? -113.4938,
            }}
            onClick={() => setSelectedMarker(m)}
          />
        ))}

        {/* Dark Popup */}
        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.latitude,
              lng: selectedMarker.longitude,
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-0 m-0">
              <DeliveryDetailsCard delivery={selectedMarker} />
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
