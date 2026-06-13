# Analysis Providers

This folder is a skeleton for backend menu analysis adapters.

Current status:

- `mockMenuAnalysisProvider` is deterministic and local-only.
- `analysisProviderRegistry` selects the active analysis provider.
- `ANALYSIS_PROVIDER` defaults to `mock_ai`.
- `qwen_analysis_skeleton`, `deepseek_analysis_skeleton`, and `openai_analysis_skeleton` are disabled placeholders.
- Empty `ANALYSIS_PROVIDER` values safely use `mock_ai`.
- Unknown `ANALYSIS_PROVIDER` values return `ANALYSIS_PROVIDER_INVALID`.
- Disabled skeleton providers return `ANALYSIS_PROVIDER_NOT_CONFIGURED`.
- No provider makes network calls.
- No API keys or secrets are required.

Future analysis providers should keep secrets on the backend and return the same basic shape: provider, mode, confidence, dishes, and warnings.
