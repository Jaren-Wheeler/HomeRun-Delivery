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
                deliverer_id: delivererId,
                status: "closed"
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

// GET all completed jobs corresponding to a certain deliverers id
router.get("/deliverer/:id/completed", async (req, res) => {
    try {
        const { id } = req.params;

        const jobs = await Delivery.findAll({
            where: { deliverer_id: id, status: "completed" },
            include: [{ model: User, as: "Purchaser", attributes: ["first_name", "last_name"] }]
        });

        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load completed jobs" });
    }
});

// change status of current jobs to complete for certain id's
router.put("/:id/complete", async (req, res) => {
    try {
        const { id } = req.params;

        const delivery = await Delivery.findByPk(id);

        if (!delivery) {
            return res.status(404).json({ error: "Delivery not found" });
        }

        delivery.status = "completed"; // set status to completed
        await delivery.save();

        res.json({ 
            message: "Delivery marked as completed!", 
            delivery 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to complete delivery" });
    }
});

router.put("/purchaser/:id/accept", async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const delivererId = req.body.deliverer_id;

        const delivery = await Delivery.findByPk(deliveryId);
        if (!delivery) {
            return res.status(404).json({ error: "Delivery not found" });
        }

        await delivery.update({
            deliverer_id: delivererId,
            status: "closed"
        });

        res.json({ message: "Job accepted", delivery });

    } catch (err) {
        console.error("Error accepting job:", err);
        res.status(500).json({ error: "Failed to accept job" });
    }
});

// get jobs corresponding to certain purchasers
router.get("/purchaser/:id/pending", async (req, res) => {
    try {
        const purchaserId = req.params.id;

        const jobs = await Delivery.findAll({
            where: {
                purchaser_id: purchaserId   // NO STATUS FILTER HERE
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

router.post("/purchaser", async (req, res) => {
    try {
        const newDelivery = await Delivery.create({
            pickup_address: req.body.pickup_address,
            dropoff_address: req.body.dropoff_address,
            latitude: req.body.latitude || null,
            longitude: req.body.longitude || null,
            item_description: req.body.item_description,
            proposed_payment: req.body.proposed_payment,
            status: "open",
            purchaser_id: req.body.purchaser_id,
            deliverer_id: null
        });

        res.status(201).json(newDelivery);
    } catch (err) {
        console.error("Error creating delivery:", err);
        res.status(500).json({ error: "Failed to create delivery" });
    }
});

module.exports = router;
