'use strict';

const request = require('supertest');
const createApp = require('../src/app');

const app = createApp();

describe('POST /api/inference', () => {
  it('runs text-generation inference successfully', async () => {
    const res = await request(app)
      .post('/api/inference')
      .send({ modelId: 'text-gen-v1', input: { prompt: 'Hello world' } });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.result).toHaveProperty('generatedText');
    expect(res.body.result.model).toBe('text-gen-v1');
  });

  it('runs text-classification inference successfully', async () => {
    const res = await request(app)
      .post('/api/inference')
      .send({ modelId: 'text-classify-v1', input: { text: 'Great product!' } });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toHaveProperty('label');
    expect(res.body.result).toHaveProperty('confidence');
  });

  it('runs summarization inference successfully', async () => {
    const res = await request(app)
      .post('/api/inference')
      .send({
        modelId: 'summarizer-v1',
        input: {
          text: 'Aku AI is a scalable microservice. It provides AI-powered features. Users can call inference endpoints.',
        },
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toHaveProperty('summary');
  });

  it('returns 404 for unknown model', async () => {
    const res = await request(app)
      .post('/api/inference')
      .send({ modelId: 'unknown-model', input: { text: 'test' } });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  it('returns 400 when modelId is missing', async () => {
    const res = await request(app)
      .post('/api/inference')
      .send({ input: { text: 'test' } });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('returns 400 when input is missing', async () => {
    const res = await request(app)
      .post('/api/inference')
      .send({ modelId: 'text-gen-v1' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });
});
