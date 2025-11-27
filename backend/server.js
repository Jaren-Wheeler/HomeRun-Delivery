/**
 * @file Application entry point.
 *
 * Initializes the Express server, middleware, and database connection.
 * Loads API routes and ensures database schema is ready before accepting traffic.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDb = require('./config/dbSync');

const app = express();
const PORT = process.env.PORT || 5000;

// Global middleware
app.use(cors()); // Allow cross-origin requests (frontend communication)
app.use(express.json()); // Parse incoming JSON payloads

// API Routes
app.use('/api', require('./routes/mapRoutes')); // Mapping / geolocation features
app.use('/api/payments', require('./routes/paymentRoutes')); // Stripe payments

// Basic health check route
app.get('/', (req, res) => {
  res.send('Server is running.');
});

/**
 * Bootstraps the application:
 *  1. Initializes and syncs database schema
 *  2. Starts HTTP server when DB is ready
 */
const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // Ensure crash is visible in production logs
  }
};

startServer();
