/**
 * @file authMiddleware.js
 * Protects routes by requiring a valid JWT token.
 * Loads authenticated user identity + role into req.user
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
    const decoded = verifyToken(token); // { id, role, iat, exp }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Token user no longer exists' });
    }

    // Standardized identity passed through backend
    req.user = {
      id: user.id,
      role: decoded.role, // 👈 Store role retrieved from token
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = requireAuth;
