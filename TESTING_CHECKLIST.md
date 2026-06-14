# AI Food Passport Manual QA Checklist

## Launch

- [ ] Run `flutter pub get`.
- [ ] Run `flutter run -d web-server`.
- [ ] Confirm the app opens in a browser.
- [ ] Confirm the backend is not required for default app usage.

## Default Local Mock Flow

- [ ] Keep Backend Mock Mode disabled in Profile.
- [ ] Open Scan.
- [ ] Tap the main scan button without selecting an image.
- [ ] Confirm the processing overlay appears.
- [ ] Confirm Results opens.
- [ ] Return to Scan.
- [ ] Select an image from Gallery.
- [ ] Confirm image preview appears.
- [ ] Tap scan again.
- [ ] Confirm Results opens.
- [ ] Confirm no "Select a menu image first" message appears.
- [ ] Confirm Active provider in collapsed AI Debug is `mock_ai`.

## Profile Settings

- [ ] Change Home country.
- [ ] Change Home currency to `TWD`.
- [ ] Change Output language.
- [ ] Change Provider mode.
- [ ] Refresh/restart the app.
- [ ] Confirm settings persisted.
- [ ] Tap Reset traveler settings.
- [ ] Confirm settings return to Germany / EUR / English / mock.
- [ ] Confirm provider mode is future/informational only.

## Results And Dish Detail

- [ ] Confirm dish result cards appear.
- [ ] Confirm taste, safety, and value scores appear.
- [ ] Confirm local price appears.
- [ ] Confirm traveler home-currency price appears.
- [ ] Confirm price assessment appears.
- [ ] Confirm Results shows traveler context copy.
- [ ] Change Home currency and rescan.
- [ ] Confirm Results and Dish Detail reflect the selected currency.
- [ ] Change Output language and rescan.
- [ ] Confirm helper text changes language.
- [ ] Tap a dish card.
- [ ] Confirm Dish Detail opens.
- [ ] Confirm local price, home-currency price, exchange rate, ingredients, and recommendation reason appear.
- [ ] Tap Dish Detail back.
- [ ] Confirm it returns to Results.
- [ ] Tap Results back.
- [ ] Confirm it returns to Scan.

## Backend Mock Server

- [ ] Run `cd backend`.
- [ ] Run `npm run dev`.
- [ ] Confirm the server starts on `http://localhost:8787`.
- [ ] Test health:

```powershell
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8787/health"
```

