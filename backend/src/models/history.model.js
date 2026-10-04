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
      // 'done' = sudah pergi (dihitung ke level); 'planned' = rencana (📌 di kalender)
      status: { type: DataTypes.STRING(16), allowNull: false, defaultValue: 'done' },
      plannedAt: { type: DataTypes.DATE, allowNull: true },
      spunAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      // Jurnal setelah pergi
      note: { type: DataTypes.TEXT, defaultValue: '' },
      rating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
      photoUrl: { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
    },
    { sequelize, modelName: 'History', tableName: 'history', updatedAt: false, createdAt: false }
  );

  return History;
};
