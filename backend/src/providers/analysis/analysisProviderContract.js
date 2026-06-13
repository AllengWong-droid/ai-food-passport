/**
 * analysisProviderContract.js
 *
 * Analysis Provider Contract for AI Food Passport backend.
 *
 * Purpose:
 *   Define the stable contract that every analysis provider (mock or real) MUST
 *   conform to. This contract gives future real providers a single target
 *   shape and guarantees that the analyzeMenu route, the Flutter parser, and
 *   all downstream code receive a predictable, safe result object.
 *
 *   Normalization helpers sanitise raw provider output before it reaches
 *   any user-facing API response. No raw provider internals, stack traces,
 *   API headers, raw prompts, raw OCR image payloads, or secrets can leak
 *   past this boundary.
 *
 * Contract shape (AnalysisContractResult):
 *
 *   {
 *     provider: string,        // Known AnalysisProviderName value
 *     mode: string,            // Provider mode (e.g. 'mock', 'analysis')
 *     confidence: number,      // 0–1, clamped
 *     dishes: Dish[],          // Normalized dishes (compatible with mock shape)
 *     warnings: string[],      // Known AnalysisWarningCode values
 *     rawMetadata: object|null // Safe, redacted metadata only (optional)
 *   }
 *
 * Normalized Dish shape:
 *
 *   {
 *     // New contract-standardized fields:
 *     id: string,              // Stable generated id from dish name
 *     name: string,            // Dish name (same as dishName)
 *     originalName: string|null, // Original untranslated name if available
 *     description: string,
 *     recommendationScore: number, // 0–100, clamped (from tasteScore)
 *     matchReasons: string[],      // Why this dish was recommended
 *     riskFlags: string[],         // Allergy/safety risk flags
 *     allergens: string[],         // Known allergens
 *     spiceLevel: string|null,     // 'mild' | 'medium' | 'hot' | null
 *     estimatedPrice: number,      // Local price
 *     currency: string,            // Local currency code
 *     valueRating: string,         // Price assessment
 *     safetyNotes: string[],       // Safety-related notes
 *     confidence: number,          // Per-dish confidence 0–1
 *
 *     // Backward-compatible mock fields (preserved for Flutter compatibility):
 *     dishName: string,
 *     ingredients: string[],
 *     tasteScore: number,          // 0–100
 *     safetyScore: number,         // 0–100
 *     valueScore: number,          // 0–100
 *     recommendationReason: string,
 *     priceIntelligence: {
 *       localPrice: number,
 *       localCurrency: string,
 *       homePrice: number,
 *       homeCurrency: string,
 *       exchangeRate: number,
 *       assessment: string
 *     }
 *   }
 *
 * Usage:
 *
 *   const { normalizeAnalysisResult, normalizeAnalysisError } =
 *     require('../providers/analysis/analysisProviderContract');
 *
 *   // Inside a real analysis provider adapter:
 *   const raw = await callRealAnalysisApi(menuText);
 *   const contractResult = normalizeAnalysisResult(raw);
 *   return contractResult;
 *
 *   // Inside a catch handler:
 *   try { ... }
 *   catch (e) {
 *     throw normalizeAnalysisError(e);
 *   }
 *
 * Rules:
 *   - Never include raw provider HTTP responses.
 *   - Never include stack traces.
 *   - Never include API keys, bearer tokens, or authorization headers.
 *   - Never include raw prompts, raw OCR text inputs, or raw OCR image payloads.
 *   - Never include raw provider prompt or completion payloads.
 *   - Confidence must be clamped to [0, 1].
 *   - Dish scores must be clamped to [0, 100].
 *   - Warnings must only contain known AnalysisWarningCode values.
 *   - rawMetadata is stripped of all unsafe fields; only a whitelist passes.
 */

const {
  AnalysisProviderName,
  AnalysisProviderMode,
  AnalysisWarningCode
} = require('./analysisProviderTypes');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** @type {number} Minimum allowed confidence (inclusive). */
const CONFIDENCE_MIN = 0;

