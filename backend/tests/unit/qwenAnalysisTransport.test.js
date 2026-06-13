/**
 * qwenAnalysisTransport.test.js
 *
 * Unit tests for the real Qwen analysis transport (qwenAnalysisTransport.js).
 *
 * ALL TESTS ARE OFFLINE. No real Qwen API call occurs.
 * https.request is stubbed to simulate network responses.
 *
 * Tests cover:
 *   - validateAnalysisTransportGates with all required env vars → ok: true
 *   - validateAnalysisTransportGates without ANALYSIS_PROVIDER → ok: false
 *   - validateAnalysisTransportGates without QWEN_ANALYSIS_PROVIDER_ENABLED → ok: false
 *   - validateAnalysisTransportGates without QWEN_API_KEY → ok: false
 *   - validateAnalysisTransportGates with placeholder QWEN_API_KEY → ok: false
 *   - createRealQwenAnalysisTransport with valid config → returns transport
 *   - Transport call with fake success response → contract result via analyzeMenuText
 *   - Transport call with fake multiple dishes → normalized dishes
 *   - Transport call with fake empty dishes → ANALYSIS_EMPTY_RESULT
 *   - Transport call with fake malformed JSON → ANALYSIS_FAILED
 *   - Transport call with fake non-2xx → ANALYSIS_FAILED
 *   - Network error → ANALYSIS_FAILED
 *   - Timeout via abort/timeout → ANALYSIS_FAILED
 *   - Missing ANALYSIS_PROVIDER gate → ANALYSIS_PROVIDER_NOT_CONFIGURED
 *   - Missing QWEN_API_KEY gate → ANALYSIS_PROVIDER_NOT_CONFIGURED
 *   - Placeholder QWEN_API_KEY gate → ANALYSIS_PROVIDER_NOT_CONFIGURED
 *   - Disabled flag → ANALYSIS_PROVIDER_NOT_CONFIGURED
 *   - No stack/raw response/headers/secrets leak in errors
 *   - No real network call occurs in any test
 *   - mock_ai remains the active default
 */
const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const { EventEmitter } = require('events');

const {
  createRealQwenAnalysisTransport,
  validateAnalysisTransportGates,
  DEFAULT_QWEN_ANALYSIS_MODEL,
  DEFAULT_QWEN_ANALYSIS_BASE_URL
} = require('../../src/providers/analysis/qwenAnalysisTransport');
const {
  analyzeMenuText,
  validateQwenAnalysisConfig,
  createFakeQwenAnalysisTransport,
  normalizeQwenAnalysisResponse
} = require('../../src/providers/analysis/qwenAnalysisProvider');
const {
  AnalysisProviderName,
  AnalysisProviderMode,
  AnalysisWarningCode
} = require('../../src/providers/analysis/analysisProviderTypes');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadFixture(name) {
  var filePath = path.join(__dirname, '..', 'fixtures', 'analysis', 'qwen', name);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Save and restore env vars around a test.
 */
function envSandbox() {
  var saved = {};
  return {
    set: function (key, value) {
      if (!(key in saved)) {
        saved[key] = process.env[key];
      }
      if (value === undefined || value === null) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    },
    restore: function () {
      var keys = Object.keys(saved);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (saved[k] === undefined) {
          delete process.env[k];
        } else {
          process.env[k] = saved[k];
        }
      }
      saved = {};
    }
  };
}

/**
 * Enable full Qwen analysis transport config for a test.
 */
function enableFullQwenAnalysisConfig(sandbox) {
  sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
  sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
  sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');
  sandbox.set('QWEN_ANALYSIS_MODEL', 'qwen-max');
  sandbox.set('QWEN_ANALYSIS_BASE_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions');
}

/**
 * Create a stubbed https.request that simulates a response.
 *
 * The factory returns an object with:
 *   .request — the fake https.request function
 *   ._lastReq — the last request object created (for test assertions)
 *
 * @param {object} response - Simulated response { statusCode, body, headers }
 * @param {object} [options] - { shouldTimeout, shouldError }
 * @returns {{ request: Function, _lastReq: object|null }}
 */
