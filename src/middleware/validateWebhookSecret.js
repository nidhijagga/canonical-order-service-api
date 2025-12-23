const { webhookSecret } = require('../config');

const WEBHOOK_HEADER = 'x-webhook-secret';

module.exports = function validateWebhookSecret(req, res, next) {
  const providedSecret = req.get(WEBHOOK_HEADER);

  if (!providedSecret || providedSecret !== webhookSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
};

module.exports.WEBHOOK_HEADER = WEBHOOK_HEADER;
