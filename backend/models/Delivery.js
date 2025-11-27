/**
 * @file Delivery model definition.
 *
 * Represents a delivery request within the HomeRun Delivery platform.
 * Tracks pickup/dropoff locations, pricing, status, and the assigned users
 * involved in the transaction (customer and optionally a driver).
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Delivery Schema
 *
 * @property {number} delivery_id - Primary key, auto-increment identifier
 * @property {string} pickup_address - Pickup location for the item
 * @property {string} dropoff_address - Destination location
 * @property {string} item_description - What is being delivered
 * @property {number} price - Cost of the delivery (in dollars)
 * @property {string} status - Delivery state: pending | accepted | completed | cancelled
 * @property {number} customerId - Reference to the requesting user (required)
 * @property {number|null} driverId - Reference to assigned driver (nullable until accepted)
 */
const Delivery = sequelize.define('Delivery', {
  delivery_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pickup_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dropoff_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false, // A delivery must always have a customer
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Becomes non-null once a driver accepts
  },
});

module.exports = Delivery;
