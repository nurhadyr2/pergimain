// Konfigurasi khusus untuk sequelize-cli (migrasi & seeder).
// Aplikasi runtime memakai src/config/database.js.
require('dotenv').config();

const useSSL = String(process.env.DB_SSL).toLowerCase() !== 'false';

const common = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: useSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
