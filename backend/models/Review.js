const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Review = sequelize.define("Review", {
    review_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    stars: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        allowedNull: false
    }
});

Review.belongsTo(User, {foreignKey: "review_id"});
module.exports = Review;