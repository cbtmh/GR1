const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const jwt = require('jsonwebtoken');

// Controller for user registration
const registerUser = async (req, res) => {
    // If file is uploaded, use its path; else fallback to req.body.avatar
    const { username, email, password } = req.body;
    let avatar = req.body.avatar || '';
    if (req.file) {
        avatar = `/uploads/avatars/${req.file.filename}`;
    }

    try {
        // Kiểm tra xem user đã tồn tại chưa
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Băm mật khẩu trước khi lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới với mật khẩu đã được băm
        user = new User({
            username,
            email,
            password: hashedPassword, // Lưu mật khẩu đã được băm
            avatar: avatar
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller for user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm user bằng email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã băm trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d', // Token hết hạn sau 30 ngày
        });

        // Loại bỏ mật khẩu khỏi đối tượng user trước khi gửi về client
        const userObject = user.toObject();
        delete userObject.password;

        // Trả về dữ liệu user và token
        res.status(200).json({
            ...userObject,
            token, //  Gửi token về cho client
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller for fetching all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for fetching a user's profile
const getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Controller for updating user avatar
const updateUserAvatar = async (req, res) => {
    try {
        // req.user.id được lấy từ authMiddleware sau khi giải mã token
        const userId = req.user.id;

        // req.file được cung cấp bởi multer, chứa thông tin file đã upload
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Đường dẫn tới file avatar trên server
        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        const fullAvatarUrl = `${req.protocol}://${req.get('host')}${avatarPath}`;

        // Cập nhật trường avatar trong DB (chỉ lưu đường dẫn tương đối)
        await User.findByIdAndUpdate(userId, { avatar: avatarPath });

        res.status(200).json({
            message: 'Avatar updated successfully',
            avatarUrl: fullAvatarUrl // Trả về URL đầy đủ cho frontend
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error while updating avatar.' });
    }
};

// Controller for updating user cover image
const updateUserCoverImage = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const coverPath = `/uploads/covers/${req.file.filename}`;
        const fullCoverUrl = `${req.protocol}://${req.get('host')}${coverPath}`;
        await User.findByIdAndUpdate(userId, { coverImage: coverPath });
        res.status(200).json({
            message: 'Cover image updated successfully',
            coverImageUrl: fullCoverUrl
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error while updating cover image.' });
    }
};

module.exports = { registerUser, loginUser, getUsers, getUserProfile, updateUserAvatar, updateUserCoverImage };