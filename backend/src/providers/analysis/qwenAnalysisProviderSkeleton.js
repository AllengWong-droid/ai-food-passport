const { AnalysisProviderName } = require('./analysisProviderTypes');
const { createDisabledAnalysisProviderError } = require('./disabledAnalysisProviderError');

async function analyzeMenuText() {
  throw createDisabledAnalysisProviderError(AnalysisProviderName.QWEN_ANALYSIS_SKELETON);
}

module.exports = {
  providerName: AnalysisProviderName.QWEN_ANALYSIS_SKELETON,
  realAnalysisEnabled: false,
  analyzeMenuText
};