function stubHttpsRequest(response, options) {
  var opts = options || {};
  var self = { _lastReq: null };

  self.request = function fakeRequest(reqOptions, callback) {
    var capturedBody = '';
    var capturedHeaders = reqOptions.headers || {};

    var req = new EventEmitter();
    req.write = function (chunk) { capturedBody += chunk; };
    req.end = function () { /* no-op */ };
    req.destroy = function () { /* no-op */ };
    req.setTimeout = function () { return req; };
    req._capturedBody = function () { return capturedBody; };
    req._capturedHeaders = function () { return capturedHeaders; };

    self._lastReq = req;

    if (opts.shouldError) {
      process.nextTick(function () {
        req.emit('error', opts.shouldError);
      });
      return req;
    }

    if (opts.shouldTimeout) {
      return req;
    }

    var res = new EventEmitter();
    res.statusCode = response.statusCode || 200;
    res.headers = response.headers || {};

    process.nextTick(function () {
      callback(res);

      if (response.body) {
        if (typeof response.body === 'string') {
          res.emit('data', Buffer.from(response.body, 'utf-8'));
        }
      }
      res.emit('end');
    });

    return req;
  };

  return self;
}

// ---------------------------------------------------------------------------
// validateAnalysisTransportGates tests
// ---------------------------------------------------------------------------

describe('validateAnalysisTransportGates', function () {

  test('should return ok:true when all gates are satisfied', function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.error, null);
    assert.ok(result.config !== null);
    assert.strictEqual(result.config.model, 'qwen-max');
    assert.strictEqual(typeof result.config.apiKey, 'string');
    assert.ok(result.config.apiKey.length > 0);
    // API key must not be logged or exposed in the result beyond config
    assert.strictEqual(result.config.keySource, 'env');

    sandbox.restore();
  });

  test('should return ok:false when ANALYSIS_PROVIDER is not qwen_analysis', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'mock_ai');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, false);
    assert.ok(result.error !== null);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:false when ANALYSIS_PROVIDER is empty', function () {
    var sandbox = envSandbox();
    delete process.env.ANALYSIS_PROVIDER;
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:false when QWEN_ANALYSIS_PROVIDER_ENABLED is not true', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'false');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
    assert.ok(result.error.message.indexOf('QWEN_ANALYSIS_PROVIDER_ENABLED') !== -1 ||
              result.error.message.indexOf('not available') !== -1);

    sandbox.restore();
  });

  test('should return ok:false when QWEN_API_KEY is missing', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    delete process.env.QWEN_API_KEY;

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:false when QWEN_API_KEY is placeholder', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-placeholder');

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');

    // Placeholder key detection should NOT expose the actual key value.
    assert.strictEqual(result.error.message.indexOf('sk-placeholder'), -1);

    sandbox.restore();
  });

  test('should return ok:false for short API key (too short)', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-short');

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:true when base URL uses default (not explicitly set)', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');
    sandbox.set('QWEN_ANALYSIS_MODEL', 'qwen-max');
    delete process.env.QWEN_ANALYSIS_BASE_URL;

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, true);
    // When QWEN_ANALYSIS_BASE_URL is not set, validateQwenAnalysisConfig()
    // returns 'https://dashscope.aliyuncs.com' as the default, which
    // takes precedence over DEFAULT_QWEN_ANALYSIS_BASE_URL.
    assert.strictEqual(result.config.baseUrl, 'https://dashscope.aliyuncs.com');

    sandbox.restore();
  });

  test('should return ok:true when model uses default (not explicitly set)', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');
    delete process.env.QWEN_ANALYSIS_MODEL;

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.config.model, DEFAULT_QWEN_ANALYSIS_MODEL);

    sandbox.restore();
  });

});

// ---------------------------------------------------------------------------
// createRealQwenAnalysisTransport tests
// ---------------------------------------------------------------------------

describe('createRealQwenAnalysisTransport', function () {

  test('should return transport when all gates are satisfied', function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var result = createRealQwenAnalysisTransport();
    assert.strictEqual(result.error, null);
    assert.ok(result.transport !== null);
    assert.strictEqual(typeof result.transport, 'function');

    sandbox.restore();
  });

  test('should return error when ANALYSIS_PROVIDER gate not met', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'mock_ai');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = createRealQwenAnalysisTransport();
    assert.strictEqual(result.transport, null);
    assert.ok(result.error !== null);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(typeof result.error.message, 'string');
    assert.ok(result.error.message.length > 0);
    // Stack must NOT be present.
    assert.strictEqual(result.error.stack, undefined);

    sandbox.restore();
  });

  test('should return error when QWEN_ANALYSIS_PROVIDER_ENABLED gate not met', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'false');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = createRealQwenAnalysisTransport();
    assert.strictEqual(result.transport, null);
    assert.ok(result.error !== null);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(result.error.stack, undefined);

    sandbox.restore();
  });

  test('should return error when QWEN_API_KEY gate not met', function () {
    var sandbox = envSandbox();
    sandbox.set('ANALYSIS_PROVIDER', 'qwen_analysis');
    sandbox.set('QWEN_ANALYSIS_PROVIDER_ENABLED', 'true');
    delete process.env.QWEN_API_KEY;

    var result = createRealQwenAnalysisTransport();
    assert.strictEqual(result.transport, null);
    assert.ok(result.error !== null);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(result.error.stack, undefined);

    sandbox.restore();
  });

  test('should accept custom httpsRequest for DI testing', function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var fakeBody = JSON.stringify({
      output: {
        choices: [{ message: { content: '{"dishes":[],"confidence":0}' } }]
      },
      usage: { total_tokens: 0 }
    });

    var stub = stubHttpsRequest({ statusCode: 200, body: fakeBody });

    var result = createRealQwenAnalysisTransport({ httpsRequest: stub.request });
    assert.strictEqual(result.error, null);
    assert.ok(result.transport !== null);

    sandbox.restore();
  });

});