- [ ] Test default POST:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body "{}"
```

## Backend Provider Config QA

- [ ] Confirm missing/empty `OCR_PROVIDER` safely defaults to `mock_ocr`.
- [ ] Confirm invalid `OCR_PROVIDER` returns `OCR_PROVIDER_INVALID`.
- [ ] Confirm skeleton OCR provider values return `OCR_PROVIDER_NOT_CONFIGURED`.
- [ ] Confirm missing/empty `ANALYSIS_PROVIDER` safely defaults to `mock_ai`.
- [ ] Confirm invalid `ANALYSIS_PROVIDER` returns `ANALYSIS_PROVIDER_INVALID`.
- [ ] Confirm skeleton analysis provider values return `ANALYSIS_PROVIDER_NOT_CONFIGURED`.
- [ ] Confirm `/health` reports active OCR provider, active analysis provider, available providers, config validity, and real provider flags.
- [ ] Confirm no stack traces appear in provider config error responses.

## Backend Provider Safety Config QA

- [ ] Confirm `/health` shows `providerTimeoutMs: 15000` by default.
- [ ] Confirm `/health` shows `providerMaxRetries: 0` by default.
- [ ] Confirm `/health` shows monthly budget and daily request limit as not configured by default.
- [ ] Set invalid `PROVIDER_TIMEOUT_MS` and confirm `/health` falls back to `15000` with a warning.
- [ ] Set invalid `PROVIDER_MAX_RETRIES` and confirm `/health` falls back to `0` with a warning.
- [ ] Set invalid `PROVIDER_MONTHLY_BUDGET_USD` and confirm it is ignored with a warning.
- [ ] Set invalid `PROVIDER_DAILY_REQUEST_LIMIT` and confirm it is ignored with a warning.
- [ ] Confirm invalid safety values do not crash the backend.
- [ ] Confirm mock `POST /api/analyze-menu` still succeeds with valid safety defaults.

## Backend Qwen Analysis Transport QA (Phase 12G)

- [ ] Confirm `qwenAnalysisTransport.test.js` all pass (offline, stubbed https.request).
- [ ] Confirm `qwen_analysis` remains disabled without all env gates.
- [ ] Confirm setting only `QWEN_API_KEY` does NOT activate Qwen analysis.
- [ ] Confirm setting only `ANALYSIS_PROVIDER=qwen_analysis` does NOT activate Qwen analysis without `QWEN_ANALYSIS_PROVIDER_ENABLED=true`.
- [ ] Confirm placeholder `QWEN_API_KEY` (e.g. `sk-placeholder`) does NOT activate transport.
- [ ] Confirm error code `ANALYSIS_PROVIDER_NOT_CONFIGURED` is returned when gates are not met.
- [ ] Confirm error code `ANALYSIS_FAILED` is returned for non-2xx / malformed / network errors.
- [ ] Confirm no stack traces leak in transport error responses.
- [ ] Confirm no API keys leak in transport error messages.
- [ ] Confirm no raw provider body leaks in transport error messages.
- [ ] Confirm existing contracts, adapter tests, and transport tests all pass together.
- [ ] Confirm `mock_ai` remains default active analysis provider.

## Backend Real Provider Gate Dry-Run QA (Phase 12H)

- [ ] Confirm `realProviderGate.test.js` all pass (68 tests, offline via child process).
- [ ] Default env `/health` → `activeOcrProvider: mock_ocr`, `activeAnalysisProvider: mock_ai`.
- [ ] `OCR_PROVIDER=qwen_ocr` (no key) → `/health` shows `activeOcrProvider: qwen_ocr`, `realOcrEnabled: false`.
- [ ] `OCR_PROVIDER=qwen_ocr` (no key) → `POST /api/analyze-menu` returns `OCR_PROVIDER_NOT_CONFIGURED`.
- [ ] `OCR_PROVIDER=qwen_ocr` + `QWEN_OCR_PROVIDER_ENABLED=true` + `QWEN_API_KEY=sk-placeholder` → `OCR_PROVIDER_NOT_CONFIGURED`.
- [ ] `ANALYSIS_PROVIDER=qwen_analysis` (no key) → `/health` shows `activeAnalysisProvider: qwen_analysis`, `realAnalysisEnabled: false`.
- [ ] `ANALYSIS_PROVIDER=qwen_analysis` (no key) → `POST /api/analyze-menu` returns `ANALYSIS_PROVIDER_NOT_CONFIGURED`.
- [ ] `ANALYSIS_PROVIDER=qwen_analysis` + `QWEN_ANALYSIS_PROVIDER_ENABLED=true` + `QWEN_API_KEY=sk-placeholder` → `ANALYSIS_PROVIDER_NOT_CONFIGURED`.
- [ ] Both `qwen_ocr` + `qwen_analysis` with placeholder key → `OCR_PROVIDER_NOT_CONFIGURED` (OCR fails first).
- [ ] Placeholder keys NEVER leak in any error message or health response.
- [ ] No stack traces in any error response across all gate scenarios.
- [ ] No Authorization headers, raw provider responses, base64, or raw prompt text in any error.
- [ ] `productionReady` stays `false` across all gate scenarios.
- [ ] `realProvidersEnabled` stays `false` across all gate scenarios.
- [ ] Invalid `OCR_PROVIDER` → `OCR_PROVIDER_INVALID`.
- [ ] Invalid `ANALYSIS_PROVIDER` → `ANALYSIS_PROVIDER_INVALID`.
- [ ] After all gate tests, default pipeline (mock_ocr + mock_ai) still works correctly.
- [ ] No cross-scenario env contamination between test groups.
- [ ] No real Qwen/DashScope network calls occur during tests.
- [ ] Existing contract tests all still pass.

## Flutter Backend Mock Mode

- [ ] Start the backend mock server.
- [ ] Open Profile in Flutter debug mode.
- [ ] Enable Backend Mock Mode.
- [ ] Set Backend Scenario to `normal`.
- [ ] Set Provider mode to `mock`.
- [ ] Run Scan.
- [ ] Confirm Results opens.
- [ ] Confirm collapsed AI Debug shows Active provider `backend_mock`.
- [ ] Confirm collapsed AI Debug shows requested provider mode `mock` and resolved provider mode `mock`.
- [ ] Confirm Backend Mock Mode can be turned off and local mock still works without backend.

## Provider Mode Routing Visibility

- [ ] With Backend Mock Mode enabled, set Provider mode to `mock`.
- [ ] Run Scan and confirm AI Debug shows requested `mock`, resolved `mock`, fallback `false`.
- [ ] Set Provider mode to `china`.
- [ ] Run Scan and confirm AI Debug shows requested `china`, resolved `mock`, fallback `true`, and real providers enabled `false`.
- [ ] Set Provider mode to `global`.
- [ ] Run Scan and confirm AI Debug shows requested `global`, resolved `mock`, fallback `true`, and real providers enabled `false`.
- [ ] Set Provider mode to `auto`.
- [ ] Run Scan and confirm AI Debug shows requested `auto`, resolved `mock`, fallback metadata, and real providers enabled `false`.
- [ ] Confirm provider mode is only shown as debug/routing metadata, not as a production provider feature.
- [ ] Confirm Backend Scenario still works when a provider mode is selected.

## Backend Scenario QA

- [ ] Set Backend Scenario to `ocr_low_confidence`.
- [ ] Run Scan.
- [ ] Confirm Results opens normally.
- [ ] Set Backend Scenario to `analysis_low_quality`.
- [ ] Run Scan.
- [ ] Confirm Results opens normally.
- [ ] Set Backend Scenario to `ocr_failure`.
- [ ] Run Scan.
- [ ] Confirm OCR-friendly recovery appears.
- [ ] Tap Continue with sample result.
- [ ] Confirm local mock Results opens.
- [ ] Set Backend Scenario to `ocr_empty_text`.
- [ ] Run Scan.
- [ ] Confirm no-readable-text recovery appears.
- [ ] Tap Continue with sample result.
- [ ] Confirm local mock Results opens.
- [ ] Set Backend Scenario to `analysis_failure`.
- [ ] Run Scan.
- [ ] Confirm analysis-friendly recovery appears.
- [ ] Tap Continue with sample result.
- [ ] Confirm local mock Results opens.
- [ ] Set Backend Scenario to `analysis_empty_result`.
- [ ] Run Scan.
- [ ] Confirm no-dishes-found recovery appears.
- [ ] Tap Continue with sample result.
- [ ] Confirm local mock Results opens.

## Error UX Checks

- [ ] Stop the backend server while Backend Mock Mode is enabled.
- [ ] Run Scan.
- [ ] Confirm friendly recovery appears.
- [ ] Confirm Try again is available.
- [ ] Confirm Choose another image is available.
- [ ] Confirm Continue with sample result works.
- [ ] Confirm no raw stack traces appear.
- [ ] Confirm no raw backend JSON appears in normal UI.

## Developer Debug

- [ ] Confirm OCR Debug and AI Debug are collapsed/secondary.
- [ ] Confirm AI Debug shows Backend mock enabled.
- [ ] Confirm AI Debug shows selected Backend Scenario.
- [ ] Confirm AI Debug shows last backend error code when available.
- [ ] Confirm Qwen, DeepSeek, OpenAI, real OCR, and real provider routing are disabled/planned.

## Negative Checks

- [ ] Confirm no real OCR call happens.
- [ ] Confirm no Qwen call happens.
- [ ] Confirm no DeepSeek call happens.
- [ ] Confirm no OpenAI call happens.
- [ ] Confirm no Firebase call happens.
- [ ] Confirm no real exchange-rate API call happens.
- [ ] Confirm no API keys or secrets are present.
- [ ] Confirm no real `.env` file is committed.
- [ ] Confirm `backend/.env.example` contains placeholders only.
- [ ] Confirm `backend/.gitignore` ignores `.env`.
- [ ] Confirm Flutter source contains no provider API key variables.

## Backend Contract Tests

- [ ] Run `cd backend && npm run test:contract`. Confirm all 102 tests pass.
- [ ] Run `cd backend && node --test tests/unit/ocrProviderContract.test.js`. Confirm all 80 OCR contract tests pass.
- [ ] Confirm `/health` includes `nodeEnv`, `port`, `host`, `corsConfigured`, `allowedOriginsCount`, `corsEnforcementReady`, `requestBodyLimitBytes`, `requestBodyLimitReady`, `productionReady`, `deploymentReadinessReady`.
- [ ] Confirm `corsEnforcementReady` is `true`.
- [ ] Confirm `requestBodyLimitReady` is `true`.
- [ ] Confirm `requestBodyLimitBytes` is a positive number (default: 1048576).
- [ ] Confirm `productionReady` is `false`.
- [ ] Confirm `deploymentReadinessReady` is `true`.
- [ ] Confirm `corsConfigured` is boolean.
- [ ] Confirm `allowedOriginsCount` is a non-negative number.
- [ ] Confirm OPTIONS preflight returns 204 for allowed origin.
- [ ] Confirm oversized request body returns `413` with `REQUEST_BODY_TOO_LARGE`.
- [ ] Confirm invalid JSON still returns `BAD_REQUEST`.

## Deployment Readiness Checks (Phase 11C)

- [ ] Review `backend/DEPLOYMENT_READINESS.md`.
- [ ] Review `backend/.env.example` contains placeholder-only values.
- [ ] Confirm `NODE_ENV` defaults to `development` (no production mode accidentally enabled).
- [ ] Confirm `npm run dev` starts with default runtime config.
- [ ] Confirm backend start-up message includes `NODE_ENV` and host.
- [ ] Confirm CORS headers are present in responses (check `Access-Control-Allow-Origin`).
- [ ] Confirm OPTIONS preflight returns CORS headers for allowed origins.
- [ ] Confirm oversized body returns controlled error (not crash).
- [ ] Confirm no production URLs are hardcoded in backend code.
- [ ] Confirm no real provider calls or deployment happen.

## Phase 11D: Backend URL Configuration (Flutter)

- [ ] Confirm `lib/features/shared/data/ai/backend_endpoint_config.dart` exists and compiles.
- [ ] Run `flutter run -d web-server` (no dart-define). Confirm app starts normally with local mock.
- [ ] Confirm Backend Mock Mode is still disabled by default.
- [ ] In Profile > Developer, confirm Backend Mock Mode subtitle shows the default backend URL.
- [ ] In Results > AI Debug, confirm "Backend base URL" shows the resolved URL.
- [ ] Run `flutter run -d web-server --dart-define=BACKEND_BASE_URL=http://127.0.0.1:8787`.
- [ ] Confirm Results > AI Debug shows "Backend base URL: http://127.0.0.1:8787" and "Backend URL custom defined: true".
- [ ] Confirm empty `BACKEND_BASE_URL` (e.g., `--dart-define=BACKEND_BASE_URL=`) falls back to local dev URL.
- [ ] Confirm invalid URL (e.g., `--dart-define=BACKEND_BASE_URL=not-a-url`) falls back to local dev URL.
- [ ] Confirm no API keys or secrets are added to any Flutter file.
- [ ] Confirm default local mock behavior is unchanged (no backend required).
- [ ] Confirm Backend Mock Mode still works with the default local backend URL when backend is running.
- [ ] Confirm Backend Mock Mode can use custom `BACKEND_BASE_URL` when provided.
- [ ] Confirm "Continue with sample result" still forces local mock (does not call backend).
- [ ] Run `dart format` on touched Dart files and confirm clean.
- [ ] Run `git diff --check` and confirm pass.

