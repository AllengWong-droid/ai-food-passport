/**
 * qwenOcrTransport.js
 *
 * Real Qwen OCR Transport — backend-only, behind explicit safety gates.
 *
 * Purpose:
 *   Provide a real HTTPS transport function that calls the Qwen VL API
 *   to extract menu text from images. This transport is NEVER active by
 *   default. It requires ALL of the following env gates to pass:
 *
 *     OCR_PROVIDER=qwen_ocr
 *     QWEN_OCR_PROVIDER_ENABLED=true
 *     QWEN_API_KEY must be present and non-placeholder
 *     QWEN_OCR_MODEL must be present (or safe default: qwen-vl-max)
 *     QWEN_OCR_BASE_URL must be present (or safe default: dashscope.aliyuncs.com)
 *
 *   If any required condition is missing, the transport creation returns a
 *   controlled OCR_PROVIDER_NOT_CONFIGURED error instead of a transport
 *   function. The transport wrapper also applies timeout via
 *   withProviderTimeout from the provider safety guards, and maps all
 *   errors (network timeout, non-2xx, malformed response) to safe,
 *   contract-conformant error codes with no stack traces, raw provider
 *   responses, headers, or API keys.
 *
 * Safety invariants:
 *   - API keys are NEVER logged (not in errors, not in user-facing messages).
 *   - Stack traces are removed from all errors before they leave this module.
 *   - Raw provider HTTP responses are NEVER exposed to callers.
 *   - Image data is NEVER included in error messages or logs.
 *   - Provider key material stays in backend only — never exposed to Flutter.
 *   - Automated tests stub https.request to stay 100% offline.
 *
 * Usage (manual, with .env configured):
 *
 *   const { createRealQwenTransport } = require('./qwenOcrTransport');
 *   const result = createRealQwenTransport();
 *   if (result.error) {
 *     // transport creation failed → gate(s) not met
 *     throw result.error;
 *   }
 *   const transport = result.transport;
 *   const rawResponse = await transport(requestBody);
 *
 * Automated tests must NEVER call this transport with real credentials.
 * Tests use Node.js module mocking or dependency injection to stub
 * the underlying https.request.
 */

const https = require('https');
const { URL } = require('url');
const {
  validateQwenOcrConfig
} = require('./qwenOcrProvider');
const {
  OcrProviderName
} = require('./ocrProviderTypes');
const {
  normalizeOcrError
} = require('./ocrProviderContract');
const {
  getProviderSafetyConfig
} = require('../../config/providerSafetyConfig');
const {
  withProviderTimeout
} = require('../safety/providerSafetyGuards');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default Qwen VL model. Override with QWEN_OCR_MODEL env var. */
const DEFAULT_QWEN_MODEL = 'qwen-vl-max';

/** Default Qwen API base URL (DashScope compatible-mode endpoint). */
const DEFAULT_QWEN_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

/** Default request timeout in milliseconds when PROVIDER_TIMEOUT_MS is unset. */
const DEFAULT_TIMEOUT_MS = 15000;

// ---------------------------------------------------------------------------
// Gate validation (transport-specific — separate from adapter config)
// ---------------------------------------------------------------------------

/**
 * Validate all required env gates for creating a real Qwen transport.
 *
 * This is MORE strict than validateQwenOcrConfig() from the adapter:
 * in addition to checking QWEN_OCR_PROVIDER_ENABLED and QWEN_API_KEY,
 * it also requires OCR_PROVIDER to be set to 'qwen_ocr'.
 *
 * @returns {{ ok: boolean, error: Error|null, config: object }}
 */
