/**
 * @file Report.js
 * Stores user-submitted reports for issues, safety concerns, etc.
 * Connected to a specific user through a required foreign key.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Report = sequelize.define(
  'Report',
  {
    report_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // What issue the user is reporting
    message: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Report message is required' },
      },
    },

    // FK: who submitted the report
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    timestamps: true,
    tableName: 'Reports',
  }
);

module.exports = Report;
