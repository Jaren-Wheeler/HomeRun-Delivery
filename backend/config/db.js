const { Sequelize } = require("sequelize"); // Call ORM library to auto create database
require('dotenv').config();

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
   
//Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to SQL Server via Sequelize");
    } catch (error) {
        console.error("Database connection failed: ", error)
    }
})();

module.exports = sequelize;