function validateTransportGates() {
  // Gate 1: OCR_PROVIDER must be explicitly set to qwen_ocr.
  const ocrProvider = (process.env.OCR_PROVIDER || '').trim();
  if (ocrProvider !== OcrProviderName.QWEN_OCR) {
    var err = new Error(
      'OCR_PROVIDER is not set to "qwen_ocr". The Qwen OCR transport ' +
      'requires OCR_PROVIDER=qwen_ocr in addition to Qwen-specific env vars.'
    );
    err.code = 'OCR_PROVIDER_NOT_CONFIGURED';
    err.provider = OcrProviderName.QWEN_OCR;
    return { ok: false, error: normalizeOcrError(err, 'OCR_PROVIDER_NOT_CONFIGURED'), config: null };
  }

  // Gate 2: Qwen OCR config (enabled flag, API key, model, base URL).
  var qwenConfig = validateQwenOcrConfig();

  if (!qwenConfig.enabled) {
    var errMsg = 'Qwen OCR transport is not available: ' + qwenConfig.reason;
    var configErr = new Error(errMsg);
    configErr.code = 'OCR_PROVIDER_NOT_CONFIGURED';
    configErr.provider = OcrProviderName.QWEN_OCR;
    return { ok: false, error: normalizeOcrError(configErr, 'OCR_PROVIDER_NOT_CONFIGURED'), config: null };
  }

  // Gate 3: Model must be present (or use safe default).
  var model = qwenConfig.model || DEFAULT_QWEN_MODEL;

  // Gate 4: Base URL must be present (or use safe default).
  var baseUrl = qwenConfig.baseUrl || DEFAULT_QWEN_BASE_URL;

  // After config validation passes, read the API key directly from env.
  // validateQwenOcrConfig() does NOT return the key value for security.
  var apiKey = (process.env.QWEN_API_KEY || '').trim();

  return {
    ok: true,
    error: null,
    config: {
      apiKey: apiKey,
      model: model,
      baseUrl: baseUrl,
      keySource: qwenConfig.keySource
    }
  };
}

// ---------------------------------------------------------------------------
// Real transport factory
// ---------------------------------------------------------------------------

/**
 * Create the real Qwen OCR transport function.
 *
 * This is the main entry point. It validates all env gates and returns
 * either a transport function or a controlled error.
 *
 * The returned transport function:
 *   - Makes a real HTTPS POST to the Qwen VL API
 *   - Is wrapped in withProviderTimeout for safety
 *   - Parses and returns the raw Qwen JSON response
 *   - Maps all failures to safe, normalized errors
 *
 * @param {object} [options]
 * @param {Function} [options.httpsRequest] - Dependency injection for tests
 * @returns {{ transport: Function|null, error: Error|null }}
 */
