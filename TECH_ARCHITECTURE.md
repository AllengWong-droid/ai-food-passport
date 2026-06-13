# AI Food Passport - Technical Architecture

## Current MVP Alpha Stack

- Flutter
- Dart
- Riverpod
- GoRouter
- image_picker
- shared_preferences
- Node.js mock backend server

## Flutter Architecture

The app uses a feature-based structure with shared domain models and repository interfaces.

Key folders:

- `lib/features/shared/domain/models/`
- `lib/features/shared/domain/repositories/`
- `lib/features/shared/data/`
- `lib/features/shared/data/ai/`
- `lib/features/shared/presentation/`
- `lib/features/scan/presentation/`
- `lib/features/results/presentation/`
- `lib/features/passport/presentation/`

## Active Default Flow

The default Flutter app does not need the backend:

```text
Scan
-> local Mock OCR
-> local MockAiRepository
-> Results
-> Dish Detail
```

Backend Mock Mode is disabled by default.

## Optional Developer Backend Mock Flow

When Backend Mock Mode is enabled in Profile during debug builds:

```text
Flutter Profile provider mode
-> Flutter Scan
-> local Mock OCR
-> BackendMockMenuAnalysisRepository
-> POST /api/analyze-menu
-> backend provider routing decision
-> backend OCR provider registry
-> backend mock OCR provider
-> backend analysis provider registry
-> backend mock analysis provider
-> standardized response envelope
-> Flutter Results / Recovery UX
-> collapsed Flutter AI Debug routing metadata
```

The Backend Scenario selector can send a `debugScenario` value for controlled local testing. The selected Profile provider mode is sent as `providerMode`. Both values are ignored by the default local mock flow when Backend Mock Mode is off.

## Backend Architecture

Backend files live under `backend/`.

Implemented endpoints:

- `GET /health`
- `POST /api/analyze-menu`

Backend provider folders:

- `backend/src/providers/ocr/`
- `backend/src/providers/analysis/`

OCR provider registry:

- active default: `mock_ocr`
- available skeletons: `qwen_ocr_skeleton`, `google_vision_skeleton`, `openai_vision_skeleton`
- real OCR enabled: `false`

Analysis provider registry:

- active default: `mock_ai`
- available skeletons: `qwen_analysis_skeleton`, `deepseek_analysis_skeleton`, `openai_analysis_skeleton`
- disabled adapter scaffold: `qwen_analysis` (Phase 12F — conforms to contract, fake transport tests, disabled by default)
- analysis provider contract defined (`analysisProviderContract.js`)
- real analysis enabled: `false`

Provider routing decision skeleton:

- supported modes: `mock`, `china`, `global`, `auto`
- default mode: `mock`
- real providers enabled: `false`
- china/global/auto safely resolve to mock metadata in this build
- routing metadata includes requested mode, resolved mode, fallback status, real provider status, readiness, and reason

The backend route is OCR-first:

```text
request validation
-> provider routing decision
-> OCR provider registry
-> mock OCR provider
-> empty/failed OCR handling
-> analysis provider registry
-> mock analysis provider
-> analysis quality/empty/failure handling
-> standardized response envelope
```

Success responses use:

```json
{
  "ok": true,
  "data": {
    "routing": {},
    "ocr": {},
    "dishes": []
  },
  "error": null,
  "routing": {},
  "dishes": []
}
```

Top-level `routing` and `dishes` are kept for Flutter adapter compatibility.

