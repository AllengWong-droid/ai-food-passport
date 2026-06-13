/**
 * qwenAnalysisProvider.js
 *
 * Qwen Analysis Provider Adapter (Disabled by default; fake transport for tests)
 *
 * Purpose:
 *   Conform to the analysis provider contract. When properly configured via
 *   backend-only environment variables, this adapter can call the real
 *   Qwen analysis API. By default, it remains disabled and returns controlled
 *   errors if selected without proper configuration.
 *
 *   The adapter supports a fake transport / unit testing seam so that
 *   the normalization logic and contract conformance can be tested
 *   without any external network calls.
 *
 * Contract conformance:
 *   Every result returned by `analyzeMenuText` is passed through
 *   `normalizeAnalysisResult()` from the analysis provider contract before
 *   being returned. Every error is passed through `normalizeAnalysisError()`.
 *
 * Config env vars (all required to enable real transport):
 *   ANALYSIS_PROVIDER=qwen_analysis          // MUST be explicit
 *   QWEN_ANALYSIS_PROVIDER_ENABLED=true      // MUST be "true"
 *   QWEN_API_KEY=sk-...                      // MUST be present and non-placeholder
 *   QWEN_ANALYSIS_MODEL=qwen-max             // optional, defaults to qwen-max
 *   QWEN_ANALYSIS_BASE_URL=...               // optional, defaults to DashScope
 *
 * Test seam:
 *   analyzeMenuText({ requestBody, ocrResult }, { transport })
 *   - `transport`: function(requestBody) -> Promise<rawQwenResponse>
 *   - In unit tests, pass a fake transport created by
 *     `createFakeQwenAnalysisTransport(fakeResponse)`.
 *   - The fake transport never makes network calls.
 *   - The test seam takes precedence over real transport.
 *
 * Status:
 *   - realAnalysisEnabled: config-driven
 *   - Real transport: NOT implemented yet (future phase)
 *   - Fake transport tests: supported (offline)
 *   - All invariants: mock_ai remains default, Qwen analysis disabled by default
 *
 * Usage in tests:
 *
 *   const { createFakeQwenAnalysisTransport } = require('./qwenAnalysisProvider');
 *   const fakeTransport = createFakeQwenAnalysisTransport({
 *     output: {
 *       choices: [{ message: { content: '{"dishes":[...],"confidence":0.9}' } }]
 *     },
 *     usage: { total_tokens: 500 }
 *   });
 *   const result = await analyzeMenuText({ requestBody: {}, ocrResult: {} }, { transport: fakeTransport });
 *   // result conforms to analysis provider contract
 */

const {
  AnalysisProviderName,
  AnalysisProviderMode,
  AnalysisWarningCode
} = require('./analysisProviderTypes');
const {
  normalizeAnalysisResult,
  normalizeAnalysisError
} = require('./analysisProviderContract');
const {
  createDisabledAnalysisProviderError
} = require('./disabledAnalysisProviderError');

// ---------------------------------------------------------------------------
// Config validation
// ---------------------------------------------------------------------------

/**
 * Validate Qwen analysis configuration from environment variables.
 *
 * Rules:
 *   - QWEN_API_KEY must be absent or a valid-looking key (sk- prefix).
 *   - Missing key must not crash → returns { enabled: false, reason }.
 *   - Placeholder key must not crash → returns { enabled: false, reason }.
 *   - No key value is ever logged by this function.
 *   - Does not require real key for tests (tests use fake transport seam).
 *
 * @returns {object} { enabled: boolean, reason: string, model: string, baseUrl: string, keySource: string }
 */
