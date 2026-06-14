# TestFlight Readiness Gap Closure Plan

> **Phase**: 21K
> **Date**: 2026-06-14
> **Type**: Planning document — no code or config changes
> **Depends on**: Phase 21J (App Icon Prompt Pack), Phase 21B (TestFlight Preparation Plan)
> **Purpose**: Map remaining gaps between current portfolio-ready MVP Alpha and future TestFlight readiness

---

## Important Honesty Statements

**Before reading this document, understand the current reality:**

- This project is **MVP Alpha / mock-only**. It returns the same 2 hardcoded dishes for every scan.
- **No real AI or OCR providers are enabled.** All Qwen/OpenAI/DeepSeek code sits behind safety gates that are NOT activated.
- **The backend is not production-ready.** `productionReady` remains `false`.
- **No Mac/Xcode build has been performed.**
- **No Apple Developer Program membership has been purchased.**
- **No App Store Connect record exists.**
- **This document is a gap-closure plan, not a status report of completed work.**

---

## 1. Current Readiness Summary

| Dimension | Status | Detail |
|---|---|---|
| **Portfolio-ready** | ✅ MVP Alpha | Demo video, screenshots, release notes, public repo, GitHub Pages privacy policy all complete |
| **TestFlight-ready** | ❌ Not yet | Multiple technical, account, and asset gaps remain |
| **App Store-ready** | ❌ Not yet | Farther than TestFlight — requires TestFlight validation first |
| **Backend** | ⚠️ Mock-only on Render | `productionReady: false`, `realProvidersEnabled: false` |
| **Real AI/OCR providers** | ❌ Disabled | Code exists behind safety gates (226 gate tests pass in mock mode) |
| **iOS build** | ❌ Never attempted | No macOS available in this session |
| **Apple Developer Program** | ❌ Not purchased | $99/year — decision gated on Mac/Xcode access + real provider readiness |

---

## 2. What Is Already Done

Since the original TestFlight Preparation Plan (Phase 21B), many preparatory items have been completed in Phases 21A-21J.

### 2.1 Completed Since Phase 21B

| # | Item | Phase | Status |
|---|---|---|---|
| 1 | **Public repo** with all source, docs, and demo artifacts | Pre-21A | ✅ |
| 2 | **Render mock backend** deployed and health-checked | 13C | ✅ `https://ai-food-passport.onrender.com` |
| 3 | **Demo screenshots** (7 PNGs in `docs/screenshots/mvp-alpha/`) | 18B | ✅ |
| 4 | **Release notes** (GitHub Releases) | 18-20 | ✅ |
| 5 | **Privacy policy drafted** (`PRIVACY_POLICY_DRAFT.md`) | 21E | ✅ |
| 6 | **Privacy policy hosted at public URL** | 21G/21H | ✅ `https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html` |
| 7 | **Privacy policy hosting plan** (`PRIVACY_POLICY_HOSTING_PLAN.md`) | 21F | ✅ |
| 8 | **App Store metadata draft** (`APP_STORE_METADATA_DRAFT.md`) | 21E | ✅ |
| 9 | **App identity decision** (name, Bundle ID, category, subtitle) | 21D | ✅ |
| 10 | **App icon & launch screen design spec** (`APP_ICON_LAUNCH_SCREEN_SPEC.md`) | 21I | ✅ |
| 11 | **App icon prompt pack** (`APP_ICON_PROMPT_PACK.md`) | 21J | ✅ |
| 12 | **iOS build readiness audit** (`IOS_BUILD_READINESS_AUDIT.md`) | 21C | ✅ |
| 13 | **TestFlight preparation plan** (54-item checklist) | 21B | ✅ |
| 14 | **App Store readiness audit** | 21A | ✅ |
| 15 | **Real provider preflight plan** | 16A | ✅ |
| 16 | **Portfolio handoff** | 18D | ✅ |

### 2.2 TestFlight Preparation Plan (Phase 21B) — Item Status Update

Of the 54 items in the original TestFlight Preparation Plan (Phase 21B), here's the updated status:

