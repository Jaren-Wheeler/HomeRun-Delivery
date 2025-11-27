const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Delivery = sequelize.define('Delivery', {
  delivery_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pickup_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dropoff_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  item_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: true, // null until a driver accepts
  },
});

module.exports = Delivery;
