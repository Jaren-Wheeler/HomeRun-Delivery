/**
 * @file Vehicle model definition.
 *
 * Represents vehicles used by drivers for deliveries.
 * Vehicles can be linked to multiple users and serve as
 * a key factor in delivery capacity and task assignment.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Vehicle Schema
 *
 * @property {number} vehicle_id - Primary key identifier
 * @property {string} type - Vehicle classification (car, truck, bike, etc.)
 * @property {string} make - Manufacturer brand
 * @property {string} model - Model name
 * @property {string} license_plate - Unique vehicle identifier for verification
 * @property {string} color - Driver-specified color
 * @property {string|number} capacity - Cargo capacity (future numeric validation possible)
 *
 * Notes:
 * - Vehicle may be associated with multiple users via a join table
 *   (user-vehicle relationship defined in associations.js)
 */
const Vehicle = sequelize.define('Vehicle', {
  vehicle_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  license_plate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // One vehicle cannot belong to multiple users under the same plate
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Vehicle;
