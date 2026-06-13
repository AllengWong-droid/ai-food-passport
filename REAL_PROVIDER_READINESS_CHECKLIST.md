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
- [ ] Qwen OCR adapter scaffold exists (`qwenOcrProvider.js`) with config validation, fake transport seam, and 34 unit tests.
- [ ] Qwen OCR real transport implemented (`qwenOcrTransport.js`) behind explicit env gates:
  - Requires `OCR_PROVIDER=qwen_ocr` + `QWEN_OCR_PROVIDER_ENABLED=true` + valid `QWEN_API_KEY`.
  - Timeout via `PROVIDER_TIMEOUT_MS`.
  - Safe error mapping: network errors, non-2xx, malformed response → `OCR_FAILED`.
  - 34 offline transport unit tests.
- [ ] Manual smoke test guide available (`backend/QWEN_OCR_MANUAL_SMOKE_TEST.md`).
- [ ] Qwen adapter remains disabled by default (`realOcrEnabled: false`).
- [ ] Qwen adapter conforms to OCR provider contract (normalizeOcrResult/normalizeOcrError).
- [ ] No real provider calls, API keys, or secrets have been added.

## Analysis Provider Contract

- [ ] `analysisProviderContract.js` defines the standardized analysis result shape.
- [ ] `normalizeAnalysisResult()` sanitises raw provider output before it reaches any API response.
- [ ] `normalizeAnalysisError()` maps errors to safe codes without leaking stack traces or secrets.
- [ ] 101 unit tests pass for contract normalization, leakage prevention, and edge cases.
- [ ] Dish normalization produces BOTH new standardized fields AND backward-compatible mock fields.
- [ ] Scores clamped to [0, 100]; confidence clamped to [0, 1]; prices clamped to [0, PRICE_MAX].
- [ ] Warnings filtered to known `AnalysisWarningCode` values and de-duplicated.
- [ ] `rawMetadata` stripped to a whitelist of safe keys only.
- [ ] `stripForbiddenFields()` removes stack, apiKey, bearer, token, secret, rawPrompt, rawOcrText, requestHeaders, responseHeaders, completionPayload, image, base64.
- [ ] `sanitizeMessage()` redacts API keys (sk-...), JWTs, base64 blobs, Bearer tokens from error messages.
- [ ] Provider selection documented (`backend/ANALYSIS_PROVIDER_SELECTION.md`) with Qwen/DeepSeek/OpenAI tradeoff analysis.
- [ ] First real analysis provider candidate identified (Qwen recommended for china-friendly deployment).
- [ ] `AnalysisProviderMode.ANALYSIS` added to types for future real providers.
- [ ] Qwen analysis provider adapter scaffold exists (`qwenAnalysisProvider.js`) — conforms to contract, fake transport seam, 58 unit tests, disabled by default.
- [ ] Qwen analysis real transport implemented (`qwenAnalysisTransport.js`) behind explicit env gates:
  - Requires `ANALYSIS_PROVIDER=qwen_analysis` + `QWEN_ANALYSIS_PROVIDER_ENABLED=true` + valid `QWEN_API_KEY`.
  - Timeout via `PROVIDER_TIMEOUT_MS`.
  - Safe error mapping: network errors, non-2xx, malformed response → `ANALYSIS_FAILED`.
  - 35 offline transport unit tests.
- [ ] Manual smoke test guide available (`backend/QWEN_ANALYSIS_MANUAL_SMOKE_TEST.md`).
- [ ] `AnalysisProviderName.QWEN_ANALYSIS` ('qwen_analysis') registered in analysis provider registry.
- [ ] `mock_ai` remains the only active default analysis provider.

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

## Dry-Run Gate Verification (Phase 12H)

