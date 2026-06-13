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
- Provider safety config parsing for timeout, retries, budget, and daily request limit placeholders.
- Provider timeout, rate limit, and cost guard skeletons for future real providers.

## What Is Not Implemented

- No real OCR.
- No Qwen OCR, Google Vision, Azure OCR, Tesseract, or OpenAI Vision.
- No real Qwen calls.
- No real DeepSeek calls.
- No real OpenAI calls.
- No real exchange-rate API.
- No Firebase.
- No production authentication.
- No provider health checks.
- No production fallback routing.
- No production rate limiting.
- No production cost enforcement.
- No API keys or secrets.
- Non-mock OCR providers are skeleton-only and disabled.
- Non-mock analysis providers are skeleton-only and disabled.

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

## Health Check

```powershell
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8787/health"
```

Response shape:

```json
{
  "ok": true,
  "service": "ai-food-passport-backend",
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

The mock server allows local Flutter Web development origins such as:

- `http://localhost:<port>`
- `http://127.0.0.1:<port>`

This is a local development convenience only. It is not a production CORS or authentication policy.

## Security Notes

- `.env` is ignored by Git.
- `.env.example` contains placeholder values only.
- Do not put real provider keys in Flutter.
- Future real provider calls should happen only from backend code.
- This mock backend contains no API keys or secrets.
- Provider keys alone do not enable real calls; skeleton providers remain disabled until explicitly implemented.
- Provider timeout, retry, budget, and request-limit variables are placeholders for future real provider phases.
- Invalid provider safety config values fall back safely and are reported through `/health`.

More detail:

- `backend/SECURITY_AND_SECRETS.md`
- `../REAL_PROVIDER_READINESS_CHECKLIST.md`

## Future Steps

- Real backend proxy implementation.
- Real OCR adapter.
- Qwen, DeepSeek, and OpenAI provider adapters.
- Provider health checks.
- Fallback routing.
- Real exchange rates.
- Timeout, rate-limit, cost guard, and logging redaction implementation.
- Production authentication and rate limiting.
