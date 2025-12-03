/**
 * @file User.js
 * Core user identity for the platform, supports both purchasers and deliverers.
 * Controls authentication, contact info, and reputation fields.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    /** Basic Profile */
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    /** Authentication */
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /** Contact */
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[0-9+\-() ]+$/i, // simple validation for now
      },
    },

    /** Authorization Role */
    role: {
      type: DataTypes.ENUM('purchaser', 'deliverer'),
      allowNull: false,
      defaultValue: 'purchaser',
    },

    /** Reputation */
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ratingAverage: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    totalDeliveries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: 'Users',
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

module.exports = User;
