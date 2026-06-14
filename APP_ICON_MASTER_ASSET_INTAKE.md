# App Icon Master Asset Intake

> **Phase 22B**: Intake the selected app icon master asset into the repository as design-source only.
>
> This document records the ingestion of the selected icon master image. The asset is stored under `design/app-icon/source/` for future export, cleanup, and application. It is NOT yet applied to the Flutter app, iOS configuration, or launch screen.

---

## 1. Purpose

1. **Intake** the selected app icon master asset into the repository.
2. **Record** asset metadata (dimensions, format, size, origin).
3. **Define scope boundaries** — the asset is design-source only, not a production app icon yet.
4. **Document future steps** — what must happen before this asset becomes the actual app icon.

This phase does NOT:

- Apply the icon to `ios/AppIcon.appiconset/`
- Change `pubspec.yaml`
- Configure `flutter_launcher_icons`
- Modify launch screen files
- Change any Flutter code or iOS configuration

---

## 2. Selected Asset

### 2.1 Path

```
design/app-icon/source/ai-food-passport-selected-icon-master.png
```

### 2.2 Origin

| Attribute | Detail |
|---|---|
| **Selected candidate** | Candidate 1, recolored version (documented in `APP_ICON_CANDIDATE_REVIEW.md`, Phase 22A) |
| **Selection accepted** | 15/16 acceptance criteria passed, 0/12 rejection criteria hit |
| **Visual description** | Deep royal/cobalt blue passport book, warm metallic gold crossed fork and spoon over globe linework, subtle cyan/blue edge glow, premium 3D app icon style |
| **Generation method** | AI image generation using prompts from `APP_ICON_PROMPT_PACK.md` (Phase 21J) |
| **Design spec compliance** | Matches all visual identity specifications in `APP_ICON_LAUNCH_SCREEN_SPEC.md` (Phase 21I) |

---

## 3. Asset Metadata

| Field | Value |
|---|---|
| **File name** | `ai-food-passport-selected-icon-master.png` |
| **Format** | PNG (Portable Network Graphics) |
| **Dimensions** | 1254 x 1254 pixels |
| **File size** | 2,349,686 bytes (~2.24 MB) |
| **Color model** | RGB, 8-bit/color |
| **Interlacing** | Non-interlaced |
| **Imported timestamp** | 2026-06-15 00:07:18 (local filesystem) |
| **Directory** | `design/app-icon/source/` |

### 3.1 Notes on Dimensions

The imported master is 1254x1254 px — not exactly 1024x1024 px (the standard iOS App Store icon master size). This is a **generated source asset**, not a production export. The extra pixels provide headroom for cropping and cleanup. A future export step (Phase 22B+ / Phase 22C) will produce the final 1024x1024 px source from this or a cleaned-up version.

### 3.2 Notes on File Size

~2.24 MB is typical for a high-resolution PNG with subtle gradients and texture. This is acceptable for a design-source master. Production icon sets will be smaller individually but collectively may exceed this; iOS handles icon compression internally.

---

## 4. Scope Boundaries

This asset is **design-source only**. It is NOT:

| ❌ NOT applied to | Explanation |
|---|---|
| `ios/Runner/Assets.xcassets/AppIcon.appiconset/` | No icon replacement has been performed. The Flutter default icon set remains in place. |
| `pubspec.yaml` | No Flutter assets declaration has been added. |
| `flutter_launcher_icons` config | No icon generation tool has been run. |
| `LaunchScreen.storyboard` | No launch screen changes have been made. |
| Flutter code (`lib/`) | No icon references in Dart code. |
| Backend (`backend/`) | No backend changes. |
| Render deployment | No deployment config changes. |

The asset exists only in:

| ✅ Present in | Path |
|---|---|
| Design source directory | `design/app-icon/source/ai-food-passport-selected-icon-master.png` |
| Directory documentation | `design/app-icon/README.md` |

---

## 5. Safety Review

### 5.1 Visual Content Audit

The ingested master image was inspected and verified:

