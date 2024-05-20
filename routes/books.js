const express = require("express");
const router = express.Router();
const BookController = require('../controllers/book-controller');

router.use(express.json());

router.get("/", BookController.getBooks);
router.get("/:id", BookController.getBook);

module.exports = router;
