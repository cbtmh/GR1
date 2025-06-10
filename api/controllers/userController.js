const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const sendEmail = require('../utils/email'); 
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
// Controller for forgot password
const forgotPassword = async (req, res) => {
    try {
        // 1) Tìm user bằng email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Để bảo mật, không báo lỗi "User not found" mà trả về thành công chung chung
            // để tránh kẻ xấu dò email tồn tại trong hệ thống.
            return res.status(200).json({
                status: 'success',
                message: 'If a user with that email exists, a token has been sent.',
            });
        }

        // 2) Tạo token ngẫu nhiên
        const resetToken = crypto.randomBytes(32).toString('hex');

        // 3) Hash token và lưu vào DB
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Token hết hạn sau 10 phút
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // 4) Gửi token về email của user
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `Forgot your password? Click the link to reset your password: ${resetURL}\nIf you didn't forget your password, please ignore this email! This link is valid for 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message,
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!',
            });
        } catch (err) {
            console.error('ERROR SENDING EMAIL:', err);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ message: 'There was an error sending the email. Try again later!' });
        }
    } catch (error) {
        console.error('FORGOT PASSWORD ERROR:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller for reset password
const resetPassword = async (req, res) => {
    try {
        // 1) Lấy user dựa trên token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // Token chưa hết hạn
        });

        // 2) Nếu token không hợp lệ hoặc hết hạn
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }
         // Kiểm tra độ dài mật khẩu
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Băm mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 3) Đăng nhập người dùng và gửi JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        
        const userObject = user.toObject();
        delete userObject.password;

        res.status(200).json({
            ...userObject,
            token,
        });

    } catch (error) {
        console.error('RESET PASSWORD ERROR:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports = { registerUser,forgotPassword,resetPassword, loginUser, getUsers, getUserProfile, updateUserAvatar, updateUserCoverImage };