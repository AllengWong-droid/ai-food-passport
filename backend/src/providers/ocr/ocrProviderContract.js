/**
 * ocrProviderContract.js
 *
 * OCR Provider Contract for AI Food Passport backend.
 *
 * Purpose:
 *   Define the stable contract that every OCR provider (mock or real) MUST
 *   conform to. This contract gives future real providers a single target
 *   shape and guarantees that the analyzeMenu route, the Flutter parser, and
 *   all downstream analysis code receive a predictable, safe result object.
 *
 *   Normalization helpers sanitise raw provider output before it reaches
 *   any user-facing API response. No raw provider internals, stack traces,
 *   API headers, image payloads, or secrets can leak past this boundary.
 *
 * Contract shape (OcrContractResult):
 *
 *   {
 *     provider: string,        // Known OcrProviderName value
 *     mode: string,            // Provider mode (e.g. 'mock', 'ocr')
 *     text: string,            // OCR-extracted text (may be empty)
 *     languageHints: string[], // BCP-47 / ISO 639 language tags
 *     confidence: number,      // 0–1, clamped
 *     warnings: string[],      // Known OcrWarningCode values
 *     rawMetadata: object|null // Safe, redacted metadata only (optional)
 *   }
 *
 * Usage:
 *
 *   const { normalizeOcrResult, normalizeOcrError } =
 *     require('../providers/ocr/ocrProviderContract');
 *
 *   // Inside a real OCR provider adapter:
 *   const raw = await callRealOcrApi(image);
 *   const contractResult = normalizeOcrResult(raw);
 *   return contractResult;
 *
 *   // Inside a catch handler:
 *   try { ... }
 *   catch (e) {
 *     throw normalizeOcrError(e);
 *   }
 *
 * Rules:
 *   - Never include raw provider HTTP responses.
 *   - Never include stack traces.
 *   - Never include API keys, bearer tokens, or authorization headers.
 *   - Never include raw image data, base64, or imagePayload fields.
 *   - Confidence must be clamped to [0, 1].
 *   - Warnings must only contain known OcrWarningCode values.
 *   - Language hints must be an array of safe string tags (no raw header values).
 *   - rawMetadata is stripped of all unsafe fields; only a whitelist passes.
 */

const {
  OcrProviderName,
  OcrProviderMode,
  OcrWarningCode
} = require('./ocrProviderTypes');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** @type {number} Minimum allowed confidence (inclusive). */
const CONFIDENCE_MIN = 0;

/** @type {number} Maximum allowed confidence (inclusive). */
const CONFIDENCE_MAX = 1;

/**
 * Safe rawMetadata field whitelist.
 * Only these keys may survive normalization. Everything else is dropped.
 */
const SAFE_METADATA_KEYS = new Set([
  'processingTimeMs',
  'modelVersion',
  'ocrEngine',
  'pageCount',
  'detectedOrientation',
  'totalTokens'
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
  'credentials'
]);

/**
 * Known safe OCR error codes that may appear on an Error object and are
 * allowed through normalization unchanged.
 */
const KNOWN_OCR_ERROR_CODES = new Set([
  'OCR_FAILED',
  'OCR_EMPTY_TEXT',
  'OCR_PROVIDER_NOT_CONFIGURED',
  'OCR_PROVIDER_INVALID'
]);

/** Set of valid OcrProviderName values for fast lookup. */
const VALID_PROVIDER_NAMES = new Set(Object.values(OcrProviderName));

/** Set of valid OcrWarningCode values for fast lookup. */
const VALID_WARNING_CODES = new Set(Object.values(OcrWarningCode));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Normalize a raw OCR provider result into the OcrContractResult shape.
 *
 * Missing or invalid fields are replaced with safe defaults.
 * Confidence is clamped to [0, 1]. Warnings are filtered to known codes.
 * Forbidden fields (stack traces, secrets, images, raw HTTP responses) are
 * stripped entirely.
 *
 * @param {object} [raw={}] - Raw result from an OCR provider.
 * @returns {object} Normalized OcrContractResult.
 */
function normalizeOcrResult(raw = {}) {
  const input = stripForbiddenFields(raw) || {};

  const provider = normalizeProvider(input.provider);
  const mode = normalizeMode(input.mode, provider);
  const text = normalizeText(input.text);
  const languageHints = normalizeLanguageHints(input.languageHints);
  const confidence = clampConfidence(input.confidence);
  const warnings = normalizeWarnings(input.warnings);
  const rawMetadata = normalizeRawMetadata(input.rawMetadata);

  return {
    provider,
    mode,
    text,
    languageHints,
    confidence,
    warnings,
    rawMetadata
  };
}

/**
 * Normalize an OCR provider error into a safe, contract-conformant Error.
 *
 * The returned Error carries ONLY a known-safe `code` and `message`.
 * Stack traces, raw provider responses, API headers, image payloads, and
 * secrets are unconditionally stripped.
 *
 * Provider info is preserved on `error.provider` if it is a valid
 * OcrProviderName value.
 *
 * @param {Error|object|*} error - The caught error.
 * @param {string} [fallbackCode='OCR_FAILED'] - Fallback code when the error carries no known code.
 * @returns {Error} A sanitised Error with only { code, message, provider }.
 */
