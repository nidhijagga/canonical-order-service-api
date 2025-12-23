const Order = require('../models/order');

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 }).lean();
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch orders', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
