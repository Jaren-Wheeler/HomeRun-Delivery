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

/**
 * Initializes and syncs database schema.
 */

const sequelize = require('./db.js');

// 1️⃣ Load ALL models
const User = require('../models/User');
const Delivery = require('../models/Delivery');
const Payment = require('../models/Payment');

// 2️⃣ THEN load associations (applies to THESE model instances)
require('../models/associations');

async function initDB() {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    await sequelize.authenticate();
    console.log('🔌 DB connection established');

    await sequelize.query("PRAGMA journal_mode = WAL;");
    // 3️⃣ Sync AFTER associations are loaded
    await sequelize.sync({
      alter: false,
      force: false
    });

    console.log('🗄️ Database synchronized successfully');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    throw err;
  }
}

module.exports = initDB;
