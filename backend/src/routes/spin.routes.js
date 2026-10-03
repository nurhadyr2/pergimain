const { Router } = require('express');
const controller = require('../controllers/spin.controller');

const router = Router();
router.get('/', controller.spin);

module.exports = router;
