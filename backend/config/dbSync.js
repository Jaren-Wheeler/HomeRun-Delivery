/**
 * Initializes and syncs database schema.
 * Uses safer behavior depending on environment:
 *
 * Development:
 *   - auto updates tables on changes (alter: true)
 *
 * Production:
 *   - does NOT modify schema
 */

const sequelize = require('./db.js');
require('../models/associations'); // <– IMPORTANT: central association definitions only

async function initDB() {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    await sequelize.authenticate();
    console.log('🔌 DB connection established');

    await sequelize.sync({
      alter: !isProduction, // auto-update tables only in dev
      force: false, // never drop tables automatically
    });

    console.log('🗄️ Database synchronized successfully');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    if (err.errors) {
      err.errors.forEach((e) => console.error(` - ${e.message} (${e.path})`));
    }
    throw err;
  }
}

module.exports = initDB;
