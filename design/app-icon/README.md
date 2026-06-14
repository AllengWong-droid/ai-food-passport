# design/app-icon/ — AI Food Passport App Icon Design Assets

> **Design-source only.** Assets in this directory are raw design materials for the future app icon. They are NOT applied to the Flutter app, iOS configuration, or launch screen yet.

---

## Directory Structure

```
design/app-icon/
  README.md                                          (this file)
  source/
    ai-food-passport-selected-icon-master.png        (original selected icon — Candidate 1, recolored; ROUNDED CORNERS; archived as design reference)
    ai-food-passport-clean-square-master.png         (regenerated clean square icon; PREFERRED export source; Phase 22E)
  preview/
    # Rounded-corner source previews (Phase 22C):
    icon-preview-1024.png                            (1024x1024 — App Store master size)
    icon-preview-512.png                             (512x512 — iTunes/iPad Pro size)
    icon-preview-180.png                             (180x180 — iPhone @3x home screen)
    icon-preview-120.png                             (120x120 — Spotlight/@2x size)
    icon-preview-60.png                              (60x60 — Settings/@2x size)
    icon-preview-40.png                              (40x40 — smallest common iOS size)
    icon-small-size-contact-sheet.png                (1380x760 — all rounded sizes in grid)
    # Clean square master previews (Phase 22E):
    icon-clean-square-preview-1024.png               (1024x1024 — App Store master size)
    icon-clean-square-preview-512.png                (512x512 — iTunes/iPad Pro size)
    icon-clean-square-preview-180.png                (180x180 — iPhone @3x home screen)
    icon-clean-square-preview-120.png                (120x120 — Spotlight/@2x size)
    icon-clean-square-preview-60.png                 (60x60 — Settings/@2x size)
    icon-clean-square-preview-40.png                 (40x40 — smallest common iOS size)
    icon-clean-square-vs-rounded-comparison.png      (1644x652 — old vs new at all sizes)
    clean-square-master-contact-sheet.png            (620x520 — clean square master preview grid, Phase 22E)
  export/
    design-only/                                     (Phase 22F: design-only export set, NOT applied to app)
      icon-1024.png                                  (1024x1024 — App Store master size)
      icon-512.png                                   (512x512 — iTunes/iPad Pro size)
      icon-180.png                                   (180x180 — iPhone @3x home screen)
      icon-167.png                                   (167x167 — iPad @2x home screen)
      icon-152.png                                   (152x152 — iPad @2x settings/Spotlight)
      icon-120.png                                   (120x120 — iPhone @2x Spotlight)
      icon-87.png                                    (87x87 — iPhone @3x settings)
      icon-80.png                                    (80x80 — iPhone @2x settings)
      icon-76.png                                    (76x76 — iPad settings)
      icon-60.png                                    (60x60 — iPhone @2x home screen, legacy)
      icon-58.png                                    (58x58 — iPhone @2x settings, legacy)
      icon-40.png                                    (40x40 — Spotlight, legacy)
      icon-29.png                                    (29x29 — Settings, legacy)
      icon-20.png                                    (20x20 — Notification, legacy)
      icon-export-contact-sheet.png                  (900x1020 — all exported sizes in grid, Phase 22F)
```

---

## Selected Source Asset

| Field | Detail |
|---|---|
| **Preferred source (production)** | `design/app-icon/source/ai-food-passport-clean-square-master.png` |
| **Archive source (rounded)** | `design/app-icon/source/ai-food-passport-selected-icon-master.png` |
| **Candidate** | Candidate 1, recolored version |
| **Visual description** | Royal/cobalt blue passport book, warm metallic gold crossed fork/spoon, globe linework, subtle cyan/blue edge glow |
| **Dimensions** | 1254 x 1254 px |
| **Format** | PNG, RGB 8-bit, opaque (no alpha channel) |
| **Intake date (original)** | 2026-06-15 (Phase 22B) |
| **Intake date (clean square)** | 2026-06-15 (Phase 22E) |
| **Intake document (original)** | `APP_ICON_MASTER_ASSET_INTAKE.md` |
| **Intake document (clean square)** | `APP_ICON_CLEAN_SQUARE_MASTER_INTAKE.md` |
| **Candidate review** | `APP_ICON_CANDIDATE_REVIEW.md` (Phase 22A) |
| **Design spec** | `APP_ICON_LAUNCH_SCREEN_SPEC.md` (Phase 21I) |
| **Prompt pack** | `APP_ICON_PROMPT_PACK.md` (Phase 21J) |

