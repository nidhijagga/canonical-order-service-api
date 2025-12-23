exports.receiveOrderWebhook = (req, res) => {
  // Webhook payload handling (idempotency, DTO transform, persistence) will be added next steps.
  return res.status(202).json({ status: 'accepted' });
};
