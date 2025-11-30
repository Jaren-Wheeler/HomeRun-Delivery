const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");
const  User = require("./User");

const Delivery = sequelize.define("Delivery", {
    delivery_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pickup_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dropoff_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
    type: DataTypes.FLOAT,
    allowNull: true
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    item_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proposed_payment: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    },
    purchaser_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deliverer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});

module.exports = Delivery;