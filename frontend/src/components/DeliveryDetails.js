import React from 'react';

const DeliveryDetails = ({ delivery }) => {
    if (!delivery) return <div>Loading...</div>;

    return (
        <div style={{ 
            maxWidth: "240px", 
            fontFamily: "Inter, sans-serif",
            display: "flex",
            flexDirection: "column"
        }}>
            
            {/* Title */}
            <h1 style={{ 
                fontSize: "16px", 
                fontWeight: "600",
                marginBottom: "4px"
            }}>
                {delivery.item_description}
            </h1>

            {/* Seller Info */}
            <p style={{ fontSize: "13px", marginBottom: "6px" }}>
                Seller: {delivery.User.first_name} {delivery.User.last_name}
            </p>

            {/* Pickup address */}
            <p style={{ 
                fontSize: "13px", 
                marginBottom: "6px",
                color: "#555"
            }}>
                Pickup: {delivery.pickup_address}
            </p>

            {/* Payment */}
            <p style={{ 
                fontSize: "13px", 
                marginBottom: "10px",
                color: "#555"
            }}>
                Payment Offered: <strong>${delivery.proposed_payment}</strong>
            </p>

            {/* Divider */}
            <div style={{
                borderBottom: "1px solid #ddd",
                margin: "8px 0"
            }}></div>

            {/* Button aligned bottom right */}
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
                    onClick={() => console.log("Accepting job:", delivery.delivery_id)}
                >
                    Accept Job
                </button>
            </div>
        </div>
    );
};

export default DeliveryDetails;
