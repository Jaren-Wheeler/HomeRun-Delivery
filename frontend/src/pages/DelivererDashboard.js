import { useState } from 'react';
import MapComponent from '../components/MapComponent';
import PendingJobsPopup from '../components/PendingJobsPopup';

const buttonStyle = {
  backgroundColor: "#2563EB",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "500",
  transition: "0.2s",
};

const buttonHover = {
  backgroundColor: "#1D4ED8" // darker blue hover
};

const DelivererDashboard = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [searchCenter, setSearchCenter] = useState(null);
    const [showPendingJobs, setShowPendingJobs] = useState(false);


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
     
            <div style={{ display: 'flex', flexDirection: 'column', height: "100vh", gap: '1rem'}}>
                
                <div style={{ height: '10vh', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ textAlign: "center",fontSize: "1.75rem", fontWeight: "600", color: "#1F2937"}}>Find Jobs</h2>

                    <div style={{ display: 'flex', width: '100%', justifyContent: "space-between" }}>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button 
                                style={buttonStyle}
                                onMouseOver={(e) => Object.assign(e.target.style, buttonHover)}
                                onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
                                onClick={() => setShowPendingJobs(true)}
                            >
                                Your Jobs
                            </button>
                            <button 
                                style={buttonStyle}
                            >
                                Job Finder
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Component */}
                <MapComponent searchCenter={searchCenter} style={{ height: '90vh' }} />

                {/* Open Pending Jobs Component */}
                {showPendingJobs && (
                    <PendingJobsPopup
                        delivererId={3} /* Must fetch the current id of the logged in user */
                        onClose={() => setShowPendingJobs(false)}
                />
)}
            </div>

    );
};

export default DelivererDashboard;