function validateQwenAnalysisConfig() {
  var enabledFlag = (process.env.QWEN_ANALYSIS_PROVIDER_ENABLED || '').trim().toLowerCase();
  var apiKey = (process.env.QWEN_API_KEY || '').trim();
  var model = (process.env.QWEN_ANALYSIS_MODEL || 'qwen-max').trim();
  var baseUrl = (process.env.QWEN_ANALYSIS_BASE_URL || 'https://dashscope.aliyuncs.com').trim();

  if (enabledFlag !== 'true') {
    return {
      enabled: false,
      reason: 'QWEN_ANALYSIS_PROVIDER_ENABLED is not set to "true".',
      model: model,
      baseUrl: baseUrl,
      keySource: 'none'
    };
  }

  if (!apiKey) {
    return {
      enabled: false,
      reason: 'QWEN_API_KEY is not set.',
      model: model,
      baseUrl: baseUrl,
      keySource: 'missing'
    };
  }

  // Coarse placeholder detection — not cryptographically precise.
  // Flags commonly-used placeholder patterns so they don't accidentally
  // enable the provider in dev/staging.
  var lowerKey = apiKey.toLowerCase();
  if (
    lowerKey === 'sk-placeholder' ||
    lowerKey === 'sk-test' ||
    lowerKey === 'sk-dummy' ||
    lowerKey === 'sk-example' ||
    apiKey.length < 20
  ) {
    return {
      enabled: false,
      reason: 'QWEN_API_KEY appears to be a placeholder.',
      model: model,
      baseUrl: baseUrl,
      keySource: 'placeholder'
    };
  }

  return {
    enabled: true,
    reason: '',
    model: model,
    baseUrl: baseUrl,
    keySource: 'env'
  };
}

// ---------------------------------------------------------------------------
// Fake transport (test seam)
// ---------------------------------------------------------------------------

/**
 * Create a fake Qwen analysis transport for unit testing.
 *
 * The fake transport mimics the interface of a real Qwen analysis API client
 * without making any network calls. It returns a simulated Qwen-like
 * response that `normalizeQwenAnalysisResponse` can process.
 *
 * Usage:
 *
 *   const fakeTransport = createFakeQwenAnalysisTransport({
 *     output: {
 *       choices: [{
 *         message: {
 *           content: JSON.stringify({
 *             dishes: [...],
 *             confidence: 0.96,
 *             warnings: []
 *           })
 *         }
 *       }]
 *     },
 *     usage: { prompt_tokens: 200, completion_tokens: 300, total_tokens: 500 }
 *   });
 *   const result = await analyzeMenuText({ requestBody: {}, ocrResult: {} }, { transport: fakeTransport });
 *
 * @param {object} simulatedResult - Qwen-like analysis response to return
 * @param {{ shouldThrow: Error|null }} [options] - If set, transport throws
 * @returns {function(object): Promise<object>}
 */
function createFakeQwenAnalysisTransport(simulatedResult, options) {
  var shouldThrow = options && options.shouldThrow || null;

  return function fakeTransport(/* requestBody */) {
    if (shouldThrow) {
      throw shouldThrow;
    }

    // Build a Qwen analysis API-like response envelope.
    // The real Qwen analysis API returns a chat completion envelope.
    var envelope = {};

    if (simulatedResult && typeof simulatedResult === 'object') {
      // Use provided output/choices structure
      if (simulatedResult.output) {
        envelope.output = simulatedResult.output;
      } else {
        // Default empty
        envelope.output = {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  dishes: [],
                  confidence: 0,
                  warnings: ['ANALYSIS_EMPTY_RESULT']
                })
              }
            }
          ]
        };
      }

      envelope.usage = simulatedResult.usage || { total_tokens: 0 };

      // Attach analysis metadata for easier test reading
      if (simulatedResult.analysis_metadata) {
        envelope.analysis_metadata = simulatedResult.analysis_metadata;
      }
    } else {
      // Default empty response
      envelope.output = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                dishes: [],
                confidence: 0,
                warnings: ['ANALYSIS_EMPTY_RESULT']
              })
            }
          }
        ]
      };
      envelope.usage = { total_tokens: 0 };
    }

    return Promise.resolve(envelope);
  };
}