## Phase 11E: Developer Controls Release Safety (Flutter)

- [ ] Confirm `lib/features/shared/config/developer_controls_config.dart` exists and compiles.
- [ ] Run default debug build (`flutter run -d web-server`). Confirm Backend Mock Mode toggle is visible in Profile.
- [ ] Confirm Backend Scenario selector is visible in Profile.
- [ ] Confirm AI Provider Mode dropdown is visible in Profile.
- [ ] Confirm Results AI Debug / OCR Debug panels are visible when data is present.
- [ ] Confirm Backend Mock Mode remains disabled by default.
- [ ] Confirm default local mock still works without backend.
- [ ] Confirm Backend Mock Mode still works in developer controls mode when toggled on.
- [ ] Confirm Backend Scenario tester still works when developer controls are enabled.
- [ ] Confirm Home Country, Home Currency, Output Language remain visible for all users.
- [ ] Confirm Taste & Allergies, Notifications, Email, Travel History remain visible.
- [ ] Confirm Country Stamp Grid, Passport Card, Reset traveler settings remain visible.
- [ ] Confirm "Continue with sample result" still forces local mock.
- [ ] Confirm no API keys or secrets were added.
- [ ] Confirm no real provider calls were added.
- [ ] Confirm Backend Mock Mode default is still `false`.
- [ ] Run `dart format` on touched Dart files and confirm clean.
- [ ] Run `dart analyze` on touched Dart files and confirm no new errors.
- [ ] Run `git diff --check` and confirm pass.

