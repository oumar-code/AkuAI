'use strict';

const request = require('supertest');
const createApp = require('../src/app');

const app = createApp();

describe('GET /api/models', () => {
  it('returns the model list', async () => {
    const res = await request(app).get('/api/models');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.models)).toBe(true);
    expect(res.body.count).toBe(res.body.models.length);
    res.body.models.forEach((m) => {
      expect(m).toHaveProperty('id');
      expect(m).toHaveProperty('name');
      expect(m).toHaveProperty('type');
    });
  });
});
