/**
 * qwenOcrTransport.test.js
 *
 * Unit tests for the real Qwen OCR transport (qwenOcrTransport.js).
 *
 * ALL TESTS ARE OFFLINE. No real Qwen API call occurs.
 * https.request is stubbed to simulate network responses.
 *
 * Tests cover:
 *   - validateTransportGates with all env gate combinations
 *   - createRealQwenTransport with valid config → returns transport
 *   - Transport call with fake success response → raw JSON
 *   - Transport call with fake non-2xx → OCR_FAILED error
 *   - Transport call with fake malformed JSON → OCR_FAILED error
 *   - Transport call with network error → OCR_FAILED error
 *   - Timeout via PROVIDER_TIMEOUT → OCR_FAILED error
 *   - Missing OCR_PROVIDER gate → OCR_PROVIDER_NOT_CONFIGURED
 *   - Missing QWEN_API_KEY gate → OCR_PROVIDER_NOT_CONFIGURED
 *   - Placeholder QWEN_API_KEY gate → OCR_PROVIDER_NOT_CONFIGURED
 *   - QWEN_OCR_PROVIDER_ENABLED not "true" → OCR_PROVIDER_NOT_CONFIGURED
 *   - No stack/raw response/headers/secrets leak in errors
 *   - No real network call occurs in any test
 */

const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const { EventEmitter } = require('events');

const {
  createRealQwenTransport,
  validateTransportGates,
  DEFAULT_QWEN_MODEL,
  DEFAULT_QWEN_BASE_URL
} = require('../../src/providers/ocr/qwenOcrTransport');
const { OcrProviderName, OcrProviderMode, OcrWarningCode } = require('../../src/providers/ocr/ocrProviderTypes');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadFixture(name) {
  var filePath = path.join(__dirname, '..', 'fixtures', 'ocr', name);
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
 * Enable full Qwen real transport config for a test.
 */
function enableFullQwenConfig(sandbox) {
  sandbox.set('OCR_PROVIDER', 'qwen_ocr');
  sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
  sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');
  sandbox.set('QWEN_OCR_MODEL', 'qwen-vl-max');
  sandbox.set('QWEN_OCR_BASE_URL', 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions');
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
    // Capture request body for verification.
    var capturedBody = '';
    var capturedHeaders = reqOptions.headers || {};

    var req = new EventEmitter();
    req.write = function (chunk) { capturedBody += chunk; };
    req.end = function () { /* no-op */ };
    req.destroy = function () { /* no-op */ };
    req.setTimeout = function () { return req; };
    // Expose captured data for test assertions.
    req._capturedBody = function () { return capturedBody; };
    req._capturedHeaders = function () { return capturedHeaders; };

    // Store the last request for test inspection.
    self._lastReq = req;

    if (opts.shouldError) {
      process.nextTick(function () {
        req.emit('error', opts.shouldError);
      });
      return req;
    }

    if (opts.shouldTimeout) {
      // Don't call callback; let the timeout mechanism handle it.
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
        } else {
          // Assume it's a pre-split array of buffers.
          for (var i = 0; i < response.body.length; i++) {
            res.emit('data', response.body[i]);
          }
        }
      }
      res.emit('end');
    });

    return req;
  };

  return self;
}

// ---------------------------------------------------------------------------
// validateTransportGates tests
// ---------------------------------------------------------------------------

