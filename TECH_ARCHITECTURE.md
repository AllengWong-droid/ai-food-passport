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
Flutter Scan
-> local Mock OCR
-> BackendMockMenuAnalysisRepository
-> POST /api/analyze-menu
-> backend OCR provider registry
-> backend mock OCR provider
-> backend mock analysis provider
-> standardized response envelope
-> Flutter Results / Recovery UX
```

The Backend Scenario selector can send a `debugScenario` value for controlled local testing. It is ignored when Backend Mock Mode is off.

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

The backend route is OCR-first:

```text
request validation
-> OCR provider registry
-> mock OCR provider
-> empty/failed OCR handling
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

These skeletons do not call real providers and are not active defaults.

## Traveler Settings

Persisted locally:

- Home country
- Home currency
- Output language
- Provider mode

These settings flow into `AiAnalysisRequest`. Home currency affects deterministic mock price conversion. Output language affects local mock helper copy. Provider mode is informational only.

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
