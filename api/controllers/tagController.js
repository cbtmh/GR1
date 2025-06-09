const Tag = require('../models/Tag');

// Controller for creating a tag
const createTag = async (req, res) => {
    const { name } = req.body;

    try {
        const newTag = new Tag({ name });
        await newTag.save();
        res.status(201).json({ message: 'Tag created successfully!', tag: newTag });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for fetching all tags
const getTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json({ tags });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createTag, getTags };