import React, { useState } from "react";

const styles = {
    container: {
        maxWidth: "600px",
        margin: "30px auto",
        padding: "20px",
        background: "#white",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    },
    header: {
        textAlign: "center",
        marginBottom: "20px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },
    label: {
        fontWeight: "600"
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    },
    textarea: {
        padding: "10px",
        height: "80px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    },
    button: {
        marginTop: "10px",
        padding: "12px",
        fontSize: "16px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

const CreatePostingForm = () => {
    const [pickupAddress, setPickupAddress] = useState("");
    const [dropoffAddress, setDropoffAddress] = useState("");
    const [description, setDescription] = useState("");
    const [payment, setPayment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const purchaserId = sessionStorage.getItem("user_id");

        if (!purchaserId) {
            alert("You must be logged in to create a delivery request.");
            return;
        }

        const deliveryData = {
            pickup_address: pickupAddress,
            dropoff_address: dropoffAddress,
            item_description: description,
            proposed_payment: payment,
            status: "open",
            purchaser_id: Number(purchaserId),
            deliverer_id: null,
            latitude: null,
            longitude: null
        };

        try {
            const response = await fetch("http://localhost:5000/api/deliveries/purchaser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deliveryData)
            });

            if (!response.ok) {
                const err = await response.text();
                console.error("Error saving delivery:", err);
                alert("Error saving delivery request.");
                return;
            }

            alert("Delivery request submitted!");

            setPickupAddress("");
            setDropoffAddress("");
            setDescription("");
            setPayment("");

        } catch (error) {
            console.error(error);
            alert("Server error");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Pickup Address</label>
            <input
                type="text"
                style={styles.input}
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="123 Main St, Edmonton, AB"
                required
            />

            <label style={styles.label}>Drop-off Address</label>
            <input
                type="text"
                style={styles.input}
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                placeholder="456 King St, Calgary, AB"
                required
            />

            <label style={styles.label}>Item Description</label>
            <textarea
                style={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Small package, around 5 lbs"
                required
            />

            <label style={styles.label}>Proposed Payment ($)</label>
            <input
                type="number"
                style={styles.input}
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                placeholder="20"
                required
            />

            <button type="submit" style={styles.button}>
                Submit
            </button>
        </form>
    );
};

export default CreatePostingForm;
