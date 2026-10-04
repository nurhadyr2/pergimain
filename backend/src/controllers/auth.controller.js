const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

exports.login = asyncHandler(async (req, res) => {
  res.json(authService.login(req.ip, req.body?.pin));
});

// Dipakai frontend saat dibuka: token yang tersimpan masih berlaku?
exports.me = (_req, res) => res.json({ ok: true });
