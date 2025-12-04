/**
 * @file token.js
 * Handles creation and verification of JWT authentication tokens.
 *
 * Token Payload:
 *  - Contains only the user ID (`{ id: user.id }`)
 *    → This keeps the token lightweight and avoids exposing sensitive data.
 *
 * Expiration:
 *  - 7 days: allows persistent login across app use
 *  - Security balanced with convenience
 */

const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for the given user.
 *
 * @param {Object} user - Sequelize user instance
 * @returns {string} A signed JWT encrypted with JWT_SECRET
 *
 * Token structure example:
 *   {
 *     "id": 123,
 *     "iat": 1701642200,
 *     "exp": 1702247000
 *   }
 */
const signToken = (user) => {
  return jwt.sign(
    { id: user.id }, // minimal user identity
    process.env.JWT_SECRET, // 🔐 must be defined in .env
    { expiresIn: '7d' } // token lifespan
  );
};

/**
 * Validates a provided JWT and returns its decoded content.
 *
 * @param {string} token - Raw token string from the Authorization header
 * @returns {Object} Decoded token payload (e.g., { id, iat, exp })
 *
 * Throws if:
 *  - Token missing
 *  - Token expired
 *  - Token signature invalid
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
