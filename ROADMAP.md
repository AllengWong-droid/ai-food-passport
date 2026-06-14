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
- Phase 16B0: Real Provider Preflight Dry Run (documentation/verification only)
- Phase 17A: MVP Alpha Demo Packaging (README, MVP_ALPHA_STATUS.md, documentation)
- Phase 17B: MVP Alpha Release Snapshot (MVP_ALPHA_RELEASE_SNAPSHOT.md, frozen baseline)
- Phase 18A: Demo Screenshot and Portfolio Package Plan (MVP_ALPHA_SCREENSHOT_PLAN.md, documentation plan only)
- Phase 18B0: Screenshot Data Source Alignment (backendMockModeProvider fix + OCR language fix, 1 Flutter file)
- Phase 18B: MVP Alpha Screenshot Capture (7 screenshots in docs/screenshots/mvp-alpha/)
- Phase 18C: MVP Alpha Portfolio Demo Showcase (MVP_ALPHA_DEMO_SHOWCASE.md, polished portfolio showcase)
- Phase 18D: Public Repo Final QA and Portfolio Handoff Audit (2 misleading items fixed, 0 secrets found, all 8 checklist items pass)
- Phase 19A: Portfolio Handoff Packet (PORTFOLIO_HANDOFF.md — pitch, talking points, claim boundaries, next engineering steps)
- Phase 19B: Demo Walkthrough Script & Recording Checklist (DEMO_WALKTHROUGH_SCRIPT.md — 30s/90s/3min scripts, narration, recording checklist, video title)
- Phase 19C: GitHub Release Notes Draft (RELEASE_NOTES_MVP_ALPHA.md — release title, summary, GitHub release body, LinkedIn blurbs)
- Phase 21A: App Store Readiness Audit (APP_STORE_READINESS_AUDIT.md — 12-section audit, 0/15 TestFlight items ready, DO NOT submit)
- Phase 21B: TestFlight Preparation Plan (TESTFLIGHT_PREPARATION_PLAN.md — 54-item checklist, 3 decision gates, 10-risk table, do not spend money yet)
- Phase 21C: iOS Build Readiness Audit (IOS_BUILD_READINESS_AUDIT.md — 16-section audit, 4 blockers identified, 10 free actions now)
- Phase 21D: App Identity Decision (APP_IDENTITY_DECISION.md — name options, Bundle ID, category, subtitle, icon/launch screen direction, final decision table)
- Phase 21E: Privacy Policy & App Metadata Draft (PRIVACY_POLICY_DRAFT.md — 11 sections, current MVP Alpha data collection: none; APP_STORE_METADATA_DRAFT.md — 14 sections, name, subtitle, keywords, description, category, review notes, TestFlight tester instructions, what NOT to claim)
- Phase 21F: Privacy Policy GitHub Pages Hosting Plan (PRIVACY_POLICY_HOSTING_PLAN.md — 12 sections, why needed, URL options, file structure, 6 required disclaimers, step-by-step setup, 16-item validation checklist, future update process)
- Phase 21G: Create Privacy Policy GitHub Pages Page (docs/privacy-policy.html — static HTML page, 10 sections, 6 disclaimers, accurate two-mode wording, mobile-responsive, zero external dependencies)
- Phase 21H: Privacy Policy Public URL Verification & Metadata Alignment (verified live URL, aligned APP_STORE_METADATA_DRAFT.md and PRIVACY_POLICY_HOSTING_PLAN.md with actual URL, validated 16/16 checklist items pass)
- Phase 21I: App Icon & Launch Screen Design Spec (APP_ICON_LAUNCH_SCREEN_SPEC.md — 13-section visual identity spec, icon concept, launch screen layout, screenshot captions, forbidden claims, future implementation steps; no code/config/assets changed)
- Phase 21J: App Icon Prompt Pack & Asset Generation Plan (APP_ICON_PROMPT_PACK.md — English + Chinese icon prompts, 5 concept variants, 18-category negative prompt, launch screen prompt, 16-item acceptance checklist, 12-item rejection checklist, export plan, prompt usage guide; no images generated, no code/config changed)
- Phase 21K: TestFlight Readiness Gap Closure Plan (TESTFLIGHT_GAP_CLOSURE_PLAN.md — 18 blocking gaps identified, 14 technical gaps, 42-item milestone checklist, 8-item "do not do yet" list, order of operations by resource type, decision matrix, 3-gate framework, 3 recommended next phases; no code/config changed)
- Phase 22A: App Icon Candidate Review & Selection Record (APP_ICON_CANDIDATE_REVIEW.md — selected Candidate 1 recolored version: royal/cobalt blue passport, gold fork/spoon, globe linework, cyan rim glow; 3 rejected candidates with rationale; 15/16 acceptance passed, 0/12 rejection hit; no binary assets committed, no code/config changed)
- Phase 22B: App Icon Master Asset Intake (design/app-icon/source/ai-food-passport-selected-icon-master.png — 1254x1254 px PNG, 2,349,686 bytes, ingested as design-source only; APP_ICON_MASTER_ASSET_INTAKE.md, design/app-icon/README.md; icon NOT applied to Flutter/iOS yet; no code/config/secrets changed)
- Phase 22C: App Icon QA & Small-Size Validation (APP_ICON_QA_SMALL_SIZE_VALIDATION.md — full QA report, 7 preview PNGs at 1024/512/180/120/60/40px + contact sheet under design/app-icon/preview/, 19/20 acceptance score as design-source asset, baked-in rounded corners flagged as MEDIUM severity, readable down to 60px acceptable/40px borderline; no code/config/secrets changed)
- Phase 22D: Clean Square App Icon Master Regeneration Plan (APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md — 8-section plan: why regeneration needed, current design summary, problem statement, 9-item clean square criteria, AI generation prompt + negative prompt, 20-item acceptance checklist, 12-item rejection checklist, next step workflow; planning-only, no binary assets created, no code/config/secrets changed)
- Phase 22E: Clean Square App Icon Master Intake & QA (APP_ICON_CLEAN_SQUARE_MASTER_INTAKE.md — full intake & QA report, 21/21 validation pass (square 1254x1254 RGB opaque, no alpha, no baked-in corners), 7 preview PNGs + comparison sheet under design/app-icon/preview/, accepted as preferred future export source, Phase 22C rounded-corner issue RESOLVED, previous source archived as design reference; no code/config/secrets changed)
- Phase 22F: Design-Only App Icon Export Set (APP_ICON_DESIGN_ONLY_EXPORT_SET.md — 14 iOS icon sizes exported from clean square master under design/app-icon/export/design-only/, contact sheet generated, design-only review assets, NOT applied to Flutter/iOS, no code/config/secrets changed)
- Phase 22G: App Icon Design Line Closure / Handoff (APP_ICON_DESIGN_HANDOFF.md — design line closed for portfolio/MVP documentation, handoff document with visual direction, preferred source asset, export set path, QA summary, safety review, implementation gap, future checklist; PHASE_22G_REPORT.md; no code/config/secrets changed)

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

- **Phase 16B**: Qwen OCR real smoke test — requires a real test API key (backend-only). Blocked until key exists.
- **Phase 16C**: Qwen Analysis real smoke test — requires Phase 16B completed.
- **Phase 16D**: Combined OCR + Analysis real smoke test — requires 16B and 16C completed.
- **Firebase integration**: Authentication, cloud sync, persistence.
- **Real exchange-rate API**: Replace mock currency conversion.
- **Production deployment**: Real production backend with provider keys, security hardening.
- **App Store preparation**: Screenshots, metadata, compliance review.
- **Saved scan history**: Persistent scan records.

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
- Real production deployment
- Firebase
- Subscriptions
- Real exchange-rate API
- Production secret management
- Real production deployment (configuration skeleton only — productionReady is still false)
- App Store readiness