Error responses use:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "OCR_FAILED",
    "message": "Could not read the menu image.",
    "details": null
  }
}
```

## Repository Interfaces

Implemented Flutter repository interfaces:

- `AuthRepository`
- `PassportRepository`
- `ScanRepository`
- `OcrRepository`
- `AiRepository`
- `PriceRepository`

## Active Implementations

- Mock auth/passport/scan repositories
- Mock OCR repository
- Mock AI repository
- Mock price repository
- Local traveler settings controller using `shared_preferences`
- Optional backend mock adapter, disabled by default

## Prepared But Disabled

- `OpenAiMenuAnalysisRepository`
- OpenAI prompt builder/schema/parser
- `BackendMenuAnalysisRepository`
- `MultiProviderMenuAnalysisRepository`
- OCR-first multi-provider routing contract
- Disabled real OCR provider skeletons
- Disabled real analysis provider skeletons

These skeletons do not call real providers and are not active defaults.

## Traveler Settings

Persisted locally:

- Home country
- Home currency
- Output language
- Provider mode

These settings flow into `AiAnalysisRequest`. Home currency affects deterministic mock price conversion. Output language affects local mock helper copy. Provider mode is informational only. In Backend Mock Mode, provider mode is sent to the backend as routing intent and displayed only in collapsed AI Debug.

## Not Yet Implemented

- Firebase Auth
- Firestore
- Firebase Storage
- Firebase Analytics
- Firebase Crashlytics
- Real OCR
- Real Qwen integration
- Real DeepSeek integration
- Real OpenAI integration
- Real production provider routing
- Real exchange-rate API
- Apple/Google in-app purchase
- Production deployment (configuration skeleton only — see `backend/DEPLOYMENT_READINESS.md`)

## Future Architecture Direction

Future real provider calls should go through a backend proxy. API keys must never be stored in Flutter code.

Future routing should remain OCR-first:

1. Image OCR or vision extraction.
2. Structured menu text analysis.
3. Price intelligence and recommendation output.

China mode may later route through Qwen-OCR/Qwen-VL and Qwen or DeepSeek. Global mode may later route through OpenAI or another global provider. This is planned only.

## Secret And Provider Safety Direction

Real provider keys must live in backend environment variables or a managed production secret store. Flutter must never contain provider keys.

`backend/.env.example` contains placeholder-only variables for future providers and provider safety controls. A real `.env` file must remain local and ignored by Git.

Future provider adapters should enforce:

- Provider timeouts.
- No automatic retries by default.
- Friendly standardized failure envelopes.
- No raw provider error leakage.
- No stack traces in user-facing responses.
- Logging redaction for secrets, headers, raw images, and sensitive menu/user data.
- Rate and cost guards before production.

Phase 10B adds backend skeleton modules for this policy:

- `backend/src/config/providerSafetyConfig.js`
- `backend/src/providers/safety/providerSafetyGuards.js`

The safety config appears in `/health`. Rate and cost guards are not enforced in the current mock path.

## Deployment Target Strategy (Phase 13A)

**Recommended first deployment target**: Render (render.com)

See full comparison in `backend/DEPLOYMENT_TARGETS.md`. Key factors:

- True ongoing free tier (750 instance hours/month) — sufficient for TestFlight MVP
- Zero-code-change Node.js deployment (our backend runs as-is)
- Free managed TLS + custom domain
- Simple env var secret management via dashboard
- Built-in health checks on `/health`
- Acceptable China latency (~178 ms)
- Free Postgres for future data persistence
- Sleep after 15 min idle (mitigated with external uptime monitor)

Alternatives evaluated: Railway (no viable free tier), Fly.io (credit card friction for Chinese users, Docker complexity), VPS (monthly cost, manual setup), Cloudflare Workers (requires framework rewrite — incompatible with Node.js `http.createServer`).

**Production env vars documented** in `backend/DEPLOYMENT_READINESS.md`:

- Runtime: `NODE_ENV`, `PORT`, `HOST`, `ALLOWED_ORIGINS`, `PUBLIC_BACKEND_URL`, `REQUEST_BODY_LIMIT`
- Provider safety: `PROVIDER_TIMEOUT_MS`, `PROVIDER_MAX_RETRIES`, `PROVIDER_DAILY_REQUEST_LIMIT`, `PROVIDER_MONTHLY_BUDGET_USD`
- Qwen OCR gates: `OCR_PROVIDER`, `QWEN_OCR_PROVIDER_ENABLED`, `QWEN_API_KEY`, `QWEN_OCR_MODEL`, `QWEN_OCR_BASE_URL`
- Qwen Analysis gates: `ANALYSIS_PROVIDER`, `QWEN_ANALYSIS_PROVIDER_ENABLED`, `QWEN_ANALYSIS_MODEL`, `QWEN_ANALYSIS_BASE_URL`

**Key rules**:
- Flutter production builds must use `BACKEND_BASE_URL=https://your-deployed-backend`
- Flutter must never contain provider API keys
- Provider keys must only live in backend deployment env vars
- Backend `/health` should be checked after deployment
- Contract tests must pass before deployment
- Real providers should remain off until manual smoke test passes
- `productionReady` remains `false` in this phase

