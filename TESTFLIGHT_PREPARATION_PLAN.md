# TestFlight Preparation Plan

> **Phase**: 21B
> **Date**: 2026-06-14
> **Type**: Documentation-only preparation plan
> **Depends on**: Phase 21A (App Store Readiness Audit)
> **Purpose**: Step-by-step roadmap from MVP Alpha to TestFlight readiness

---

## 1. Current Readiness Summary

| Dimension | Status | Verdict |
|---|---|---|
| Product completeness | Mock-only food scanner; same 2 dishes every scan | ❌ Not ready |
| Backend | Render mock-mode; `productionReady: false` | ❌ Not ready |
| Real AI/OCR providers | Code exists behind safety gates; not enabled | ❌ Not ready |
| Flutter iOS build | Never tested; no Mac available in this session | ❌ Unknown |
| Apple Developer account | Unknown | ⚠️ Needs verification |
| Apple Developer Program | Not purchased ($99/year) | ❌ Not enrolled |
| App Store Connect | No record exists | ❌ Not created |
| Bundle ID | `$(PRODUCT_BUNDLE_IDENTIFIER)` placeholder | ❌ Not finalized |
| Privacy policy | Not drafted | ❌ Not started |
| App icon | Default Flutter placeholder | ❌ Not designed |
| Compliance | No privacy labels, no EULA | ❌ Not started |
| Test plan | Not defined | ❌ Not started |

**Bottom line**: The project is portfolio-ready, not TestFlight-ready. This plan maps the path from here to there.

---

## 2. Why TestFlight Should Come Before App Store Submission

| Reason | Explanation |
|---|---|
| **Lower bar** | TestFlight is designed for development builds. Apple is more lenient with TestFlight than App Store review. |
| **Iterative testing** | TestFlight allows unlimited internal testers and up to 10,000 external testers. You can iterate without App Store resubmission. |
| **Risk mitigation** | If the app crashes or has bugs on real devices, TestFlight catches it before public release. |
| **Real device validation** | Web and simulator testing cannot catch real-device issues (camera access, image picker, network conditions, memory). |
| **Gradual trust** | Start internal-only, then expand to trusted external testers, then Beta — no big-bang launch. |
| **Apple familiarity** | Going through TestFlight builds a relationship with App Store Connect before the high-stakes App Store review. |

---

## 3. Required Prerequisites Before Spending Money

Do NOT purchase Apple Developer Program ($99/year) until these decisions are made and documented.

### 3.1 Real Provider Decision

| Question | Options | Recommendation |
|---|---|---|
| Which AI/OCR provider? | Qwen (already scaffolded), OpenAI, DeepSeek, other | **Qwen** — code is already implemented and tested behind safety gates (226 tests). Switch later if needed. |
| When to get the API key? | Now, after iOS build verified, after TestFlight decision | **After iOS build verified** — no point paying for API keys if the app can't build for iOS. |
| Budget for API costs? | Free tier, pay-as-you-go, fixed budget | **Start with pay-as-you-go** — estimate costs based on expected TestFlight tester volume. |

### 3.2 Backend Production-Readiness Decision

| Decision | Current | Needed |
|---|---|---|
| Render tier | Free (cold starts) | Free tier OK for internal TestFlight (5-10 testers). Upgrade if cold starts are unacceptable. |
| `productionReady` flag | `false` | Set to `true` ONLY after real providers are enabled and smoke-tested. |
| Monitoring | None | At minimum: Render logs. Optional: uptime monitoring (UptimeRobot free tier). |

### 3.3 Privacy Policy Draft

| Item | Status | Action |
|---|---|---|
| Privacy policy URL | Does not exist | Draft before App Store Connect record creation |
| Hosting | None | Options: GitHub Pages, Notion public page, Firebase Hosting free tier |
| Content needed | None | What data is collected, how used, third-party sharing, user rights |
| Data to disclose | — | Photos (menu scans), user preferences (diet/allergy), crash data (if added) |

### 3.4 App Identity Decision

| Decision | Current | Recommendation |
|---|---|---|
| App name | "Ai Food Passport" (Info.plist `CFBundleDisplayName`) | Consider: "AI Food Passport" (capital AI) or a more distinctive name for App Store |
| Bundle ID | Placeholder | Choose now: `com.{yourname}.aifoodpassport` or similar. Cannot change after release. |
| Category | Not set | "Travel" or "Food & Drink" — decide before App Store Connect record |
| Age rating | Not set | Likely 4+ (no objectionable content) |
| Pricing | Free | Free with no IAP — simplest for MVP |

### 3.5 iOS Build Strategy Decision

