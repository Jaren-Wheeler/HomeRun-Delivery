import { useState } from 'react';
import MapComponent from '../components/MapComponent';
import PendingJobsPopup from '../components/PendingJobsPopup';
import NavBar from '../components/NavBar';

const DelivererDashboard = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [searchCenter, setSearchCenter] = useState(null);
    const [showPendingJobs, setShowPendingJobs] = useState(false);

    // get user id and role of the currently logged in user
    const delivererId = sessionStorage.getItem("user_id");
    const role = sessionStorage.getItem("role");

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
                <NavBar></NavBar>
                <div style={{ height: '10vh', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ textAlign: "center" }}>Find Jobs</h2>

                    <div style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button onClick={() => setShowPendingJobs(true)}>Your Jobs</button>
                            <button>Job Finder</button>
                        </div>
                    </div>
                </div>

                {/* Map Component */}
                <MapComponent searchCenter={searchCenter} style={{ height: '90vh' }} />

                {/* Open Pending Jobs Component */}
                {showPendingJobs && (
                    <PendingJobsPopup
                        delivererId={Number(delivererId)} /* Must fetch the current id of the logged in user */
                        onClose={() => setShowPendingJobs(false)}
                />
)}
            </div>

    );
};

export default DelivererDashboard;