| Check | Result |
|---|---|
| No text present | ✅ Confirmed — zero text in image |
| No national flags | ✅ Confirmed — passport cover is generic, no country identifier |
| No medical cross / caduceus / heartbeat | ✅ Confirmed — no medical imagery |
| No real restaurant logos | ✅ Confirmed — no brand marks detected |
| No AI brain / robot icon | ✅ Confirmed — no technology iconography |
| No camera / lens / viewfinder | ✅ Confirmed — no scan/camera hardware imagery |
| No "guaranteed safe" imagery | ✅ Confirmed — no shields, checkmarks, or certification badges |
| No photo-realistic food | ✅ Confirmed — utensils are stylized linework |
| Not a standalone globe | ✅ Confirmed — globe linework is integrated into passport |
| No production-ready claims in image | ✅ Confirmed — no "App Store", "production", "shipping" visual cues |

### 5.2 Content Alignment with Design Spec

The asset matches the accepted visual direction from `APP_ICON_CANDIDATE_REVIEW.md`:

| Spec Requirement | Asset Match |
|---|---|
| Passport + fork/spoon | ✅ Royal/cobalt blue passport + gold fork/spoon crossing |
| No text | ✅ Zero text |
| No flags | ✅ Generic passport |
| No medical symbols | ✅ None present |
| No restaurant logos | ✅ None present |
| Readable at small sizes | ✅ Simple silhouette (verified at selection) |
| High contrast | ✅ Cobalt blue vs. metallic gold exceeds contrast thresholds |

### 5.3 Safety Scan Summary

- **Acceptance checklist**: 15/16 passed (1 deferred: opacity check — requires export-time verification)
- **Rejection checklist**: 0/12 hit
- **Forbidden claims**: None present in image or metadata
- **Overclaim risk**: None — this is a design-source asset with no production claims

---

## 6. Future Use

### 6.1 What Must Happen Before This Becomes the App Icon

| Step | Action | Phase | Prerequisites |
|---|---|---|---|
| **1. Crop/resize to 1024x1024** | Produce a square 1024x1024 px PNG source from this master (or a cleaned-up version) | Phase 22B+ | This asset ingested |
| **2. Vector cleanup (optional)** | Trace and clean up into vector shapes if needed (Figma/Illustrator/Inkscape). Adjust fork/spoon spacing, normalize glow intensity. | Phase 22B+ | PNG source exported |
| **3. Silhouette test** | Scale to 29x29, 40x40, 60x60, 120x120, 180x180 px. Verify legibility on light and dark backgrounds. | Phase 22C | Cleaned source available |
| **4. Acceptance sign-off** | Re-run the full 16-item acceptance checklist on the exported/cleaned source. | Phase 22C | Silhouette test passed |
| **5. Commit approved source** | Add the final approved 1024x1024 PNG to `docs/design-assets/` | Phase 22C | Acceptance sign-off |
| **6. Generate iOS icon sizes** | Use a tool (flutter_launcher_icons, `iconutil`, or manual export) to produce all required iOS sizes | Phase 22D | macOS + Xcode available |
| **7. Apply to `AppIcon.appiconset`** | Replace Flutter default icons in Xcode with generated icon set | Phase 22D | macOS + Xcode available |
| **8. Configure `flutter_launcher_icons`** | Add config to `pubspec.yaml`, run `flutter pub run flutter_launcher_icons` | Phase 22D | macOS + Flutter available |
| **9. Update launch screen** | Edit `LaunchScreen.storyboard` in Xcode: navy background + centered icon mark + "AI Food Passport" | Phase 22D | macOS + Xcode available |
| **10. Validate on iOS Simulator** | Build and verify icon appearance on home screen, Settings, Notification Center | Phase 22D | macOS + Xcode + iOS Simulator |

### 6.2 What CAN Be Done Now (No macOS Required)

