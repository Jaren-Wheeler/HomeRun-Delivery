/**
 * @file userRoutes.js
 * Authentication routes for user account creation and login.
 *
 * These routes accept incoming HTTP requests and forward them
 * to the UserController for validation, service delegation, and response formatting.
 */

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Register new account
router.post('/', UserController.register);

// Login and return authenticated user profile (future: JWT token support)
router.post('/login', UserController.login);

module.exports = router;
