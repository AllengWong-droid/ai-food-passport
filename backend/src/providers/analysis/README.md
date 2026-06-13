# Analysis Providers

This folder contains backend menu analysis adapters.

Current status:

- `mockMenuAnalysisProvider` is deterministic and local-only.
- `analysisProviderRegistry` selects the active analysis provider.
- `ANALYSIS_PROVIDER` defaults to `mock_ai`.
- `qwenAnalysisProvider` (Phase 12F) is a disabled adapter scaffold that conforms to the analysis provider contract. It supports fake transport / unit testing but does NOT call the real Qwen API yet.
- `qwen_analysis_skeleton`, `deepseek_analysis_skeleton`, and `openai_analysis_skeleton` are disabled placeholders.
- Empty `ANALYSIS_PROVIDER` values safely use `mock_ai`.
- Unknown `ANALYSIS_PROVIDER` values return `ANALYSIS_PROVIDER_INVALID`.
- Disabled providers return `ANALYSIS_PROVIDER_NOT_CONFIGURED`.
- No provider makes real external network calls.
- No API keys or secrets are required.

## Qwen Analysis Provider (Phase 12F)

File: `qwenAnalysisProvider.js`

- Conforms to the analysis provider contract (`analysisProviderContract.js`).
- Config-driven enablement via env vars: `QWEN_ANALYSIS_PROVIDER_ENABLED`, `QWEN_API_KEY`, `QWEN_ANALYSIS_MODEL`, `QWEN_ANALYSIS_BASE_URL`.
- Fake transport test seam: `createFakeQwenAnalysisTransport()` allows unit tests to pass simulated Qwen-like responses without network calls.
- `realAnalysisEnabled` returns `false` by default (all env gates must be satisfied).
- Selecting Qwen analysis without full config returns `ANALYSIS_PROVIDER_NOT_CONFIGURED`.
- Real Qwen API integration requires an explicit future phase with backend-only secret config, timeout, cost guard, rate limit, and deployment env vars.

Future analysis providers should keep secrets on the backend and return the same basic shape: provider, mode, confidence, dishes, and warnings.
