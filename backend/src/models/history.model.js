const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class History extends Model {
    static associate({ Place }) {
      History.belongsTo(Place, { foreignKey: 'placeId', as: 'place' });
    }
  }

  History.init(
    {
      placeId: { type: DataTypes.INTEGER, allowNull: true },
      placeName: { type: DataTypes.STRING, allowNull: false },
      note: { type: DataTypes.TEXT, defaultValue: '' },
      spunAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { sequelize, modelName: 'History', tableName: 'history', updatedAt: false, createdAt: false }
  );

  return History;
};
