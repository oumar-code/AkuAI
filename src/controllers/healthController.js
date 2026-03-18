'use strict';

function health(_req, res) {
  res.json({
    status: 'ok',
    service: 'aku-ai',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { health };
