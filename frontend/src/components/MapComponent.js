import {React, useState, useEffect} from 'react';

import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

const MapComponent = () => {

    const [apiKey, setApiKey] = useState(null);

    // fetch the google maps API key from the backend
    useEffect(() => {
    console.log("Fetching API key...");
    fetch('http://localhost:5000/api/maps-key')
        .then(res => res.json())
        .then(data => {
        console.log("API key received:", data.key);
        setApiKey(data.key);
        })
        .catch(err => {
        console.error("Failed to fetch API key:", err);
        setApiKey('YOUR_REAL_KEY'); // fallback
        });
    }, []);


    if (!apiKey) return <div>Loading Map...</div>

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap mapContainerStyle={{width: '100%', height: '800px'}}
                center={{ lat: 40.7128, lng: -74.0060 }}
                zoom={12}
            >
                <Marker position={{ lat: 40.7128, lng: -74.0060 }} />
                
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;