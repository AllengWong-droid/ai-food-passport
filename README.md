# AI Food Passport

AI Food Passport is a Flutter MVP Alpha that helps travelers understand menus, compare prices in their home currency, and choose dishes that fit their taste and safety profile.

## Current Status

The Flutter app still runs on local mock OCR and local `MockAiRepository` by default. It does not require the backend server for the normal user flow.

A local backend mock proxy now exists for developer testing. Backend Mock Mode is disabled by default and can be enabled manually in Profile during debug builds. The backend uses an OCR-first mock pipeline and exposes controlled debug scenarios for success, low confidence, empty text, analysis quality, and failure recovery.

No real OCR, Qwen, DeepSeek, OpenAI, Firebase, subscriptions, production authentication, real exchange rates, API keys, or secrets are implemented.

## MVP Alpha Capabilities

- Scanner-style Scan screen works with or without selecting an image.
- Gallery image selection and preview work on Flutter Web.
- Processing overlay explains scan progress.
- Friendly recovery UX handles future OCR/backend/analysis failures.
- Results show deterministic dish recommendations and price intelligence.
- Dish Detail shows local price, traveler home-currency price, exchange rate, ingredients, and recommendation reason.
- Traveler settings persist locally with `shared_preferences`.
- Home currency affects deterministic mock price conversion.
- Output language affects local mock Results and Dish Detail helper text.
- Backend Mock Mode can optionally call the local backend mock server.
- Developer Backend Scenario selector can test backend mock success and failure states.

## Current User Flow

1. Open Profile and adjust traveler settings if desired.
2. Open Scan.
3. Optionally select a menu image from Gallery.
4. Tap the main scan button.
5. See staged processing messages.
6. Review Results with price intelligence.
7. Open Dish Detail.
8. Return to Results, then back to Scan.

## Developer Backend Mock Flow

1. Start the backend mock server:

```bash
cd backend
npm run dev
```

2. Open Flutter in debug mode.
3. In Profile, enable Backend Mock Mode.
4. Optionally choose a Backend Scenario:
   - `normal`
   - `ocr_low_confidence`
   - `ocr_empty_text`
   - `ocr_failure`
   - `analysis_low_quality`
   - `analysis_empty_result`
   - `analysis_failure`
5. Run Scan.
6. Confirm Results or friendly recovery UX appears.

Backend Mock Mode remains a developer/test feature and is disabled by default.

## Tech Stack

- Flutter
- Dart
- Riverpod
- GoRouter
- image_picker
- shared_preferences
- Node.js backend mock server using built-in Node modules

## Architecture Summary

Default Flutter flow:

```text
Flutter Scan
-> local Mock OCR
-> local Mock AI
-> Results / Dish Detail
```

Optional developer backend mock flow:

```text
Flutter Scan
-> local Mock OCR
-> BackendMockMenuAnalysisRepository
-> POST /api/analyze-menu
-> mock OCR provider
-> mock analysis provider
-> standardized response envelope
-> Flutter Results or Recovery UX
```

The backend keeps future provider keys server-side by design, but no real provider calls or keys exist today.

## Implemented Versus Planned

Implemented:

- Local mock OCR and mock AI
- Deterministic price intelligence
- Local traveler settings persistence
- Multilingual mock helper copy
- Backend mock server
- Backend health endpoint
- Backend API envelopes
- OCR-first backend mock provider skeleton
- Backend OCR/analysis failure simulations
- Flutter Backend Mock Mode toggle
- Flutter Backend Scenario selector
- Flutter backend error-to-recovery mapping

Not implemented:

- Real OCR
- Real Qwen, DeepSeek, OpenAI, Claude, Gemini, or other provider calls
- Real backend provider routing
- Real exchange-rate API
- Firebase
- Subscriptions
- Production authentication
- App Store readiness

## Run Locally

Flutter only:

```bash
flutter pub get
flutter run -d web-server
```

Backend mock server:

```bash
cd backend
npm run dev
```

Optional checks:

```bash
flutter analyze
git diff --check
```

## Current Verified Phases

- Phase 1: Project Architecture
- Phase 2: UI Prototype
- Phase 3: Domain Models
- Phase 4A: Image Selection + Mock OCR Flow
- Phase 4B: OCR Adapter Preparation
- Phase 5A: AI Engine Adapter Preparation
- Phase 5B: OpenAI Adapter Skeleton
- Phase 5D: UX Alignment + Price Intelligence
- Phase 6A-6J: Scan UX, traveler settings, persistence, personalization, multilingual mock presentation
- Phase 6K: Documentation Sync
- Phase 7A: Backend Mock Server Skeleton
- Phase 7B: Flutter Backend Mock Adapter
- Phase 7C: Optional Backend Mock Mode Toggle
- Phase 7D: Backend Health, CORS, and API Contract Hardening
- Phase 8A: Backend OCR Adapter Skeleton
- Phase 8B: OCR Failure Simulation
- Phase 8C: Analysis Failure Simulation
- Phase 8D: Flutter Backend Error Mapping
- Phase 8E: Flutter Developer Backend Scenario Tester