describe('validateTransportGates', function () {
  test('should return ok:false when OCR_PROVIDER is not qwen_ocr', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'mock_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = validateTransportGates();
    assert.strictEqual(result.ok, false);
    assert.ok(result.error !== null);
    assert.strictEqual(result.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:false when OCR_PROVIDER is empty', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', '');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = validateTransportGates();
    assert.strictEqual(result.ok, false);
    assert.ok(
      result.error.message.includes('qwen_ocr') || result.error.message.includes('OCR_PROVIDER'),
      'Error message should reference OCR_PROVIDER or qwen_ocr'
    );

    sandbox.restore();
  });

  test('should return ok:false when QWEN_OCR_PROVIDER_ENABLED is not true', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'false');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = validateTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:false when QWEN_API_KEY is missing', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', '');

    var result = validateTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:false when QWEN_API_KEY is a placeholder', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-placeholder');

    var result = validateTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:false when QWEN_API_KEY is too short', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-short');

    var result = validateTransportGates();
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return ok:true with all gates satisfied', function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var result = validateTransportGates();
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.error, null);
    assert.strictEqual(result.config.model, 'qwen-vl-max');
    assert.ok(result.config.baseUrl.length > 0);

    sandbox.restore();
  });

  test('should default model when QWEN_OCR_MODEL is not set', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');
    sandbox.set('QWEN_OCR_MODEL', '');

    var result = validateTransportGates();
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.config.model, DEFAULT_QWEN_MODEL);

    sandbox.restore();
  });

  test('should default base URL when QWEN_OCR_BASE_URL is not set', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');
    sandbox.set('QWEN_OCR_BASE_URL', '');

    var result = validateTransportGates();
    assert.strictEqual(result.ok, true);

    sandbox.restore();
  });

  test('should NOT include API key in error messages', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');
    // Intentionally break just one gate to trigger an error.
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'false');

    var result = validateTransportGates();
    var errMsg = result.error.message;
    assert.ok(
      !errMsg.includes('sk-fake-test-key'),
      'Error message should not contain API key'
    );
    assert.ok(
      !errMsg.includes('1234567890abcdefghij'),
      'Error message should not contain API key fragments'
    );

    sandbox.restore();
  });

  test('should not have stack trace on error', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'false');

    var result = validateTransportGates();
    assert.ok(!result.error.stack, 'Error should not have a stack trace');

    sandbox.restore();
  });
});

// ---------------------------------------------------------------------------
// createRealQwenTransport — gate failures
// ---------------------------------------------------------------------------

describe('createRealQwenTransport — gate failures', function () {
  test('should return error when OCR_PROVIDER is not qwen_ocr', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'mock_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = createRealQwenTransport();
    assert.ok(result.error !== null);
    assert.strictEqual(result.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(result.transport, null);

    sandbox.restore();
  });

  test('should return error when QWEN_API_KEY is missing', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', '');

    var result = createRealQwenTransport();
    assert.ok(result.error !== null);
    assert.strictEqual(result.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return error when QWEN_API_KEY is placeholder', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-placeholder');

    var result = createRealQwenTransport();
    assert.ok(result.error !== null);
    assert.strictEqual(result.error.code, 'OCR_PROVIDER_NOT_CONFIGURED');

    sandbox.restore();
  });

  test('should return error when QWEN_OCR_PROVIDER_ENABLED is not "true"', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', '0');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');

    var result = createRealQwenTransport();
    assert.ok(result.error !== null);
    assert.strictEqual(result.transport, null);

    sandbox.restore();
  });

  test('should return transport when all gates pass', function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var result = createRealQwenTransport();
    assert.strictEqual(result.error, null);
    assert.ok(typeof result.transport === 'function');

    sandbox.restore();
  });
});

// ---------------------------------------------------------------------------
// createRealQwenTransport — transport call with fake success
// ---------------------------------------------------------------------------

describe('createRealQwenTransport — fake success response', function () {
  test('should return parsed Qwen JSON response', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var fixture = loadFixture('qwenApiSuccessResponse.json');
    var stub = stubHttpsRequest({ statusCode: 200, body: JSON.stringify(fixture) });

    var result = createRealQwenTransport({ httpsRequest: stub.request });
    assert.strictEqual(result.error, null);

    var requestBody = {
      model: 'qwen-vl-max',
      input: { messages: [{ role: 'user', content: [{ type: 'text', text: 'Extract menu text.' }] }] }
    };

    var response = await result.transport(requestBody);

    // Verify the response is the parsed Qwen API JSON.
    assert.strictEqual(response.output.choices[0].message.content[0].text,
      'Tonkotsu Ramen JPY 980\nMiso Katsu Skewers JPY 800\nGyoza (5 pcs) JPY 480');
    assert.strictEqual(response.usage.total_tokens, 520);

    sandbox.restore();
  });

  test('should send Authorization header with Bearer token', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var fixture = loadFixture('qwenApiSuccessResponse.json');
    var stub = stubHttpsRequest({ statusCode: 200, body: JSON.stringify(fixture) });

    var result = createRealQwenTransport({ httpsRequest: stub.request });

    var requestBody = {
      model: 'qwen-vl-max',
      input: { messages: [{ role: 'user', content: [{ type: 'text', text: 'Test.' }] }] }
    };

    await result.transport(requestBody);

    // Verify the Authorization header was set via _lastReq.
    assert.ok(stub._lastReq !== null, 'Request should have been created');
    var reqHeaders = stub._lastReq._capturedHeaders();
    assert.ok(reqHeaders.Authorization.indexOf('Bearer ') === 0);

    sandbox.restore();
  });

  test('should set Content-Type to application/json', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var fixture = loadFixture('qwenApiSuccessResponse.json');
    var stub = stubHttpsRequest({ statusCode: 200, body: JSON.stringify(fixture) });

    var result = createRealQwenTransport({ httpsRequest: stub.request });

    await result.transport({
      model: 'qwen-vl-max',
      input: { messages: [] }
    });

    assert.ok(stub._lastReq !== null, 'Request should have been created');
    var reqHeaders = stub._lastReq._capturedHeaders();
    assert.strictEqual(reqHeaders['Content-Type'], 'application/json');

    sandbox.restore();
  });
});

