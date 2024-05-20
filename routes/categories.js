const express = require("express");
const router = express.Router();
const CategoryController = require('../controllers/category-controller');

router.use(express.json());

router.get("/", CategoryController.categories);

module.exports = router;