| Category | Was (Phase 21B) | Now (Phase 21K) |
|---|---|---|
| Product Readiness (P1-P8) | 6 ❌, 2 ⚠️ | 6 ❌, 2 ⚠️ (unchanged — requires real providers) |
| Backend Readiness (B1-B8) | 6 ❌, 1 ✅, 1 ⚠️ | 6 ❌, 2 ✅ (B5, B6 done; B1-B4, B7-B8 unchanged) |
| Provider Readiness (PR1-PR7) | 5 ❌, 1 ✅, 1 ⚠️ | 5 ❌, 1 ✅, 1 ⚠️ (unchanged — requires real API key) |
| Flutter iOS (F1-F8) | 5 ❌, 3 ⚠️ | 5 ❌, 3 ⚠️ (unchanged — requires macOS) |
| Apple Account (A1-A5) | 3 ⚠️, 2 ❌ | 3 ⚠️, 2 ❌ (unchanged — requires purchase) |
| App Store Connect (C1-C6) | 6 ❌ | 6 ❌ (unchanged — requires Apple Developer membership) |
| Privacy/Compliance (PC1-PC6) | 4 ❌, 1 ✅, 1 ⚠️ | 2 ❌, 3 ✅, 1 ⚠️ (PC1 done = privacy policy live; PC5 already done) |
| Test Plan (T1-T6) | 6 ❌ | 6 ❌ (unchanged — requires TestFlight access to be meaningful) |

**Net progress since Phase 21B**: 3 privacy/compliance items completed. All technical and account items remain blocked.

---

## 3. Blocking Gaps Before TestFlight

These gaps must be closed before the first TestFlight build can be uploaded.

### 3.1 Account & Environment Gaps

| # | Gap | Current | Required | Cost | When to Close |
|---|---|---|---|---|---|
| G1 | **Apple Developer Program membership** | ❌ Not purchased | Active membership ($99/year) | $99/year | After Mac/Xcode access confirmed |
| G2 | **macOS + Xcode access** | ❌ Not available | A Mac with Xcode 15+ | Free (if own Mac) or ~$1/hour (cloud) | Before any iOS build attempt |
| G3 | **Apple ID with 2FA** | ⚠️ Needs verification | Verified Apple ID with two-factor auth | Free | Can do now |
| G4 | **D-U-N-S Number** (org accounts only) | ⚠️ May be needed | If enrolling as organization | Free (takes 5-30 days) | If enrolling as org, start now |

### 3.2 Identity & Config Gaps

| # | Gap | Current | Required | When to Close |
|---|---|---|---|---|
| G5 | **Bundle ID finalization** | `com.example.aiFoodPassport` (placeholder) | `com.<yourdomain>.aifoodpassport` | Before App Store Connect record creation |
| G6 | **Bundle ID set in Xcode project** | Not applied | Updated in `project.pbxproj` and `Info.plist` | When Xcode is available |
| G7 | **iOS display name** (`CFBundleDisplayName`) | `Ai Food Passport` (17 chars) | `AI Food Passport` | Before first TestFlight build |
| G8 | **iOS bundle name** (`CFBundleName`) | `ai_food_passport` (17 chars, exceeds 15 limit) | `Food Passport` (13 chars, within limit) | Before first TestFlight build |

### 3.3 Visual Asset Gaps

| # | Gap | Current | Required | When to Close |
|---|---|---|---|---|
| G9 | **App icon** (custom, not Flutter default) | 19 Flutter default PNGs | Custom icon matching design spec in `APP_ICON_LAUNCH_SCREEN_SPEC.md` | Before TestFlight upload |
| G10 | **Launch screen branded** | Blank white storyboard | Navy background + centered icon mark + app name per `APP_ICON_LAUNCH_SCREEN_SPEC.md` Section 8 | Before TestFlight upload |

### 3.4 Technical Gaps

| # | Gap | Current | Required | When to Close |
|---|---|---|---|---|
| G11 | **iOS build verified** | Never attempted on Mac | `flutter build ios --release` succeeds without errors | Before TestFlight upload |
| G12 | **iOS device tested** | Never run on iPhone | App runs on at least one real iPhone | Before external TestFlight |
| G13 | **Signing & provisioning** | Not configured | Automatic signing via Xcode or manual certificate/profile | Before TestFlight upload |

### 3.5 App Store Connect Gaps

