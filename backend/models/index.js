/**
 * @file Model index (barrel) file.
 *
 * Centralizes Sequelize models and association initialization,
 * ensuring the ORM is configured once and consistently used
 * throughout the application.
 *
 * Responsibilities:
 *  - Import and export all Sequelize models
 *  - Load all model associations
 *  - Export the shared Sequelize instance
 *
 * This prevents circular dependencies and allows any module to
 * access models from a single location: `require('../models')`
 */

const sequelize = require('../config/db');

// Model imports
const User = require('./User');
const Delivery = require('./Delivery');
const Payment = require('./Payment');
const Review = require('./Review');
const Report = require('./Report');
const Vehicle = require('./Vehicle');

// Initialize associations exactly once
require('./associations');

// Centralized exports for easy access across backend
module.exports = {
  sequelize,
  User,
  Delivery,
  Payment,
  Review,
  Report,
  Vehicle,
};
