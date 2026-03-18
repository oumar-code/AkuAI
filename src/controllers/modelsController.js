'use strict';

const { MODELS } = require('../services/inferenceService');

function listModels(_req, res) {
  res.json({
    status: 'ok',
    count: MODELS.length,
    models: MODELS,
  });
}

module.exports = { listModels };
