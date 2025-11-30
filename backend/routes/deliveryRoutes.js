const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");
const User = require("../models/User");

// GET all pending (open) jobs assigned to deliverer
router.get("/deliverer/:id/pending", async (req, res) => {
    try {
        const delivererId = req.params.id;

        const jobs = await Delivery.findAll({
            where: {
                deliverer_id: delivererId
            },
            include: [
                {
                    model: User,
                    as: "Purchaser",
                    attributes: ["first_name", "last_name"]
                }
            ]
        });

        res.json(jobs);
    } catch (err) {
        console.error("Error loading pending jobs:", err);
        res.status(500).json({ error: "Failed to load jobs" });
    }
});

// Finish delivery
router.put("/deliveries/:id/complete", async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await Delivery.findByPk(id);

        if (!delivery) {
            return res.status(404).json({ error: "Delivery not found" });
        }

        delivery.status = "completed"; // or "completed" if you prefer
        await delivery.save();

        res.json({ message: "Delivery marked as completed!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to complete delivery" });
    }
});
module.exports = router;
