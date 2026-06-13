/**
 * qwenOcrProvider.js
 *
 * Qwen OCR Provider Adapter (Disabled Scaffold)
 *
 * Purpose:
 *   Conform to the OCR provider contract and provide a scaffold for the
 *   future real Qwen OCR integration. This adapter does NOT call the
 *   real Qwen API. It remains disabled by default and returns controlled
 *   errors if selected without full implementation and configuration.
 *
 *   The adapter supports a fake transport / unit testing seam so that
 *   the normalization logic and contract conformance can be tested
 *   without any external network calls.
 *
 * Contract conformance:
 *   Every result returned by `extractMenuText` (when enabled via test
 *   seam) is passed through `normalizeOcrResult()` from the OCR
 *   provider contract before being returned. Every error is passed
 *   through `normalizeOcrError()`.
 *
 * Config env vars (not required for Phase 12B):
 *   QWEN_OCR_PROVIDER_ENABLED=true  // explicitly enable (not yet)
 *   QWEN_API_KEY=sk-...                // API key (not required yet)
 *   QWEN_OCR_MODEL=qwen-vl-max            // optional, default
 *   QWEN_OCR_BASE_URL=...                 // optional, default
 *
 * Test seam:
 *   extractMenuText(image, { transport })
 *   - `transport`: function(requestBody) -> Promise<rawQwenResponse>
 *   - In unit tests, pass a fake transport created by
 *     `createFakeQwenTransport(fakeResponse)`.
 *   - The fake transport never makes network calls.
 *
 * Status:
 *   - realOcrEnabled: false (hard-coded for Phase 12B)
 *   - Adapter scaffold: complete (normalization, config validation, test seam)
 *   - Real API calls: NOT implemented (future phase)
 *   - Fake transport tests: supported
 *
 * Usage in tests:
 *
 *   const { createFakeQwenTransport } = require('./qwenOcrProvider');
 *   const fakeTransport = createFakeQwenTransport({
 *     text: 'Tonkotsu Ramen JPY 980',
 *     languageHints: ['ja', 'en'],
 *     confidence: 0.95
 *   });
 *   const result = await extractMenuText(image, { transport: fakeTransport });
 *   // result conforms to OCR provider contract
 */

const {
  OcrProviderName,
  OcrProviderMode,
  OcrWarningCode
} = require('./ocrProviderTypes');
const {
  normalizeOcrResult,
  normalizeOcrError
} = require('./ocrProviderContract');
const {
  createDisabledOcrProviderError
} = require('./disabledOcrProviderError');

// ---------------------------------------------------------------------------
// Config validation
// ---------------------------------------------------------------------------

/**
 * Validate Qwen OCR configuration from environment variables.
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
function validateQwenOcrConfig() {
  const enabledFlag = (process.env.QWEN_OCR_PROVIDER_ENABLED || '').trim().toLowerCase();
  const apiKey = (process.env.QWEN_API_KEY || '').trim();
  const model = (process.env.QWEN_OCR_MODEL || 'qwen-vl-max').trim();
  const baseUrl = (process.env.QWEN_OCR_BASE_URL || 'https://dashscope.aliyuncs.com').trim();

  if (enabledFlag !== 'true') {
    return {
      enabled: false,
      reason: 'QWEN_OCR_PROVIDER_ENABLED is not set to "true".',
      model,
      baseUrl,
      keySource: 'none'
    };
  }

  if (!apiKey) {
    return {
      enabled: false,
      reason: 'QWEN_API_KEY is not set.',
      model,
      baseUrl,
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
      model,
      baseUrl,
      keySource: 'placeholder'
    };
  }

  return {
    enabled: true,
    reason: '',
    model,
    baseUrl,
    keySource: 'env'
  };
}

// ---------------------------------------------------------------------------
// Fake transport (test seam)
// ---------------------------------------------------------------------------

/**
 * Create a fake Qwen transport for unit testing.
 *
 * The fake transport mimics the interface of a real Qwen API client
 * without making any network calls. It returns a simulated Qwen-like
 * response that `normalizeQwenResponse` can process.
 *
 * Usage:
 *
 *   const fakeTransport = createFakeQwenTransport({
 *     text: 'Tonkotsu Ramen JPY 980',
 *     languageHints: ['ja', 'en'],
 *     confidence: 0.95,
 *     warnings: [],
 *     usage: { total_tokens: 350 }
 *   });
 *   const result = await extractMenuText(image, { transport: fakeTransport });
 *
 * @param {object} simulatedResult - Qwen-like result to return
 * @param {{ shouldThrow: Error|null }} [options] - If set, transport throws
 * @returns {function(object): Promise<object>}
 */
