const sequelize = require('../config/database');

// Daftarkan model (factory pattern)
const Category = require('./category.model')(sequelize);
const Place = require('./place.model')(sequelize);
const History = require('./history.model')(sequelize);

const db = { sequelize, Category, Place, History };

// Jalankan associate() tiap model
Object.values(db).forEach((model) => {
  if (model && typeof model.associate === 'function') model.associate(db);
});

module.exports = db;
