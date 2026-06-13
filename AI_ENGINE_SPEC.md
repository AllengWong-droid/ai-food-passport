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
-> backend OCR provider registry
-> backend mock OCR provider
-> backend mock analysis provider
-> standardized backend envelope
-> Flutter parses dishes or maps backend errors to recovery UX
```

This is mock-only and local-development-only.

## OCR Provider Registry

The backend has a provider registry prepared for future OCR providers.

Current default:

- `mock_ocr`

Disabled skeletons:

- `qwen_ocr_skeleton`
- `google_vision_skeleton`
- `openai_vision_skeleton`

Selecting a disabled skeleton returns `OCR_PROVIDER_NOT_CONFIGURED`. No skeleton provider calls the network or requires a key today.

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

Future OCR-first routing should support:

- China-friendly OCR and analysis providers such as Qwen and DeepSeek
- Global providers such as OpenAI or another approved provider
- Provider health checks
- Fallback routing
- Structured responses that map to `DishAnalysisModel`

All of that remains future work.
