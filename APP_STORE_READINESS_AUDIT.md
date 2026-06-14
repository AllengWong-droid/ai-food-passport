# App Store Readiness Audit

> **Phase**: 21A
> **Date**: 2026-06-14
> **Type**: Documentation-only audit
> **Scope**: TestFlight and App Store submission readiness for AI Food Passport MVP Alpha

---

## 1. Current Status Summary

| Item | Value |
|---|---|
| Project phase | MVP Alpha (portfolio-ready) |
| `productionReady` | `false` |
| Real AI providers enabled | No (all mock) |
| Real OCR provider enabled | No (mock_ocr) |
| Backend | Render mock-only (`ai-food-passport.onrender.com`) |
| API keys in Flutter | None |
| API keys on Render | None |
| Firebase | Not integrated |
| iOS project | Exists (default Flutter scaffold) |
| Bundle ID | Not finalized (`$(PRODUCT_BUNDLE_IDENTIFIER)`) |
| App Store Connect record | Does not exist |
| Apple Developer account | Status unknown |
| Current GitHub tag | `mvp-alpha-portfolio-ready` |
| GitHub Release | Published as pre-release |

---

## 2. Can the Current App Be Submitted to App Store Now?

**No.** The current MVP Alpha cannot be submitted to App Store or TestFlight.

### Immediate blockers:

1. **Mock-only functionality**: The app returns deterministic mock data for every scan. App Store requires functional apps that deliver real value — a mock-only app would be rejected under Guideline 2.1 (Performance: Completeness).
2. **No real backend**: The Render backend is in mock mode with `productionReady: false`. No real AI/OCR providers are enabled.
3. **No Apple Developer Program membership**: Required for both TestFlight and App Store distribution.
4. **No App Store Connect record**: The app has never been registered.
5. **No finalized Bundle ID**: Currently uses a build variable placeholder.

---

## 3. Why the Mock-Only MVP Alpha Should Not Be Submitted

| Concern | Detail |
|---|---|
| **App Store Guideline 2.1** | Apps must be complete and functional. A mock-only food scanner that always returns the same two dishes is not a complete product. |
| **Minimum functionality** | Apple requires apps to "include features, content, and UI that elevate it beyond a repackaged website." Mock data with no real AI is insufficient. |
| **Review rejection risk** | Submitting a mock-only app risks rejection, which creates a negative record on the developer account and may complicate future submissions. |
| **User trust** | Even on TestFlight, external testers would see unrealistic results (same two dishes for every image), damaging credibility. |
| **Privacy labels** | Without real data processing, privacy nutrition labels are hard to define accurately — but inaccurate labels can trigger rejection or App Store takedown. |
| **Portfolio-first strategy** | The current phase is portfolio-ready, not production-ready. Rushing App Store submission undermines the careful, safety-gated approach used so far. |

---

## 4. TestFlight Readiness Checklist

TestFlight is the appropriate first Apple distribution target (before App Store). Here is what must be in place:

| # | Requirement | Current Status | Action Needed |
|---|---|---|---|
| TF1 | Apple Developer Program membership ($99/year) | ❌ Unknown | Enroll or verify existing membership |
| TF2 | App Store Connect app record | ❌ Not created | Create record with final Bundle ID |
| TF3 | Unique Bundle ID (e.g., `com.yourcompany.aifoodpassport`) | ❌ Placeholder | Define and set in Xcode project |
| TF4 | Code signing certificates (development + distribution) | ❌ Not created | Generate in Apple Developer portal |
| TF5 | Provisioning profiles | ❌ Not created | Create in Apple Developer portal |
| TF6 | App builds on real iOS device or simulator (Release mode) | ❌ Not verified | Build with `flutter build ios --release` |
| TF7 | App icon (1024x1024 + all required sizes) | ⚠️ Placeholder only | Replace default Flutter icon with custom design |
| TF8 | Launch screen | ✅ Default storyboard exists | May need customization |
| TF9 | App Store Connect metadata (description, keywords, category, age rating) | ❌ Not created | Prepare metadata text |
| TF10 | Privacy policy URL | ❌ Not created | Host a privacy policy page |
| TF11 | App privacy details (data collection types) | ❌ Not answered | Complete in App Store Connect |
| TF12 | Internal testers added in App Store Connect | ❌ Not added | Add Apple IDs of testers |
| TF13 | Real AI/OCR providers enabled (or at minimum, one real scan flow) | ❌ All mock | Enable at least one real provider behind safety gates |
| TF14 | `productionReady` set to `true` | ❌ `false` | Set after all readiness gates are met |
| TF15 | Crash reporting integration (optional but recommended) | ❌ Not added | Integrate Firebase Crashlytics or similar |

