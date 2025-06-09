const Category = require('../models/Category');

// Controller for creating a category
const createCategory = async (req, res) => {
    const { name, image } = req.body;

    try {
        const newCategory = new Category({ name, image });
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully!', category: newCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controller for fetching all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createCategory, getCategories };