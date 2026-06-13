const http = require('http');
const { handleAnalyzeMenu, sendJson, errorPayload } = require('./routes/analyzeMenu');
const { getOcrProviderConfigStatus } = require('./providers/ocr/ocrProviderRegistry');
const { getAnalysisProviderConfigStatus } = require('./providers/analysis/analysisProviderRegistry');

const port = Number(process.env.PORT || 8787);

const server = http.createServer((request, response) => {
  const startedAt = Date.now();
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'OPTIONS') {
    sendJson(request, response, 204, null);
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
      sendJson(request, response, 200, {
        ok: true,
        service: 'ai-food-passport-backend',
        mode: 'mock',
        ocrProvider: 'mock_ocr',
        configuredOcrProvider: ocrProviderStatus.configuredOcrProvider,
        activeOcrProvider: ocrProviderStatus.activeOcrProvider,
        availableOcrProviders: ocrProviderStatus.availableOcrProviders,
        realOcrEnabled: ocrProviderStatus.realOcrEnabled,
        providerRoutingReady: ocrProviderStatus.providerRoutingReady,
        configValid: ocrProviderStatus.configValid,
        configWarnings: ocrProviderStatus.configWarnings,
        analysisProvider: 'mock_ai',
        configuredAnalysisProvider: analysisProviderStatus.configuredAnalysisProvider,
        activeAnalysisProvider: analysisProviderStatus.activeAnalysisProvider,
        availableAnalysisProviders: analysisProviderStatus.availableAnalysisProviders,
        realAnalysisEnabled: analysisProviderStatus.realAnalysisEnabled,
        analysisConfigValid: analysisProviderStatus.configValid,
        analysisConfigWarnings: analysisProviderStatus.configWarnings,
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

server.listen(port, () => {
  console.log(`AI Food Passport mock backend listening on http://localhost:${port}`);
});