function createRealQwenTransport(options) {
  var opts = options || {};
  var injectedRequest = opts.httpsRequest || null;

  var gateResult = validateTransportGates();
  if (!gateResult.ok) {
    return { transport: null, error: gateResult.error };
  }

  var config = gateResult.config;
  var safetyConfig = getProviderSafetyConfig();
  var timeoutMs = safetyConfig.providerTimeoutMs || DEFAULT_TIMEOUT_MS;

  /**
   * Real Qwen OCR transport function.
   *
   * @param {object} requestBody - Qwen API-compatible request body
   *   { model, input: { messages: [...] } }
   * @returns {Promise<object>} Raw Qwen JSON response
   */
  function realTransport(requestBody) {
    var makeRequest = injectedRequest || https.request;

    // Build the operation that will be wrapped in a timeout.
    var operation = function () {
      return new Promise(function (resolve, reject) {
        var parsedUrl;
        try {
          parsedUrl = new URL(config.baseUrl);
        } catch (urlError) {
          var urlErr = new Error('Invalid QWEN_OCR_BASE_URL: ' + urlError.message);
          urlErr.code = 'OCR_FAILED';
          urlErr.provider = OcrProviderName.QWEN_OCR;
          reject(normalizeOcrError(urlErr, 'OCR_FAILED'));
          return;
        }

        var bodyJson;
        try {
          bodyJson = JSON.stringify(requestBody);
        } catch (stringifyError) {
          var stringifyErr = new Error('Failed to serialise Qwen request body.');
          stringifyErr.code = 'OCR_FAILED';
          stringifyErr.provider = OcrProviderName.QWEN_OCR;
          reject(normalizeOcrError(stringifyErr, 'OCR_FAILED'));
          return;
        }

        var reqOptions = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || 443,
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.apiKey,
            'Accept': 'application/json',
            'Content-Length': Buffer.byteLength(bodyJson, 'utf-8')
          },
          timeout: timeoutMs
        };

        var req;
        try {
          req = makeRequest(reqOptions, function (res) {
            var chunks = [];

            res.on('data', function (chunk) {
              chunks.push(chunk);
            });

            res.on('end', function () {
              var rawBody = Buffer.concat(chunks).toString('utf-8');

              // Non-2xx: reject with safe error (no raw body in message).
              if (res.statusCode < 200 || res.statusCode >= 300) {
                var statusErr = new Error(
                  'Qwen OCR API returned HTTP ' + res.statusCode + '.'
                );
                statusErr.code = 'OCR_FAILED';
                statusErr.provider = OcrProviderName.QWEN_OCR;
                // Do NOT include rawBody, headers, or res in the error.
                reject(normalizeOcrError(statusErr, 'OCR_FAILED'));
                return;
              }

              // Parse the JSON body.
              var parsed;
              try {
                parsed = JSON.parse(rawBody);
              } catch (parseError) {
                var parseErr = new Error('Qwen OCR API returned malformed JSON response.');
                parseErr.code = 'OCR_FAILED';
                parseErr.provider = OcrProviderName.QWEN_OCR;
                // Do NOT include rawBody in the error.
                reject(normalizeOcrError(parseErr, 'OCR_FAILED'));
                return;
              }

              resolve(parsed);
            });
          });
        } catch (reqCreateError) {
          var createErr = new Error('Failed to create Qwen OCR API request.');
          createErr.code = 'OCR_FAILED';
          createErr.provider = OcrProviderName.QWEN_OCR;
          reject(normalizeOcrError(createErr, 'OCR_FAILED'));
          return;
        }

        req.on('error', function (netErr) {
          // Network errors: timeout, DNS failure, connection refused, etc.
          var mappedMessage = 'Qwen OCR API request failed: network error.';
          if (netErr.code === 'ECONNABORTED' || netErr.code === 'ETIMEDOUT') {
            mappedMessage = 'Qwen OCR API request timed out.';
          }

          var netMappedErr = new Error(mappedMessage);
          netMappedErr.code = 'OCR_FAILED';
          netMappedErr.provider = OcrProviderName.QWEN_OCR;
          // Do NOT include raw netErr or its stack in the normalized error.
          reject(normalizeOcrError(netMappedErr, 'OCR_FAILED'));
        });

        req.on('timeout', function () {
          req.destroy();
          var timeoutErr = new Error('Qwen OCR API request timed out.');
          timeoutErr.code = 'OCR_FAILED';
          timeoutErr.provider = OcrProviderName.QWEN_OCR;
          reject(normalizeOcrError(timeoutErr, 'OCR_FAILED'));
        });

        req.write(bodyJson);
        req.end();
      });
    };

    // Wrap with provider timeout guard.
    var label = OcrProviderName.QWEN_OCR + '_transport';
    return withProviderTimeout(operation, timeoutMs, label).catch(function (err) {
      // If withProviderTimeout itself rejects (e.g. PROVIDER_TIMEOUT),
      // re-map to OCR_FAILED for consistency.
      if (err && typeof err === 'object' && err.code === 'PROVIDER_TIMEOUT') {
        var mappedErr = new Error('Qwen OCR API request exceeded provider timeout.');
        mappedErr.code = 'OCR_FAILED';
        mappedErr.provider = OcrProviderName.QWEN_OCR;
        throw normalizeOcrError(mappedErr, 'OCR_FAILED');
      }
      throw err;
    });
  }

  return { transport: realTransport, error: null };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  createRealQwenTransport,
  validateTransportGates,
  DEFAULT_QWEN_MODEL,
  DEFAULT_QWEN_BASE_URL,
  DEFAULT_TIMEOUT_MS
};
