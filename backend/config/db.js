/**
 * @file Database configuration using Sequelize ORM.
 *
 * Switches database configuration based on environment:
 *  - Development: SQLite (local file-based database)
 *  - Production: AWS RDS SQL Server (connection via environment variables)
 *
 * Environment variables required in production:
 *  DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

// Production: AWS SQL Server connection
if (isProduction) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 1433,
      dialect: 'mssql',
      dialectOptions: {
        options: {
          encrypt: true,
          enableArithAbort: true,
        },
      },
      logging: false,
    }
  );

  // Development: SQLite (default for local usage)
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  });
}

module.exports = sequelize;
