const crypto = require('crypto');

const REQUIRED_FIELDS = ['name', 'address1', 'city', 'zip', 'country'];

function normalizeField(value, field) {
  if (value === undefined || value === null) {
    throw new Error(`Missing field for ship_to_hash: ${field}`);
  }

  const normalized = String(value).trim();

  if (!normalized) {
    throw new Error(`Empty field for ship_to_hash: ${field}`);
  }

  return normalized;
}

function computeShipToHash(address = {}) {
  const normalizedParts = REQUIRED_FIELDS.map((field) => normalizeField(address[field], field));
  const payload = normalizedParts.join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
}

module.exports = { computeShipToHash };
