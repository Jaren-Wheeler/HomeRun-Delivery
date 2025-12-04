/**
 * @file index.js
 * Barrel export for all Express router modules.
 *
 * Enables cleaner mounting in server.js:
 *   const routes = require('./routes');
 *   app.use('/api/users', routes.userRoutes);
 */

const delivererRoutes = require('./delivererRoutes');
const mapRoutes = require('./mapRoutes');
const paymentRoutes = require('./paymentRoutes');
const purchaserRoutes = require('./purchaserRoutes');
const userRoutes = require('./userRoutes');

console.log('🎯 Routes successfully loaded');
module.exports = {
  delivererRoutes,
  mapRoutes,
  paymentRoutes,
  purchaserRoutes,
  userRoutes,
};
