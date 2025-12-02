
const { Sequelize } = require("sequelize"); // Call ORM library to auto create database
require('dotenv').config();


// Sequelize object. Data sourced in environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  
  {
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    },
    server: process.env.DB_SERVER,   // <-- KEY FIX
    port: 1433,
    logging: false
  }

  
);




module.exports = sequelize;