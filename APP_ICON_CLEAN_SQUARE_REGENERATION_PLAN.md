# App Icon Clean Square Regeneration Plan

> **Phase**: 22D — Clean Square App Icon Master Regeneration Plan
> **Date**: 2026-06-15
> **Type**: Planning / documentation only (no binary assets created, no code/config changed)
> **Prerequisite**: Phase 22C (App Icon QA & Small-Size Validation) found baked-in rounded corners in current source

---

## 1. Purpose

### 1.1 Why Clean Square Regeneration Is Needed

Phase 22C performed a full QA review of the selected app icon master asset (`design/app-icon/source/ai-food-passport-selected-icon-master.png`) and identified a **key technical risk**:

> **The current source PNG has baked-in rounded corners (squircle masking) applied to the image itself.**

This is problematic for iOS app icon use because:

1. **iOS applies its own runtime mask** — iOS automatically applies the system-defined corner radius to all app icons at render time.
2. **Double-masking risk** — If the source image already has rounded corners baked in, iOS will apply a second mask, resulting in **overly rounded corners** or **unexpected cropping** of the icon artwork.
3. **Inconsistent rendering** — Different iOS versions and device sizes apply slightly different corner radii. A pre-rounded source cannot adapt.
4. **App Store Connect validation** — Apple expects a **square, opaque PNG** as the source asset. Pre-rounded images may trigger warnings or be rejected during App Store review.

### 1.2 Goal of This Plan

This document defines the **regeneration criteria, prompt guidance, and acceptance/rejection checklists** for producing a clean, square version of the currently selected app icon design — preserving the visual concept while fixing the technical deficiency.

**This is a planning document only.** No new binary assets are created in this phase. The actual regeneration happens in a future phase (or outside the repo, then ingested).

---

## 2. Current Selected Design

The currently selected icon concept (from Phase 22A) is:

| Element | Description |
|---|---|
| **Passport** | Royal/cobalt blue passport book, centered, occupying ~70% of canvas |
| **Utensils** | Warm metallic gold crossed fork and spoon, centered on passport |
| **Globe** | Subtle globe linework in the background, behind the passport |
| **Glow** | Cyan/blue edge glow around the passport rim |
| **Style** | Premium 3D rendered appearance with soft shadows and highlights |
| **Overall impression** | "Travel + food" — instantly recognizable as a food passport app |

**This visual concept is approved** and should be preserved in the regenerated clean-square version. Only the **canvas shape and corner treatment** need to change.

---

## 3. Problem Statement

### 3.1 What Is Wrong With the Current Source

| Issue | Severity | Explanation |
|---|---|---|
| **Baked-in rounded corners** | 🟡 MEDIUM | Source PNG has squircle corners already applied. iOS will apply a second mask. |
| **Non-standard dimensions** | 🟢 LOW | 1254×1254 px instead of standard 1024×1024 px. Trivially fixable by cropping/resizing. |
| **Unknown background** | 🟢 LOW | Phase 22C could not confirm whether corners are transparent or filled. Either way, pre-masking is incorrect for iOS. |

### 3.2 Why This Cannot Be Used Directly for iOS

Even though the current source is **visually good** (accepted as a portfolio design-source asset with a 19/20 score), it is **not technically suitable** as the input to `AppIcon.appiconset` or `flutter_launcher_icons`.

**Correct workflow for iOS app icons:**
1. Start with a **square, opaque PNG** (no rounded corners, no alpha mask in corners)
2. iOS applies the system corner radius at **render time** (not at asset time)
3. Generate all required sizes from the square master

**Current source violates step 1** — it already has corners applied.

---

## 4. Required Clean Square Master Criteria

The regenerated master asset MUST meet **all** of the following criteria:

### 4.1 Format & Dimensions

| Criterion | Requirement |
|---|---|
| **Shape** | Perfect square (1:1 aspect ratio) |
| **Dimensions** | 1024×1024 px (preferred) or larger (e.g., 2048×2048). If larger, must be divisible by 2. |
| **Format** | PNG |
| **Color mode** | sRGB, 8-bit (24-bit RGB) or 32-bit (RGBA with opaque background) |
| **Transparency** | ❌ NO — background must be fully opaque. iOS expects an opaque square; transparency in the source causes rendering artifacts. |
| **Compression** | No interlacing. Standard PNG compression (zlib level 6–9). |

### 4.2 Corner & Mask Requirements

| Criterion | Requirement |
|---|---|
| **Rounded corners** | ❌ NONE — corners must be sharp 90° corners |
| **Alpha masking in corners** | ❌ NONE — all corner pixels must be opaque (alpha = 255) |
| **Squircle masking** | ❌ NONE — no iOS-style squircle curvature baked into the image |
| **Transparent corners** | ❌ NONE — corners must be filled with the background color |

