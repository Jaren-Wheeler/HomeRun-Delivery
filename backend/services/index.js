/**
 * @file index.js
 * Barrel file to export all service modules for centralized importing.
 *
 * Enables:
 *   const { PaymentService } = require('../services');
 */

const DelivererService = require('./delivererService');
const MapsService = require('./mapsService');
const PaymentService = require('./paymentService');
const PurchaserService = require('./purchaserService');
const UserService = require('./userService');

module.exports = {
  DelivererService,
  MapsService,
  PaymentService,
  PurchaserService,
  UserService,
};