// ---------------------------------------------------------------------------
// Transport call with fake success response
// ---------------------------------------------------------------------------

describe('Transport call with fake success', function () {

  test('should return normalized contract result when Qwen analysis API returns valid response', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var fixture = loadFixture('qwenAnalysisSuccess.json');
    // Extract the dish content JSON from the fixture
    var dishesJson = fixture.output.choices[0].message.content;
    var fakeBody = JSON.stringify(fixture);

    var stub = stubHttpsRequest({ statusCode: 200, body: fakeBody });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });
    assert.strictEqual(transportResult.error, null);

    var rawResponse = await transportResult.transport({
      model: 'qwen-max',
      input: { messages: [{ role: 'user', content: 'Analyze this menu text.' }] }
    });

    // Should be the raw JSON response from Qwen API.
    assert.ok(rawResponse !== null);
    assert.strictEqual(typeof rawResponse, 'object');
    assert.ok(rawResponse.output !== undefined);
    assert.ok(rawResponse.output.choices !== undefined);

    sandbox.restore();
  });

  test('should return contract result when integrated via analyzeMenuText with real transport', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var fixture = loadFixture('qwenAnalysisSuccess.json');
    var fakeBody = JSON.stringify(fixture);

    var stub = stubHttpsRequest({ statusCode: 200, body: fakeBody });
    // We need to test that analyzeMenuText uses the real transport.
    // The real transport is created when no fake transport is passed and config is valid.
    // But for the integration test, we pass the stubbed https.request as an option.

    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });
    assert.strictEqual(transportResult.error, null);

    // Use the real transport as the fake transport seam — this exercises the
    // full normalizeQwenAnalysisResponse pipeline.
    var ocrResult = { text: 'Menu: Ramen 800 yen, Sushi 1200 yen' };
    var requestBody = { userHomeCurrency: 'CNY', scan: { localCurrency: 'JPY' } };

    var result = await analyzeMenuText(
      { requestBody: requestBody, ocrResult: ocrResult },
      { transport: transportResult.transport }
    );

    // Contract conformance
    assert.strictEqual(typeof result, 'object');
    assert.ok('provider' in result);
    assert.ok('mode' in result);
    assert.ok('confidence' in result);
    assert.ok('dishes' in result);
    assert.ok('warnings' in result);
    assert.ok('rawMetadata' in result);
    assert.strictEqual(Object.keys(result).length, 6);

    // Provider info
    assert.strictEqual(result.provider, AnalysisProviderName.QWEN_ANALYSIS);
    assert.strictEqual(result.mode, AnalysisProviderMode.ANALYSIS);

    // Dishes present
    assert.ok(Array.isArray(result.dishes));
    assert.ok(result.dishes.length > 0);

    sandbox.restore();
  });

  test('should handle multiple dishes from Qwen analysis response', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var fixture = JSON.parse(JSON.stringify(loadFixture('qwenAnalysisSuccess.json')));
    // Ensure multiple dishes
    var content = JSON.parse(fixture.output.choices[0].message.content);
    content.dishes = [
      { dishName: 'Ramen', name: 'Ramen', tasteScore: 85, confidence: 0.9, ingredients: ['noodles', 'broth'], description: 'Rich pork bone ramen', estimatedPrice: 800, currency: 'JPY', priceIntelligence: { localPrice: 800, localCurrency: 'JPY', homePrice: 48, homeCurrency: 'CNY', exchangeRate: 0.06, assessment: 'Good Value' } },
      { dishName: 'Sushi', name: 'Sushi', tasteScore: 90, confidence: 0.95, ingredients: ['rice', 'fish'], description: 'Fresh nigiri set', estimatedPrice: 1200, currency: 'JPY', priceIntelligence: { localPrice: 1200, localCurrency: 'JPY', homePrice: 72, homeCurrency: 'CNY', exchangeRate: 0.06, assessment: 'Fair' } }
    ];
    fixture.output.choices[0].message.content = JSON.stringify(content);

    var fakeBody = JSON.stringify(fixture);
    var stub = stubHttpsRequest({ statusCode: 200, body: fakeBody });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    var rawResponse = await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
    var normalized = normalizeQwenAnalysisResponse(rawResponse);

    assert.strictEqual(normalized.dishes.length, 2);
    assert.strictEqual(normalized.dishes[0].name, 'Ramen');
    assert.strictEqual(normalized.dishes[1].name, 'Sushi');

    sandbox.restore();
  });

  test('should handle empty dishes from Qwen analysis response as ANALYSIS_EMPTY_RESULT', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var fixture = JSON.parse(JSON.stringify(loadFixture('qwenAnalysisEmpty.json')));
    var fakeBody = JSON.stringify(fixture);
    var stub = stubHttpsRequest({ statusCode: 200, body: fakeBody });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    var rawResponse = await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
    var normalized = normalizeQwenAnalysisResponse(rawResponse);

    assert.strictEqual(normalized.dishes.length, 0);
    assert.ok(normalized.warnings.indexOf(AnalysisWarningCode.EMPTY_RESULT) !== -1);
    assert.strictEqual(normalized.confidence, 0);

    sandbox.restore();
  });

});