Phase 10C adds logging redaction and safe error response utilities:
- `backend/src/utils/redactForLogs.js`
- `backend/src/utils/safeErrorResponse.js`

Phase 11A adds automated contract tests (86 tests, `node:test`):
- `backend/tests/contract/health.test.js`
- `backend/tests/contract/analyzeMenu.test.js`
- `backend/tests/unit/redactForLogs.test.js`
- `backend/tests/unit/safeErrorResponse.test.js`

Phase 11B adds runtime deployment config and deployment readiness skeleton:
- `backend/src/config/runtimeConfig.js` — parses NODE_ENV, PORT, HOST, ALLOWED_ORIGINS, PUBLIC_BACKEND_URL, REQUEST_BODY_LIMIT
- `backend/DEPLOYMENT_READINESS.md` — pre-deployment checklist
- `backend/.env.example` — environment variable exemplar
- CORS headers skeleton in server.js
- `/health` now exposes: `nodeEnv`, `port`, `host`, `corsConfigured`, `allowedOriginsCount`, `productionReady`, `deploymentReadinessReady`
- `productionReady` is always `false` until real providers are configured. `deploymentReadinessReady` is `true`.

Phase 11C implements CORS enforcement and request body limit enforcement:
- `backend/src/utils/corsEnforcement.js` — shared CORS origin validation and preflight handling
- Development: permissive localhost/dev origins; Production: explicit origins only, no wildcard `*`
- OPTIONS preflight: returns 204 with CORS headers for allowed origins, no headers for disallowed
- Request body limit: `REQUEST_BODY_LIMIT` enforced; oversized bodies return `413` with `REQUEST_BODY_TOO_LARGE`
- `/health` now exposes: `corsEnforcementReady`, `requestBodyLimitBytes`, `requestBodyLimitReady`
- Contract tests: 102 tests passing (`npm run test:contract`)

## Phase 11D: Flutter Backend Endpoint Configuration

- `lib/features/shared/data/ai/backend_endpoint_config.dart` — centralized backend URL config
- Reads compile-time `BACKEND_BASE_URL` dart-define
- Falls back to `http://localhost:8787` when the define is absent, empty, or invalid
- Validates: rejects URLs with userinfo, known secret patterns, or non-http(s) schemes
- Exposes `currentBaseUrl` (resolved URL) and `isCustomDefined` (whether dart-define was set)
- `BackendMockMenuAnalysisRepository` uses `BackendEndpointConfig.currentBaseUrl` instead of hardcoded URL
- Debug UI (Results AI Debug, Profile Backend Mock Mode toggle) shows the resolved URL
- Backend Mock Mode remains disabled by default; default local mock still does not require backend
- `BACKEND_BASE_URL` is not a secret — stored as dart-define, safe for debug visibility
- Production builds must use a deployed HTTPS backend URL; Flutter must never contain API keys

## Phase 11E: Flutter Developer Controls Release Safety

