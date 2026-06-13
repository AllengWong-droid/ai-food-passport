const { OcrProviderName } = require('./ocrProviderTypes');
const { createDisabledOcrProviderError } = require('./disabledOcrProviderError');

async function extractMenuText() {
  throw createDisabledOcrProviderError(OcrProviderName.GOOGLE_VISION_SKELETON);
}

module.exports = {
  providerName: OcrProviderName.GOOGLE_VISION_SKELETON,
  realOcrEnabled: false,
  extractMenuText
};
