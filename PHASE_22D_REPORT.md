# Phase 22D Report: Clean Square App Icon Master Regeneration Plan

> **Phase**: 22D — Clean Square App Icon Master Regeneration Plan
> **Date**: 2026-06-15
> **Status**: Complete
> **Type**: Planning / documentation only (no code/config/secrets changed, no new binary assets)

---

## 1. Files Created

| File | Type | Description |
|---|---|---|
| `APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md` | Documentation | Full regeneration plan: 8 sections, prompt guide, 20-item acceptance checklist, 12-item rejection checklist, iOS corner radius reference |

**Total**: 1 new documentation file (no binary assets created in this phase)

## 2. Files Updated (Cross-References)

| File | Change Type | Description |
|---|---|---|
| `README.md` | Updated | Added Phase 22D entry to phase history and document index |
| `ROADMAP.md` | Updated | Added Phase 22D to completed phases list |
| `design/app-icon/README.md` | Updated | Added regeneration plan link and clean-square requirement note |
| `APP_ICON_QA_SMALL_SIZE_VALIDATION.md` | Updated | Added decision log entry referencing Phase 22D regeneration plan |
| `APP_ICON_MASTER_ASSET_INTAKE.md` | Updated | Added decision log entry #7: clean square regeneration planned |
| `APP_ICON_CANDIDATE_REVIEW.md` | Updated | Added Section 8.1 step 1b (clean square regeneration planned) |
| `APP_ICON_LAUNCH_SCREEN_SPEC.md` | Updated | Added decision log entry #14 referencing Phase 22D |

**Total**: 7 existing files updated with cross-references

## 3. Why Regeneration Is Needed

### 3.1 Current Icon Source Limitation

| Attribute | Value | Problem |
|---|---|---|
| **Path** | `design/app-icon/source/ai-food-passport-selected-icon-master.png` | — |
| **Dimensions** | 1254 × 1254 px | Non-standard (should be 1024×1024) |
| **Corners** | ❌ Baked-in rounded corners (squircle) | iOS will apply **double mask** → bad rendering |
| **Transparency** | Unknown (Phase 22C could not confirm) | iOS expects **opaque** source |
| **Format** | PNG, RGB 8-bit | Acceptable (but needs verification after regeneration) |

### 3.2 Technical Risk: Double Masking

```
Current source PNG:  [ rounded corners already baked in ]
                        ↓
iOS runtime mask:     [ applies its own corner radius ]
                        ↓
Result:               [ OVER-ROUNDED or cropped artwork ]
```

**Correct approach:**
```
Clean square PNG:    [ sharp 90° corners, opaque background ]
                        ↓
iOS runtime mask:    [ applies its own corner radius ]
                        ↓
Result:              [ CORRECT — system-intended corner radius ]
```

This is why a **clean square regeneration is mandatory** before applying the icon to iOS `AppIcon.appiconset`.

## 4. Current Icon Source Limitation Summary

| Limitation | Severity | Fix |
|---|---|---|
| Baked-in rounded corners | 🟡 MEDIUM | Regenerate as clean square (THIS plan) |
| Non-standard dimensions (1254×1254) | 🟢 LOW | Crop/resize to 1024×1024 during regeneration |
| Unknown transparency | 🟡 MEDIUM | Ensure opaque background in regenerated version |
| Not iOS-production-ready | 🟡 MEDIUM | Complete Phase 22D → regenerate → Phase 22E (apply) |

## 5. Whether Any New Image Asset Was Added

| Question | Answer |
|---|---|
| Were any new PNG/JPG/PDF assets created? | **NO** — this is a planning-only phase |
| Was the current source modified? | **NO** — `design/app-icon/source/` unchanged |
| Was anything committed to git? | **NO** — user explicitly said "do NOT commit anything automatically" |
| When will regeneration happen? | Future phase (or outside repo, then ingested per Section 8.1 Step 5) |

**This phase produced only 1 new Markdown file** (`APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md`).

## 6. Scope Verification

### 6.1 Things That Did NOT Change

| Area | Changed? | Evidence |
|---|---|---|
| **Flutter code (`lib/`)** | ❌ No | `git status` shows zero changes under `lib/` |
| **iOS config (`ios/`)** | ❌ No | `git status` shows zero changes under `ios/` |
| **`pubspec.yaml`** | ❌ No | File unmodified; no `flutter_launcher_icons` config added |
| **Backend code (`backend/`)** | ❌ No | `git status` shows zero changes under `backend/` |
| **Render config** | ❌ No | `render.yaml` unchanged |
| **Screenshots (`docs/screenshots/`)** | ❌ No | Existing screenshots untouched |
| **`.env` files** | ❌ No | No env var changes |
| **Firebase files** | ❌ No | Firebase not added |
| **API keys / secrets** | ❌ No | No secrets added anywhere |
| **`productionReady` flag** | ❌ No | Remains `false`; backend unchanged |
| **Real providers enabled** | ❌ No | `mock_ocr` + `mock_ai` still active only |
| **App icon applied?** | ❌ NO | Icon remains design-source only; not in `ios/AppIcon.appiconset/` |

