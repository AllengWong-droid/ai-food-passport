const OcrProviderMode = Object.freeze({
  MOCK: 'mock'
});

const OcrProviderName = Object.freeze({
  MOCK_OCR: 'mock_ocr'
});

const OcrDebugScenario = Object.freeze({
  SUCCESS: 'ocr_success',
  LOW_CONFIDENCE: 'ocr_low_confidence',
  EMPTY_TEXT: 'ocr_empty_text',
  FAILURE: 'ocr_failure'
});

const OcrWarningCode = Object.freeze({
  LOW_CONFIDENCE: 'LOW_OCR_CONFIDENCE',
  EMPTY_TEXT: 'OCR_EMPTY_TEXT'
});

module.exports = {
  OcrProviderMode,
  OcrProviderName,
  OcrDebugScenario,
  OcrWarningCode
};
