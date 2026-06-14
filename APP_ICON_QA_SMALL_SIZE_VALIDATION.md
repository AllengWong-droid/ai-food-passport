# App Icon QA & Small-Size Validation

> **Phase**: 22C
> **Date**: 2026-06-15
> **Type**: Design QA + preview asset generation — design-only, no config/code changed
> **Depends on**: Phase 22B (Master Asset Intake)
> **Purpose**: Validate the selected icon master as a design-source image and produce small-size preview assets for readability review

---

## Important Honesty Statements

**Before reading this document, understand the current reality:**

- This project is **MVP Alpha / mock-only**. It returns the same 2 hardcoded dishes for every scan.
- **No real AI or OCR providers are enabled.** All Qwen/OpenAI/DeepSeek code sits behind safety gates that are NOT activated.
- **The backend is not production-ready.** `productionReady` remains `false`.
- **The app icon has NOT been applied to Flutter or iOS.** All previews in this document are **design-only** — they are NOT final iOS `AppIcon.appiconset` assets.
- **No Apple certificates or provisioning profiles have been created.**
- **This phase does not change any code, config, secrets, or production flags.**

---

## 1. Purpose

This phase performs **design-source validation** of the selected AI Food Passport app icon master asset:

1. **Validate** the ingested master asset as an acceptable design-source image.
2. **Review** readability at progressively smaller sizes (1024 → 40 px) to identify where details become illegible.
3. **Generate** design-only preview assets at standard iOS icon sizes for visual comparison.
4. **Document** findings, risks, and the acceptance decision.
5. **Do NOT apply** the icon to Flutter, iOS configuration, pubspec.yaml, or launch screen.

---

## 2. Source Asset

### 2.1 Metadata

| Field | Value |
|---|---|
| **File name** | `ai-food-passport-selected-icon-master.png` |
| **Path** | `design/app-icon/source/ai-food-passport-selected-icon-master.png` |
| **Format** | PNG (Portable Network Graphics) |
| **Dimensions** | 1254 × 1254 pixels |
| **File size** | 2,349,686 bytes (~2.24 MB) |
| **Color model** | RGB, 8-bit/channel |
| **Intake date** | 2026-06-15 (Phase 22B) |
| **Selected candidate** | Candidate 1, recolored version |

### 2.2 Visual Summary

