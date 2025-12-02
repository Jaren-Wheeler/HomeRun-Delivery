import React, { useEffect, useState } from "react";
import CreatePostingForm from "../components/CreatePostingForm";

const PurchaserDashboard = () => {
    const [deliveries, setDeliveries] = useState([]);

    // Fetch deliveries from backend
    useEffect(() => {
        fetch(`http://localhost:5000/api/purchaser/${1}/pending`)
            .then((res) => res.json())
            .then((data) => setDeliveries(data))
            .catch((err) => console.error("Error fetching deliveries:", err));
    }, []);

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "2rem",
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
                            {deliveries.map((d) => (
                                <tr key={d.delivery_id}>
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

