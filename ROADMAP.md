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
- Phase 9B: OCR Provider Selection Safety and Config Validation
- Phase 9C: Real Analysis Provider Skeleton
- Phase 9D: Backend Provider Routing Decision Skeleton
- Phase 9E: Flutter Provider Mode Routing Visibility
- Phase 10A: Secret Handling and Real Provider Readiness Plan
- Phase 10B: Backend Provider Timeout, Rate Limit, and Cost Guard Skeleton
- Phase 10C: Backend Logging Redaction and Error Hygiene Skeleton
- Phase 11A: Backend Mock Contract Tests
- Phase 11B: Backend Production Deployment Readiness Skeleton
- Phase 12A: Real OCR Provider Contract and Selection Prep
- Phase 12B: Qwen OCR Provider Disabled Adapter Scaffold
- Phase 12C: Qwen OCR Real Transport Behind Explicit Safety Gates
- Phase 12D: Qwen OCR Manual Smoke Test Preflight — Blocked Until Real Key
- Phase 12E: Real Analysis Provider Contract Prep
- Phase 12F: Qwen Analysis Provider Disabled Adapter Scaffold
- Phase 12G: Qwen Analysis Real Transport Behind Explicit Safety Gates
- Phase 12H: Real Provider Gated End-to-End Dry Run Tests
- Phase 13A: Production Backend Deployment Target Prep
- Phase 13B: Render Deployment Config Dry Run
- Phase 13C: Render Manual Deploy Execution — Mock Backend Verified
- Phase 13D: Flutter Internal Build Points to Deployed Render Backend (Flutter widget test overflow fixed)
- Phase 13E: Flutter Web Debug Smoke Test Against Render Backend (manual verified)
- Phase 14A: MVP Alpha Freeze Readiness Audit (audit/documentation complete)
- Phase 14B: MVP Alpha Demo Script & Manual QA Runbook (documentation complete)
- Phase 15B: MVP Alpha Demo Polish (copy/UI polish, no backend changes)
- Phase 15C: Post-polish Manual Demo Smoke Test (manual verification checklist ready)
- Phase 16A: Real Provider Preflight Plan (documentation/safety plan only)

## Current MVP Alpha

**Deployed Backend (mock-only)**: `https://ai-food-passport.onrender.com` — Phase 13C live verification.
- GET /health: `ok: true`, `activeOcrProvider: mock_ocr`, `activeAnalysisProvider: mock_ai`, `realProvidersEnabled: false`, `productionReady: false`
- POST /api/analyze-menu: `ok: true`, 2 mock dishes returned
- All real providers remain disabled; no API keys or secrets configured.
- Flutter can point to deployed backend via `BACKEND_BASE_URL` dart-define (Phase 13D).
- GET / returns 404 (no homepage route); `/api/analyze-menu` must not include trailing slash.

The normal app flow remains local mock by default:

```text
Scan -> optional Gallery preview -> processing overlay -> local mock OCR -> local Mock AI -> Results -> Dish Detail
```

Developer backend testing is optional:

```text
Scan -> local mock OCR -> Backend Mock Mode -> backend OCR-first mock pipeline -> Results or Recovery UX
```

Backend Mock Mode is disabled by default. Provider mode remains informational only. In Backend Mock Mode, Flutter sends the selected provider mode to the backend, and collapsed AI Debug shows requested mode, resolved mode, fallback metadata, and the routing reason.

## Next

- Render mock backend deployed and verified (`ai-food-passport.onrender.com`, Phase 13C)
- Deployment documentation completed (Phases 13A, 13B, 13C)
- Backend deployment readiness documentation and .env.example completed
- Backend mock scenario QA automation completed (102 contract + unit tests)
- Provider routing contract tests for mock/china/global/auto metadata completed
- Provider timeout, rate-limit, budget, and redaction policy enforcement
- OCR provider contract defined with normalization helpers and 80 unit tests
- OCR provider selection documented (Qwen OCR/VL recommended first candidate)
- Qwen OCR adapter scaffold created with fake transport test seam and 34 unit tests
- Real OCR adapter implementation behind disabled backend skeletons
- Real provider gateway implementation behind backend only
- Qwen/DeepSeek/OpenAI adapter skeletons on backend
- Provider health checks and fallback routing policy
- Real exchange-rate service
- Secret management setup in deployment environment variables
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
- Mock backend deployed to Render (Phase 13C); real production deployment pending
- Firebase
- Subscriptions
- Real exchange-rate API
- Production secret management
- Real production deployment (configuration skeleton only — productionReady is still false)
- App Store readiness
