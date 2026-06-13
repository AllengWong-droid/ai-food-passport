# AI Food Passport Backend Mock Skeleton

## Purpose

This folder contains a minimal mock backend proxy skeleton for AI Food Passport. It prepares the shape of a future server that can protect API keys, run OCR-first routing, and call OCR/AI providers from a trusted backend.

Flutter uses local `MockAiRepository` by default. Developer Backend Mock Mode can optionally call this server during local testing. Flutter's developer selector uses `normal` for the default success scenario and sends no `debugScenario` field in that case.

## What Is Implemented

- Local Node.js HTTP server using built-in Node modules.
- `GET /health`.
- `POST /api/analyze-menu`.
- OCR-first mock pipeline:
  - mock OCR provider
  - OCR provider registry
  - mock menu analysis provider
  - analysis provider registry
  - provider routing decision skeleton
  - standardized API envelope
- Mock OCR debug scenarios for success, low confidence, empty text, and OCR failure.
- Mock analysis debug scenarios for success, low quality, empty result, and analysis failure.
- Deterministic mock response shaped like the future backend response.
- Standardized `ok`, `data`, and `error` API envelope.
- Mock dish results with `priceIntelligence`.
- CORS headers for local Flutter Web development origins.
- CORS enforcement module (`src/utils/corsEnforcement.js`) with origin validation.
- Request body size limiting (default 1 MB) with controlled error envelope.
- Provider safety config parsing for timeout, retries, budget, and daily request limit placeholders.
- Provider timeout, rate limit, and cost guard skeletons for future real providers.
- Logging redaction utility skeleton (`src/utils/redactForLogs.js`).
- Safe error response helper skeleton (`src/utils/safeErrorResponse.js`).
- Runtime configuration (`src/config/runtimeConfig.js`) for NODE_ENV, PORT, HOST, ALLOWED_ORIGINS, and PUBLIC_BACKEND_URL.
- OCR provider contract and normalization helpers (`src/providers/ocr/ocrProviderContract.js`).
- OCR provider contract unit tests (`tests/unit/ocrProviderContract.test.js`, 80 tests).
- OCR test fixture data (`tests/fixtures/ocr/`).
- OCR provider selection documentation (`backend/OCR_PROVIDER_SELECTION.md`).
- Qwen OCR adapter with fake transport test seam (`src/providers/ocr/qwenOcrProvider.js`).
- Qwen OCR adapter unit tests (`tests/unit/qwenOcrProvider.test.js`, 34 tests).
- Qwen OCR real transport behind env gates (`src/providers/ocr/qwenOcrTransport.js`).
- Qwen OCR transport unit tests (`tests/unit/qwenOcrTransport.test.js`, 34 tests, all offline).
- Qwen OCR manual smoke test guide (`backend/QWEN_OCR_MANUAL_SMOKE_TEST.md`).
- Deployment readiness documentation (`backend/DEPLOYMENT_READINESS.md`).
- Environment variable exemplar (`backend/.env.example`) with placeholder-only values.
- Analysis provider contract and normalization helpers (`src/providers/analysis/analysisProviderContract.js`).
- Analysis provider contract unit tests (`tests/unit/analysisProviderContract.test.js`, 101 tests).
- Analysis test fixture data (`tests/fixtures/analysis/`).
- Analysis provider selection documentation (`backend/ANALYSIS_PROVIDER_SELECTION.md`).
- `AnalysisProviderMode.ANALYSIS` added to types for future real providers.

## What Is Not Implemented

- No real OCR active by default (Qwen OCR transport is implemented but disabled behind env gates).
- No Qwen OCR calls in automated tests (all tests are offline).
- No Google Vision, Azure OCR, Tesseract, or OpenAI Vision.
- No real DeepSeek calls.
- No real OpenAI calls.
- No real exchange-rate API.
- No Firebase.
- No production authentication.
- No provider health checks.
- No production fallback routing.
- No production rate limiting.
- No production cost enforcement.
- No API keys or secrets committed.
- Non-mock OCR providers other than Qwen are skeleton-only and disabled.
- Non-mock analysis providers are skeleton-only and disabled.
- Analysis provider contract is defined; real providers must normalize through it.

