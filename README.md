# AI Food Passport

AI Food Passport is a Flutter MVP Alpha that helps travelers understand restaurant menus, identify food risks, and choose dishes that fit their personal taste passport.

## Problem

Travelers often face menus they cannot read, prices they cannot compare, and ingredients or allergens they cannot confidently identify. AI Food Passport explores a guided flow where a user selects a menu image, sees OCR and AI analysis output, and reviews dish-level recommendations before ordering.

## Current MVP Alpha Capabilities

- Web-server demo build works locally.
- Menu image selection from gallery works.
- Selected image preview works on the scan screen.
- Mock OCR returns realistic Japanese, Chinese, or English menu text.
- OCR Debug shows raw text, detected language, confidence, and source.
- Mock AI analysis ranks dishes using OCR text, taste preferences, allergies, dietary preferences, country, and currency context.
- AI Debug shows the context used by the mock AI adapter.
- Results and Dish Detail navigation work.
- OpenAI adapter skeleton exists, but is disabled by default.
- No real API calls, API keys, Firebase, real OCR, or subscriptions are implemented.

## Current User Flow

1. Open the app.
2. Continue through onboarding/auth/passport screens.
3. Open Scan.
4. Select a menu image from gallery.
5. Confirm the image preview.
6. Run the mock OCR and mock AI analysis.
7. Review ranked dish results.
8. Expand OCR Debug and AI Debug during development.
9. Open Dish Detail for a specific recommendation.

## Tech Stack

- Flutter
- Dart
- Riverpod
- GoRouter
- image_picker
- Clean, feature-based structure
- Repository interfaces for Auth, Passport, Scan, OCR, AI, and Price layers

## Architecture Summary

The MVP uses typed domain models and repository interfaces so mock implementations can be replaced later without redesigning the UI flow.

- Domain models live under `lib/features/shared/domain/models/`.
- Repository interfaces live under `lib/features/shared/domain/repositories/`.
- Mock implementations live under `lib/features/shared/data/`.
- Future OpenAI adapter preparation lives under `lib/features/shared/data/ai/`.
- The default AI provider is still `MockAiRepository`.
- `OpenAiMenuAnalysisRepository` is a disabled skeleton and makes no network calls.

## Current Limitations

- OCR is mocked, not real device or cloud OCR.
- AI analysis is mocked, not real OpenAI.
- OpenAI prompt builder, schema, parser, and repository skeleton are preparation only.
- No Firebase Auth, Firestore, Storage, Analytics, or Crashlytics.
- No backend proxy yet.
- No API keys are stored in Flutter code.
- No subscriptions or App Store purchase logic.
- Price intelligence uses mock/static values.

## Roadmap

- Phase 5D: Backend proxy plan
- Phase 5E: Real OpenAI integration through backend
- Phase 6: Real OCR strategy
- Phase 7: Firebase persistence
- Phase 8: Subscription and App Store preparation

## How To Run Locally

```bash
flutter pub get
flutter run -d web-server
```

Optional:

```bash
flutter analyze
```

If the local analyzer crashes or hangs, verify the web-server flow manually and record the exact terminal error.

## Current Verified Phases

- Phase 1: Project Architecture
- Phase 2: UI Prototype
- Phase 3: Domain Models
- Phase 4A: Image Selection + Mock OCR Flow
- Phase 4B: OCR Adapter Preparation
- Phase 5A: AI Engine Adapter Preparation
- Phase 5B: OpenAI Adapter Skeleton
