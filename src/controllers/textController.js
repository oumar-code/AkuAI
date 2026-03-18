'use strict';

const { generateText, classifyText, summarizeText } = require('../services/inferenceService');

function generate(req, res, next) {
  try {
    const { prompt, options } = req.body;
    const result = generateText(prompt, options);
    res.json({ status: 'ok', result });
  } catch (err) {
    next(err);
  }
}

function classify(req, res, next) {
  try {
    const { text } = req.body;
    const result = classifyText(text);
    res.json({ status: 'ok', result });
  } catch (err) {
    next(err);
  }
}

function summarize(req, res, next) {
  try {
    const { text, options } = req.body;
    const result = summarizeText(text, options);
    res.json({ status: 'ok', result });
  } catch (err) {
    next(err);
  }
}

module.exports = { generate, classify, summarize };
