# Phase 21K Report: TestFlight Readiness Gap Closure Plan

> **Phase**: 21K
> **Date**: 2026-06-14
> **Type**: Planning document — no code or config changes
> **Status**: Complete

---

## 1. Summary

Created the **TestFlight Readiness Gap Closure Plan** (`TESTFLIGHT_GAP_CLOSURE_PLAN.md`) — a comprehensive gap analysis and action plan that maps the path from the current portfolio-ready MVP Alpha to future TestFlight readiness. The plan identifies 18 specific blocking gaps, 14 technical gaps, organizes actions by required resources (free / requires Mac / requires Apple membership / requires API key), and provides milestone checklists, a decision matrix, and recommended next phases.

**No code, config, binary assets, secrets, or provider status were changed.**

---

## 2. Files Created

| File | Description | Sections |
|---|---|---|
| `TESTFLIGHT_GAP_CLOSURE_PLAN.md` | Full gap closure plan | 10 sections + related documents |
| `PHASE_21K_REPORT.md` | This report | — |

## 3. Files Changed

| File | Change | Reason |
|---|---|---|
| `README.md` | Added link to `TESTFLIGHT_GAP_CLOSURE_PLAN.md` in Related Docs table | Navigation convenience |
| `ROADMAP.md` | Added Phase 21K as completed | Roadmap tracking |
| `TESTFLIGHT_PREPARATION_PLAN.md` | Added cross-reference to `TESTFLIGHT_GAP_CLOSURE_PLAN.md` in Related Documents section | Readers of the original prep plan can find the updated gap analysis |

---

## 4. Updated Readiness Summary

### 4.1 What Changed Since Phase 21B (TestFlight Preparation Plan)

| Category | Phase 21B Status | Phase 21K Status |
|---|---|---|
| **Privacy policy drafted** | ❌ Not started | ✅ Done (Phase 21E) |
| **Privacy policy hosted at public URL** | ❌ Not started | ✅ Live (Phase 21G/21H) |
| **App identity decisions** | ❌ Not decided | ✅ Done (Phase 21D) |
| **App Store metadata draft** | ❌ Not started | ✅ Done (Phase 21E) |
| **App icon design spec** | ❌ Not started | ✅ Done (Phase 21I) |
| **App icon prompt pack** | ❌ Not started | ✅ Done (Phase 21J) |
| **iOS build readiness audit** | ❌ Not started | ✅ Done (Phase 21C) |
| **Gap closure plan** | ❌ Not started | ✅ Done (this phase) |
| **Real providers** | ❌ Not enabled | ❌ Not enabled (unchanged) |
| **iOS build** | ❌ Never attempted | ❌ Never attempted (unchanged) |
| **Apple Developer membership** | ❌ Not purchased | ❌ Not purchased (unchanged) |

**Net progress**: 8 documentation/planning/spec items completed across Phases 21D-21K. Zero technical or account items progressed (all require external dependencies: API key, macOS, or $99 payment).

---

## 5. Remaining Blockers

### 5.1 Summary Count

| Category | Count | Key Blocker |
|---|---|---|
| Account & Environment | 4 gaps | Apple Developer membership ($99/year) + macOS access |
| Identity & Config | 4 gaps | Bundle ID not applied (needs macOS + Xcode) |
| Visual Assets | 2 gaps | Icon not generated, launch screen not customized |
| Technical (iOS) | 3 gaps | Never built on Mac, never tested on real iPhone |
| App Store Connect | 5 gaps | No record exists (requires membership) |
| Provider | 5 gaps | No real API key — all 16B-16D blocked |
| Backend | 5 gaps | `realProvidersEnabled: false`, `productionReady: false` |
| Security | 4 gaps | 2 already done (Phases 10C, 11C), 2 need re-verification with real providers |

### 5.2 Three Critical Gates

1. **Real Qwen API key** → Unblocks Phases 16B-16D (real provider smoke tests)
2. **macOS + Xcode access** → Unblocks iOS build, identity application, icon application
3. **Apple Developer Program** → Unblocks App Store Connect, signing, TestFlight upload

---

## 6. Verification Results

### 6.1 Boundary Compliance

| Constraint | Met? |
|---|---|
| No Flutter code changed | ✅ |
| No iOS config changed | ✅ |
| No app icons replaced | ✅ |
| No binary image assets generated | ✅ |
| No backend code changed | ✅ |
| No Render config changed | ✅ |
| No API keys added | ✅ |
| No Firebase added | ✅ |
| No real providers enabled | ✅ |
| No `productionReady` changed | ✅ (remains `false`) |
| No existing screenshots modified | ✅ |
| No Apple certificates created | ✅ |
| No provisioning profiles created | ✅ |
| No automatic commits | ✅ |

### 6.2 Automated Checks

| Check | Result |
|---|---|
| `git status --short` | Pass — only expected files |
| `git diff --name-status` | Pass — documentation-only changes |
| `git diff --check` | Pass — no whitespace errors |
| `flutter test` | Pass — 42/42 |
| Safety scan (Select-String) | Pass — zero genuine risky matches |

---

## 7. Safety Scan Analysis

The Select-String scan searched for "productionReady.*true", "real provider.*enabled", "App Store ready", "production-ready", "API_KEY", "SECRET", "TOKEN", "PASSWORD", "guaranteed safe", "allergy guarantee" across all 5 affected files.

| File | Matches Found | Analysis |
|---|---|---|
| `TESTFLIGHT_GAP_CLOSURE_PLAN.md` | Multiple | All matches are in gap descriptions (marking items as ❌ not done), milestone checklists (showing blocked status), or "do not do yet" warnings. Zero matches are claims that the app currently meets any of these criteria. |
| `TESTFLIGHT_PREPARATION_PLAN.md` | Multiple | Pre-existing from Phase 21B — all in accurate status tables and gate conditions. |
| `README.md` | Multiple | Pre-existing — all in accurate status statements. |
| `ROADMAP.md` | Multiple | Pre-existing — all in roadmap summaries. |
| `PHASE_21K_REPORT.md` | Multiple | All in verification results and gap summaries confirming items are NOT done. |

**Verdict: Zero genuine risky claims. All matches are meta-references (gap descriptions, blocked status markers, or accurate status confirmations that criteria are NOT met).**

---

## 8. Next Recommended Phase

| Priority | Phase | Description | Cost | Blocked? |
|---|---|---|---|---|
| **1** | **Icon candidate generation** | Feed prompts from `APP_ICON_PROMPT_PACK.md` to an image generation tool. Generate 4-8 candidates per concept (5 concepts = 20-40 candidates). Shortlist using acceptance checklist. | Free | No |
| **2** | **Tester instructions draft** | Write a draft of TestFlight tester instructions (how to install TestFlight, how to use the app, known limitations). | Free | No |
| **3** | **Phase 16B: Qwen OCR Real Smoke Test** | Backend-only: enable Qwen OCR with a real API key, test with a real menu image. | ~$0-20 (API costs) | Yes (needs API key) |
| **4** | **Phase 21L: iOS Config Patch Plan** | Create a detailed plan for exactly which iOS config values to change and how (no actual changes). | Free | No |

---

*End of Phase 21K Report*