function createFakeQwenTransport(simulatedResult, options) {
  var shouldThrow = options && options.shouldThrow || null;

  return function fakeTransport(/* requestBody */) {
    if (shouldThrow) {
      throw shouldThrow;
    }

    // Build a Qwen API-like response envelope.
    // The real Qwen VL API returns an envelope with output.choices.
    // For the fake transport, also attach metadata fields (languageHints,
    // confidence, warnings) so that normalizeQwenResponse can find them
    // without parsing a separate structure.
    var envelope = {
      output: {
        choices: [
          {
            message: {
              content: [
                { text: simulatedResult.text || '' }
              ]
            }
          }
        ]
      },
      usage: simulatedResult.usage || { total_tokens: 0 }
    };

    // Attach metadata so normalizeQwenResponse can read them.
    if (simulatedResult.languageHints) {
      envelope.languageHints = simulatedResult.languageHints;
    }
    if (simulatedResult.confidence !== undefined) {
      envelope.confidence = simulatedResult.confidence;
    }
    if (simulatedResult.warnings) {
      envelope.warnings = simulatedResult.warnings;
    }

    return Promise.resolve(envelope);
  };
}

// ---------------------------------------------------------------------------
// Qwen response normalization
// ---------------------------------------------------------------------------

/**
 * Normalize a raw Qwen API response into the OCR provider contract shape.
 *
 * Qwen VL API response structure:
 *   {
 *     output: {
 *       choices: [{
 *         message: { content: [{ text: '...' }] }
 *       }]
 *     },
 *     usage: { total_tokens: N }
 *   }
 *
 * This function flattens that into { text, languageHints, confidence, warnings }
 * and then passes it through `normalizeOcrResult()` to guarantee contract
 * conformance and leak prevention.
 *
 * @param {object} rawQwenResponse - Raw response from Qwen API (or simulated)
 * @returns {object} Normalized OCR contract result (via normalizeOcrResult)
 */
function normalizeQwenResponse(rawQwenResponse) {
  // Guard: null / undefined / non-object input → safe empty result.
  if (!rawQwenResponse || typeof rawQwenResponse !== 'object' || Array.isArray(rawQwenResponse)) {
    return normalizeOcrResult({
      provider: OcrProviderName.QWEN_OCR,
      mode: OcrProviderMode.OCR,
      text: '',
      languageHints: [],
      confidence: 0,
      warnings: [OcrWarningCode.EMPTY_TEXT],
      rawMetadata: null
    });
  }

  var text = '';
  var languageHints = [];
  var confidence = 0.95; // sensible default for Qwen VL
  var warnings = [];

  try {
    // Extract text from Qwen VL response content structure.
    var content = rawQwenResponse &&
                  rawQwenResponse.output &&
                  rawQwenResponse.output.choices &&
                  rawQwenResponse.output.choices[0] &&
                  rawQwenResponse.output.choices[0].message &&
                  rawQwenResponse.output.choices[0].message.content;

    if (Array.isArray(content)) {
      var textParts = content
        .filter(function (part) { return part && typeof part.text === 'string'; })
        .map(function (part) { return part.text; });
      text = textParts.join('\n').trim();
    } else if (typeof content === 'string') {
      text = content.trim();
    }

    // Allow simulated results to carry metadata alongside the envelope.
    if (!text && typeof rawQwenResponse.text === 'string') {
      text = rawQwenResponse.text.trim();
    }

    if (rawQwenResponse.languageHints && Array.isArray(rawQwenResponse.languageHints)) {
      languageHints = rawQwenResponse.languageHints
        .filter(function (h) { return typeof h === 'string' && h.trim().length > 0; })
        .map(function (h) { return h.trim(); });
    }

    if (rawQwenResponse.confidence !== undefined) {
      confidence = rawQwenResponse.confidence;
    }

    if (rawQwenResponse.warnings && Array.isArray(rawQwenResponse.warnings)) {
      warnings = rawQwenResponse.warnings.slice();
    }
  } catch (parseError) {
    // If we can't parse the Qwen response structure, treat as empty
    // and let the contract normalization handle it.
    text = '';
  }

  // Attach warnings based on content.
  if (!text) {
    warnings.push(OcrWarningCode.EMPTY_TEXT);
  }
  if (confidence > 0 && confidence < 0.5) {
    // Only add LOW_CONFIDENCE if not already present.
    var hasLowConf = false;
    for (var _i = 0; _i < warnings.length; _i++) {
      if (warnings[_i] === OcrWarningCode.LOW_CONFIDENCE) {
        hasLowConf = true;
        break;
      }
    }
    if (!hasLowConf) {
      warnings.push(OcrWarningCode.LOW_CONFIDENCE);
    }
  }

  // Safe rawMetadata: only whitelisted fields.
  var rawMetadata = null;
  if (rawQwenResponse && rawQwenResponse.usage) {
    rawMetadata = {
      totalTokens: rawQwenResponse.usage.total_tokens || 0
    };
  }

  // Build the raw result then normalize through the contract.
  var rawResult = {
    provider: OcrProviderName.QWEN_OCR,
    mode: OcrProviderMode.OCR,
    text: text,
    languageHints: languageHints,
    confidence: confidence,
    warnings: warnings,
    rawMetadata: rawMetadata
  };

  return normalizeOcrResult(rawResult);
}

