const { computeShipToHash } = require('./shipToHash');

function toCanonicalOrder(payload = {}) {
  const { event_id, platform, order = {} } = payload;

  if (!event_id) {
    throw new Error('Missing event_id');
  }

  if (!platform) {
    throw new Error('Missing platform');
  }

  if (!order.id) {
    throw new Error('Missing order.id');
  }

  if (!order.name) {
    throw new Error('Missing order.name');
  }

  if (!order.email) {
    throw new Error('Missing order.email');
  }

  const shipping = order.shipping_address || {};

  const ship_to_hash = computeShipToHash({
    name: shipping.name,
    address1: shipping.address1,
    city: shipping.city,
    zip: shipping.zip,
    country: shipping.country,
  });

  const lines = (order.line_items || []).map((item) => {
    if (!item.sku) {
      throw new Error('Line item missing sku');
    }

    if (typeof item.quantity !== 'number') {
      throw new Error('Line item missing quantity');
    }

    return {
      sku: item.sku,
      qty: item.quantity,
    };
  });

  if (!lines.length) {
    throw new Error('Order must contain at least one line item');
  }

  const created_at = order.created_at ? new Date(order.created_at) : new Date();

  return {
    event_id,
    external_platform: platform,
    external_order_id: order.id,
    order_name: order.name,
    customer_email: order.email,
    ship_to_hash,
    lines,
    total: Number(order.total_price ?? 0),
    status: 'RECEIVED',
    created_at,
  };
}

module.exports = { toCanonicalOrder };