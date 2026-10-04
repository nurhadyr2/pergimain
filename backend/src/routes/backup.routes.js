const { Router } = require('express');
const controller = require('../controllers/backup.controller');

const router = Router();
router.get('/', controller.download);

module.exports = router;