| Decision | Options | Recommendation |
|---|---|---|
| Build machine | Local Mac, Mac-in-cloud (MacStadium, MacinCloud), CI/CD (Codemagic, GitHub Actions) | **Local Mac** preferred for first build. CI/CD later. |
| Build tool | Xcode directly, `flutter build ios`, CI/CD pipeline | **`flutter build ios --release`** via Xcode for first build |
| Minimum iOS version | Default (iOS 12+) | Keep Flutter default unless a specific reason to change |
| Device family | iPhone only, Universal (iPhone + iPad) | **iPhone only** for MVP — simpler, fewer screenshot requirements |

---

## 4. TestFlight Preparation Checklist

### 4.1 Product Readiness

| # | Item | Status | Prerequisite Phases |
|---|---|---|---|
| P1 | Real AI/OCR providers enabled (at least one scan flow returns real results) | ❌ | 16B, 16C, 16D |
| P2 | Real currency conversion (not mock rates) | ❌ | Backend exchange-rate API integration |
| P3 | Minimum viable scan → results → detail flow works | ⚠️ Mock-only | P1, P2 |
| P4 | Error handling for real API failures (timeout, rate limit, invalid response) | ❌ | P1 |
| P5 | Offline UX / network reachability feedback | ❌ | — |
| P6 | App version displayed (About or Settings screen) | ❌ | — |
| P7 | Developer-only debug controls hidden in Release mode | ⚠️ Partially done | Verify completeness |
| P8 | No placeholder text, Lorem Ipsum, or debug labels visible to users | ⚠️ Needs audit | — |

### 4.2 Backend Readiness

| # | Item | Status | Prerequisite Phases |
|---|---|---|---|
| B1 | Real providers enabled with valid API keys on Render | ❌ | 16B, 16C, 16D |
| B2 | `realProvidersEnabled: true` on Render | ❌ | B1 |
| B3 | `productionReady: true` on Render | ❌ | B1, B2, security review |
| B4 | Rate limiting configured | ❌ | — |
| B5 | Error responses sanitized (no internal stack traces, no keys) | ✅ Implemented | Phase 10C |
| B6 | CORS enforced | ✅ Implemented | Phase 11C |
| B7 | Backend health monitoring (at minimum: Render logs) | ❌ | — |
| B8 | Render cold-start acceptable for TestFlight testers | ⚠️ Needs assessment | — |

### 4.3 Provider Readiness

| # | Item | Status | Prerequisite Phases |
|---|---|---|---|
| PR1 | Qwen API key obtained | ❌ | — |
| PR2 | Qwen OCR smoke-tested (Phase 16B) | ❌ | PR1 |
| PR3 | Qwen Analysis smoke-tested (Phase 16C) | ❌ | PR1 |
| PR4 | Combined OCR + Analysis smoke-tested (Phase 16D) | ❌ | PR2, PR3 |
| PR5 | Triple safety gates verified in real-provider mode (all 226 tests pass) | ✅ Verified in mock | Run with real config |
| PR6 | API cost monitoring in place | ❌ | PR1 |
| PR7 | Fallback behavior defined if provider is down | ❌ | — |

### 4.4 Flutter iOS Readiness

| # | Item | Status | Prerequisite Phases |
|---|---|---|---|
| F1 | `flutter build ios --release` succeeds without errors | ❌ Never tested | macOS + Xcode |
| F2 | `flutter build ios --release` produces a valid `.ipa` or Xcode archive | ❌ | F1 |
| F3 | App runs on a real iPhone (not just simulator) | ❌ | F1 |
| F4 | Camera / image picker works on real device | ❌ | F3 |
| F5 | iOS-specific permissions configured (NSCameraUsageDescription, NSPhotoLibraryUsageDescription) | ⚠️ Needs verification | — |
| F6 | App Transport Security (ATS) configured correctly | ⚠️ Default config | Review |
| F7 | No Android-only dependencies blocking iOS build | ⚠️ Needs verification | — |
| F8 | `flutter build ios --release` tested with `--dart-define=BACKEND_BASE_URL=...` | ❌ | F1 |

### 4.5 Apple Account Readiness

| # | Item | Status | Prerequisite |
|---|---|---|---|
| A1 | Apple ID with two-factor authentication | ⚠️ Needs verification | — |
| A2 | Legal name and address match government ID | ⚠️ Needs verification | — |
| A3 | D-U-N-S Number (required for organization accounts) | ⚠️ Only if organization | — |
| A4 | Apple Developer Program enrollment ($99/year) | ❌ Not purchased | Decision gates (Section 6) |
| A5 | Team ID available in Apple Developer portal | ❌ | A4 |

