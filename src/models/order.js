const mongoose = require('mongoose');

const LineSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    event_id: { type: String, required: true, unique: true, index: true },
    external_platform: { type: String, required: true },
    external_order_id: { type: String, required: true },
    order_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    ship_to_hash: { type: String, required: true },
    lines: { type: [LineSchema], required: true, default: [] },
    total: { type: Number, required: true },
    status: { type: String, required: true, default: 'RECEIVED' },
    created_at: { type: Date, required: true },
  },
  {
    collection: 'orders',
    timestamps: { createdAt: 'stored_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Order', OrderSchema);
