
const express = require('express');
const router = express.Router();
const Delivery = require("../models/Delivery");
const User = require("../models/User")

router.get("/maps-key", (req,res) => {
    res.json({key: process.env.GOOGLE_MAPS_API_KEY});
});

// GET markers (deliveries)
router.get("/markers", async (req, res) => {
    try {
        const deliveries = await Delivery.findAll({
            where: {status: "open"}, // only show markers for jobs that are available

            attributes: [
                "delivery_id",
                "pickup_address",
                "item_description",
                "proposed_payment",
                "status",
                "purchaser_id",
                "deliverer_id"
            ],
            include: [
                {
                    model: User, 
                    as: "Purchaser",
                    attributes: ["first_name", "last_name"]
                }
            ]
        });
        console.log(JSON.stringify(deliveries, null, 2));  
        res.json(deliveries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load markers" });
    }
});

module.exports = router;