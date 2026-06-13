const mockOcrProvider = require('./mockOcrProvider');
const qwenOcrProviderSkeleton = require('./qwenOcrProviderSkeleton');
const googleVisionOcrProviderSkeleton = require('./googleVisionOcrProviderSkeleton');
const openAiVisionOcrProviderSkeleton = require('./openAiVisionOcrProviderSkeleton');
const { OcrProviderName } = require('./ocrProviderTypes');

const providers = {
  [OcrProviderName.MOCK_OCR]: {
    providerName: OcrProviderName.MOCK_OCR,
    realOcrEnabled: false,
    extractMenuText: mockOcrProvider.extractMenuText
  },
  [OcrProviderName.QWEN_OCR_SKELETON]: qwenOcrProviderSkeleton,
  [OcrProviderName.GOOGLE_VISION_SKELETON]: googleVisionOcrProviderSkeleton,
  [OcrProviderName.OPENAI_VISION_SKELETON]: openAiVisionOcrProviderSkeleton
};

function getActiveOcrProviderName() {
  const configuredProvider = process.env.OCR_PROVIDER || OcrProviderName.MOCK_OCR;
  return providers[configuredProvider]
    ? configuredProvider
    : OcrProviderName.MOCK_OCR;
}

function getActiveOcrProvider() {
  return providers[getActiveOcrProviderName()];
}

function getAvailableOcrProviders() {
  return Object.keys(providers);
}

function isRealOcrEnabled() {
  return getActiveOcrProvider().realOcrEnabled === true;
}

module.exports = {
  getActiveOcrProvider,
  getActiveOcrProviderName,
  getAvailableOcrProviders,
  isRealOcrEnabled
};
