const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order-controller');

router.use(express.json());

router.get('/', OrderController.getOrders);
router.get('/:orderId', OrderController.getOrder);

module.exports = router;