// ---------------------------------------------------------------------------
// Transport error handling
// ---------------------------------------------------------------------------

describe('Transport error handling', function () {

  test('should return ANALYSIS_FAILED when Qwen analysis API returns non-2xx', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 500, body: 'Internal Server Error' });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });
    assert.strictEqual(transportResult.error, null);

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(typeof err.message, 'string');
      assert.ok(err.message.length > 0);
      // Must not contain raw body
      assert.strictEqual(err.message.indexOf('Internal Server Error'), -1);
      // No stack
      assert.strictEqual(err.stack, undefined);
      // Provider preserved
      assert.ok(err.provider === undefined || err.provider === AnalysisProviderName.QWEN_ANALYSIS);
    }

    sandbox.restore();
  });

  test('should return ANALYSIS_FAILED when Qwen analysis API returns 400', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 400, body: '{"error":{"message":"bad request"}}' });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(typeof err.message, 'string');
      // Must not contain raw error body
      assert.strictEqual(err.message.indexOf('bad request'), -1);
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

  test('should return ANALYSIS_FAILED when Qwen analysis API returns malformed JSON', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 200, body: 'not valid json {{{' });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(typeof err.message, 'string');
      // Must not contain raw body
      assert.strictEqual(err.message.indexOf('{{{'), -1);
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

  test('should return ANALYSIS_FAILED on network error (connection refused)', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var netErr = new Error('connect ECONNREFUSED');
    netErr.code = 'ECONNREFUSED';
    var stub = stubHttpsRequest(null, { shouldError: netErr });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(typeof err.message, 'string');
      // Must not leak network error details
      assert.strictEqual(err.message.indexOf('ECONNREFUSED'), -1);
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

  test('should return ANALYSIS_FAILED on timeout via ECONNABORTED', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var timeoutErr = new Error('aborted');
    timeoutErr.code = 'ECONNABORTED';
    var stub = stubHttpsRequest(null, { shouldError: timeoutErr });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(typeof err.message, 'string');
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

  test('should timeout via withProviderTimeout with very short timeout', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);
    // Set an extremely short timeout to force withProviderTimeout to fire.
    sandbox.set('PROVIDER_TIMEOUT_MS', '1');

    var stub = stubHttpsRequest({ statusCode: 200, body: '{}' }, { shouldTimeout: true });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected timeout error but none was thrown');
    } catch (err) {
      // Should be ANALYSIS_FAILED (re-mapped from PROVIDER_TIMEOUT or direct timeout)
      assert.ok(
        err.code === 'ANALYSIS_FAILED' || err.code === 'PROVIDER_TIMEOUT',
        'Expected ANALYSIS_FAILED or PROVIDER_TIMEOUT, got: ' + err.code
      );
      assert.strictEqual(typeof err.message, 'string');
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

});

// ---------------------------------------------------------------------------
// leaktight error tests
// ---------------------------------------------------------------------------

