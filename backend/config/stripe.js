/**
 * @file Stripe client configuration.
 *
 * Initializes and exports a preconfigured Stripe instance
 * using the secret API key provided in .env.
 *
 * Environment variable required:
 *  - STRIPE_SECRET_KEY : Private key for server-side Stripe operations
 *
 * The `stripe` object is used throughout backend services to create
 * and manage payment intents, refunds, and secure payment operations.
 */

const Stripe = require('stripe');

// Ensure Stripe key is provided before runtime
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
}

/**
 * Stripe client instance configured with explicit API version
 * for forward-compatible Stripe integration.
 *
 * @type {import('stripe').Stripe}
 */
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

module.exports = stripe;
