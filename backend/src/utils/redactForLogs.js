/**
 * redactForLogs.js
 *
 * Logging redaction utility for AI Food Passport backend.
 *
 * Purpose:
 *   Mask sensitive fields before any object is passed to a logger or included
 *   in internal debug output. This prevents API keys, authorization headers,
 *   raw provider responses, menu images, and other sensitive data from leaking
 *   into log storage, console output, or error reports.
 *
 * Usage:
 *   const { redactForLogs, REDACTED } = require('../utils/redactForLogs');
 *
 *   // Safe to log: secrets replaced with '[REDACTED]'
 *   console.log(redactForLogs({ apiKey: 'sk-secret', text: 'hello' }));
 *   // => { apiKey: '[REDACTED]', text: 'hello' }
 *
 * Rules:
 *   - Does NOT modify the original object. Returns a new sanitized copy.
 *   - Handles nested objects and arrays recursively.
 *   - Handles circular references safely (stops recursion at already-seen nodes).
 *   - Non-object values (strings, numbers, null, undefined) are returned as-is.
 *   - Field name matching is case-insensitive.
 *   - This utility is intentionally conservative: it is better to redact too
 *     much than to leak secrets.
 */

const REDACTED = '[REDACTED]';

/**
 * Sensitive field names to redact.
 * Matching is case-insensitive against the actual key names encountered.
 */
const SENSITIVE_FIELDS = new Set([
  'apikey',
  'authorization',
  'token',
  'secret',
  'password',
  'image',
  'imagebytes',
  'base64',
  'rawimage',
  'menuimage',
  'providerrawresponse',
  'providerrawerror',
  'stack'
]);

/**
 * Returns true if the given key should be redacted.
 * @param {string} key
 * @returns {boolean}
 */
function isSensitiveKey(key) {
  return SENSITIVE_FIELDS.has(String(key).toLowerCase());
}

/**
 * Deep-clones an object with sensitive fields replaced by REDACTED.
 * Safe against circular references.
 *
 * @param {*} value - Any value.
 * @param {Set} [seen] - Internal: tracks visited object references to prevent loops.
 * @returns {*} A sanitized copy of the value.
 */
function redactForLogs(value, seen) {
  const visitedNodes = seen || new Set();

  // Primitives: return as-is.
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== 'object') {
    return value;
  }

  // Circular reference guard.
  if (visitedNodes.has(value)) {
    return '[Circular]';
  }
  visitedNodes.add(value);

  // Arrays: recurse into each element.
  if (Array.isArray(value)) {
    const result = value.map(item => redactForLogs(item, visitedNodes));
    visitedNodes.delete(value);
    return result;
  }

  // Plain objects: copy keys, redacting sensitive ones.
  const result = {};
  for (const key of Object.keys(value)) {
    if (isSensitiveKey(key)) {
      result[key] = REDACTED;
    } else {
      result[key] = redactForLogs(value[key], visitedNodes);
    }
  }
  visitedNodes.delete(value);
  return result;
}

/**
 * Redacts a plain Error object into a safe log-friendly shape.
 * Strips the stack trace. Preserves code and message.
 *
 * @param {Error} error
 * @returns {{ code: string|undefined, message: string }}
 */
function redactError(error) {
  if (!error || typeof error !== 'object') {
    return { message: String(error) };
  }

  return {
    code: error.code || undefined,
    message: error.message || 'Unknown error'
    // stack intentionally omitted
  };
}

module.exports = {
  REDACTED,
  SENSITIVE_FIELDS,
  isSensitiveKey,
  redactForLogs,
  redactError
};