// ---------------------------------------------------------------------------
// Qwen response normalization
// ---------------------------------------------------------------------------

/**
 * Normalize a raw Qwen analysis API response into the analysis provider contract shape.
 *
 * Qwen analysis API response structure:
 *   {
 *     output: {
 *       choices: [{
 *         message: {
 *           content: '{"dishes": [...], "confidence": 0.96, "warnings": [...]}' // JSON string
 *         }
 *       }]
 *     },
 *     usage: { prompt_tokens: N, completion_tokens: N, total_tokens: N }
 *   }
 *
 * This function parses the JSON content, extracts the dishes/confidence/warnings,
 * and then passes it through `normalizeAnalysisResult()` to guarantee contract
 * conformance and leak prevention.
 *
 * @param {object} rawQwenResponse - Raw response from Qwen analysis API (or simulated)
 * @returns {object} Normalized analysis contract result (via normalizeAnalysisResult)
 */
function normalizeQwenAnalysisResponse(rawQwenResponse) {
  // Guard: null / undefined / non-object input → safe empty result.
  if (!rawQwenResponse || typeof rawQwenResponse !== 'object' || Array.isArray(rawQwenResponse)) {
    return normalizeAnalysisResult({
      provider: AnalysisProviderName.QWEN_ANALYSIS,
      mode: AnalysisProviderMode.ANALYSIS,
      dishes: [],
      confidence: 0,
      warnings: [AnalysisWarningCode.EMPTY_RESULT],
      rawMetadata: null
    });
  }

  var dishes = [];
  var confidence = 0;
  var warnings = [];
  var usage = rawQwenResponse.usage || null;

  try {
    // Extract content from Qwen analysis response structure.
    var content = rawQwenResponse &&
                  rawQwenResponse.output &&
                  rawQwenResponse.output.choices &&
                  rawQwenResponse.output.choices[0] &&
                  rawQwenResponse.output.choices[0].message &&
                  rawQwenResponse.output.choices[0].message.content;

    var parsed = null;

    if (typeof content === 'string') {
      try {
        parsed = JSON.parse(content);
      } catch (parseErr) {
        // Content is not valid JSON — treat as malformed response.
        return normalizeAnalysisResult({
          provider: AnalysisProviderName.QWEN_ANALYSIS,
          mode: AnalysisProviderMode.ANALYSIS,
          dishes: [],
          confidence: 0,
          warnings: [AnalysisWarningCode.EMPTY_RESULT],
          rawMetadata: null
        });
      }
    } else if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
      parsed = content;
    }

    if (parsed && typeof parsed === 'object') {
      dishes = Array.isArray(parsed.dishes) ? parsed.dishes : [];
      confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0;

      if (Array.isArray(parsed.warnings)) {
        for (var i = 0; i < parsed.warnings.length; i++) {
          if (typeof parsed.warnings[i] === 'string') {
            warnings.push(parsed.warnings[i]);
          }
        }
      }

      // Normalize each dish: Qwen/real providers may send flat price fields
      // (localPrice, localCurrency, etc.) at the dish level, but the contract
      // expects them nested under priceIntelligence. Restructure before
      // passing to normalizeAnalysisResult.
      dishes = dishes.map(function (rawDish) {
        if (!rawDish || typeof rawDish !== 'object') return rawDish;

        // If priceIntelligence already exists, use it as-is.
        if (rawDish.priceIntelligence && typeof rawDish.priceIntelligence === 'object') {
          return rawDish;
        }

        // Build priceIntelligence from flat dish fields.
        var pi = {};
        var hasPi = false;

        if (rawDish.localPrice !== undefined) { pi.localPrice = rawDish.localPrice; hasPi = true; }
        if (rawDish.localCurrency !== undefined && typeof rawDish.localCurrency === 'string') { pi.localCurrency = rawDish.localCurrency; hasPi = true; }
        if (rawDish.homePrice !== undefined) { pi.homePrice = rawDish.homePrice; hasPi = true; }
        if (rawDish.homeCurrency !== undefined && typeof rawDish.homeCurrency === 'string') { pi.homeCurrency = rawDish.homeCurrency; hasPi = true; }
        if (rawDish.exchangeRate !== undefined && typeof rawDish.exchangeRate === 'number') { pi.exchangeRate = rawDish.exchangeRate; hasPi = true; }
        if (rawDish.assessment !== undefined && typeof rawDish.assessment === 'string') { pi.assessment = rawDish.assessment; hasPi = true; }

        if (hasPi) {
          rawDish.priceIntelligence = pi;
        }

        return rawDish;
      });

      // Attach dish-level data from parsed content
      // Some providers send localCurrency/homeCurrency/exchangeRate at root level
      // so we pass them through to individual dishes if not already set.
      if (parsed.localCurrency) {
        for (var d = 0; d < dishes.length; d++) {
          if (dishes[d] && typeof dishes[d] === 'object') {
            var dishPi2 = dishes[d].priceIntelligence;
            if (dishPi2 && !dishPi2.localCurrency && typeof parsed.localCurrency === 'string') {
              dishPi2.localCurrency = parsed.localCurrency;
            }
            if (dishPi2 && !dishPi2.homeCurrency && typeof parsed.homeCurrency === 'string') {
              dishPi2.homeCurrency = parsed.homeCurrency;
            }
            if (dishPi2 && !dishPi2.exchangeRate && typeof parsed.exchangeRate === 'number') {
              dishPi2.exchangeRate = parsed.exchangeRate;
            }
          }
        }
      }
    }
  } catch (parseError) {
    // If we can't parse the Qwen response structure, treat as empty result.
    dishes = [];
    confidence = 0;
    warnings = [AnalysisWarningCode.EMPTY_RESULT];
  }

  // Attach warnings based on content state.
  if (dishes.length === 0) {
    // Add EMPTY_RESULT if not already present.
    var hasEmpty = false;
    for (var w = 0; w < warnings.length; w++) {
      if (warnings[w] === AnalysisWarningCode.EMPTY_RESULT) {
        hasEmpty = true;
        break;
      }
    }
    if (!hasEmpty) {
      warnings.push(AnalysisWarningCode.EMPTY_RESULT);
    }
  }

  // Safe rawMetadata: only whitelisted usage fields.
  var rawMetadata = null;
  if (usage && typeof usage === 'object') {
    var metaEntries = {};
    var hasMeta = false;

    if (typeof usage.total_tokens === 'number' && Number.isFinite(usage.total_tokens) && usage.total_tokens >= 0) {
      metaEntries.totalTokens = usage.total_tokens;
      hasMeta = true;
    }
    if (typeof usage.prompt_tokens === 'number' && Number.isFinite(usage.prompt_tokens) && usage.prompt_tokens >= 0) {
      metaEntries.promptTokens = usage.prompt_tokens;
      hasMeta = true;
    }
    if (typeof usage.completion_tokens === 'number' && Number.isFinite(usage.completion_tokens) && usage.completion_tokens >= 0) {
      metaEntries.completionTokens = usage.completion_tokens;
      hasMeta = true;
    }

    if (hasMeta) {
      rawMetadata = metaEntries;
    }
  }

  // Build the raw result then normalize through the contract.
  var rawResult = {
    provider: AnalysisProviderName.QWEN_ANALYSIS,
    mode: AnalysisProviderMode.ANALYSIS,
    confidence: confidence,
    dishes: dishes,
    warnings: warnings,
    rawMetadata: rawMetadata
  };

  return normalizeAnalysisResult(rawResult);
}

