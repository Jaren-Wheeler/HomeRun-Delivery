module.exports = function requirePurchaser(req, res, next) {
  if (!req.user || req.user.role !== 'purchaser') {
    return res.status(403).json({ error: 'Forbidden: Purchaser only' });
  }
  next();
};
