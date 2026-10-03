const { Router } = require('express');

const router = Router();

router.use('/categories', require('./category.routes'));
router.use('/places', require('./place.routes'));
router.use('/spin', require('./spin.routes'));
router.use('/history', require('./history.routes'));

module.exports = router;
