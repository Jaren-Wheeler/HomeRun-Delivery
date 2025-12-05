/**
 * @file index.js
 * Barrel file to export all controllers for cleaner imports.
 */

const UserController = require('./UserController');
const DelivererController = require('./DelivererController');
const MapsController = require('./mapsController');
const PaymentController = require('./PaymentController');
const PurchaserController = require('./PurchaserController');

module.exports = {
  UserController,
  DelivererController,
  MapsController,
  PaymentController,
  PurchaserController,
};