- `lib/features/shared/config/developer_controls_config.dart` — centralized gate for developer UI
- `DeveloperControlsConfig.areVisible`: true in debug builds, false in release builds
- `SHOW_DEVELOPER_CONTROLS` dart-define: opt-in override for internal / QA / TestFlight builds
- Controls gated when hidden:
  - Backend Mock Mode toggle (Profile)
  - Backend Scenario selector (Profile)
  - AI Provider Mode dropdown (Profile — future routing, not a user feature)
  - Backend URL debug display (Profile subtitle, Results AI Debug)
  - Results AI Debug / OCR Debug panels
  - Raw backend routing metadata
- Controls that remain visible for all users:
  - Home Country, Home Currency, Output Language (Traveler Locale)
  - Taste & Allergies, Notifications, Email, Travel History
  - Country Stamp Grid, Passport Card, Reset traveler settings
  - "Continue with sample result" error recovery
- `BackendMockModeProvider` defaults to `false` regardless of visibility
- Default local mock app usage still does not require a backend
- `SHOW_DEVELOPER_CONTROLS` is not a secret; does not enable real providers

## Phase 11F: Flutter Config and Release Safety Tests

- Test files: `test/shared/config/backend_endpoint_config_test.dart` (33 tests) and `test/shared/config/developer_controls_config_test.dart` (8 tests) — 41 total.
- **Pure helpers** extracted for testability without compile-time constants:
  - `BackendEndpointConfig.validateAndResolve(String raw, {String fallback})` — resolves raw URL or returns fallback.
  - `BackendEndpointConfig.isSafeBackendBaseUrl(String raw)` — rejects userinfo, secret patterns, non-http schemes.
  - `DeveloperControlsConfig.resolveVisibility({bool isDebug, bool overrideEnabled})` — pure boolean gate.
- Runtime behaviour is **unchanged**: `currentBaseUrl` and `areVisible` delegate to the same pure helpers.
- `BackendEndpointConfig.validateAndResolve` now also rejects URLs with empty host (e.g., `http://`) — stricter edge-case safety.
- Run: `flutter test test/shared/config/` → 41/41 tests passing.
- Backend files unchanged. No secrets or API keys added.

## Phase 12A: Real OCR Provider Contract and Selection Prep

- `backend/src/providers/ocr/ocrProviderContract.js` — Standardised OCR result contract with normalization helpers.
  - `normalizeOcrResult(rawProviderResult)` — sanitises raw provider output into the contract shape. Strips stack traces, API keys, secrets, image/base64 data, raw HTTP responses.
  - `normalizeOcrError(error)` — maps any caught error to a safe Error with only `code`, `message`, and `provider`. Stack traces unconditionally removed.
  - Contract shape: `provider`, `mode`, `text`, `languageHints`, `confidence` (clamped [0,1]), `warnings` (known codes only), `rawMetadata` (whitelisted fields only).
- `backend/tests/fixtures/ocr/` — 9 fixture files: valid success, low confidence, empty text, secrets leakage, minimal result, malformed input, confidence edge cases, OCR failure error, unknown error.
- `backend/tests/unit/ocrProviderContract.test.js` — 80 unit tests covering: success normalization, low confidence, empty text, forbidden field leakage (stack/secret/image/base64), warning preservation/dedup, language hints filtering, confidence clamping, malformed input defaults, error mapping (OCR_FAILED, OCR_PROVIDER_NOT_CONFIGURED), provider mapping, idempotency, contract shape stability.
- `backend/OCR_PROVIDER_SELECTION.md` — Provider selection evaluation: Qwen OCR/VL (recommended first candidate for china mode), OpenAI Vision, Google Vision. Covers cost, latency, region availability, language support, privacy, and deployment complexity tradeoffs.
- `mockOcrProvider.js` updated to include `rawMetadata: null` for explicit contract conformance.
- Flutter files unchanged. No real provider calls, API keys, or secrets added.
- All existing contract tests still pass. New OCR unit tests: 80/80 passing.

## Phase 12B: Qwen OCR Provider Disabled Adapter Scaffold

