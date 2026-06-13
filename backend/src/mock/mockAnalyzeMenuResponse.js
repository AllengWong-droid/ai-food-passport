const {
  getActiveOcrProvider,
  isRealOcrEnabled
} = require('../providers/ocr/ocrProviderRegistry');
const {
  getActiveAnalysisProvider,
  isRealAnalysisEnabled
} = require('../providers/analysis/analysisProviderRegistry');
const { resolveProviderRoutingDecision } = require('../providers/routing/providerRoutingDecision');

async function buildMockAnalyzeMenuResponse(requestBody = {}, latencyMs = 0) {
  const routingDecision = resolveProviderRoutingDecision(requestBody);
  const ocr = await getActiveOcrProvider().extractMenuText(requestBody);
  const analysis = await getActiveAnalysisProvider().analyzeMenuText({
    requestBody,
    ocrResult: ocr
  });
  const warnings = [
    ...(ocr.warnings || []),
    ...(analysis.warnings || [])
  ];

  return {
    routing: {
      mode: 'mock',
      ocrProvider: ocr.provider,
      ocrMode: ocr.mode,
      ocrConfidence: ocr.confidence,
      ocrWarnings: ocr.warnings || [],
      realOcrEnabled: isRealOcrEnabled(),
      providerRoutingReady: true,
      requestedProviderMode: routingDecision.requestedMode,
      resolvedProviderMode: routingDecision.resolvedMode,
      realProvidersEnabled: routingDecision.realProvidersEnabled,
      routingReason: routingDecision.reason,
      futureOcrProvider: routingDecision.futureOcrProvider,
      futureAnalysisProvider: routingDecision.futureAnalysisProvider,
      analysisProvider: analysis.provider,
      analysisMode: analysis.mode,
      analysisConfidence: analysis.confidence,
      analysisWarnings: analysis.warnings || [],
      realAnalysisEnabled: isRealAnalysisEnabled(),
      warnings,
      fallbackUsed: routingDecision.fallbackUsed,
      latencyMs
    },
    ocr,
    dishes: analysis.dishes
  };
}

module.exports = { buildMockAnalyzeMenuResponse };
