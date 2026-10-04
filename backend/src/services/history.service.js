const { History } = require('../models');
const { ApiError } = require('../utils/ApiError');

// Batas atas 1000: level & kalender di frontend dihitung dari seluruh riwayat.
const MAX_LIMIT = 1000;

exports.findAll = (limit = 20) =>
  History.findAll({
    order: [['spunAt', 'DESC']],
    limit: Math.min(Number(limit) || 20, MAX_LIMIT),
  });

exports.create = async (payload) => {
  if (!payload.placeName?.trim())
    throw new ApiError(400, 'placeName wajib diisi');

  return History.create({
    placeId: payload.placeId ?? null,
    placeName: payload.placeName.trim(),
    note: payload.note || '',
  });
};

exports.remove = async (id) => {
  const deleted = await History.destroy({ where: { id } });
  if (!deleted) throw new ApiError(404, 'Riwayat tidak ditemukan');
};
