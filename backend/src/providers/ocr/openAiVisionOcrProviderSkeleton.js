const { OcrProviderName } = require('./ocrProviderTypes');
const { createDisabledOcrProviderError } = require('./disabledOcrProviderError');

async function extractMenuText() {
  throw createDisabledOcrProviderError(OcrProviderName.OPENAI_VISION_SKELETON);
}

module.exports = {
  providerName: OcrProviderName.OPENAI_VISION_SKELETON,
  realOcrEnabled: false,
  extractMenuText
};
