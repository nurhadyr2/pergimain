const { Router } = require('express');
const requireAuth = require('../middlewares/requireAuth');

const router = Router();

// Login PIN bebas diakses; sisanya wajib token.
router.use('/auth', require('./auth.routes'));
router.use(requireAuth);

router.use('/categories', require('./category.routes'));
router.use('/places', require('./place.routes'));
router.use('/spin', require('./spin.routes'));
router.use('/history', require('./history.routes'));
router.use('/backup', require('./backup.routes'));

module.exports = router;
