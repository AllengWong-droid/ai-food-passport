# AI Food Passport - AI Engine Specification

## Current State

The active default Flutter AI engine is still `MockAiRepository`. It accepts `AiAnalysisRequest` and returns `List<DishAnalysisModel>`.

The project also includes an optional local backend mock path for developer testing. Backend Mock Mode is disabled by default and does not replace the local mock flow unless manually enabled in Profile during debug builds.

No real OCR, Qwen, DeepSeek, OpenAI, Claude, Gemini, Firebase, provider routing, or exchange-rate API calls are made.

## Default Flutter Pipeline

```text
Scan screen
-> local mock/default image source
-> MockOcrRepository returns OcrResult
-> AiAnalysisRequest is built
-> MockAiRepository returns deterministic dishes
-> Results / Dish Detail
```

## Optional Backend Mock Pipeline

```text
Scan screen
-> MockOcrRepository returns OcrResult
-> AiAnalysisRequest is sent by BackendMockMenuAnalysisRepository
-> POST /api/analyze-menu
-> backend provider routing decision
-> backend OCR provider registry
-> backend mock OCR provider
-> backend analysis provider registry
-> backend mock analysis provider
-> standardized backend envelope
-> Flutter parses dishes or maps backend errors to recovery UX
```

This is mock-only and local-development-only.

## Provider Routing Decision

The backend can read `providerMode` or `aiProviderMode` from the request.

Supported modes:

- `mock`
- `china`
- `global`
- `auto`

Current behavior:

- `mock` resolves to mock OCR and mock analysis.
- `china`, `global`, and `auto` record future routing intent but resolve safely to mock.
- `realProvidersEnabled` remains `false`.
- Backend responses include requested provider mode, resolved provider mode, fallback status, provider routing readiness, real provider status, and routing reason.
- Flutter Backend Mock Mode displays that metadata in collapsed AI Debug.

This skeleton is metadata-only. It does not activate real Qwen, DeepSeek, OpenAI, Google Vision, or any external provider.

## OCR Provider Registry

The backend has a provider registry prepared for future OCR providers.

Current default:

- `mock_ocr`

Disabled skeletons:

- `qwen_ocr_skeleton`
- `google_vision_skeleton`
- `openai_vision_skeleton`

Selecting a disabled skeleton returns `OCR_PROVIDER_NOT_CONFIGURED`. No skeleton provider calls the network or requires a key today.

Missing or empty `OCR_PROVIDER` defaults to `mock_ocr`. Invalid values return `OCR_PROVIDER_INVALID` through the standardized backend error envelope.

## OCR Provider Contract

The backend defines a standardized OCR result contract in `backend/src/providers/ocr/ocrProviderContract.js`. Every future real OCR provider adapter must produce results that conform to this shape:

- `provider` — Known provider name
- `mode` — Provider mode
- `text` — Extracted text
- `languageHints` — Language tags array
- `confidence` — 0–1, clamped
- `warnings` — Known warning codes only
- `rawMetadata` — Safe, whitelisted metadata only

Normalization helpers (`normalizeOcrResult`, `normalizeOcrError`) sanitise raw provider output, stripping stack traces, API keys, secrets, image data, and raw HTTP responses before results reach any API response.

Provider selection documentation (`backend/OCR_PROVIDER_SELECTION.md`) evaluates Qwen OCR/VL, OpenAI Vision, and Google Vision as future candidates. Qwen OCR/VL is the recommended first real OCR provider for `china`-mode routing, given CJK accuracy, China data compliance, and unified OCR+analysis pipeline.

The Qwen OCR adapter scaffold (`backend/src/providers/ocr/qwenOcrProvider.js`) is now in place. It conforms to the OCR provider contract, remains disabled by default, and supports a fake transport test seam for unit testing.

The Qwen OCR real transport (`backend/src/providers/ocr/qwenOcrTransport.js`) is implemented behind explicit env gates: `OCR_PROVIDER=qwen_ocr`, `QWEN_OCR_PROVIDER_ENABLED=true`, and a valid `QWEN_API_KEY`. Without all gates, the transport creation returns a controlled `OCR_PROVIDER_NOT_CONFIGURED` error. Automated tests are 100% offline via stubbed `https.request`. A manual smoke test guide is available at `backend/QWEN_OCR_MANUAL_SMOKE_TEST.md`.

No real OCR provider is active by default. `mock_ocr` remains the default.

## Analysis Provider Contract

A stable analysis provider contract (`analysisProviderContract.js`) normalizes all analysis results before they reach the API response envelope.

Contract shape:

```text
{
  provider: string,        // Known AnalysisProviderName value
  mode: string,            // 'mock' | 'analysis'
  confidence: number,      // 0–1, clamped
  dishes: Dish[],          // Normalized dishes (compatible with mock shape)
  warnings: string[],      // Known AnalysisWarningCode values
  rawMetadata: object|null // Safe, redacted metadata only
}
```

