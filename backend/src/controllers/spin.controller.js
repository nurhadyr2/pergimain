const asyncHandler = require('../utils/asyncHandler');
const spinService = require('../services/spin.service');

const parseSlugs = (q) =>
  (q || '').split(',').map((s) => s.trim()).filter(Boolean);

const truthy = (v) => v === '1' || v === 'true';

exports.spin = asyncHandler(async (req, res) => {
  const result = await spinService.spin(parseSlugs(req.query.categories), {
    budget: String(req.query.budget || '').toLowerCase(),
    fresh: truthy(req.query.fresh),
  });
  res.json(result);
});
