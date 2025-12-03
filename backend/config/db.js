
const { Sequelize } = require("sequelize"); // Call ORM library to auto create database
require('dotenv').config();


// Sequelize object. Data sourced in environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: 'mssql',
    dialectOptions: {
        options: {
            enableArithAbort: true,
            trustServerCertificate: true
        }
    },
   
});

sequelize.authenticate()
    .then(() => console.log("✅ Database connection established"))
    .catch(err => console.error("❌ Unable to connect to the database:", err));
    


module.exports = sequelize;