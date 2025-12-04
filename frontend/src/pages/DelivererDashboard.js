import React, { useState } from 'react';
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

    // --- Color Definitions ---
    const primaryBrandGreen = '#1e7145'; // Deep Forest Green
    const accentGreen = '#4cb64c';     // Vibrant Green
    const lightBackground = '#f3fbf3'; // Very Light Greenish-Gray

    // --- Style Definitions ---
    const styles = {
        // Main container must use flex to manage vertical space
        pageContainer: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            fontFamily: 'Roboto, Arial, sans-serif',
            backgroundColor: lightBackground, 
            padding: '0',
            margin: '0',
        },
        
        // Header Area Container (Below NavBar)
        headerArea: {
            backgroundColor: primaryBrandGreen,
            color: 'white',
            padding: '2rem 3rem 1.5rem',
            // Note: No margin-bottom here
        },

        mainTitle: {
            fontSize: "2.2rem",
            fontWeight: "700",
            margin: "0",
            textAlign: "left",
        },

        // Control Bar Container
        controlBar: {
            display: 'flex',
            justifyContent: "space-between",
            alignItems: 'center',
            padding: '1rem 3rem',
            backgroundColor: lightBackground, // Set to match the page background
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)', 
            // FIX: Remove margin-bottom to connect seamlessly
            marginBottom: '0', 
            zIndex: 2, // Ensure it overlaps the map slightly if margins were tricky
        },

        buttonGroup: {
            display: 'flex',
            gap: '0.75rem',
        },

        baseButton: {
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'background-color 0.2s, opacity 0.2s',
        },

        primaryButton: {
            backgroundColor: primaryBrandGreen,
            color: 'white',
            border: `1px solid ${primaryBrandGreen}`,
        },

        secondaryButton: {
            backgroundColor: 'transparent',
            color: primaryBrandGreen,
            border: `1px solid ${primaryBrandGreen}`,
        },

        // Map Container
        mapContainer: {
            flexGrow: 1, 
            // FIX: Remove all margin to fill the remaining space seamlessly
            margin: '0', 
            borderRadius: '0', // FIX: Remove border radius so the top edge is square against the control bar
            overflow: 'hidden',
            boxShadow: '0', // Optional: Remove shadow if you want it completely flat
            minHeight: '60vh', 
        }
    };

    // --- Logic (UNCHANGED) ---
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

    // --- Render Component ---
    return (
        <div style={styles.pageContainer}>
            <NavBar />
            
            <div style={styles.headerArea}>
                <h1 style={styles.mainTitle}>Deliverer Dashboard</h1>
            </div>

            {/* CONTROL BAR (Now seamless with Map background) */}
            <div style={styles.controlBar}>
                <div style={styles.buttonGroup}>
                    {/* Primary Button: Your Jobs */}
                    <button 
                        onClick={() => setShowPendingJobs(true)}
                        style={{...styles.baseButton, ...styles.primaryButton}}
                    >
                        Your Jobs
                    </button>
                    
                    {/* Secondary Button: Job Finder (Active Map View) */}
                    <button 
                        style={{...styles.baseButton, ...styles.secondaryButton}}
                    >
                        Job Finder
                    </button>
                </div>
            </div>

            {/* Map Component Container (Seamlessly follows control bar) */}
            <div style={styles.mapContainer}>
                <MapComponent searchCenter={searchCenter} style={{ height: '100%' }} /> 
            </div>

            {/* Open Pending Jobs Component */}
            {showPendingJobs && (
                <PendingJobsPopup
                    delivererId={Number(delivererId)}
                    onClose={() => setShowPendingJobs(false)}
                />
            )}
        </div>
    );
};

export default DelivererDashboard;