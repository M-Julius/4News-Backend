const { Category } = require('../models');

// Get all categories
const getAllCategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10 if not provided

  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await Category.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit)
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      categories: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Category by id
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) throw new Error('Category not found');
    res.json(category);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};


// Create new category
const createCategory = async (req, res) => {
  const { title } = req.body;
  try {
    const newCategory = await Category.create({ title });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update category by ID
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) throw Error('Category not found');
    
    category.title = title;
    
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category by ID
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) throw Error('Category not found');
    
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById
};
