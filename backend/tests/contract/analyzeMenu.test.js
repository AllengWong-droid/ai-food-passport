/**
 * Contract tests for POST /api/analyze-menu endpoint.
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { startServer, stopServer, post, postRaw } = require('../testHelper');

before(async () => {
  await startServer();
});

after(async () => {
  await stopServer();
});

describe('POST /api/analyze-menu with empty body', () => {
  test('should return status 200', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.status, 200);
  });

  test('should return ok: true', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.strictEqual(res.body.ok, true);
  });

  test('should have data object', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.ok(res.body.data !== null && typeof res.body.data === 'object');
  });

  test('should have data.routing object', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.ok(res.body.data.routing !== null && typeof res.body.data.routing === 'object');
  });

  test('should have data.ocr object', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.ok(res.body.data.ocr !== null && typeof res.body.data.ocr === 'object');
  });

  test('should have non-empty data.dishes array', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.ok(Array.isArray(res.body.data.dishes));
    assert.ok(res.body.data.dishes.length > 0);
  });

  test('should have top-level routing compatibility field', async () => {
    const res = await post('/api/analyze-menu', {});
    // The top-level routing field is for Flutter adapter backward compatibility
    assert.ok(res.body.routing !== null && typeof res.body.routing === 'object');
  });

  test('should have top-level dishes compatibility field', async () => {
    const res = await post('/api/analyze-menu', {});
    assert.ok(Array.isArray(res.body.dishes));
  });

  test('should not have stack trace in response', async () => {
    const res = await post('/api/analyze-menu', {});
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
    assert.ok(!bodyStr.includes('at async'));
  });
});

describe('providerMode routing', () => {
  test('mock mode should resolve without fallback', async () => {
    const res = await post('/api/analyze-menu', { providerMode: 'mock' });
    assert.strictEqual(res.body.ok, true);
    assert.strictEqual(res.body.data.routing.resolvedProviderMode, 'mock');
    assert.strictEqual(res.body.data.routing.fallbackUsed, false);
  });

  test('china mode should resolve safely with fallback metadata', async () => {
    const res = await post('/api/analyze-menu', { providerMode: 'china' });
    assert.strictEqual(res.body.ok, true);
    // china/global/auto all safely resolve to mock with fallback
    assert.ok(res.body.data.routing.fallbackUsed !== undefined);
  });

  test('global mode should resolve safely with fallback metadata', async () => {
    const res = await post('/api/analyze-menu', { providerMode: 'global' });
    assert.strictEqual(res.body.ok, true);
    assert.ok(res.body.data.routing.fallbackUsed !== undefined);
  });

  test('auto mode should resolve safely with fallback metadata', async () => {
    const res = await post('/api/analyze-menu', { providerMode: 'auto' });
    assert.strictEqual(res.body.ok, true);
    assert.ok(res.body.data.routing.fallbackUsed !== undefined);
  });
});

describe('debugScenario: ocr scenarios', () => {
  test('ocr_success should return ok: true', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'ocr_success' });
    assert.strictEqual(res.body.ok, true);
  });

  test('ocr_low_confidence should return ok: true with warning metadata', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'ocr_low_confidence' });
    assert.strictEqual(res.body.ok, true);
    assert.ok(res.body.data.routing.ocrConfidence < 0.5);
  });

  test('ocr_empty_text should return ok: false with OCR_EMPTY_TEXT', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'ocr_empty_text' });
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'OCR_EMPTY_TEXT');
  });

  test('ocr_failure should return ok: false with OCR_FAILED', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'ocr_failure' });
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'OCR_FAILED');
  });

  test('ocr_failure should not leak stack trace', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'ocr_failure' });
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
  });
});

describe('debugScenario: analysis scenarios', () => {
  test('analysis_success should return ok: true', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'analysis_success' });
    assert.strictEqual(res.body.ok, true);
  });

  test('analysis_low_quality should return ok: true with warning metadata', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'analysis_low_quality' });
    assert.strictEqual(res.body.ok, true);
    assert.ok(res.body.data.routing.analysisConfidence < 0.7);
  });

  test('analysis_empty_result should return controlled empty/no-dishes behavior', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'analysis_empty_result' });
    // The mock may return ok:true with empty dishes, or ok:false
    assert.ok(res.body.ok !== undefined);
    if (res.body.ok === true) {
      assert.ok(Array.isArray(res.body.data.dishes));
    }
  });

  test('analysis_failure should return ok: false with ANALYSIS_FAILED', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'analysis_failure' });
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'ANALYSIS_FAILED');
  });

  test('analysis_failure should not leak stack trace', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'analysis_failure' });
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
  });
});

describe('invalid JSON body', () => {
  test('should return controlled BAD_REQUEST envelope', async () => {
    const res = await postRaw('/api/analyze-menu', '{not valid json', {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength('{not valid json')
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.ok, false);
    assert.strictEqual(res.body.error.code, 'BAD_REQUEST');
  });

  test('should not leak stack trace', async () => {
    const res = await postRaw('/api/analyze-menu', '{not valid json', {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength('{not valid json')
    });
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('at Object.'));
    assert.ok(!bodyStr.includes('SyntaxError'));
  });

  test('error envelope should have correct structure', async () => {
    const res = await postRaw('/api/analyze-menu', '{not valid json', {
      'Content-Type': 'application/json'
    });
    assert.ok(res.body.error !== null);
    assert.ok(typeof res.body.error.code === 'string');
    assert.ok(typeof res.body.error.message === 'string');
    // details should be null or safe string
    assert.ok(res.body.error.details === null || typeof res.body.error.details === 'string');
  });
});

describe('error envelope structure', () => {
  test('should have standardized structure for error responses', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'ocr_failure' });
    assert.ok(res.body.ok !== undefined);
    assert.ok(res.body.data === null || res.body.data !== undefined);
    assert.ok(res.body.error !== null);
    assert.ok(typeof res.body.error.code === 'string');
    assert.ok(typeof res.body.error.message === 'string');
  });

  test('should not have raw provider errors in envelope', async () => {
    const res = await post('/api/analyze-menu', { debugScenario: 'ocr_failure' });
    const bodyStr = JSON.stringify(res.body);
    assert.ok(!bodyStr.includes('providerRawError'));
    assert.ok(!bodyStr.includes('providerRawResponse'));
  });
});
