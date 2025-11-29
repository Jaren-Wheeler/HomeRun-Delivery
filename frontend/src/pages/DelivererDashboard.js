import { useState } from 'react';
import MapComponent from '../components/MapComponent';
import DelivererOptions from '../components/DelivererOptions';


const DelivererDashboard = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [searchCenter, setSearchCenter] = useState(null);
    const [selectedRadius, setSelectedRadius] = useState(20); // default 20 km

    const onLoad = (auto) => {
        setAutocomplete(auto);
    };

    const onPlaceChanged = () => {
        if (!autocomplete) return;

        const place = autocomplete.getPlace();
        if (!place?.geometry) return;

        setSearchCenter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
        });
    };

    return (
     
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', gap: '1rem' }}>
                
                <div style={{ height: '10vh', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ textAlign: "center" }}>Find Jobs</h2>

                    <div style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}>
                        <div style={{ alignSelf: "flex-end", marginRight: '1rem' }}>
                            <DelivererOptions />
                        </div>
                    </div>
                </div>

                {/* Map Component */}
                <MapComponent searchCenter={searchCenter} style={{ height: '90vh' }} />

            </div>

    );
};

export default DelivererDashboard;
