/**
 * @file Review model definition.
 *
 * Represents feedback provided by users after a delivery is completed.
 * Reviews contribute to user reputation and platform trust.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Review Schema
 *
 * @property {number} review_id - Primary key identifier
 * @property {number} stars - Rating value (1–5)
 * @property {string|null} comment - Optional written feedback
 * @property {number} user_id - The user who submitted the review
 *
 * Notes:
 * - Timestamps (createdAt/updatedAt) are auto-managed by Sequelize
 * - Reviews may later be linked directly to a Delivery or Driver
 */
const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  stars: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5, // enforce 5-star rating system
    },
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Review;