## Phase 11F: Config and Release Safety Tests (Flutter)

- [ ] Confirm `test/shared/config/backend_endpoint_config_test.dart` exists and compiles.
- [ ] Confirm `test/shared/config/developer_controls_config_test.dart` exists and compiles.
- [ ] Run `flutter test test/shared/config/`. Confirm all 41 tests pass.
- [ ] Confirm `BackendEndpointConfig.validateAndResolve` tests: empty fallback, valid http/https, userinfo rejection, secret-pattern rejection, invalid URI fallback.
- [ ] Confirm `BackendEndpointConfig.isSafeBackendBaseUrl` tests: safe URLs accepted, unsafe URLs rejected.
- [ ] Confirm `DeveloperControlsConfig.resolveVisibility` tests: debug visible, release hidden, override enabled.
- [ ] Confirm `DeveloperControlsConfig.resolveVisibility` is deterministic (idempotent).
- [ ] Confirm config purity tests pass (no API keys or secrets in config values).
- [ ] Confirm `BackendEndpointConfig.localDevUrl` passes its own `isSafeBackendBaseUrl` check.
- [ ] Confirm no backend files are changed.
- [ ] Confirm no real provider calls, API keys, secrets, or Firebase are added.
- [ ] Run `dart format` on all touched files and confirm clean.
- [ ] Run `dart analyze` on config + test files and confirm "No issues found".
- [ ] Run `git diff --check` and confirm pass.

## Future Provider Readiness QA

- [ ] Review `backend/SECURITY_AND_SECRETS.md`.
- [ ] Review `REAL_PROVIDER_READINESS_CHECKLIST.md`.
- [ ] Review `backend/OCR_PROVIDER_SELECTION.md`.
- [ ] Confirm timeout, retry, budget, daily limit, logging redaction, fallback, and rollback items are documented before real provider work starts.

## Phase 12A: OCR Provider Contract QA

- [ ] Confirm `backend/src/providers/ocr/ocrProviderContract.js` exists and exports `normalizeOcrResult` and `normalizeOcrError`.
- [ ] Run `cd backend && node --test tests/unit/ocrProviderContract.test.js`. Confirm all 80 tests pass.
- [ ] Confirm `normalizeOcrResult` strips stack traces, API keys, secrets, image data, base64, and raw provider responses.
- [ ] Confirm `normalizeOcrError` returns a safe Error with no stack trace, no raw provider internals, and no secrets.
- [ ] Confirm confidence clamping to [0, 1] through boundary cases (NaN, -0.3, 1.5, "high", null).
- [ ] Confirm warning codes are filtered to only known `OcrWarningCode` values; duplicates removed.
- [ ] Confirm language hints filter non-strings and trim whitespace.
- [ ] Confirm `rawMetadata` whitelist allows only `processingTimeMs`, `modelVersion`, `ocrEngine`, `pageCount`, `detectedOrientation`.
- [ ] Confirm `normalizeOcrResult` is idempotent (normalizing a normalized result is a no-op).
- [ ] Confirm contract result shape is stable (7 keys: provider, mode, text, languageHints, confidence, warnings, rawMetadata).
- [ ] Confirm `stripForbiddenFields` does not mutate the original object.
- [ ] Confirm `looksLikeSecret` flags `sk-` prefixed strings, JWT-like strings, long base64-like strings, and very long strings (>500 chars).
- [ ] Confirm OCR provider selection documentation (`backend/OCR_PROVIDER_SELECTION.md`) recommends Qwen OCR/VL as first candidate.
- [ ] Confirm `npm run test:contract` still passes (102 tests).
- [ ] Confirm `npm run dev` starts successfully.
- [ ] Confirm `GET /health` works.
- [ ] Confirm `POST /api/analyze-menu` with `{}` returns mock dishes.
- [ ] Confirm no real provider calls, API keys, secrets, or Firebase are added.
- [ ] Confirm no Flutter files were changed.

## Phase 12B: Qwen OCR Adapter QA

