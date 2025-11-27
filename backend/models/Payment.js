const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
  },
  deliveryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Payment;
