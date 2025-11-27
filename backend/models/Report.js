/**
 * @file Report model definition.
 *
 * Represents user-submitted reports regarding inappropriate behavior,
 * delivery issues, or platform rule violations. Reports are used by
 * admins for moderation and dispute resolution.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Report Schema
 *
 * @property {number} report_id - Primary key for moderation tracking
 * @property {string} message - Description of the issue being reported
 * @property {number} user_id - The user who submitted the report
 *
 * Notes:
 * - Timestamps (createdAt/updatedAt) are enabled by default in Sequelize
 * - Report resolution state may be added later (e.g., reviewed, dismissed)
 */
const Report = sequelize.define('Report', {
  report_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Report;