## Install Dependencies

No runtime dependencies are required beyond Node.js 18 or newer.

```bash
cd backend
npm install
```

## Run Local Server

```bash
cd backend
npm run dev
```

or:

```bash
cd backend
npm start
```

Default URL:

```text
http://localhost:8787
```

You can override the port:

```bash
PORT=8790 npm start
```

## OCR Provider Configuration

`OCR_PROVIDER` defaults to `mock_ocr`.

Supported values:

- `mock_ocr`
- `qwen_ocr_skeleton`
- `google_vision_skeleton`
- `openai_vision_skeleton`

Only `mock_ocr` is active and usable today. Skeleton providers do not call the network. If selected, they return the standardized error code `OCR_PROVIDER_NOT_CONFIGURED`.

Safety behavior:

- Missing or empty `OCR_PROVIDER` uses `mock_ocr`.
- For missing or empty `OCR_PROVIDER`, `/health` reports `configuredOcrProvider: null` and `activeOcrProvider: mock_ocr`.
- Unknown `OCR_PROVIDER` values do not crash the server.
- Unknown values make `/health` return `configValid: false`.
- Unknown values make `POST /api/analyze-menu` return `OCR_PROVIDER_INVALID`.
- Skeleton provider values return `OCR_PROVIDER_NOT_CONFIGURED`.

## OCR Provider Contract

File: `src/providers/ocr/ocrProviderContract.js`

Every OCR provider (mock or future real) must produce results that conform to the standardized contract shape. The contract defines:

- `provider` — Known `OcrProviderName` value
- `mode` — Provider mode (e.g. `mock`, `ocr`)
- `text` — Extracted menu text (string)
- `languageHints` — BCP-47 / ISO 639 language tags (string array)
- `confidence` — Clamped to [0, 1]
- `warnings` — Known `OcrWarningCode` values only
- `rawMetadata` — Safe, redacted metadata only (nullable)

### Normalization Helpers

- `normalizeOcrResult(rawProviderResult)` — Sanitises any raw provider output into the contract shape. Strips forbidden fields (stack traces, API keys, secrets, image/base64 data, raw HTTP responses).
- `normalizeOcrError(error)` — Maps any caught error to a safe Error carrying only `code`, `message`, and `provider`. Stack traces, raw provider internals, and secrets are unconditionally removed.

These helpers are tested with 80 unit tests covering success, low confidence, empty text, forbidden-field leakage, warning preservation, language hints, confidence clamping, malformed input, and error mapping.

Future real OCR provider adapters must call `normalizeOcrResult()` before returning any result, and `normalizeOcrError()` inside catch blocks. This guarantees the analyzeMenu route and downstream analysis code never receive raw, untrusted provider output.

## Qwen OCR Provider Adapter (Phase 12B)

File: `src/providers/ocr/qwenOcrProvider.js`

The Qwen OCR provider adapter scaffold conforms to the OCR provider contract and prepares for future real Qwen OCR integration. Key characteristics:

- **Disabled by default**: `realOcrEnabled: false` (hard-coded for Phase 12B). The adapter throws `OCR_PROVIDER_NOT_CONFIGURED` when selected without a test transport.
- **Config validation**: `validateQwenOcrConfig()` checks `QWEN_OCR_PROVIDER_ENABLED`, `QWEN_API_KEY`, and placeholder detection without ever logging the key.
- **Fake transport test seam**: `createFakeQwenTransport(simulatedResult)` returns a transport function that mimics Qwen API responses — zero network calls.
- **Contract conformance**: `normalizeQwenResponse(rawQwenResponse)` flattens Qwen VL API response structure into the OCR contract shape, then passes through `normalizeOcrResult()`.
- **Real Qwen API calls**: NOT implemented (future phase). Currently the adapter only calls the provided transport (fake in tests, null in production).

