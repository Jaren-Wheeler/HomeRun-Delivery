import React from 'react';

const DeliveryDetails = ({ delivery }) => {
    if (!delivery) return <div>Loading...</div>;

    const purchaser = delivery.Purchaser; // may be null

    const acceptJob = async () => {
        // 🔹 Use the currently logged in user as the deliverer
        const delivererId = sessionStorage.getItem("user_id");

        if (!delivererId) {
            alert("You must be logged in as a deliverer to accept a job.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/deliverer/${delivery.delivery_id}/accept`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ deliverer_id: Number(delivererId) })
                }
            );

            if (!response.ok) {
                const errText = await response.text();
                console.error("Accept job error:", errText);
                alert("Failed to accept job");
                return;
            }

            alert("Job accepted!");

            // Later you can call a prop like onAccept(delivery.delivery_id)
            // to remove it from UI.

        } catch (err) {
            console.error("Error:", err);
            alert("Server error");
        }
    };

    return (
        <div style={{
            maxWidth: "240px",
            fontFamily: "Inter, sans-serif",
            display: "flex",
            flexDirection: "column"
        }}>
            <h1 style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "4px"
            }}>
                {delivery.item_description}
            </h1>

            <p style={{
                fontSize: "13px",
                marginBottom: "6px",
                color: "#555"
            }}>
                Buyer:{" "}
                {purchaser
                    ? `${purchaser.first_name} ${purchaser.last_name}`
                    : "Unknown Buyer"}
            </p>

            <p style={{
                fontSize: "13px",
                marginBottom: "6px",
                color: "#555"
            }}>
                Pickup: {delivery.pickup_address}
            </p>

            <p style={{
                fontSize: "13px",
                marginBottom: "10px",
                color: "#555"
            }}>
                Payment Offered: <strong>${delivery.proposed_payment}</strong>
            </p>

            <div style={{
                borderBottom: "1px solid #ddd",
                margin: "8px 0"
            }}></div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "0.2s"
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#16a34a")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#22c55e")}
                    onClick={acceptJob}
                >
                    Accept Job
                </button>
            </div>
        </div>
    );
};

export default DeliveryDetails;
