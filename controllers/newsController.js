const { News, Category } = require('../models');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/news'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const getAllNews = async (req, res) => {
  const { page = 1, limit = 10, keyword = '' } = req.query;

  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await News.findAndCountAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${keyword}%`
            }
          },
          {
            content: {
              [Op.like]: `%${keyword}%`
            }
          }
        ]
      },
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'title']
      },
      offset: parseInt(offset),
      limit: parseInt(limit)
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      news: rows,
      message: 'Data retrieved successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get news by ID
const getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findOne({
      where : { id },
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'title']
      }
    });
    if (!news) return res.status(404).json({message: 'News not found'});
    res.json(news);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Create new news with image upload
const createNews = upload.single('image_content'); // 'image_content' is the field name in your form
const createNewsHandler = async (req, res) => {
  const { title, category_id, content, created_by } = req.body;
  const image_content = req?.file?.filename ?? undefined; // Multer adds 'file' object to 'req' containing uploaded file details
  try {
    const newNews = await News.create({ title, category_id, content, image_content, created_by });
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update news by ID with image upload
const updateNews = upload.single('image_content');
const updateNewsHandler = async (req, res) => {
  const { id } = req.params;
  const { title, category_id, content, created_by } = req.body;
  const image_content = req.file ? req.file.filename : undefined; // Check if new image uploaded

  try {
    const news = await News.findByPk(id);
    if (!news) throw Error('News not found');
    
    news.title = title;
    news.category_id = category_id;
    news.content = content;
    if (image_content) {
      news.image_content = image_content;
    }
    news.created_by = created_by;
    
    await news.save();
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete news by ID
const deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findByPk(id);
    if (!news) throw Error('News not found');
    
    await news.destroy();
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  createNewsHandler,
  updateNews,
  updateNewsHandler,
  deleteNews,
};
