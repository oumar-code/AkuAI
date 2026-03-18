'use strict';

const router = require('express').Router();

router.use('/health', require('./health'));
router.use('/api/models', require('./models'));
router.use('/api/inference', require('./inference'));
router.use('/api/text', require('./text'));

module.exports = router;
