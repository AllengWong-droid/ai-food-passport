const mockMenuAnalysisProvider = require('./mockMenuAnalysisProvider');
const qwenAnalysisProviderSkeleton = require('./qwenAnalysisProviderSkeleton');
const deepSeekAnalysisProviderSkeleton = require('./deepSeekAnalysisProviderSkeleton');
const openAiAnalysisProviderSkeleton = require('./openAiAnalysisProviderSkeleton');
const { AnalysisProviderName } = require('./analysisProviderTypes');
const { createInvalidAnalysisProviderError } = require('./disabledAnalysisProviderError');

const providers = {
  [AnalysisProviderName.MOCK_AI]: {
    providerName: AnalysisProviderName.MOCK_AI,
    realAnalysisEnabled: false,
    analyzeMenuText: mockMenuAnalysisProvider.analyzeMenuText
  },
  [AnalysisProviderName.QWEN_ANALYSIS_SKELETON]: qwenAnalysisProviderSkeleton,
  [AnalysisProviderName.DEEPSEEK_ANALYSIS_SKELETON]: deepSeekAnalysisProviderSkeleton,
  [AnalysisProviderName.OPENAI_ANALYSIS_SKELETON]: openAiAnalysisProviderSkeleton
};

function getConfiguredAnalysisProviderName() {
  return (process.env.ANALYSIS_PROVIDER || '').trim();
}

function getAnalysisProviderConfigStatus() {
  const configuredProvider = getConfiguredAnalysisProviderName();
  const activeProvider = configuredProvider || AnalysisProviderName.MOCK_AI;
  const configWarnings = [];

  if (!configuredProvider) {
    configWarnings.push('ANALYSIS_PROVIDER not set; using mock_ai.');
  }

  if (!providers[activeProvider]) {
    return {
      configuredAnalysisProvider: configuredProvider,
      activeAnalysisProvider: null,
      availableAnalysisProviders: getAvailableAnalysisProviders(),
      realAnalysisEnabled: false,
      providerRoutingReady: true,
      configValid: false,
      configWarnings: [`Unsupported ANALYSIS_PROVIDER: ${configuredProvider}.`]
    };
  }

  return {
    configuredAnalysisProvider: configuredProvider || null,
    activeAnalysisProvider: activeProvider,
    availableAnalysisProviders: getAvailableAnalysisProviders(),
    realAnalysisEnabled: providers[activeProvider].realAnalysisEnabled === true,
    providerRoutingReady: true,
    configValid: true,
    configWarnings
  };
}

function getActiveAnalysisProviderName() {
  const status = getAnalysisProviderConfigStatus();
  if (!status.configValid) {
    throw createInvalidAnalysisProviderError(status.configuredAnalysisProvider);
  }

  return status.activeAnalysisProvider;
}

function getActiveAnalysisProvider() {
  return providers[getActiveAnalysisProviderName()];
}

function getAvailableAnalysisProviders() {
  return Object.keys(providers);
}

function isRealAnalysisEnabled() {
  const status = getAnalysisProviderConfigStatus();
  return status.configValid && status.realAnalysisEnabled === true;
}

module.exports = {
  getActiveAnalysisProvider,
  getActiveAnalysisProviderName,
  getAnalysisProviderConfigStatus,
  getAvailableAnalysisProviders,
  getConfiguredAnalysisProviderName,
  isRealAnalysisEnabled
};
