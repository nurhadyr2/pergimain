const { ApiError } = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
  const status = err instanceof ApiError ? err.statusCode : err.status || 500;

  if (status >= 500) console.error(err);

  // Multer: file kebesaran / bukan gambar -> 400
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'Foto maksimal 8MB' : err.message });
  }

  // Error validasi / unik dari Sequelize -> 400
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: err.errors?.map((e) => e.message).join(', ') || err.message });
  }

  res.status(status).json({ error: err.message || 'Terjadi kesalahan pada server' });
};
