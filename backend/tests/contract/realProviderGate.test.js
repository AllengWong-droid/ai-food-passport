/**
 * Phase 12H: Real Provider Gated End-to-End Dry Run Tests
 *
 * These tests verify that real providers (qwen_ocr, qwen_analysis) remain
 * safely locked behind explicit backend-only env gates, and that selecting
 * them without valid secrets produces controlled safe errors without stack
 * traces, API keys, raw responses, or other sensitive leakage.
 *
 * Every scenario runs against a live server instance (spawned child process),
 * so the tests exercise the real request-response path end-to-end through
 * server.js → provider registry → provider adapter → error handler.
 *
 * No real API keys are used. No real network calls to Qwen/DashScope occur.
 * All errors are DRY-RUN: they verify that the SAFETY GATES WORK.
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { startServer, stopServer, get, post } = require('../testHelper');

// ────────────────────────────────────────────────────────────────────────────
// Default pipeline — unchanged behavior
// ────────────────────────────────────────────────────────────────────────────

describe('Default pipeline (no real providers configured)', () => {
  before(async () => {
    await startServer();
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → activeOcrProvider is mock_ocr', async () => {
    const res = await get('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.activeOcrProvider, 'mock_ocr');
  });

  test('GET /health → activeAnalysisProvider is mock_ai', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeAnalysisProvider, 'mock_ai');
  });

  test('GET /health → realOcrEnabled is false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realOcrEnabled, false);
  });

  test('GET /health → realAnalysisEnabled is false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realAnalysisEnabled, false);
  });

  test('GET /health → realProvidersEnabled is false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realProvidersEnabled, false);
  });

  test('GET /health → productionReady is false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.productionReady, false);
  });

  test('GET /health → qwen_ocr appears in availableOcrProviders', async () => {
    const res = await get('/health');
    assert.ok(Array.isArray(res.body.availableOcrProviders));
    assert.ok(res.body.availableOcrProviders.includes('qwen_ocr'));
  });

  test('GET /health → qwen_analysis appears in availableAnalysisProviders', async () => {
    const res = await get('/health');
    assert.ok(Array.isArray(res.body.availableAnalysisProviders));
    assert.ok(res.body.availableAnalysisProviders.includes('qwen_analysis'));
  });

  test('POST /api/analyze-menu {} → ok: true with mock dishes', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.ok, true);
    assert.ok(Array.isArray(res.body.data.dishes));
    assert.ok(res.body.data.dishes.length > 0);
  });

  test('POST /api/analyze-menu { providerMode: mock } → ok: true', async () => {
    const res = await post('/api/analyze-menu', { providerMode: 'mock' });
    assert.strictEqual(res.body.ok, true);
    assert.strictEqual(res.body.data.routing.resolvedProviderMode, 'mock');
  });

  test('POST /api/analyze-menu { providerMode: china } → safely resolves', async () => {
    const res = await post('/api/analyze-menu', { providerMode: 'china' });
    assert.strictEqual(res.body.ok, true);
  });

  test('POST /api/analyze-menu { providerMode: global } → safely resolves', async () => {
    const res = await post('/api/analyze-menu', { providerMode: 'global' });
    assert.strictEqual(res.body.ok, true);
  });

  test('POST /api/analyze-menu { providerMode: auto } → safely resolves', async () => {
    const res = await post('/api/analyze-menu', { providerMode: 'auto' });
    assert.strictEqual(res.body.ok, true);
  });

  test('no secrets leak in default /health response', async () => {
    const res = await get('/health');
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('apiKey'));
    assert.ok(!bodyStr.includes('secret'));
    assert.ok(!bodyStr.includes('Authorization'));
    assert.ok(!bodyStr.includes('Bearer'));
  });

  test('no secrets leak in default /api/analyze-menu response', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('apiKey'));
    assert.ok(!bodyStr.includes('secret'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// OCR gate: qwen_ocr with MISSING QWEN_API_KEY
// ────────────────────────────────────────────────────────────────────────────

describe('OCR gate — OCR_PROVIDER=qwen_ocr without QWEN_API_KEY', () => {
  before(async () => {
    await startServer({ OCR_PROVIDER: 'qwen_ocr' });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → activeOcrProvider is qwen_ocr', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeOcrProvider, 'qwen_ocr');
  });

  test('GET /health → realOcrEnabled remains false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realOcrEnabled, false);
  });

  test('GET /health → activeAnalysisProvider still mock_ai', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeAnalysisProvider, 'mock_ai');
  });

  test('POST /api/analyze-menu {} → ok: false with OCR_PROVIDER_NOT_CONFIGURED', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');
  });

  test('POST /api/analyze-menu → error has no stack trace', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
    assert.ok(!bodyStr.includes('at async'));
  });

  test('POST /api/analyze-menu → error has no API key leak', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('apiKey'));
    assert.ok(!bodyStr.includes('QWEN_API_KEY'));
  });

  test('POST /api/analyze-menu → error has no raw provider response', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('providerRawResponse'));
    assert.ok(!bodyStr.includes('rawResponse'));
  });

  test('POST /api/analyze-menu → error has no Authorization header', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('Authorization'));
    assert.ok(!bodyStr.includes('Bearer'));
  });

  test('POST /api/analyze-menu → error has no base64/image payload', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('base64'));
    assert.ok(!bodyStr.includes('image_url'));
    assert.ok(!bodyStr.includes('data:image'));
  });

  test('GET /health → no secrets leak', async () => {
    const res = await get('/health');
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('apiKey'));
    assert.ok(!bodyStr.includes('Authorization'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// OCR gate: qwen_ocr with ENABLED=true but MISSING key
// ────────────────────────────────────────────────────────────────────────────

describe('OCR gate — QWEN_OCR_PROVIDER_ENABLED=true without QWEN_API_KEY', () => {
  before(async () => {
    await startServer({
      OCR_PROVIDER: 'qwen_ocr',
      QWEN_OCR_PROVIDER_ENABLED: 'true'
    });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → realOcrEnabled still false (no key)', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realOcrEnabled, false);
  });

  test('POST /api/analyze-menu {} → OCR_PROVIDER_NOT_CONFIGURED', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');
  });

  test('no secrets leak in error', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('at Object.'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// OCR gate: qwen_ocr with PLACEHOLDER key
// ────────────────────────────────────────────────────────────────────────────

describe('OCR gate — placeholder QWEN_API_KEY (sk-placeholder)', () => {
  before(async () => {
    await startServer({
      OCR_PROVIDER: 'qwen_ocr',
      QWEN_OCR_PROVIDER_ENABLED: 'true',
      QWEN_API_KEY: 'sk-placeholder'
    });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → realOcrEnabled remains false (placeholder key)', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realOcrEnabled, false);
  });

  test('POST /api/analyze-menu {} → OCR_PROVIDER_NOT_CONFIGURED', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');
  });

  test('placeholder key does NOT leak in error response', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    // The placeholder key value must not appear anywhere.
    assert.ok(!bodyStr.includes('sk-placeholder'));
    assert.ok(!bodyStr.includes('QWEN_API_KEY'));
  });

  test('no stack trace in error', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Analysis gate: qwen_analysis with MISSING QWEN_API_KEY
// ────────────────────────────────────────────────────────────────────────────

describe('Analysis gate — ANALYSIS_PROVIDER=qwen_analysis without QWEN_API_KEY', () => {
  before(async () => {
    await startServer({ ANALYSIS_PROVIDER: 'qwen_analysis' });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → activeAnalysisProvider is qwen_analysis', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeAnalysisProvider, 'qwen_analysis');
  });

  test('GET /health → realAnalysisEnabled remains false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realAnalysisEnabled, false);
  });

  test('GET /health → activeOcrProvider still mock_ocr', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeOcrProvider, 'mock_ocr');
  });

  test('POST /api/analyze-menu {} → OCR succeeds (mock), then ANALYSIS_PROVIDER_NOT_CONFIGURED', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
  });

  test('POST /api/analyze-menu → error has no stack trace', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
    assert.ok(!bodyStr.includes('at async'));
  });

  test('POST /api/analyze-menu → error has no API key leak', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('QWEN_API_KEY'));
  });

  test('POST /api/analyze-menu → error has no raw provider response', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('providerRawResponse'));
    assert.ok(!bodyStr.includes('choices'));
  });

  test('POST /api/analyze-menu → error has no Authorization header', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('Authorization'));
    assert.ok(!bodyStr.includes('Bearer'));
  });

  test('POST /api/analyze-menu → error has no raw prompt/OCR text', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('rawPrompt'));
    assert.ok(!bodyStr.includes('rawOcrText'));
  });

  test('GET /health → no secrets leak', async () => {
    const res = await get('/health');
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('apiKey'));
    assert.ok(!bodyStr.includes('Authorization'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Analysis gate: qwen_analysis with ENABLED=true but MISSING key
// ────────────────────────────────────────────────────────────────────────────

describe('Analysis gate — QWEN_ANALYSIS_PROVIDER_ENABLED=true without QWEN_API_KEY', () => {
  before(async () => {
    await startServer({
      ANALYSIS_PROVIDER: 'qwen_analysis',
      QWEN_ANALYSIS_PROVIDER_ENABLED: 'true'
    });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → realAnalysisEnabled still false (no key)', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realAnalysisEnabled, false);
  });

  test('POST /api/analyze-menu {} → ANALYSIS_PROVIDER_NOT_CONFIGURED', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
  });

  test('no secrets leak in error', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('at Object.'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Analysis gate: qwen_analysis with PLACEHOLDER key
// ────────────────────────────────────────────────────────────────────────────

describe('Analysis gate — placeholder QWEN_API_KEY (sk-placeholder)', () => {
  before(async () => {
    await startServer({
      ANALYSIS_PROVIDER: 'qwen_analysis',
      QWEN_ANALYSIS_PROVIDER_ENABLED: 'true',
      QWEN_API_KEY: 'sk-placeholder'
    });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → realAnalysisEnabled remains false (placeholder key)', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realAnalysisEnabled, false);
  });

  test('POST /api/analyze-menu {} → ANALYSIS_PROVIDER_NOT_CONFIGURED', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
  });

  test('placeholder key does NOT leak in error response', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-placeholder'));
    assert.ok(!bodyStr.includes('QWEN_API_KEY'));
  });

  test('no stack trace in error', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Combined gates: both OCR + Analysis with placeholder key
// ────────────────────────────────────────────────────────────────────────────

describe('Combined gates — both qwen_ocr + qwen_analysis with placeholder key', () => {
  before(async () => {
    await startServer({
      OCR_PROVIDER: 'qwen_ocr',
      QWEN_OCR_PROVIDER_ENABLED: 'true',
      ANALYSIS_PROVIDER: 'qwen_analysis',
      QWEN_ANALYSIS_PROVIDER_ENABLED: 'true',
      QWEN_API_KEY: 'sk-placeholder'
    });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → activeOcrProvider is qwen_ocr', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeOcrProvider, 'qwen_ocr');
  });

  test('GET /health → activeAnalysisProvider is qwen_analysis', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeAnalysisProvider, 'qwen_analysis');
  });

  test('GET /health → realOcrEnabled is false (placeholder key)', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realOcrEnabled, false);
  });

  test('GET /health → realAnalysisEnabled is false (placeholder key)', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realAnalysisEnabled, false);
  });

  test('GET /health → realProvidersEnabled is false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.realProvidersEnabled, false);
  });

  test('GET /health → productionReady is false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.productionReady, false);
  });

  test('POST /api/analyze-menu {} → OCR_PROVIDER_NOT_CONFIGURED (OCR fails first)', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');
  });

  test('placeholder key does NOT leak in error response', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-placeholder'));
    assert.ok(!bodyStr.includes('QWEN_API_KEY'));
  });

  test('no stack trace in error', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
    assert.ok(!bodyStr.includes('at async'));
  });

  test('no raw provider response in error', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('providerRawResponse'));
    assert.ok(!bodyStr.includes('rawPrompt'));
    assert.ok(!bodyStr.includes('base64'));
  });

  test('GET /health → no secrets leak', async () => {
    const res = await get('/health');
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('sk-placeholder'));
    assert.ok(!bodyStr.includes('sk-'));
    assert.ok(!bodyStr.includes('apiKey'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Safety: invalid OCR_PROVIDER → controlled error
// ────────────────────────────────────────────────────────────────────────────

describe('Invalid OCR_PROVIDER', () => {
  before(async () => {
    await startServer({ OCR_PROVIDER: 'unknown_provider' });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → configValid is false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.configValid, false);
    assert.strictEqual(res.body.activeOcrProvider, null);
  });

  test('POST /api/analyze-menu {} → OCR_PROVIDER_INVALID', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'OCR_PROVIDER_INVALID');
  });

  test('no stack trace in error', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Safety: invalid ANALYSIS_PROVIDER → controlled error
// ────────────────────────────────────────────────────────────────────────────

describe('Invalid ANALYSIS_PROVIDER', () => {
  before(async () => {
    await startServer({ ANALYSIS_PROVIDER: 'unknown_provider' });
  });

  after(async () => {
    await stopServer();
  });

  test('GET /health → analysisConfigValid is false', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.analysisConfigValid, false);
    assert.strictEqual(res.body.activeAnalysisProvider, null);
  });

  test('POST /api/analyze-menu {} → ANALYSIS_PROVIDER_INVALID', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'ANALYSIS_PROVIDER_INVALID');
  });

  test('no stack trace in error', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Cross-contamination: no env from one scenario leaks into another
// ────────────────────────────────────────────────────────────────────────────

describe('No cross-scenario env contamination', () => {
  before(async () => {
    // Use default env (no provider overrides) to verify clean state
    await startServer();
  });

  after(async () => {
    await stopServer();
  });

  test('after all gate tests, default pipeline still works', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, true);
    assert.strictEqual(res.body.data.routing.resolvedProviderMode, 'mock');
  });

  test('/health shows mock providers active', async () => {
    const res = await get('/health');
    assert.strictEqual(res.body.activeOcrProvider, 'mock_ocr');
    assert.strictEqual(res.body.activeAnalysisProvider, 'mock_ai');
    assert.strictEqual(res.body.realOcrEnabled, false);
    assert.strictEqual(res.body.realAnalysisEnabled, false);
  });
});
