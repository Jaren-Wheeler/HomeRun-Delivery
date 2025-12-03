/**
 * @file Payment.js
 * Tracks Stripe PaymentIntent lifecycle for a delivery.
 *
 * A Payment:
 * - is created when a driver accepts a job (authorization)
 * - is captured when delivery completes
 * - can be canceled if job fails/driver backs out
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define(
  'Payment',
  {
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'payment_id',
    },

    // Amount stored in CAD
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Authorized payment amount in CAD',
    },

    /**
     * Payment status matches Stripe intent states:
     * - requires_payment_method: created but card not added
     * - requires_capture: driver finished job but not billed yet
     * - succeeded: payment fully completed
     * - canceled: voided/refunded
     */
    status: {
      type: DataTypes.ENUM(
        'requires_payment_method',
        'requires_confirmation',
        'requires_capture',
        'processing',
        'succeeded',
        'canceled'
      ),

      allowNull: false,
      defaultValue: 'requires_payment_method',
    },

    // Stripe reference to sync local state with Stripe dashboard
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'stripe_payment_intent_id',
    },

    // Set when payment actually goes through
    capturedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when capture succeeds',
    },

    deliveryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'delivery_id',
    },
  },
  {
    tableName: 'Payments',
    timestamps: true, // createdAt + updatedAt automatically handled
    underscored: true,
  }
);

module.exports = Payment;
