'use strict';

const request = require('supertest');
const createApp = require('../src/app');

const app = createApp();

describe('POST /api/text/generate', () => {
  it('generates text from a prompt', async () => {
    const res = await request(app)
      .post('/api/text/generate')
      .send({ prompt: 'Tell me about AI.' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.result).toHaveProperty('generatedText');
    expect(res.body.result).toHaveProperty('tokensUsed');
  });

  it('returns 400 when prompt is missing', async () => {
    const res = await request(app).post('/api/text/generate').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });
});

describe('POST /api/text/classify', () => {
  it('classifies text', async () => {
    const res = await request(app)
      .post('/api/text/classify')
      .send({ text: 'This is fantastic!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.result).toHaveProperty('label');
    expect(res.body.result).toHaveProperty('scores');
    expect(Array.isArray(res.body.result.scores)).toBe(true);
  });

  it('returns 400 when text is missing', async () => {
    const res = await request(app).post('/api/text/classify').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/text/summarize', () => {
  it('summarizes text', async () => {
    const res = await request(app)
      .post('/api/text/summarize')
      .send({
        text: 'Artificial intelligence is transforming many industries. It enables automation, predictive analytics, and more.',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.result).toHaveProperty('summary');
    expect(res.body.result).toHaveProperty('originalLength');
    expect(res.body.result).toHaveProperty('summaryLength');
  });

  it('respects the maxLength option', async () => {
    const res = await request(app)
      .post('/api/text/summarize')
      .send({
        text: 'A very long text that should be cut short by the maxLength option. More content here.',
        options: { maxLength: 20 },
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.result.summaryLength).toBeLessThanOrEqual(20);
  });

  it('returns 400 when text is missing', async () => {
    const res = await request(app).post('/api/text/summarize').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
