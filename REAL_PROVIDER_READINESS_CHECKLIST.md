# Real Provider Readiness Checklist

Use this checklist before enabling any real OCR, Qwen, DeepSeek, OpenAI, Google Vision, exchange-rate, or other provider integration.

**Prerequisite**: The backend deployment readiness skeleton must be completed first. See `backend/DEPLOYMENT_READINESS.md` for the full pre-deployment checklist. The OCR provider contract must be defined and tested. See `backend/src/providers/ocr/ocrProviderContract.js` and `backend/OCR_PROVIDER_SELECTION.md`.

## OCR Provider Contract

- [ ] `ocrProviderContract.js` defines the standardized OCR result shape.
- [ ] `normalizeOcrResult()` sanitises raw provider output before it reaches any API response.
- [ ] `normalizeOcrError()` maps errors to safe codes without leaking stack traces or secrets.
- [ ] 80 unit tests pass for contract normalization, leakage prevention, and edge cases.
- [ ] Provider selection documented (`backend/OCR_PROVIDER_SELECTION.md`) with tradeoff analysis.
- [ ] First real OCR provider candidate identified (Qwen OCR/VL recommended for china mode).
- [ ] No real provider calls, API keys, or secrets have been added.

## Secret Storage

- [ ] No provider API keys are stored in Flutter code.
- [ ] No provider API keys are committed to Git.
- [ ] Local `.env` exists only on developer machines.
- [ ] Production secrets are stored in deployment environment variables or a managed secret store.
- [ ] `.env.example` contains placeholders only.
- [ ] Secret scanning has been run before release.

## Backend-Only Key Handling

- [ ] Flutter calls only the backend proxy.
- [ ] Provider SDKs or HTTP calls exist only in backend code.
- [ ] Backend config validation rejects missing or invalid provider settings.
- [ ] Provider keys alone do not activate real calls without an explicit enable flag or implementation phase.

## Timeout And Retry Policy

- [ ] `PROVIDER_TIMEOUT_MS` is configured.
- [ ] Every provider call has a timeout.
- [ ] `PROVIDER_MAX_RETRIES` defaults to `0`.
- [ ] Retry behavior is explicit, bounded, and tested before enabling.
- [ ] Timeout failures map to friendly error envelopes.

## Rate And Cost Protection

- [ ] `PROVIDER_DAILY_REQUEST_LIMIT` is configured before production.
- [ ] `PROVIDER_MONTHLY_BUDGET_USD` is configured before production.
- [ ] Cost alerts or provider dashboard limits are configured.
- [ ] Abuse protection and per-client rate limits are planned.
- [ ] Provider usage is monitored without logging secrets or raw images.

## Logging Redaction

- [ ] Logs redact API keys and authorization headers.
- [ ] Logs avoid raw menu image data.
- [ ] Logs avoid full raw OCR text unless explicitly needed in a secure debug environment.
- [ ] Logs avoid sensitive allergy or preference data where possible.
- [ ] User-facing responses never include stack traces.

## Fallback Behavior

- [ ] OCR provider failure maps to friendly OCR recovery.
- [ ] Analysis provider failure maps to friendly analysis recovery.
- [ ] Provider unavailable maps to friendly recovery.
- [ ] Empty OCR text maps to no-readable-text recovery.
- [ ] Empty analysis result maps to no-dishes-found recovery.
- [ ] Continue with sample result still works.

## QA Scenarios

- [ ] Default local mock still works without backend.
- [ ] Backend Mock Mode normal success works.
- [ ] Real provider disabled config returns controlled not-configured errors.
- [ ] Invalid provider config returns controlled invalid-provider errors.
- [ ] Provider timeout is simulated and handled.
- [ ] Provider rate limit is simulated and handled.
- [ ] Low confidence and low quality responses are handled.
- [ ] No raw provider errors or stack traces appear in normal UI.

## Deployment Environment

- [ ] `OCR_PROVIDER` is set intentionally.
- [ ] `ANALYSIS_PROVIDER` is set intentionally.
- [ ] Provider API key variables are configured only in the backend environment.
- [ ] Timeout, retry, daily limit, and monthly budget variables are configured.
- [ ] CORS, authentication, and rate limiting are production-reviewed.

## Rollback Plan

- [ ] Real provider can be disabled quickly.
- [ ] Backend can return to `mock_ocr` and `mock_ai`.
- [ ] Flutter default local mock flow remains unaffected.
- [ ] Incident notes include how to rotate keys.
- [ ] Provider dashboard access and key rotation owners are identified.
