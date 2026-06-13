const mockOcrProvider = require('./mockOcrProvider');
const qwenOcrProvider = require('./qwenOcrProvider');
const qwenOcrProviderSkeleton = require('./qwenOcrProviderSkeleton');
const googleVisionOcrProviderSkeleton = require('./googleVisionOcrProviderSkeleton');
const openAiVisionOcrProviderSkeleton = require('./openAiVisionOcrProviderSkeleton');
const { OcrProviderName } = require('./ocrProviderTypes');
const { createInvalidOcrProviderError } = require('./disabledOcrProviderError');

const providers = {
  [OcrProviderName.MOCK_OCR]: {
    providerName: OcrProviderName.MOCK_OCR,
    realOcrEnabled: false,
    extractMenuText: mockOcrProvider.extractMenuText
  },
  [OcrProviderName.QWEN_OCR]: qwenOcrProvider,
  [OcrProviderName.QWEN_OCR_SKELETON]: qwenOcrProviderSkeleton,
  [OcrProviderName.GOOGLE_VISION_SKELETON]: googleVisionOcrProviderSkeleton,
  [OcrProviderName.OPENAI_VISION_SKELETON]: openAiVisionOcrProviderSkeleton
};

function getConfiguredOcrProviderName() {
  return (process.env.OCR_PROVIDER || '').trim();
}

function getOcrProviderConfigStatus() {
  const configuredProvider = getConfiguredOcrProviderName();
  const activeProvider = configuredProvider || OcrProviderName.MOCK_OCR;
  const configWarnings = [];

  if (!configuredProvider) {
    configWarnings.push('OCR_PROVIDER not set; using mock_ocr.');
  }

  if (!providers[activeProvider]) {
    return {
      configuredOcrProvider: configuredProvider,
      activeOcrProvider: null,
      availableOcrProviders: getAvailableOcrProviders(),
      realOcrEnabled: false,
      providerRoutingReady: true,
      configValid: false,
      configWarnings: [`Unsupported OCR_PROVIDER: ${configuredProvider}.`]
    };
  }

  return {
    configuredOcrProvider: configuredProvider || null,
    activeOcrProvider: activeProvider,
    availableOcrProviders: getAvailableOcrProviders(),
    realOcrEnabled: providers[activeProvider].realOcrEnabled === true,
    providerRoutingReady: true,
    configValid: true,
    configWarnings
  };
}

function getActiveOcrProviderName() {
  const status = getOcrProviderConfigStatus();
  if (!status.configValid) {
    throw createInvalidOcrProviderError(status.configuredOcrProvider);
  }

  return status.activeOcrProvider;
}

function getActiveOcrProvider() {
  return providers[getActiveOcrProviderName()];
}

function getAvailableOcrProviders() {
  return Object.keys(providers);
}

function isRealOcrEnabled() {
  const status = getOcrProviderConfigStatus();
  return status.configValid && status.realOcrEnabled === true;
}

module.exports = {
  getActiveOcrProvider,
  getActiveOcrProviderName,
  getAvailableOcrProviders,
  getConfiguredOcrProviderName,
  getOcrProviderConfigStatus,
  isRealOcrEnabled
};
