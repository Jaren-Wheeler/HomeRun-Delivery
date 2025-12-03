/**
 * @file index.js
 * Barrel file to export all controllers for cleaner imports.
 */

const DelivererController = require('./DelivererController');
const MapsController = require('./MapsController');
const PaymentController = require('./PaymentController');
const PurchaserController = require('./PurchaserController');
const UserController = require('./UserController');

module.exports = {
  DelivererController,
  MapsController,
  PaymentController,
  PurchaserController,
  UserController,
};
