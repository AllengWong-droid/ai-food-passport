# Phase 21A Report — App Store Readiness Audit

**Phase**: 21A
**Date**: 2026-06-14
**Type**: Documentation only
**Tag**: (not yet tagged)

---

## Summary

Created `APP_STORE_READINESS_AUDIT.md` — a comprehensive audit of the AI Food Passport project for TestFlight and App Store readiness. Clear finding: the MVP Alpha is **portfolio-ready, not App Store-ready**. Do not submit to App Store. Prepare TestFlight first after real providers are enabled.

---

## Files Changed

| File | Action | Type |
|---|---|---|
| `APP_STORE_READINESS_AUDIT.md` | Created | New documentation (12 sections) |
| `PHASE_21A_REPORT.md` | Created | Final report |

---

## APP_STORE_READINESS_AUDIT.md Contents

| # | Section | Key Finding |
|---|---|---|
| 1 | Current Status Summary | portfolio-ready, mock-only, productionReady: false |
| 2 | Can It Be Submitted? | **No** — 5 immediate blockers listed |
| 3 | Why Not Submit Mock-Only | 6 concerns: Guideline 2.1, minimum functionality, rejection risk, user trust, privacy labels, portfolio-first strategy |
| 4 | TestFlight Readiness Checklist | 15 items — all ❌ or ⚠️ (0 complete) |
| 5 | App Store Readiness Checklist | 10 items beyond TestFlight — all ❌ |
| 6 | Required Apple-Side Assets | 10 sub-sections: Developer Program, account, Bundle ID, App Store Connect, icon, launch screen, screenshots, privacy policy, privacy details, review notes |
| 7 | Engineering Changes Before TestFlight | 10 items (E1-E10) with priorities |
| 8 | Engineering Changes Before App Store | 10 items (A1-A10) beyond TestFlight |
| 9 | Backend/Provider Readiness | Current state + TestFlight reqs + App Store reqs |
| 10 | Security Requirements | 5 sub-sections: no keys in Flutter, server-side keys only, safety gates preserved, productionReady conservative, additional considerations |
| 11 | Recommended Phased Roadmap | 8 phases: 21A → 21B → 16B → 16C → 16D → 21C → 21D → 22A |
| 12 | Clear Recommendation | DO NOT submit; prepare TestFlight first; don't buy membership yet; estimated timeline |

---

## Key Findings

### Bundle ID Audit
- **Current**: `$(PRODUCT_BUNDLE_IDENTIFIER)` — Xcode variable, not a real Bundle ID
- **Located in**: `ios/Runner/Info.plist` → `CFBundleIdentifier`
- **Action**: Must be set to a unique reverse-domain string before any Apple submission

### iOS Project Audit
- **Exists**: Yes — full Flutter iOS scaffold with default Runner, storyboard, AppIcon
- **App Icon**: Default Flutter placeholder (13 sizes from 20x20 to 1024x1024)
- **Launch Screen**: Default storyboard — functional but unstyled
- **Build verification**: `flutter build ios --release` has NOT been tested (requires macOS + Xcode)
- **Current version**: 0.1.0+1 (`pubspec.yaml`)

### Security Audit (iOS-specific)
- **API keys in Flutter**: 0 — compliant
- **ATS (App Transport Security)**: Default Flutter config — no exceptions needed currently
- **Data encryption at rest**: Not implemented (relevant for saved scan images)

---

## Verification

| Check | Result |
|---|---|
| Flutter tests | See below |
| git diff --check | See below |
| git status | See below |
| Flutter code changed? | **No** |
| Backend code changed? | **No** |
| Render config changed? | **No** |
| Screenshots changed? | **No** |
| Real providers enabled? | **No** |
| API keys/secrets/Firebase added? | **No** |
| `productionReady` changed? | **No** (remains `false`) |
| Documentation changed? | **Yes** — 1 new audit doc + 1 new report |

---

## Recommendation

**Clear finding**: The MVP Alpha is not ready for App Store submission.

**Next logical phase**: Phase 21B (TestFlight Preparation Plan) or Phase 16B (Qwen OCR real smoke test), whichever is available first. Phase 16B requires a real API key; Phase 21B can proceed without one.
