# Phase 21B Report — TestFlight Preparation Plan

**Phase**: 21B
**Date**: 2026-06-14
**Type**: Documentation only
**Tag**: (not yet tagged)

---

## Summary

Created `TESTFLIGHT_PREPARATION_PLAN.md` — a step-by-step TestFlight readiness roadmap from MVP Alpha to first TestFlight build. Clear recommendation: continue planning, do not spend money yet, next practical step is Phase 16B (real provider smoke test) or Phase 21D (privacy policy draft).

---

## Files Changed

| File | Action | Type |
|---|---|---|
| `TESTFLIGHT_PREPARATION_PLAN.md` | Created | New documentation (10 sections, 17.6 KB) |
| `PHASE_21B_REPORT.md` | Created | Final report |

---

## TESTFLIGHT_PREPARATION_PLAN.md Contents

| # | Section | Details |
|---|---|---|
| 1 | Current Readiness Summary | 12-dimension table — all ❌ or ⚠️ |
| 2 | Why TestFlight Before App Store | 6 reasons (lower bar, iterative, risk mitigation, real device, gradual trust, Apple familiarity) |
| 3 | Prerequisites Before Spending Money | 5 sub-sections: real provider decision, backend readiness, privacy policy, app identity, iOS build strategy |
| 4 | TestFlight Preparation Checklist | 8 groups: Product (8), Backend (8), Provider (7), Flutter iOS (8), Apple Account (5), App Store Connect (6), Privacy (6), Test Plan (6) — 54 items total |
| 5 | Recommended Phased Roadmap | 9 phases: 21B → 16B → 16C → 16D → 21C → 21D → 21E → 21F → 22A with dependency graph |
| 6 | Clear Decision Gates | 3 gates: don't buy membership yet, don't submit mock-only, don't set productionReady |
| 7 | Risk Table | 10 risks with severity, likelihood, mitigation, current status |
| 8 | Minimum TestFlight Scope | Internal only, 2-5 testers, 1-2 weeks, 5 success criteria, 8 things NOT to include |
| 9 | Required Artifacts | 10 artifacts with triggers and phases (app name, bundle ID, icon, launch screen, screenshots, privacy policy, support URL, test instructions, review notes, build notes) |
| 10 | Final Recommendation | 7 things that can be done now (free), 5 decisions needed, 6 next phases in priority order |

---

## Key Findings

### Immediate Actions Possible (Free, No API Key, No Mac)

1. Decide app name and Bundle ID — 10 minutes
2. Draft privacy policy — 1-2 hours (Phase 21D)
3. Design app icon concept — free tools available
4. Write tester instructions draft — 1 hour
5. Research Qwen API pricing — 30 minutes
6. Verify Apple ID readiness — free
7. Review API docs for chosen provider — free

### Decisions Needed

| Decision | Recommended Choice |
|---|---|
| AI/OCR provider | Qwen (code exists, 226 gate tests) |
| iOS build approach | Local Mac for first build |
| App name | Keep "AI Food Passport" |
| Bundle ID | `com.{name}.aifoodpassport` |
| TestFlight scope | Internal only (2-5 testers) |

### Critical Path

```
Real API key → 16B (OCR smoke) → 16C (Analysis smoke) → 16D (Combined)
→ 21C (iOS build) + 21D (privacy) + 21E (smoke plan)
→ 21F (enrollment decision) → 22A (TestFlight upload)
```

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
| Documentation changed? | **Yes** — 1 new plan + 1 new report |

---

## Recommendation

**Continue planning. Do not spend money yet.**

The project has a clear TestFlight roadmap. The hard prerequisite is a real API key for Phases 16B-16D. Until then, Phase 21D (privacy policy draft) and app identity decisions can proceed without cost or risk.
