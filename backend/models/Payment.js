
const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Delivery = require("./Delivery");

const Payment = sequelize.define("Payment", {
    payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paymentDate: {
        type: DataTypes.DATE
    }
});

Payment.belongsTo(Delivery, {foreignKey: "payment_id"});
module.exports = Payment;