function normalizeOcrError(error, fallbackCode = 'OCR_FAILED') {
  // Error objects have 'message' as an inherited property, not own.
  // We must read it explicitly before stripping fields.
  // Also sanitise the message text to remove any embedded secrets.
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
  // embedded API keys, JWTs, or base64 blobs that may have leaked into it.
  var message = sanitizeMessage(rawMessage);

  // If sanitisation left us with an empty message, try the stripped
  // version (which was deep-cloned from own properties only) or fall back.
  if (!message) {
    if (typeof stripped.message === 'string' && stripped.message.length > 0) {
      message = sanitizeMessage(stripped.message);
    }
  }
  if (!message) {
    message = 'OCR provider encountered an error.';
  }

  var provider = normalizeProvider(stripped.provider || rawProvider);

  const safe = new Error(message);
  safe.code = code;
  if (provider && provider !== 'unknown_ocr') {
    safe.provider = provider;
  }

  // Node.js auto-attaches a stack trace to new Error(). Delete it so that
  // no stack trace (not even a harmless one) can leak into API responses.
  // The existing safe error helpers (extractSafeErrorCode, buildSafeLogEntry)
  // already ignore .stack, but removing it outright is the safest posture.
  delete safe.stack;

  return safe;
}

// ---------------------------------------------------------------------------
// Field normalizers
// ---------------------------------------------------------------------------

/**
 * Resolve the provider name to a known value or 'unknown_ocr'.
 * @param {*} value
 * @returns {string}
 */
function normalizeProvider(value) {
  if (typeof value === 'string' && VALID_PROVIDER_NAMES.has(value)) {
    return value;
  }
  return 'unknown_ocr';
}

/**
 * Resolve the provider mode. If missing, derive from the provider name
 * or default to 'mock'.
 * @param {*} value
 * @param {string} provider
 * @returns {string}
 */
function normalizeMode(value, provider) {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }

  // Derive mode from provider when possible.
  if (provider === OcrProviderName.MOCK_OCR) return OcrProviderMode.MOCK;
  // Future real providers will likely report 'ocr' or similar.
  return 'ocr';
}

/**
 * Ensure text is a string. Non-strings become ''.
 * @param {*} value
 * @returns {string}
 */
function normalizeText(value) {
  if (typeof value === 'string') return value;
  return '';
}

/**
 * Ensure languageHints is an array of clean string tags.
 * Non-array or non-string entries are dropped.
 * @param {*} value
 * @returns {string[]}
 */
function normalizeLanguageHints(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(function (h) { return typeof h === 'string' && h.trim().length > 0; })
    .map(function (h) { return h.trim(); });
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
 * Filter warnings to only include known OcrWarningCode values.
 * Duplicates are removed.
 * @param {*} value
 * @returns {string[]}
 */
function normalizeWarnings(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];
  for (var _i = 0; _i < value.length; _i++) {
    var w = value[_i];
    if (typeof w === 'string' && VALID_WARNING_CODES.has(w) && !seen.has(w)) {
      seen.add(w);
      result.push(w);
    }
  }
  return result;
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

  var keys = Object.keys(value);
  if (keys.length === 0) return null;

  var result = {};
  var hasAny = false;

  for (var _j = 0; _j < keys.length; _j++) {
    var k = keys[_j];
    if (isForbiddenKey(k)) continue;
    if (!SAFE_METADATA_KEYS.has(k)) continue;

    var v = value[k];

    // Only allow primitive safe values (string, number, boolean).
    if (typeof v === 'string') {
      // Reject strings that look like secrets or base64 blobs.
      if (looksLikeSecret(v)) continue;
      result[k] = v;
      hasAny = true;
    } else if (typeof v === 'number' && !Number.isNaN(v)) {
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
  if (typeof codeValue === 'string' && KNOWN_OCR_ERROR_CODES.has(codeValue)) {
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
    // Only redact if it looks like base64 (has typical padding/characters).
    if (match.length >= 40) return '[REDACTED]';
    return match;
  });

  // Remove Bearer tokens.
  sanitized = sanitized.replace(/Bearer\s+[A-Za-z0-9._\-\s]+/gi, 'Bearer [REDACTED]');

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
    for (var _k = 0; _k < keys.length; _k++) {
      var key = keys[_k];
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
 * This is a coarse filter — not a cryptographically precise detector.
 * It flags strings that are excessively long or contain patterns typical
 * of API keys, JWTs, or base64-encoded payloads.
 *
 * @param {string} value
 * @returns {boolean}
 */
function looksLikeSecret(value) {
  if (value.length > 500) return true;

  // Common API key / JWT / base64 patterns.
  if (/^sk-/.test(value)) return true;
  if (value.startsWith('sk-')) return true;
  if (/^[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/.test(value)) return true; // JWT-like
  if (/^(?:[A-Za-z0-9+/]{40,}={0,2})$/.test(value) && value.length >= 40) return true; // base64-like
  if (/^(?:[A-Za-z0-9]{35,})$/.test(value)) return true; // long alphanumeric (could be an API key)

  return false;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  // Contract shape constants
  CONFIDENCE_MIN,
  CONFIDENCE_MAX,
  SAFE_METADATA_KEYS,
  FORBIDDEN_FIELDS,
  KNOWN_OCR_ERROR_CODES,

  // Normalization helpers
  normalizeOcrResult,
  normalizeOcrError,

  // Sub-normalizers (exported for unit testing)
  normalizeProvider,
  normalizeMode,
  normalizeText,
  clampConfidence,
  normalizeLanguageHints,
  normalizeWarnings,
  normalizeRawMetadata,
  resolveErrorCode,
  sanitizeMessage,
  stripForbiddenFields,
  looksLikeSecret
};
