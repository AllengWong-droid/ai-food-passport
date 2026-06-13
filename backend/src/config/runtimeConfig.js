/**
 * runtimeConfig.js
 *
 * Production/development environment configuration for AI Food Passport backend.
 *
 * Parses runtime environment variables with safe defaults.
 * Does NOT import any secrets or provider config — those live in their
 * own config modules.
 *
 * Usage:
 *   const { getRuntimeConfig } = require('./config/runtimeConfig');
 *   const config = getRuntimeConfig();
 *
 * Environment variables:
 *   NODE_ENV         - 'development' | 'production' | 'test'
 *                        Default: 'development'
 *   PORT              - Server port. Default: 8787
 *   HOST              - Server bind address.
 *                        Default (development): '127.0.0.1'
 *                        Default (production): '0.0.0.0'
 *   ALLOWED_ORIGINS  - Comma-separated CORS allowed origins.
 *                        Default (development): local Flutter/web origins
 *   PUBLIC_BACKEND_URL - Publicly accessible backend URL (for Flutter).
 *                        Default: '' (must be set in production)
 *   REQUEST_BODY_LIMIT - Max request body size in bytes.
 *                        Default: 1048576 (1 MB)
 */

const NODE_ENV_RAW = (process.env.NODE_ENV || 'development').toLowerCase();
const KNOWN_NODE_ENVS = ['development', 'production', 'test'];
const NODE_ENV = KNOWN_NODE_ENVS.includes(NODE_ENV_RAW)
  ? NODE_ENV_RAW
  : 'development';

const PORT_RAW = Number(process.env.PORT || 8787);
const PORT = (Number.isInteger(PORT_RAW) && PORT_RAW >= 1 && PORT_RAW <= 65535)
  ? PORT_RAW
  : 8787;

const DEFAULT_HOST_DEVELOPMENT = '127.0.0.1';
const DEFAULT_HOST_PRODUCTION = '0.0.0.0';
const HOST = process.env.HOST && process.env.HOST.trim() !== ''
  ? process.env.HOST.trim()
  : NODE_ENV === 'production'
    ? DEFAULT_HOST_PRODUCTION
    : DEFAULT_HOST_DEVELOPMENT;

const DEFAULT_ALLOWED_ORIGINS_DEVELOPMENT = [
  'http://localhost:8787',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:8787',
  'http://127.0.0.1:3000'
].join(',');

const ALLOWED_ORIGINS_RAW = process.env.ALLOWED_ORIGINS;
const ALLOWED_ORIGINS = ALLOWED_ORIGINS_RAW && ALLOWED_ORIGINS_RAW.trim() !== ''
  ? ALLOWED_ORIGINS_RAW.split(',').map(o => o.trim()).filter(o => o !== '')
  : (NODE_ENV === 'production' ? [] : DEFAULT_ALLOWED_ORIGINS_DEVELOPMENT.split(','));

const PUBLIC_BACKEND_URL = (process.env.PUBLIC_BACKEND_URL || '').trim();

const REQUEST_BODY_LIMIT_RAW = Number(process.env.REQUEST_BODY_LIMIT || 1048576);
const REQUEST_BODY_LIMIT = (Number.isInteger(REQUEST_BODY_LIMIT_RAW) && REQUEST_BODY_LIMIT_RAW >= 0)
  ? REQUEST_BODY_LIMIT_RAW
  : 1048576;

/**
 * Warnings collected at startup. These are reported through /health
 * and do NOT prevent the server from starting.
 */
const runtimeWarnings = [];

if (NODE_ENV_RAW !== NODE_ENV) {
  runtimeWarnings.push(
    `Invalid NODE_ENV '${NODE_ENV_RAW}', defaulting to '${NODE_ENV}'. ` +
    `Valid values: ${KNOWN_NODE_ENVS.join(', ')}.`
  );
}

if (Number(process.env.PORT) !== PORT) {
  runtimeWarnings.push(
    `Invalid PORT '${process.env.PORT}', defaulting to ${PORT}. ` +
    'Must be an integer between 1 and 65535.'
  );
}

if (NODE_ENV === 'production' && ALLOWED_ORIGINS.length === 0) {
  runtimeWarnings.push(
    'ALLOWED_ORIGINS is empty in production. ' +
    'CORS will reject all cross-origin requests. ' +
    'Set ALLOWED_ORIGINS to your Flutter app origins.'
  );
}

if (NODE_ENV === 'production' && !PUBLIC_BACKEND_URL) {
  runtimeWarnings.push(
    'PUBLIC_BACKEND_URL is not set. ' +
    'Flutter production builds will not know the backend URL. ' +
    'Set PUBLIC_BACKEND_URL to your deployed backend HTTPS URL.'
  );
}

if (NODE_ENV === 'production') {
  runtimeWarnings.push(
    'Production mode is a configuration skeleton only. ' +
    'Real provider calls, CORS enforcement, and rate limiting ' +
    'are not yet enforced. See backend/DEPLOYMENT_READINESS.md.'
  );
}

/**
 * Returns the validated runtime configuration.
 * This function is safe to call at startup or at request time.
 *
 * @returns {Object} Runtime configuration object.
 */
function getRuntimeConfig() {
  return {
    nodeEnv: NODE_ENV,
    port: PORT,
    host: HOST,
    allowedOrigins: ALLOWED_ORIGINS,
    allowedOriginsCount: ALLOWED_ORIGINS.length,
    publicBackendUrl: PUBLIC_BACKEND_URL,
    requestBodyLimit: REQUEST_BODY_LIMIT,
    corsConfigured: ALLOWED_ORIGINS.length > 0,
    productionReady: false, // Always false until real deployment is implemented
    deploymentReadinessReady: true,
    runtimeWarnings
  };
}

module.exports = {
  getRuntimeConfig,
  NODE_ENV,
  PORT,
  HOST,
  ALLOWED_ORIGINS,
  PUBLIC_BACKEND_URL,
  REQUEST_BODY_LIMIT,
  runtimeWarnings
};
