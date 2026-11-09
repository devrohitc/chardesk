const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('API Protected Endpoints & Authorization', async (t) => {
  await t.test('GET /api/quests without token returns 401', async () => {
    const res = await request(app).get('/api/quests');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.match(res.body.message, /token/i);
  });

  await t.test('POST /api/quests without token returns 401', async () => {
    const res = await request(app).post('/api/quests').send({ title: 'Test Quest' });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('GET /api/logs/2026-11-09 without token returns 401', async () => {
    const res = await request(app).get('/api/logs/2026-11-09');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('GET /api/finance without token returns 401', async () => {
    const res = await request(app).get('/api/finance');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('GET /api/trainer/progress without token returns 401', async () => {
    const res = await request(app).get('/api/trainer/progress');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('GET /api/auth/users is publicly accessible and returns 200', async () => {
    const res = await request(app).get('/api/auth/users');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  await t.test('Malformed auth token returns 401', async () => {
    const res = await request(app)
      .get('/api/quests')
      .set('Authorization', 'Bearer invalid.token.payload');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });
});

