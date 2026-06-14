# Phase 19B Report — Demo Walkthrough Script & Recording Checklist

**Phase**: 19B
**Date**: 2026-06-14
**Type**: Documentation only
**Tag**: (not yet tagged)

---

## Summary

Created `DEMO_WALKTHROUGH_SCRIPT.md` — a comprehensive demo recording script and pre-flight checklist for presenting AI Food Passport as a portfolio project. No runtime changes.

---

## Files Changed

| File | Action | Type |
|---|---|---|
| `DEMO_WALKTHROUGH_SCRIPT.md` | Created | New documentation (10 sections) |
| `README.md` | Edited | Added 2 links (PORTFOLIO_HANDOFF.md + DEMO_WALKTHROUGH_SCRIPT.md) to Demo & QA section |
| `ROADMAP.md` | Edited | Added Phase 19B to completed list |

---

## DEMO_WALKTHROUGH_SCRIPT.md Contents

| # | Section | Details |
|---|---|---|
| 1 | 30-Second Demo Script | Elevator pitch with timing cues for onboarding → scan → results → dish detail |
| 2 | 90-Second Demo Script | Portfolio overview: open, scan, results, dish detail, profile, architecture wrap |
| 3 | 3-Minute Demo Script | Full walkthrough with 10 timeboxed segments (15-25 seconds each) |
| 4 | Screen-by-Screen Narration | All 7 screenshots (00-onboarding through 06-dish-detail-alt) with What-to-Show/What-to-Say tables |
| 5 | What to Say Clearly | 4 mandatory safety disclosure lines with exact phrasing |
| 6 | What NOT to Say | 7 prohibited claims with correct alternatives |
| 7 | Recording Checklist | 6 sub-sections: Browser Setup, System Cleanliness, Flutter App Preparation, Recording Settings, During Recording, After Recording |
| 8 | Suggested Video Title & Description | 3 title options (descriptive, pitch-focused, technical) + portfolio-ready description |
| 9 | Quick Reference Card | One-page printable card with demo command, URLs, expected dishes, safety facts, prohibited claims |
| 10 | Related Documents | Links to HANDOFF, SHOWCASE, RUNBOOK, STATUS, ROADMAP |

---

## Verification

| Check | Result |
|---|---|
| Flutter code changed? | **No** |
| Backend code changed? | **No** |
| Screenshots changed? | **No** |
| Docs changed? | **Yes** — 1 new doc + 2 edits |
| `flutter test` | **42/42 pass** |
| `git diff --check` | **Clean** (LF/CRLF warnings only) |
| `git status` | 3 files: 2 modified + 1 new |
| Real providers enabled? | **No** |
| API keys/secrets/Firebase added? | **No** |
| `productionReady` changed? | **No** (remains `false`) |

---

## Safety

- All safety language is clearly stated in the script (Section 5).
- All prohibited claims are explicitly listed with alternatives (Section 6).
- Recording checklist ensures no API keys, credentials, or private info are captured (Section 7.2).
- The script reinforces that `productionReady` is `false` and real providers are disabled.