// ---------------------------------------------------------------------------
// Main analyzeMenuText function
// ---------------------------------------------------------------------------

/**
 * Analyze menu text using Qwen analysis.
 *
 * This function conforms to the analysis provider contract. It returns a
 * normalized result (via `normalizeAnalysisResult`) or throws a normalized
 * error (via `normalizeAnalysisError`).
 *
 * For Phase 12F, the adapter remains disabled by default.
 * - Without a transport: throws ANALYSIS_PROVIDER_NOT_CONFIGURED.
 * - With a fake transport (test seam): processes the fake response.
 * - Real API call: NOT implemented yet (future phase).
 *
 * @param {object} params
 * @param {object} params.requestBody - Client request body
 * @param {object} params.ocrResult - OCR result from previous step (optional)
 * @param {{ transport: function }} [options] - Optional transport (test seam)
 * @returns {Promise<object>} Normalized analysis contract result
 */
async function analyzeMenuText(params, options) {
  var transport = options && options.transport || null;
  var requestBody = (params && params.requestBody) || {};
  var ocrResult = (params && params.ocrResult) || {};

  // If a transport is provided (test seam), use it regardless of config.
  // This allows unit tests to exercise the full normalization path
  // without any external network calls or real API keys.
  if (transport) {
    try {
      // Build a Qwen analysis API-like request body.
      // In the real implementation, this would be the actual request to
      // the Qwen analysis API. For now, the transport receives a representative
      // request body so that the test seam mimics the real interface.
      var menuText = ocrResult.text || '';
      var userHomeCurrency = requestBody.userHomeCurrency || 'EUR';
      var localCurrency = (requestBody.scan && requestBody.scan.localCurrency) || 'JPY';

      var analysisRequestBody = {
        model: (process.env.QWEN_ANALYSIS_MODEL || 'qwen-max').trim(),
        input: {
          messages: [
            {
              role: 'system',
              content: 'You are a restaurant menu analysis expert. Analyze the given menu text and return a JSON object with dish recommendations, confidence scores, and warnings.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this menu text: ' + menuText + ' User currency: ' + userHomeCurrency + ' Local currency: ' + localCurrency
                }
              ]
            }
          ]
        }
      };

      var rawResponse = await transport(analysisRequestBody);
      return normalizeQwenAnalysisResponse(rawResponse);
    } catch (error) {
      throw normalizeAnalysisError(error, 'ANALYSIS_FAILED');
    }
  }

  // No transport provided → this is the production path.
  // First, validate Qwen analysis configuration.
  var config = validateQwenAnalysisConfig();

  if (!config.enabled) {
    throw createDisabledAnalysisProviderError(AnalysisProviderName.QWEN_ANALYSIS);
  }

  // Config is valid — real transport is NOT implemented yet (future phase).
  // Return controlled error to indicate this.
  throw createDisabledAnalysisProviderError(AnalysisProviderName.QWEN_ANALYSIS);
}

// ---------------------------------------------------------------------------
// realAnalysisEnabled — config-driven
// ---------------------------------------------------------------------------

/**
 * Determine whether the real Qwen analysis provider is currently enabled.
 * This is config-driven: it reads env vars to decide.
 *
 * Returns true ONLY when ALL gates are satisfied:
 *   ANALYSIS_PROVIDER=qwen_analysis
 *   QWEN_ANALYSIS_PROVIDER_ENABLED=true
 *   QWEN_API_KEY present and non-placeholder
 *
 * In all other cases (including default mock mode), returns false.
 *
 * @returns {boolean}
 */
function checkRealAnalysisEnabled() {
  var analysisProvider = (process.env.ANALYSIS_PROVIDER || '').trim();
  if (analysisProvider !== AnalysisProviderName.QWEN_ANALYSIS) {
    return false;
  }
  var config = validateQwenAnalysisConfig();
  return config.enabled === true;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  providerName: AnalysisProviderName.QWEN_ANALYSIS,
  get realAnalysisEnabled() { return checkRealAnalysisEnabled(); },
  analyzeMenuText,
  validateQwenAnalysisConfig,
  createFakeQwenAnalysisTransport,
  normalizeQwenAnalysisResponse
};
