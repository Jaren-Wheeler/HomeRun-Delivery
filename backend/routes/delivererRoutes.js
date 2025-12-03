/**
 * @file delivererRoutes.js
 * REST API endpoints for users operating as **delivery drivers**.
 *
 * Responsibilities (Driver Role):
 *  - Browse all available delivery jobs
 *  - Review delivery job history and status changes
 *  - Claim open deliveries ("accept job")
 *  - Confirm completed deliveries ("complete job")
 *
 * Each route delegates work to DelivererController, which then maps
 * business logic to DelivererService for clean architecture.
 */

const express = require('express');
const router = express.Router();
const DelivererController = require('../controllers/DelivererController');

/**
 * GET /api/deliverer/:id/pending
 * Loads all unclaimed delivery jobs for the driver dashboard.
 */
router.get('/:id/pending', DelivererController.getPendingDelivererJobs);

/**
 * GET /api/deliverer/:id/completed
 * Displays delivery history for the driver profile dashboard.
 */
router.get('/:id/completed', DelivererController.getCompletedDelivererJobs);

/**
 * PUT /api/deliverer/:id/complete
 * Marks a previously accepted job as fully completed.
 */
router.put('/:id/complete', DelivererController.completeJob);

/**
 * PUT /api/deliverer/:id/accept
 * Transitions a job from "open" → "closed" and assigns the driver.
 */
router.put('/:id/accept', DelivererController.acceptJob);

module.exports = router;