| ✅ Can do now | Tool needed |
|---|---|
| Crop to 1024x1024 px | Any image editor (GIMP, Paint.NET, ImageMagick) |
| Vector cleanup | Figma (free), Inkscape (free) |
| Silhouette test | Manual scaling in any image viewer |
| Acceptance checklist review | This document (`APP_ICON_CANDIDATE_REVIEW.md`) |
| Commit cleaned-up source to repo | Git |
| Prepare `flutter_launcher_icons` config draft | Text editor |

### 6.3 What REQUIRES macOS

| ❌ Requires macOS | Reason |
|---|---|
| Generate iOS icon sizes via `iconutil` or Xcode | macOS-only tools |
| Apply icons to `AppIcon.appiconset` | Xcode required |
| Apply launch screen changes | Xcode Interface Builder required |
| Run `flutter pub run flutter_launcher_icons` for iOS | Needs macOS/Xcode for iOS build |
| Verify icon on iOS Simulator | macOS + Xcode required |

---

## 7. Current Decision

### 7.1 Decision Summary

| Decision | Detail |
|---|---|
| **Asset status** | ✅ Design-source master asset ingested into repository |
| **Location** | `design/app-icon/source/ai-food-passport-selected-icon-master.png` |
| **Production icon applied** | ❌ No — the Flutter default icon set is unchanged |
| **Flutter code changed** | ❌ No |
| **iOS config changed** | ❌ No |
| **`pubspec.yaml` changed** | ❌ No |
| **Backend code changed** | ❌ No |
| **Render config changed** | ❌ No |
| **Screenshots changed** | ❌ No |
| **API keys / Firebase added** | ❌ No |
| **`productionReady` changed** | ❌ No — remains `false` |
| **Real providers enabled** | ❌ No |

### 7.2 Decision Log

| # | Decision | Rationale | Phase |
|---|---|---|---|
| 1 | Intake the selected icon master into `design/app-icon/source/` | The candidate was selected and reviewed in Phase 22A. This intake records the asset in the repository for traceability and future export. | Phase 22B |
| 2 | Keep original dimensions (1254x1254) — do NOT resize yet | Extra pixels provide headroom for cropping and cleanup. Final 1024x1024 export happens in a later step. | Phase 22B |
| 3 | Asset stored under `design/`, NOT `ios/` or `assets/` | This is a design-source asset, not a production app asset. It does not belong in `ios/AppIcon.appiconset/` or Flutter's `assets/` directory. | Phase 22B |
| 4 | No Flutter, iOS, backend, or config changes | This phase is asset intake only. The icon is NOT applied to the app. | Phase 22B |
| 5 | No `pubspec.yaml` changes | No Flutter assets declaration, no `flutter_launcher_icons` config, no dependency additions. | Phase 22B |
| 6 | Small-size validation performed in Phase 22C | Generated 7 preview images (1024–40 px + contact sheet), reviewed readability, accepted as design-source asset (19/20), flagged baked-in corners for resolution in Phase 22D. | Phase 22C |
| 7 | Clean square regeneration plan created (Phase 22D) | Created `APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md` (8 sections): why regeneration needed, 9-item criteria, AI prompt + negative prompt, 20-item acceptance + 12-item rejection checklist, next step workflow. Planning-only; no binary assets created. | Phase 22D |
| 8 | Clean square master intake & QA completed (Phase 22E) | Ingested `ai-food-passport-clean-square-master.png` (1254x1254, RGB opaque, 2.56 MB). Validated: square dimensions, no alpha channel, no baked-in corners — Phase 22C issue RESOLVED. Accepted as preferred export source (21/21). Previous source archived as design reference. 7 preview assets + comparison sheet generated under design/app-icon/preview/. | Phase 22E |

---

*This document records the ingestion of the selected AI Food Passport app icon master asset into the repository as design-source only. The asset has been visually inspected and passes all safety checks. It is NOT yet applied to the Flutter app, iOS configuration, pubspec.yaml, or launch screen. No production claims are made. The next step is to export a cleaned-up 1024x1024 px source from this master (Phase 22B+ / Phase 22C).*
