'use strict';

const Joi = require('joi');

const inferenceSchema = Joi.object({
  modelId: Joi.string().trim().min(1).required(),
  input: Joi.object().required(),
});

const textGenerateSchema = Joi.object({
  prompt: Joi.string().trim().min(1).max(4096).required(),
  options: Joi.object({
    maxTokens: Joi.number().integer().min(1).max(512).default(100),
  }).default({}),
});

const textClassifySchema = Joi.object({
  text: Joi.string().trim().min(1).max(4096).required(),
});

const textSummarizeSchema = Joi.object({
  text: Joi.string().trim().min(1).max(10000).required(),
  options: Joi.object({
    maxLength: Joi.number().integer().min(10).max(500).default(120),
  }).default({}),
});

/**
 * Factory: returns an Express middleware that validates req.body against schema.
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed.',
        details: error.details.map((d) => d.message),
      });
    }
    req.body = value;
    return next();
  };
}

module.exports = {
  validate,
  inferenceSchema,
  textGenerateSchema,
  textClassifySchema,
  textSummarizeSchema,
};