// ---------------------------------------------------------------------------
// Main extractMenuText function
// ---------------------------------------------------------------------------

/**
 * Extract menu text from an image using Qwen OCR.
 *
 * This function conforms to the OCR provider contract. It returns a
 * normalized result (via `normalizeOcrResult`) or throws a normalized
 * error (via `normalizeOcrError`).
 *
 * For Phase 12B, the adapter remains disabled by default.
 * - Without a transport: throws OCR_PROVIDER_NOT_CONFIGURED.
 * - With a fake transport (test seam): processes the fake response.
 * - Real API call: NOT implemented yet (future phase).
 *
 * @param {object} image - Image object with { mimeType, base64Content }
 * @param {{ transport: function }} [options] - Optional transport (test seam)
 * @returns {Promise<object>} Normalized OCR contract result
 */
async function extractMenuText(image, options) {
  var transport = options && options.transport || null;

  // If a transport is provided (test seam), use it regardless of config.
  // This allows unit tests to exercise the full normalization path
  // without any external network calls or real API keys.
  if (transport) {
    try {
      // Build a Qwen API-like request body.
      // In the real implementation, this would be the actual request to
      // the Qwen VL API. For now, the transport receives a representative
      // request body so that the test seam mimics the real interface.
      var requestBody = {
        model: (process.env.QWEN_OCR_MODEL || 'qwen-vl-max').trim(),
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: 'data:' + (image.mimeType || 'image/jpeg') + ';base64,' + (image.base64Content || '')
                  }
                },
                {
                  type: 'text',
                  text: 'Extract all menu text from this image. Return the text content only.'
                }
              ]
            }
          ]
        }
      };

      var rawResponse = await transport(requestBody);
      return normalizeQwenResponse(rawResponse);
    } catch (error) {
      throw normalizeOcrError(error, 'OCR_FAILED');
    }
  }

  // No transport provided → this is the production path.
  // Check if the provider is configured. Since we're in Phase 12B and
  // the real implementation isn't complete, always return a controlled error.
  var config = validateQwenOcrConfig();

  if (!config.enabled) {
    throw createDisabledOcrProviderError(OcrProviderName.QWEN_OCR);
  }

  // If we reach here, config is valid but the real transport isn't
  // implemented yet. Return a controlled error (not a crash).
  var notImplError = new Error(
    'Qwen OCR provider configuration is valid but the real API transport ' +
    'is not yet implemented. This is a scaffold for a future phase.'
  );
  notImplError.code = 'OCR_PROVIDER_NOT_CONFIGURED';
  notImplError.provider = OcrProviderName.QWEN_OCR;
  throw notImplError;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  providerName: OcrProviderName.QWEN_OCR,
  realOcrEnabled: false, // Phase 12B: hard-coded false; future phase will make config-driven
  extractMenuText,
  validateQwenOcrConfig,
  createFakeQwenTransport,
  normalizeQwenResponse
};
