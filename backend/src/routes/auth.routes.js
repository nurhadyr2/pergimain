const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const requireAuth = require('../middlewares/requireAuth');

const router = Router();
router.post('/login', controller.login);
router.get('/me', requireAuth, controller.me);

module.exports = router;