### 4.3 Visual Content Requirements

| Criterion | Requirement |
|---|---|
| **Passport** | Royal/cobalt blue, centered, ~70% canvas |
| **Fork/spoon** | Warm metallic gold, crossed, centered on passport |
| **Globe linework** | Subtle, behind passport |
| **Cyan/blue glow** | Subtle rim glow around passport edge |
| **Background** | Solid color (recommend: deep navy `#1B2A4A`, matching app theme). Opaque. |
| **Text** | ❌ NONE — no app name, no tagline, no labels |
| **Flags** | ❌ NONE — no country flags |
| **Medical cross / allergen symbols** | ❌ NONE — do not imply medical accuracy |
| **Restaurant logos** | ❌ NONE — no third-party branding |
| **AI brain / robot icons** | ❌ NONE — do not overclaim AI capabilities |
| **3D style** | ✅ Preserved — premium 3D rendered appearance |

### 4.4 Technical Quality Requirements

| Criterion | Requirement |
|---|---|
| **Anti-aliasing** | Clean pixel edges or high-quality anti-aliasing. No jagged edges. |
| **Color banding** | No visible banding in gradients (glow, shadows) |
| **Compression artifacts** | No JPEG-style artifacts. PNG must be lossless. |
| **Alpha channel** | Either no alpha channel (24-bit RGB) OR alpha channel fully opaque (32-bit RGBA, alpha=255 everywhere) |

---

## 5. Suggested Regeneration Prompt

Use this prompt with an AI image generation tool (Midjourney, DALL-E 3, Stable Diffusion, etc.) to regenerate the clean square version.

### 5.1 Primary Prompt (English)

```
A premium 3D app icon design for "AI Food Passport" — a mobile app that helps travelers understand restaurant menus in foreign countries.

Center: a royal blue / cobalt blue passport book (closed, front cover visible), occupying ~70% of the square canvas.
On top of the passport: a pair of crossed utensils — a fork and a spoon — in warm metallic gold, centered.
Behind the passport: very subtle, thin globe linework (latitude/longitude lines), faded, in light blue/cyan.
Around the rim of the passport: a subtle cyan/blue glow or soft edge highlight.
Background: solid deep navy blue (#1B2A4A), fully opaque, no transparency.
Style: premium 3D rendered appearance, soft shadows, smooth lighting, high-end mobile app icon quality.
NO text, NO flags, NO medical cross, NO restaurant logos, NO AI brain icons, NO rounded corners, NO transparency.
Square canvas, sharp corners, full-bleed background.
--ar 1:1 --size 1024x1024
```

### 5.2 Prompt (中文)

```
「AI Food Passport」应用的精品3D应用图标设计 —— 一款帮助旅行者在国外理解餐厅菜单的移动应用。

中心：一本皇家蓝/钴蓝色护照册（合上，封面朝前），占据正方形画布的约70%。
护照上方：一对交叉的餐具 —— 一把餐叉和一把汤勺 —— 暖金属金色，居中。
护照后面：非常微妙的细线地球仪线稿（经纬线），淡化，浅蓝/青色。
护照边缘：微妙的青色/蓝色光晕或柔和边缘高光。
背景：纯深藏蓝（#1B2A4A），完全不透明，无透明。
风格：精品3D渲染外观，柔和阴影，平滑光照，高端移动应用图标品质。
无文字，无旗帜，无医疗十字，无餐厅标志，无AI大脑图标，无圆角，无透明。
正方形画布，尖角，全出血背景。
```

### 5.3 Negative Prompt (Important)

```
rounded corners, squircle, rounded square, transparency, alpha mask, text, letters, words, 
app name, title, flag, country flag, medical cross, allergen symbol, restaurant logo, 
brand logo, AI brain, robot, robot face, rounded edges, blurred, low quality, 
JPEG artifacts, text overlay, watermark, border, frame, white corners, transparent corners
```

### 5.4 Generation Tool Recommendations

| Tool | Why | Notes |
|---|---|---|
| **Midjourney v6** | High aesthetic quality, good with product/icon prompts | Use `--ar 1:1 --size 1024x1024`; may need multiple tries to avoid rounded corners |
| **DALL-E 3 (ChatGPT / Bing)** | Good prompt adherence | Explicitly state "NO rounded corners" and "square canvas, sharp corners" |
| **Stable Diffusion (SDXL)** | Full control via negative prompts | Use ControlNet or img2img with current source as reference |
| **Adobe Firefly** | Commercially safe | Good for clean, product-style icons |

