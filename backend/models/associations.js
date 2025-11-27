/**
 * @file Sequelize model association definitions.
 *
 * This file centralizes all relationships between database models
 * to keep model files clean and maintain a single source of truth
 * for relational structure.
 *
 * All associations MUST be defined only once to avoid
 * duplicate alias errors in Sequelize initialization.
 */

const User = require('./User');
const Delivery = require('./Delivery');
const Payment = require('./Payment');
const Review = require('./Review');
const Report = require('./Report');
const Vehicle = require('./Vehicle');

/**
 * USER ↔ DELIVERY
 *
 * One User can be a Customer on many Deliveries.
 * One User can be a Driver on many Deliveries.
 *
 * Two separate associations are required because the User appears
 * twice in the Delivery model with different behaviors and roles.
 */

// Customer role: deletes associated deliveries when user removed
User.hasMany(Delivery, {
  foreignKey: 'customerId',
  as: 'customerDeliveries',
  onDelete: 'CASCADE',
});
Delivery.belongsTo(User, {
  foreignKey: 'customerId',
  as: 'customer',
});

// Driver role: orphan deliveries remain if driver removed
User.hasMany(Delivery, {
  foreignKey: 'driverId',
  as: 'driverDeliveries',
  onDelete: 'SET NULL',
});
Delivery.belongsTo(User, {
  foreignKey: 'driverId',
  as: 'driver',
});

/**
 * DELIVERY ↔ PAYMENT (1:1)
 *
 * Each Delivery has exactly one Payment record responsible for
 * tracking Stripe authorization/capture state.
 */
Delivery.hasOne(Payment, {
  foreignKey: 'deliveryId',
  onDelete: 'CASCADE',
});
Payment.belongsTo(Delivery, {
  foreignKey: 'deliveryId',
});

/**
 * USER ↔ REVIEW / REPORT (1:M)
 *
 * A user can write many reviews and many reports.
 */
User.hasMany(Review, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
Review.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(Report, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
Report.belongsTo(User, {
  foreignKey: 'user_id',
});

/**
 * USER ↔ VEHICLE (M:N)
 *
 * A user may own multiple vehicles, and a vehicle may belong
 * to multiple users (future driver-sharing functionality).
 */
User.belongsToMany(Vehicle, {
  through: 'UserVehicle',
  foreignKey: 'user_id',
});
Vehicle.belongsToMany(User, {
  through: 'UserVehicle',
  foreignKey: 'vehicle_id',
});
