# AI Food Passport

AI Food Passport is a Flutter MVP Alpha that helps travelers understand restaurant menus, compare prices in their home currency, and choose dishes that fit their taste and safety profile.

## Problem

Travelers often face menus they cannot read, prices they cannot quickly compare, and ingredients or allergens they cannot confidently identify. AI Food Passport demonstrates a practical scan-to-recommendation flow while keeping production integrations safely mocked or skeleton-only.

## Current MVP Alpha Capabilities

- Scan works with or without selecting an image.
- Gallery image selection and image preview work on Flutter Web.
- Processing overlay explains scan progress and improves perceived latency.
- Friendly fallback/failure recovery UX is prepared for future OCR/AI failures.
- Mock OCR returns realistic Japanese, Chinese, or English menu text.
- Mock AI ranks dishes using OCR text, taste passport, allergies, dietary preferences, location, and traveler settings.
- Results show dish recommendations, safety/value/taste scores, and price intelligence.
- Dish Detail shows local menu price, traveler home-currency price, exchange rate, value explanation, ingredients, and recommendation reason.
- Dish Detail back navigation returns to Results.
- Profile includes persisted traveler settings: home country, home currency, output language, and provider mode.
- Traveler settings can be reset to Germany / EUR / English / mock.
- Home currency affects deterministic mock price conversion.
- Output language affects local mock Results and Dish Detail helper text.
- Provider mode exists for future routing but is informational only.
- Developer Debug remains collapsed/secondary.

## Current User Flow

1. Open Profile and adjust traveler settings if desired.
2. Open Scan.
3. Optionally select a menu image from Gallery.
4. Tap the main scan button.
5. See staged processing messages.
6. Review Results with price intelligence and traveler-context copy.
7. Open Dish Detail for a recommendation.
8. Return to Results, then back to Scan.

## Tech Stack

- Flutter
- Dart
- Riverpod
- GoRouter
- image_picker
- shared_preferences
- Clean, feature-based structure
- Repository interfaces for Auth, Passport, Scan, OCR, AI, and Price layers

## Architecture Summary

The app uses typed domain models and repository interfaces so mock implementations can later be replaced without redesigning the user flow.

- Domain models live under `lib/features/shared/domain/models/`.
- Repository interfaces live under `lib/features/shared/domain/repositories/`.
- Mock implementations live under `lib/features/shared/data/`.
- Future AI adapter skeletons live under `lib/features/shared/data/ai/`.
- Local mock presentation copy lives under `lib/features/shared/presentation/`.
- The active AI provider is still `MockAiRepository`.
- `OpenAiMenuAnalysisRepository` is disabled and makes no network calls.
- `BackendMenuAnalysisRepository` is disabled and not wired into the app.
- `MultiProviderMenuAnalysisRepository` is disabled and represents future OCR-first China/global routing.

## Implemented Versus Planned

Implemented:

- Mock OCR
- Mock AI
- Deterministic mock price intelligence
- Deterministic mock exchange rates for supported traveler currencies
- Local traveler settings persistence with `shared_preferences`
- Local mock UI copy for English, Traditional Chinese, Simplified Chinese, and Japanese
- OCR-first multi-provider routing contract/skeleton

Not implemented:

- Real OCR
- Real Qwen
- Real DeepSeek
- Real OpenAI
- Real backend proxy
- Real provider routing
- Firebase
- Subscriptions
- Production authentication
- Real exchange-rate API
- Real translation

## How To Run Locally

```bash
flutter pub get
flutter run -d web-server
```

Optional:

```bash
flutter analyze
```

If local Flutter/Dart tooling hangs or analyzer crashes, verify the web-server flow manually and record the exact terminal output.

## Current Verified Phases

- Phase 1: Project Architecture
- Phase 2: UI Prototype
- Phase 3: Domain Models
- Phase 4A: Image Selection + Mock OCR Flow
- Phase 4B: OCR Adapter Preparation
- Phase 5A: AI Engine Adapter Preparation
- Phase 5B: OpenAI Adapter Skeleton
- Phase 5D: UX Alignment + Price Intelligence
- Phase 6A: OCR-First Multi-Provider Routing Skeleton
- Phase 6B: Perceived Latency Scan Flow
- Phase 6C: Fallback/Failure UX
- Phase 6C1: Dish Detail Navigation Fix
- Phase 6D: Scan UI Cleanup
- Phase 6E: Traveler Locale/Provider Settings
- Phase 6F: Settings Connected To Mock Analysis Context
- Phase 6G: Local Persistence For Traveler Settings
- Phase 6H: Reset Traveler Settings
- Phase 6I: Results Personalization Polish
- Phase 6J: Multilingual Mock Results Presentation
