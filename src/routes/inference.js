'use strict';

const router = require('express').Router();
const { inference } = require('../controllers/inferenceController');
const { validate, inferenceSchema } = require('../middleware/validateRequest');

router.post('/', validate(inferenceSchema), inference);

module.exports = router;