- `backend/src/providers/ocr/qwenOcrProvider.js` — Qwen OCR provider adapter that conforms to the OCR provider contract.
  - `extractMenuText(image, { transport })` — accepts a transport (test seam) or defaults to disabled (throws OCR_PROVIDER_NOT_CONFIGURED).
  - `validateQwenOcrConfig()` — validates `QWEN_OCR_PROVIDER_ENABLED`, `QWEN_API_KEY`, `QWEN_OCR_MODEL`, `QWEN_OCR_BASE_URL` env vars. Detects placeholder keys without logging them.
  - `createFakeQwenTransport(simulatedResult, { shouldThrow })` — creates a fake transport that returns a Qwen API-like envelope. Zero network calls.
  - `normalizeQwenResponse(rawQwenResponse)` — flattens Qwen VL API response structure, falls back to direct `text` field, passes through `normalizeOcrResult()`.
- `backend/src/providers/ocr/ocrProviderTypes.js` — added `QWEN_OCR: 'qwen_ocr'` provider name and `OCR: 'ocr'` mode.
- `backend/src/providers/ocr/ocrProviderRegistry.js` — registered `qwenOcrProvider` as `QWEN_OCR`. `qwen_ocr_skeleton` retained as safety fallback.
- `backend/src/providers/ocr/ocrProviderContract.js` — added `totalTokens` to `SAFE_METADATA_KEYS` whitelist.
- `backend/tests/fixtures/ocr/` — 9 new Qwen-specific fixtures: qwenSuccess, qwenLowConfidence, qwenEmptyText, qwenMalformed, qwenWithSecrets, qwenWhitespaceText, qwenChineseMenu, qwenApiError.
- `backend/tests/unit/qwenOcrProvider.test.js` — 34 unit tests: normalization success/low confidence/empty text/malformed/forbidden field stripping/confidence clamping/contract shape stability, extractMenuText with fake transport/error handling/no transport, validateQwenOcrConfig (missing/placeholder/valid key), no real network calls.
- `backend/README.md` — added Qwen OCR Provider Adapter section.
- `backend/OCR_PROVIDER_SELECTION.md` — updated to reference adapter scaffold existence.
- `AI_ENGINE_SPEC.md`, `TECH_ARCHITECTURE.md`, `ROADMAP.md`, `TESTING_CHECKLIST.md`, `REAL_PROVIDER_READINESS_CHECKLIST.md` — updated for Phase 12B.
- Flutter files unchanged. No real provider calls, API keys, secrets, or Firebase added.
- `realOcrEnabled: false` — hard-coded; Qwen adapter stays disabled by default.
- All existing contract tests (102) and OCR contract tests (80) still pass. New Qwen adapter tests: 34/34 passing.
- All existing contract tests still pass. New OCR unit tests: 80/80 passing.

## Phase 12F: Qwen Analysis Provider Disabled Adapter Scaffold

- `backend/src/providers/analysis/qwenAnalysisProvider.js` — Qwen analysis provider adapter that conforms to the analysis provider contract.
  - `analyzeMenuText(params, { transport })` — accepts a transport (test seam) or defaults to disabled (throws ANALYSIS_PROVIDER_NOT_CONFIGURED).
  - `validateQwenAnalysisConfig()` — validates `QWEN_ANALYSIS_PROVIDER_ENABLED`, `QWEN_API_KEY`, `QWEN_ANALYSIS_MODEL`, `QWEN_ANALYSIS_BASE_URL` env vars. Detects placeholder keys without logging them.
  - `createFakeQwenAnalysisTransport(simulatedResult, { shouldThrow })` — creates a fake transport that returns a Qwen analysis API-like envelope. Zero network calls.
  - `normalizeQwenAnalysisResponse(rawQwenResponse)` — parses Qwen analysis API response (output.choices[0].message.content as JSON), restructures flat dish price fields into priceIntelligence, passes through `normalizeAnalysisResult()`.
