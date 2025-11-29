import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from "@react-google-maps/api";
import DeliveryDetails from "./DeliveryDetails";
import RadiusSelector from "./RadiusSelector";

const MapComponent = ({ searchCenter }) => {
    const [apiKey, setApiKey] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [markerPositions, setMarkerPositions] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 43.6532, lng: -79.3832 }); // default
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    //
    // 1. Fetch Google Maps API KEY
    //
    useEffect(() => {
        fetch("http://localhost:5000/api/maps-key")
            .then((res) => res.json())
            .then((data) => {
                console.log("Loaded API Key:", data.key);
                setApiKey(data.key);
            })
            .catch((err) => console.error("API key fetch error:", err));
    }, []);

    //
    // 2. Fetch list of deliveries
    //
    useEffect(() => {
        fetch("http://localhost:5000/api/markers")
            .then((res) => res.json())
            .then((data) => {
                console.log("Deliveries from backend:", data);
                setDeliveries(data);
            })
            .catch((err) => console.error("Error loading deliveries:", err));
    }, []);

    //
    // 3. Geocode each delivery using the Google Geocoder
    //
    useEffect(() => {
        if (!apiKey) return; // wait until key is loaded
        if (!window.google) return; // wait until Maps JS API loaded
        if (!deliveries.length) return; // wait until deliveries loaded

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
                        delivery: d // full database row including User info
                    });

                } catch (err) {
                    console.error("Geocode failed for", d.pickup_address, err);
                }

                await sleep(300); // slow down requests to avoid rate limiting
            }

            console.log("Final marker positions:", positions);
            setMarkerPositions(positions);
        };

        runGeocoding();
    }, [deliveries, apiKey]);

    //
    // 4. Update map center when search bar changes
    //
    useEffect(() => {
        if (searchCenter) {
            console.log("Map recentered to:", searchCenter);
            setMapCenter(searchCenter);
        }
    }, [searchCenter]);

    //
    // 5. Autocomplete load + place changed
    //
    const onLoadAutocomplete = (auto) => {
        console.log("Autocomplete loaded:", auto);
        setAutocomplete(auto);
    };

    const onPlaceChanged = () => {
        if (!autocomplete) return;
        const place = autocomplete.getPlace();
        if (!place || !place.geometry) {
            console.warn("Autocomplete returned no geometry.");
            return;
        }

        const newCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        };

        console.log("User searched for:", newCenter);
        setMapCenter(newCenter);
    };

    //
    // If API key not loaded yet
    //
    if (!apiKey) return <div>Loading map…</div>;

    //
    // FULL MAP RENDER
    //
    return (
        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
            <div style={{ width: "100%", height: "100%", position: "relative" }}>

                {/* 
                    ⭐ FLOATING FLEXBOX SEARCH BAR + RADIUS SELECTOR
                    ON TOP OF THE MAP
                */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        padding: "12px",
                        gap: "12px",
                        zIndex: 9999,
                        pointerEvents: "none" // allow map clicks except inside children
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            background: "white",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            pointerEvents: "auto" // <-- allow clicking inside here
                        }}
                    >
                        {/* AUTOCOMPLETE SEARCH BAR */}
                        <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                            <input
                                type="text"
                                placeholder="Search cities..."
                                style={{
                                    width: "250px",
                                    padding: "8px",
                                    fontSize: "16px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc"
                                }}
                            />
                        </Autocomplete>

                        {/* RADIUS SELECTOR COMPONENT */}
                        <RadiusSelector />
                    </div>
                </div>

                {/* 
                    ⭐ THE GOOGLE MAP ITSELF 
                */}
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={mapCenter}
                    zoom={searchCenter ? 10 : 4}
                >
                    {/* MARKERS */}
                    {markerPositions.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            title={marker.address}
                            onClick={() => setActiveMarker(marker)}
                        />
                    ))}

                    {/* INFO WINDOW FOR SELECTED MARKER */}
                    {activeMarker && (
                        <InfoWindow
                            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
                            onCloseClick={() => setActiveMarker(null)}
                        >
                            <DeliveryDetails delivery={activeMarker.delivery} />
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

export default MapComponent;