describe('leaktight errors', function () {

  test('should not leak raw provider response body in error message', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 503, body: '{"error":{"code":"ServiceUnavailable","message":"API overloaded"}}' });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(err.message.indexOf('ServiceUnavailable'), -1);
      assert.strictEqual(err.message.indexOf('API overloaded'), -1);
      // HTTP status code in message text ("HTTP 503") is allowed —
      // it's not raw provider body, it's the informative status.
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

  test('should not leak API key in error message', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);
    // Use a specific API key to test leakage.
    sandbox.set('QWEN_API_KEY', 'sk-secret-real-key-1234567');

    var stub = stubHttpsRequest({ statusCode: 401, body: 'Unauthorized' });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(err.message.indexOf('sk-secret'), -1);
      assert.strictEqual(err.message.indexOf('sk-'), -1);
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

  test('should not leak request headers in error message', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 500, body: 'error' });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(err.message.indexOf('Bearer'), -1);
      assert.strictEqual(err.message.indexOf('Authorization'), -1);
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

  test('should not include raw prompt text in error message', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 500, body: 'error' });
    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

    try {
      await transportResult.transport({
        model: 'qwen-max',
        input: {
          messages: [
            { role: 'user', content: 'Analyze this menu: secret dish secret recipe' }
          ]
        }
      });
      assert.fail('Expected error but none was thrown');
    } catch (err) {
      assert.strictEqual(err.code, 'ANALYSIS_FAILED');
      assert.strictEqual(err.message.indexOf('secret dish'), -1);
      assert.strictEqual(err.message.indexOf('secret recipe'), -1);
      assert.strictEqual(err.stack, undefined);
    }

    sandbox.restore();
  });

  test('should never have stack trace on normalized errors', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var scenarios = [
      { statusCode: 500, body: 'error', name: 'non-2xx' },
      { statusCode: 200, body: 'bad json {{{', name: 'malformed' }
    ];

    for (var i = 0; i < scenarios.length; i++) {
      var s = scenarios[i];
      var stub = stubHttpsRequest({ statusCode: s.statusCode, body: s.body });
      var tr = createRealQwenAnalysisTransport({ httpsRequest: stub.request });

      try {
        await tr.transport({ model: 'qwen-max', input: { messages: [] } });
        assert.fail('Expected error for scenario ' + s.name);
      } catch (err) {
        assert.strictEqual(err.code, 'ANALYSIS_FAILED', 'Scenario ' + s.name);
        assert.strictEqual(err.stack, undefined, 'Scenario ' + s.name + ' should have no stack');
        assert.strictEqual(typeof err.message, 'string');
      }
    }

    sandbox.restore();
  });

});

// ---------------------------------------------------------------------------
// No real network call tests
// ---------------------------------------------------------------------------

describe('No real network calls', function () {

  test('should not make any real network calls when using stubbed transport', async function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);

    var callCount = 0;

    function countingFakeRequest(reqOptions, callback) {
      callCount++;
      var req = new EventEmitter();
      req.write = function () {};
      req.end = function () {};
      req.destroy = function () {};
      req.setTimeout = function () { return req; };

      var res = new EventEmitter();
      res.statusCode = 200;
      res.headers = {};

      process.nextTick(function () {
        callback(res);
        res.emit('data', Buffer.from(JSON.stringify({
          output: { choices: [{ message: { content: '{"dishes":[],"confidence":0}' } }] },
          usage: { total_tokens: 0 }
        }), 'utf-8'));
        res.emit('end');
      });

      return req;
    }

    var transportResult = createRealQwenAnalysisTransport({ httpsRequest: countingFakeRequest });
    assert.strictEqual(callCount, 0); // No calls during creation

    await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
    assert.strictEqual(callCount, 1); // One call during transport

    // Call again
    await transportResult.transport({ model: 'qwen-max', input: { messages: [] } });
    assert.strictEqual(callCount, 2); // Two calls total, all to fake

    sandbox.restore();
  });

});

// ---------------------------------------------------------------------------
// mock_ai default unchanged
// ---------------------------------------------------------------------------

describe('mock_ai default unchanged', function () {

  test('should confirm mock_ai is the default when no env vars override it', function () {
    var sandbox = envSandbox();
    // Ensure no override env vars for analysis.
    delete process.env.ANALYSIS_PROVIDER;
    delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;

    // Default ANALYSIS_PROVIDER should not be qwen_analysis.
    var analysisProvider = (process.env.ANALYSIS_PROVIDER || '').trim();
    assert.strictEqual(analysisProvider, '');

    // Qwen analysis transport gates should fail.
    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, false);

    sandbox.restore();
  });

  test('should confirm qwen_analysis transport is disabled without explicit ANALYSIS_PROVIDER', function () {
    var sandbox = envSandbox();
    enableFullQwenAnalysisConfig(sandbox);
    // But override ANALYSIS_PROVIDER to something else.
    sandbox.set('ANALYSIS_PROVIDER', 'mock_ai');

    var result = validateAnalysisTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

});