Registered as `qwen_ocr` in the OCR provider registry. The original `qwen_ocr_skeleton` remains as a safety fallback.

See `backend/OCR_PROVIDER_SELECTION.md` for the full provider selection rationale.

## Analysis Provider Configuration

`ANALYSIS_PROVIDER` defaults to `mock_ai`.

Supported values:

- `mock_ai`
- `qwen_analysis_skeleton`
- `deepseek_analysis_skeleton`
- `openai_analysis_skeleton`

Only `mock_ai` is active and usable today. Skeleton providers do not call the network. If selected, they return the standardized error code `ANALYSIS_PROVIDER_NOT_CONFIGURED`.

Safety behavior:

- Missing or empty `ANALYSIS_PROVIDER` uses `mock_ai`.
- For missing or empty `ANALYSIS_PROVIDER`, `/health` reports `configuredAnalysisProvider: null` and `activeAnalysisProvider: mock_ai`.
- Unknown `ANALYSIS_PROVIDER` values do not crash the server.
- Unknown values make `/health` return `analysisConfigValid: false`.
- Unknown values make `POST /api/analyze-menu` return `ANALYSIS_PROVIDER_INVALID`.
- Skeleton provider values return `ANALYSIS_PROVIDER_NOT_CONFIGURED`.

## Provider Safety Configuration

Provider safety environment variables are parsed for future real provider integrations:

- `PROVIDER_TIMEOUT_MS`
- `PROVIDER_MAX_RETRIES`
- `PROVIDER_MONTHLY_BUDGET_USD`
- `PROVIDER_DAILY_REQUEST_LIMIT`

Defaults:

- `PROVIDER_TIMEOUT_MS`: `15000`
- `PROVIDER_MAX_RETRIES`: `0`
- monthly budget: unset
- daily request limit: unset

Validation behavior:

- Invalid timeout values fall back to `15000` and add a config warning.
- Invalid retry values fall back to `0` and add a config warning.
- Invalid monthly budget values are ignored and add a config warning.
- Invalid daily request limit values are ignored and add a config warning.
- Malformed safety env values do not crash the backend.

The guard module is skeleton-only:

- `withProviderTimeout`
- `checkRateLimit`
- `checkCostBudget`

Rate and cost guards are not enforced in the mock path. Retries remain disabled by default.

## Logging Redaction And Error Hygiene

Backend logging utilities are prepared for future real provider integration. These utilities ensure that secrets, raw provider responses, stack traces, menu image data, and sensitive user data are never included in logs or API responses.

### Redaction Utility

File: `src/utils/redactForLogs.js`

`redactForLogs(object)` returns a deep-cloned copy of any object with sensitive fields replaced by `'[REDACTED]'`. It handles nested objects, arrays, and circular references safely. The original object is never modified.

Redacted field names (case-insensitive):

- `apiKey`
- `authorization`
- `token`
- `secret`
- `password`
- `image`
- `imageBytes`
- `base64`
- `rawImage`
- `menuImage`
- `providerRawResponse`
- `providerRawError`
- `stack`

`redactError(error)` strips a JavaScript Error down to `{ code, message }` only. The stack trace is always omitted.

Usage:

```js
const { redactForLogs, redactError } = require('../utils/redactForLogs');

// Before writing to a logger or console:
console.log(redactForLogs(providerRequestObject));

// Before logging a caught error:
console.log(redactError(caughtError));
```

### Safe Error Response Utility

File: `src/utils/safeErrorResponse.js`

`extractSafeErrorCode(error, fallback)` checks whether a caught error carries a known application-controlled error code. If so, that code is returned. Otherwise the fallback is returned. This prevents unknown internal error strings, raw provider error codes, or library exceptions from leaking into API response bodies.

