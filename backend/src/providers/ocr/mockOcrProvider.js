const {
  OcrDebugScenario,
  OcrProviderMode,
  OcrProviderName,
  OcrWarningCode
} = require('./ocrProviderTypes');

async function extractMenuText(requestBody = {}) {
  const scan = requestBody.scan || {};
  const sourceText = requestBody.ocrResult?.rawText;
  const debugScenario = normalizeDebugScenario(requestBody.debugScenario);

  if (debugScenario === OcrDebugScenario.FAILURE) {
    const error = new Error('Mock OCR failure scenario requested.');
    error.code = 'OCR_FAILED';
    throw error;
  }

  if (debugScenario === OcrDebugScenario.EMPTY_TEXT) {
    return buildOcrResult({
      text: '',
      languageHints: languageHintsForCurrency(scan.localCurrency),
      confidence: 0,
      warnings: [OcrWarningCode.EMPTY_TEXT]
    });
  }

  const isLowConfidence = debugScenario === OcrDebugScenario.LOW_CONFIDENCE;

  return buildOcrResult({
    text: sourceText || mockTextForCurrency(scan.localCurrency),
    languageHints: languageHintsForCurrency(scan.localCurrency),
    confidence: isLowConfidence ? 0.42 : 0.98,
    warnings: isLowConfidence ? [OcrWarningCode.LOW_CONFIDENCE] : []
  });
}

function buildOcrResult({ text, languageHints, confidence, warnings }) {
  return {
    provider: OcrProviderName.MOCK_OCR,
    mode: OcrProviderMode.MOCK,
    text,
    languageHints,
    confidence,
    warnings
  };
}

function normalizeDebugScenario(value) {
  if (!value) {
    return OcrDebugScenario.SUCCESS;
  }

  return Object.values(OcrDebugScenario).includes(value)
    ? value
    : OcrDebugScenario.SUCCESS;
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
      return 'Tonkotsu Ramen JPY 980\nMiso Katsu Skewers JPY 800';
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
