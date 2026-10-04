const asyncHandler = require('../utils/asyncHandler');
const backupService = require('../services/backup.service');

exports.download = asyncHandler(async (_req, res) => {
  const data = await backupService.exportAll();
  const stamp = data.exportedAt.slice(0, 10);
  res.setHeader('Content-Disposition', `attachment; filename="mau-kemana-backup-${stamp}.json"`);
  res.json(data);
});
