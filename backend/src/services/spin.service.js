const { Op } = require('sequelize');
const placeService = require('./place.service');
const { History } = require('../models');
const { ApiError } = require('../utils/ApiError');

const DAY = 24 * 60 * 60 * 1000;

// Budget -> priceLevel: hemat 0-1, sedang 2, royal 3. Kosong = semua.
const BUDGET = { hemat: [0, 1], sedang: [2], royal: [3] };

// Bobot anti-bosan dari kunjungan terakhir (hari): baru saja = jarang keluar lagi.
function weightOf(lastVisitDays, isPlanned) {
  if (isPlanned) return 0.1; // sudah ada di rencana, nggak perlu diacak lagi
  if (lastVisitDays == null) return 1.2; // belum pernah: sedikit diunggulkan
  if (lastVisitDays < 7) return 0.05;
  if (lastVisitDays < 30) return 0.2;
  if (lastVisitDays < 90) return 0.6;
  return 1;
}

function pickWeighted(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// Ambil kandidat untuk kategori + budget terpilih, lalu pilih pemenang dengan bobot anti-bosan.
// fresh = true -> hanya tempat yang belum pernah dikunjungi.
exports.spin = async (slugs = [], { budget = '', fresh = false } = {}) => {
  let pool = await placeService.findAll(slugs);

  if (budget) {
    const levels = BUDGET[budget];
    if (!levels) throw new ApiError(400, 'budget harus hemat/sedang/royal');
    pool = pool.filter((p) => levels.includes(p.priceLevel));
  }
  if (!pool.length) throw new ApiError(404, 'Belum ada tempat untuk pilihan ini');

  // Kunjungan terakhir per tempat (yang sudah pergi) + tempat yang sedang direncanakan.
  const rows = await History.findAll({
    where: { placeId: { [Op.in]: pool.map((p) => p.id) } },
    attributes: ['placeId', 'status', 'spunAt'],
  });
  const last = new Map(); // placeId -> ms kunjungan terakhir
  const planned = new Set();
  for (const h of rows) {
    if (h.status === 'planned') planned.add(h.placeId);
    else last.set(h.placeId, Math.max(last.get(h.placeId) || 0, new Date(h.spunAt).getTime()));
  }

  if (fresh) {
    pool = pool.filter((p) => !last.has(p.id));
    if (!pool.length)
      throw new ApiError(404, 'Semua tempat di pilihan ini udah pernah dikunjungi. Matikan "belum pernah" atau tambah tempat baru');
  }

  const now = Date.now();
  const info = pool.map((p) => {
    const ms = last.get(p.id);
    const days = ms ? Math.floor((now - ms) / DAY) : null;
    return { lastVisitDays: days, isPlanned: planned.has(p.id) };
  });
  const weights = info.map((i) => weightOf(i.lastVisitDays, i.isPlanned));
  const idx = pool.indexOf(pickWeighted(pool, weights));

  return {
    pool,
    winner: pool[idx],
    meta: { lastVisitDays: info[idx].lastVisitDays, isPlanned: info[idx].isPlanned, budget, fresh },
  };
};
