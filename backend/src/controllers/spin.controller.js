const asyncHandler = require('../utils/asyncHandler');
const spinService = require('../services/spin.service');

const parseSlugs = (q) =>
  (q || '').split(',').map((s) => s.trim()).filter(Boolean);

exports.spin = asyncHandler(async (req, res) => {
  const result = await spinService.spin(parseSlugs(req.query.categories));
  res.json(result);
});
