/**
 * @file paymentRoutes.js
 * Routes managing the Stripe payment lifecycle for each delivery.
 *
 * Payment flow lifecycle:
 *  1) create-intent → authorize funds once the assigned deliverer accepts the job
 *  2) capture       → finalize payment when the deliverer completes the job
 *  3) cancel        → release funds if the delivery is canceled before completion
 *
 * All routes require:
 *  - Authenticated user via JWT
 *  - User must be the assigned deliverer for the delivery involved
 */

const express = require('express');
const router = express.Router();
const { PaymentController } = require('../controllers');
const { requireAuth, requireDeliverer } = require('../middleware');

// ---------------------------------------------------------------------------
// Payment Lifecycle Endpoints
// ---------------------------------------------------------------------------

/**
 * POST /create-intent/:deliveryId
 * Authorizes funds when the assigned deliverer accepts the delivery.
 * Automatically updates delivery.status → 'closed'.
 */
router.post(
  '/create-intent/:deliveryId',
  requireAuth,
  requireDeliverer,
  PaymentController.createIntent
);

/**
 * POST /capture/:paymentId
 * Captures previously authorized funds after successful delivery completion.
 * Automatically updates delivery.status → 'completed'.
 */
router.post(
  '/capture/:paymentId',
  requireAuth,
  requireDeliverer,
  PaymentController.capture
);

/**
 * POST /cancel/:paymentId
 * Cancels the authorization and reopens the delivery for another driver.
 * Automatically updates delivery.status → 'open'.
 */
router.post(
  '/cancel/:paymentId',
  requireAuth,
  requireDeliverer,
  PaymentController.cancel
);

module.exports = router;
