const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// GET all news
router.get('/', newsController.getAllNews);

// GET news by ID
router.get('/:id', newsController.getNewsById);

// POST create news
router.post('/', newsController.createNews, newsController.createNewsHandler);

// PUT update news by ID
router.put('/:id', newsController.updateNews, newsController.updateNewsHandler);

// DELETE news by ID
router.delete('/:id', newsController.deleteNews);

module.exports = router;
