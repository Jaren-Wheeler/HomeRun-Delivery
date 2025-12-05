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
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: ['user_id', 'role'],
    });

    if (!user) return res.status(401).json({ error: 'User no longer exists' });

    req.user = {
      id: user.user_id,
      role: user.role, // 👈 source of truth
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = requireAuth;
