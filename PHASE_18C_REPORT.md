# Phase 18C Report — MVP Alpha Portfolio Demo Showcase

> **Date**: 2026-06-14
> **Status**: Complete
> **Phase**: 18C

---

## Summary

Created a polished portfolio/demo showcase section so that anyone viewing the repo can quickly understand the AI Food Passport MVP Alpha demo — what it is, what it demonstrates, how to run it, and what the expected results look like.

## Files Changed

| File | Change | Description |
|---|---|---|
| `MVP_ALPHA_DEMO_SHOWCASE.md` | **Created** | Portfolio showcase document with 7 screenshots, system status, demo instructions, and limitations |
| `README.md` | **Updated** | Added showcase link to MVP Alpha Demo section; added showcase + 18B0 to Demo & QA list; added Phases 17B, 18A, 18B, 18B0, 18C to completed list |
| `MVP_ALPHA_STATUS.md` | **Updated** | Added showcase document callout at top; added showcase + 18B0 to Related Docs; updated last-updated date and phase |
| `ROADMAP.md` | **Updated** | Added Phases 18B0, 18B, 18C to completed list |

## Code Changes

| Category | Changed? |
|---|---|
| Flutter code | **No** |
| Backend code | **No** |
| Render config | **No** |
| Docs | **Yes** — 3 existing files updated, 1 new file created |
| Screenshots | **No** — existing 7 files unchanged |

## Safety Verification

| Check | Result |
|---|---|
| API keys added? | **No** |
| Secrets committed? | **No** |
| Firebase added? | **No** |
| Real providers enabled? | **No** |
| `productionReady` changed? | **No** — remains `false` |
| Provider env flags changed? | **No** |
| Backend code changed? | **No** |

## Showcase Document Content

`MVP_ALPHA_DEMO_SHOWCASE.md` includes:

1. **What Is AI Food Passport** — concise product description
2. **Demo Screenshot Tour** — all 7 screenshots with descriptions and relative markdown image links
3. **How to Run the Demo** — exact `flutter run` command with notes on full restart
4. **System Configuration** — backend status table, expected demo dishes table
5. **Safety & Architecture** — API keys are backend-only, mock-only mode, production readiness
6. **Known Limitations** — 8-item table covering mock-only, Render sleep, no real providers, etc.
7. **Related Documents** — 8 linked documents
8. **Test Suite** — current test status summary

### Screenshot Links

All 7 screenshots are linked with relative paths from project root:

| # | File | Relative Path |
|---|---|---|
| 00 | Onboarding | `docs/screenshots/mvp-alpha/00-onboarding.png` |
| 01 | Home | `docs/screenshots/mvp-alpha/01-home.png` |
| 02 | Profile | `docs/screenshots/mvp-alpha/02-profile.png` |
| 03 | Scan | `docs/screenshots/mvp-alpha/03-scan.png` |
| 04 | Results | `docs/screenshots/mvp-alpha/04-results.png` |
| 05 | Tonkotsu Ramen Detail | `docs/screenshots/mvp-alpha/05-detail-tonkotsu-ramen.png` |
| 06 | Miso Katsu Skewers Detail | `docs/screenshots/mvp-alpha/06-detail-miso-katsu-skewers.png` |

## README Updates

- **MVP Alpha Demo section**: Added showcase callout block above the frozen baseline link
- **Demo & QA list**: Added `MVP_ALPHA_DEMO_SHOWCASE.md` and `PHASE_18B0_REPORT.md`
- **Completed Phases**: Added 17B, 18A, 18B, 18B0, 18C

## MVP_ALPHA_STATUS.md Updates

- Updated "Last updated" to Phase 18C
- Added portfolio showcase callout after the status header
- Added showcase and 18B0 report to Related Docs table

## ROADMAP.md Updates

- Added Phase 18B0, 18B, 18C to completed list with descriptions

## Verification Commands

```bash
git status --short
git diff --name-status
git diff --check
flutter test
```
