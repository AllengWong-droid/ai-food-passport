# AI Food Passport

AI Food Passport is a Flutter MVP Alpha that helps travelers understand menus, compare prices in their home currency, and choose dishes that fit their taste and safety profile.

## Current Status

The Flutter app still runs on local mock OCR and local `MockAiRepository` by default. It does not require the backend server for the normal user flow.

A local backend mock proxy now exists for developer testing. Backend Mock Mode is disabled by default and can be enabled manually in Profile during debug builds. The backend uses an OCR-first mock pipeline and exposes controlled debug scenarios for success, low confidence, empty text, analysis quality, and failure recovery.

The backend also has OCR and analysis provider registries plus a provider routing decision skeleton. `mock_ocr` and `mock_ai` remain the only active providers. Provider modes `china`, `global`, and `auto` are future routing hints only; they safely resolve to mock providers and return routing metadata for debug visibility.

Phase 10A adds secret-handling and real-provider readiness documentation. Future provider environment variables are placeholder-only in `backend/.env.example`; real keys must stay backend-only and must never be committed.

Phase 10C adds logging redaction and safe error response utilities. Phase 11A adds 86 automated backend contract tests. Phase 11B adds runtime deployment config, CORS skeleton, and deployment readiness documentation (`backend/DEPLOYMENT_READINESS.md`). Phase 11C implements CORS enforcement and request body limit enforcement on the backend (102 contract tests passing). Phase 11D adds Flutter backend endpoint configuration via dart-define — compile-time `BACKEND_BASE_URL` lets production builds point to a deployed backend without embedding secrets. Phase 11E gates all developer-only UI controls (Backend Mock Mode, Backend Scenario, AI Provider Mode, AI Debug/OCR Debug panels) behind `DeveloperControlsConfig`, hidden by default in release builds, overridable with `SHOW_DEVELOPER_CONTROLS=true`. Phase 11F adds 41 Flutter config unit tests (URL validation, secret-pattern rejection, developer controls gating) with pure helper functions for testability. Phase 13A adds deployment target comparison (`backend/DEPLOYMENT_TARGETS.md`) recommending Render as the first hosted backend MVP platform, and updates deployment readiness docs with full production env var documentation and a future smoke checklist. Phase 13B adds Render-specific deployment configuration (`backend/render.yaml` Blueprint template with safe placeholder-only values) and a comprehensive dry-run checklist (`backend/RENDER_DEPLOYMENT_DRY_RUN.md`) covering local preflight, Dashboard setup, first-deploy smoke tests, and rollback steps. No deployment is performed; `render.yaml` is committed as a reference file only.

No real OCR, Qwen, DeepSeek, OpenAI, Firebase, subscriptions, production authentication, real exchange rates, API keys, or secrets are implemented. Production deployment is not yet ready (`productionReady: false`).

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

> **Note (Phase 11E):** Backend Mock Mode toggles and Backend Scenario dropdowns are only visible when developer controls are enabled. See [Developer Controls Release Safety](#developer-controls-release-safety-phase-11e) below.

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

## Backend URL Configuration (Phase 11D)

The Flutter app uses a centralized `BackendEndpointConfig` in `lib/features/shared/data/ai/backend_endpoint_config.dart`. By default, the app points to `http://localhost:8787` for local backend testing. For production or remote testing, use the compile-time dart-define:

```bash
# Local testing with a running backend:
flutter run -d web-server --dart-define=BACKEND_BASE_URL=http://127.0.0.1:8787

# Production web build:
flutter build web --dart-define=BACKEND_BASE_URL=https://api.foodpassport.example.com
```

Rules:
- `BACKEND_BASE_URL` is **not a secret**. It is safe to log and display in debug UI.
- Flutter production builds **must** use a deployed HTTPS backend URL.
- Flutter **must never** contain provider API keys.
- Empty or invalid `BACKEND_BASE_URL` values fall back to the local dev URL.
- URLs containing userinfo (`user:pass@host`) or known secret patterns are rejected.
- Backend Mock Mode remains **disabled by default** regardless of the URL.
- Default local mock app usage still **does not require** a backend.

## Developer Controls Release Safety (Phase 11E)

Developer-only UI controls are gated behind `DeveloperControlsConfig.areVisible` in `lib/features/shared/config/developer_controls_config.dart`.

By default:
- **Debug builds** (`flutter run`): developer controls are visible.
- **Release builds** (`flutter build`): developer controls are hidden.

A compile-time override forces visibility when needed:

```bash
# Internal / QA / TestFlight builds:
flutter build web --dart-define=SHOW_DEVELOPER_CONTROLS=true
```

Controls gated when developer controls are hidden:
- Backend Mock Mode toggle (Profile)
- Backend Scenario selector (Profile)
- AI Provider Mode dropdown (Profile — future routing, not a user feature)
- Backend URL debug display (Profile subtitle, Results AI Debug)
- Results AI Debug / OCR Debug panels
- Raw backend routing metadata

Controls that remain visible for all users:
- Home Country, Home Currency, Output Language (Traveler Locale)
- Taste & Allergies, Notifications, Email, Travel History
- Country Stamp Grid, Passport Card
- Reset traveler settings
- "Continue with sample result" error recovery

Rules:
- `SHOW_DEVELOPER_CONTROLS` is **not a secret**. It is a compile-time flag.
- App Store builds **should keep** developer controls off.
- Backend Mock Mode is **not a normal user feature**.
- Developer controls do not enable real providers or change backend behaviour.

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
- OCR provider registry and safe config validation
- Analysis provider registry and safe config validation
- Provider routing decision skeleton
- Provider timeout/rate/cost guard skeletons
- Backend OCR/analysis failure simulations
- Flutter Backend Mock Mode toggle
- Flutter Backend Scenario selector
- Flutter backend error-to-recovery mapping
- Flutter AI Debug display for backend requested/resolved provider mode
- Backend secret-handling documentation and real-provider readiness checklist

Not implemented:

- Real OCR
- Real Qwen, DeepSeek, OpenAI, Claude, Gemini, or other provider calls
- Real backend provider routing
- Real exchange-rate API
- Firebase
- Subscriptions
- Production authentication
- App Store readiness

Safety docs:

- `backend/SECURITY_AND_SECRETS.md`
- `REAL_PROVIDER_READINESS_CHECKLIST.md`

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
- Phase 9A: Real OCR Provider Skeleton
- Phase 9B: OCR Provider Selection Safety and Config Validation
- Phase 9C: Real Analysis Provider Skeleton
- Phase 9D: Backend Provider Routing Decision Skeleton
- Phase 9E: Flutter Provider Mode Routing Visibility
- Phase 10A: Secret Handling and Real Provider Readiness Plan
- Phase 10B: Backend Provider Timeout, Rate Limit, and Cost Guard Skeleton
