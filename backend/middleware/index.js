/**
 * @file index.js
 * Barrel file for all middleware functions.
 *
 * Allows importing like:
 *   const { requireAuth, requireDeliverer } = require('../middleware');
 */

const requireAuth = require('./authMiddleware');
const requireDeliverer = require('./deliveryAuth');
const requirePurchaser = require('./purchaserAuth');

module.exports = {
  requireAuth,
  requireDeliverer,
  requirePurchaser,
};
