const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {
    static associate({ Place }) {
      Category.hasMany(Place, { foreignKey: 'categoryId', as: 'places' });
    }
  }

  Category.init(
    {
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      icon: { type: DataTypes.STRING, allowNull: false, defaultValue: 'location-dot' },
      color: { type: DataTypes.STRING, allowNull: false, defaultValue: '#6366f1' },
      sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { sequelize, modelName: 'Category', tableName: 'categories' }
  );

  return Category;
};
