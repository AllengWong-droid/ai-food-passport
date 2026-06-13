/**
 * Contract tests for GET /health endpoint.
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { startServer, stopServer, get } = require('../testHelper');

before(async () => {
  await startServer();
});

after(async () => {
  await stopServer();
});

describe('GET /health', () => {
  test('should return status 200', async () => {
    const res = await get('/health');
    assert.strictEqual(res.status, 200);
  });

  test('should return ok: true', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.ok, true);
  });

  test('should have activeOcrProvider: mock_ocr', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeOcrProvider, 'mock_ocr');
  });

  test('should have activeAnalysisProvider: mock_ai', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeAnalysisProvider, 'mock_ai');
  });

  test('should have providerRoutingReady: true', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.providerRoutingReady, true);
  });

  test('should have realProvidersEnabled: false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realProvidersEnabled, false);
  });

  test('should have providerTimeoutMs as a number', async () => {
    const res = await get('/health');
    assert.strictEqual(typeof res.body.providerTimeoutMs, 'number');
    assert.ok(res.body.providerTimeoutMs > 0);
  });

  test('should have providerMaxRetries as a number', async () => {
    const res = await get('/health');
    assert.strictEqual(typeof res.body.providerMaxRetries, 'number');
    assert.ok(res.body.providerMaxRetries >= 0);
  });

  test('should have logRedactionReady: true', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.logRedactionReady, true);
  });

  test('should have safeErrorEnvelopeReady: true', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.safeErrorEnvelopeReady, true);
  });

  test('should have providerSafetyConfigValid as boolean', async () => {
    const res = await get('/health');
    assert.strictEqual(typeof res.body.providerSafetyConfigValid, 'boolean');
  });

  test('should have providerSafetyWarnings as array', async () => {
    const res = await get('/health');
    assert.ok(Array.isArray(res.body.providerSafetyWarnings));
  });

  test('should have timestamp as ISO string', async () => {
    const res = await get('/health');
    assert.ok(typeof res.body.timestamp === 'string');
    assert.ok(!isNaN(Date.parse(res.body.timestamp)));
  });

  test('should not contain sensitive fields in response', async () => {
    const res = await get('/health');
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('apiKey'));
    assert.ok(!bodyStr.includes('secret'));
  });
});
