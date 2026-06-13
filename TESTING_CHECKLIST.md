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

## Future Provider Readiness QA

- [ ] Review `backend/SECURITY_AND_SECRETS.md`.
- [ ] Review `REAL_PROVIDER_READINESS_CHECKLIST.md`.
- [ ] Confirm timeout, retry, budget, daily limit, logging redaction, fallback, and rollback items are documented before real provider work starts.

## Known Environment Issues

- On some local Codex/Windows shells, Flutter and Dart commands may hang due to cache/permission restrictions.
- If `flutter analyze` fails due to analyzer/server/environment issues, record the exact terminal output and manually verify the web-server flow.
