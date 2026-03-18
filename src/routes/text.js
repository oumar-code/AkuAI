'use strict';

const router = require('express').Router();
const { generate, classify, summarize } = require('../controllers/textController');
const {
  validate,
  textGenerateSchema,
  textClassifySchema,
  textSummarizeSchema,
} = require('../middleware/validateRequest');

router.post('/generate', validate(textGenerateSchema), generate);
router.post('/classify', validate(textClassifySchema), classify);
router.post('/summarize', validate(textSummarizeSchema), summarize);

module.exports = router;
