const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Place extends Model {
    static associate({ Category, History }) {
      Place.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
      Place.hasMany(History, { foreignKey: 'placeId', as: 'history' });
    }
  }

  Place.init(
    {
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, defaultValue: '' },
      address: { type: DataTypes.STRING, defaultValue: '' },
      mapUrl: { type: DataTypes.STRING, defaultValue: '' },
      imageUrl: { type: DataTypes.STRING, defaultValue: '' },
      priceLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 0, max: 3 },
      },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { sequelize, modelName: 'Place', tableName: 'places' }
  );

  return Place;
};