---

## 5. App Store Readiness Checklist

These are additional requirements beyond TestFlight for full App Store submission:

| # | Requirement | Current Status | Action Needed |
|---|---|---|---|
| AS1 | All TestFlight requirements (TF1-TF15) | ❌ Not met | Complete TestFlight checklist first |
| AS2 | App Store screenshots (6.7" and/or 6.5" iPhone) | ⚠️ Web screenshots exist (wrong format) | Capture iOS-native screenshots |
| AS3 | App preview video (optional, recommended) | ❌ Not created | Optional: 15-30 second video |
| AS4 | Review notes for App Review team | ❌ Not written | Write notes explaining mock-API reliance and test account credentials |
| AS5 | Support URL | ❌ Not created | Host a support page or email |
| AS6 | Marketing URL (optional) | ❌ Not created | Optional |
| AS7 | Copyright information | ❌ Not set | Add to App Store Connect |
| AS8 | EULA / Terms of Service (if applicable) | ❌ Not created | Required for apps with user accounts |
| AS9 | Export compliance | ❌ Not answered | Complete encryption questionnaire |
| AS10 | Paid Applications Agreement (if paid) | ❌ Not relevant | Only if the app is paid or has IAP |

---

## 6. Required Apple-Side Assets

### 6.1 Apple Developer Program

- **Cost**: $99 USD/year (individual); $299 USD/year (organization)
- **Current status**: Unknown — needs verification
- **Recommendation**: Do NOT purchase until all readiness gaps in Section 8 and Section 9 are understood. The membership clock starts immediately upon payment.

### 6.2 Apple Developer Account

- An Apple ID with two-factor authentication enabled
- Legal name and address matching government ID
- For organizations: D-U-N-S Number required

### 6.3 Bundle ID

- **Current**: `$(PRODUCT_BUNDLE_IDENTIFIER)` (Xcode build variable placeholder)
- **Located in**: `ios/Runner.xcodeproj/project.pbxproj`
- **Needed**: A unique, reverse-domain identifier (e.g., `com.yourcompany.aifoodpassport`)
- Once set, it cannot be easily changed after release

### 6.4 App Store Connect App Record

