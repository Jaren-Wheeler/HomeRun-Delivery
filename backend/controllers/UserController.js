/**
 * @file userController.js
 * Handles HTTP concerns for authentication and user creation.
 *
 * Responsibilities:
 *  - Validate incoming request body shape
 *  - Format JSON responses and status codes
 *  - Delegate core business logic to UserService
 */

const UserService = require('../services/userService');

const UserController = {
  /**
   * Register a new user account.
   * Accepts required user fields and passes them to the service layer.
   */
  async register(req, res) {
    try {
      const user = await UserService.register(req.body);

      return res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (err) {
      console.error('❌ Register Error:', err.message);

      return res.status(err.statusCode || 500).json({
        error: err.message || 'Registration failed',
      });
    }
  },

  /**
   * Authenticate an existing user.
   * Valid credentials return user profile without password hash.
   */
  async login(req, res) {
    try {
      const safeUser = await UserService.login(req.body);

      return res.status(200).json({
        message: 'Login successful',
        user: safeUser,
      });
    } catch (err) {
      console.error('❌ Login Error:', err.message);

      return res.status(err.statusCode || 500).json({
        error: err.message || 'Login failed',
      });
    }
  },
};

module.exports = UserController;