| # | Gap | Current | Required | When to Close |
|---|---|---|---|---|
| G14 | **App Store Connect record** | Does not exist | App record created with Bundle ID, name, category, age rating | After Apple Developer membership + Bundle ID finalized |
| G15 | **TestFlight internal testers** | No list, no record | Apple ID emails of 2-5 internal testers added | After App Store Connect record created |
| G16 | **Privacy labels** (App Store Connect) | Not answered | Data collection types answered in App Store Connect | During TestFlight build submission |
| G17 | **Export compliance** | Not answered | Encryption export questionnaire completed | During TestFlight build submission |
| G18 | **Beta review notes** | Not written | Notes for TestFlight beta review explaining mock/real provider status | At TestFlight upload time |

---

## 4. Technical Gaps

Beyond the blocking gaps above, these technical items must be addressed before `productionReady` can be set to `true`.

### 4.1 Provider Gaps

| # | Gap | Detail | Blocked By |
|---|---|---|---|
| T1 | **Qwen OCR real smoke test** | Phase 16B — verify OCR produces real text extraction from a real menu image | Real Qwen API key |
| T2 | **Qwen Analysis real smoke test** | Phase 16C — verify analysis produces real dish identification, allergen flags, price suggestion | Phase 16B complete |
| T3 | **Combined OCR + Analysis test** | Phase 16D — verify end-to-end scan-to-results pipeline with real providers | Phases 16B + 16C complete |
| T4 | **Provider gate dry-run in real mode** | Run all 226 gate tests with actual provider config (not mock) | Real API key + provider env vars set |
| T5 | **Fallback behavior defined** | What happens if the real provider returns an error, times out, or goes down? | After real provider testing |

### 4.2 Backend Gaps

| # | Gap | Detail | Blocked By |
|---|---|---|---|
| T6 | **Rate limiting configured** | Prevent abuse during TestFlight | After real providers enabled |
| T7 | **Backend monitoring in place** | At minimum: Render logs monitoring. Optional: UptimeRobot free tier. | After real providers enabled |
| T8 | **Render cold-start acceptable** | Free tier spins down after inactivity. Acceptable for initial internal TestFlight (2-5 testers). | Needs tester feedback |
| T9 | **Production data retention policy** | Define how long scan results are retained, if any. Currently: no persistence at all. | Before external TestFlight |
| T10 | **`productionReady: true`** | Set on Render backend only after real providers enabled, rate limiting configured, error sanitization verified, privacy policy published, and at least 1 week of internal testing. | All of the above |

### 4.3 Security Gaps

| # | Gap | Detail | Blocked By |
|---|---|---|---|
| T11 | **No API keys in Flutter** | Verify via grep: zero `QWEN_API_KEY`, `DEEPSEEK_API_KEY`, `OPENAI_API_KEY` in Flutter source | Before `productionReady: true` |
| T12 | **Error response sanitization** | No stack traces, no internal paths, no API key fragments in error responses | Already done (Phase 10C) — re-verify with real providers |
| T13 | **CORS enforcement** | Backend rejects cross-origin requests from non-Flutter origins | Already done (Phase 11C) |
| T14 | **HTTPS only** | Render provides HTTPS by default | Already done — Render default |

---

## 5. Recommended Order of Operations

### 5.1 Free — Can Do Now (No Mac, No Apple Membership, No API Key)

| # | Action | Phase | Effort | Impact |
|---|---|---|---|---|
| F1 | Verify Apple ID readiness (2FA enabled, legal name matches ID) | — | 10 min | Unblocks A4 enrollment |
| F2 | Finalize Bundle ID (`com.<yourdomain>.aifoodpassport`) | — | 5 min | Must be locked in before App Store Connect |
| F3 | Generate icon candidates using prompts from `APP_ICON_PROMPT_PACK.md` | Future: visual design | 30 min | Icon ready for when Xcode is available |
| F4 | Review and shortlist icon candidates using acceptance checklist | Future: visual design | 15 min | Reduces future design-phase turn time |
| F5 | Write TestFlight tester instructions draft | — | 30 min | Ready when TestFlight is set up |
| F6 | Research Qwen API pricing (free tier vs. pay-as-you-go) | — | 15 min | Informed decision before buying API key |
| F7 | Continue documentation polish (ROADMAP, README, cross-references) | Ongoing | — | Keeps project organized |
| F8 | Audit Flutter code for any remaining placeholder text or debug labels | — | 30 min | Improves TestFlight readiness |

