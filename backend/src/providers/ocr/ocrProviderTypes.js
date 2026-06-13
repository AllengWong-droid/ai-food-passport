const OcrProviderMode = Object.freeze({
  MOCK: 'mock',
  OCR: 'ocr'
});

const OcrProviderName = Object.freeze({
  MOCK_OCR: 'mock_ocr',
  QWEN_OCR: 'qwen_ocr',
  QWEN_OCR_SKELETON: 'qwen_ocr_skeleton',
  GOOGLE_VISION_SKELETON: 'google_vision_skeleton',
  OPENAI_VISION_SKELETON: 'openai_vision_skeleton'
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
