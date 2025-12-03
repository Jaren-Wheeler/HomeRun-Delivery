import React from "react";

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
    width: "400px",
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontFamily: "Inter, sans-serif"
};

const closeButton = {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px"
};

export default function RateDeliveryPopup({ delivery, onClose }) {
    if (!delivery) return null;

    return (
        <div style={overlayStyle}>
            <div style={windowStyle}>
                <h2 style={{ marginBottom: "12px" }}>
                    Delivery #{delivery.delivery_id}
                </h2>

                <p><strong>Pickup:</strong> {delivery.pickup_address}</p>
                <p><strong>Dropoff:</strong> {delivery.dropoff_address}</p>
                <p><strong>Description:</strong> {delivery.item_description}</p>
                <p><strong>Payment:</strong> ${delivery.proposed_payment}</p>
                <p><strong>Status:</strong> {delivery.status}</p>

                {/* placeholder for future rating UI */}
                <p style={{ marginTop: "15px", fontStyle: "italic", color: "#666" }}>
                    Rating options will go here.
                </p>

                <button style={closeButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
