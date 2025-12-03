/**
 * @file userService.js
 * Handles the business logic for user registration and login.
 *
 * Responsibilities:
 * - Validate incoming credentials
 * - Hash passwords securely
 * - Enforce unique emails
 * - Return safe user objects (no hashed passwords exposed)
 */

const bcrypt = require('bcryptjs');
const User = require('../models/User');

const UserService = {
  /**
   * Create a new account in the system.
   * Ensures unique email + secure password hashing.
   */
  async register(data) {
    const { first_name, last_name, email, phone, password, role } = data;

    // Basic validation
    if (!first_name || !last_name || !email || !phone || !password) {
      const err = new Error('All fields are required');
      err.statusCode = 400;
      throw err;
    }

    // Prevent duplicate accounts on same email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      throw err;
    }

    // Secure password hashing
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user row
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone,
      passwordHash,
      role: role || 'purchaser', // sensible default
      isVerified: false,
    });

    // Strip password before returning to client
    const { passwordHash: _, ...safeUser } = newUser.toJSON();
    return safeUser;
  },

  /**
   * Authenticate the user by verifying credentials.
   * Future-ready for JWT token generation.
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

    // Compare hashed password with user input
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 400;
      throw err;
    }

    // Exclude passwordHash from the response
    const { passwordHash, ...safeUser } = user.toJSON();
    return safeUser;
  },
};

module.exports = UserService;
