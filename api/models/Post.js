const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    content:
    {
        type: String,
        required: true
    },
    author:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    createdAt:
    {
        type: Date,
        default: Date.now
    },
    excerpt: {
        type: String,
        default: ''
    },
    tags: [{
        type: String
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    featuredImage: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    approved: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Chỉ cho phép 3 giá trị này
        default: 'pending'
    },
});

module.exports = mongoose.model('Post', postSchema);