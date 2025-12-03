/**
 * @file paymentRoutes.js
 * Routes managing the Stripe payment lifecycle for each delivery.
 *
 * Payment flow:
 *  1 create-intent → authorize funds when delivery is accepted
 *  2 capture       → finalize payment when job is done
 *  3 cancel        → release funds if job fails or is declined
 */

const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

// ---------------------------------------------------------------------------
// Payment Lifecycle Endpoints
// ---------------------------------------------------------------------------

/**
 * POST /create-intent/:deliveryId
 * Authorizes funds (manual capture) when a delivery is accepted.
 */
router.post('/create-intent/:deliveryId', PaymentController.createIntent);

/**
 * POST /capture/:paymentId
 * Captures previously authorized funds once delivery is completed.
 */
router.post('/capture/:paymentId', PaymentController.capture);

/**
 * POST /cancel/:paymentId
 * Cancels the authorization and releases held funds.
 */
router.post('/cancel/:paymentId', PaymentController.cancel);

module.exports = router;