- `backend/src/providers/analysis/analysisProviderTypes.js` — added `QWEN_ANALYSIS: 'qwen_analysis'` provider name.
- `backend/src/providers/analysis/analysisProviderRegistry.js` — registered `qwenAnalysisProvider` as `QWEN_ANALYSIS`. `qwen_analysis_skeleton` retained as safety fallback.
- `backend/tests/fixtures/analysis/qwen/` — 7 Qwen-specific analysis fixtures: qwenAnalysisSuccess, qwenAnalysisEmpty, qwenAnalysisLowConfidence, qwenAnalysisMalformed, qwenAnalysisWithSecrets, qwenAnalysisSingleDish, qwenAnalysisExtremeScores.
- `backend/tests/unit/qwenAnalysisProvider.test.js` — 58 unit tests: normalization success/single dish/empty result/low confidence/malformed input/forbidden field stripping/score clamping/contract shape stability, analyzeMenuText with fake transport/error handling/no transport, validateQwenAnalysisConfig, realAnalysisEnabled stays false, no real network calls, mock_ai default unchanged.
- `backend/README.md`, `backend/ANALYSIS_PROVIDER_SELECTION.md`, `AI_ENGINE_SPEC.md`, `TECH_ARCHITECTURE.md`, `ROADMAP.md`, `TESTING_CHECKLIST.md`, `REAL_PROVIDER_READINESS_CHECKLIST.md` — updated for Phase 12F.
- Flutter files unchanged. No real provider calls, API keys, secrets, or Firebase added.
- `realAnalysisEnabled` is config-driven (`false` without all env gates). Qwen analysis stays disabled by default.
- All existing tests pass (contract: 102, OCR contract: 80, Qwen OCR adapter: 34, Qwen OCR transport: 34, analysis contract: 101, Qwen analysis adapter: 58 = 409 total).

## Phase 12G: Qwen Analysis Real Transport Behind Explicit Safety Gates

- `backend/src/providers/analysis/qwenAnalysisTransport.js` — Real Qwen analysis HTTPS transport behind env gates.
  - `createRealQwenAnalysisTransport({ httpsRequest })` — factory that validates all env gates and returns `{ transport, error }`. Accepts `httpsRequest` injection for offline testing.
  - `validateAnalysisTransportGates()` — checks `ANALYSIS_PROVIDER=qwen_analysis` + `QWEN_ANALYSIS_PROVIDER_ENABLED=true` + valid `QWEN_API_KEY`. Returns `{ ok, error, config }`.
  - Timeout via `withProviderTimeout()` from provider safety guards. Respects `PROVIDER_TIMEOUT_MS`.
  - Error mapping: network error → `ANALYSIS_FAILED`, non-2xx → `ANALYSIS_FAILED`, malformed JSON → `ANALYSIS_FAILED`, timeout → `ANALYSIS_FAILED`, missing config → `ANALYSIS_PROVIDER_NOT_CONFIGURED`.
  - API keys NEVER logged or included in error messages. Stack traces always deleted.
  - Raw provider responses, headers, body content, and raw prompt text NEVER leak into errors.
  - Safe defaults: `DEFAULT_QWEN_ANALYSIS_MODEL='qwen-max'`, `DEFAULT_QWEN_ANALYSIS_BASE_URL='https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'`, `DEFAULT_TIMEOUT_MS=15000`.
- `backend/src/providers/analysis/qwenAnalysisProvider.js` — Updated for Phase 12G.
  - Production path now calls `createRealQwenAnalysisTransport()` when gates are satisfied.
  - Request body building extracted and shared between fake transport (test seam) and real transport paths.
  - Test seam (`transport` option) still takes precedence — all unit tests remain offline.
  - Exports `createRealQwenAnalysisTransport` re-export for convenience.
