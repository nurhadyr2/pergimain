const asyncHandler = require('../utils/asyncHandler');
const historyService = require('../services/history.service');

exports.list = asyncHandler(async (req, res) => {
  const items = await historyService.findAll(req.query.limit);
  res.json(items);
});

exports.create = asyncHandler(async (req, res) => {
  const item = await historyService.create(req.body);
  res.status(201).json(item);
});

exports.update = asyncHandler(async (req, res) => {
  const item = await historyService.update(req.params.id, req.body || {});
  res.json(item);
});

exports.uploadPhoto = asyncHandler(async (req, res) => {
  const item = await historyService.setPhoto(req.params.id, req.file);
  res.json(item);
});

exports.removePhoto = asyncHandler(async (req, res) => {
  const item = await historyService.removePhoto(req.params.id);
  res.json(item);
});

exports.remove = asyncHandler(async (req, res) => {
  await historyService.remove(req.params.id);
  res.json({ ok: true });
});