---

## Status: Design-Source Only

| ❌ NOT applied yet | ✅ Applied |
|---|---|
| `ios/Runner/Assets.xcassets/AppIcon.appiconset/` | _(nothing yet)_ |
| `pubspec.yaml` | |
| `flutter_launcher_icons` config | |
| `LaunchScreen.storyboard` | |
| `lib/` (Flutter code) | |

The Flutter app still uses the default Flutter app icon. The icon in this directory is a design reference for future export and application.

---

## Rules

### DO

- ✅ Store design-source assets in `source/`
- ✅ Keep the master file at original resolution
- ✅ Reference this directory from intake and review documents
- ✅ Update `APP_ICON_MASTER_ASSET_INTAKE.md` when assets change

### DO NOT

- ❌ Do NOT edit generated app icons directly (they will be regenerated from the master)
- ❌ Do NOT add production claims ("App Store ready", "production-ready", "guaranteed safe") to this directory
- ❌ Do NOT move the master asset into `ios/` or Flutter's `assets/` directory
- ❌ Do NOT commit API keys, tokens, or secrets in this directory
- ❌ Do NOT add real App Store claims before validation

---

## Future Export Plan

1. **Crop/cleanup**: Produce a 1024x1024 px, opaque, sRGB PNG from the source master
2. **Vector cleanup** (optional): Trace into clean vector shapes; adjust spacing and glow
3. **Silhouette test**: Verify legibility at 29x29, 40x40, 60x60, 120x120, 180x180 px
4. **Acceptance sign-off**: Re-run the 16-item acceptance checklist
5. **Commit approved source**: Add final PNG to `docs/design-assets/`
6. **Generate iOS icon set**: Produce all required iOS icon sizes
7. **Apply to Flutter**: Configure `flutter_launcher_icons` and regenerate
8. **Apply launch screen**: Edit `LaunchScreen.storyboard` with branded design
9. **Validate**: Build and verify on iOS Simulator / device

Steps 6-9 require macOS with Xcode.

---

## Related Documents

| Document | Purpose |
|---|---|
| `APP_ICON_MASTER_ASSET_INTAKE.md` | Full intake record: metadata, safety review, scope boundaries, decision log |
| `APP_ICON_CANDIDATE_REVIEW.md` | Candidate selection rationale, acceptance/rejection checklists |
| `APP_ICON_LAUNCH_SCREEN_SPEC.md` | Full design specification (colors, shapes, forbidden imagery) |
| `APP_ICON_PROMPT_PACK.md` | AI image generation prompts used to create candidates |
| `APP_ICON_QA_SMALL_SIZE_VALIDATION.md` | Phase 22C QA report: per-size readability review, visual checks, risks, acceptance decision (19/20 score) |
| `APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md` | Phase 22D plan: why regeneration needed, 9-item criteria, AI prompt + negative prompt, 20-item acceptance + 12-item rejection checklist |
| `APP_ICON_CLEAN_SQUARE_MASTER_INTAKE.md` | Phase 22E intake & QA: 21/21 validation pass (square opaque, no baked-in corners), accepted as preferred export source |
| `APP_ICON_DESIGN_ONLY_EXPORT_SET.md` | Phase 22F export set: 14 iOS sizes from clean square master, design-only review assets, not applied to app |
| `PHASE_22F_REPORT.md` | Phase 22F report: export set generation, verification, scope confirmation |

---

## Warning

> **This is a design-source asset for a portfolio MVP Alpha.** The asset has not been validated as an iOS app icon (no Xcode build, no iOS Simulator verification, no App Store Connect upload). Do NOT make claims that this is a production-ready app icon. The repository, backend, and Flutter app remain mock-only with `productionReady: false`.
