const express = require('express');
const router = express.Router();
const validateWebhookSecret = require('../middleware/validateWebhookSecret');
const { receiveOrderWebhook } = require('../controllers/orderWebhookController');

router.post('/webhooks/order', validateWebhookSecret, receiveOrderWebhook);

module.exports = router;
