# App Icon Clean Square Master Asset Intake

> **Phase 22E**: Intake the regenerated clean square app icon master asset into the repository as design-source only.
>
> This document records the ingestion of the clean square master image, which replaces the previous rounded-corner source as the **preferred future export source**. The asset is stored under `design/app-icon/source/` for future export and application. It is NOT yet applied to the Flutter app, iOS configuration, or launch screen. The previous rounded-corner source is retained as a design archive.

---

## 1. Purpose

1. **Intake** the regenerated clean square app icon master asset into the repository.
2. **Record** asset metadata (dimensions, format, size, origin, validation result).
3. **Define scope boundaries** — the asset is design-source only, not a production app icon yet.
4. **Document the relationship** to the previous rounded-corner source and the reason for regeneration.
5. **Document future steps** — what must happen before this asset becomes the actual app icon.

This phase does NOT:

- Apply the icon to `ios/AppIcon.appiconset/`
- Change `pubspec.yaml`
- Configure `flutter_launcher_icons`
- Modify launch screen files
- Change any Flutter code or iOS configuration
- Delete or overwrite the previous rounded-corner source (it is retained as design archive)

---

## 2. Asset

### 2.1 Path

```
design/app-icon/source/ai-food-passport-clean-square-master.png
```

### 2.2 Origin

