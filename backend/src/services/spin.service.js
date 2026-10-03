const placeService = require('./place.service');
const { ApiError } = require('../utils/ApiError');

// Ambil semua kandidat untuk kategori terpilih + tentukan 1 pemenang acak.
exports.spin = async (slugs = []) => {
  const pool = await placeService.findAll(slugs);
  if (!pool.length)
    throw new ApiError(404, 'Belum ada tempat untuk kategori ini');

  const winner = pool[Math.floor(Math.random() * pool.length)];
  return { pool, winner };
};
