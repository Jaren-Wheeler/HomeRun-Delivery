const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Report = sequelize.define("Report", {
    report_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});


module.exports = Report;