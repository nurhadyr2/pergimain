const authService = require('../services/auth.service');
const { ApiError } = require('../utils/ApiError');

// Semua /api/* wajib bawa "Authorization: Bearer <token>" hasil login PIN.
module.exports = (req, _res, next) => {
  const [scheme, token] = String(req.headers.authorization || '').split(' ');
  if (scheme === 'Bearer' && authService.verify(token)) return next();
  next(new ApiError(401, 'Masukkan PIN dulu'));
};