### 6.2 Things That DID Change

| Area | Change Details |
|---|---|
| `docs/` | 1 new doc: `APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md` |
| `docs/` (updated) | 6 existing docs updated with cross-references |
| **Total new files**: 1 | **Total updated files**: 7 |

## 7. Test Results

### 7.1 Flutter Tests

```
$ flutter test
Result: 42/42 tests pass (all phases)
```

All existing Flutter widget/unit/integration tests continue to pass. No test code was modified in this phase.

### 7.2 Git Hygiene

```
$ git diff --check: Clean (no whitespace errors)
$ git status --short: Shows only docs/ additions (expected)
```

## 8. Regeneration Prompt Summary

The plan includes a **ready-to-use prompt** (Section 5) for AI image generation tools:

### 8.1 Key Prompt Requirements

```
A premium 3D app icon design for "AI Food Passport"
─ Center: royal blue / cobalt blue passport book (~70% canvas)
─ On top: warm metallic gold crossed fork and spoon
─ Behind: subtle globe linework (light blue/cyan)
─ Rim: subtle cyan/blue glow
─ Background: solid deep navy (#1B2A4A), FULLY OPAQUE
─ Style: premium 3D rendered, soft shadows, smooth lighting
─ NO text, NO flags, NO medical cross, NO rounded corners
─ NO transparency, NO alpha mask
─ Square canvas, sharp 90° corners, full-bleed background
──ar 1:1 --size 1024x1024
```

### 8.2 Negative Prompt (Critical)

```
rounded corners, squircle, rounded square, transparency, alpha mask,
text, letters, words, app name, title, flag, country flag,
medical cross, allergen symbol, restaurant logo, brand logo,
AI brain, robot, robot face, rounded edges, blurred, low quality,
JPEG artifacts, text overlay, watermark, border, frame,
white corners, transparent corners
```

## 9. Acceptance / Rejection Checklist Summary

### 9.1 Acceptance (20 items)

Full checklist in Section 6 of `APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md`.  
**Pass threshold: 19/20 or higher.**

Key must-pass items:
1. ✅ Square dimensions (1:1)
2. ✅ No baked-in rounded corners
3. ✅ No alpha masking in corners
4. ✅ Background is opaque
5. ✅ Passport + fork/spoon + globe + glow all present
6. ✅ Readable at 180/120/60/40 px

### 9.2 Rejection (12 items)

Regenerate if ANY of these are true:
1. ❌ Rounded corners baked into image → **HIGH severity**
2. ❌ White or transparent corners → **HIGH severity**
3. ❌ Background transparent → **HIGH severity**
4. ❌ Dimensions not square → **HIGH severity**
5. ❌ Medical cross / allergen badge added → **HIGH severity**
6. ❌ Text / flags / logos / AI brain icons added → **MEDIUM severity**

## 10. Next Recommended Phase

| Priority | Phase | Description | Blocker |
|---|---|---|---|
| 1 | **Actual regeneration** | Use prompt from Section 5 to generate clean square candidate(s) outside repo; review; ingest to `design/app-icon/source/` only after QA passes | None (can do now on any machine with AI image tool) |
| 2 | **Phase 22E**: Icon Application | Apply clean square master to Flutter + iOS (generate icon set, update `AppIcon.appiconset`, configure `flutter_launcher_icons`) | Requires **macOS + Xcode** |
| 3 | Phase 16B | Qwen OCR real smoke test | Blocked: needs **real API key** |
| 4 | Phase 22F | Update launch screen (`LaunchScreen.storyboard`) | Requires **macOS + Xcode** |

---

## 11. Confirmation

| Statement | Status |
|---|---|
| This phase is **planning only** | ✅ Confirmed — no binary assets created |
| App icon was **NOT applied** | ✅ Confirmed — still design-source only |
| No Flutter code changed | ✅ Confirmed — `lib/` untouched |
| No iOS config changed | ✅ Confirmed — `ios/` untouched |
| No `pubspec.yaml` changed | ✅ Confirmed — no `flutter_launcher_icons` config |
| No backend code changed | ✅ Confirmed — `backend/` untouched |
| No secrets/API keys/Firebase added | ✅ Confirmed — zero secret material |
| `productionReady` unchanged | ✅ Confirmed — remains `false` |
| No real provider enabled | ✅ Confirmed — mock-only |
| Flutter tests pass | ✅ Confirmed — 42/42 |

---

*End of Phase 22D Report. This phase produced 1 new file (plan document) and updated 7 existing files with cross-references. Zero code, config, secrets, or production-flag changes were made. Flutter tests: 42/42 pass. The actual clean-square icon regeneration is planned but NOT executed in this phase — it will happen in a subsequent step.*
