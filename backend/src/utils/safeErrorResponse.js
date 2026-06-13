/**
 * safeErrorResponse.js
 *
 * Safe error response helper for AI Food Passport backend.
 *
 * Purpose:
 *   Ensure that internal Error objects (which may carry stack traces, raw
 *   provider responses, authorization headers, or other sensitive data) are
 *   never serialized into user-facing API responses.
 *
 *   This helper extracts only the safe, user-facing parts of an error: a
 *   controlled error code and a human-readable message. Everything else is
 *   discarded before the response is sent.
 *
 * Usage:
 *   const { extractSafeErrorCode } = require('../utils/safeErrorResponse');
 *
 *   // In a route catch handler:
 *   const code = extractSafeErrorCode(error, 'PROVIDER_FAILURE');
 *   sendJson(request, response, 502, errorPayload(code, friendlyMessage));
 *
 * Rules:
 *   - Never include error.stack in an API response.
 *   - Never include error.providerRawResponse or raw provider body.
 *   - Never include authorization headers or key material.
 *   - Never include raw menu image data or full OCR payloads.
 *   - Never include internal JavaScript Error internals (fileName, lineNumber).
 *   - The 'details' field in errorPayload must remain null in production unless
 *     it contains only a safe, developer-curated string.
 */

/**
 * Known safe error codes that can be forwarded directly to the API response.
 * These are domain-level codes set explicitly by the application; they do not
 * carry internal implementation details.
 */
const KNOWN_SAFE_ERROR_CODES = new Set([
  'METHOD_NOT_ALLOWED',
  'BAD_REQUEST',
  'NOT_FOUND',
  'OCR_FAILED',
  'OCR_EMPTY_TEXT',
  'OCR_PROVIDER_NOT_CONFIGURED',
  'OCR_PROVIDER_INVALID',
  'ANALYSIS_FAILED',
  'ANALYSIS_PROVIDER_NOT_CONFIGURED',
  'ANALYSIS_PROVIDER_INVALID',
  'PROVIDER_FAILURE',
  'PROVIDER_UNAVAILABLE',
  'PROVIDER_TIMEOUT',
  'PROVIDER_GUARD_INVALID_OPERATION'
]);

/**
 * Extracts a safe, API-friendly error code from an Error object.
 *
 * If the error carries a known safe code (set explicitly by application code),
 * that code is returned directly. Otherwise the provided fallback is used.
 *
 * This prevents unknown internal error codes, library error codes, or raw
 * provider error strings from leaking into user-facing responses.
 *
 * @param {Error|unknown} error - The caught error.
 * @param {string} fallbackCode - A safe fallback code to use if error.code is absent or unknown.
 * @returns {string} A safe error code string.
 */
function extractSafeErrorCode(error, fallbackCode) {
  if (error && typeof error === 'object' && typeof error.code === 'string') {
    if (KNOWN_SAFE_ERROR_CODES.has(error.code)) {
      return error.code;
    }
  }

  return fallbackCode || 'PROVIDER_FAILURE';
}

/**
 * Returns true if the given error code is a known safe application code.
 * @param {string} code
 * @returns {boolean}
 */
function isSafeErrorCode(code) {
  return KNOWN_SAFE_ERROR_CODES.has(code);
}

/**
 * Builds a minimal safe log entry from an internal error.
 * Includes only: code (if known-safe), message, and nothing else.
 * Never includes stack, providerRawResponse, headers, or image data.
 *
 * Suitable for structured internal logging (not for API responses).
 *
 * @param {Error|unknown} error
 * @param {string} [context] - Optional label for the log entry (e.g. 'analyzeMenu').
 * @returns {{ context?: string, code?: string, message: string }}
 */
function buildSafeLogEntry(error, context) {
  const entry = {};

  if (context) {
    entry.context = context;
  }

  if (error && typeof error === 'object') {
    if (typeof error.code === 'string' && isSafeErrorCode(error.code)) {
      entry.code = error.code;
    }

    entry.message = typeof error.message === 'string'
      ? error.message
      : 'Unknown error';
  } else {
    entry.message = String(error);
  }

  return entry;
}

module.exports = {
  KNOWN_SAFE_ERROR_CODES,
  extractSafeErrorCode,
  isSafeErrorCode,
  buildSafeLogEntry
};