- Created at [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
- Requires: Bundle ID, app name, primary language, SKU (any unique string)
- Current: Does not exist

### 6.5 App Icon

- **Current**: Default Flutter placeholder icon (`ios/Runner/Assets.xcassets/AppIcon.appiconset/`)
- **Exists**: Yes — 13 PNG files from 20x20 to 1024x1024
- **Quality**: Unknown (likely the Flutter default emblem)
- **Needed**: Custom designed icon at all required sizes (especially 1024x1024 for App Store)

### 6.6 Launch Screen

- **Current**: Default `LaunchScreen.storyboard` exists
- **Status**: Functional but unstyled
- **Needed**: Branded launch screen matching app design

### 6.7 Screenshots

- **Current**: 7 PNG screenshots in `docs/screenshots/mvp-alpha/`
- **Format**: Flutter Web captures — NOT suitable for App Store
- **Needed**: iOS-native screenshots at required resolutions:
  - 6.7" iPhone (1290 x 2796 px) — required
  - 6.5" iPhone (1284 x 2778 px) — optional if 6.7" provided
  - iPad screenshots (optional)

### 6.8 Privacy Policy URL

- **Current**: Does not exist
- **Needed**: Publicly accessible URL with privacy policy
- **Options**: GitHub Pages, Notion public page, or dedicated hosting
- **Must disclose**: What data is collected, how it is used, third-party sharing

### 6.9 App Privacy Details

- **Current**: Not answered
- **Needed**: Complete privacy nutrition labels in App Store Connect
- **Data types to declare** (when real providers are active):
  - Photos (for menu scanning)
  - User content (scanned menu images)
  - Identifiers (if Firebase auth is added)
  - Diagnostics (if crash reporting is added)

### 6.10 Review Notes

- **Current**: Not written
- **Needed**: Notes for App Review explaining:
  - How to use the app (demo account credentials if applicable)
  - Which features work and which are in development
  - Any known limitations
  - Backend availability expectations (Render free tier cold starts)

---

## 7. Required Engineering Changes Before TestFlight

| # | Change | Priority | Effort Estimate |
|---|---|---|---|
| E1 | Enable at least one real AI provider (Qwen OCR + Qwen Analysis) behind safety gates | **Critical** | Requires real API key |
| E2 | Replace mock currency conversion with real exchange-rate API | High | ~2-3 days |
| E3 | Set real Bundle ID in Xcode project | **Critical** | ~10 minutes |
| E4 | Implement proper error handling for real backend failures | High | ~2-3 days |
| E5 | Add network reachability checks and offline UX | Medium | ~2 days |
| E6 | Add timeout and retry logic for real API calls | High | ~2 days |
| E7 | Implement app version display (about screen or settings) | Low | ~1 hour |
| E8 | Remove or gate all developer-only debug controls for Release builds | **Critical** | Already partially done (DeveloperControlsConfig) — verify completeness |
| E9 | Configure `flutter build ios --release` to succeed without errors | **Critical** | Unknown — must test |
| E10 | Set `productionReady: true` (Render config) | **Blocked** | Must enable real providers first |

---

## 8. Required Engineering Changes Before App Store

All TestFlight changes (E1-E10), plus:

| # | Change | Priority | Effort Estimate |
|---|---|---|---|
| A1 | Firebase integration (authentication, cloud sync, persistence) | High | ~1-2 weeks |
| A2 | Saved scan history with persistent storage | Medium | ~3-5 days |
| A3 | Production security hardening (rate limiting, input validation, HTTPS enforcement) | **Critical** | ~1 week |
| A4 | Crash reporting (Firebase Crashlytics or Sentry) | Medium | ~2-3 days |
| A5 | Privacy policy page (hosted) | **Critical** | ~1-2 days |
| A6 | Support page or email | Medium | ~1 day |
| A7 | EULA / Terms of Service (if user accounts) | Medium | ~2-3 days |
| A8 | App thinning and bitcode configuration | Low | Build config only |
| A9 | Production Render deployment (upgrade from free tier if needed) | Medium | Depends on load |
| A10 | Captured iOS-native App Store screenshots | **Critical** | ~2-3 hours |

---

## 9. Backend / Provider Readiness Requirements

### Current State

| Component | Status |
|---|---|
| OCR provider | `mock_ocr` only |
| Analysis provider | `mock_ai` only |
| Qwen OCR code | Implemented behind safety gates — not enabled |
| Qwen Analysis code | Implemented behind safety gates — not enabled |
| Backend deployment | Render free tier, mock mode |
| `realProvidersEnabled` | `false` |
| `productionReady` | `false` |

### Required for TestFlight

1. Obtain a real Qwen API key (or alternative provider key)
2. Enable Qwen OCR with all three safety gates:
   - `OCR_PROVIDER=qwen_ocr`
   - `QWEN_OCR_PROVIDER_ENABLED=true`
   - `QWEN_API_KEY=<real-key>`
3. Enable Qwen Analysis with all three safety gates:
   - `ANALYSIS_PROVIDER=qwen_analysis`
   - `QWEN_ANALYSIS_PROVIDER_ENABLED=true`
   - `QWEN_API_KEY=<real-key>`
4. Run Phase 16B (Qwen OCR real smoke test) with valid API key
5. Run Phase 16C (Qwen Analysis real smoke test)
6. Run Phase 16D (Combined OCR + Analysis real smoke test)
7. Replace mock currency conversion with a real exchange-rate API
8. Set `productionReady: true` on Render ONLY after all provider gates are verified

### Required for App Store

All TestFlight backend requirements, plus:
1. Monitor API usage and costs for at least 2 weeks
2. Add rate limiting and abuse protection
3. Consider upgrading Render tier if free-tier cold starts are unacceptable
4. Implement backend health monitoring and alerting

---

## 10. Security Requirements

### 10.1 No API Keys in Flutter

- **Current**: ✅ Compliant — no API keys in Flutter code, no `.env` files in Flutter
- **Future**: Must remain this way. All provider keys belong only on the backend Render environment.
- **Verification**: `grep -r "QWEN_API_KEY\|DEEPSEEK_API_KEY\|OPENAI_API_KEY" lib/` returns zero results

### 10.2 Server-Side Provider Keys Only

- **Current**: ✅ Compliant — all provider configuration is on Render env vars
- **Future**: Never add `backend/.env` with real keys to the repository. Keep `.env.example` with placeholder values only.

### 10.3 Backend Safety Gates Preserved

- **Current**: ✅ Compliant — triple-gate system (name + enabled flag + valid key) is in place
- **Future**: The safety gate system must NEVER be bypassed or removed. All 226 gate tests must continue to pass after any changes.

### 10.4 productionReady Must Remain Conservative

- **Current**: `false` — correct for current state
- **When to set to `true`**: Only after all of:
  - Real AI/OCR providers enabled and smoke-tested
  - Real exchange-rate API integrated
  - Firebase auth (or equivalent) integrated
  - All security hardening complete
  - TestFlight build verified by real users for at least 1 week
- **Never**: Set `productionReady: true` while mock-mode is still the fallback

### 10.5 Additional Security Considerations

| Consideration | Current | Needed |
|---|---|---|
| HTTPS for all API calls | ✅ Render provides HTTPS | Maintain |
| Input sanitization | ⚠️ Basic | Strengthen for production |
| CORS | ✅ Enforced | Maintain |
| Request body limits | ✅ Enforced | Maintain |
| Logging redaction | ✅ Implemented | Maintain |
| Error message sanitization | ✅ Implemented | Maintain |
| App Transport Security (ATS) | ⚠️ Default Flutter config | Verify no exceptions needed |
| Data encryption at rest | ❌ Not implemented | Required if saving scan images/history |

---

## 11. Recommended Phased Roadmap

The App Store journey is broken into manageable phases. Each phase is gated on the previous one.

| Phase | Name | Description | Depends On |
|---|---|---|---|
| **21A** | App Store Readiness Audit | This document | — |
| **21B** | TestFlight Preparation Plan | Detailed step-by-step plan with exact commands, screenshots, and config values | 21A complete |
| **16B** | Qwen OCR Real Smoke Test | First real AI call — backend only | Real API key |
| **16C** | Qwen Analysis Real Smoke Test | Real analysis flow tested | 16B complete |
| **16D** | Combined OCR + Analysis Real Smoke Test | End-to-end real pipeline verified | 16B + 16C complete |
| **21C** | iOS Build Readiness | Verify `flutter build ios --release` succeeds; fix build issues | 16D complete |
| **21D** | TestFlight Submission Preparation | Create App Store Connect record, Bundle ID, certs, profiles, metadata | 21C complete + Apple Developer Program |
| **22A** | App Store Submission Preparation | Full App Store metadata, screenshots, review notes, privacy policy | 21D complete + TestFlight validated |

---

## 12. Clear Recommendation

### DO NOT submit the current MVP Alpha directly to App Store.

**Reasons:**
- Mock-only functionality violates App Store Guideline 2.1 (Performance: Completeness).
- No real AI/OCR providers are enabled.
- `productionReady` is `false`.
- The app is **portfolio-ready**, not **production-ready**.

### Recommended approach:

1. **Prepare TestFlight first** (not App Store). TestFlight is a lower bar and allows iterative testing with internal and external testers.
2. **Enable real providers behind safety gates** (Phase 16B-16D) — this is the hard prerequisite before any Apple submission.
3. **Do NOT spend money on Apple Developer Program membership yet.** Wait until:
   - A real API key is obtained and Phases 16B-16D are complete.
   - `flutter build ios --release` succeeds on a Mac.
   - The readiness gaps in Sections 7-10 are understood and prioritized.
   - There is a clear timeline for completing the remaining work.
4. **Continue portfolio-first strategy** while engineering work progresses. The existing GitHub Release, demo showcase, screenshots, portfolio handoff, and walkthrough script are already strong portfolio assets.

### Estimated timeline (rough, based on part-time effort):

| Milestone | Prerequisites | Rough Estimate |
|---|---|---|
| Real API key obtained | — | Unknown |
| Phases 16B-16D complete | Real API key | ~3-5 days |
| flutter build ios succeeds | Mac + Xcode + 16D | ~2-3 days |
| TestFlight internal test | Apple Developer Program + 21C + 21D | ~1 week after all prereqs |
| TestFlight external test (Beta) | Internal test validated | ~2-4 weeks after internal test |
| App Store submission | External TestFlight validated + App Store assets ready | ~2-4 weeks after external test |

---

## Related Documents

| Document | Relevance |
|---|---|
| [MVP_ALPHA_STATUS.md](MVP_ALPHA_STATUS.md) | Current system status and limitations |
| [REAL_PROVIDER_PREFLIGHT_PLAN.md](REAL_PROVIDER_PREFLIGHT_PLAN.md) | Real provider safety gate enablement plan |
| [PHASE_16B0_DRY_RUN_REPORT.md](PHASE_16B0_DRY_RUN_REPORT.md) | Real provider gate verification (226 tests) |
| [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md) | Portfolio pitch and talking points |
| [DEMO_WALKTHROUGH_SCRIPT.md](DEMO_WALKTHROUGH_SCRIPT.md) | Recording scripts and checklist |
| [RELEASE_NOTES_MVP_ALPHA.md](RELEASE_NOTES_MVP_ALPHA.md) | GitHub release notes and LinkedIn blurbs |
| [backend/DEPLOYMENT_READINESS.md](backend/DEPLOYMENT_READINESS.md) | Backend deployment readiness checklist |
| [ROADMAP.md](ROADMAP.md) | Full phase history and future plans |
