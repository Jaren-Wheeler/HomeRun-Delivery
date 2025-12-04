/**
 * @file index.js
 * Barrel file to export all controllers for cleaner imports.
 */

const UserController = require('./UserController');
const DelivererController = require('./delivererController');
const MapsController = require('./MapsController');
const PaymentController = require('./PaymentController');
const PurchaserController = require('./PurchaserController');

module.exports = {
  UserController,
  DelivererController,
  MapsController,
  PaymentController,
  PurchaserController,
};