- [ ] Confirm `backend/src/providers/ocr/qwenOcrProvider.js` exists and exports `extractMenuText`, `validateQwenOcrConfig`, `createFakeQwenTransport`, `normalizeQwenResponse`.
- [ ] Run `cd backend && node --test tests/unit/qwenOcrProvider.test.js`. Confirm all 34 tests pass.
- [ ] Confirm `extractMenuText` with fake transport returns contract-conforming result (7 keys, provider/mode/text/languageHints/confidence/warnings/rawMetadata).
- [ ] Confirm `extractMenuText` without transport throws `OCR_PROVIDER_NOT_CONFIGURED`.
- [ ] Confirm `validateQwenOcrConfig` returns `{ enabled: false }` when QWEN_OCR_PROVIDER_ENABLED is not `"true"`.
- [ ] Confirm `validateQwenOcrConfig` returns `{ enabled: false }` when QWEN_API_KEY is missing.
- [ ] Confirm `validateQwenOcrConfig` returns `{ enabled: false }` for placeholder keys (`sk-placeholder`, `sk-test`, short keys).
- [ ] Confirm `validateQwenOcrConfig` does not crash with null/undefined env vars.
- [ ] Confirm `createFakeQwenTransport` returns a transport that resolves with a Qwen API-like envelope (output.choices, usage, languageHints, confidence, warnings).
- [ ] Confirm `normalizeQwenResponse` handles Qwen VL envelope format (`output.choices[0].message.content`).
- [ ] Confirm `normalizeQwenResponse` falls back to direct `text` field when envelope is absent.
- [ ] Confirm `normalizeQwenResponse(null)` returns safe defaults (text: '', confidence: 0).
- [ ] Confirm `normalizeQwenResponse` strips forbidden fields (apiKey, stack, image/base64) via `normalizeOcrResult`.
- [ ] Confirm `normalizeQwenResponse` correctly handles non-numeric confidence (passes to clampConfidence).
- [ ] Confirm `normalizeQwenResponse` result has exactly 7 keys matching the OCR contract shape.
- [ ] Confirm no real network calls in any test (all tests use fake transport or test config validation).
- [ ] Confirm `realOcrEnabled: false` (hard-coded in qwenOcrProvider.js).
- [ ] Confirm `qwen_ocr` is registered in `ocrProviderRegistry.js` alongside `qwen_ocr_skeleton` (safety fallback).

## Phase 12C: Qwen OCR Real Transport QA

- [ ] Confirm `backend/src/providers/ocr/qwenOcrTransport.js` exists and exports `createRealQwenTransport`, `validateTransportGates`.
- [ ] Run `cd backend && node --test tests/unit/qwenOcrTransport.test.js`. Confirm all 34 tests pass.
- [ ] Confirm all transport tests use stubbed `httpsRequest` — no real network calls.
- [ ] Confirm `validateTransportGates()` returns `ok:false` when `OCR_PROVIDER` is not `qwen_ocr`.
- [ ] Confirm `validateTransportGates()` returns `ok:false` when `QWEN_OCR_PROVIDER_ENABLED` is not `true`.
- [ ] Confirm `validateTransportGates()` returns `ok:false` when `QWEN_API_KEY` is missing or placeholder.
- [ ] Confirm `createRealQwenTransport()` returns `{ transport, error: null }` when all gates pass.
- [ ] Confirm transport throws `OCR_FAILED` on HTTP 500, 429, 401 responses.
- [ ] Confirm transport throws `OCR_FAILED` on malformed JSON response body.
- [ ] Confirm transport throws `OCR_FAILED` on network error (ECONNREFUSED, ENOTFOUND).
- [ ] Confirm transport throws `OCR_FAILED` on timeout (both provider-level and request-level).
- [ ] Confirm no API key, stack trace, raw response body, or headers leak in any error.
- [ ] Confirm `realOcrEnabled` in `qwenOcrProvider.js` is now config-driven (getter checking env).
- [ ] Confirm `GET /health` with default env still shows `mock_ocr` active, `realOcrEnabled: false`.
- [ ] Confirm `POST /api/analyze-menu` with default env still returns mock dishes.
- [ ] Confirm providerMode `mock`/`china`/`global`/`auto` still works safely.
- [ ] Confirm manual smoke test guide exists at `backend/QWEN_OCR_MANUAL_SMOKE_TEST.md`.
- [ ] Confirm all existing tests still pass: contract (102), OCR contract (80), Qwen adapter (34).
- [ ] Confirm `backend/.env` is still in `.gitignore`.
- [ ] Confirm no API keys or secrets were committed (`git diff --check` passes).
- [ ] Confirm `mock_ocr` remains the active default provider.
- [ ] Confirm `npm run test:contract` still passes (102 tests).
- [ ] Confirm `node --test tests/unit/ocrProviderContract.test.js` still passes (80 tests).
- [ ] Confirm `npm run dev` starts successfully.
- [ ] Confirm `GET /health` works and reports `activeOcrProvider: mock_ocr`, `realOcrEnabled: false`.
- [ ] Confirm no real Qwen API calls, API keys, secrets, or Firebase are added.
- [ ] Confirm no Flutter files were changed.

## Phase 12D: Qwen OCR Smoke Test Preflight QA

- [ ] Confirm `backend/.env` is in `.gitignore` and not tracked.
- [ ] Confirm `git status` is clean before and after preflight.
- [ ] Confirm placeholder key (`sk-placeholder`) returns controlled `OCR_PROVIDER_NOT_CONFIGURED`.
- [ ] Confirm missing key returns controlled `OCR_PROVIDER_NOT_CONFIGURED`.
- [ ] Confirm no stack trace in any error response.
- [ ] Confirm no raw provider response in any error response.
- [ ] Confirm no API key or secret leakage in any response.
- [ ] Confirm default env `/health` shows `activeOcrProvider: mock_ocr`, `realOcrEnabled: false`.
- [ ] Confirm default env `/health` shows `configWarnings` with `OCR_PROVIDER not set`.
- [ ] Confirm default env `POST /api/analyze-menu` with `{}` returns `ok: true` with mock dishes.
- [ ] Confirm `mock_ocr` remains the default active OCR provider.
- [ ] Confirm `npm run test:contract` passes (102 tests).
- [ ] Confirm `node --test tests/unit/ocrProviderContract.test.js` passes (80 tests).
- [ ] Confirm `node --test tests/unit/qwenOcrProvider.test.js` passes (34 tests).
- [ ] Confirm `node --test tests/unit/qwenOcrTransport.test.js` passes (34 tests).
- [ ] Confirm no real Qwen API call was made during preflight.
- [ ] Confirm no API key, secret, or Firebase was added.
- [ ] Confirm real Qwen OCR smoke test is blocked until a real backend-only QWEN_API_KEY is available.
- [ ] Confirm `backend/QWEN_OCR_MANUAL_SMOKE_TEST.md` documents preflight status.
- [ ] Confirm no Flutter files were changed.

