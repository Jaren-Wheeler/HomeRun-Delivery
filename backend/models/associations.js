/**
 * @file associations.js
 * Central source of all Sequelize model relationships.
 *
 * This file must be imported BEFORE sequelize.sync()
 * to ensure foreign keys and aliases are applied properly.
 */

const User = require('./User');
const Delivery = require('./Delivery');
const Payment = require('./Payment');

/**
 * USER ↔ DELIVERY
 * Purchaser Relationship
 *
 * - One purchaser can create many delivery jobs.
 * - If a buyer deletes their account → delete their deliveries.
 * - Uses Delivery.purchaserId field.
 */
User.hasMany(Delivery, {
  as: 'purchasedDeliveries',
  foreignKey: 'purchaserId', // camelCase field from Delivery model
  onDelete: 'CASCADE',
});
Delivery.belongsTo(User, {
  as: 'Purchaser',
  foreignKey: 'purchaserId',
});

/**
 * USER ↔ DELIVERY
 * Deliverer Relationship
 *
 * - One deliverer can be assigned multiple jobs.
 * - If deliverer account deleted → do not delete job
 *   Instead, set delivererId to null so another driver can accept it.
 */
User.hasMany(Delivery, {
  as: 'assignedDeliveries',
  foreignKey: 'delivererId',
  onDelete: 'SET NULL',
});
Delivery.belongsTo(User, {
  as: 'Deliverer',
  foreignKey: 'delivererId',
});

/**
 * DELIVERY ↔ PAYMENT
 * One-to-One Payment Lifecycle
 *
 * - A delivery has EXACTLY one Stripe payment linked.
 * - Remove payment automatically if delivery removed.
 * - Uses Payment.deliveryId field.
 */
Delivery.hasOne(Payment, {
  as: 'payment',
  foreignKey: 'deliveryId',
  onDelete: 'CASCADE',
});
Payment.belongsTo(Delivery, {
  as: 'delivery',
  foreignKey: 'deliveryId',
});

module.exports = { User, Delivery, Payment };
