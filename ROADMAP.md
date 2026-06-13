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
- Phase 6K: Documentation Sync
- Phase 7A: Backend Mock Server Skeleton
- Phase 7B: Flutter Backend Mock Adapter
- Phase 7C: Optional Backend Mock Mode Toggle
- Phase 7D: Backend Health, CORS, and API Contract Hardening
- Phase 8A: Backend OCR Adapter Skeleton
- Phase 8B: OCR Failure, Low Confidence, and Empty Text Simulation
- Phase 8C: Backend Analysis Failure, Empty Result, and Low Quality Simulation
- Phase 8D: Flutter Backend Error Response Mapping
- Phase 8E: Flutter Developer Backend Scenario Tester
- Phase 9A: Real OCR Provider Skeleton

## Current MVP Alpha

The normal app flow remains local mock by default:

```text
Scan -> optional Gallery preview -> processing overlay -> local mock OCR -> local Mock AI -> Results -> Dish Detail
```

Developer backend testing is optional:

```text
Scan -> local mock OCR -> Backend Mock Mode -> backend OCR-first mock pipeline -> Results or Recovery UX
```

Backend Mock Mode is disabled by default. Provider mode remains informational only.

## Next

- Backend mock scenario QA automation
- Backend provider contract tests
- Real OCR adapter implementation behind disabled backend skeletons
- Real provider gateway implementation behind backend only
- Qwen/DeepSeek/OpenAI adapter skeletons on backend
- Provider health checks and fallback routing policy
- Real exchange-rate service
- Production authentication and persistence
- Saved scan history

## Later Product Expansion

- Cloud sync for traveler settings
- Travel history and country stamps
- Production allergy/safety disclaimers
- Subscription and purchase flow
- App Store screenshots, preview video, metadata, and support documentation

## Still Not Implemented

- Real OCR
- Real Qwen, DeepSeek, OpenAI, Claude, Gemini, or other provider calls
- Real production backend provider routing
- Firebase
- Subscriptions
- Real exchange-rate API
- App Store readiness