## Phase 12E: Analysis Provider Contract Prep QA

- [ ] Confirm `analysisProviderContract.js` exists and exports `normalizeAnalysisResult`, `normalizeAnalysisError`, and sub-normalizers.
- [ ] Confirm `AnalysisProviderMode.ANALYSIS` is added to `analysisProviderTypes.js`.
- [ ] Confirm `npm run test:contract` passes (102 tests).
- [ ] Confirm `node --test tests/unit/ocrProviderContract.test.js` passes (80 tests).
- [ ] Confirm `node --test tests/unit/qwenOcrProvider.test.js` passes (34 tests).
- [ ] Confirm `node --test tests/unit/qwenOcrTransport.test.js` passes (34 tests).
- [ ] Confirm `node --test tests/unit/analysisProviderContract.test.js` passes (101 tests).
- [ ] Confirm all 251 tests pass.
- [ ] Confirm `GET /health` works with default env.
- [ ] Confirm `POST /api/analyze-menu` with `{}` returns mock dishes.
- [ ] Confirm normalized dish has BOTH new fields (`id`, `name`, `recommendationScore`, `matchReasons`, `estimatedPrice`, `currency`, `valueRating`, `confidence`) AND old mock fields (`dishName`, `tasteScore`, `recommendationReason`, `priceIntelligence`).
- [ ] Confirm no stack trace leakage in any normalized result or error.
- [ ] Confirm no API key / secret leakage in any normalized result or error.
- [ ] Confirm no raw prompt / raw OCR text / raw provider response leakage.
- [ ] Confirm confidence clamped to [0, 1]; scores clamped to [0, 100].
- [ ] Confirm warnings de-duplicated and filtered to known codes.
- [ ] Confirm `mock_ai` remains the default active analysis provider.
- [ ] Confirm `ANALYSIS_PROVIDER_SELECTION.md` exists with Qwen/DeepSeek/OpenAI tradeoff analysis.
- [ ] Confirm no real analysis provider calls are added.
- [ ] Confirm no API keys or secrets are added.
- [ ] Confirm no Flutter files were changed.

## Phase 12F: Qwen Analysis Provider Adapter QA

- [ ] Confirm `backend/src/providers/analysis/qwenAnalysisProvider.js` exists and exports `analyzeMenuText`, `validateQwenAnalysisConfig`, `createFakeQwenAnalysisTransport`, `normalizeQwenAnalysisResponse`.
- [ ] Run `cd backend && node --test tests/unit/qwenAnalysisProvider.test.js`. Confirm all 58 tests pass.
- [ ] Confirm `analyzeMenuText` with fake transport returns contract-conforming result (6 keys: provider, mode, confidence, dishes, warnings, rawMetadata).
- [ ] Confirm `analyzeMenuText` without transport throws `ANALYSIS_PROVIDER_NOT_CONFIGURED`.
- [ ] Confirm `validateQwenAnalysisConfig` returns `{ enabled: false }` when QWEN_ANALYSIS_PROVIDER_ENABLED is not `"true"`.
- [ ] Confirm `validateQwenAnalysisConfig` returns `{ enabled: false }` when QWEN_API_KEY is missing.
- [ ] Confirm `validateQwenAnalysisConfig` returns `{ enabled: false }` for placeholder keys (`sk-placeholder`, `sk-test`, `sk-dummy`, `sk-example`, short keys).
- [ ] Confirm `validateQwenAnalysisConfig` does not crash with null/undefined env vars.
- [ ] Confirm `createFakeQwenAnalysisTransport` returns a transport that resolves with a Qwen analysis API-like envelope.
- [ ] Confirm `normalizeQwenAnalysisResponse` parses JSON content from `output.choices[0].message.content`.
- [ ] Confirm `normalizeQwenAnalysisResponse` restructures flat dish price fields into `priceIntelligence` nested object.
- [ ] Confirm `normalizeQwenAnalysisResponse(null)` returns safe defaults (dishes: [], confidence: 0, EMPTY_RESULT warning).
- [ ] Confirm `normalizeQwenAnalysisResponse` strips forbidden fields (apiKey, stack, image/base64, rawPrompt, rawOcrText) via `normalizeAnalysisResult`.
- [ ] Confirm `normalizeQwenAnalysisResponse` clamps confidence, scores, and prices through contract normalization.
- [ ] Confirm `normalizeQwenAnalysisResponse` result has exactly 6 keys matching the analysis contract shape.
- [ ] Confirm no real network calls in any test (all tests use fake transport or test config validation).
- [ ] Confirm `realAnalysisEnabled` is config-driven and stays `false` by default.
- [ ] Confirm `qwen_analysis` is registered in `analysisProviderRegistry.js` alongside `qwen_analysis_skeleton` (safety fallback).
- [ ] Confirm `mock_ai` remains the default active analysis provider (registry check).
- [ ] Confirm all existing tests still pass (contract 102, OCR contract 80, Qwen OCR adapter 34, Qwen OCR transport 34, analysis contract 101).
- [ ] Confirm no real Qwen analysis API calls, API keys, secrets, or Firebase are added.
- [ ] Confirm no Flutter files were changed.

## Phase 13A: Deployment Target Prep QA

