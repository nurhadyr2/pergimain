const { Category, Place, History } = require('../models');

// Seluruh data dalam satu JSON: buat disimpan sendiri / dipindah ke DB lain.
// Foto hanya disertakan URL-nya (file foto di Supabase Storage / backend/uploads).
exports.exportAll = async () => {
  const [categories, places, history] = await Promise.all([
    Category.findAll({ order: [['sortOrder', 'ASC'], ['id', 'ASC']] }),
    Place.findAll({ order: [['id', 'ASC']] }),
    History.findAll({ order: [['spunAt', 'ASC']] }),
  ]);
  return {
    app: 'mau-kemana-hari-ini',
    version: 1,
    exportedAt: new Date().toISOString(),
    counts: { categories: categories.length, places: places.length, history: history.length },
    categories,
    places,
    history,
  };
};
