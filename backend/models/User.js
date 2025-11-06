const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Delivery = require("./Delivery");
const Review = require("./Review");
const Report = require("./Report");
const Vehicle = require("./Vehicle");

const User = sequelize.define("User", {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    ratingAverage: {
        type: DataTypes.FLOAT
    },
    totalDeliveries: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

// handle one to many relationships
User.hasMany(Delivery, {foreignKey: "delvery_id", onDelete: "CASCADE"});
User.hasMany(Review, {foreignKey: "review_id", onDelete: "CASCADE"});
User.hasMany(Report, {foreignKey: "report_id", onDelete: "CASCADE"});

// handle many to many relationship with Vehicle
User.associate = (models) => {
    User.belongsToMany(models.Vehicle), {
        through: "UserVehicle",
        foreignKey: "user_id",
        otherKey: "vehicle_id"
    };
};

module.exports = User;