import React, {useState} from "react";

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


export default function RateDeliveryPopup({ delivery, onClose, onRate }) {
    const [rating, setRating] = useState(0);

    return (
        <div style={overlayStyle}>
            <div style={windowStyle}>
                <h2>Rate Your Delivery</h2>

                <p>Delivery #{delivery.delivery_id}</p>

                {/* STAR RATING */}
                <div style={{ fontSize: "32px", margin: "12px 0" }}>
                    {[1,2,3,4,5].map(num => (
                        <span
                            key={num}
                            style={{ 
                                cursor: "pointer",
                                color: num <= rating ? "#facc15" : "#ccc",
                                marginRight: "4px"
                            }}
                            onClick={() => setRating(num)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <button
                    onClick={() => onRate(rating)}
                    style={{ background: "#22c55e", color: "white", padding: "8px 12px" }}
                >
                    Submit Rating
                </button>

                <button onClick={onClose} style={{ marginLeft: "8px" }}>
                    Close
                </button>
            </div>
        </div>
    );
}

