const express = require('express');
const router = express.Router();
const { addToCart, getCartItems, removeCartItem } = require('../controllers/cart-controller');

router.get('/', getCartItems)
router.post('/', addToCart);
router.delete('/:id', removeCartItem)

module.exports = router;
