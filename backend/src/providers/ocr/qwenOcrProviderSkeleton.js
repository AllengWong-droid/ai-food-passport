const { OcrProviderName } = require('./ocrProviderTypes');
const { createDisabledOcrProviderError } = require('./disabledOcrProviderError');

async function extractMenuText() {
  throw createDisabledOcrProviderError(OcrProviderName.QWEN_OCR_SKELETON);
}

module.exports = {
  providerName: OcrProviderName.QWEN_OCR_SKELETON,
  realOcrEnabled: false,
  extractMenuText
};
