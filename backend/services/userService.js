/**
 * @file userService.js
 * Business logic for user registration + login + Stripe customer linkage.
 *
 * Responsibilities:
 * - Secure credential validation
 * - Hash passwords before storing
 * - Enforce unique email constraint
 * - Create a Stripe Customer for new accounts (for card storage + billing)
 * - Return tokens and safe user objects (no password exposed)
 */

const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../utils/token');

// Stripe SDK initialized using project secret
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const UserService = {
  /**
   * Register a new user + create Stripe customer identity.
   * Flow:
   * 1) Validate payload
   * 2) Ensure email is not already registered
   * 3) Create user row (password hashed)
   * 4) Create Stripe customer (optional if Stripe fails)
   * 5) Return clean user object + JWT token
   */
  async register(data) {
    const { first_name, last_name, email, phone, password, role } = data;

    // Validate required fields
    if (!first_name || !last_name || !email || !phone || !password) {
      const err = new Error('All fields are required');
      err.statusCode = 400;
      throw err;
    }

    // Enforce unique email constraint
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      throw err;
    }

    // Secure password hashing
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user record WITHOUT Stripe reference (yet)
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone,
      passwordHash,
      role: role || 'purchaser', // deliverers must be chosen at registration
      isVerified: false,
    });

    // Stripe Customer creation
    try {
      const customer = await stripe.customers.create({
        email,
        name: `${first_name} ${last_name}`,
        phone,
        metadata: {
          appUserId: newUser.user_id, // maps Stripe → our DB
          role: role || 'purchaser',
        },
      });

      // Save Stripe ID to user record
      await newUser.update({ stripeCustomerId: customer.id });
    } catch (err) {
      console.error('❌ Stripe customer creation failed:', err.message);
      // NOTE: We allow registration to continue without Stripe
      // User will be prompted to add payment later if needed
    }

    // Remove passwordHash before returning to frontend
    const safeUser = newUser.toJSON();
    delete safeUser.passwordHash;

    // Issue JWT
    const token = signToken(newUser);

    return { user: safeUser, token };
  },

  /**
   * Login existing users.
   * Validates password + returns a JWT for authentication.
   */
  async login(data) {
    const { email, password } = data;

    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 400;
      throw err;
    }

    // Verify password hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 400;
      throw err;
    }

    // Strip password for safe client return
    const safeUser = user.toJSON();
    delete safeUser.passwordHash;

    // Create signed JWT session token
    const token = signToken(user);

    return { user: safeUser, token };
  },
};

module.exports = UserService;
