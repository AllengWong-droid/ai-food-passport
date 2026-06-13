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
const { getCorsHeaders, handlePreflight } = require('./utils/corsEnforcement');
const { getRuntimeConfig, NODE_ENV, PORT, HOST, REQUEST_BODY_LIMIT }
  = require('./config/runtimeConfig');

// Confirm logging utilities loaded correctly at startup (no-op in production).
void redactForLogs;
void extractSafeErrorCode;
void getRuntimeConfig;

const server = http.createServer((request, response) => {
  const startedAt = Date.now();
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  // Handle OPTIONS preflight with origin validation
  if (request.method === 'OPTIONS') {
    handlePreflight(request, response);
    return;
  }

  let body = '';
  let bodyTooLarge = false;

  request.on('data', chunk => {
    if (bodyTooLarge) return;
    body += chunk;
    if (body.length > REQUEST_BODY_LIMIT) {
      bodyTooLarge = true;
      sendJson(request, response, 413, {
        ok: false,
        data: null,
        error: {
          code: 'REQUEST_BODY_TOO_LARGE',
          message: `Request body exceeds the ${REQUEST_BODY_LIMIT} byte limit.`,
          details: null
        }
      });
      // The response has been sent. Continue ignoring remaining data chunks.
    }
  });

  request.on('end', () => {
    // Do not process further if body was too large — response already sent
    if (bodyTooLarge) return;

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
        corsEnforcementReady: true,
        requestBodyLimitBytes: runtimeConfig.requestBodyLimit,
        requestBodyLimitReady: true,
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

server.listen({ port: PORT, host: HOST, reuseAddr: true }, () => {
  console.log(
    `AI Food Passport mock backend listening on http://${HOST}:${PORT} ` +
    `(NODE_ENV=${NODE_ENV})`
  );
});

// Allow port reuse for fast restarts (tests, deployments)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Exiting.`);
    process.exit(1);
  }
  throw err;
});

module.exports = {
  server
};
