/**
 * @file Review.js
 * Stores user-submitted reviews that provide reputation scoring
 * for drivers and/or purchasers. Each review is tied to a user.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define(
  'Review',
  {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // 1–5 rating for a completed delivery experience
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },

    // Optional feedback text
    comment: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // FK: who received the review
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    timestamps: true,
    tableName: 'Reviews',
  }
);

module.exports = Review;