### 5.5 Prompt Iteration Strategy

If the first generation still has rounded corners:

1. **Add to prompt**: `"square canvas, sharp 90-degree corners, NO rounded corners, NO squircle, full-bleed background to edges"`
2. **Add to negative prompt**: `"rounded corners, squircle, rounded square, curved corners"`
3. **Try img2img**: Use the current (rounded) source as reference with a low denoising strength (0.3–0.5) to preserve the visual concept while changing the canvas shape.
4. **Manual cleanup**: If AI generation consistently produces rounded corners, generate at 2048×2048 with extra padding, then manually crop to a clean square in Photoshop/GIMP.

---

## 6. Acceptance Checklist

Regenerated asset passes **only if ALL** of the following are true:

| # | Criterion | Check |
|---|---|---|
| 1 | **Square dimensions** — width == height, no stretching | `[ ]` |
| 2 | **No baked-in rounded corners** — corners are sharp 90° | `[ ]` |
| 3 | **No alpha masking in corners** — all 4 corner pixels are opaque | `[ ]` |
| 4 | **Background is opaque** — no transparency anywhere in the image | `[ ]` |
| 5 | **Passport recognizable** — royal/cobalt blue, centered | `[ ]` |
| 6 | **Fork/spoon recognizable** — warm gold, crossed, centered | `[ ]` |
| 7 | **Globe linework visible** — subtle, behind passport | `[ ]` |
| 8 | **Cyan/blue glow present** — subtle rim glow | `[ ]` |
| 9 | **Blue/gold contrast strong** — passport blue vs. gold utensils | `[ ]` |
| 10 | **Icon reads as "travel + food"** — recognizable concept | `[ ]` |
| 11 | **Readable at 180 px** — home-screen size | `[ ]` |
| 12 | **Readable at 120 px** — Spotlight size | `[ ]` |
| 13 | **Readable at 60 px** — Settings size | `[ ]` |
| 14 | **Readable at 40 px** — minimum iOS size | `[ ]` |
| 15 | **No text** — no app name, no labels | `[ ]` |
| 16 | **No flags** — no country flags | `[ ]` |
| 17 | **No medical/safety imagery** — no cross, no allergy badge | `[ ]` |
| 18 | **No restaurant/logos** — no third-party branding | `[ ]` |
| 19 | **No AI brain/robot icons** — no overclaimed AI imagery | `[ ]` |
| 20 | **PNG format, sRGB** — correct format | `[ ]` |

**Pass threshold**: 19/20 or higher. If ≤18/20, reject and regenerate.

---

## 7. Rejection Checklist

Regenerated asset is **rejected** if ANY of the following are true:

| # | Rejection Reason | Severity |
|---|---|---|
| 1 | **Rounded corners baked into image** | 🔴 HIGH — defeats the entire purpose of regeneration |
| 2 | **White or transparent corners** (alpha mask visible) | 🔴 HIGH — iOS will render these as black or transparent |
| 3 | **Extra symbols added** (stars, badges, notifications) | 🟡 MEDIUM — clutters small sizes |
| 4 | **Text added** (app name, version, tagline) | 🟡 MEDIUM — Apple will reject; unreadable at small sizes |
| 5 | **Flag added** | 🟡 MEDIUM — geopolitical sensitivity; unnecessary |
| 6 | **Medical cross / allergen badge added** | 🔴 HIGH — implies medical accuracy; legal liability |
| 7 | **Restaurant logo added** | 🟡 MEDIUM — third-party branding issue |
| 8 | **AI brain / robot icon added** | 🟡 MEDIUM — overclaims AI capabilities |
| 9 | **Passport color changed** (not royal/cobalt blue) | 🟢 LOW — fixable in post-processing |
| 10 | **Utensils color changed** (not warm gold) | 🟢 LOW — fixable in post-processing |
| 11 | **Background transparent** | 🔴 HIGH — iOS expects opaque source |
| 12 | **Dimensions not square** | 🔴 HIGH — cannot use as iOS icon source |

---

## 8. Next Steps

### 8.1 Correct Regeneration Workflow

