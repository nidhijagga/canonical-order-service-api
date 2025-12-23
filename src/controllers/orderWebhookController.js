const Order = require('../models/order');
const { toCanonicalOrder } = require('../lib/canonicalOrder');

exports.receiveOrderWebhook = async (req, res) => {
  let canonicalOrder;

  try {
    canonicalOrder = toCanonicalOrder(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid payload' });
  }

  try {
    const createdOrder = await Order.create(canonicalOrder);

    return res.status(201).json({
      status: 'stored',
      event_id: createdOrder.event_id,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(200).json({
        status: 'duplicate',
        event_id: canonicalOrder.event_id,
      });
    }

    if (error?.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }

    console.error('Failed to process webhook event', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