Known safe codes: `METHOD_NOT_ALLOWED`, `BAD_REQUEST`, `NOT_FOUND`, `OCR_FAILED`, `OCR_EMPTY_TEXT`, `OCR_PROVIDER_NOT_CONFIGURED`, `OCR_PROVIDER_INVALID`, `ANALYSIS_FAILED`, `ANALYSIS_PROVIDER_NOT_CONFIGURED`, `ANALYSIS_PROVIDER_INVALID`, `PROVIDER_FAILURE`, `PROVIDER_UNAVAILABLE`, `PROVIDER_TIMEOUT`, `PROVIDER_GUARD_INVALID_OPERATION`.

`buildSafeLogEntry(error, context)` builds a minimal structured log object containing only `code` (if known-safe), `message`, and optional `context`. It never includes stack traces, headers, raw image data, or provider internals.

### Policy

- API responses must never include raw stack traces.
- API responses must never include raw provider error bodies.
- API responses must never include provider API keys or authorization headers.
- API responses must never include raw menu image data or full OCR payloads.
- Internal logs must pass objects through `redactForLogs` before writing.
- Internal logs must pass caught errors through `redactError` or `buildSafeLogEntry` before writing.
- The `details` field in error envelopes must remain `null` in production unless populated with a safe, developer-curated string.
- These utilities are currently skeleton-only. They do not yet wrap any live code path. Future real provider adapters must use them.

### Health Check Readiness Fields

`/health` exposes two readiness flags:

```json
{
  "logRedactionReady": true,
  "safeErrorEnvelopeReady": true
}
```

These confirm the utilities are loaded and available for future provider adapter implementation.

## Runtime Configuration

File: `src/config/runtimeConfig.js`

The backend now includes a runtime configuration module that safely parses environment variables for production/development deployment. All values have safe defaults and validation warnings (not crashes) for invalid input.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | `development`, `production`, or `test` |
| `PORT` | `8787` | Server port (1-65535) |
| `HOST` | `127.0.0.1` (dev) / `0.0.0.0` (prod) | Server bind address |
| `ALLOWED_ORIGINS` | local Flutter/web origins (dev) / empty (prod) | Comma-separated CORS origins |
| `PUBLIC_BACKEND_URL` | `''` (empty) | Flutter backend URL in production |
| `REQUEST_BODY_LIMIT` | `1048576` (1 MB) | Max request body size in bytes |

### Validation Behaviour

- Invalid `NODE_ENV` → defaults to `development` with a warning
- Invalid `PORT` → defaults to `8787` with a warning
- Empty `ALLOWED_ORIGINS` in production → warning logged
- Unset `PUBLIC_BACKEND_URL` in production → warning logged
- No validation warnings crash the server

### Usage

```js
const { getRuntimeConfig } = require('./config/runtimeConfig');
const config = getRuntimeConfig();
// { nodeEnv, port, host, allowedOrigins, corsConfigured, productionReady, ... }
```

## Deployment Readiness

Documentation: `backend/DEPLOYMENT_READINESS.md`

This phase adds deployment readiness infrastructure **without enabling real providers or deploying anything**. Key points:

- `productionReady` is always `false` until real providers are configured and enforced
- `deploymentReadinessReady` is `true` (config infrastructure is ready)
- The `/health` endpoint now exposes `nodeEnv`, `port`, `host`, `corsConfigured`, `allowedOriginsCount`
- CORS headers are set based on `ALLOWED_ORIGINS` configuration
- Backend must be deployed before App Store / TestFlight real use
- Flutter production app must call HTTPS backend, not localhost
- Secrets must be configured as deployment environment variables (never in `.env`)
- Real providers remain disabled — this is still a mock backend

See `backend/DEPLOYMENT_READINESS.md` for the full pre-deployment checklist.

## Health Check

