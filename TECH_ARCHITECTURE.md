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
- Production deployment

## Future Architecture Direction

Future real provider calls should go through a backend proxy. API keys must never be stored in Flutter code.

Future routing should remain OCR-first:

1. Image OCR or vision extraction.
2. Structured menu text analysis.
3. Price intelligence and recommendation output.

China mode may later route through Qwen-OCR/Qwen-VL and Qwen or DeepSeek. Global mode may later route through OpenAI or another global provider. This is planned only.
