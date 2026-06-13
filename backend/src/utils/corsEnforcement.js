/**
 * corsEnforcement.js
 *
 * CORS origin validation and header management for AI Food Passport backend.
 *
 * This module replaces the skeleton CORS implementation from Phase 11B
 * with real enforcement behaviour.
 *
 * Rules:
 *   - Development (NODE_ENV=development|test): allows configured localhost
 *     / 127.0.0.1 origins. Falls back to permissive (* or mirror) for
 *     unrecognised localhost origins so local Flutter web dev works.
 *   - Production (NODE_ENV=production): only allows origins explicitly
 *     listed in ALLOWED_ORIGINS. Never uses "*" as a default. Unknown
 *     origins receive no Access-Control-Allow-Origin header (browser blocks).
 *   - OPTIONS preflight: returns 204 with full CORS headers for allowed
 *     origins. Returns 204 without CORS headers for disallowed origins
 *     (browser blocks the follow-up request). Never leaks stack traces.
 *
 * Usage:
 *   const { getCorsHeaders, handlePreflight } = require('../utils/corsEnforcement');
 */

const { NODE_ENV, ALLOWED_ORIGINS, REQUEST_BODY_LIMIT }
  = require('../config/runtimeConfig');

/**
 * Returns true if the given origin is allowed for CORS in the current
 * NODE_ENV.
 *
 * @param {string|null|undefined} origin - Request Origin header value.
 * @returns {boolean}
 */
function isOriginAllowed(origin) {
  if (!origin) return false;

  // Check explicitly configured origins first
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  // Development/test: allow any localhost / 127.0.0.1 origin (any port)
  if (NODE_ENV !== 'production') {
    try {
      const url = new URL(origin);
      if ((url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
          url.protocol === 'http:') {
        return true;
      }
    } catch (_) {
      // Invalid origin URL — not allowed
    }
  }

  return false;
}

/**
 * Returns the CORS response headers for a given request.
 *
 * - Allowed origin → mirrors the request origin.
 * - Disallowed origin in production → no Access-Control-Allow-Origin header.
 * - Disallowed origin in development (non-localhost) → "*" for convenience.
 * - No Origin header → "*" in development, no header in production.
 *
 * Always includes Vary: Origin when the response depends on the request origin.
 *
 * @param {http.IncomingMessage} request
 * @returns {{ [key: string]: string }}
 */
function getCorsHeaders(request) {
  const requestOrigin = request.headers.origin;

  if (isOriginAllowed(requestOrigin)) {
    return {
      'Access-Control-Allow-Origin': requestOrigin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
  }

  if (NODE_ENV === 'production') {
    // Production: no CORS header → browser blocks
    return { 'Vary': 'Origin' };
  }

  // Development: permissive fallback for unknown origins (e.g. Flutter web)
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

/**
 * Handles an OPTIONS preflight request.
 *
 * - Allowed origin → 204 with full CORS headers.
 * - Disallowed origin → 204 with NO CORS headers (browser blocks).
 * - No stack traces are ever included in the response.
 *
 * Always returns true (caller should not continue processing).
 *
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @returns {boolean} true — caller should stop further processing.
 */
function handlePreflight(request, response) {
  const headers = getCorsHeaders(request);

  response.writeHead(204, headers);
  response.end();
  return true;
}

/**
 * Returns the CORS headers object for use in writeHead() calls.
 * Delegates to getCorsHeaders.
 *
 * @param {http.IncomingMessage} request
 * @returns {{ [key: string]: string }}
 */
function corsHeadersForWriteHead(request) {
  return getCorsHeaders(request);
}

module.exports = {
  isOriginAllowed,
  getCorsHeaders,
  handlePreflight,
  corsHeadersForWriteHead
};
