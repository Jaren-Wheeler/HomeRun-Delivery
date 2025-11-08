const sequelize = require("./db.js");

const User = require('../models/User.js');
const Delivery = require('../models/Delivery.js');
const Payment = require('../models/Payment.js');
const Report = require('../models/Report.js');
const Review = require('../models/Review.js');
const Vehicle = require('../models/Vehicle.js');

// handle one to many relationships
Delivery.belongsTo(User, {foreignKey: "user_id"});
User.hasMany(Delivery, {foreignKey: "user_id", onDelete: "CASCADE"});

Review.belongsTo(User, {foreignKey: "user_id"});
User.hasMany(Review, {foreignKey: "user_id", onDelete: "CASCADE"});

Report.belongsTo(User, {foreignKey: "user_id"});
User.hasMany(Report, {foreignKey: "user_id", onDelete: "CASCADE"});

Payment.belongsTo(Delivery, {foreignKey: "delivery_id"});
Delivery.hasOne(Payment, {foreignKey: "delivery_id", onDelete: "CASCADE"});

// handle many to many relationship with Vehicle

User.belongsToMany(Vehicle, {
    through: "UserVehicle",
    foreignKey: "user_id",
    otherKey: "vehicle_id"
});

// handle many to many relationship with user=
Vehicle.belongsToMany(User, {
    through: "UserVehicle",
    foreignKey: "vehicle_id",
    otherKey: "user_id"
});


// initialize the database and create the tables
async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQL Server via Sequelize");

    await sequelize.sync({ alter: true });
    console.log("Tables created/updated!");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

module.exports = initDB;