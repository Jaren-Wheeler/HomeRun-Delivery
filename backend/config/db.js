const { Sequelize } = require("sequelize"); // Call ORM library to auto create database
require('dotenv').config();

const User = require('../models/User.js');
const Delivery = require('../models/Delivery.js');
const Payment = require('../models/Payment.js');
const Report = require('../models/Report.js');
const Review = require('../models/Review.js');
const Vehicle = require('../models/Vehicle.js');


// Sequelize object. Data sourced in environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_SERVER,
        dialect: "mssql",
        port: parseInt(process.env.DB_PORT, 10),
        dialectOptions: {
            options: { trustServerCertificate: true}
        },
        logging: false,
    }
)

//initialize models
User.initModels(sequelize);
Delivery.initModels(sequelize);
Payment.initModels(sequelize);
Report.initModels(sequelize);
Review.initModels(sequelize);
Vehicle.initModels(sequelize);

//Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to SQL Server via Sequelize");

        await sequelize.sync({ alter: true }); // create the database tables if they don't already exist
    } catch (error) {
        console.error("Database connection failed: ", error)
    }
})();

module.exports = sequelize;