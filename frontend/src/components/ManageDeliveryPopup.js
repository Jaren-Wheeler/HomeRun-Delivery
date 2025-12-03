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

export default function ManageDeliveryPopup({ delivery, onClose, onDelete, onSave }) {
    const [pickup, setPickup] = useState(delivery.pickup_address);
    const [dropoff, setDropoff] = useState(delivery.dropoff_address);
    const [desc, setDesc] = useState(delivery.item_description);
    const [pay, setPay] = useState(delivery.proposed_payment);

    const handleSave = () => {
        onSave({
            pickup_address: pickup,
            dropoff_address: dropoff,
            item_description: desc,
            proposed_payment: pay
        });
    };

    return (
        <div style={overlay}>
            <div style={windowStyle}>
                <h2>Edit Delivery #{delivery.delivery_id}</h2>

                <label>Pickup</label>
                <input value={pickup} onChange={e => setPickup(e.target.value)} />

                <label>Dropoff</label>
                <input value={dropoff} onChange={e => setDropoff(e.target.value)} />

                <label>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} />

                <label>Payment</label>
                <input 
                    type="number" 
                    value={pay}
                    onChange={e => setPay(e.target.value)}
                />

                <div style={{ marginTop: "18px", display: "flex", justifyContent: "space-between" }}>
                    <button 
                        onClick={handleSave}
                        style={{ background: "#3b82f6", color: "white", padding: "8px 12px" }}
                    >
                        Save
                    </button>

                    <button 
                        onClick={onDelete}
                        style={{ background: "#ef4444", color: "white", padding: "8px 12px" }}
                    >
                        Delete
                    </button>

                    <button 
                        onClick={onClose}
                        style={{ padding: "8px 12px" }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