- [ ] Confirm `backend/DEPLOYMENT_TARGETS.md` exists with comparison of Render, Railway, Fly.io, VPS, Cloudflare Workers.
- [ ] Confirm recommended deployment target (Render) is documented with rationale.
- [ ] Confirm `backend/DEPLOYMENT_READINESS.md` updated with production env vars, startup commands, health checks, secret handling, cost controls, rollback steps.
- [ ] Confirm deployment smoke checklist is documented (deploy → /health → CORS → body limit → no stack traces → no secrets in logs → only then real providers).
- [ ] Confirm Flutter production config rule documented: `BACKEND_BASE_URL` only; no provider keys in Flutter.
- [ ] Confirm `REAL_PROVIDER_READINESS_CHECKLIST.md` updated with deployment target selection section.
- [ ] Confirm `ROADMAP.md` updated with Phase 13A.
- [ ] Confirm `TECH_ARCHITECTURE.md` updated with Phase 13A section.
- [ ] Confirm `README.md` updated with deployment docs reference.
- [ ] Confirm `backend/README.md` updated with Phase 13A entries.
- [ ] Run `node --test` — confirm all 509 tests still pass.
- [ ] Run `npm run test:contract` — confirm all contract tests still pass.
- [ ] Run `git diff --check` — confirm pass (no trailing whitespace errors).
- [ ] Secret scan: no `sk-` keys in committed files.
- [ ] Confirm `backend/.env` is untracked and in `.gitignore`.
- [ ] Confirm no backend runtime behavior changed (`GET /health`, `POST /api/analyze-menu` unchanged).
- [ ] Confirm `productionReady` remains `false`.
- [ ] Confirm no real provider calls, no API keys, no secrets, no Firebase added.
- [ ] Confirm no Flutter files were changed.
- [ ] Confirm no deployment was performed (this phase is doc/config planning only).

## Phase 13B: Render Deployment Config Dry Run QA

- [ ] Confirm `backend/render.yaml` exists with safe placeholder-only values.
- [ ] Confirm `render.yaml` does NOT contain `QWEN_API_KEY`.
- [ ] Confirm `render.yaml` has `QWEN_OCR_PROVIDER_ENABLED=false` and `QWEN_ANALYSIS_PROVIDER_ENABLED=false`.
- [ ] Confirm `render.yaml` has `OCR_PROVIDER=mock_ocr` and `ANALYSIS_PROVIDER=mock_ai`.
- [ ] Confirm `render.yaml` has `healthCheckPath: /health`.
- [ ] Confirm `render.yaml` has `autoDeployTrigger: 'off'` (safe default).
- [ ] Confirm `render.yaml` uses `sync: false` for `ALLOWED_ORIGINS` and `PUBLIC_BACKEND_URL`.
- [ ] Confirm `backend/RENDER_DEPLOYMENT_DRY_RUN.md` exists (8-part dry-run checklist).
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 0 documents Blueprint vs. Manual Dashboard decision.
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 1 has local preflight commands (tests, /health, CORS, secret scan).
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 2 has Render Dashboard manual setup values reference.
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 3 has first-deploy smoke tests (mock providers only).
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 4 verifies real providers remain disabled.
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 5 documents future steps to enable real Qwen providers.
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 6 has rollback plan (Dashboard + env var revert).
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 7 has Render free tier caveats and mitigations.
- [ ] Confirm `RENDER_DEPLOYMENT_DRY_RUN.md` Part 8 has dry-run validation checklist.
- [ ] Run `cd backend && node --test` — confirm all 509 tests still pass.
- [ ] Run `cd backend && npm run test:contract` — confirm all contract tests still pass.
- [ ] Run `cd backend && npm run dev` — confirm server starts.
- [ ] Confirm `GET /health` returns expected JSON locally (`ok: true`, `activeOcrProvider: mock_ocr`).
- [ ] Confirm `POST /api/analyze-menu` with `{}` returns mock dishes locally.
- [ ] Confirm CORS preflight returns correct headers locally.
- [ ] Run secret scan: no `sk-` real keys in committed files.
- [ ] Confirm `backend/.env` is in `.gitignore` and untracked.
- [ ] Confirm no backend runtime behavior changed (`/health`, `/api/analyze-menu` unchanged).
- [ ] Confirm `productionReady` remains `false`.
- [ ] Confirm no real provider calls, no API keys, no secrets, no Firebase added.
- [ ] Confirm no Flutter files were changed.
- [ ] Confirm no deployment was performed (this phase is dry-run doc only).
- [ ] Run `git diff --check` — confirm pass (no trailing whitespace errors).
- [ ] Confirm `backend/DEPLOYMENT_TARGETS.md` updated with Phase 13B section (render.yaml and dry-run checklist).
- [ ] Confirm `backend/DEPLOYMENT_READINESS.md` updated with Phase 13B status and render.yaml reference.
- [ ] Confirm `REAL_PROVIDER_READINESS_CHECKLIST.md` updated with Phase 13B section.
- [ ] Confirm `ROADMAP.md` updated with Phase 13B.
- [ ] Confirm `TECH_ARCHITECTURE.md` updated with Phase 13B section.
- [ ] Confirm `README.md` updated with Phase 13B description.
- [ ] Confirm `backend/README.md` updated with Phase 13B entries.

## Phase 13C: Render Manual Deploy — Mock Backend Verified QA

