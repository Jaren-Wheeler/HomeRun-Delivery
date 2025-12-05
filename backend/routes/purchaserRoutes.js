/**
 * @file purchaserRoutes.js
 * REST API endpoints for purchaser role
 */

const express = require('express');
const router = express.Router();
const { PurchaserController } = require('../controllers');
const { requireAuth, requirePurchaser } = require('../middleware');

console.log('PurchaserController:', PurchaserController);
console.log('requireAuth:', typeof requireAuth);
console.log('requirePurchaser:', typeof requirePurchaser);

/**
 * POST /api/purchaser/create-with-intent
 * Creates delivery AND initializes Stripe PaymentIntent
 */
router.post(
  '/create-with-intent',
  requireAuth,
  requirePurchaser,
  PurchaserController.createDelivery
);

/**
 * GET /api/purchaser/:id/pending
 * Returns delivery posts made by this purchaser that are open
 */
router.get(
  '/:id/pending',
  requireAuth,
  requirePurchaser,
  PurchaserController.getPurchaserPendingJobs
);

/**
 * GET /api/purchaser/:id/in-progress
 * Returns delivery posts made by this purchaser that have been accepted by a deliverer but not completed
 */
router.get(
  "/:id/in-progress", 
  requireAuth, 
  requirePurchaser,
  PurchaserController.getInProgressJobs
);

/**
 * PUT /api/purchaser/:id/update
 */
router.put(
  '/:id/update',
  requireAuth,
  requirePurchaser,
  PurchaserController.updateExistingJobs
);

/**
 * DELETE /api/purchaser/:id/delete
 */
router.delete(
  '/:id/delete',
  requireAuth,
  requirePurchaser,
  PurchaserController.deleteOpenJob
);

module.exports = router;