```
Step 1: Generate clean square candidate(s)
   └─ Use prompt in Section 5
   └─ Generate 4–8 candidates
   └─ Select best candidate (visually closest to current approved design)

Step 2: Visual review (outside repo)
   └─ Open candidate in image editor
   └─ Zoom to 100% at corners — verify they are sharp 90°
   └─ Check image dimensions — must be square
   └─ Check transparency — must be opaque

Step 3: Small-size readability test (outside repo)
   └─ Resize to 180, 120, 60, 40 px
   └─ Verify passport + fork/spoon still recognizable
   └─ Compare with Phase 22C contact sheet

Step 4: Acceptance checklist (Section 6)
   └─ Run through all 20 items
   └─ Score ≥19/20 → ACCEPT
   └─ Score ≤18/20 → REJECT, go back to Step 1

Step 5: Ingest into repo (future phase)
   └─ Copy accepted PNG to design/app-icon/source/
   └─ Update APP_ICON_MASTER_ASSET_INTAKE.md
   └─ Update APP_ICON_QA_SMALL_SIZE_VALIDATION.md (re-run QA)
   └─ Commit with tag: phase-22d-clean-square-regenerated

   ✅ COMPLETED in Phase 22E:
   - Clean square master ingested: `design/app-icon/source/ai-food-passport-clean-square-master.png`
   - Full QA validation: 21/21 pass (square 1254x1254, RGB opaque, no alpha, no baked-in corners)
   - Phase 22C rounded-corner issue RESOLVED
   - Accepted as preferred future export source
   - 7 preview assets + comparison sheet generated
   - See `APP_ICON_CLEAN_SQUARE_MASTER_INTAKE.md` for full report

Step 6: Apply to Flutter/iOS (future phase, requires macOS)
   └─ Phase 22E or later
   └─ Generate iOS icon set from clean square master
   └─ Apply to AppIcon.appiconset
   └─ Configure flutter_launcher_icons
   └─ Update LaunchScreen.storyboard
```

### 8.2 What NOT To Do

| ❌ Do NOT | Rationale |
|---|---|
| Apply the current (rounded) source to iOS AppIcon.appiconset | Double-masking risk |
| Skip regeneration and use current source anyway | App Store rejection risk; bad iOS rendering |
| Generate rounded-corner version "because it looks nicer" | iOS applies corners automatically — source must be square |
| Add text to "make it clearer" | Apple will reject; unreadable at small sizes |
| Commit regenerated asset without QA | Breaks the verified baseline |

### 8.3 Future Phases After Regeneration

| Phase | Description | Blocker |
|---|---|---|
| **Phase 22E** | Apply clean square master to Flutter + iOS (generate icon set, update `AppIcon.appiconset`, configure `flutter_launcher_icons`) | Requires **macOS + Xcode** |
| **Phase 22F** | Update launch screen (`LaunchScreen.storyboard`) with new icon mark | Requires **macOS + Xcode** |
| **Phase 16B** | Qwen OCR real smoke test | Blocked: needs **real API key** |
| **TestFlight prep** | Certificates, provisioning profiles, Archive & Upload | Blocked: needs **Apple Developer membership ($99/yr) + macOS** |

---

## Appendix A: iOS Icon Corner Radius Reference

For reference — iOS applies these corner radii at render time (points, not pixels):

| Device / Context | Corner Radius (pt) |
|---|---|
| iPhone App Icon (@3x) | 18 pt (~54 px) |
| iPhone App Icon (@2x) | 18 pt (~36 px) |
| iPad App Icon (@2x) | 18 pt (~36 px) |
| App Store Icon (1024 px) | 20% of width (~205 px) |
| Settings Icon | ~4–6 pt |
| Spotlight Icon | ~4–6 pt |

**The exact radius varies by iOS version.** This is why the source asset must be square — iOS handles the rounding.

---

## Appendix B: Current Source vs. Required Source

| Attribute | Current Source (Phase 22B) | Required Source (This Plan) |
|---|---|---|
| **Path** | `design/app-icon/source/ai-food-passport-selected-icon-master.png` | `design/app-icon/source/ai-food-passport-clean-square-master.png` (future) |
| **Dimensions** | 1254 × 1254 px | 1024 × 1024 px (or 2048×2048) |
| **Corners** | ❌ Baked-in rounded (squircle) | ✅ Sharp 90° corners |
| **Transparency** | Unknown (Phase 22C could not confirm) | ✅ Fully opaque background |
| **Format** | PNG, RGB 8-bit | PNG, sRGB, 8-bit (opaque) |
| **Readable at 60px** | ✅ Yes (acceptable) | ✅ Must remain readable |
| **Readable at 40px** | ⚠️ Borderline | ⚠️ Acceptable if same or better |
| **iOS-ready** | ❌ NO (double-masking risk) | ✅ YES (after regeneration) |
| **Status** | Design-source only (portfolio) | Will be: iOS-production-ready (after QA) |

---

*This document is a planning/documentation artifact. No binary assets are created or modified in this phase. The actual clean-square regeneration happens in a future phase (or outside the repo, then ingested).*
