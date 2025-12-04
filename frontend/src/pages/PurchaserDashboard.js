import React, { useEffect, useState } from "react";
import CreatePostingForm from "../components/CreatePostingForm";
import RateDeliveryPopup from "../components/RateDeliveryPopup";
import ManageDeliveryPopup from "../components/ManageDeliveryPopup";
import NavBar from "../components/NavBar";

// --- New Core Style Definitions ---
const primaryBrandGreen = '#1e7145'; // Deep Forest Green
const accentGreen = '#4cb64c';     // Vibrant Green
const lightBackground = '#f3fbf3'; // Very Light Greenish-Gray

const styles = {
    // Overall Page Container
    pageContainer: {
        minHeight: "100vh",
        padding: "0",
        backgroundColor: lightBackground, // Light green background
        fontFamily: "Roboto, Arial, sans-serif",
    },
    
    // Header Section 
    titleSection: {
        backgroundColor: primaryBrandGreen, // Deep Forest Green
        color: 'white',
        padding: '2rem 3rem 1.5rem',
        marginBottom: '2rem',
    },

    mainTitle: {
        fontSize: "2.2rem",
        fontWeight: "700",
        margin: "0",
        textAlign: "left",
    },

    // Card/Section Base
    sectionBase: {
        margin: '0 3rem 2rem', 
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "white", // White card
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        border: '1px solid #e0e0e0',
    },

    sectionTitle: {
        fontSize: "1.6rem",
        fontWeight: "600",
        color: primaryBrandGreen, // Title in Deep Forest Green
        marginBottom: "1.5rem",
        borderBottom: "1px solid #f0f0f0",
        paddingBottom: "0.5rem",
    },
    
    // Filter/Select Styles
    filterLabel: {
        marginRight: "12px", 
        fontWeight: "600", 
        color: '#4f4f4f',
    },
    filterSelect: {
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #bdc3c7",
        fontSize: "1rem",
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
    },

    // Table Styles
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "0.95rem",
    },
    th: {
        borderBottom: `2px solid ${accentGreen}`, // Vibrant Green accent on header border
        padding: "12px 10px",
        textAlign: "left",
        fontWeight: "700",
        backgroundColor: '#e6f5e6', // Very light green background for table header
        color: primaryBrandGreen,
    },
    td: {
        borderBottom: "1px solid #eee",
        padding: "10px",
        transition: 'background-color 0.15s',
    },
    tableRow: {
        cursor: 'pointer',
    },
};

// Apply table styles to the separate constants used in the original code
const th = styles.th;
const td = styles.td;

// --- END: Inline Styles ---


const PurchaserDashboard = () => {
    // --- LOGIC (UNCHANGED) ---
    const [deliveries, setDeliveries] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const filteredDeliveries = deliveries.filter((d) => {
        if (filterStatus === "all") return true;
        return d.status === filterStatus;
    });

    const handleDelete = async (id) => { /* ... unchanged ... */ };
    const handleUpdate = async (id, data) => { /* ... unchanged ... */ };
    const handleRating = async (id, stars) => { /* ... unchanged ... */ };
    const handleDeliveryUpdated = (updatedDelivery) => { /* ... unchanged ... */ };
    const handleDeliveryDeleted = (deletedId) => { /* ... unchanged ... */ };

    useEffect(() => {
        const purchaserId = sessionStorage.getItem("user_id");
        if (!purchaserId) {
            console.error("No logged-in user id found in session storage");
            return;
        }
        fetch(`http://localhost:5000/api/purchaser/${purchaserId}/pending`)
            .then((res) => res.json())
            .then((data) => setDeliveries(data))
            .catch((err) => console.error("Error fetching deliveries:", err));
    }, []);
    // --- END LOGIC ---

    return (
        <div style={styles.pageContainer}>
            {/* NavBar component is rendered here */}
            <NavBar />

            {/* Main Title Section */}
            <div style={styles.titleSection}>
                <h1 style={styles.mainTitle}>
                    Purchaser Dashboard
                </h1>
            </div>

            {/* CREATE POSTING SECTION */}
            <section style={styles.sectionBase}> 
                <h2 style={styles.sectionTitle}>
                    Create a Delivery Request
                </h2>

                <CreatePostingForm />
            </section>

            {/* DELIVERY TABLE */}
            <section style={styles.sectionBase}>
                <h2 style={styles.sectionTitle}>
                    Your Delivery Posts
                </h2>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={styles.filterLabel}>
                        Filter by status:
                    </label>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="closed">Completed</option>
                    </select>
                </div>

                {deliveries.length === 0 ? (
                    <p style={{ color: '#7f8c8d' }}>No deliveries yet.</p>
                ) : (
                    <table style={styles.table}>
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
                                <tr key={d.deliveryId}
                                    onClick={() => setSelectedDelivery(d)}
                                    style={styles.tableRow}
                                >
                                    <td style={td}>{d.deliveryId}</td>
                                    <td style={td}>{d.pickupAddress}</td>
                                    <td style={td}>{d.dropoffAddress}</td>
                                    <td style={td}>{d.itemDescription}</td>
                                    <td style={td}>**${d.proposedPayment}**</td>
                                    <td style={td}>{d.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* POPUPS (LOGIC UNCHANGED) */}
            {selectedDelivery && selectedDelivery.status === "completed" && (
                <RateDeliveryPopup
                    delivery={selectedDelivery}
                    onClose={() => setSelectedDelivery(null)}
                    onRate={(stars) => handleRating(selectedDelivery.deliveryId, stars)}
                />
            )}

            {selectedDelivery && selectedDelivery.status === "open" && (
                <ManageDeliveryPopup
                    delivery={selectedDelivery}
                    onClose={() => setSelectedDelivery(null)}
                    onSave={(updatedData) => handleUpdate(selectedDelivery.deliveryId, updatedData)}
                    onDelete={() => handleDelete(selectedDelivery.deliveryId)}
                />
            )}

        </div>
    );
};

export default PurchaserDashboard;