### 5.2 Requires Mac + Xcode (No Apple Membership Needed)

| # | Action | Phase | Effort | Impact |
|---|---|---|---|---|
| M1 | `flutter build ios --release` — first build attempt | — | 1-2 hours | Verifies iOS build pipeline works |
| M2 | Fix any build errors (Podfile, Xcode version, dependency conflicts) | — | Variable | Necessary for TestFlight |
| M3 | Apply Bundle ID and display name in Xcode project | Future: apply identity | 15 min | Identity configured |
| M4 | Apply app icon using `flutter_launcher_icons` | Future: visual design | 15 min | Branded app icon |
| M5 | Customize `LaunchScreen.storyboard` per design spec | Future: visual design | 30 min | Branded launch screen |
| M6 | Run app on iOS Simulator — verify camera, image picker, navigation | — | 30 min | Functional validation |
| M7 | Test with `--dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com` | — | 15 min | Backend connectivity verified |

### 5.3 Requires Apple Developer Program Membership ($99/year)

| # | Action | Phase | Effort | Impact |
|---|---|---|---|---|
| A1 | Enroll in Apple Developer Program | — | Setup: 1 hour; Approval: 1-7 days | Unlocks all TestFlight/App Store |
| A2 | Register Bundle ID in Apple Developer portal | — | 5 min | Required for signing |
| A3 | Create App Store Connect record | — | 10 min | Required for TestFlight |
| A4 | Configure automatic signing in Xcode | — | 5 min | Simplified code signing |
| A5 | Archive and upload build to App Store Connect | — | 30 min | First TestFlight build |
| A6 | Add internal testers (Apple ID emails) | — | 10 min | Testers can install |
| A7 | Complete privacy labels in App Store Connect | — | 15 min | Required for submission |
| A8 | Complete export compliance questionnaire | — | 5 min | Required for submission |
| A9 | Write beta review notes | — | 15 min | Required for TestFlight review |
| A10 | Submit for TestFlight beta review | — | 5 min | Await Apple review (typically 1-2 days) |

### 5.4 Requires Real Provider API Key

| # | Action | Phase | Effort | Impact |
|---|---|---|---|---|
| R1 | Obtain Qwen API key (free tier or pay-as-you-go) | — | Setup: 15 min | Unlocks real provider testing |
| R2 | Set `OCR_PROVIDER=qwen_ocr` + related env vars on Render | 16B | 10 min | Backend uses real OCR |
| R3 | Set `ANALYSIS_PROVIDER=qwen_analysis` + related env vars on Render | 16C | 10 min | Backend uses real analysis |
| R4 | Run Qwen OCR real smoke test (Phase 16B) | 16B | 30 min | OCR verified with real menu image |
| R5 | Run Qwen Analysis real smoke test (Phase 16C) | 16C | 30 min | Analysis verified with real results |
| R6 | Run Combined OCR + Analysis smoke test (Phase 16D) | 16D | 30 min | End-to-end pipeline verified |
| R7 | Run provider gate tests with real config (not mock) | 16D | 15 min | Safety gates verified in production mode |
| R8 | Set `realProvidersEnabled=true` on Render | — | 5 min | Backend uses real providers |
| R9 | Set `productionReady=true` on Render (after all conditions met) | — | 5 min | Backend marked as production-ready |

---

## 6. "Do Not Do Yet" List

These actions should be explicitly deferred until their prerequisites are met.

