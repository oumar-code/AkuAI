'use strict';

const { runInference } = require('../services/inferenceService');

function inference(req, res, next) {
  try {
    const { modelId, input } = req.body;
    const result = runInference(modelId, input);
    res.json({ status: 'ok', result });
  } catch (err) {
    next(err);
  }
}

module.exports = { inference };
