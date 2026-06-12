# AI Food Passport Roadmap

## Completed

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

## Current MVP Alpha

The app demonstrates the intended product flow with mocks:

Scan -> optional Gallery preview -> processing overlay -> mock OCR -> mock AI -> Results with deterministic price intelligence -> Dish Detail -> back navigation.

Profile traveler settings persist locally and influence mock home-currency prices and local helper text. Provider mode is visible for future planning but remains informational only.

## Next

- Backend proxy implementation for server-side provider calls
- Real OCR adapter behind `OcrRepository`
- Qwen, DeepSeek, and OpenAI provider adapter skeletons behind the backend
- Real provider health checks, latency policy, and fallback routing
- Real exchange-rate service
- Production auth and persistence
- Saved scan history
- App Store preparation

## Later Product Expansion

- Cloud sync for traveler settings
- Travel history and country stamps
- Production allergy/safety disclaimers
- Subscription and purchase flow
- App Store screenshots, preview video, metadata, and support documentation