- [ ] E2E dry-run contract tests exist (`backend/tests/contract/realProviderGate.test.js`, 68 tests).
- [ ] Default pipeline (mock_ocr + mock_ai) verified unchanged by dry-run tests.
- [ ] OCR gate tests: `qwen_ocr` without key → `OCR_PROVIDER_NOT_CONFIGURED`, no leaks.
- [ ] Analysis gate tests: `qwen_analysis` without key → `ANALYSIS_PROVIDER_NOT_CONFIGURED`, no leaks.
- [ ] Placeholder key scenarios: both OCR and analysis gates reject `sk-placeholder` safely.
- [ ] Combined gate scenario: both providers set with placeholder key → OCR fails first safely.
- [ ] Invalid provider scenarios: `unknown_provider` → controlled invalid-provider errors.
- [ ] Error hygiene verified: no stack traces, no API keys, no raw responses, no base64, no Authorization headers in any gate error.
- [ ] Health metadata verified: `qwen_ocr` and `qwen_analysis` appear in available providers, `realOcrEnabled=false`, `realAnalysisEnabled=false`, `realProvidersEnabled=false`, `productionReady=false`.
- [ ] Cross-scenario env contamination verified: default pipeline works after all gate tests.
- [ ] Test helper enhanced: `startServer(envOverrides)` supports multi-scenario contract testing.
- [ ] All 509 tests pass (contract + unit + gate dry-run). No real network calls in any test.

- [ ] `OCR_PROVIDER` is set intentionally.
- [ ] `ANALYSIS_PROVIDER` is set intentionally.
- [ ] Provider API key variables are configured only in the backend environment.
- [ ] Timeout, retry, daily limit, and monthly budget variables are configured.
- [ ] CORS, authentication, and rate limiting are production-reviewed.

## Deployment Target Selection (Phase 13A)

- [ ] Deployment target comparison exists (`backend/DEPLOYMENT_TARGETS.md`) — Render, Railway, Fly.io, VPS, Cloudflare Workers compared.
- [ ] Recommended first deployment target (Render) documented with rationale.
- [ ] Deployment readiness doc updated (`backend/DEPLOYMENT_READINESS.md`) with required env vars, startup commands, health checks, secret handling, cost/rate-limit controls.
- [ ] Production env vars documented: `NODE_ENV`, `PORT`, `HOST`, `ALLOWED_ORIGINS`, `PUBLIC_BACKEND_URL`, `REQUEST_BODY_LIMIT`, provider safety vars, Qwen OCR vars, Qwen Analysis vars.
- [ ] Flutter production config rule stated: `BACKEND_BASE_URL` is the only backend-dependent config; no provider keys in Flutter.
- [ ] Future deployment smoke checklist documented (deploy → /health → CORS → body limit → no stack traces → no secrets in logs → only then enable real providers).
- [ ] No deployment performed (this phase is doc/config planning only).
- [ ] No runtime behavior changed.
- [ ] No real provider calls, no API keys, no secrets added.
- [ ] `productionReady` remains `false`.

## Render Blueprint and Dry-Run (Phase 13B)

- [ ] `backend/render.yaml` exists with safe placeholder-only values.
- [ ] `render.yaml` does NOT contain `QWEN_API_KEY`.
- [ ] `render.yaml` has `QWEN_OCR_PROVIDER_ENABLED=false` and `QWEN_ANALYSIS_PROVIDER_ENABLED=false`.
- [ ] `render.yaml` has `OCR_PROVIDER=mock_ocr` and `ANALYSIS_PROVIDER=mock_ai`.
- [ ] `render.yaml` has `autoDeployTrigger: 'off'` (safe default).
- [ ] `render.yaml` uses `sync: false` for `ALLOWED_ORIGINS` and `PUBLIC_BACKEND_URL`.
- [ ] `backend/RENDER_DEPLOYMENT_DRY_RUN.md` exists (8-part dry-run checklist).
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 0 documents Blueprint vs. Manual Dashboard decision.
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 1 has local preflight commands.
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 2 has Render Dashboard manual setup values.
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 3 has first-deploy smoke tests (mock providers only).
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 4 verifies real providers remain disabled.
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 5 documents future steps to enable real Qwen providers.
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 6 has rollback plan.
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 7 has Render free tier caveats.
- [ ] `RENDER_DEPLOYMENT_DRY_RUN.md` Part 8 has dry-run validation checklist.
- [ ] No deployment was performed (this phase is doc/config only).
- [ ] No runtime behavior changed.
- [ ] No real provider calls, no API keys, no secrets added.
- [ ] `productionReady` remains `false`.

## Rollback Plan

- [ ] Real provider can be disabled quickly.
- [ ] Backend can return to `mock_ocr` and `mock_ai`.
- [ ] Flutter default local mock flow remains unaffected.
- [ ] Incident notes include how to rotate keys.
- [ ] Provider dashboard access and key rotation owners are identified.
