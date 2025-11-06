const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");

const Vehicle = sequelize.define("Vehicle", {
    vehicle_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    make: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Vehicle.associate = (models) => {
    Vehicle.belongsToMany(models.User), {
        through: "UserVehicle",
        foreignKey: "vehicle_id",
        otherKey: "user_id"
    };
};

module.exports = Vehicle;