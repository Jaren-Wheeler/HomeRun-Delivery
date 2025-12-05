/**
 * @file User.js
 * Core user identity for the platform, supports both purchasers and deliverers.
 * Controls authentication, contact info, and reputation fields.
 *
 * IMPORTANT:
 * The database primary key column is `user_id`, but authentication (JWT), APIs,
 * and associations expect `id`. The getter below exposes `id` virtually so that:
 *   - JWT tokens can safely contain `{ id: user.id }`
 *   - Sequelize still stores the real column `user_id` internally
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    /**
     * Primary Key — REAL column in the database.
     * Exposed through virtual getter "id" below for consistency.
     */
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    /** Basic Profile */
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    /** Authentication */
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /** Contact */
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: /^[0-9+\-() ]+$/i, // simple validation for now
      },
    },

    /** Authorization Role */
    role: {
      type: DataTypes.ENUM('purchaser', 'deliverer'),
      allowNull: false,
      defaultValue: 'purchaser',
    },

    /** Stripe */
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'stripe_customer_id',
      comment: 'Stripe customer id for saved cards',
    },

    /** Reputation */
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ratingAverage: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    totalDeliveries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tableName: 'Users',
    underscored: true,

    /**
     * Allows code to reference user.id while DB keeps user_id.
     * Fixes breakage in:
     *  - JWT signToken({ id: user.id })
     *  - req.user.id in auth middleware
     *  - any API returning user objects
     */
    getterMethods: {
      id() {
        return this.getDataValue('user_id');
      },
    },

    /** Enforce uniqueness for login identity */
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

module.exports = User;
