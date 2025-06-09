const Post = require('../models/Post');
const mongoose = require('mongoose');

// Controller for creating a post
const createPost = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            tags,
            category,
            status,
            publishDate,
            author,
        } = req.body;

        let featuredImage = '';
        // SỬA ĐỔI: Thêm tiền tố 'uploads/' vào đường dẫn ảnh
        if (req.file) {
            featuredImage = `uploads/${req.file.filename}`;
        } else if (req.body.featuredImage) {
            featuredImage = req.body.featuredImage;
        }

        const newPost = new Post({
            title,
            content,
            excerpt,
            tags,
            category,
            featuredImage,
            status,
            publishDate,
            author,
        });
        await newPost.save();
        await newPost.populate('category');
        res.status(201).json({ message: 'Post created successfully!', post: newPost });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for fetching all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ approved: 'approved' }).populate('author', 'username email avatar');
        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(400).json({ error: error.message });
    }
};

// Fetch all articles
const getAllArticles = async (req, res) => {
    try {
        const articles = await Post.find({ approved: 'approved' });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching articles', error });
    }
};

// Controller for fetching posts by a specific user
const getUserPosts = async (req, res) => {
    const userId = req.params.userId; // Assuming user ID is passed as a route parameter

    try {
        const posts = await Post.find({ author: userId }).populate('author', 'username email');
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for fetching posts by category
const getPostsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ error: 'Invalid categoryId' });
    }
    try {
        const posts = await Post.find({ category: new mongoose.Types.ObjectId(categoryId), approved: 'approved' })
            .populate('author', 'username avatar')
            .populate('category', 'name');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        res.status(500).json({ error: 'Failed to fetch posts by category' });
    }
};

// Controller for approving a post (admin only)
const approvePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByIdAndUpdate(
            postId,
            { approved: 'approved' }, // Set the post status to approved
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post approved successfully', post });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for rejecting a post (admin only)
const rejectPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findByIdAndUpdate(
            postId,
            { approved: 'rejected' }, // Đặt trạng thái là 'rejected'
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post rejected successfully', post });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for admin to get all posts (approved & not approved)
const getAllPostsForAdmin = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email').populate('category', 'name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for fetching a single post by ID
const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId).populate('author', 'username email avatar').populate('category');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for updating a post by ID
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content, excerpt } = req.body;


        const updateData = {
            title,
            content,
            excerpt,
            approved: 'pending', // Set to pending for admin approval
        };

        if (req.file) {
            updateData.featuredImage = `uploads/${req.file.filename}`;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post updated successfully! Pending admin approval.', post: updatedPost });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
module.exports = { createPost, getPosts, getAllArticles, getUserPosts, rejectPost, getPostsByCategory, approvePost, getAllPostsForAdmin, getPostById, updatePost };