/**
 * @file server.js
 * Entry point for the HomeRun Delivery backend API.
 *
 * Responsibilities:
 * - Load environment variables
 * - Initialize database and associations
 * - Configure global middleware
 * - Register feature routes
 * - Start Express server once DB is initialized
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const initDb = require('./config/dbSync'); // schema sync + associations
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Helpful request logging (great during development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ---------------------------------------------------------------------------
// Route mounting via route barrel
// ---------------------------------------------------------------------------

app.use((req, res, next) => {
  console.log('➡️  HIT ROUTE:', req.method, req.originalUrl);
  next();
});

const routes = require('./routes');

app.use('/api/maps', routes.mapRoutes);
app.use('/api/deliverer', routes.delivererRoutes);
app.use('/api/purchaser', routes.purchaserRoutes);
app.use('/api/account', routes.userRoutes);
app.use('/api/payments', routes.paymentRoutes);

// ---------------------------------------------------------------------------
// Server + Database initialization sequence
// ---------------------------------------------------------------------------
async function startServer() {
  try {
    await initDb(); // sync models & ensure relationships are registered

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to initialize database:', err.message);
    process.exit(1); // crash on boot failure
  }
}

// Boot
startServer();