| # | Do NOT Do | Why | What Needs to Happen First |
|---|---|---|---|
| D1 | **Claim production-ready** | `productionReady` remains `false`. Backend is mock-only. | Real providers enabled + tested + 1 week internal testing |
| D2 | **Submit to App Store** | App is not even TestFlight-ready. Mock-only app will be rejected. | TestFlight validated + 1+ months of testing |
| D3 | **Enable real providers without backend-only key handling** | API keys in Flutter = security risk. Keys must stay server-side. | Confirm all 13 API-key safety gates are active in real mode |
| D4 | **Put API keys in Flutter** | Violates the project's "no keys in client" rule. All provider calls go through the backend. | Never — this is a permanent rule |
| D5 | **Buy Apple Developer membership before Mac/Xcode path is clear** | $99/year clock starts immediately. If the project can't build for iOS, the membership is wasted. | Successful `flutter build ios --release` on a Mac |
| D6 | **Buy Apple Developer membership before real provider API key is available** | The app with mock-only results is not worth the paid membership. | Real API key obtained + at least Phase 16B smoke test pass |
| D7 | **Add Firebase** | Project has no authentication or data persistence plan yet. Firebase adds cost and scope creep. | Define data persistence requirements first |
| D8 | **Expand to iPad support** | iPhone-only for MVP. iPad adds 2x screenshot requirements and layout complexity. | After successful iPhone TestFlight |
| D9 | **Market as "AI-powered" publicly** | All providers are mock-only. "AI-powered" claims are misleading until real providers are enabled. | Real providers enabled and publicly visible |
| D10 | **Solicit public external TestFlight testers** | Mock-only app will confuse and disappoint external testers. | At minimum: real providers enabled, error handling verified |

---

## 7. Milestone Checklist

### 7.1 Portfolio-Ready (All Phases Through 21J)

| # | Milestone | Status |
|---|---|---|
| M1 | Public GitHub repo with all source | ✅ Done |
| M2 | Render mock backend deployed and health-checked | ✅ Done |
| M3 | Demo video and 7 screenshots in `/docs` | ✅ Done |
| M4 | GitHub Releases with release notes | ✅ Done |
| M5 | Privacy policy drafted and hosted at public URL | ✅ Done |
| M6 | App Store metadata draft | ✅ Done |
| M7 | App identity decision (name, Bundle ID, category, subtitle) | ✅ Done |
| M8 | App icon & launch screen design spec | ✅ Done |
| M9 | App icon prompt pack | ✅ Done |
| M10 | Real provider preflight plan | ✅ Done |
| M11 | All Flutter tests passing (42/42) | ✅ Done |

### 7.2 TestFlight-Prep Documentation

| # | Milestone | Status |
|---|---|---|
| M12 | TestFlight preparation plan (54 items) | ✅ Done (Phase 21B) |
| M13 | iOS build readiness audit (4 blockers identified) | ✅ Done (Phase 21C) |
| M14 | Privacy policy hosting plan | ✅ Done (Phase 21F) |
| M15 | Gap closure plan (this document) | ✅ Done (Phase 21K) |
| M16 | Tester instructions draft | ❌ Not started |
| M17 | Beta review notes draft | ❌ Not started |

### 7.3 TestFlight-Build Preparation

| # | Milestone | Status |
|---|---|---|
| M18 | Real AI/OCR provider API key obtained | ❌ Blocked (no API key) |
| M19 | Qwen OCR real smoke test pass (Phase 16B) | ❌ Blocked (needs R1) |
| M20 | Qwen Analysis real smoke test pass (Phase 16C) | ❌ Blocked (needs M19) |
| M21 | Combined OCR + Analysis smoke test pass (Phase 16D) | ❌ Blocked (needs M20) |
| M22 | `realProvidersEnabled=true` on Render | ❌ Blocked (needs M21) |
| M23 | `productionReady=true` on Render | ❌ Blocked (needs M22 + checklist) |
| M24 | macOS + Xcode access confirmed | ❌ Blocked (no Mac available) |
| M25 | `flutter build ios --release` succeeds | ❌ Blocked (needs M24) |
| M26 | App icon generated and applied | ❌ Blocked (needs M24 for apply; generation is free) |
| M27 | Launch screen customized | ❌ Blocked (needs M24) |
| M28 | Bundle ID finalized and applied | ❌ Blocked (needs M24 for apply) |
| M29 | Flutter point-to-Render verified | ❌ Blocked (needs M25) |

### 7.4 TestFlight Upload

