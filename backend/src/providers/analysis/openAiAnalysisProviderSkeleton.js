const { AnalysisProviderName } = require('./analysisProviderTypes');
const { createDisabledAnalysisProviderError } = require('./disabledAnalysisProviderError');

async function analyzeMenuText() {
  throw createDisabledAnalysisProviderError(AnalysisProviderName.OPENAI_ANALYSIS_SKELETON);
}

module.exports = {
  providerName: AnalysisProviderName.OPENAI_ANALYSIS_SKELETON,
  realAnalysisEnabled: false,
  analyzeMenuText
};
