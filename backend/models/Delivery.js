/**
 * @file Delivery.js
 * Sequelize model representing a delivery job created by a purchaser.
 *
 * Responsibilities:
 * - Store pickup and dropoff addresses + geolocation
 * - Track user relationships (purchaser + deliverer)
 * - Manage job lifecycle: open → closed → completed
 * - Support Stripe payment reference (PaymentIntent)
 *
 * Notes:
 * Columns explicitly map camelCase → snake_case to keep DB naming consistent.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Delivery = sequelize.define(
  'Delivery',
  {
    /**
     * Primary Key
     * Unique delivery reference used throughout the entire system.
     */
    deliveryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'delivery_id',
    },

    /**
     * Stripe Payment Intent ID
     * Created only once a deliverer accepts the job.
     */
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'payment_intent_id',
    },

    /**
     * Pickup and Dropoff details
     * Required for dispatch and map previews.
     */
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

    /**
     * Geolocation for map display and navigation
     * Optional — not every delivery will include precise coordinates.
     */
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    /**
     * Item + price details
     * Decimal used for money to avoid float rounding issues.
     */
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
     * Delivery lifecycle states:
     * - "open"     : waiting for a deliverer
     * - "closed"   : deliverer assigned, not finished
     * - "completed": proof delivered, ready for Stripe capture
     */
    status: {
      type: DataTypes.ENUM('open', 'closed', 'completed'),
      allowNull: false,
      defaultValue: 'open',
    },

    /**
     * Foreign key relationships
     * Managed via model associations — not validated here.
     */
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

    /**
     * Enable Sequelize-managed timestamps:
     * createdAt: when delivery is created
     * updatedAt: when delivery status changes
     */
    timestamps: true,

    /**
     * Optional: If we decide later we want every DB column in snake_case
     * uncomment this — Sequelize will auto-map for us.
     */
    // underscored: true,
  }
);

module.exports = Delivery;
