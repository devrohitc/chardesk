const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Auth API Validation', async (t) => {
  await t.test('POST /api/auth/register fails with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
  });

  await t.test('POST /api/auth/register fails with short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'validuser',
        password: '123',
      });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('POST /api/auth/login fails with empty credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('GET /api/auth/me fails without token', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });
});

