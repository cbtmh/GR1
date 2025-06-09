const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');

const router = express.Router();

// Route for creating a category
router.post('/', createCategory);

// Route for fetching all categories
router.get('/', getCategories);

module.exports = router;