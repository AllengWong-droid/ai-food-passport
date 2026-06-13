const { extractMenuText } = require('../providers/ocr/mockOcrProvider');
const { analyzeMenuText } = require('../providers/analysis/mockMenuAnalysisProvider');

async function buildMockAnalyzeMenuResponse(requestBody = {}, latencyMs = 0) {
  const ocr = await extractMenuText(requestBody);
  const analysis = await analyzeMenuText({ requestBody, ocrResult: ocr });
  const warnings = [
    ...(ocr.warnings || []),
    ...(analysis.warnings || [])
  ];

  return {
    routing: {
      mode: 'mock',
      ocrProvider: ocr.provider,
      ocrMode: ocr.mode,
      ocrConfidence: ocr.confidence,
      ocrWarnings: ocr.warnings || [],
      analysisProvider: analysis.provider,
      analysisMode: analysis.mode,
      analysisConfidence: analysis.confidence,
      analysisWarnings: analysis.warnings || [],
      warnings,
      fallbackUsed: false,
      latencyMs
    },
    ocr,
    dishes: analysis.dishes
  };
}

module.exports = { buildMockAnalyzeMenuResponse };
