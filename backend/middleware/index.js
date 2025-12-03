/**
 * @file index.js
 * Barrel file for all middleware functions.
 *
 * Allows importing like:
 *   const { requireAuth, requireDeliverer } = require('../middleware');
 */

const requireAuth = require('./authMiddleware');
const requireDeliverer = require('./deliveryAuth');

module.exports = {
  requireAuth,
  requireDeliverer,
};
