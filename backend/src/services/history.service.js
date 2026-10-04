const { History } = require('../models');
const { ApiError } = require('../utils/ApiError');
const storage = require('./storage.service');

// Batas atas 1000: level & kalender di frontend dihitung dari seluruh riwayat.
const MAX_LIMIT = 1000;

exports.findAll = (limit = 20) =>
  History.findAll({
    order: [['spunAt', 'DESC']],
    limit: Math.min(Number(limit) || 20, MAX_LIMIT),
  });

const parseDate = (v, label) => {
  if (v == null || v === '') return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new ApiError(400, `${label} tidak valid`);
  return d;
};

// Tanpa plannedAt = sudah pergi sekarang; dengan plannedAt = rencana.
exports.create = async (payload) => {
  if (!payload.placeName?.trim())
    throw new ApiError(400, 'placeName wajib diisi');

  const plannedAt = parseDate(payload.plannedAt, 'plannedAt');
  return History.create({
    placeId: payload.placeId ?? null,
    placeName: payload.placeName.trim(),
    note: payload.note || '',
    status: plannedAt ? 'planned' : 'done',
    plannedAt,
  });
};

const findOr404 = async (id) => {
  const item = await History.findByPk(id);
  if (!item) throw new ApiError(404, 'Riwayat tidak ditemukan');
  return item;
};

// Ubah rencana / isi jurnal: { status, plannedAt, note, rating }
exports.update = async (id, payload) => {
  const item = await findOr404(id);
  const patch = {};

  if ('plannedAt' in payload) patch.plannedAt = parseDate(payload.plannedAt, 'plannedAt');
  if ('note' in payload) patch.note = String(payload.note || '').slice(0, 2000);
  if ('rating' in payload) {
    const r = payload.rating == null ? null : Number(payload.rating);
    if (r != null && (!Number.isInteger(r) || r < 1 || r > 5)) throw new ApiError(400, 'rating harus 1-5');
    patch.rating = r;
  }

  if ('status' in payload) {
    if (!['done', 'planned'].includes(payload.status)) throw new ApiError(400, 'status harus done/planned');
    patch.status = payload.status;
    // Rencana ditandai "udah pergi": tanggal pergi = tanggal rencananya kalau sudah lewat/hari ini, kalau tidak = sekarang.
    if (payload.status === 'done' && item.status === 'planned') {
      const planned = patch.plannedAt ?? item.plannedAt;
      patch.spunAt = planned && planned <= new Date() ? planned : new Date();
    }
  }

  await item.update(patch);
  return item;
};

exports.setPhoto = async (id, file) => {
  const item = await findOr404(id);
  if (!file) throw new ApiError(400, 'Foto tidak ada');
  const url = await storage.savePhoto(file.buffer, file.mimetype, `h${id}`);
  await storage.deletePhoto(item.photoUrl);
  await item.update({ photoUrl: url });
  return item;
};

exports.removePhoto = async (id) => {
  const item = await findOr404(id);
  await storage.deletePhoto(item.photoUrl);
  await item.update({ photoUrl: '' });
  return item;
};

exports.remove = async (id) => {
  const item = await findOr404(id);
  await storage.deletePhoto(item.photoUrl);
  await item.destroy();
};