| Attribute | Detail |
|---|---|
| **Regeneration reason** | Phase 22C small-size validation flagged "baked-in rounded corners" as MEDIUM severity (finding #3 in `APP_ICON_QA_SMALL_SIZE_VALIDATION.md`). iOS applies a corner mask at runtime; a baked-in corner in the source causes a double-rounding artifact. |
| **Plan** | `APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md` (Phase 22D) defines 9 technical criteria, AI prompt + negative prompt, and 20-item acceptance + 12-item rejection checklist. |
| **Generation method** | AI image generation using the prompt and negative prompt from Phase 22D, targeting a clean square canvas with no baked-in rounding. |
| **Imported timestamp** | 2026-06-15 01:01:27 (local filesystem) |
| **File size** | 2,557,693 bytes (~2.44 MB) |
| **Visual description** | Deep royal/cobalt blue passport book, warm metallic gold crossed fork and spoon over globe linework, subtle cyan/blue edge glow, premium 3D app icon style — **with clean square corners** (no baked-in rounding). |

---

## 3. Technical Metadata

| Field | Value |
|---|---|
| **File name** | `ai-food-passport-clean-square-master.png` |
| **Format** | PNG (Portable Network Graphics) |
| **Dimensions** | 1254 x 1254 pixels |
| **Aspect ratio** | 1:1 (square) |
| **File size** | 2,557,693 bytes (~2.44 MB) |
| **Color model** | RGB (8-bit/channel, no alpha channel) |
| **Alpha channel** | None — fully opaque. This is the **correct** format for an iOS app icon source. iOS applies its own corner mask at runtime; transparency in the source is unnecessary and potentially problematic. |
| **Interlacing** | Non-interlaced |
| **Imported timestamp** | 2026-06-15 01:01:27 (local filesystem) |
| **Directory** | `design/app-icon/source/` |

### 3.1 Pillow Validation Result

Validated with Python Pillow (`PIL.Image`):

| Check | Result |
|---|---|
| Format detected | ✅ PNG |
| Mode | ✅ RGB (no alpha channel) |
| Dimensions | ✅ 1254 x 1254 |
| Square (width == height) | ✅ True |
| Fully opaque (no transparency) | ✅ True — RGB mode = no alpha = fully opaque |
| Corner sample (5×5 at each corner) | N/A — no alpha channel to check; RGB mode confirms fully opaque corners |

### 3.2 Comparison with Previous (Rounded-Corner) Source

| Field | Clean Square Master (new) | Rounded-Corner Source (old) |
|---|---|---|
| **File name** | `ai-food-passport-clean-square-master.png` | `ai-food-passport-selected-icon-master.png` |
| **Dimensions** | 1254 × 1254 | 1254 × 1254 |
| **Color mode** | RGB (opaque) | RGB (opaque) |
| **Baked-in rounded corners** | ✅ No — clean square corners | ❌ Yes — corners visually rounded in pixel content |
| **iOS runtime mask compatibility** | ✅ Correct — system mask will produce proper corners | ❌ Suboptimal — double-rounding artifact risk |
| **File size** | 2,557,693 bytes | 2,349,686 bytes |
| **Status** | ✅ **Preferred export source** | 📁 Retained as design archive |

---

## 4. Visual Description

The clean square master depicts the same AI Food Passport icon visual identity as the previous source:

- **Central object**: Deep royal/cobalt blue passport book rendered in premium 3D style
- **Foreground emblem**: Warm metallic gold crossed fork and spoon, overlaid on a subtle globe linework pattern
- **Background**: Soft gradient from deep navy to darker tone; subtle cyan/blue edge glow around the passport silhouette
- **Corner treatment**: **Clean square corners** — the passport and emblem extend to all four corners of the square canvas. No rounded corners are baked into the pixel content. iOS will apply its standard corner mask at runtime.

The visual content is identical to the previous source except for the corner treatment. The regeneration specifically targeted the removal of baked-in rounding while preserving all other visual identity elements.

---

## 5. Technical Validation

### 5.1 PNG Metadata Validation

Performed with Python Pillow (see Section 3.1 for full results):

- ✅ PNG format detected
- ✅ RGB mode (no alpha channel)
- ✅ 1254 × 1254 pixels (square)
- ✅ Fully opaque (correct for iOS source)

### 5.2 Small-Size Preview Generation

Generated preview images at standard iOS icon sizes from this master:

| Size | File | File size |
|---|---|---|
| 1024×1024 | `design/app-icon/preview/icon-preview-1024x1024.png` | 1,753,264 bytes |
| 512×512 | `design/app-icon/preview/icon-preview-512x512.png` | 409,814 bytes |
| 180×180 | `design/app-icon/preview/icon-preview-180x180.png` | 49,007 bytes |
| 120×120 | `design/app-icon/preview/icon-preview-120x120.png` | 22,787 bytes |
| 60×60 | `design/app-icon/preview/icon-preview-60x60.png` | 6,370 bytes |
| 40×40 | `design/app-icon/preview/icon-preview-40x40.png` | 3,133 bytes |
| Contact sheet | `design/app-icon/preview/clean-square-master-contact-sheet.png` | 216,193 bytes |

These previews are derived from the clean square master and are stored for visual inspection only. They are NOT the production icon set.

### 5.3 Visual Content Audit (Safety Review)

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
| Clean square corners (no baked-in rounding) | ✅ Confirmed — passes Phase 22D Criterion #1 |

---

## 6. Relationship to Previous Source

### 6.1 Why Regeneration Was Needed

Phase 22C (`APP_ICON_QA_SMALL_SIZE_VALIDATION.md`, finding #3) identified:

> **MEDIUM — Baked-in rounded corners**: The source PNG appears to have rounded corners baked into the image content. iOS applies its own corner mask at runtime. A baked-in corner in the source causes a double-rounding artifact: the system mask rounds the corners further, resulting in overly rounded corners that do not match the standard iOS icon appearance.

Phase 22D (`APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md`) was created to plan the fix. Phase 22E executes the intake of the regenerated asset.

### 6.2 Asset Status After Intake

| Asset | File name | Status | Role |
|---|---|---|---|
| **Clean square master (new)** | `ai-food-passport-clean-square-master.png` | ✅ **Preferred export source** | All future exports (1024×1024, iOS icon set) must use this as the source. |
| **Rounded-corner source (old)** | `ai-food-passport-selected-icon-master.png` | 📁 **Design archive** | Retained for reference and design history. Must NOT be used for future exports. |

### 6.3 What Changes and What Does Not

| Item | Before Phase 22E | After Phase 22E |
|---|---|---|
| **Preferred export source** | `ai-food-passport-selected-icon-master.png` (rounded corners) | `ai-food-passport-clean-square-master.png` (clean square) ✅ |
| **Old source deleted?** | — | ❌ No — retained as `design/app-icon/source/ai-food-passport-selected-icon-master.png` |
| **Applied to Flutter/iOS?** | ❌ No | ❌ No — still design-source only |
| **`pubspec.yaml` changed?** | ❌ No | ❌ No |
| **`productionReady` changed?** | ❌ No (`false`) | ❌ No (`false`) |

---

## 7. Scope Boundaries

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
| Design source directory | `design/app-icon/source/ai-food-passport-clean-square-master.png` |
| Preview directory (resized exports) | `design/app-icon/preview/icon-preview-{size}x{size}.png` (6 files) |
| Preview contact sheet | `design/app-icon/preview/clean-square-master-contact-sheet.png` |
| This document | `APP_ICON_CLEAN_SQUARE_MASTER_INTAKE.md` |

---

## 8. Future Use

### 8.1 What Must Happen Before This Becomes the App Icon

| Step | Action | Phase | Prerequisites |
|---|---|---|---|
| **1. Export 1024×1024 source** | Crop/resize the 1254×1254 master to a clean 1024×1024 px PNG. Verify no quality loss at the corners. | Phase 22F | Clean square master ingested (✅ this phase) |
| **2. Final silhouette test** | Scale exported 1024×1024 to 40×40, 60×60, 120×120, 180×180 px. Verify legibility on light and dark backgrounds. Confirm clean corners at all sizes. | Phase 22F | 1024×1024 export available |
| **3. Acceptance sign-off** | Re-run the full 20-item acceptance + 12-item rejection checklist from Phase 22D on the exported 1024×1024 source. | Phase 22F | Silhouette test passed |
| **4. Commit approved 1024×1024 source** | Add the final approved 1024×1024 PNG to the repository (new file name TBD). | Phase 22F | Acceptance sign-off passed |
| **5. Generate iOS icon sizes** | Use a tool (`iconutil`, Xcode, or manual export) to produce all required iOS icon sizes from the approved 1024×1024 source. | Phase 22G | macOS + Xcode available; approved 1024×1024 source |
| **6. Apply to `AppIcon.appiconset`** | Replace Flutter default icons in Xcode with the generated icon set. | Phase 22G | macOS + Xcode available; iOS icon set generated |
| **7. Configure `flutter_launcher_icons`** | Add config to `pubspec.yaml`, run icon generation. | Phase 22G | macOS + Flutter available |
| **8. Update launch screen** | Edit `LaunchScreen.storyboard`: navy background + centered icon mark + "AI Food Passport". | Phase 22G | macOS + Xcode available |
| **9. Validate on iOS Simulator** | Build and verify icon appearance on home screen, Settings, Notification Center. | Phase 22G | macOS + Xcode + iOS Simulator |
| **10. TestFlight / App Store submission prep** | Final icon review in TestFlight, then App Store Connect. | Phase 23+ | iOS build available; Apple Developer membership |

### 8.2 What CAN Be Done Now (No macOS Required)

| ✅ Can do now | Tool needed |
|---|---|
| Export 1024×1024 from 1254×1254 master | Any image editor (GIMP, Paint.NET, ImageMagick) |
| Final silhouette test | Manual scaling in any image viewer |
| Acceptance checklist review | `APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md` (Phase 22D) |
| Commit exported 1024×1024 to repo | Git |
| Prepare `flutter_launcher_icons` config draft | Text editor |

### 8.3 What REQUIRES macOS

| ❌ Requires macOS | Reason |
|---|---|
| Generate iOS icon sizes via `iconutil` or Xcode | macOS-only tools |
| Apply icons to `AppIcon.appiconset` | Xcode required |
| Apply launch screen changes | Xcode Interface Builder required |
| Run `flutter_launcher_icons` for iOS | Needs macOS/Xcode for iOS build |
| Verify icon on iOS Simulator | macOS + Xcode required |

---

## 9. Decision

### 9.1 Decision Summary

| Decision | Detail |
|---|---|
| **Asset status** | ✅ Clean square master asset ingested into repository |
| **Location** | `design/app-icon/source/ai-food-passport-clean-square-master.png` |
| **Preferred export source** | ✅ Updated — clean square master is now the preferred source for all future exports |
| **Old source deleted?** | ❌ No — retained as design archive at `design/app-icon/source/ai-food-passport-selected-icon-master.png` |
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

### 9.2 Decision Log

| # | Decision | Rationale | Phase |
|---|---|---|---|
| 1 | Intake clean square master into `design/app-icon/source/` | Phase 22D identified baked-in rounded corners as a MEDIUM severity issue. The regenerated asset fixes this. This intake records the new asset for traceability. | Phase 22E |
| 2 | Keep original dimensions (1254×1254) — do NOT resize yet | Extra pixels provide headroom for the final 1024×1024 export. Resizing happens in a later step (Phase 22F). | Phase 22E |
| 3 | Asset stored under `design/`, NOT `ios/` or `assets/` | This is a design-source asset, not a production app asset. It does not belong in `ios/AppIcon.appiconset/` or Flutter's `assets/` directory. | Phase 22E |
| 4 | No Flutter, iOS, backend, or config changes | This phase is asset intake only. The icon is NOT applied to the app. | Phase 22E |
| 5 | Retain old rounded-corner source as design archive | The old source is retained for design history and reference. It is explicitly demoted from "preferred export source" but not deleted. | Phase 22E |
| 6 | Update preferred export source to clean square master | All future exports (1024×1024, iOS icon set) must use the clean square master. This is documented in this intake and cross-referenced in `design/app-icon/README.md`. | Phase 22E |

---

## 10. Cross-References

| Document | Relationship |
|---|---|
| `APP_ICON_CANDIDATE_REVIEW.md` (Phase 22A) | Original candidate selection and visual identity specification |
| `APP_ICON_MASTER_ASSET_INTAKE.md` (Phase 22B) | Previous source intake (same visual identity, rounded corners) |
| `APP_ICON_QA_SMALL_SIZE_VALIDATION.md` (Phase 22C) | Small-size validation that flagged baked-in corners (MEDIUM) |
| `APP_ICON_CLEAN_SQUARE_REGENERATION_PLAN.md` (Phase 22D) | Regeneration plan: 9 criteria, prompt, acceptance/rejection checklist |
| `design/app-icon/README.md` | Directory README — updated in this phase to reflect new preferred source |
| `README.md` | Project README — cross-reference updated in this phase |
| `ROADMAP.md` | Project roadmap — cross-reference updated in this phase |

---

*This document records the ingestion of the clean square AI Food Passport app icon master asset into the repository as design-source only. The asset fixes the baked-in rounded corner issue identified in Phase 22C. It is NOT yet applied to the Flutter app, iOS configuration, pubspec.yaml, or launch screen. The previous rounded-corner source is retained as a design archive. The next step is to export a clean 1024×1024 px source from this master (Phase 22F).*
