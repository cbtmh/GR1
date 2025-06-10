const express = require('express');
const multer = require('multer');
const path = require('path');
const { createPost, getPosts, deletePost, getAllArticles, getUserPosts, rejectPost, getPostsByCategory, approvePost, getAllPostsForAdmin, getPostById, updatePost } = require('../controllers/postController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const Post = require('../models/Post'); // Correct the import path for the Post model

const router = express.Router();

// Thiết lập multer cho upload ảnh bài viết
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Lưu ảnh vào thư mục uploads
    },
    filename: function (req, file, cb) {
        cb(null, 'post-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Route for creating a post (hỗ trợ upload ảnh)
router.post('/', upload.single('featuredImage'), createPost);

// Route for fetching all posts
router.get('/', getPosts);

// Route to fetch all articles
router.get('/articles', getAllArticles);

// Route for fetching posts by a specific user
router.get('/user/:userId', getUserPosts);

// Route for fetching posts by category (đồng bộ với FE)
router.get('/category/:categoryId', getPostsByCategory);

// Route for updating a post by ID
router.put('/:id', protect, upload.single('featuredImage'), updatePost);

// Route for deleting a post by ID
router.delete('/:id', protect, deletePost);

// Route for admin to approve a post
router.put('/:id/approve', protect, isAdmin, approvePost);

// Route for admin to reject a post
router.put('/:id/reject', protect, isAdmin, rejectPost);

// Route for admin to get all posts (approved & not approved)
router.get('/all', protect, isAdmin, getAllPostsForAdmin);

// Update the route to use a dedicated controller function for fetching a single post by ID
router.get('/:id', getPostById);


module.exports = router;