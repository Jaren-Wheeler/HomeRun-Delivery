/**
 * @file models/index.js
 * Barrel export for all Sequelize models.
 *
 * Important:
 * associations.js must continue to import model files directly
 * to ensure Sequelize initializes models before applying relations.
 */

const User = require('./User');
const Delivery = require('./Delivery');
const Payment = require('./Payment');
const Vehicle = require('./Vehicle');
const Report = require('./Report');
const Review = require('./Review');

module.exports = {
  User,
  Delivery,
  Payment,
  Vehicle,
  Report,
  Review,
};