| # | Milestone | Status |
|---|---|---|
| M30 | Apple Developer Program membership active | ❌ Blocked (needs M25) |
| M31 | App Store Connect record created | ❌ Blocked (needs M30) |
| M32 | Signing and provisioning configured | ❌ Blocked (needs M30) |
| M33 | Build archived and uploaded to App Store Connect | ❌ Blocked (needs M31 + M32) |
| M34 | Internal testers added (2-5 testers) | ❌ Blocked (needs M31) |
| M35 | Privacy labels completed in App Store Connect | ❌ Blocked (needs M31) |
| M36 | Export compliance questionnaire completed | ❌ Blocked (needs M31) |
| M37 | Beta review notes submitted | ❌ Blocked (needs M33) |

### 7.5 App Store Submission

| # | Milestone | Status |
|---|---|---|
| M38 | All TestFlight milestones completed | ❌ Blocked |
| M39 | Final app icon (production quality) | ❌ Blocked |
| M40 | App Store screenshots (iOS-native, all required sizes) | ❌ Blocked |
| M41 | Full App Store description + keywords finalized | ❌ Blocked |
| M42 | App Store review submitted | ❌ Blocked |

---

## 8. Decision Matrix

### 8.1 What to Do Now (Free, No Risk)

| Decision | Recommendation | Rationale |
|---|---|---|
| Continue free documentation/prep? | **Yes — continue** | Phase 21D-21K documentation has significantly improved project organization with zero cost. Keep going where there's value. |
| Generate icon candidates using prompt pack? | **Yes — next logical step** | Free, uses existing `APP_ICON_PROMPT_PACK.md`, produces usable assets for when Xcode becomes available. |
| Write tester instructions draft? | **Yes — can do now** | Free, saves time later. Can be refined when real providers are enabled. |
| Verify Apple ID readiness? | **Yes — 10 minutes** | Free, unblocks enrollment. Ensure 2FA is on and legal name matches government ID. |
| Audit Flutter for placeholder text / debug labels? | **Yes — optional but good** | Free, improves TestFlight readiness when the time comes. |

### 8.2 What to Pause

| Decision | Recommendation | Rationale |
|---|---|---|
| Pause until Mac access? | **Yes — pause iOS config changes** | No macOS means no build verification. Applying identity to Xcode configs without being able to build is wasted effort. |
| Pause until macOS available? | **Yes — pause all Xcode/Xcode-dependent work** | Bundle ID, display name, icon, launch screen — all need Xcode verification before they have value. |
| Pause until provider API key available? | **Yes — pause real-provider work** | Phases 16B-16D require a real Qwen API key. No key = no real smoke tests. |

### 8.3 What to Decide

| Decision | Options | Recommended |
|---|---|---|
| Start real OCR smoke test? | Wait for key vs. get key now | **Get key when Mac path is clear** — real OCR testing is important but the benefit is limited without an iOS build to verify end-to-end mobile flow. However, backend-only smoke tests can be done without Mac. |
| Generate icon candidates? | Skip vs. generate now | **Generate now** — free, produces reusable assets, uses prompt pack from Phase 21J. |
| Buy Apple Developer membership? | Buy now vs. later | **Later** — Gate 1 (Section 6, Phase 21B) conditions are not fully met. Do not buy until Mac/Xcode access is confirmed and provider API key path is clear. |

---

## 9. Recommended Next 3 Phases

### Phase 1: Free Prep (Can Do Now)

| Phase | Description | Duration | Output |
|---|---|---|---|
| **21L** (or similar) | Icon candidate generation using `APP_ICON_PROMPT_PACK.md` prompts | 30-60 min | 24-48 generated icon candidates, shortlisted to 3-5 using acceptance checklist |
| **21M** (or similar) | Tester instructions & beta review notes draft | 30 min | Draft documents ready for when TestFlight is set up |
| **21N** (or similar) | Flutter placeholder/debug label audit | 30 min | Report of any remaining placeholder text, debug labels, or Lorem Ipsum visible to users |

### Phase 2: Real Provider Preflight (Only If API Key Available)

| Phase | Description | Duration | Output |
|---|---|---|---|
| **16B** | Qwen OCR real smoke test | 30 min | Backend-only: verify OCR with real Qwen API on a test menu image |
| **16C** | Qwen Analysis real smoke test | 30 min | Backend-only: verify analysis with real Qwen API on OCR output |
| **16D** | Combined OCR + Analysis smoke test | 30 min | Backend-only: end-to-end pipeline verified with real providers |

