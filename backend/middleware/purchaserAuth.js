const requirePurchaser = async (req, res, next) => {
   // Roles that are allowed to access "purchaser" routes.
  const allowedRoles = ['purchaser', 'deliverer'];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: 'Forbidden: Purchaser or Deliverer role required' });
  }
  next();
};

module.exports = requirePurchaser;