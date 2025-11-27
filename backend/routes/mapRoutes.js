
const express = require('express');
const router = express.Router();
const Delivery = require("../models/Delivery");


router.get("/maps-key", (req,res) => {
    res.json({key: process.env.GOOGLE_MAPS_API_KEY});
});

// GET markers (deliveries)
router.get("/markers", async (req, res) => {
    try {
        const deliveries = await Delivery.findAll({
            attributes: [
                "delivery_id",
                "pickup_address",
                "item_description",
                "proposed_payment",
                "status"
            ]
        });

        res.json(deliveries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load markers" });
    }
});

module.exports = router;