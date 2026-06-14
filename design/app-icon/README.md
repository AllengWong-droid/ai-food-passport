# design/app-icon/ — AI Food Passport App Icon Design Assets

> **Design-source only.** Assets in this directory are raw design materials for the future app icon. They are NOT applied to the Flutter app, iOS configuration, or launch screen yet.

---

## Directory Structure

```
design/app-icon/
  README.md                                          (this file)
  source/
    ai-food-passport-selected-icon-master.png        (selected icon — Candidate 1, recolored)
```

---

## Selected Source Asset

| Field | Detail |
|---|---|
| **Path** | `design/app-icon/source/ai-food-passport-selected-icon-master.png` |
| **Candidate** | Candidate 1, recolored version |
| **Visual description** | Royal/cobalt blue passport book, warm metallic gold crossed fork/spoon, globe linework, subtle cyan/blue edge glow |
| **Dimensions** | 1254 x 1254 px |
| **Format** | PNG, RGB 8-bit, non-interlaced |
| **Intake date** | 2026-06-15 |
| **Intake document** | `APP_ICON_MASTER_ASSET_INTAKE.md` |
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

---

## Warning

> **This is a design-source asset for a portfolio MVP Alpha.** The asset has not been validated as an iOS app icon (no Xcode build, no iOS Simulator verification, no App Store Connect upload). Do NOT make claims that this is a production-ready app icon. The repository, backend, and Flutter app remain mock-only with `productionReady: false`.
