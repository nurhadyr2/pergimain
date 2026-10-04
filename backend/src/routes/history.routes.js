const { Router } = require('express');
const multer = require('multer');
const controller = require('../controllers/history.controller');
const { ApiError } = require('../utils/ApiError');

// Foto jurnal: di memori dulu, maks 8MB, hanya gambar (frontend sudah mengecilkan ke ~1280px).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new ApiError(400, 'File harus gambar')),
});

const router = Router();
router.get('/', controller.list);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.post('/:id/photo', upload.single('photo'), controller.uploadPhoto);
router.delete('/:id/photo', controller.removePhoto);
router.delete('/:id', controller.remove);

module.exports = router;
