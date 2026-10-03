// Instance Sequelize yang dipakai aplikasi (runtime).
require('dotenv').config();
const { Sequelize } = require('sequelize');

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  console.error('\n[FATAL] DATABASE_URL belum di-set di .env\n');
  process.exit(1);
}

const useSSL = String(process.env.DB_SSL).toLowerCase() !== 'false';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? (msg) => console.log(`[sql] ${msg}`) : false,
  dialectOptions: useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  define: {
    underscored: true, // kolom snake_case otomatis
    freezeTableName: false,
  },
});

module.exports = sequelize;
