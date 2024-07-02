'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      News.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    }
  }

  News.init({
    title: DataTypes.STRING,
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    content: DataTypes.TEXT,
    image_content: DataTypes.STRING,
    created_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'News',
  });

  return News;
};