/** @type {number} Maximum allowed confidence (inclusive). */
const CONFIDENCE_MAX = 1;

/** @type {number} Minimum allowed score (inclusive). */
const SCORE_MIN = 0;

/** @type {number} Maximum allowed score (inclusive). */
const SCORE_MAX = 100;

/** @type {number} Maximum allowed price to catch absurd values. */
const PRICE_MAX = 1000000;

/**
 * Safe rawMetadata field whitelist.
 * Only these keys may survive normalization. Everything else is dropped.
 */
const SAFE_METADATA_KEYS = new Set([
  'processingTimeMs',
  'modelVersion',
  'analysisEngine',
  'promptTokens',
  'completionTokens',
  'totalTokens',
  'requestId'
]);

/**
 * Fields that are categorically rejected from any part of the result.
 * These are checked on the raw input before normalization and stripped
 * entirely, regardless of where they appear.
 */
const FORBIDDEN_FIELDS = new Set([
  'stack',
  'stacktrace',
  'apikey',
  'authorization',
  'bearer',
  'token',
  'secret',
  'image',
  'imagebytes',
  'imagepayload',
  'base64',
  'rawimage',
  'menuimage',
  'providerrawresponse',
  'providerrawerror',
  'rawhttpresponse',
  'requestheaders',
  'responseheaders',
  'credentials',
  'rawprompt',
  'completionpayload',
  'rawcompletion',
  'systemprompt',
  'userprompt',
  'rawocrtext',
  'rawocrresult'
]);

/**
 * Known safe analysis error codes that may appear on an Error object and are
 * allowed through normalization unchanged.
 */
const KNOWN_ANALYSIS_ERROR_CODES = new Set([
  'ANALYSIS_FAILED',
  'ANALYSIS_PROVIDER_NOT_CONFIGURED',
  'ANALYSIS_PROVIDER_INVALID'
]);

/** Set of valid AnalysisProviderName values for fast lookup. */
const VALID_PROVIDER_NAMES = new Set(Object.values(AnalysisProviderName));

/** Set of valid AnalysisWarningCode values for fast lookup. */
const VALID_WARNING_CODES = new Set(Object.values(AnalysisWarningCode));

/** Set of valid spice level values. */
const VALID_SPICE_LEVELS = new Set(['mild', 'medium', 'hot']);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Normalize a raw analysis provider result into the AnalysisContractResult shape.
 *
 * Missing or invalid fields are replaced with safe defaults.
 * Confidence is clamped to [0, 1]. Dish scores are clamped to [0, 100].
 * Warnings are filtered to known codes and de-duplicated.
 * Forbidden fields (stack traces, secrets, raw provider responses, raw prompts,
 * raw OCR payloads) are stripped entirely.
 *
 * @param {object} [raw={}] - Raw result from an analysis provider.
 * @returns {object} Normalized AnalysisContractResult.
 */
function normalizeAnalysisResult(raw = {}) {
  var input = stripForbiddenFields(raw) || {};

  var provider = normalizeProvider(input.provider);
  var mode = normalizeMode(input.mode, provider);
  var confidence = clampConfidence(input.confidence);
  var dishes = normalizeDishes(input.dishes);
  var warnings = normalizeWarnings(input.warnings);
  var rawMetadata = normalizeRawMetadata(input.rawMetadata);

  return {
    provider: provider,
    mode: mode,
    confidence: confidence,
    dishes: dishes,
    warnings: warnings,
    rawMetadata: rawMetadata
  };
}

/**
 * Normalize an analysis provider error into a safe, contract-conformant Error.
 *
 * The returned Error carries ONLY a known-safe `code` and `message`.
 * Stack traces, raw provider responses, API headers, raw prompts, raw OCR
 * payloads, and secrets are unconditionally stripped.
 *
 * Provider info is preserved on `error.provider` if it is a valid
 * AnalysisProviderName value.
 *
 * @param {Error|object|*} error - The caught error.
 * @param {string} [fallbackCode='ANALYSIS_FAILED'] - Fallback code.
 * @returns {Error} A sanitised Error with only { code, message, provider }.
 */
