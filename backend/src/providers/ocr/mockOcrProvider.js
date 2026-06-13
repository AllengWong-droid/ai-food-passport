const { OcrProviderMode, OcrProviderName } = require('./ocrProviderTypes');

async function extractMenuText(requestBody = {}) {
  const scan = requestBody.scan || {};
  const sourceText = requestBody.ocrResult?.rawText;

  return {
    provider: OcrProviderName.MOCK_OCR,
    mode: OcrProviderMode.MOCK,
    text: sourceText || mockTextForCurrency(scan.localCurrency),
    languageHints: languageHintsForCurrency(scan.localCurrency),
    confidence: 0.98,
    warnings: []
  };
}

function mockTextForCurrency(localCurrency) {
  switch ((localCurrency || '').toUpperCase()) {
    case 'TWD':
      return 'Beef Noodle Soup NT$180\nStir-Fried Greens NT$120';
    case 'USD':
      return 'Fish and Chips $14.90\nPeanut Sesame Slaw $12';
    case 'EUR':
      return 'Margherita Pizza EUR 12\nTruffle Pasta EUR 18';
    case 'JPY':
    default:
      return 'Tonkotsu Ramen ¥980\nMiso Katsu Skewers ¥800';
  }
}

function languageHintsForCurrency(localCurrency) {
  switch ((localCurrency || '').toUpperCase()) {
    case 'TWD':
      return ['zh-Hant'];
    case 'USD':
    case 'EUR':
      return ['en'];
    case 'JPY':
    default:
      return ['ja'];
  }
}

module.exports = {
  extractMenuText
};
