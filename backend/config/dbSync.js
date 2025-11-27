const sequelize = require('./db.js');

const User = require('../models/User.js');
const Delivery = require('../models/Delivery.js');
const Payment = require('../models/Payment.js');
const Report = require('../models/Report.js');
const Review = require('../models/Review.js');
const Vehicle = require('../models/Vehicle.js');

// User ↔ Delivery
// Customer relationship
User.hasMany(Delivery, {
  foreignKey: 'customerId',
  as: 'customerDeliveries',
  onDelete: 'CASCADE',
});
Delivery.belongsTo(User, {
  foreignKey: 'customerId',
  as: 'customer',
});

// Driver relationship
User.hasMany(Delivery, {
  foreignKey: 'driverId',
  as: 'driverDeliveries',
  onDelete: 'SET NULL',
});
Delivery.belongsTo(User, {
  foreignKey: 'driverId',
  as: 'driver',
});

// Delivery ↔ Payment (One-to-One)
Delivery.hasOne(Payment, {
  foreignKey: 'deliveryId',
  onDelete: 'CASCADE',
});
Payment.belongsTo(Delivery, {
  foreignKey: 'deliveryId',
});

// Reviews → User
Review.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Reports → User
Report.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Report, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Vehicle Many-to-Many remains the same
User.belongsToMany(Vehicle, {
  through: 'UserVehicle',
  foreignKey: 'user_id',
  otherKey: 'vehicle_id',
});
Vehicle.belongsToMany(User, {
  through: 'UserVehicle',
  foreignKey: 'vehicle_id',
  otherKey: 'user_id',
});

// initialize database
async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    await sequelize.sync({ alter: true });
    console.log('Tables synced!');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

module.exports = initDB;
