const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const Payment = require("./Payment");

const Delivery = sequelize.define("Delivery", {
    delivery_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pickup_address: {
        type: DataTypes.STRING,
        allowedNull: false
    },
    dropoff_address: {
        type: DataTypes.STRING,
        allowedNull: false
    },
    item_description: {
        type: DataTypes.STRING,
        allowedNull: false
    },
    proposed_payment: {
        type: DataTypes.DECIMAL,
        allowedNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowedNull: false
    },
    createdAt: {
        type: DataTypes.DATE
    }

});

Delivery.belongsTo(User, {foreignKey: "user_id"});

Delivery.hasOne(Payment, {foreignKey: "payment_id", onDelete: "CASCADE"});

module.exports = Delivery;