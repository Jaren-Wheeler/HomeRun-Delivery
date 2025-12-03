/**
 * @file Delivery.js
 * Sequelize model representing a delivery job posted by a purchaser.
 *
 * Tracks required pickup/dropoff info, pricing, geolocation,
 * and the user IDs linked to each role (purchaser, deliverer).
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Delivery = sequelize.define(
  'Delivery',
  {
    deliveryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'delivery_id', // Keeps column name backwards compatible
    },

    // Where the item starts and ends
    pickupAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'pickup_address',
    },
    dropoffAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'dropoff_address',
    },

    // geolocation for map markers
    latitude: { type: DataTypes.FLOAT, allowNull: true },
    longitude: { type: DataTypes.FLOAT, allowNull: true },

    // Information about item and cost
    itemDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'item_description',
    },
    proposedPayment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'proposed_payment',
    },

    /**
     * Job lifecycle:
     * - "open"     : awaiting a driver
     * - "closed"   : assigned + waiting for completion
     * - "completed": finished job, ready for payment capture
     */
    status: {
      type: DataTypes.ENUM('open', 'closed', 'completed'),
      allowNull: false,
      defaultValue: 'open',
    },

    // Foreign keys: linked in associations.js
    purchaserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'purchaser_id',
    },
    delivererId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'deliverer_id',
    },
  },
  {
    tableName: 'Deliveries',
    timestamps: true, // createdAt + updatedAt managed automatically
    //underscored: true, // ensures DB column naming consistency
  }
);

module.exports = Delivery;
