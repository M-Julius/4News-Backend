const { Op } = require('sequelize');
const { Category, News, User } = require('../models');


const getInfoDashboard = async (req, res) => {
    try {
        const totalNews = await News.count();
        const totalCategories = await Category.count();
        const totalUsers = await User.count();

        res.json({
            totalNews,
            totalCategories,
            totalUsers,
            message: 'Data retrieved successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {    
    getInfoDashboard
};
  