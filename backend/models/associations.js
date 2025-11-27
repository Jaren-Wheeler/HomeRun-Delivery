const User = require('./User');
const Delivery = require('./Delivery');
const Payment = require('./Payment');

// A User can post many deliveries (as a customer)
User.hasMany(Delivery, {
  foreignKey: 'customerId',
  as: 'customerDeliveries',
});
Delivery.belongsTo(User, {
  foreignKey: 'customerId',
  as: 'customer',
});

// A User can complete many deliveries (as a driver)
User.hasMany(Delivery, {
  foreignKey: 'driverId',
  as: 'driverDeliveries',
});
Delivery.belongsTo(User, {
  foreignKey: 'driverId',
  as: 'driver',
});

// One delivery has one payment
Delivery.hasOne(Payment, {
  foreignKey: 'deliveryId',
  onDelete: 'CASCADE',
});
Payment.belongsTo(Delivery, {
  foreignKey: 'deliveryId',
});

module.exports = { User, Delivery, Payment };