function normalizeAnalysisError(error, fallbackCode) {
  if (fallbackCode === undefined) fallbackCode = 'ANALYSIS_FAILED';

  // Error objects have 'message' as an inherited property, not own.
  // We must read it explicitly before stripping fields.
  var rawMessage = '';
  var rawCode = undefined;
  var rawProvider = undefined;

  if (error && typeof error === 'object') {
    rawMessage = typeof error.message === 'string' ? error.message : '';
    rawCode = error.code;
    rawProvider = error.provider;
  }

  var stripped = stripForbiddenFields(error && typeof error === 'object' ? error : {});

  var code = resolveErrorCode(stripped.code || rawCode, fallbackCode);

  // Sanitise the message: use the raw error message but remove any
  // embedded API keys, JWTs, or base64 blobs.
  var message = sanitizeMessage(rawMessage);

  if (!message) {
    if (typeof stripped.message === 'string' && stripped.message.length > 0) {
      message = sanitizeMessage(stripped.message);
    }
  }
  if (!message) {
    message = 'Analysis provider encountered an error.';
  }

  var provider = normalizeProvider(stripped.provider || rawProvider);

  var safe = new Error(message);
  safe.code = code;
  if (provider && provider !== 'unknown_analysis') {
    safe.provider = provider;
  }

  // Delete stack trace so it cannot leak into API responses.
  delete safe.stack;

  return safe;
}

// ---------------------------------------------------------------------------
// Field normalizers
// ---------------------------------------------------------------------------

/**
 * Resolve the provider name to a known value or 'unknown_analysis'.
 * @param {*} value
 * @returns {string}
 */
function normalizeProvider(value) {
  if (typeof value === 'string' && VALID_PROVIDER_NAMES.has(value)) {
    return value;
  }
  return 'unknown_analysis';
}

/**
 * Resolve the provider mode. If missing, derive from the provider name
 * or default to 'analysis'.
 * @param {*} value
 * @param {string} provider
 * @returns {string}
 */
function normalizeMode(value, provider) {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  // Derive mode from provider when possible.
  if (provider === AnalysisProviderName.MOCK_AI) return AnalysisProviderMode.MOCK;
  // Future real providers will report 'analysis'.
  return 'analysis';
}

/**
 * Ensure value is a string. Non-strings become ''.
 * @param {*} value
 * @returns {string}
 */
function normalizeString(value) {
  if (typeof value === 'string') return value;
  return '';
}

/**
 * Ensure value is an array of clean strings. Non-array or non-string entries
 * are filtered out.
 * @param {*} value
 * @returns {string[]}
 */
function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    // Allow single string to become array (for recommendationReason -> matchReasons)
    if (typeof value === 'string' && value.trim().length > 0) {
      return [value.trim()];
    }
    return [];
  }
  return value
    .filter(function (item) { return typeof item === 'string' && item.trim().length > 0; })
    .map(function (item) { return item.trim(); });
}

/**
 * Clamp confidence to [CONFIDENCE_MIN, CONFIDENCE_MAX].
 * Non-numeric values become CONFIDENCE_MIN.
 * @param {*} value
 * @returns {number}
 */
function clampConfidence(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return CONFIDENCE_MIN;
  if (value < CONFIDENCE_MIN) return CONFIDENCE_MIN;
  if (value > CONFIDENCE_MAX) return CONFIDENCE_MAX;
  return value;
}

/**
 * Clamp score to [SCORE_MIN, SCORE_MAX].
 * Non-numeric values become the given default.
 * @param {*} value
 * @param {number} [defaultVal=0]
 * @returns {number}
 */
function clampScore(value, defaultVal) {
  if (defaultVal === undefined) defaultVal = 0;
  if (typeof value !== 'number' || Number.isNaN(value)) return defaultVal;
  if (value < SCORE_MIN) return SCORE_MIN;
  if (value > SCORE_MAX) return SCORE_MAX;
  return value;
}

/**
 * Clamp price to a reasonable range. Negative prices become 0.
 * Absurdly large prices (> PRICE_MAX) are clamped.
 * @param {*} value
 * @returns {number}
 */
