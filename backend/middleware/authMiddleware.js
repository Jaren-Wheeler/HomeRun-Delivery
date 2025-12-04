/**
 * @file authMiddleware.js
 * Protects routes by requiring a valid JWT token.
 * Loads authenticated user instance into req.user
 */

const { verifyToken } = require('../utils/token');
const { User } = require('../models');

const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token); // { id, iat, exp }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Token user no longer exists' });
    }

    req.user = user; // attach user for next middleware/controllers
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = requireAuth;
