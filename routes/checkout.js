const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/checkout-controller');

router.use(express.json());

router.post('/', CheckoutController.checkout);

module.exports = router;
