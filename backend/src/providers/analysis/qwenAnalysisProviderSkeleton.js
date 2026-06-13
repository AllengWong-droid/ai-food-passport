/**
 * qwenAnalysisProviderSkeleton.js — SUPERSEDED
 *
 * This skeleton has been superseded by qwenAnalysisProvider.js (Phase 12F).
 * The skeleton remains registered under AnalysisProviderName.QWEN_ANALYSIS_SKELETON
 * for backward compatibility.
 *
 * Use AnalysisProviderName.QWEN_ANALYSIS ('qwen_analysis') to access the
 * real adapter scaffold (qwenAnalysisProvider.js) which supports fake
 * transport testing and config-driven enablement.
 */

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