```powershell
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8787/health"
```

Response shape:

```json
{
  "ok": true,
  "service": "ai-food-passport-backend",
  "nodeEnv": "development",
  "port": 8787,
  "host": "127.0.0.1",
  "corsConfigured": true,
  "allowedOriginsCount": 5,
  "corsEnforcementReady": true,
  "requestBodyLimitBytes": 1048576,
  "requestBodyLimitReady": true,
  "productionReady": false,
  "deploymentReadinessReady": true,
  "mode": "mock",
  "ocrProvider": "mock_ocr",
  "configuredOcrProvider": "mock_ocr",
  "activeOcrProvider": "mock_ocr",
  "availableOcrProviders": [
    "mock_ocr",
    "qwen_ocr_skeleton",
    "google_vision_skeleton",
    "openai_vision_skeleton"
  ],
  "realOcrEnabled": false,
  "providerRoutingReady": true,
  "supportedProviderModes": ["mock", "china", "global", "auto"],
  "defaultProviderMode": "mock",
  "realProvidersEnabled": false,
  "configValid": true,
  "configWarnings": [],
  "analysisProvider": "mock_ai",
  "configuredAnalysisProvider": "mock_ai",
  "activeAnalysisProvider": "mock_ai",
  "availableAnalysisProviders": [
    "mock_ai",
    "qwen_analysis_skeleton",
    "deepseek_analysis_skeleton",
    "openai_analysis_skeleton"
  ],
  "realAnalysisEnabled": false,
  "analysisConfigValid": true,
  "analysisConfigWarnings": [],
  "providerTimeoutMs": 15000,
  "providerMaxRetries": 0,
  "providerMonthlyBudgetConfigured": false,
  "providerDailyRequestLimitConfigured": false,
  "providerSafetyConfigValid": true,
  "providerSafetyWarnings": [],
  "logRedactionReady": true,
  "safeErrorEnvelopeReady": true,
  "timestamp": "2026-06-13T00:00:00.000Z"
}
```

## Analyze Menu Endpoint

```text
POST /api/analyze-menu
```

