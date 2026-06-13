const { OcrProviderName } = require('../ocr/ocrProviderTypes');
const { AnalysisProviderName } = require('../analysis/analysisProviderTypes');

const ProviderMode = Object.freeze({
  MOCK: 'mock',
  CHINA: 'china',
  GLOBAL: 'global',
  AUTO: 'auto'
});

const supportedProviderModes = Object.freeze(Object.values(ProviderMode));
const defaultProviderMode = ProviderMode.MOCK;

function resolveProviderRoutingDecision(requestBody = {}) {
  const requestedMode = normalizeProviderMode(
    requestBody.providerMode || requestBody.aiProviderMode
  );

  if (requestedMode === ProviderMode.MOCK) {
    return buildDecision({
      requestedMode,
      resolvedMode: ProviderMode.MOCK,
      fallbackUsed: false,
      reason: 'Mock provider mode is active.'
    });
  }

  if (requestedMode === ProviderMode.CHINA) {
    return buildDecision({
      requestedMode,
      resolvedMode: ProviderMode.MOCK,
      fallbackUsed: true,
      futureOcrProvider: OcrProviderName.QWEN_OCR_SKELETON,
      futureAnalysisProvider: AnalysisProviderName.QWEN_ANALYSIS_SKELETON,
      reason: 'China provider routing is planned, but real providers are disabled in this mock build.'
    });
  }

  if (requestedMode === ProviderMode.GLOBAL) {
    return buildDecision({
      requestedMode,
      resolvedMode: ProviderMode.MOCK,
      fallbackUsed: true,
      futureOcrProvider: OcrProviderName.OPENAI_VISION_SKELETON,
      futureAnalysisProvider: AnalysisProviderName.OPENAI_ANALYSIS_SKELETON,
      reason: 'Global provider routing is planned, but real providers are disabled in this mock build.'
    });
  }

  return buildDecision({
    requestedMode,
    resolvedMode: ProviderMode.MOCK,
    fallbackUsed: true,
    reason: 'Auto provider routing is planned, but disabled in this mock build.'
  });
}

function buildDecision({
  requestedMode,
  resolvedMode,
  fallbackUsed,
  futureOcrProvider = null,
  futureAnalysisProvider = null,
  reason
}) {
  return {
    requestedMode,
    resolvedMode,
    ocrProvider: OcrProviderName.MOCK_OCR,
    analysisProvider: AnalysisProviderName.MOCK_AI,
    futureOcrProvider,
    futureAnalysisProvider,
    realProvidersEnabled: false,
    providerRoutingReady: true,
    fallbackUsed,
    reason
  };
}

function normalizeProviderMode(value) {
  if (!value || typeof value !== 'string') {
    return defaultProviderMode;
  }

  const normalized = value.toLowerCase();
  return supportedProviderModes.includes(normalized)
    ? normalized
    : defaultProviderMode;
}

module.exports = {
  ProviderMode,
  defaultProviderMode,
  resolveProviderRoutingDecision,
  supportedProviderModes
};
