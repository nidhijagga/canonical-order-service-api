const express = require('express');
const router = express.Router();
const { listOrders } = require('../controllers/ordersController');

router.get('/orders', listOrders);

module.exports = router;
