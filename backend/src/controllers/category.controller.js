const asyncHandler = require('../utils/asyncHandler');
const categoryService = require('../services/category.service');

exports.list = asyncHandler(async (_req, res) => {
  const categories = await categoryService.findAll();
  res.json(categories);
});
