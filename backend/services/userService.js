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
const { User } = require('../models');
const { signToken } = require('../utils/token'); // ⭐ New import

const UserService = {
  /**
   * Create a new account in the system.
   * Ensures unique email + secure password hashing.
   */
  async register(data) {
    const { first_name, last_name, email, phone, password, role } = data;

    if (!first_name || !last_name || !email || !phone || !password) {
      const err = new Error('All fields are required');
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone,
      passwordHash,
      role: role || 'purchaser',
      isVerified: false,
    });

    const safeUser = newUser.toJSON();
    delete safeUser.passwordHash;

    // Auto-login user after registration
    const token = signToken(newUser);

    return { user: safeUser, token };
  },

  /**
   * Authenticate the user by verifying credentials.
   * Now issues JWT token for secure session management.
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

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 400;
      throw err;
    }

    const safeUser = user.toJSON();
    delete safeUser.passwordHash;

    // Generate signed JWT
    const token = signToken(user);

    return { user: safeUser, token };
  },
};

module.exports = UserService;
