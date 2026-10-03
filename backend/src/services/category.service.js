const { Category } = require('../models');

exports.findAll = () =>
  Category.findAll({ order: [['sortOrder', 'ASC']] });
