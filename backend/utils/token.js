/**
 * @file token.js
 * Handles creation and verification of JWT authentication tokens.
 */

const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for the given user.
 *
 * Includes both:
 *  - id  (for authentication)
 *  - role (for authorization)
 */
const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.account_type, // 👈 Add role to JWT payload
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Validates a provided JWT and returns its decoded content.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