| Element | Description |
|---|---|
| **Primary shape** | Royal/cobalt blue passport book with gold corner accents and page edges visible on right side |
| **Central motif** | Crossed golden fork and spoon over a subtle globe grid linework |
| **Color palette** | Deep navy/cobalt blue (#1B2A4A range), warm metallic gold (#D4A843 range), cyan edge glow |
| **Style** | Premium 3D app icon with realistic lighting, soft shadows, and material texture |
| **Baked-in corners** | ⚠️ The source asset has **rounded squircle corners baked into the image** (not a clean square with transparent background) |

### 2.3 Selection Context

The icon was selected in Phase 22A (Candidate Review) and ingested in Phase 22B (Asset Intake):

- **15/16 acceptance criteria passed** (1 deferred: opacity check)
- **0/12 rejection criteria hit**
- Full review documented in [`APP_ICON_CANDIDATE_REVIEW.md`](APP_ICON_CANDIDATE_REVIEW.md)

---

## 3. Generated Preview Assets

All preview assets are stored under `design/app-icon/preview/`. These are **design-only previews** — they are NOT final iOS `AppIcon.appiconset` assets and must NOT be used directly for app submission.

### 3.1 Preview File List

| File | Dimensions | Use Case | File Size |
|---|---|---|---|
| `icon-preview-1024.png` | 1024 × 1024 px | App Store master size reference | *(see below)* |
| `icon-preview-512.png` | 512 × 512 px | iTunes / iPad Pro size reference | *(see below)* |
| `icon-preview-180.png` | 180 × 180 px | iPhone @3x (home screen) size reference | *(see below)* |
| `icon-preview-120.png` | 120 × 120 px | iPhone @2x / Spotlight size reference | *(see below)* |
| `icon-preview-60.png` | 60 × 60 px | Settings / Notifications @2x size reference | *(see below)* |
| `icon-preview-40.png` | 40 × 40 px | Smallest common iOS icon size (@2x) | *(see below)* |
| `icon-small-size-contact-sheet.png` | 1380 × 760 px | All sizes in one grid for side-by-side review | ~780 KB |

> **Important**: All previews were generated using high-quality LANCZOS resampling from the 1254×1254 source. No sharpening, color correction, or additional processing was applied beyond resizing.

### 3.2 Scope Clarification

| What these previews ARE | What these previews are NOT |
|---|---|
| Design-only reference images | Final iOS App Icon.appiconset assets |
| For visual QA and readability review | For direct use in Xcode projects |
| Committed to repository under `design/` | Applied to `ios/AppIcon.appiconset/` |
| Generated programmatically (reproducible) | Hand-crafted production exports |
| Square PNGs (matching source aspect ratio) | Masked/squircle-masked for iOS display |

---

## 4. Small-Size Review

Each preview size was visually inspected for element recognizability, contrast retention, and overall readability. The following table summarizes findings at each size tier.

### 4.1 Per-Size Assessment

#### 1024 px — App Store Master

| Check | Result | Notes |
|---|---|---|
| Passport shape | ✅ Fully recognizable | Book form, spine, pages, corner accents all clear |
| Fork & spoon | ✅ Fully recognizable | Individual tines on fork visible; spoon bowl clear |
| Globe linework | ✅ Clearly visible | Grid lines distinct against blue background |
| Blue/gold contrast | ✅ Excellent | High chromatic separation; gold pops on navy |
| Overall impression | ✅ Premium, professional | Suitable for portfolio showcase |

#### 512 px — iTunes / Large Display

| Check | Result | Notes |
|---|---|---|
| Passport shape | ✅ Fully recognizable | All structural elements intact |
| Fork & spoon | ✅ Fully recognizable | Tines slightly softer but still countable |
| Globe linework | ✅ Clearly visible | Grid lines remain distinct |
| Blue/gold contrast | ✅ Strong | No noticeable degradation from 1024 px |
| Overall impression | ✅ Sharp, professional | No quality concerns at this size |

#### 180 px — iPhone Home Screen (@3x)

| Check | Result | Notes |
|---|---|---|
| Passport shape | ✅ Recognizable | Book form and corner accents clear |
| Fork & spoon | ✅ Recognizable | Crossed utensil silhouette unmistakable |
| Globe linework | ✅ Visible | Grid lines present but finer lines beginning to soften |
| Blue/gold contrast | ✅ Strong | Colors remain well-separated |
| Overall impression | ✅ Good home screen appearance | Would look appropriate on an iPhone |

#### 120 px — Spotlight / @2x

| Check | Result | Notes |
|---|---|---|
| Passport shape | ✅ Recognizable | Rounded book shape identifiable |
| Fork & spoon | ✅ Recognizable | Golden X-shape clearly reads as "utensils" |
| Globe linework | ⚠️ Subtle | Grid lines becoming faint; contributes to texture more than explicit globe reading |
| Blue/gold contrast | ✅ Adequate | Contrast still functional |
| Overall impression | ✅ Acceptable | Works at Spotlight size |

#### 60 px — Settings / Notifications (@2x)

| Check | Result | Notes |
|---|---|---|
| Passport shape | ⚠️ Partially | Blue rounded rectangle with lighter edge visible; "book" reading weaker |
| Fork & spoon | ✅ Recognizable | Golden crossed shape still clearly "utensils" |
| Globe linework | ❌ Lost | Too fine to be perceptible at this size |
| Blue/gold contrast | ✅ Functional | Two-tone color scheme remains effective |
| Overall impression | ⚠️ Borderline | Reads as "blue icon with golden cross" — food/travel association maintained but passport detail lost |

#### 40 px — Smallest Common iOS Size (@2x)

| Check | Result | Notes |
|---|---|---|
| Passport shape | ⚠️ Abstract | Blue rounded blob; book structure not discernible |
| Fork & spoon | ⚠️ Suggestive | Golden diagonal X shape suggests crossed items but individual identity lost |
| Globe linework | ❌ Completely lost | Not visible |
| Blue/gold contrast | ✅ Functional | Color distinction remains even at minimum size |
| Overall impression | ⚠️ Borderline-minimum | Color + basic shape provide brand recognition; fine details fully abstracted |

### 4.2 Readability Threshold Summary

| Size Tier | Verdict | Key Finding |
|---|---|---|
| **1024 – 180 px** | ✅ **Excellent** | All elements readable; professional appearance |
| **120 px** | ✅ **Good** | Core motifs readable; minor detail loss acceptable |
| **60 px** | ⚠️ **Acceptable** | Utensils readable; passport/globe lost; color carries brand |
| **40 px** | ⚠️ **Borderline** | Abstracted to color blob + golden X; smallest viable size |

**Conclusion**: The icon is **acceptable down to 40 px** as a brand identifier (color + shape), but **meaningful detail degrades significantly below 120 px**. This is typical for detailed 3D icons and does NOT constitute a rejection concern — most apps show similar detail loss at sub-60px sizes.

---

## 5. Visual Checks

### 5.1 Core Identity Checks

| # | Check | Result | Detail |
|---|---|---|---|
| 1 | Passport still recognizable | ✅ Yes (down to ~120px) | Blue book shape with corner accents persists through 120px |
| 2 | Fork/spoon still recognizable | ✅ Yes (down to ~60px) | Golden crossed utensils remain identifiable as "food tools" through 60px |
| 3 | Globe linework still visible enough | ⚠️ To ~120px only | Grid lines contribute texture/complexity at 120px; lost by 60px |
| 4 | Blue/gold contrast remains strong | ✅ Yes (all sizes) | Chromatic separation survives even at 40px minimum |
| 5 | Icon still reads as travel + food | ✅ Yes (down to ~60px) | Combined passport + utensils communicate concept effectively above 60px |

### 5.2 Technical Quality Checks

| # | Check | Result | Detail |
|---|---|---|---|
| 6 | No compression artifacts | ✅ Pass | Source is high-quality PNG; LANCZOS resize preserves smoothness |
| 7 | No color banding | ✅ Pass | Gradients render smoothly at all preview sizes |
| 8 | No alpha channel issues | ✅ Pass | RGB mode consistent; no transparency surprises |
| 9 | Aspect ratio preserved | ✅ Pass | All previews maintain exact 1:1 square ratio |
| 10 | No pixelation at target sizes | ✅ Pass | LANCZOS resampling produces clean results; 40px is soft but not artifacted |

### 5.3 Safety Re-check (Post-Resize)

| # | Check | Result | Detail |
|---|---|---|---|
| 11 | No text appears at any size | ✅ Pass | Zero text in any preview |
| 12 | No flags appear at any size | ✅ Pass | Generic passport cover confirmed at all scales |
| 13 | No medical symbols | ✅ Pass | None detected |
| 14 | No brand logos | ✅ Pass | None detected |
| 15 | No inappropriate imagery | ✅ Pass | Clean at all sizes |

---

## 6. Risks & Concerns

### 6.1 Baked-in Rounded Corners ⚠️

**Finding**: The source master PNG has **rounded squircle corners baked into the image data**. The icon is NOT a square PNG with transparent background — it has a dark navy/blue rounded-corner frame with anti-aliased edges.

**Implication for iOS implementation**:
- iOS applies its own **continuous corner radius mask** (squircle) to app icons at runtime.
- If this source is used directly, iOS will mask it again, potentially creating **double-rounded corners** or clipped edges.
- Before final iOS application, the icon should be **re-exported as a clean square PNG** without baked-in corners, OR the corner treatment must be validated on actual device/Simulator.

**Recommendation** (for future Phase 22D):
1. Obtain a **square, non-rounded export** of the same icon design from the original generation tool.
2. Alternatively, crop/extend the current source to fill a full square canvas.
3. Validate the result on macOS/iOS Simulator before committing to `AppIcon.appiconset`.

**Severity**: Medium — not blocking for design-source validation, but MUST be resolved before production icon application.

### 6.2 3D Detail Density at Small Sizes ⚠️

**Finding**: The 3D rendered style includes fine details (texture on the leather cover, highlight reflections on the gold utensils, subtle glow at edges, page-edge layering). These details:
- Enhance premium feel at **1024–180 px**
- Contribute richness at **120 px**
- Become noise/mush at **60–40 px**

**Implication**: At the smallest sizes, the icon's **silhouette and color palette** carry the brand identity, not the fine 3D details. This is expected behavior for photorealistic/3D icons and is consistent with industry norms (e.g., many App Store top apps show similar detail loss at 40px).

**Severity**: Low — informational only. Not a blocker.

### 6.3 Non-Standard Source Dimension ℹ️

**Finding**: The master is **1254×1254 px**, not the standard **1024×1024 px** required for App Store Connect upload.

**Implication**: A future export step will need to:
1. Crop/resize to exactly **1024×1024 px**, AND
2. Address the rounded-corner issue (Section 6.1), AND
3. Verify opacity/transparency requirements for App Store Connect

**Severity**: Low — trivially addressable with any image tool.

### 6.4 No Opacity/Transparency Test Yet ⚠️

**Finding**: The source is **RGB mode** (no alpha channel). The acceptance checklist from Phase 22A had 1 deferred item: opacity check. This phase did not perform a dedicated opacity/transparency test because the source is opaque RGB.

**Implication**: When producing the final square export for iOS, ensure the exported PNG meets App Store Connect requirements:
- sRGB color space
- Opaque (no transparency needed if using full-square fill)
- No alpha channel artifacts

**Severity**: Low — informational. Will be addressed during final export (Phase 22D).

---

## 7. Acceptance Decision

### 7.1 Decision

| Decision | Verdict | Rationale |
|---|---|---|
| **Accepted as portfolio design-source asset?** | ✅ **YES** | The icon passes all safety checks, maintains strong contrast, reads as travel+food at all sizes ≥60px, and matches the accepted design direction from Phase 22A/22B. |
| **Accepted as final iOS production icon?** | ⏸️ **NOT YET** | Requires: (a) square non-rounded re-export, (b) 1024×1024 normalization, (c) iOS Simulator validation, (d) Xcode build verification. These steps require macOS and are planned for Phase 22D. |
| **Rejected?** | ❌ **NO** | Zero rejection criteria triggered. No safety issues found. |

### 7.2 Acceptance Scorecard

| Category | Score | Notes |
|---|---|---|
| Visual identity match | ✅ 5/5 | Matches spec: passport + fork/spoon + globe + blue/gold |
| Safety compliance | ✅ 5/5 | No text/flags/medical/logos at any size |
| Small-size readability | ✅ 4/5 | Good to 120px, acceptable to 40px; 1 pt deduction for 40px abstraction |
| Technical quality | ✅ 5/5 | Clean PNG, good resampling, no artifacts |
| Production readiness | ⏸️ N/A | Design-source only; production requires macOS work |
| **Overall** | **✅ 19/20** | **Accepted as design-source asset** |

### 7.3 Conditions of Acceptance

This acceptance applies **only** to the icon as a **design-source asset** for:
- Portfolio documentation
- Design review and stakeholder feedback
- Future export and production planning
- Reference in technical documentation

It does **NOT** authorize:
- Submission to App Store Connect
- Application to `AppIcon.appiconset`
- Use in marketing materials claiming "production-ready"
- Any claim that the icon has been validated on real iOS devices

---

## 8. Future Implementation

### 8.1 Remaining Steps Before Production Icon

| Step | Action | Phase | Prerequisites |
|---|---|---|---|
| **1. Re-export as square 1024×1024** | Obtain or create a clean square PNG without baked-in rounded corners | Phase 22D | Design tool (Figma/Illustrator/GIMP/ImageMagick) |
| **2. Normalize to sRGB + validate opacity** | Ensure correct color space, check alpha channel | Phase 22D | Square export available |
| **3. Generate full iOS icon set** | Produce all required sizes (29, 40, 58, 60, 80, 87, 120, 140, 180, 1024, etc.) via `iconutil` or `flutter_launcher_icons` | Phase 22D | macOS + Xcode |
| **4. Apply to `AppIcon.appiconset`** | Replace Flutter default icons in Xcode project | Phase 22D | macOS + Xcode |
| **5. Configure `flutter_launcher_icons`** | Add to `pubspec.yaml`, generate adaptive icons for Android | Phase 22D | macOS + Flutter SDK |
| **6. Update launch screen** | Edit `LaunchScreen.storyboard` per spec in `APP_ICON_LAUNCH_SCREEN_SPEC.md` | Phase 22D | macOS + Xcode |
| **7. Build + verify on Simulator** | Confirm icon appearance on home screen, Settings, Spotlight, Notification Center at multiple simulated device types | Phase 22D | macOS + Xcode + iOS Simulator |
| **8. Device validation** (optional) | Verify on physical iPhone/iPad | Post-22D | Physical device + Apple Developer membership |

### 8.2 What Was Completed in This Phase

| ✅ Done | Method |
|---|---|
| Validated source asset metadata (dimensions, format, size) | Python PIL inspection |
| Generated 6 sized preview images (1024, 512, 180, 120, 60, 40 px) | Python PIL LANCZOS resize |
| Created contact sheet for side-by-side comparison | Python PIL composite rendering |
| Visually inspected all sizes for readability | Manual visual review |
| Documented risks (baked-in corners, 3D density, dimensions) | This document |
| Recorded acceptance decision (design-source only) | Section 7 |

### 8.3 What Requires macOS

All steps in Section 8.1 require **macOS with Xcode installed**. None of those steps were performed in this phase. The current environment is Windows-only.

---

## 9. Decision Log

| # | Decision | Rationale | Date | Phase |
|---|---|---|---|---|
| 1 | Generate preview assets at 7 sizes (source + 6 downscales) | Needed to evaluate small-size readability before committing to production path | 2026-06-15 | 22C |
| 2 | Create contact sheet grid image | Side-by-side comparison is essential for spotting detail degradation patterns | 2026-06-15 | 22C |
| 3 | Accept icon as design-source asset (19/20 score) | All safety checks pass; readability adequate to 40px; matches approved design direction | 2026-06-15 | 22C |
| 4 | Defer final production acceptance until macOS + square re-export | Baked-in rounded corners and non-standard dimensions must be resolved first | 2026-06-15 | 22C |
| 5 | Flag rounded-corner issue as MEDIUM severity for Phase 22D | Double-masking risk could cause clipping or visual artifacts on iOS | 2026-06-15 | 22C |
| 6 | Do NOT apply icon to Flutter/iOS in this phase | Scope is QA + preview generation only; application is Phase 22D | 2026-06-15 | 22C |

---

*This document records the QA validation of the AI Food Passport app icon master asset as a design-source image. The icon is accepted for portfolio/design purposes with conditions. It is NOT accepted as a final iOS production icon. No code, config, secrets, or production flags were changed in this phase. The next step requiring action is Phase 22D: Icon Application (requires macOS + Xcode).*