function clampPrice(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > PRICE_MAX) return PRICE_MAX;
  return value;
}

/**
 * Normalize spice level to a known value or null.
 * @param {*} value
 * @returns {string|null}
 */
function normalizeSpiceLevel(value) {
  if (typeof value === 'string') {
    var trimmed = value.trim().toLowerCase();
    if (VALID_SPICE_LEVELS.has(trimmed)) return trimmed;
  }
  return null;
}

/**
 * Filter warnings to only include known AnalysisWarningCode values.
 * Duplicates are removed.
 * @param {*} value
 * @returns {string[]}
 */
function normalizeWarnings(value) {
  if (!Array.isArray(value)) return [];
  var seen = new Set();
  var result = [];
  for (var i = 0; i < value.length; i++) {
    var w = value[i];
    if (typeof w === 'string' && VALID_WARNING_CODES.has(w) && !seen.has(w)) {
      seen.add(w);
      result.push(w);
    }
  }
  return result;
}

/**
 * Normalize the dishes array. Each raw dish is passed through normalizeDish.
 * Non-array inputs become an empty array.
 * @param {*} value
 * @returns {object[]}
 */
function normalizeDishes(value) {
  if (!Array.isArray(value)) return [];
  return value.map(function (d) { return normalizeDish(d); });
}

/**
 * Normalize a single dish to the contract shape.
 *
 * Produces BOTH new standardized fields AND backward-compatible mock fields
 * so that existing Flutter parsers continue to work while new code can use
 * the standardized names.
 *
 * @param {object} [raw={}] - Raw dish from provider.
 * @returns {object} Normalized dish.
 */
function normalizeDish(raw) {
  if (!raw || typeof raw !== 'object') raw = {};

  var input = stripForbiddenFields(raw) || {};

  // Core name fields
  var dishName = normalizeString(input.dishName || input.name || '');
  var id = generateDishId(dishName);
  var originalName = (typeof input.originalName === 'string' && input.originalName.trim().length > 0)
    ? input.originalName.trim()
    : null;

  // Scores (0-100)
  var tasteScore = clampScore(input.tasteScore, 0);
  var safetyScore = clampScore(input.safetyScore, 0);
  var valueScore = clampScore(input.valueScore, 0);

  // Recommendation / match reasons
  var matchReasons = normalizeStringArray(input.matchReasons);
  if (matchReasons.length === 0 && typeof input.recommendationReason === 'string') {
    var reason = input.recommendationReason.trim();
    if (reason.length > 0) matchReasons = [reason];
  }

  // Risk flags
  var riskFlags = normalizeStringArray(input.riskFlags);

  // Allergens
  var allergens = normalizeStringArray(input.allergens);

  // Ingredients
  var ingredients = normalizeStringArray(input.ingredients);

  // Spice level
  var spiceLevel = normalizeSpiceLevel(input.spiceLevel);

  // Per-dish confidence
  var dishConfidence = clampConfidence(input.confidence);

  // Safety notes
  var safetyNotes = normalizeStringArray(input.safetyNotes);

  // Price intelligence
  var pi = normalizePriceIntelligence(input.priceIntelligence || {});

  // Description
  var description = normalizeString(input.description || '');

  return {
    // --- New contract-standardized fields ---
    id: id,
    name: dishName,
    originalName: originalName,
    description: description,
    recommendationScore: tasteScore,
    matchReasons: matchReasons,
    riskFlags: riskFlags,
    allergens: allergens,
    spiceLevel: spiceLevel,
    estimatedPrice: pi.localPrice,
    currency: pi.localCurrency,
    valueRating: pi.assessment,
    safetyNotes: safetyNotes,
    confidence: dishConfidence,

    // --- Backward-compatible mock fields ---
    dishName: dishName,
    ingredients: ingredients,
    tasteScore: tasteScore,
    safetyScore: safetyScore,
    valueScore: valueScore,
    recommendationReason: matchReasons.length > 0 ? matchReasons[0] : '',
    priceIntelligence: pi
  };
}

