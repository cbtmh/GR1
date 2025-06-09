const express = require('express');
const { createComment, getComments } = require('../controllers/commentController');

const router = express.Router();

// Route for creating a comment
router.post('/', createComment);

// Route for fetching all comments
router.get('/', getComments);

module.exports = router;