const express = require('express');
const router = express.Router();
const { like, unlike } = require('../controllers/like-controller');

router.use(express.json());

router.post('/:book_id', like);
router.delete('/:book_id', unlike);

module.exports = router;