/**
 * Generate a stable id from a dish name.
 * Uses a simple DJB2-like hash to produce a hex string prefixed with 'dish_'.
 * @param {string} name
 * @returns {string}
 */
function generateDishId(name) {
  if (typeof name !== 'string' || name.length === 0) return 'dish_00000000';
  var hash = 5381;
  for (var i = 0; i < name.length; i++) {
    hash = ((hash << 5) + hash + name.charCodeAt(i)) | 0;
  }
  var hex = (hash >>> 0).toString(16);
  while (hex.length < 8) hex = '0' + hex;
  return 'dish_' + hex;
}

/**
 * Normalize the priceIntelligence sub-object.
 * @param {object} [raw={}]
 * @returns {object}
 */
function normalizePriceIntelligence(raw) {
  if (!raw || typeof raw !== 'object') return defaultPriceIntelligence();

  var input = stripForbiddenFields(raw) || {};

  var localPrice = clampPrice(input.localPrice);
  var localCurrency = normalizeCurrency(input.localCurrency);
  var homePrice = clampPrice(input.homePrice);
  var homeCurrency = normalizeCurrency(input.homeCurrency);
  var exchangeRate = typeof input.exchangeRate === 'number' && !Number.isNaN(input.exchangeRate) && input.exchangeRate > 0
    ? input.exchangeRate
    : 1;
  var assessment = normalizeString(input.assessment || input.valueRating || '');

  // Validate assessment against known values
  var validAssessments = { 'Good Value': true, 'Cheap': true, 'Fair': true, 'Premium': true, 'Expensive': true };
  if (!validAssessments[assessment]) {
    assessment = '';
  }

  return {
    localPrice: localPrice,
    localCurrency: localCurrency,
    homePrice: homePrice,
    homeCurrency: homeCurrency,
    exchangeRate: exchangeRate,
    assessment: assessment
  };
}

/**
 * Default price intelligence object.
 * @returns {object}
 */
function defaultPriceIntelligence() {
  return {
    localPrice: 0,
    localCurrency: '',
    homePrice: 0,
    homeCurrency: '',
    exchangeRate: 1,
    assessment: ''
  };
}

/**
 * Normalize a currency code to a safe 3-letter code or empty string.
 * @param {*} value
 * @returns {string}
 */
function normalizeCurrency(value) {
  if (typeof value === 'string') {
    var trimmed = value.trim().toUpperCase();
    // Only allow typical 3-letter ISO currency codes
    if (/^[A-Z]{3}$/.test(trimmed)) return trimmed;
  }
  return '';
}

/**
 * Filter rawMetadata to only include safe, whitelisted fields.
 * Any forbidden field anywhere in the metadata tree is stripped.
 * @param {*} value
 * @returns {object|null}
 */
function normalizeRawMetadata(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'object') return null;
  if (Array.isArray(value)) return null;

  var input = stripForbiddenFields(value) || {};
  var keys = Object.keys(input);
  if (keys.length === 0) return null;

  var result = {};
  var hasAny = false;

  for (var j = 0; j < keys.length; j++) {
    var k = keys[j];
    if (isForbiddenKey(k)) continue;
    if (!SAFE_METADATA_KEYS.has(k)) continue;

    var v = input[k];

    // Only allow primitive safe values (string, number, boolean).
    if (typeof v === 'string') {
      // Reject strings that look like secrets or base64 blobs.
      if (looksLikeSecret(v)) continue;
      result[k] = v;
      hasAny = true;
    } else if (typeof v === 'number' && !Number.isNaN(v) && isFinite(v)) {
      result[k] = v;
      hasAny = true;
    } else if (typeof v === 'boolean') {
      result[k] = v;
      hasAny = true;
    }
  }

  return hasAny ? result : null;
}

// ---------------------------------------------------------------------------
// Error helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a known-safe error code or return the fallback.
 * @param {*} codeValue
 * @param {string} fallbackCode
 * @returns {string}
 */
function resolveErrorCode(codeValue, fallbackCode) {
  if (typeof codeValue === 'string' && KNOWN_ANALYSIS_ERROR_CODES.has(codeValue)) {
    return codeValue;
  }
  return fallbackCode;
}

