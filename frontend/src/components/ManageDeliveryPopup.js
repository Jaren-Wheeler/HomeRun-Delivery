import React, { useState } from "react";

const overlay = {
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
    boxShadow: "0 0 12px rgba(0,0,0,0.2)"
};

const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc"
};

export default function ManageDeliveryPopup({ delivery, onClose, onUpdated, onDeleted }) {
    const [pickup, setPickup] = useState(delivery.pickup_address);
    const [dropoff, setDropoff] = useState(delivery.dropoff_address);
    const [desc, setDesc] = useState(delivery.item_description);
    const [pay, setPay] = useState(delivery.proposed_payment);

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/deliveries/${delivery.delivery_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pickup_address: pickup,
                    dropoff_address: dropoff,
                    item_description: desc,
                    proposed_payment: pay
                })
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Update error:", text);
                alert("Failed to update delivery");
                return;
            }

            const data = await res.json();
            // Tell parent about updated delivery
            onUpdated && onUpdated(data.delivery);
            onClose();

        } catch (err) {
            console.error("Update error:", err);
            alert("Server error while updating delivery");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this delivery?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/deliveries/${delivery.delivery_id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Delete error:", text);
                alert("Failed to delete delivery");
                return;
            }

            // Notify parent which delivery was deleted
            onDeleted && onDeleted(delivery.delivery_id);
            onClose();

        } catch (err) {
            console.error("Delete error:", err);
            alert("Server error while deleting delivery");
        }
    };

    return (
        <div style={overlay}>
            <div style={windowStyle}>
                <h2>Edit Delivery #{delivery.delivery_id}</h2>

                <label>Pickup</label>
                <input
                    style={inputStyle}
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                />

                <label>Dropoff</label>
                <input
                    style={inputStyle}
                    value={dropoff}
                    onChange={e => setDropoff(e.target.value)}
                />

                <label>Description</label>
                <textarea
                    style={{ ...inputStyle, height: "70px" }}
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />

                <label>Payment</label>
                <input
                    type="number"
                    style={inputStyle}
                    value={pay}
                    onChange={e => setPay(e.target.value)}
                />

                <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between" }}>
                    <button
                        onClick={handleSave}
                        style={{ background: "#3b82f6", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px" }}
                    >
                        Save
                    </button>

                    <button
                        onClick={handleDelete}
                        style={{ background: "#ef4444", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px" }}
                    >
                        Delete
                    </button>

                    <button
                        onClick={onClose}
                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc" }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
