const { extractMenuText } = require('../providers/ocr/mockOcrProvider');
const { analyzeMenuText } = require('../providers/analysis/mockMenuAnalysisProvider');

async function buildMockAnalyzeMenuResponse(requestBody = {}, latencyMs = 0) {
  const ocr = await extractMenuText(requestBody);
  const analysis = await analyzeMenuText({ requestBody, ocrResult: ocr });

  return {
    routing: {
      mode: 'mock',
      ocrProvider: ocr.provider,
      ocrMode: ocr.mode,
      ocrConfidence: ocr.confidence,
      analysisProvider: analysis.provider,
      analysisMode: analysis.mode,
      fallbackUsed: false,
      latencyMs
    },
    ocr,
    dishes: analysis.dishes
  };
}

module.exports = { buildMockAnalyzeMenuResponse };
