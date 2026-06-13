function createDisabledAnalysisProviderError(provider) {
  const error = new Error('Analysis provider is not configured.');
  error.code = 'ANALYSIS_PROVIDER_NOT_CONFIGURED';
  error.provider = provider;
  return error;
}

function createInvalidAnalysisProviderError(provider) {
  const error = new Error('Analysis provider is invalid.');
  error.code = 'ANALYSIS_PROVIDER_INVALID';
  error.provider = provider;
  return error;
}

module.exports = {
  createDisabledAnalysisProviderError,
  createInvalidAnalysisProviderError
};