- `backend/tests/unit/qwenAnalysisTransport.test.js` — 35 offline tests: env gate validation (8), transport creation (5), fake success transport call (4), non-2xx error (4), malformed JSON (1), network error (2), timeout (2), leaktight (4), no real network calls (1), mock_ai default (2).
- `backend/QWEN_ANALYSIS_MANUAL_SMOKE_TEST.md` — Manual smoke test guide with setup instructions, env gate checklist, verification steps, and safety guide.
- `backend/README.md`, `backend/ANALYSIS_PROVIDER_SELECTION.md`, `backend/SECURITY_AND_SECRETS.md`, `AI_ENGINE_SPEC.md`, `TECH_ARCHITECTURE.md`, `ROADMAP.md`, `TESTING_CHECKLIST.md`, `REAL_PROVIDER_READINESS_CHECKLIST.md` — updated for Phase 12G.
- Flutter files unchanged. No real provider calls, API keys, secrets, or Firebase added.
- `realAnalysisEnabled` remains config-driven. Qwen analysis stays disabled by default.
- All existing tests remain passing. New transport tests are 100% offline.

## Phase 12C: Qwen OCR Real Transport Behind Explicit Safety Gates

- `backend/src/providers/ocr/qwenOcrTransport.js` — Real Qwen OCR HTTPS transport behind env gates.
  - `createRealQwenTransport({ httpsRequest })` — factory that validates all env gates and returns `{ transport, error }`. Accepts `httpsRequest` injection for offline testing.
  - `validateTransportGates()` — checks `OCR_PROVIDER=qwen_ocr` + `QWEN_OCR_PROVIDER_ENABLED=true` + valid `QWEN_API_KEY`. Returns `{ ok, error, config }`.
  - Timeout via `withProviderTimeout()` from provider safety guards. Respects `PROVIDER_TIMEOUT_MS`.
  - Error mapping: network error → `OCR_FAILED`, non-2xx → `OCR_FAILED`, malformed JSON → `OCR_FAILED`, timeout → `OCR_FAILED`, missing config → `OCR_PROVIDER_NOT_CONFIGURED`.
  - API keys NEVER logged or included in error messages. Stack traces always deleted.
  - Raw provider responses, headers, and body content NEVER leak into errors.
- `backend/src/providers/ocr/qwenOcrProvider.js` — Updated for Phase 12C.
  - `realOcrEnabled` changed from hard-coded `false` to config-driven getter (`checkRealOcrEnabled()`).
  - Production path now calls `createRealQwenTransport()` when gates are satisfied.
  - Test seam (`transport` option) still takes precedence — all unit tests remain offline.
- `backend/src/providers/ocr/ocrProviderContract.js` — Updated with message sanitisation.
  - `sanitizeMessage()` — removes embedded API keys, JWTs, base64 blobs, and Bearer tokens from error messages.
  - `normalizeOcrError()` — reads `error.message` explicitly (Error.message is inherited, not own property).
- `backend/tests/fixtures/ocr/` — 3 new transport-level fixtures: qwenApiSuccessResponse, qwenApiEmptyTextResponse, qwenApiChineseResponse.
- `backend/tests/unit/qwenOcrTransport.test.js` — 34 new offline tests: env gate validation (11 tests), gate failure creation (5), fake success response (3), non-2xx error (3), malformed JSON (1), network error (2), timeout (2), no secrets leak (4), no real network calls (1), transport interface (2).
- `backend/QWEN_OCR_MANUAL_SMOKE_TEST.md` — Manual smoke test guide with setup instructions, verification steps, and troubleshooting.
- `backend/README.md`, `backend/OCR_PROVIDER_SELECTION.md`, `backend/SECURITY_AND_SECRETS.md` — Updated for Phase 12C transport status.
- `AI_ENGINE_SPEC.md`, `TECH_ARCHITECTURE.md`, `ROADMAP.md`, `TESTING_CHECKLIST.md`, `REAL_PROVIDER_READINESS_CHECKLIST.md` — Updated for Phase 12C.
- Flutter files unchanged. No real provider keys or secrets committed.
- `mock_ocr` remains default active provider. Qwen OCR stays disabled by default.
- All existing tests pass (contract: 102, OCR contract: 80, Qwen adapter: 34, Qwen transport: 34 = 250 total).
