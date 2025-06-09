const express = require('express');
const { createTag, getTags } = require('../controllers/tagController');

const router = express.Router();

// Route for creating a tag
router.post('/', createTag);

// Route for fetching all tags
router.get('/', getTags);

module.exports = router;