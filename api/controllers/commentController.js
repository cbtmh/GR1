const Comment = require('../models/Comment');

// Controller for creating a comment
const createComment = async (req, res) => {
    const { postId, content, author } = req.body;

    try {
        const newComment = new Comment({ postId, content, author });
        await newComment.save();

        // Populate thông tin author cho comment vừa tạo trước khi gửi về client
        // Đảm bảo rằng bạn cũng populate avatar nếu có
        const populatedComment = await Comment.findById(newComment._id)
            .populate('author', 'username email avatar'); // Thêm 'avatar' vào đây

        res.status(201).json({ message: 'Comment created successfully!', comment: populatedComment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for fetching comments (ĐÃ SỬA)
const getComments = async (req, res) => {
    try {
        const { postId } = req.query; // Lấy postId từ query params (ví dụ: /comments?postId=abc)

        if (!postId) {
            // Nếu không có postId, có thể là một yêu cầu lấy tất cả comments (ví dụ cho admin)
            // hoặc là một lỗi. Trong trường hợp này, ta yêu cầu phải có postId.
            return res.status(400).json({ message: 'Post ID is required to fetch comments.' });
        }

        // Lọc comments theo postId và populate thông tin author (bao gồm cả avatar)
        // Sắp xếp theo thời gian tạo, comment mới nhất lên đầu (tùy chọn)
        const comments = await Comment.find({ postId: postId }) // Lọc theo postId
            .populate('author', 'username email avatar') // Populate cả avatar của author
            .populate('postId', 'title') // Tùy chọn: populate cả thông tin post nếu cần
            .sort({ createdAt: -1 }); // Sắp xếp comments mới nhất lên đầu

        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error in getComments:", error); // Log lỗi ra server để debug
        res.status(500).json({ error: 'Server error while fetching comments.' }); // Trả về lỗi 500 nếu có lỗi server
    }
};

module.exports = { createComment, getComments };