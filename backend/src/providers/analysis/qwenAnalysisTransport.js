/**
 * qwenAnalysisTransport.js
 *
 * Real Qwen Analysis Transport — backend-only, behind explicit safety gates.
 *
 * Purpose:
 *   Provide a real HTTPS transport function that calls the Qwen analysis API
 *   to analyze menu text and return dish recommendations. This transport is
 *   NEVER active by default. It requires ALL of the following env gates to pass:
 *
 *     ANALYSIS_PROVIDER=qwen_analysis
 *     QWEN_ANALYSIS_PROVIDER_ENABLED=true
 *     QWEN_API_KEY must be present and non-placeholder
 *     QWEN_ANALYSIS_MODEL must be present (or safe default: qwen-max)
 *     QWEN_ANALYSIS_BASE_URL must be present (or safe default: dashscope)
 *
 *   If any required condition is missing, the transport creation returns a
 *   controlled ANALYSIS_PROVIDER_NOT_CONFIGURED error instead of a transport
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
 *   - Raw prompt text is NEVER included in error messages or logs.
 *   - Provider key material stays in backend only — never exposed to Flutter.
 *   - Automated tests stub https.request to stay 100% offline.
 *
 * Usage (manual, with .env configured):
 *
 *   const { createRealQwenAnalysisTransport } = require('./qwenAnalysisTransport');
 *   const result = createRealQwenAnalysisTransport();
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
  validateQwenAnalysisConfig
} = require('./qwenAnalysisProvider');
const {
  AnalysisProviderName
} = require('./analysisProviderTypes');
const {
  normalizeAnalysisError
} = require('./analysisProviderContract');
const {
  getProviderSafetyConfig
} = require('../../config/providerSafetyConfig');
const {
  withProviderTimeout
} = require('../safety/providerSafetyGuards');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default Qwen analysis model. Override with QWEN_ANALYSIS_MODEL env var. */
const DEFAULT_QWEN_ANALYSIS_MODEL = 'qwen-max';

/** Default Qwen analysis API base URL (DashScope compatible-mode endpoint). */
const DEFAULT_QWEN_ANALYSIS_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

/** Default request timeout in milliseconds when PROVIDER_TIMEOUT_MS is unset. */
const DEFAULT_TIMEOUT_MS = 15000;

// ---------------------------------------------------------------------------
// Gate validation (transport-specific — separate from adapter config)
// ---------------------------------------------------------------------------

/**
 * Validate all required env gates for creating a real Qwen analysis transport.
 *
 * This is MORE strict than validateQwenAnalysisConfig() from the adapter:
 * in addition to checking QWEN_ANALYSIS_PROVIDER_ENABLED and QWEN_API_KEY,
 * it also requires ANALYSIS_PROVIDER to be set to 'qwen_analysis'.
 *
 * @returns {{ ok: boolean, error: Error|null, config: object }}
 */