### 4.6 App Store Connect Readiness

| # | Item | Status | Prerequisite |
|---|---|---|---|
| C1 | Bundle ID registered with Apple | ❌ | A4 |
| C2 | App Store Connect app record created | ❌ | A4, C1 |
| C3 | App name, category, age rating set in App Store Connect | ❌ | C2 |
| C4 | TestFlight internal testers added (Apple ID emails) | ❌ | A4, C2 |
| C5 | TestFlight external test group created | ❌ | Internal test validated |
| C6 | Build uploaded to App Store Connect | ❌ | F2, C1 |

### 4.7 Privacy and Compliance

| # | Item | Status | Action |
|---|---|---|---|
| PC1 | Privacy policy drafted and hosted at a public URL | ❌ | Draft → host |
| PC2 | App privacy details (data types) answered in App Store Connect | ❌ | After C2 |
| PC3 | NSCameraUsageDescription in Info.plist | ⚠️ Verify | Check `ios/Runner/Info.plist` |
| PC4 | NSPhotoLibraryUsageDescription in Info.plist | ⚠️ Verify | Check `ios/Runner/Info.plist` |
| PC5 | No third-party SDK data collection undisclosed | ✅ None used | Maintain |
| PC6 | Encryption export compliance questionnaire answered | ❌ | During submission |

### 4.8 Test Plan

| # | Item | Status |
|---|---|---|
| T1 | Tester list defined (Apple ID emails) | ❌ |
| T2 | Tester instructions written (how to install TestFlight, how to use app) | ❌ |
| T3 | Test scenarios defined (scan real menu, check currency conversion, view detail) | ❌ |
| T4 | Feedback collection method (TestFlight feedback, separate form, email) | ❌ |
| T5 | Known issues list for testers | ❌ |
| T6 | Build distribution notes for each TestFlight build | ❌ |

---

## 5. Recommended Phased Roadmap

Each phase is gated on the ones before it. Phases with the same number can run in parallel.

| Phase | Name | Type | Depends On | Deliverable |
|---|---|---|---|---|
| **21B** | TestFlight Preparation Plan | Plan | 21A | This document |
| **16B** | Qwen OCR Real Smoke Test | Backend | Real API key | Backend OCR verification |
| **16C** | Qwen Analysis Real Smoke Test | Backend | 16B | Backend analysis verification |
| **16D** | Combined OCR + Analysis Smoke Test | Backend | 16B, 16C | End-to-end real pipeline verified |
| **21C** | iOS Build Readiness Audit | Engineering | 16D, Mac + Xcode | Build verification report |
| **21D** | Privacy Policy & App Metadata Draft | Compliance | — | Draft policy URL, app metadata |
| **21E** | Real-Provider Backend Smoke Plan | Plan | 16D | Detailed real-provider test plan |
| **21F** | Apple Developer Enrollment Decision | Decision | 21C, 21D, 21E | Go/no-go for $99 enrollment |
| **22A** | TestFlight Upload Preparation | Engineering | 21C, 21F, Bundle ID | First TestFlight build |

### Phase Dependency Graph

```
21A ──→ 21B (this phase)
         │
         ├──→ 16B ──→ 16C ──→ 16D ──→ 21C ──┐
         │                                    │
         ├──→ 21D ────────────────────────────┤
         │                                    │
         └──→ 21E ────────────────────────────┤
                                              │
                                    ┌─────────┘
                                    ▼
                                  21F ──→ 22A
```

---

## 6. Clear Decision Gates

### Gate 1: Do NOT buy Apple Developer Program yet

**Condition to pass**: ALL of the following must be true:
- [ ] Real AI/OCR provider is selected and API key is available (or a clear timeline)
- [ ] `flutter build ios --release` has been attempted and its blockers are understood (not necessarily fixed, but known)
- [ ] Privacy policy draft exists (even if not hosted)
- [ ] App name and Bundle ID are decided
- [ ] There is a commitment to completing Phases 16B-16D and 21C within a reasonable timeframe

**Why wait**: The $99/year clock starts immediately. If the project stalls at real-provider integration, the membership is wasted.

### Gate 2: Do NOT submit mock-only MVP to TestFlight

**Exception**: Internal prototype testing only, with explicit tester notes that all results are mock data.