PowerShell smoke test:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body "{}"
```

## Example Success Response Shape

```json
{
  "ok": true,
  "data": {
    "routing": {
      "mode": "mock",
      "ocrProvider": "mock_ocr",
      "ocrMode": "mock",
      "ocrConfidence": 0.98,
      "ocrWarnings": [],
      "realOcrEnabled": false,
      "providerRoutingReady": true,
      "requestedProviderMode": "mock",
      "resolvedProviderMode": "mock",
      "realProvidersEnabled": false,
      "routingReason": "Mock provider mode is active.",
      "futureOcrProvider": null,
      "futureAnalysisProvider": null,
      "analysisProvider": "mock_ai",
      "analysisMode": "mock",
      "analysisConfidence": 0.96,
      "analysisWarnings": [],
      "realAnalysisEnabled": false,
      "warnings": [],
      "fallbackUsed": false,
      "latencyMs": 2
    },
    "ocr": {
      "provider": "mock_ocr",
      "mode": "mock",
      "text": "Tonkotsu Ramen JPY 980\nMiso Katsu Skewers JPY 800",
      "languageHints": ["ja"],
      "confidence": 0.98,
      "warnings": []
    },
    "dishes": [
      {
        "dishName": "Tonkotsu Ramen",
        "description": "Rich pork broth with noodles, egg, scallion, and sliced chashu.",
        "ingredients": ["Pork broth", "Wheat noodles", "Egg", "Scallion", "Chashu"],
        "allergens": ["Wheat", "Egg"],
        "tasteScore": 96,
        "safetyScore": 84,
        "valueScore": 86,
        "recommendationReason": "Mock backend selected this because OCR-first text matched a savory, umami-forward menu item.",
        "priceIntelligence": {
          "localPrice": 980,
          "localCurrency": "JPY",
          "homePrice": 6.1,
          "homeCurrency": "EUR",
          "exchangeRate": 0.00622,
          "assessment": "Fair"
        }
      }
    ]
  },
  "error": null,
  "routing": {
    "mode": "mock",
    "ocrProvider": "mock_ocr",
    "ocrMode": "mock",
    "ocrConfidence": 0.98,
    "ocrWarnings": [],
    "realOcrEnabled": false,
    "providerRoutingReady": true,
    "requestedProviderMode": "mock",
    "resolvedProviderMode": "mock",
    "realProvidersEnabled": false,
    "routingReason": "Mock provider mode is active.",
    "futureOcrProvider": null,
    "futureAnalysisProvider": null,
    "analysisProvider": "mock_ai",
    "analysisMode": "mock",
    "analysisConfidence": 0.96,
    "analysisWarnings": [],
    "realAnalysisEnabled": false,
    "warnings": [],
    "fallbackUsed": false,
    "latencyMs": 2
  },
  "dishes": [
    {
      "dishName": "Tonkotsu Ramen"
    }
  ]
}
```

The top-level `routing` and `dishes` fields mirror `data.routing` and `data.dishes` temporarily for Flutter adapter backwards compatibility.

## OCR-First Provider Skeleton

The current route is structured as:

```text
POST /api/analyze-menu
-> mock OCR provider
-> mock menu analysis provider
-> standardized response envelope
```

Current provider files:

- `src/providers/ocr/mockOcrProvider.js`
- `src/providers/ocr/ocrProviderTypes.js`
- `src/providers/ocr/ocrProviderRegistry.js`
- `src/providers/ocr/qwenOcrProviderSkeleton.js`
- `src/providers/ocr/googleVisionOcrProviderSkeleton.js`
- `src/providers/ocr/openAiVisionOcrProviderSkeleton.js`
- `src/providers/analysis/mockMenuAnalysisProvider.js`
- `src/providers/analysis/analysisProviderTypes.js`
- `src/providers/analysis/analysisProviderRegistry.js`
- `src/providers/analysis/qwenAnalysisProviderSkeleton.js`
- `src/providers/analysis/deepSeekAnalysisProviderSkeleton.js`
- `src/providers/analysis/openAiAnalysisProviderSkeleton.js`
- `src/providers/routing/providerRoutingDecision.js`

The OCR provider returns deterministic local text and metadata. It does not read real images or call any external OCR service. The analysis provider uses that mock OCR result to create deterministic dish recommendations and price intelligence.

The registry is future-ready only. It keeps real provider selection behind the backend, but no real OCR provider is configured or enabled yet.

## Provider Routing Decision Skeleton

The backend accepts provider mode hints from `providerMode` or `aiProviderMode`.

Supported modes:

- `mock`
- `china`
- `global`
- `auto`

Current behavior:

- `mock` resolves to `mock_ocr` + `mock_ai`.
- `china` records future Qwen-oriented routing intent, then safely falls back to mock.
- `global` records future OpenAI/global routing intent, then safely falls back to mock.
- `auto` safely falls back to mock and notes that auto routing is planned.

Real provider routing is disabled:

```json
{
  "requestedProviderMode": "china",
  "resolvedProviderMode": "mock",
  "ocrProvider": "mock_ocr",
  "analysisProvider": "mock_ai",
  "realProvidersEnabled": false,
  "fallbackUsed": true,
  "routingReason": "China provider routing is planned, but real providers are disabled in this mock build."
}
```

`OCR_PROVIDER` and `ANALYSIS_PROVIDER` environment validation still takes precedence. Explicit invalid or skeleton provider settings return controlled errors.

Provider mode PowerShell examples:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"providerMode":"mock"}'
```

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"providerMode":"china"}'
```

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"providerMode":"global"}'
```

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"providerMode":"auto"}'
```

Flutter Backend Mock Mode sends the selected Profile provider mode as `providerMode`. Flutter Results displays the returned requested/resolved mode, fallback status, real provider status, and routing reason only in collapsed AI Debug.

Provider configuration test examples:

```powershell
$env:OCR_PROVIDER = "not_real_provider"
npm run dev
```

Expected `POST /api/analyze-menu` error code: `OCR_PROVIDER_INVALID`.

```powershell
$env:OCR_PROVIDER = "qwen_ocr_skeleton"
npm run dev
```

Expected `POST /api/analyze-menu` error code: `OCR_PROVIDER_NOT_CONFIGURED`.

```powershell
$env:ANALYSIS_PROVIDER = "not_real_provider"
npm run dev
```

Expected `POST /api/analyze-menu` error code: `ANALYSIS_PROVIDER_INVALID`.

```powershell
$env:ANALYSIS_PROVIDER = "qwen_analysis_skeleton"
npm run dev
```

Expected `POST /api/analyze-menu` error code: `ANALYSIS_PROVIDER_NOT_CONFIGURED`.

Clear local test environment variables after config tests:

```powershell
Remove-Item Env:OCR_PROVIDER -ErrorAction SilentlyContinue
Remove-Item Env:ANALYSIS_PROVIDER -ErrorAction SilentlyContinue
```

## Mock OCR Debug Scenarios

`POST /api/analyze-menu` accepts an optional `debugScenario` field for local testing. Omitting it is equivalent to Flutter's `normal` scenario.

- `ocr_success`: default successful mock OCR flow.
- `ocr_low_confidence`: returns OCR text with confidence `0.42`, keeps `ok: true`, and includes `LOW_OCR_CONFIDENCE`.
- `ocr_empty_text`: returns a clean `OCR_EMPTY_TEXT` error envelope.
- `ocr_failure`: simulates an OCR provider failure and returns a clean `OCR_FAILED` error envelope.

Default success:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body "{}"
```

