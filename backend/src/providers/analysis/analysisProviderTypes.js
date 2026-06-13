const AnalysisProviderMode = Object.freeze({
  MOCK: 'mock'
});

const AnalysisProviderName = Object.freeze({
  MOCK_AI: 'mock_ai'
});

const AnalysisDebugScenario = Object.freeze({
  SUCCESS: 'analysis_success',
  EMPTY_RESULT: 'analysis_empty_result',
  LOW_QUALITY: 'analysis_low_quality',
  FAILURE: 'analysis_failure'
});

const AnalysisWarningCode = Object.freeze({
  EMPTY_RESULT: 'ANALYSIS_EMPTY_RESULT',
  LOW_CONFIDENCE: 'LOW_ANALYSIS_CONFIDENCE',
  NEEDS_REVIEW: 'NEEDS_REVIEW'
});

module.exports = {
  AnalysisProviderMode,
  AnalysisProviderName,
  AnalysisDebugScenario,
  AnalysisWarningCode
};
