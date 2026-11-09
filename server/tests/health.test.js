const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('Health Check API', async (t) => {
  await t.test('GET / returns 200 with welcome message', async () => {
    const res = await request(app).get('/');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.version, '1.0.0');
    assert.strictEqual(res.body.message, 'Welcome to Pokedesk API');
  });

  await t.test('GET /api/health returns 200 and operational status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'healthy');
    assert.ok(res.body.data.database);
  });

  await t.test('GET /api/unknown-route returns 404', async () => {
    const res = await request(app).get('/api/unknown-route');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });
});
