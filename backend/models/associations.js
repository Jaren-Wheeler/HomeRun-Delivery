/**
 * @file associations.js
 * Defines all Sequelize model relationships in one place.
 *
 * Centralizing associations prevents duplicate alias errors,
 * improves maintainability, and ensures models load correctly
 * before sequelize.sync() is executed.
 */

const User = require('./User');
const Delivery = require('./Delivery');
const Payment = require('./Payment');

/**
 * USER ↔ DELIVERY (Purchaser relationship)
 *
 * A purchaser (user) can create multiple delivery requests.
 * If the purchaser account is deleted, we remove their requests.
 */
User.hasMany(Delivery, {
  as: 'purchasedDeliveries',
  foreignKey: 'purchaser_id',
  onDelete: 'CASCADE',
});
Delivery.belongsTo(User, {
  as: 'purchaser',
  foreignKey: 'purchaser_id',
});

/**
 * USER ↔ DELIVERY (Deliverer relationship)
 *
 * A deliverer can be assigned to multiple jobs.
 * If a deliverer account disappears, we keep the job record
 * but set the deliverer to NULL since another driver could take over.
 */
User.hasMany(Delivery, {
  as: 'assignedDeliveries',
  foreignKey: 'deliverer_id',
  onDelete: 'SET NULL',
});
Delivery.belongsTo(User, {
  as: 'deliverer',
  foreignKey: 'deliverer_id',
});

/**
 * DELIVERY ↔ PAYMENT
 *
 * A delivery can only have one associated payment.
 * If a delivery is removed, its payment should be removed too.
 */
Delivery.hasOne(Payment, {
  as: 'payment',
  foreignKey: 'deliveryId', // matches Payment model
  onDelete: 'CASCADE',
});
Payment.belongsTo(Delivery, {
  as: 'delivery',
  foreignKey: 'deliveryId',
});

module.exports = { User, Delivery, Payment };