Low confidence:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"ocr_low_confidence"}'
```

Empty OCR text:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"ocr_empty_text"}'
```

OCR failure:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"ocr_failure"}'
```

Low-confidence success shape:

```json
{
  "ok": true,
  "data": {
    "routing": {
      "ocrConfidence": 0.42,
      "ocrWarnings": ["LOW_OCR_CONFIDENCE"],
      "warnings": ["LOW_OCR_CONFIDENCE"]
    },
    "ocr": {
      "confidence": 0.42,
      "warnings": ["LOW_OCR_CONFIDENCE"]
    },
    "dishes": []
  },
  "error": null
}
```

Empty text response shape:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "OCR_EMPTY_TEXT",
    "message": "Could not find readable menu text.",
    "details": null
  }
}
```

OCR failure response shape:

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

## Mock Analysis Debug Scenarios

The same `debugScenario` field also supports analysis-layer simulations:

- `analysis_success`: default successful mock analysis flow.
- `analysis_low_quality`: returns dishes with analysis confidence `0.55` and warnings.
- `analysis_empty_result`: returns `ok: true`, `dishes: []`, and `ANALYSIS_EMPTY_RESULT` warning metadata.
- `analysis_failure`: simulates an analysis provider failure and returns a clean `ANALYSIS_FAILED` error envelope.

Low quality:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"analysis_low_quality"}'
```

Empty analysis result:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"analysis_empty_result"}'
```

Analysis failure:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"analysis_failure"}'
```

Low-quality success shape:

```json
{
  "ok": true,
  "data": {
    "routing": {
      "analysisConfidence": 0.55,
      "analysisWarnings": ["LOW_ANALYSIS_CONFIDENCE", "NEEDS_REVIEW"],
      "warnings": ["LOW_ANALYSIS_CONFIDENCE", "NEEDS_REVIEW"]
    },
    "dishes": []
  },
  "error": null
}
```

Empty analysis result shape:

```json
{
  "ok": true,
  "data": {
    "routing": {
      "analysisConfidence": 0,
      "analysisWarnings": ["ANALYSIS_EMPTY_RESULT"],
      "warnings": ["ANALYSIS_EMPTY_RESULT"]
    },
    "dishes": []
  },
  "error": null,
  "dishes": []
}
```

Analysis failure shape:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "ANALYSIS_FAILED",
    "message": "Could not analyze the menu.",
    "details": null
  }
}
```