- [ ] Confirm Render mock backend deployed at `https://ai-food-passport.onrender.com`.
- [ ] Confirm `GET /health` returns 200 with `ok: true`, `activeOcrProvider: mock_ocr`, `activeAnalysisProvider: mock_ai`.
- [ ] Confirm `/health` reports `realOcrEnabled: false`, `realAnalysisEnabled: false`, `realProvidersEnabled: false`, `productionReady: false`.
- [ ] Confirm `POST /api/analyze-menu` with `{}` returns 200 with `ok: true`, 2 mock dishes.
- [ ] Confirm `mock_ocr` and `mock_ai` remain the active default providers.
- [ ] Confirm `realProvidersEnabled` remains `false`.
- [ ] Confirm `productionReady` remains `false`.
- [ ] Confirm no `QWEN_API_KEY`, `DEEPSEEK_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_VISION_API_KEY`, `EXCHANGE_RATE_API_KEY` configured.
- [ ] Confirm `GET /` returns 404 (no homepage route exists — by design).
- [ ] Confirm `/api/analyze-menu` without trailing slash works; trailing slash `POST /api/analyze-menu/` is undefined and may 404.
- [ ] Confirm `PUBLIC_BACKEND_URL` is set and matches deployed URL.
- [ ] Confirm no Flutter behavior changed.
- [ ] Confirm no backend `src/` files changed from prior phases.
- [ ] Confirm no secrets or API keys were committed.
- [ ] Confirm `backend/.env` is untracked and in `.gitignore`.
- [ ] Confirm local tests all pass (509 tests, 0 failures).
- [ ] Confirm `git diff --check` passes.
- [ ] Confirm all Phase 13C docs updated: ROADMAP.md, TESTING_CHECKLIST.md, DEPLOYMENT_READINESS.md, RENDER_DEPLOYMENT_DRY_RUN.md, backend/README.md, README.md, REAL_PROVIDER_READINESS_CHECKLIST.md, TECH_ARCHITECTURE.md.
- [ ] Confirm no deployment secrets (dashboard screenshots, tokens, private service metadata) committed.

## Phase 13D: Flutter Internal Build Points to Deployed Render Backend
- [ ] Confirm `lib/features/shared/data/ai/backend_endpoint_config.dart` already supports `BACKEND_BASE_URL` via dart-define.
- [ ] Confirm default Flutter behavior remains unchanged without dart-define (local mock, no backend required).
- [ ] Confirm release developer controls remain hidden by default (`DeveloperControlsConfig.areVisible`).
- [ ] Confirm no provider API keys (`QWEN_API_KEY`, `DEEPSEEK_API_KEY`, etc.) exist in Flutter code.
- [ ] Confirm deployed backend URL (`https://ai-food-passport.onrender.com`) is not treated as a secret.
- [ ] Run Flutter Web debug pointing to deployed backend:
  ```bash
  flutter run -d chrome --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
  ```
- [ ] Confirm Flutter app starts and Backend Mock Mode can reach the deployed backend.
- [ ] Confirm `GET /health` via debug shows `activeOcrProvider: mock_ocr`, `activeAnalysisProvider: mock_ai`.
- [ ] Confirm `POST /api/analyze-menu` returns mock dishes from deployed backend.
- [ ] Confirm default behavior (no dart-define) still uses local mock without any backend.
- [ ] Confirm `BACKEND_BASE_URL` is configurable only via dart-define, never hardcoded.
- [ ] Confirm `GET /` returns 404 on deployed backend (no homepage route — by design).
- [ ] Confirm `/api/analyze-menu` without trailing slash works; trailing slash is undefined.
- [ ] Confirm `productionReady` remains `false` on deployed backend.
- [ ] Confirm Render backend remains mock-only (no real provider calls).
- [ ] Run `flutter test` — confirm all Flutter tests pass.
- [ ] Run `git diff --check` — confirm pass (no whitespace errors).
- [ ] Run `git status --short` — confirm only documentation files changed.
- [ ] Confirm no backend `src/` files changed.
- [ ] Confirm no Flutter runtime code changed.
- [ ] Confirm no secrets or API keys committed.
- [ ] Confirm `backend/.env` is untracked and in `.gitignore`.
- [x] Phase 14A MVP Alpha freeze readiness audit complete; all 6 audit areas pass; 42/42 Flutter tests pass; git status/check clean.
- [x] Phase 14B MVP Alpha demo script & manual QA runbook created (`MVP_ALPHA_DEMO_RUNBOOK.md`); demo setup, walkthrough, QA checklist, caveats documented.
- [x] Phase 15B MVP Alpha demo polish: removed all "Mock AI"/"mock OCR" from user-visible copy; changed "TRY DEMO SCAN" to "QUICK PREVIEW"; changed "Demo passport active" to "Guest passport active"; simplified backend mode subtitles; fixed hardcoded result labels. All 42 tests pass.
- [ ] Phase 15C post-polish manual demo smoke test: run `flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com`; verify all polished copy appears correctly; confirm Render backend reachable; confirm mock dishes (Tonkotsu Ramen, Miso Katsu Skewers) appear; confirm no API keys or real provider calls. Checklist in `PHASE_15C_MANUAL_SMOKE_TEST.md`.
- [x] Phase 16A real provider preflight plan created (`REAL_PROVIDER_PREFLIGHT_PLAN.md`): 9 sections covering prerequisites, OCR gates, analysis gates, forbidden actions, rollback plan, test matrix (8 scenarios), decision points (16B/16C/16D), and verification commands. No real providers enabled.
- [x] Flutter widget test overflow fix (Phase 13D verification): wrapped OnboardingScreen `Column` in `SingleChildScrollView`, removed `Spacer()`, all 42 tests pass.

## Known Environment Issues

- On some local Codex/Windows shells, Flutter and Dart commands may hang due to cache/permission restrictions.
- If `flutter analyze` fails due to analyzer/server/environment issues, record the exact terminal output and manually verify the web-server flow.
