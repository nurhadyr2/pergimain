const { Place, Category } = require('../models');
const { ApiError } = require('../utils/ApiError');

const categoryInclude = {
  model: Category,
  as: 'category',
  attributes: ['slug', 'name', 'icon', 'color'],
};

// Bangun filter include berdasarkan slug kategori (opsional)
function buildWhere(slugs) {
  const include = { ...categoryInclude };
  if (slugs?.length) {
    include.where = { slug: slugs };
    include.required = true;
  }
  return include;
}

exports.findAll = (slugs = []) =>
  Place.findAll({
    where: { isActive: true },
    include: [buildWhere(slugs)],
    order: [['createdAt', 'DESC']],
  });

exports.create = async (payload) => {
  if (!payload.categoryId || !payload.name?.trim())
    throw new ApiError(400, 'categoryId dan name wajib diisi');

  const place = await Place.create({
    categoryId: payload.categoryId,
    name: payload.name.trim(),
    description: payload.description || '',
    address: payload.address || '',
    mapUrl: payload.mapUrl || '',
    imageUrl: payload.imageUrl || '',
    priceLevel: payload.priceLevel ?? 1,
  });
  return place.reload({ include: [categoryInclude] });
};

exports.update = async (id, payload) => {
  const place = await Place.findByPk(id);
  if (!place) throw new ApiError(404, 'Tempat tidak ditemukan');

  const fields = ['categoryId', 'name', 'description', 'address', 'mapUrl', 'imageUrl', 'priceLevel', 'isActive'];
  const patch = {};
  for (const f of fields) if (f in payload) patch[f] = payload[f];

  await place.update(patch);
  return place.reload({ include: [categoryInclude] });
};

exports.remove = async (id) => {
  const deleted = await Place.destroy({ where: { id } });
  if (!deleted) throw new ApiError(404, 'Tempat tidak ditemukan');
};
