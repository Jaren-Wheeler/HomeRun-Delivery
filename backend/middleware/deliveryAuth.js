/**
 * @file deliveryAuth.js
 * Ensures the authenticated user is the assigned deliverer.
 */
const { Delivery, Payment } = require('../models');

const requireDeliverer = async (req, res, next) => {
  try {
    const { deliveryId, paymentId } = req.params;
    let delivery;

    // Look up delivery directly if deliveryId exists
    if (deliveryId) {
      delivery = await Delivery.findByPk(deliveryId);
    }

    // Or resolve delivery through payment if paymentId is provided
    else if (paymentId) {
      const payment = await Payment.findByPk(paymentId);
      delivery = await Delivery.findByPk(payment?.deliveryId);
    }

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // Confirm the delivery belongs to the authenticated deliverer
    if (delivery.deliverer_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'Not authorized for this delivery' });
    }

    req.delivery = delivery;
    next();
  } catch (err) {
    console.error('Deliverer authorization error:', err);
    res.status(403).json({ error: 'Forbidden' });
  }
};

module.exports = requireDeliverer;
