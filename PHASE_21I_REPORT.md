# Phase 21I Report: App Icon & Launch Screen Design Spec

> **Phase**: 21I
> **Date**: 2026-06-14
> **Type**: Design specification — no code, config, or binary asset changes
> **Status**: Complete

---

## 1. Summary

Created the **App Icon & Launch Screen Design Spec** (`APP_ICON_LAUNCH_SCREEN_SPEC.md`) — a comprehensive visual identity specification for AI Food Passport. This is a forward-looking design document that will guide future asset production when a macOS build machine and Apple Developer Program membership become available.

**No code, config, or binary assets were changed.**

---

## 2. Files Created

| File | Description | Sections |
|---|---|---|
| `APP_ICON_LAUNCH_SCREEN_SPEC.md` | Full design specification | 13 main sections + 2 appendices |
| `PHASE_21I_REPORT.md` | This report | — |

## 3. Files Changed

| File | Change | Reason |
|---|---|---|
| `README.md` | Added link to `APP_ICON_LAUNCH_SCREEN_SPEC.md` in Related Docs table | Navigation convenience |
| `ROADMAP.md` | Added Phase 21I as completed | Roadmap tracking |
| `APP_STORE_METADATA_DRAFT.md` | Updated Section 13 (Required Assets Still Missing) — icon and launch screen rows now reference this spec | Asset tracking alignment |

---

## 4. Design Decisions Made

| # | Decision | Detail |
|---|---|---|
| 1 | **Icon concept: passport booklet + fork/spoon crossing** | One primary concept, one alternative (passport + menu card with scan frame). Fork/chopsticks variant noted for cultural flexibility. |
| 2 | **Color palette: deep navy (#1B2A4A) + warm gold (#D4A843) + off-white (#FFF8F0)** | Three-hex palette with specific contrast ratio documentation. All three meet WCAG AA or AAA. |
| 3 | **No rounded corners baked into icon source** | iOS applies corner radii automatically. Pre-rounding causes double-rounding. |
| 4 | **No loading spinners on launch screen** | Per Apple HIG. Launch screen is static — mirrors the app's first frame. |
| 5 | **10 copy-safe screenshot caption ideas** | All safe for MVP Alpha mock-only status. No production-readiness claims, no allergen guarantees. |
| 6 | **Hard constraints documented for exclusions** | National flags, medical crosses, restaurant logos, certification badges, AI/robot icons, camera icons, globe icons, tiny text, complex gradients — all explicitly excluded. |
| 7 | **Light/dark mode legibility strategy** | Dark (navy) dominant fill with gold accent. Optional 1-2px gold stroke for dark-mode separation. |
| 8 | **Future implementation steps in priority order** | Icon generation flow (7 steps), launch screen flow (7 steps), screenshot production flow (5 steps). |
| 9 | **Size legibility documented for all iOS icon sizes** | 1024pt → 29pt, with a silhouette test pass/fail criteria. |
| 10 | **Forbidden claims documented in three tiers** | Absolute (never), mock-only (until real providers), always-required disclaimers. |

---

## 5. Verification Results

### 5.1 Flutter Code

| Question | Answer |
|---|---|
| Was Flutter code changed? | **No** |
| Was iOS config changed? | **No** |
| Was backend code changed? | **No** |
| Was Render config changed? | **No** |
| Were existing screenshots changed? | **No** |
| Were binary image assets added? | **No** |
| Were any secrets/API keys/Firebase added? | **No** |
| Was `productionReady` changed? | **No** (remains `false`) |
| Were any real providers enabled? | **No** (all remain behind safety gates) |

### 5.2 Automated Checks

| Check | Result |
|---|---|
| `git status --short` | Pass — only expected files (APP_ICON_LAUNCH_SCREEN_SPEC.md, PHASE_21I_REPORT.md, README.md, ROADMAP.md, APP_STORE_METADATA_DRAFT.md) |
| `git diff --name-status` | Pass — documentation-only changes |
| `git diff --check` | Pass — no whitespace errors |
| `flutter test` | Pass — 42/42 |
| Safety scan (Select-String) | Pass — zero risky matches |

---

## 6. Spec Content Coverage

### APP_ICON_LAUNCH_SCREEN_SPEC.md Sections

| # | Section | Status |
|---|---|---|
| 1 | Purpose | ✅ Complete |
| 2 | App Identity Summary | ✅ Complete |
| 3 | Brand Positioning | ✅ Complete |
| 4 | Icon Concept (with exclusion constraints) | ✅ Complete |
| 5 | Color Direction | ✅ Complete |
| 6 | Shape and Composition | ✅ Complete |
| 7 | App Icon Asset Checklist | ✅ Complete |
| 8 | Launch Screen Concept | ✅ Complete |
| 9 | App Store Screenshot Visual Guidance | ✅ Complete |
| 10 | Copy-Safe Screenshot Caption Ideas | ✅ Complete |
| 11 | What NOT to Claim Visually | ✅ Complete |
| 12 | Future Implementation Steps | ✅ Complete |
| 13 | Decision Log | ✅ Complete |
| — | Appendix A: Icon Silhouette Test | ✅ Complete |
| — | Appendix B: Reference Dimensions | ✅ Complete |

---

## 7. Boundary Compliance

| Constraint | Met? |
|---|---|
| No Flutter code changed | ✅ |
| No iOS config changed | ✅ |
| No app icons replaced | ✅ |
| No launch screen files modified | ✅ |
| No binary image assets generated | ✅ |
| No backend code changed | ✅ |
| No Render config changed | ✅ |
| No API keys added | ✅ |
| No Firebase added | ✅ |
| No real providers enabled | ✅ |
| No `productionReady` changed | ✅ |
| No existing screenshots modified | ✅ |
| No Apple certificates created | ✅ |
| No provisioning profiles created | ✅ |
| No automatic commits | ✅ |

---

## 8. Next Recommended Phase

| Priority | Phase | Rationale |
|---|---|---|
| **1** | **Phase 16B: Qwen OCR Real Smoke Test** | The most impactful technical next step. Requires a real test API key (backend-only). Unblocks all real-provider work. |
| **2** | **Phase 21J: iOS Config Patch Plan** (or similar "apply identity" phase) | Apply the identity decisions from Phase 21D and visual spec from Phase 21I to actual iOS config files. Requires macOS + Apple Developer membership. |
| **3** | **Icon generation** (future visual design phase) | Generate actual SVG/PNG icon from this spec. Requires a designer or icon generation tool. No Mac/Xcode needed for vector creation. |

**What CAN be done now (no macOS, no Apple membership):**
- Generate an SVG icon concept matching this spec (using vector design tools or AI image generation)
- Review and refine the specification
- Prepare Figma/Sketch source files

---

*End of Phase 21I Report*
