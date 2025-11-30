import React, { useState, useEffect } from "react";

const overlayStyle = {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
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
    border: "none",
    cursor: "pointer"
};

const finishButtonStyle = {
    marginTop: "8px",
    padding: "8px 12px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
};

const PendingJobsPopup = ({ delivererId, onClose }) => {
    const [pendingJobs, setPendingJobs] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);

    useEffect(() => {
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
    }, [delivererId]);

    const finishDelivery = async (deliveryId) => {
        try {
            await fetch(`http://localhost:5000/api/deliveries/${deliveryId}/complete`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });

            // Now REFRESH both lists from backend
            const pending = await fetch(`http://localhost:5000/api/deliverer/${delivererId}/pending`).then(r => r.json());
            const completed = await fetch(`http://localhost:5000/api/deliverer/${delivererId}/completed`).then(r => r.json());

            setPendingJobs(pending);
            setCompletedJobs(completed);

        } catch (err) {
            console.error("Error finishing delivery:", err);
        }
    };


    return (
        <div style={overlayStyle}>
            <div style={windowStyle}>

                <button onClick={onClose} style={closeButtonStyle}>×</button>

                <h2>Your Current Deliveries</h2>

                {pendingJobs.length === 0 ? (
                    <p>No pending jobs.</p>
                ) : (
                    pendingJobs.map(job => (
                        <div key={job.delivery_id} style={cardStyle}>
                            <h3>{job.item_description}</h3>
                            <p><strong>Purchaser:</strong> {job.Purchaser.first_name} {job.Purchaser.last_name}</p>
                            <p><strong>Pickup:</strong> {job.pickup_address}</p>
                            <p><strong>Dropoff:</strong> {job.dropoff_address}</p>
                            <p><strong>Payment:</strong> ${job.proposed_payment}</p>

                            <button
                                style={finishButtonStyle}
                                onClick={() => finishDelivery(job.delivery_id)}
                            >
                                Finish Delivery
                            </button>
                        </div>
                    ))
                )}

                <hr />

                <h2>Completed Deliveries</h2>

                {completedJobs.length === 0 ? (
                    <p>No completed jobs.</p>
                ) : (
                    completedJobs.map(job => (
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
