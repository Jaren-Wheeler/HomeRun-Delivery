/**
 * @file userRoutes.js
 * Authentication routes for user account creation and login.
 */

const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');

/**
 * POST /api/account
 * Create a new user account
 */
router.post('/register', UserController.register);

/**
 * POST /api/account/login
 * Authenticate user and return JWT
 */
router.post('/login', UserController.login);

module.exports = router;