// ---------------------------------------------------------------------------
// Message sanitisation
// ---------------------------------------------------------------------------

/**
 * Sanitise an error message string by removing any embedded secrets,
 * API keys, JWTs, base64 blobs, or other sensitive patterns.
 *
 * This is a safety net: error messages from our own code should already
 * be safe, but raw errors from external libraries or unexpected sources
 * might contain sensitive data in their message text.
 *
 * @param {string} message - Raw error message (may contain secrets).
 * @returns {string} Sanitised message.
 */
function sanitizeMessage(message) {
  if (typeof message !== 'string' || message.length === 0) return '';

  var sanitized = message;

  // Remove typical API key patterns (sk-...).
  sanitized = sanitized.replace(/\bsk-[A-Za-z0-9]{10,}\b/g, '[REDACTED]');

  // Remove JWT-like tokens (three base64url segments separated by dots).
  sanitized = sanitized.replace(/\b[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g, '[REDACTED]');

  // Remove long base64-like strings that could be encoded secrets.
  sanitized = sanitized.replace(/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, function (match) {
    if (match.length >= 40) return '[REDACTED]';
    return match;
  });

  // Remove Bearer tokens.
  sanitized = sanitized.replace(/Bearer\s+[A-Za-z0-9._\-]+/gi, 'Bearer [REDACTED]');

  // Trim and collapse whitespace.
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  // Truncate excessively long messages.
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 497) + '...';
  }

  return sanitized;
}

// ---------------------------------------------------------------------------
// Forbidden field detection
// ---------------------------------------------------------------------------

/**
 * Return true if the key matches a forbidden field name (case-insensitive).
 * @param {string} key
 * @returns {boolean}
 */
function isForbiddenKey(key) {
  return FORBIDDEN_FIELDS.has(key.toLowerCase());
}

/**
 * Recursively strip forbidden fields from an object (deep clone).
 * Returns a new object/array/value; the original is never mutated.
 * @param {*} obj
 * @returns {*}
 */
function stripForbiddenFields(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(function (item) { return stripForbiddenFields(item); });
  }
  if (typeof obj === 'object') {
    var result = {};
    var keys = Object.keys(obj);
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      if (isForbiddenKey(key)) continue;
      result[key] = stripForbiddenFields(obj[key]);
    }
    return result;
  }
  return obj;
}

/**
 * Heuristic: return true if a string looks like a secret, base64 blob, or
 * other sensitive content that should not appear in rawMetadata.
 *
 * @param {string} value
 * @returns {boolean}
 */
function looksLikeSecret(value) {
  if (value.length > 500) return true;

  if (/^sk-/.test(value)) return true;
  if (value.startsWith('sk-')) return true;
  if (/^[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/.test(value)) return true; // JWT-like
  if (/^(?:[A-Za-z0-9+/]{40,}={0,2})$/.test(value) && value.length >= 40) return true; // base64-like
  if (/^(?:[A-Za-z0-9]{35,})$/.test(value)) return true; // long alphanumeric

  return false;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  // Contract shape constants
  CONFIDENCE_MIN,
  CONFIDENCE_MAX,
  SCORE_MIN,
  SCORE_MAX,
  SAFE_METADATA_KEYS,
  FORBIDDEN_FIELDS,
  KNOWN_ANALYSIS_ERROR_CODES,

  // Normalization helpers
  normalizeAnalysisResult,
  normalizeAnalysisError,

  // Sub-normalizers (exported for unit testing)
  normalizeProvider,
  normalizeMode,
  normalizeString,
  normalizeStringArray,
  clampConfidence,
  clampScore,
  clampPrice,
  normalizeSpiceLevel,
  normalizeWarnings,
  normalizeDishes,
  normalizeDish,
  normalizePriceIntelligence,
  normalizeCurrency,
  normalizeRawMetadata,
  generateDishId,
  resolveErrorCode,
  sanitizeMessage,
  stripForbiddenFields,
  looksLikeSecret
};
