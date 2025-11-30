import React, { useState, useEffect } from "react";

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
};

const windowStyle = {
    width: "420px",
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    maxHeight: "80vh",
    overflowY: "auto",
    fontFamily: "Inter, sans-serif",
    position: "relative"
};

const cardStyle = {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
    border: "1px solid #e2e8f0"
};

const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "22px",
    background: "transparent",
    color: "#333",
    border: "none",
    cursor: "pointer",
    padding: "0px 6px",
    transition: "0.2s"
};

const closeButtonHover = {
    color: "#000"
};


const PendingJobsPopup = ({ delivererId, onClose }) => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        if (!delivererId) return;

        fetch(`http://localhost:5000/api/deliverer/${delivererId}/pending`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Pending jobs:", data);
                setJobs(data);
            })
            .catch((err) => console.error("Error loading jobs:", err));
    }, [delivererId]);

    return (
        <div style={overlayStyle}>
            <div style={windowStyle}>

                {/* Close button */}
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                >
                    ×
                </button>

                <h2>Your Accepted Jobs</h2>

                {jobs.length === 0 ? (
                    <p>No pending jobs.</p>
                ) : (
                    jobs.map(job => (
                        <div key={job.delivery_id} style={cardStyle}>
                            <h3>{job.item_description}</h3>
                            <p><strong>Purchaser:</strong> {job.Purchaser.first_name} {job.Purchaser.last_name}</p>
                            <p><strong>Pickup:</strong> {job.pickup_address}</p>
                            <p><strong>Dropoff:</strong> {job.dropoff_address}</p>
                            <p><strong>Payment:</strong> ${job.proposed_payment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PendingJobsPopup;

