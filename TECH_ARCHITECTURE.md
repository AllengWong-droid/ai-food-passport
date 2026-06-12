# AI Food Passport - Technical Architecture

## Current MVP Alpha Stack

- Flutter
- Dart
- Riverpod
- GoRouter
- image_picker
- shared_preferences

## Current Architecture

The app uses a feature-based structure with shared domain models and repository interfaces.

Key folders:

- `lib/features/shared/domain/models/`
- `lib/features/shared/domain/repositories/`
- `lib/features/shared/data/`
- `lib/features/shared/data/ai/`
- `lib/features/shared/presentation/`
- `lib/features/scan/presentation/`
- `lib/features/results/presentation/`

## Implemented Repository Interfaces

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

The active AI provider remains `MockAiRepository`.

## Prepared But Disabled

- `OpenAiMenuAnalysisRepository`
- `OpenAiMenuPromptBuilder`
- `OpenAiMenuResponseSchema`
- `OpenAiMenuResponseParser`
- `BackendMenuAnalysisRepository`
- `MultiProviderMenuAnalysisRepository`
- OCR-first multi-provider routing contract

These skeletons do not call the network and are not wired as active providers.

## Traveler Settings

Persisted locally:

- Home country
- Home currency
- Output language
- Provider mode

These settings flow into `AiAnalysisRequest`. Home currency affects deterministic mock price conversion. Output language affects local mock Results/Dish Detail helper copy. Provider mode is informational only.

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
- Backend API proxy
- Real provider routing
- Real exchange-rate API
- Apple/Google in-app purchase
- Production deployment

## Future Architecture Direction

Future real provider calls should go through a backend proxy. API keys must never be stored in Flutter code.

Future OCR should be introduced behind `OcrRepository`. Future analysis should keep returning typed `DishAnalysisModel` results through `AiRepository`.

Future routing should remain OCR-first:

1. Image OCR or vision extraction.
2. Structured menu text analysis.
3. Price intelligence and recommendation output.

China mode may later route through Qwen-OCR/Qwen-VL and Qwen or DeepSeek. Global mode may later route through OpenAI or another global provider. This is planned only.
