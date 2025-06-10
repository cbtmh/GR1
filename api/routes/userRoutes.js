const express = require('express');
const { registerUser, loginUser,forgotPassword,resetPassword, getUsers, getUserProfile, updateUserAvatar, updateUserCoverImage } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

//setting multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars/');
    },
    filename: function (req, file, cb) {
        // Vì user chưa tồn tại, ta dùng thời gian để tạo tên file duy nhất
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
router.put('/profile/avatar', protect, upload.single('avatar'), updateUserAvatar);
// Route for user registration (now supports avatar upload)
router.post('/register', upload.single('avatar'), registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for fetching all users
router.get('/', getUsers);

// Route for fetching a user's profile
router.get('/profile/:id', getUserProfile);
// Route for forgot password
router.post('/forgot-password', forgotPassword);

// Route for reset password
router.patch('/reset-password/:token', resetPassword);
// Multer config for cover image uploads
const coverStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/covers/');
    },
    filename: function (req, file, cb) {
        cb(null, 'cover-' + Date.now() + path.extname(file.originalname));
    }
});
const coverUpload = multer({ storage: coverStorage });
router.put('/profile/cover', protect, coverUpload.single('coverImage'), updateUserCoverImage);

module.exports = router;