Each normalized dish includes BOTH new standardized fields (`id`, `name`, `recommendationScore`, `matchReasons`, `estimatedPrice`, `currency`, `valueRating`, `confidence`) AND backward-compatible mock fields (`dishName`, `tasteScore`, `safetyScore`, `valueScore`, `recommendationReason`, `priceIntelligence`) so that existing Flutter parsers continue to work.

Normalization guarantees:
- No stack traces, raw provider responses, API headers, raw prompts, or raw OCR payloads leak through
- Confidence clamped to [0, 1]; dish scores clamped to [0, 100]
- Warnings filtered to known `AnalysisWarningCode` values and de-duplicated
- `rawMetadata` stripped to a whitelist of safe keys only
- API keys, JWTs, base64 blobs, and other secrets are redacted from error messages

101 fixture-based contract tests pass (all offline).

## Analysis Provider Registry

The backend has a provider registry prepared for future analysis providers.

Current default:

- `mock_ai`

Disabled skeletons:

- `qwen_analysis_skeleton`
- `deepseek_analysis_skeleton`
- `openai_analysis_skeleton`

Selecting a disabled skeleton returns `ANALYSIS_PROVIDER_NOT_CONFIGURED`. Invalid provider config returns `ANALYSIS_PROVIDER_INVALID`. No skeleton provider calls the network or requires a key today.

Missing or empty `ANALYSIS_PROVIDER` defaults to `mock_ai`.

## Input Model

`AiAnalysisRequest` includes:

- OCR result
- Taste passport
- Scan model
- User home country
- User home currency
- Restaurant country
- Restaurant city
- Local currency
- Output language
- Provider mode

Provider mode is informational only in the MVP Alpha.

## Output Model

The Flutter AI layer returns `List<DishAnalysisModel>`.

Each dish includes:

- Dish name
- Description
- Ingredients
- Allergens
- Taste score
- Safety score
- Value score
- Recommendation reason
- Price intelligence

## Backend Envelope

Successful backend mock responses use:

```json
{
  "ok": true,
  "data": {
    "routing": {
      "ocrProvider": "mock_ocr",
      "analysisProvider": "mock_ai",
      "warnings": []
    },
    "ocr": {},
    "dishes": []
  },
  "error": null,
  "routing": {},
  "dishes": []
}
```

Error backend mock responses use:

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

Flutter maps backend error codes to friendly Scan recovery states.

## Backend Debug Scenarios

Developer scenarios:

- `normal`
- `ocr_low_confidence`
- `ocr_empty_text`
- `ocr_failure`
- `analysis_low_quality`
- `analysis_empty_result`
- `analysis_failure`

These scenarios are only sent when Backend Mock Mode is enabled and a non-normal scenario is selected.

## Price Intelligence

Mock price intelligence includes:

- Local price
- Local currency
- Home price
- Home currency
- Exchange rate
- Assessment: Cheap, Fair, Expensive, or Good Value

Home currency conversion uses deterministic mock rates. No real exchange-rate API is implemented.

## Output Language

Output language affects local mock helper text in Results and Dish Detail for:

- English
- Traditional Chinese
- Simplified Chinese
- Japanese

This is not real translation. Dish content remains deterministic mock data.

## Prepared But Disabled

- OpenAI prompt builder
- OpenAI response schema
- OpenAI response parser
- OpenAI repository skeleton
- Backend provider gateway skeleton
- Multi-provider routing repository skeleton

## Future Integration Rule

Real provider calls must be made through a backend proxy. Flutter should never store provider API keys.

Provider keys alone must not enable real calls. Future real providers require explicit adapter implementation, config validation, timeout behavior, rate/cost controls, redacted logging, fallback QA, and rollout/rollback planning.

Future OCR-first routing should support:

- China-friendly OCR and analysis providers such as Qwen and DeepSeek
- Global providers such as OpenAI or another approved provider
- Provider health checks
- Fallback routing
- Structured responses that map to `DishAnalysisModel`

All of that remains future work.

## Future Provider Safety Settings

Placeholder backend settings are documented in `backend/.env.example`:

- `PROVIDER_TIMEOUT_MS`
- `PROVIDER_MAX_RETRIES`
- `PROVIDER_MONTHLY_BUDGET_USD`
- `PROVIDER_DAILY_REQUEST_LIMIT`

These settings do not currently enable real providers. They are readiness placeholders for a future provider implementation phase.

Backend `/health` reports parsed safety metadata:

- `providerTimeoutMs`
- `providerMaxRetries`
- `providerMonthlyBudgetConfigured`
- `providerDailyRequestLimitConfigured`
- `providerSafetyConfigValid`
- `providerSafetyWarnings`

Invalid safety values fall back or are ignored with warnings. The mock success path is not blocked by rate or cost guard skeletons.
