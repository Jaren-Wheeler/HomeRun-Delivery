import React, { useEffect, useState } from "react";
import CreatePostingForm from "../components/CreatePostingForm";
import RateDeliveryPopup from "../components/RateDeliveryPopup";
import ManageDeliveryPopup from "../components/ManageDeliveryPopup";

const PurchaserDashboard = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const filteredDeliveries = deliveries.filter((d) => {
        if (filterStatus === "all") return true;
        return d.status === filterStatus;
    });
    
    const handleDelete = async (id) => {
        await fetch(`http://localhost:5000/api/deliveries/${id}`, { method: "DELETE" });
        setDeliveries(prev => prev.filter(d => d.delivery_id !== id));
        setSelectedDelivery(null);
    };

    const handleUpdate = async (id, data) => {
        await fetch(`http://localhost:5000/api/deliveries/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        setSelectedDelivery(null);
        // Re-fetch deliveries or update in-place
    };

    const handleRating = async (id, stars) => {
        await fetch(`http://localhost:5000/api/deliveries/${id}/rate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: stars })
        });
        setSelectedDelivery(null);
    };

    // Fetch deliveries from backend corresponding to logged in purchaser
    useEffect(() => {
        const purchaserId = sessionStorage.getItem("user_id"); // fetch the currently logged in user

        if (!purchaserId) {
            console.error("No logged-in user id found in session storage");
            return;
        }
        fetch(`http://localhost:5000/api/deliveries/purchaser/${purchaserId}/pending`)
            .then((res) => res.json())
            .then((data) => setDeliveries(data))
            .catch((err) => console.error("Error fetching deliveries:", err));
    }, []);

    return (
        <div
            style={{
                width:"90%",
                minHeight: "100vh",
                margin: "0 auto",
                padding: "2rem",
                background:"#2563eb"
            }}
        >
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    textAlign: "center",
                }}
            >
                Purchaser Dashboard
            </h1>

            {/* CREATE POSTING SECTION */}
            <section
                style={{
                    marginBottom: "2rem",
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
            >
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    Create a Delivery Request
                </h2>

                <CreatePostingForm />
            </section>

            {/* DELIVERY TABLE */}
            <section
                style={{
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
            >
                <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
                    Your Delivery Posts
                </h2>

                <div style={{ marginBottom: "1rem" }}>
                    <label style={{ marginRight: "8px", fontWeight: "600" }}>
                        Filter by status:
                    </label>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontSize: "14px"
                        }}
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="closed">Completed</option>
                    </select>
                </div>

                {deliveries.length === 0 ? (
                    <p>No deliveries yet.</p>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={th}>ID</th>
                                <th style={th}>Pickup</th>
                                <th style={th}>Dropoff</th>
                                <th style={th}>Description</th>
                                <th style={th}>Payment</th>
                                <th style={th}>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredDeliveries.map((d) => (
                                <tr key={d.delivery_id}
                                    onClick={() => setSelectedDelivery(d)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <td style={td}>{d.delivery_id}</td>
                                    <td style={td}>{d.pickup_address}</td>
                                    <td style={td}>{d.dropoff_address}</td>
                                    <td style={td}>{d.item_description}</td>
                                    <td style={td}>${d.proposed_payment}</td>
                                    <td style={td}>{d.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {selectedDelivery && selectedDelivery.status === "completed" && (
                <RateDeliveryPopup
                    delivery={selectedDelivery}
                    onClose={() => setSelectedDelivery(null)}
                    onRate={(stars) => handleRating(selectedDelivery.delivery_id, stars)}
                />
            )}

            {selectedDelivery && selectedDelivery.status === "open" && (
                <ManageDeliveryPopup
                    delivery={selectedDelivery}
                    onClose={() => setSelectedDelivery(null)}
                    onSave={(updatedData) => handleUpdate(selectedDelivery.delivery_id, updatedData)}
                    onDelete={() => handleDelete(selectedDelivery.delivery_id)}
                />
            )}

        </div>
    );
};

export default PurchaserDashboard;

// Table styles
const th = {
    borderBottom: "2px solid #ddd",
    padding: "8px",
    textAlign: "left",
    fontWeight: "700",
};

const td = {
    borderBottom: "1px solid #eee",
    padding: "8px",
};