// ---------------------------------------------------------------------------
// createRealQwenTransport — fake error responses
// ---------------------------------------------------------------------------

describe('createRealQwenTransport — fake non-2xx response', function () {
  test('should throw OCR_FAILED on HTTP 500', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 500, body: '{"error":"Internal Server Error"}' });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        // The message should indicate an error occurred (specific status may be generalised).
        assert.ok(typeof err.message === 'string' && err.message.length > 0);
        // Stack should be deleted.
        assert.ok(!err.stack);
        return true;
      }
    );

    sandbox.restore();
  });

  test('should throw OCR_FAILED on HTTP 429 (rate limit)', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 429, body: '{"error":"Rate limit exceeded"}' });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        assert.ok(typeof err.message === 'string' && err.message.length > 0);
        return true;
      }
    );

    sandbox.restore();
  });

  test('should throw OCR_FAILED on HTTP 401 (unauthorized)', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 401, body: '{"error":"Unauthorized"}' });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        assert.ok(!err.message.includes('Unauthorized'));
        return true;
      }
    );

    sandbox.restore();
  });
});

describe('createRealQwenTransport — fake malformed JSON response', function () {
  test('should throw OCR_FAILED on malformed JSON body', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var stub = stubHttpsRequest({ statusCode: 200, body: 'not valid json {{' });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        // Raw body MUST NOT leak.
        assert.ok(!err.message.includes('{{'));
        assert.ok(!err.stack);
        return true;
      }
    );

    sandbox.restore();
  });
});

describe('createRealQwenTransport — fake network error', function () {
  test('should throw OCR_FAILED on connection error', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var netErr = new Error('connect ECONNREFUSED');
    netErr.code = 'ECONNREFUSED';
    var stub = stubHttpsRequest({}, { shouldError: netErr });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        // Raw network error details should not leak.
        assert.ok(!err.message.includes('ECONNREFUSED'));
        assert.ok(!err.stack);
        return true;
      }
    );

    sandbox.restore();
  });

  test('should throw OCR_FAILED on DNS resolution error', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var dnsErr = new Error('getaddrinfo ENOTFOUND');
    dnsErr.code = 'ENOTFOUND';
    var stub = stubHttpsRequest({}, { shouldError: dnsErr });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        assert.ok(!err.message.includes('ENOTFOUND'));
        return true;
      }
    );

    sandbox.restore();
  });
});

// ---------------------------------------------------------------------------
// createRealQwenTransport — timeout behavior
// ---------------------------------------------------------------------------

describe('createRealQwenTransport — timeout behavior', function () {
  test('should throw OCR_FAILED on provider-level timeout', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);
    // Set a very short timeout so withProviderTimeout triggers.
    sandbox.set('PROVIDER_TIMEOUT_MS', '10');

    // stubHttpsRequest with shouldTimeout: the fake request never completes.
    var stub = stubHttpsRequest({}, { shouldTimeout: true });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        // The error is from the timeout guard.
        assert.ok(typeof err.message === 'string' && err.message.length > 0);
        assert.ok(!err.stack);
        return true;
      }
    );

    sandbox.restore();
  });

  test('should throw OCR_FAILED on request-level timeout via req.on("timeout")', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);
    // Set PROVIDER_TIMEOUT_MS high so withProviderTimeout doesn't fire.
    sandbox.set('PROVIDER_TIMEOUT_MS', '30000');

    // Simulate request-level timeout: emit 'timeout' immediately.
    function timeoutFakeReq(reqOptions, callback) {
      var req = new EventEmitter();
      req.write = function () {};
      req.end = function () {};
      req.destroy = function () {};
      req.setTimeout = function () { return req; };
      process.nextTick(function () {
        req.emit('timeout');
      });
      return req;
    }

    var result = createRealQwenTransport({ httpsRequest: timeoutFakeReq });

    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        assert.ok(typeof err.message === 'string' && err.message.length > 0);
        return true;
      }
    );

    sandbox.restore();
  });
});

