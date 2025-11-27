/**
 * @file Database initialization helper.
 *
 * Provides a single function (`initDb`) that:
 *  1. Authenticates the database connection
 *  2. Syncs Sequelize models into actual database tables
 *
 * This ensures that the database schema is ready before
 * starting the server. Sync is performed automatically during
 * local development; production deployments may use migrations.
 */

const { sequelize } = require('../models');

/**
 * Initializes the database by authenticating and syncing schema.
 * Logs status and errors for debugging during development.
 *
 * @returns {Promise<void>}
 */
async function initDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');

    await sequelize.sync({});
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Database sync failed:', error);
  }
}

module.exports = initDb;