function validateAnalysisTransportGates() {
  // Gate 1: ANALYSIS_PROVIDER must be explicitly set to qwen_analysis.
  var analysisProvider = (process.env.ANALYSIS_PROVIDER || '').trim();
  if (analysisProvider !== AnalysisProviderName.QWEN_ANALYSIS) {
    var err = new Error(
      'ANALYSIS_PROVIDER is not set to "qwen_analysis". The Qwen analysis transport ' +
      'requires ANALYSIS_PROVIDER=qwen_analysis in addition to Qwen-specific env vars.'
    );
    err.code = 'ANALYSIS_PROVIDER_NOT_CONFIGURED';
    err.provider = AnalysisProviderName.QWEN_ANALYSIS;
    return { ok: false, error: normalizeAnalysisError(err, 'ANALYSIS_PROVIDER_NOT_CONFIGURED'), config: null };
  }

  // Gate 2: Qwen analysis config (enabled flag, API key, model, base URL).
  var qwenConfig = validateQwenAnalysisConfig();

  if (!qwenConfig.enabled) {
    var configErr = new Error('Qwen analysis transport is not available: ' + qwenConfig.reason);
    configErr.code = 'ANALYSIS_PROVIDER_NOT_CONFIGURED';
    configErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
    return { ok: false, error: normalizeAnalysisError(configErr, 'ANALYSIS_PROVIDER_NOT_CONFIGURED'), config: null };
  }

  // Gate 3: Model must be present (or use safe default).
  var model = qwenConfig.model || DEFAULT_QWEN_ANALYSIS_MODEL;

  // Gate 4: Base URL must be present (or use safe default).
  var baseUrl = qwenConfig.baseUrl || DEFAULT_QWEN_ANALYSIS_BASE_URL;

  // After config validation passes, read the API key directly from env.
  // validateQwenAnalysisConfig() does NOT return the key value for security.
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
 * Create the real Qwen analysis transport function.
 *
 * This is the main entry point. It validates all env gates and returns
 * either a transport function or a controlled error.
 *
 * The returned transport function:
 *   - Makes a real HTTPS POST to the Qwen analysis API
 *   - Is wrapped in withProviderTimeout for safety
 *   - Parses and returns the raw Qwen JSON response
 *   - Maps all failures to safe, normalized errors
 *
 * @param {object} [options]
 * @param {Function} [options.httpsRequest] - Dependency injection for tests
 * @returns {{ transport: Function|null, error: Error|null }}
 */
function createRealQwenAnalysisTransport(options) {
  var opts = options || {};
  var injectedRequest = opts.httpsRequest || null;

  var gateResult = validateAnalysisTransportGates();
  if (!gateResult.ok) {
    return { transport: null, error: gateResult.error };
  }

  var config = gateResult.config;
  var safetyConfig = getProviderSafetyConfig();
  var timeoutMs = safetyConfig.providerTimeoutMs || DEFAULT_TIMEOUT_MS;

  /**
   * Real Qwen analysis transport function.
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
          var urlErr = new Error('Invalid QWEN_ANALYSIS_BASE_URL: ' + urlError.message);
          urlErr.code = 'ANALYSIS_FAILED';
          urlErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
          reject(normalizeAnalysisError(urlErr, 'ANALYSIS_FAILED'));
          return;
        }

        var bodyJson;
        try {
          bodyJson = JSON.stringify(requestBody);
        } catch (stringifyError) {
          var stringifyErr = new Error('Failed to serialise Qwen analysis request body.');
          stringifyErr.code = 'ANALYSIS_FAILED';
          stringifyErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
          reject(normalizeAnalysisError(stringifyErr, 'ANALYSIS_FAILED'));
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
                  'Qwen analysis API returned HTTP ' + res.statusCode + '.'
                );
                statusErr.code = 'ANALYSIS_FAILED';
                statusErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
                // Do NOT include rawBody, headers, or res in the error.
                reject(normalizeAnalysisError(statusErr, 'ANALYSIS_FAILED'));
                return;
              }

              // Parse the JSON body.
              var parsed;
              try {
                parsed = JSON.parse(rawBody);
              } catch (parseError) {
                var parseErr = new Error('Qwen analysis API returned malformed JSON response.');
                parseErr.code = 'ANALYSIS_FAILED';
                parseErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
                // Do NOT include rawBody in the error.
                reject(normalizeAnalysisError(parseErr, 'ANALYSIS_FAILED'));
                return;
              }

              resolve(parsed);
            });
          });
        } catch (reqCreateError) {
          var createErr = new Error('Failed to create Qwen analysis API request.');
          createErr.code = 'ANALYSIS_FAILED';
          createErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
          reject(normalizeAnalysisError(createErr, 'ANALYSIS_FAILED'));
          return;
        }

        req.on('error', function (netErr) {
          // Network errors: timeout, DNS failure, connection refused, etc.
          var mappedMessage = 'Qwen analysis API request failed: network error.';
          if (netErr.code === 'ECONNABORTED' || netErr.code === 'ETIMEDOUT') {
            mappedMessage = 'Qwen analysis API request timed out.';
          }

          var netMappedErr = new Error(mappedMessage);
          netMappedErr.code = 'ANALYSIS_FAILED';
          netMappedErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
          // Do NOT include raw netErr or its stack in the normalized error.
          reject(normalizeAnalysisError(netMappedErr, 'ANALYSIS_FAILED'));
        });

        req.on('timeout', function () {
          req.destroy();
          var timeoutErr = new Error('Qwen analysis API request timed out.');
          timeoutErr.code = 'ANALYSIS_FAILED';
          timeoutErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
          reject(normalizeAnalysisError(timeoutErr, 'ANALYSIS_FAILED'));
        });

        req.write(bodyJson);
        req.end();
      });
    };

    // Wrap with provider timeout guard.
    var label = AnalysisProviderName.QWEN_ANALYSIS + '_transport';
    return withProviderTimeout(operation, timeoutMs, label).catch(function (err) {
      // If withProviderTimeout itself rejects (e.g. PROVIDER_TIMEOUT),
      // re-map to ANALYSIS_FAILED for consistency.
      if (err && typeof err === 'object' && err.code === 'PROVIDER_TIMEOUT') {
        var mappedErr = new Error('Qwen analysis API request exceeded provider timeout.');
        mappedErr.code = 'ANALYSIS_FAILED';
        mappedErr.provider = AnalysisProviderName.QWEN_ANALYSIS;
        throw normalizeAnalysisError(mappedErr, 'ANALYSIS_FAILED');
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
  createRealQwenAnalysisTransport,
  validateAnalysisTransportGates,
  DEFAULT_QWEN_ANALYSIS_MODEL,
  DEFAULT_QWEN_ANALYSIS_BASE_URL,
  DEFAULT_TIMEOUT_MS
};
