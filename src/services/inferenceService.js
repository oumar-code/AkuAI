'use strict';

/**
 * Returns the list of models available for inference.
 * In a production deployment these would be dynamically loaded from
 * a model registry or an external provider.
 */
const MODELS = [
  {
    id: 'text-gen-v1',
    name: 'Text Generation v1',
    type: 'text-generation',
    description: 'General-purpose text generation model.',
    maxTokens: 512,
  },
  {
    id: 'text-classify-v1',
    name: 'Text Classification v1',
    type: 'text-classification',
    description: 'Multi-label text classification model.',
    labels: ['positive', 'negative', 'neutral'],
  },
  {
    id: 'summarizer-v1',
    name: 'Summarizer v1',
    type: 'summarization',
    description: 'Abstractive text summarization model.',
    maxInputTokens: 2048,
  },
];

/**
 * Simulate text generation.
 * @param {string} prompt
 * @param {object} options
 * @returns {{generatedText: string, model: string, tokensUsed: number}}
 */
function generateText(prompt, options = {}) {
  const maxTokens = Math.min(options.maxTokens || 100, 512);
  const echo = prompt.length > 200 ? prompt.slice(0, 200) : prompt;
  const generatedText = `[Generated based on: "${echo}"] — Aku AI response (${maxTokens} max tokens).`;

  return {
    model: 'text-gen-v1',
    generatedText,
    tokensUsed: Math.floor(generatedText.split(' ').length * 1.3),
  };
}

/**
 * Simulate text classification.
 * @param {string} text
 * @returns {{label: string, confidence: number, model: string}}
 */
function classifyText(text) {
  const labels = ['positive', 'negative', 'neutral'];
  const scores = labels.map((label) => ({
    label,
    score: parseFloat(Math.random().toFixed(4)),
  }));
  const total = scores.reduce((s, e) => s + e.score, 0);
  scores.forEach((e) => (e.score = parseFloat((e.score / total).toFixed(4))));
  scores.sort((a, b) => b.score - a.score);

  return {
    model: 'text-classify-v1',
    input: text.slice(0, 100),
    label: scores[0].label,
    confidence: scores[0].score,
    scores,
  };
}

/**
 * Simulate text summarization.
 * @param {string} text
 * @param {object} options
 * @returns {{summary: string, model: string}}
 */
function summarizeText(text, options = {}) {
  const maxLength = options.maxLength || 120;
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const summary =
    sentences.length > 0
      ? sentences[0].trim().slice(0, maxLength)
      : text.slice(0, maxLength);

  return {
    model: 'summarizer-v1',
    summary,
    originalLength: text.length,
    summaryLength: summary.length,
  };
}

/**
 * Generic inference dispatcher.
 * @param {string} modelId
 * @param {object} input
 * @returns {object}
 */
function runInference(modelId, input) {
  const model = MODELS.find((m) => m.id === modelId);
  if (!model) {
    const err = new Error(`Model '${modelId}' not found.`);
    err.statusCode = 404;
    throw err;
  }

  switch (model.type) {
    case 'text-generation':
      return generateText(input.prompt || '', input.options);
    case 'text-classification':
      return classifyText(input.text || '');
    case 'summarization':
      return summarizeText(input.text || '', input.options);
    default: {
      const err = new Error(`Unsupported model type '${model.type}'.`);
      err.statusCode = 400;
      throw err;
    }
  }
}

module.exports = { MODELS, runInference, generateText, classifyText, summarizeText };
