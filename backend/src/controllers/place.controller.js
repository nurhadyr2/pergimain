const asyncHandler = require('../utils/asyncHandler');
const placeService = require('../services/place.service');

const parseSlugs = (q) =>
  (q || '').split(',').map((s) => s.trim()).filter(Boolean);

exports.list = asyncHandler(async (req, res) => {
  const places = await placeService.findAll(parseSlugs(req.query.categories));
  res.json(places);
});

exports.create = asyncHandler(async (req, res) => {
  const place = await placeService.create(req.body);
  res.status(201).json(place);
});

exports.update = asyncHandler(async (req, res) => {
  const place = await placeService.update(req.params.id, req.body);
  res.json(place);
});

exports.remove = asyncHandler(async (req, res) => {
  await placeService.remove(req.params.id);
  res.json({ ok: true });
});
