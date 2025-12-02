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

// GET all open jobs assigned by purchaser
router.get("/purchaser/:id/pending", async (req, res) => {
    try {
        const purchaserId = req.params.id;

        const jobs = await Delivery.findAll({
            where: {
                purchaser_id: purchaserId
               
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

// POST deliveries 
router.post("/deliveries", async (req, res) => {
    try {
        const newDelivery = await Delivery.create({
            pickup_address: req.body.pickup_address,
            dropoff_address: req.body.dropoff_address,
            latitude: req.body.latitude,       // null allowed
            longitude: req.body.longitude,     // null allowed
            item_description: req.body.item_description,
            proposed_payment: req.body.proposed_payment,
            status: req.body.status,
            purchaser_id: req.body.purchaser_id,
            deliverer_id: req.body.deliverer_id
        });

        res.status(201).json(newDelivery);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create delivery" });
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

// Accept a job and update the delivery table with deliverer ID and change status to closed
router.put("/deliveries/:id/accept", async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const delivererId = req.body.deliverer_id;

        if (!delivererId) {
            return res.status(400).json({ error: "deliverer_id is required" });
        }

        const delivery = await Delivery.findByPk(deliveryId);

        if (!delivery) {
            return res.status(404).json({ error: "Delivery not found" });
        }

        // Update job
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


// change status of current jobs to complete for certain id's
router.put("/deliveries/:id/complete", async (req, res) => {
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

module.exports = router;
