const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");


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
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Delivery;