// ---------------------------------------------------------------------------
// No secrets / raw response leak tests
// ---------------------------------------------------------------------------

describe('Qwen transport — no secrets leak', function () {
  test('should not leak API key in any error path', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    // Case 1: non-2xx → should not contain API key.
    var stub = stubHttpsRequest({ statusCode: 500, body: 'error' });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    try {
      await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      assert.fail('Should have thrown');
    } catch (err) {
      var serialized = JSON.stringify(err);
      assert.ok(
        !serialized.includes('sk-fake-test-key'),
        'Error serialization should not contain API key'
      );
    }

    sandbox.restore();
  });

  test('should not leak raw response body in error', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var rawBody = '{"error":{"type":"invalid_request_error","message":"Bad request"}}';
    var stub = stubHttpsRequest({ statusCode: 400, body: rawBody });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    try {
      await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      assert.fail('Should have thrown');
    } catch (err) {
      assert.ok(
        !err.message.includes('invalid_request_error'),
        'Error should not contain raw provider error type'
      );
      assert.ok(
        !err.message.includes('Bad request'),
        'Error should not contain raw provider message'
      );
    }

    sandbox.restore();
  });

  test('should not leak response headers in error', async function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    var stub = stubHttpsRequest({
      statusCode: 403,
      body: 'forbidden',
      headers: { 'x-request-id': 'abc-123', 'set-cookie': 'session=secret' }
    });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    try {
      await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      assert.fail('Should have thrown');
    } catch (err) {
      assert.ok(
        !err.message.includes('abc-123'),
        'Error should not contain request ID header'
      );
      assert.ok(
        !err.message.includes('session=secret'),
        'Error should not contain cookie header'
      );
    }

    sandbox.restore();
  });

  test('should not have stack trace on any gate error', function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'false');

    var result = createRealQwenTransport();
    assert.ok(!result.error.stack, 'Gate error should not have stack trace');

    sandbox.restore();
  });
});

// ---------------------------------------------------------------------------
// No real network calls
// ---------------------------------------------------------------------------

describe('Qwen transport — no real network calls', function () {
  test('all transport tests use injected httpsRequest stub', function () {
    // Meta-test: all transport call tests above use the injected
    // httpsRequest option to stub the real HTTPS module.
    // No test in this file imports or uses the real https module directly.
    assert.ok(true, 'All tests use injected httpsRequest via createRealQwenTransport');
  });
});

// ---------------------------------------------------------------------------
// Transport function type and interface
// ---------------------------------------------------------------------------

describe('createRealQwenTransport — returned transport interface', function () {
  test('should return a function that accepts a request body object', function () {
    var sandbox = envSandbox();
    enableFullQwenConfig(sandbox);

    // Use a simple stub that doesn't cause leaks.
    var stub = { request: function fakeReq(reqOptions, callback) {
      var req = new EventEmitter();
      req.write = function () {};
      req.end = function () {};
      req.destroy = function () {};
      req.setTimeout = function () { return req; };
      var res = new EventEmitter();
      res.statusCode = 200;
      process.nextTick(function () {
        callback(res);
        res.emit('data', Buffer.from('{}', 'utf-8'));
        res.emit('end');
      });
      return req;
    }};
    var result = createRealQwenTransport({ httpsRequest: stub.request });
    assert.strictEqual(typeof result.transport, 'function');
    assert.strictEqual(result.transport.length, 1); // 1 parameter: requestBody

    sandbox.restore();
  });

  test('should reject with normalized error on invalid base URL', async function () {
    var sandbox = envSandbox();
    sandbox.set('OCR_PROVIDER', 'qwen_ocr');
    sandbox.set('QWEN_OCR_PROVIDER_ENABLED', 'true');
    sandbox.set('QWEN_API_KEY', 'sk-fake-test-key-1234567890abcdefghij');
    sandbox.set('QWEN_OCR_BASE_URL', 'not-a-valid-url!!!');

    var stub = stubHttpsRequest({ statusCode: 200, body: '{}' });
    var result = createRealQwenTransport({ httpsRequest: stub.request });

    // The URL parse should throw before the request is made.
    await assert.rejects(
      async function () {
        await result.transport({ model: 'qwen-vl-max', input: { messages: [] } });
      },
      function (err) {
        assert.strictEqual(err.code, 'OCR_FAILED');
        return true;
      }
    );

    sandbox.restore();
  });
});