### Phase 3: iOS Build (Requires macOS + Xcode)

| Phase | Description | Duration | Output |
|---|---|---|---|
| **21O** (or similar) | First iOS build attempt | 1-3 hours | Build report — success or blocker list |
| **21P** (or similar) | Apply identity + visual config | 1 hour | Bundle ID, display name, icon, launch screen all applied |
| **21Q** (or similar) | Pre-TestFlight checklist verification | 30 min | All remaining items ticked off before upload |

---

## 10. Final Recommendation

### Overall Verdict

**AI Food Passport is strong as a portfolio MVP. Do not market it as production-ready or App Store-ready.**

The project has 11 completed preparatory phases (21A-21K) of documentation, planning, and spec work. This is excellent groundwork — when the real-provider and macOS gates open, there is very little decision-making left. The implementation path is clearly defined.

### The Three Gates

```
  ┌─────────────────────┐
  │  Portfolio-Ready    │  ← We are here (✅ complete)
  │  (docs, demo, spec) │
  └─────────┬───────────┘
            │
            ▼
  ┌─────────────────────┐
  │  TestFlight-Ready   │  ← Gate 1: Real API key (backend only)
  │  (real providers,   │     Gate 2: macOS + Xcode access
  │   iOS build, icon)  │     Gate 3: Apple Developer membership
  └─────────┬───────────┘
            │
            ▼
  ┌─────────────────────┐
  │  App Store-Ready    │  ← After TestFlight validated (1+ months)
  │  (final assets,     │
  │   full description) │
  └─────────────────────┘
```

### Immediate Priorities

| # | Priority | Action | Cost | Blocked? |
|---|---|---|---|---|
| 1 | Free prep | Generate icon candidates using prompt pack | Free | No |
| 2 | Free prep | Write tester instructions draft | Free | No |
| 3 | Decision | Secure Mac/Xcode access path (own Mac, borrow, or cloud rental) | $0-30/month (cloud) | Yes — external factor |
| 4 | Decision | Obtain Qwen API key (free tier or pay-as-you-go) | ~$0-20/month | Yes — external factor |
| 5 | Purchase | Buy Apple Developer Program ($99/year) | $99/year | Yes — gated on #3 and #4 |

### Key Principle

**The next paid step should only happen after Mac/Xcode access is confirmed.** Without it, money spent on Apple Developer membership or API keys provides limited value — the app cannot be built, tested, or distributed on iOS.

---

## Related Documents

| Document | Relevance |
|---|---|
| [TESTFLIGHT_PREPARATION_PLAN.md](TESTFLIGHT_PREPARATION_PLAN.md) | Original 54-item TestFlight preparation plan (Phase 21B) |
| [APP_ICON_LAUNCH_SCREEN_SPEC.md](APP_ICON_LAUNCH_SCREEN_SPEC.md) | Visual identity design spec (Phase 21I) |
| [APP_ICON_PROMPT_PACK.md](APP_ICON_PROMPT_PACK.md) | AI image generation prompts for icon candidates (Phase 21J) |
| [APP_STORE_METADATA_DRAFT.md](APP_STORE_METADATA_DRAFT.md) | App Store metadata draft (Phase 21E) |
| [APP_IDENTITY_DECISION.md](APP_IDENTITY_DECISION.md) | App name, Bundle ID, category, subtitle decisions (Phase 21D) |
| [PRIVACY_POLICY_DRAFT.md](PRIVACY_POLICY_DRAFT.md) | Privacy policy draft (Phase 21E) |
| [PRIVACY_POLICY_HOSTING_PLAN.md](PRIVACY_POLICY_HOSTING_PLAN.md) | GitHub Pages hosting plan (Phase 21F) |
| [REAL_PROVIDER_PREFLIGHT_PLAN.md](REAL_PROVIDER_PREFLIGHT_PLAN.md) | Real provider safety gate enablement plan (Phase 16A) |
| [ROADMAP.md](ROADMAP.md) | Full phase history and future plans |

---

*This document is a gap-closure plan for future TestFlight readiness. No code, config, binary assets, API keys, Firebase, real providers, or iOS settings have been changed. `productionReady` remains `false`. This plan should be referenced when making purchasing and build decisions for the TestFlight and App Store path.*
