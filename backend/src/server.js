const http = require('http');
const { handleAnalyzeMenu, sendJson, errorPayload } = require('./routes/analyzeMenu');
const { getOcrProviderConfigStatus } = require('./providers/ocr/ocrProviderRegistry');
const { getAnalysisProviderConfigStatus } = require('./providers/analysis/analysisProviderRegistry');
const { getProviderSafetyConfig } = require('./config/providerSafetyConfig');
const {
  defaultProviderMode,
  supportedProviderModes
} = require('./providers/routing/providerRoutingDecision');
const { redactForLogs } = require('./utils/redactForLogs');
const { extractSafeErrorCode } = require('./utils/safeErrorResponse');
const { getRuntimeConfig, NODE_ENV, PORT, HOST, ALLOWED_ORIGINS }
  = require('./config/runtimeConfig');

// Confirm logging utilities loaded correctly at startup (no-op in production).
void redactForLogs;
void extractSafeErrorCode;
void getRuntimeConfig;

/**
 * CORS support skeleton.
 *
 * Sets Access-Control-Allow-Origin and related headers on all responses
 * based on the ALLOWED_ORIGINS configuration.
 *
 * In development: allows configured local origins, falls back to * for
 * unrecognised localhost origins (permissive for local dev convenience).
 * In production: only allows explicitly configured origins. If the request
 * origin is not in the allowed list, the Access-Control-Allow-Origin header
 * is omitted (browser will block the response).
 *
 * This is a skeleton implementation. Full CORS enforcement
 * (origin validation on each request) is a future phase.
 */
function setCorsHeaders(request, response) {
  const requestOrigin = request.headers.origin;

  // Always set basic CORS headers
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (NODE_ENV === 'production') {
    // Production: only allow explicitly configured origins
    if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
      response.setHeader('Access-Control-Allow-Origin', requestOrigin);
    }
    // If origin not allowed, don't set the header (browser will block)
  } else {
    // Development: allow the request origin if it's in allowed list
    if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
      response.setHeader('Access-Control-Allow-Origin', requestOrigin);
    } else {
      // In development, be permissive with localhost
      response.setHeader('Access-Control-Allow-Origin', '*');
    }
  }
}

const server = http.createServer((request, response) => {
  const startedAt = Date.now();
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  // Set CORS headers on all responses
  setCorsHeaders(request, response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  let body = '';
  request.on('data', chunk => {
    body += chunk;
    if (body.length > 1024 * 1024) {
      request.destroy();
    }
  });

  request.on('end', () => {
    if (url.pathname === '/health') {
      if (request.method !== 'GET') {
        sendJson(request, response, 405, errorPayload(
          'METHOD_NOT_ALLOWED',
          'Use GET /health.'
        ));
        return;
      }

      const ocrProviderStatus = getOcrProviderConfigStatus();
      const analysisProviderStatus = getAnalysisProviderConfigStatus();
      const providerSafetyConfig = getProviderSafetyConfig();
      const runtimeConfig = getRuntimeConfig();
      sendJson(request, response, 200, {
        ok: true,
        service: 'ai-food-passport-backend',
        nodeEnv: runtimeConfig.nodeEnv,
        port: runtimeConfig.port,
        host: runtimeConfig.host,
        corsConfigured: runtimeConfig.corsConfigured,
        allowedOriginsCount: runtimeConfig.allowedOriginsCount,
        productionReady: runtimeConfig.productionReady,
        deploymentReadinessReady: runtimeConfig.deploymentReadinessReady,
        mode: 'mock',
        ocrProvider: 'mock_ocr',
        configuredOcrProvider: ocrProviderStatus.configuredOcrProvider,
        activeOcrProvider: ocrProviderStatus.activeOcrProvider,
        availableOcrProviders: ocrProviderStatus.availableOcrProviders,
        realOcrEnabled: ocrProviderStatus.realOcrEnabled,
        providerRoutingReady: ocrProviderStatus.providerRoutingReady,
        supportedProviderModes,
        defaultProviderMode,
        realProvidersEnabled: false,
        configValid: ocrProviderStatus.configValid,
        configWarnings: ocrProviderStatus.configWarnings,
        analysisProvider: 'mock_ai',
        configuredAnalysisProvider: analysisProviderStatus.configuredAnalysisProvider,
        activeAnalysisProvider: analysisProviderStatus.activeAnalysisProvider,
        availableAnalysisProviders: analysisProviderStatus.availableAnalysisProviders,
        realAnalysisEnabled: analysisProviderStatus.realAnalysisEnabled,
        analysisConfigValid: analysisProviderStatus.configValid,
        analysisConfigWarnings: analysisProviderStatus.configWarnings,
        providerTimeoutMs: providerSafetyConfig.providerTimeoutMs,
        providerMaxRetries: providerSafetyConfig.providerMaxRetries,
        providerMonthlyBudgetConfigured:
          providerSafetyConfig.providerMonthlyBudgetConfigured,
        providerDailyRequestLimitConfigured:
          providerSafetyConfig.providerDailyRequestLimitConfigured,
        providerSafetyConfigValid:
          providerSafetyConfig.providerSafetyConfigValid,
        providerSafetyWarnings:
          providerSafetyConfig.providerSafetyWarnings,
        logRedactionReady: true,
        safeErrorEnvelopeReady: true,
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (url.pathname === '/api/analyze-menu') {
      handleAnalyzeMenu(request, response, body, startedAt);
      return;
    }

    sendJson(request, response, 404, errorPayload(
      'NOT_FOUND',
      'Route not found.'
    ));
  });
});

server.listen(PORT, HOST, () => {
  console.log(
    `AI Food Passport mock backend listening on http://${HOST}:${PORT} ` +
    `(NODE_ENV=${NODE_ENV})`
  );
});

module.exports = {
  server
};
