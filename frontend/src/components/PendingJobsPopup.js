import React, { useState, useEffect } from "react";

// --- Color Definitions ---
const primaryBrandGreen = '#1e7145'; // Deep Forest Green (Headers/Text)
const accentGreen = '#4cb64c';     // Vibrant Green (Buttons)
const lightBackground = '#f3fbf3'; // Very Light Greenish-Gray (Card BG)

// --- Styled Component Constants ---

const overlayStyle = {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.6)", // Slightly darker overlay
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
};

const windowStyle = {
    width: "450px", // Slightly wider for readability
    background: "white",
    borderRadius: "12px", // Consistent rounded corners
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)", // Stronger shadow for modal effect
    maxHeight: "90vh", // More screen space
    overflowY: "auto",
    fontFamily: "Roboto, Arial, sans-serif", // Consistent font family
    position: "relative"
};

const cardStyle = {
    background: lightBackground, // Light Greenish-Gray background
    padding: "15px", // Slightly more padding
    borderRadius: "8px",
    marginBottom: "15px",
    border: `1px solid #e0e0e0`, // Subtle border
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // Small lift
};

const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "28px", // Larger and more visible
    color: primaryBrandGreen, // Brand color for the close button
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: '5px',
};

const finishButtonStyle = {
    marginTop: "10px",
    padding: "10px 15px",
    background: accentGreen, // Vibrant Green
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: 'background-color 0.2s',
};

// Style for the main headers
const headerStyle = {
    color: primaryBrandGreen, // Deep Forest Green
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '5px',
    marginBottom: '15px',
    fontSize: '1.8rem',
    fontWeight: '700',
};

// Style for sub-headers (job description)
const jobHeaderStyle = {
    color: primaryBrandGreen,
    fontSize: '1.2rem',
    marginBottom: '5px',
    marginTop: '0',
    fontWeight: '600',
};

const PendingJobsPopup = ({ delivererId, onClose }) => {
    const [pendingJobs, setPendingJobs] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);

    const fetchJobs = () => {
        if (!delivererId) return;

        // Load closed jobs (pending)
        fetch(`http://localhost:5000/api/deliverer/${delivererId}/pending`)
            .then((res) => res.json())
            .then(setPendingJobs)
            .catch(console.error);

        // Load completed jobs
        fetch(`http://localhost:5000/api/deliverer/${delivererId}/completed`)
            .then((res) => res.json())
            .then(setCompletedJobs)
            .catch(console.error);
    };

    useEffect(() => {
        fetchJobs();
    }, [delivererId]);

    const finishDelivery = async (deliveryId) => {
        try {
            await fetch(`http://localhost:5000/api/deliverer/${deliveryId}/complete`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deliveryId: deliveryId })
            });
            
            // Refresh both lists after successful update
            fetchJobs();

        } catch (err) {
            console.error("Error finishing delivery:", err);
        }
    };


    return (
        <div style={overlayStyle}>
            <div style={windowStyle}>

                <button onClick={onClose} style={closeButtonStyle}>×</button>

                <h2 style={headerStyle}>Your Current Deliveries</h2>

                {pendingJobs.length === 0 ? (
                    <p style={{ color: '#7f8c8d' }}>You have no deliveries currently in progress.</p>
                ) : (
                    pendingJobs.map(job => (
                        <div key={job.deliveryId} style={cardStyle}>
                            <h3 style={jobHeaderStyle}>{job.itemDescription}</h3>
                            <p style={{margin: '0 0 5px 0'}}><strong>Purchaser:</strong> {job.Purchaser.first_name} {job.Purchaser.last_name}</p>
                            <p style={{margin: '0 0 5px 0'}}><strong>Pickup:</strong> {job.pickupAddress}</p>
                            <p style={{margin: '0 0 5px 0'}}><strong>Dropoff:</strong> {job.dropoffAddress}</p>
                            <p style={{margin: '0 0 5px 0'}}><strong>Payment:</strong> **${job.proposedPayment}**</p>

                            <button
                                style={finishButtonStyle}
                                onClick={() => finishDelivery(job.deliveryId)}
                            >
                                Finish Delivery
                            </button>
                        </div>
                    ))
                )}

                <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '20px 0' }} />

                <h2 style={headerStyle}>Completed Deliveries</h2>

                {completedJobs.length === 0 ? (
                    <p style={{ color: '#7f8c8d' }}>No deliveries have been completed yet.</p>
                ) : (
                    completedJobs.map(job => (
                        <div key={job.deliveryId} style={cardStyle}>
                            <h3 style={jobHeaderStyle}>{job.itemDescription}</h3>
                            <p style={{margin: '0 0 5px 0'}}><strong>Purchaser:</strong> {job.Purchaser.first_name} {job.Purchaser.last_name}</p>
                            <p style={{margin: '0 0 5px 0'}}><strong>Pickup:</strong> {job.pickupAddress}</p>
                            <p style={{margin: '0 0 5px 0'}}><strong>Dropoff:</strong> {job.dropoffAddress}</p>
                            <p style={{margin: '0 0 5px 0'}}><strong>Payment:</strong> **${job.proposedPayment}**</p>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default PendingJobsPopup;