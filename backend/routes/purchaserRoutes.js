/**
 * @file purchaserRoutes.js
 * REST API endpoints for users operating as **purchasers**:
 *
 * Responsibilities (Purchaser Role):
 *  - Create new delivery job requests
 *  - Track unclaimed ("open") deliveries they have created
 *
 * All business logic is delegated to PurchaserController to maintain
 * separation of concerns and a clean, scalable backend architecture.
 */

const express = require('express');
const router = express.Router();
const PurchaserController = require('../controllers/PurchaserController');

/**
 * GET /api/purchaser/:id/pending
 * Lists active delivery jobs created by this purchaser
 * that are still waiting for a driver to claim them.
 */
router.get('/:id/pending', PurchaserController.getPurchaserPendingJobs);

/**
 * POST /api/purchaser
 * Creates a new delivery request with `status: open`
 * and no driver assigned yet.
 */
router.post('/', PurchaserController.createDelivery);

router.put('/:id/update', PurchaserController.updateExistingJobs);

router.delete('/:id/delete', PurchaserController.deleteOpenJob);
module.exports = router;
