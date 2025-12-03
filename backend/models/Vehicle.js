/**
 * @file Vehicle.js
 * Represents a deliverer's vehicle for transporting goods.
 * Each deliverer may register multiple vehicles.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehicle = sequelize.define(
  'Vehicle',
  {
    vehicle_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    /** General Classification */
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /** Manufacturer and model info */
    make: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    /** License Plate (unique per vehicle) */
    licensePlate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[A-Za-z0-9- ]+$/,
      },
    },

    /** Vehicle color for identification */
    color: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    /**
     * Payload capacity in kg
     * Supports delivery filtering and safety constraints
     */
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    timestamps: true,
    tableName: 'Vehicles',
  }
);

module.exports = Vehicle;