## Error Response Shape

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Request body must be valid JSON.",
    "details": null
  }
}
```

Unknown routes return the same envelope with `NOT_FOUND`.

Invalid OCR provider configuration returns:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "OCR_PROVIDER_INVALID",
    "message": "OCR provider setting is invalid.",
    "details": null
  }
}
```

Disabled OCR provider skeletons return:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "OCR_PROVIDER_NOT_CONFIGURED",
    "message": "OCR provider is not configured.",
    "details": null
  }
}
```

Invalid analysis provider configuration returns:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "ANALYSIS_PROVIDER_INVALID",
    "message": "Analysis provider setting is invalid.",
    "details": null
  }
}
```

Disabled analysis provider skeletons return:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "ANALYSIS_PROVIDER_NOT_CONFIGURED",
    "message": "Analysis provider is not configured.",
    "details": null
  }
}
```

## CORS

CORS enforcement is implemented via `src/utils/corsEnforcement.js`.

Development/Test behaviour:
- Allows configured localhost / 127.0.0.1 origins (any port).
- Falls back to `*` (permissive) for unrecognised origins.

Production behaviour:
- Only sets `Access-Control-Allow-Origin` for explicitly configured origins.
- No wildcard `*` in production.
- Requests from unrecognised origins receive no CORS header — the browser blocks the response.

OPTIONS preflight:
- Returns 204 with full CORS headers for allowed origins.
- Returns 204 without CORS headers for disallowed origins (browser blocks follow-up).
- No stack traces are ever included in CORS responses.

## Request Body Limit

The backend enforces `REQUEST_BODY_LIMIT` (default: 1 MB / 1048576 bytes). Oversized JSON requests receive a controlled error envelope with code `REQUEST_BODY_TOO_LARGE`:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "REQUEST_BODY_TOO_LARGE",
    "message": "Request body exceeds the 1048576 byte limit.",
    "details": null
  }
}
```

- HTTP status code: `413`.
- No stack traces or internal details are included.
- The response shape remains compatible with the standard API envelope.
- Invalid JSON still returns `BAD_REQUEST` (400).

## Security Notes

- `.env` is ignored by Git.
- `.env.example` contains placeholder values only.
- Do not put real provider keys in Flutter.
- Future real provider calls should happen only from backend code.
- This mock backend contains no API keys or secrets.
- Provider keys alone do not enable real calls; skeleton providers remain disabled until explicitly implemented.
- Provider timeout, retry, budget, and request-limit variables are placeholders for future real provider phases.
- Invalid provider safety config values fall back safely and are reported through `/health`.
- Logging redaction and safe error envelope utilities are skeleton-only and do not yet wrap any live code path.
- No log output from redaction utilities appears unless an implementer explicitly calls them.

More detail:

- `backend/SECURITY_AND_SECRETS.md`
- `backend/OCR_PROVIDER_SELECTION.md`
- `../REAL_PROVIDER_READINESS_CHECKLIST.md`

## Future Steps

- Real backend proxy implementation.
- Real OCR adapter.
- Qwen, DeepSeek, and OpenAI provider adapters.
- Provider health checks.
- Fallback routing.
- Real exchange rates.
- Timeout, rate-limit, and cost guard enforcement for real provider calls.
- Apply `redactForLogs` and `buildSafeLogEntry` to all real provider request/response logging.
- Apply `extractSafeErrorCode` to all real provider catch handlers.
- Production authentication and rate limiting.
