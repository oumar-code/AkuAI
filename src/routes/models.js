'use strict';

const router = require('express').Router();
const { listModels } = require('../controllers/modelsController');

router.get('/', listModels);

module.exports = router;
