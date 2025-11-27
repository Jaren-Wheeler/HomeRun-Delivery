/**
 * @file Payment model definition.
 *
 * Represents Stripe-backed payment records linked to deliveries.
 * Stores transaction state, reference IDs, and financial amounts
 * required for authorization and capture flow.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Payment Schema
 *
 * @property {number} payment_id - Primary key, auto-increment identifier
 * @property {number} amount - Authorized amount for the delivery charge
 * @property {string} status - Stripe PaymentIntent status at last update
 * @property {string} stripePaymentIntentId - Secure reference to Stripe transaction
 * @property {Date|null} capturedAt - Timestamp when payment is fully captured
 * @property {number} deliveryId - Foreign key reference to Delivery
 */
const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'requires_payment_method', // Stripe initial state
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Maps to Stripe for tracking
  },
  capturedAt: {
    type: DataTypes.DATE,
    allowNull: true, // Null until full capture succeeds
  },
  deliveryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Payment;