**Condition to pass for external TestFlight**: At minimum:
- [ ] One real scan flow produces real (non-mock) results
- [ ] Error handling exists for real API failures
- [ ] `productionReady: false` is communicated to testers (it's a beta, not production)
- [ ] Tester instructions clearly state which features are real and which are mock

### Gate 3: Do NOT set `productionReady: true`

**Condition to pass**: ALL of the following:
- [ ] Real AI/OCR providers are enabled and validated (Phases 16B-16D)
- [ ] Backend has rate limiting
- [ ] Error responses are sanitized
- [ ] Privacy policy is published
- [ ] No API keys or secrets in Flutter codebase (verified by grep)
- [ ] At least 1 week of internal TestFlight testing with no critical bugs
- [ ] Security hardening checklist is complete (Section 10 of Phase 21A audit)

---

## 7. Risk Table

| Risk | Severity | Likelihood | Mitigation | Current Status |
|---|---|---|---|---|
| **Apple review rejection** | High | Medium (if submitted now) | Do NOT submit mock-only app. Wait until real providers are enabled and tested. | ⚠️ Audit completed (21A). No action taken. |
| **Privacy violation** | Critical | Low | No real user data is collected yet. Draft privacy policy before collecting any data. | ✅ Safe — no user data collected in mock mode |
| **API cost overrun** | Medium | Medium (once real providers enabled) | Start with pay-as-you-go. Set API usage alerts/budget caps. Monitor for first 2 weeks. | ⚠️ No API keys — zero cost today |
| **Provider outage during TestFlight** | Medium | Medium | Define fallback behavior. Consider keeping mock as degraded-mode fallback. | ❌ No fallback defined |
| **Backend downtime (Render free tier)** | Low | Medium (cold starts) | Acceptable for internal TestFlight. Upgrade tier or add uptime monitoring before external testers. | ⚠️ Render free tier — occasional cold starts |
| **iOS build failure** | High | Medium | Unknown until tested on Mac. May require dependency changes, Xcode version updates, or Podfile fixes. | ❌ Never tested on Mac |
| **User data exposure** | Critical | Low | No persistent storage yet. When added: encrypt at rest, minimal collection, clear privacy policy. | ✅ Safe — no data stored |
| **Apple Developer account rejection** | Medium | Low | Ensure legal name/address matches government ID. For organizations: D-U-N-S Number ready. | ⚠️ Not applied yet |
| **TestFlight tester confusion** | Low | Medium | Clear tester instructions. Label build as "Internal Beta — mock data only" until real providers are active. | ⚠️ No test plan yet |
| **Scope creep** | Medium | High | Stick to minimum TestFlight scope (Section 8). Resist adding features before first TestFlight build. | ⚠️ This plan defines the scope |

---

## 8. Suggested Minimum TestFlight Scope

### Internal TestFlight (Phase 22A)

- **Tester count**: 2-5 internal testers (team members, not public)
- **Provider mode**: Real AI/OCR providers enabled, with mock fallback available
- **Build label**: "Internal Alpha — real provider testing"
- **Scope**:
  - Scan 3-5 real menus (different cuisines, languages)
  - Verify OCR text extraction quality
  - Verify AI analysis quality (dish identification, allergens, recommendations)
  - Verify currency conversion with real rates
  - Test error recovery (airplane mode, poor connection, timeout)
  - Test cold-start behavior from Render free tier
- **Duration**: 1-2 weeks
- **Success criteria**:
  - No crashes across all test devices
  - Real OCR and analysis produce reasonable results for at least 80% of test scans
  - Error handling works gracefully (no raw stack traces, no blank screens)
  - Testers can complete the scan → results → detail flow within 30 seconds

### What NOT to include in minimum scope

- ❌ Public external TestFlight (>25 testers)
- ❌ Production marketing claims ("AI Food Scanner on TestFlight — try it now!")
- ❌ User accounts / authentication / Firebase
- ❌ Persistent scan history
- ❌ Multi-language UI (English-only is fine for first TestFlight)
- ❌ iPad support
- ❌ Multiple backend regions
- ❌ Real-time currency updates (daily batch is fine)

---

## 9. Required Artifacts

Each artifact has a "trigger" — do not create it until the trigger condition is met.

| # | Artifact | Current State | Trigger to Create | Phase |
|---|---|---|---|---|
| 1 | **App Name** | "Ai Food Passport" | Decide now | 21B |
| 2 | **Bundle ID** | `$(PRODUCT_BUNDLE_IDENTIFIER)` | Decide before Phase 21F | 21B |
| 3 | **App Icon** | Default Flutter placeholder | Design before Phase 22A (at minimum: a 1024x1024 PNG placeholder that is not the Flutter default) | 21C-22A |
| 4 | **Launch Screen** | Default storyboard | Customize before Phase 22A | 21C-22A |
| 5 | **Screenshots** | Web-only (7 PNGs in docs/) | Capture iOS-native after real providers enabled | After 16D |
| 6 | **Privacy Policy URL** | Not drafted | Draft in 21D; host before Phase 22A | 21D |
| 7 | **Support URL** | Not created | Create before Phase 22A | 21D |
| 8 | **Test Account / Tester Instructions** | Not written | Write before first TestFlight build distribution | 22A |
| 9 | **Review Notes** | Not written | Write during Phase 22A (for App Store Connect submission) | 22A |
| 10 | **Build Distribution Notes** | Not written | Write for each TestFlight build (what changed, known issues) | 22A+ |

### Artifact Details

#### App Name
- **Current**: "Ai Food Passport" (from `ios/Runner/Info.plist` `CFBundleDisplayName`)
- **Consideration**: App Store displays up to 30 characters. "AI Food Passport" (capital AI) or a distinctive name like "FoodPass" or "MenuLens"
- **Recommendation**: Keep "AI Food Passport" for MVP — change later if needed

#### Bundle ID
- **Format**: Reverse-domain (e.g., `com.yourname.aifoodpassport`)
- **Constraint**: Cannot be changed after first App Store release
- **Where to set**: Xcode project → Runner target → General → Bundle Identifier
- **Recommendation**: Decide now and document; set in Xcode during Phase 21C

#### App Icon
- **Current**: Default Flutter icon (blue diamond on white)
- **Minimum for TestFlight**: A custom 1024x1024 PNG (does not need to be final design)
- **Recommendation**: Create a simple text-based icon or use a free icon generator for TestFlight. Final design can come later for App Store.

---

## 10. Final Recommendation

### Overall Verdict

**Continue planning. Do NOT spend money yet.**

The project has a clear path to TestFlight, but the hard prerequisite — enabling real AI/OCR providers — has not been met. Until a real API key is obtained and Phases 16B-16D are complete, it is premature to buy Apple Developer Program or attempt an iOS build.

### Next Practical Steps (in priority order)

| Priority | Phase | What | Blocked By |
|---|---|---|---|
| 1 | **16B** | Qwen OCR real smoke test | Real Qwen API key |
| 2 | **21D** | Draft privacy policy | None (can start now) |
| 3 | **21C** | iOS build readiness audit | Access to Mac + Xcode + Phase 16D |
| 4 | **21E** | Real-provider backend smoke plan | Phase 16D |
| 5 | **21F** | Apple Developer enrollment decision | Phases 21C, 21D, 21E |
| 6 | **22A** | TestFlight upload preparation | Phase 21F |

### What CAN be done now (no money, no API key, no Mac)

1. **Decide app name and Bundle ID** — free, takes 10 minutes
2. **Draft privacy policy** — free, takes 1-2 hours (Phase 21D)
3. **Design app icon concept** — free (use Figma, Canva, or free icon tools)
4. **Write tester instructions draft** — free, takes 1 hour
5. **Research Qwen API pricing** — free, takes 30 minutes
6. **Verify Apple ID readiness** — free (ensure 2FA is on, legal name matches)
7. **Review all API usage docs** for chosen provider — free

### What requires a decision before proceeding

| Decision | Options | Recommended Choice |
|---|---|---|
| AI/OCR provider | Qwen, OpenAI, DeepSeek | **Qwen** (code already implemented, 226 gate tests pass) |
| iOS build approach | Local Mac, cloud Mac, CI/CD | **Local Mac** for first build; CI/CD later |
| App name | "AI Food Passport" or new name | **Keep "AI Food Passport"** for MVP |
| Bundle ID | `com.{name}.aifoodpassport` | **Decide now, document here** |
| TestFlight scope | Internal only, external limited, public | **Internal only** (2-5 testers) for first build |

---

## Related Documents

| Document | Relevance |
|---|---|
| [APP_STORE_READINESS_AUDIT.md](APP_STORE_READINESS_AUDIT.md) | Full audit of TestFlight and App Store readiness (Phase 21A) |
| [MVP_ALPHA_STATUS.md](MVP_ALPHA_STATUS.md) | Current system status and limitations |
| [REAL_PROVIDER_PREFLIGHT_PLAN.md](REAL_PROVIDER_PREFLIGHT_PLAN.md) | Real provider safety gate enablement plan |
| [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md) | Portfolio pitch and talking points |
| [backend/DEPLOYMENT_READINESS.md](backend/DEPLOYMENT_READINESS.md) | Backend deployment readiness |
| [ROADMAP.md](ROADMAP.md) | Full phase history and future plans |
