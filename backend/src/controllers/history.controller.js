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

exports.remove = asyncHandler(async (req, res) => {
  await historyService.remove(req.params.id);
  res.json({ ok: true });
});
