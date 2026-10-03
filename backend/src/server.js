require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi database OK');

    app.listen(PORT, () => {
      console.log(`🎰 Mau Kemana API jalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Gagal konek database:', err.message);
    process.exit(1);
  }
}

start();
