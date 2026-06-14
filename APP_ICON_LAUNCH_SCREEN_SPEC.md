# App Icon & Launch Screen Design Spec

> **Phase**: 21I
> **Date**: 2026-06-14
> **Type**: Design specification only — no binary assets generated, no config changed
> **Depends on**: Phase 21H (Privacy Policy Public URL Verification)
> **Purpose**: Prepare visual identity specification for future TestFlight/App Store work

---

## Important Honesty Statements

**Before reading this document, understand the current reality:**

- This project is **MVP Alpha / mock-only**. It returns the same 2 hardcoded dishes for every scan.
- **No real AI or OCR providers are enabled.** All Qwen/OpenAI/DeepSeek code sits behind safety gates that are NOT activated.
- **The backend is not production-ready.** `productionReady` remains `false`.
- **No binary image assets have been generated or changed.** This is a specification document.
- **No Flutter code has been changed.**
- **No iOS config has been changed.**
- **No Mac/Xcode build has been performed.**
- **No Apple Developer Program membership has been purchased.**
- **This is NOT final production artwork.** It is a design direction spec for a future visual identity phase.

---

## 1. Purpose

This document defines the visual identity direction for AI Food Passport to prepare for future TestFlight and App Store submission phases.

| Scope | In this document | NOT in this document |
|---|---|---|
| Icon concept and color palette | ✅ Yes | — |
| Launch screen layout and composition | ✅ Yes | — |
| App Store screenshot visual guidance | ✅ Yes | — |
| Copy-safe caption ideas | ✅ Yes | — |
| Asset checklist and dimensions | ✅ Yes | — |
| Future implementation steps | ✅ Yes | — |
| Actual image generation | — | ❌ No |
| Binary PNG/asset export | — | ❌ No |
| iOS config changes | — | ❌ No |
| Flutter code changes | — | ❌ No |
| Final production artwork | — | ❌ No |

This spec serves as the **single source of truth** for the visual identity direction. When a future phase generates actual assets, it should reference this document for colors, composition, and constraints.

---

## 2. App Identity Summary

| Field | Value | Source |
|---|---|---|
| **App Store name** | AI Food Passport | Phase 21D (Section 3) |
| **iOS display name** (`CFBundleDisplayName`) | AI Food Passport | Phase 21D (Section 3) |
| **iOS bundle name** (`CFBundleName`) | Food Passport | Phase 21D (Section 4) |
| **App Store subtitle** | Scan Menus. Eat Safely. | Phase 21D (Section 8) |
| **Bundle ID** | `com.<yourdomain>.aifoodpassport` | Phase 21D (Section 5) |
| **Primary category** | Travel | Phase 21D (Section 7) |
| **Secondary category** | Food & Drink | Phase 21D (Section 7) |

All visual identity work should align with these decisions. The icon and launch screen should reinforce "travel + food + safety awareness" without overclaiming.

---

## 3. Brand Positioning

### 3.1 What AI Food Passport Is

| Positioning | Detail |
|---|---|
| **Product type** | Travel utility app |
| **Core function** | Menu scanning, translation, allergen awareness |
| **Primary audience** | Travelers eating abroad |
| **Tone** | Trustworthy, helpful, globally-minded |
| **Key emotion** | Confidence — "I know what I'm ordering" |

### 3.2 What AI Food Passport Is NOT

| ❌ NOT | ✅ Instead |
|---|---|
| Medical device / health app | Travel utility with allergen awareness support |
| Food safety certification tool | Informed choices — always check with restaurant staff |
| Certified allergen detector | Allergen flagging is for guidance only |
| Government-issued document | Passport is a metaphor for travel food confidence |
| Restaurant review platform | Personal menu understanding tool |

These positioning boundaries must be reflected in every visual asset — icon, launch screen, screenshots, and marketing materials.

---

## 4. Icon Concept

### 4.1 Core Metaphor

**Primary concept: Passport booklet + fork/spoon crossing**

The passport shape (rounded rectangle with a dark cover) instantly signals "travel." Crossed fork and spoon (or fork + chopsticks for cultural flexibility) signal "food." Together they form the core metaphor: a food passport.

```
Visual structure (conceptual):

   ┌──────────────┐
   │ ╔══════════╗ │  ← Deep navy passport cover
   │ ║  🍴 🥢  ║ │  ← Gold fork/spoon (or fork/chopsticks) crossing
   │ ║          ║ │     centered on passport
   │ ╚══════════╝ │  ← Rounded passport corners
   └──────────────┘
```

### 4.2 Alternative / Secondary Option

**Passport booklet + menu card with a subtle scan frame**

A smaller menu card placed in front of the passport cover, with a thin scan-line or corner brackets suggesting the scanning function.

### 4.3 What to Include

| ✅ Include | Rationale |
|---|---|
| Passport shape (dark rounded rectangle) | Instant "travel" recognition |
| Fork/spoon crossing (or fork/chopsticks) | Clean "food" signal |
| Subtle gold accent (stamp or emblem line) | Warmth, premium feel |
| High-contrast silhouette | Readable at 40x40pt and below |

### 4.4 What to Exclude (Hard Constraints)

| ❌ Exclude | Rationale |
|---|---|
| **National flags** | The app is for all travelers, not one country. Flags cause political and market confusion. |
| **Real restaurant logos** | Trademark risk. No recognizable restaurant branding. |
| **Medical cross / hospital imagery** | Misleading — the app is not medical. Avoid red crosses, green plus signs, or caduceus symbols. |
| **"100% safe" shields or checkmarks** | Overclaiming — the app cannot guarantee food safety. |
| **Certification badges / stamps implying food safety authority** | Misleading — no regulatory body certifies this app. |
| **AI/robot icons** | The icon should represent the *outcome* (understanding food while traveling), not the *technology* (AI). Avoid overclaiming AI capability. |
| **Camera icons** | Scanning is a feature, not the brand. Camera icons are generic and don't differentiate. |
| **Globe icons** | Too similar to Safari, maps, and translation apps. Not distinctive. |
| **Tiny text** | Text at icon sizes is unreadable. Let the shape and colors do the work. |
| **Complex gradients** | Gradients that rely on subtle color transitions may not survive resizing to 20x20pt. Prefer solid colors with sharp contrast. |

---

## 5. Color Direction

### 5.1 Primary Palette

| Role | Color | Hex | Rationale |
|---|---|---|---|
| **Primary background** | Deep Navy | `#1B2A4A` | Passport cover color; professional, travel-associated, authoritative |
| **Primary accent** | Warm Gold | `#D4A843` | Passport stamp/emblem color; warmth, premium, food-friendly |
| **Secondary background** | Off-White / Warm Ivory | `#FFF8F0` | Menu-like warmth; readable against navy; not harsh pure white |
| **Text on dark** | White | `#FFFFFF` | High contrast on navy background |
| **Text on light** | Dark Navy | `#1B2A4A` | Consistent with primary brand color |

### 5.2 Contrast Requirements

- **Navy (`#1B2A4A`) + Gold (`#D4A843`)**: Contrast ratio ≈ 6.1:1 — meets WCAG AA for normal text
- **Navy (`#1B2A4A`) + White (`#FFFFFF`)**: Contrast ratio ≈ 12.6:1 — exceeds WCAG AAA
- **Off-White (`#FFF8F0`) + Navy (`#1B2A4A`)**: Contrast ratio ≈ 12.0:1 — exceeds WCAG AAA

### 5.3 What to Avoid

| ❌ Avoid | Rationale |
|---|---|
| Default Flutter blue (`#0553B1`) | Already associated with the generic Flutter "F" logo; not distinctive |
| Bright green | Associated with "safe/approved" — misleading for allergen guidance |
| Medical red | Associated with emergency/cross — misleading |
| Pastel / low-contrast palettes | Won't survive small icon sizes or App Store thumbnail display |

---

## 6. Shape and Composition

### 6.1 Shape Guidance

| Principle | Detail |
|---|---|
| **Silhouette-first** | The icon should be recognizable from its silhouette alone. If you squint and can't tell what it is, simplify. |
| **Simple geometry** | Passport = rounded rectangle. Fork/spoon = simple line art. No more than 3-4 distinct shapes. |
| **Bold lines** | Fork and spoon should use thick strokes (not hairline) so they remain visible at 20x20pt. |
| **Generous padding** | Leave at least 10% padding on all sides of the icon within the square canvas. The passport shape should NOT touch the edges. |
| **No tiny text** | Text below ~8pt is unreadable on a 40x40pt icon. Use shape and color instead. |
| **No complex gradients** | Flat colors or 2-tone shading at most. Gradient complexity gets lost at small sizes. |

### 6.2 Composition Guide

```
Icon canvas: 1024x1024 px (square)
Safe zone: inner 820x820 px (80% of canvas)

Option A — Centered passport booklet:
  - Passport cover fills ~60% of safe zone width
  - Fork and spoon cross at center, overlapping passport
  - Small gold accent line or emblem at bottom of passport

Option B — Passport + menu card overlay:
  - Passport at slight angle (5-10 degrees) for visual interest
  - Menu card centered on top, with scan corner brackets
  - Fork/spoon smaller, placed on menu card
```

### 6.3 Size Legibility

Apple requires app icons at these sizes. The design MUST remain recognizable at the smallest size.

| Size | Where Used | Legibility Check |
|---|---|---|
| 1024x1024 pt | App Store | Full detail visible |
| 180x180 pt | iPhone 60pt @3x | Fork/spoon clearly visible |
| 120x120 pt | iPhone 60pt @2x, 40pt @3x | Passport shape recognizable |
| 80x80 pt | iPad 40pt @2x, 20pt @4x | Passport silhouette still reads as passport |
| 60x60 pt | iPhone 20pt @3x | Must still look like "something" not "blob" |
| 40x40 pt | iPhone 20pt @2x, iPad 20pt @2x | Minimum: silhouette distinguishable |
| 29x29 pt | Settings icon | Only color + rough shape matters |

**Test**: Zoom out a 1024x1024 mockup to 29x29 pt. If it looks like a colored blob, simplify until the passport silhouette is readable.

---

## 7. App Icon Asset Checklist

### 7.1 Source Master

| Asset | Specification | Status |
|---|---|---|
| **Icon source master** | 1024x1024 px, PNG, sRGB, no transparency (App Store requires opaque) | ❌ Not created (design spec only) |
| **Vector source file** | AI / SVG / Figma — editable, layered | ❌ Not created |
| **Square canvas** | 1024x1024 px, centered composition | ❌ Not created |

### 7.2 iOS Icon Sizes (Flutter auto-generation)

When the source master is ready, Flutter's `flutter_launcher_icons` package or Xcode asset catalog can generate these automatically. Manual export is not recommended — use tooling.

| Size | Scale | Usage | Generated From |
|---|---|---|---|
| 1024x1024 | @1x | App Store (upload separately) | Source master |
| 180x180 | @3x | iPhone 60pt | Auto from source |
| 120x120 | @2x | iPhone 60pt, Settings 40pt@3x | Auto from source |
| 80x80 | @2x | iPad 40pt, Spotlight 40pt | Auto from source |
| 60x60 | @3x | iPhone 20pt | Auto from source |
| 40x40 | @2x | iPhone 20pt, iPad 20pt | Auto from source |
| 29x29 | @1x | Settings | Auto from source |

### 7.3 Rounded Corners

**Do NOT bake rounded corners into the source image.** iOS automatically applies the appropriate corner radius for each device. Pre-rounding in the source will result in double-rounding and an incorrect appearance.

### 7.4 Light/Dark Background Legibility

The icon must be legible on both light and dark backgrounds (iOS home screen supports both).

| Background | Issue | Solution |
|---|---|---|
| Light mode (white/gray) | Gold accent may fade into light background | Use navy as the dominant color; the icon reads dark-on-light |
| Dark mode (black/dark gray) | Navy may blend into dark background | Add a subtle gold outline or stroke around the passport shape for dark mode separation |
| Widget / notification | Small sizes, varied backgrounds | Silhouette approach ensures visibility regardless of context |

**Recommendation**: Design the icon with a dark (navy) dominant fill and gold accent. On dark backgrounds, the gold accent provides sufficient contrast. If needed, a 1-2px gold stroke around the passport outline ensures dark-mode legibility without needing a separate icon variant.

---

## 8. Launch Screen Concept

### 8.1 Design Principle

Per Apple's Human Interface Guidelines (HIG), the launch screen should **mirror the first frame of the app** — not be a branding splash screen. It creates the perception of instant launch.

### 8.2 Recommended Layout

```
┌────────────────────────────┐
│                            │
│      Deep Navy (#1B2A4A)   │
│                            │
│                            │
│         ┌──────┐           │
│         │ Icon │           │  ← Simplified icon mark (~80pt)
│         │ Mark │           │     Gold/white, no text in mark
│         └──────┘           │
│                            │
│      AI Food Passport      │  ← App name in white, system font
│                            │     ~20pt, centered below icon
│     Scan Menus.            │  ← Optional: subtitle in gold
│     Eat Safely.            │     ~14pt, lighter weight
│                            │
│                            │
│                            │
└────────────────────────────┘
```

### 8.3 Elements

| Element | Detail |
|---|---|
| **Background** | Solid deep navy (`#1B2A4A`), full screen |
| **Center icon mark** | Simplified version of the app icon (~80pt), centered vertically with slight upward offset (accounting for status bar) |
| **App name** | "AI Food Passport" in white, system font (SF Pro Display), ~20pt, centered below icon mark |
| **Optional subtitle** | "Scan Menus. Eat Safely." in gold (`#D4A843`), ~14pt, lighter weight, centered below app name |

### 8.4 What to Exclude

| ❌ Exclude | Rationale |
|---|---|
| **Loading spinners / activity indicators** | Apple HIG explicitly discourages spinners on launch screens |
| **Progress bars** | Launch screen is static — iOS handles the transition animation |
| **Animations** | `LaunchScreen.storyboard` is a static UIView — animations don't render here |
| **"Loading..." text** | Pointless — the user knows the app is launching |
| **Version numbers** | Clutter; not appropriate for a launch screen |
| **Legal disclaimers** | Not the place — put these in the app or privacy policy |
| **Splash-screen style delays** | The launch screen should appear only for the brief instant before the app's first frame renders |

### 8.5 Implementation Note

The launch screen is implemented in `ios/Runner/LaunchScreen.storyboard`. It uses UIKit views (UIImageView, UILabel) placed on a UIView background. No Flutter code is involved. This file must be edited in Xcode's Interface Builder or manually in XML/Storyboard source.

**Current status**: The `LaunchScreen.storyboard` is the Flutter default — a plain white background with no branding. It is functional but unbranded.

---

## 9. App Store Screenshot Visual Guidance

### 9.1 Source Material

Existing MVP Alpha screenshots are available in `docs/screenshots/mvp-alpha/` (captured in Phase 18B). These are the **only** screenshots that exist and should be used as reference. Do not generate new screenshots in this phase.

### 9.2 General Screenshot Rules

| Rule | Detail |
|---|---|
| **Device frames** | Apple requires screenshots without device bezels for App Store Connect. Device frames are NOT needed. |
| **Status bar** | Clean status bar (full battery, full signal, 9:41 AM) is the Apple convention. This can be achieved with iOS Simulator `xcrun simctl status_bar`. |
| **Background** | Show the actual app UI — no Photoshop compositing. |
| **Captions** | Caption text is added in App Store Connect (not baked into the image). Keep captions short and benefit-led. |
| **Count** | Minimum 3 screenshots, maximum 10. 5-6 is typical. |

### 9.3 Honesty in Screenshots

Screenshots must reflect the **current MVP Alpha reality** — not a future production version.

| ❌ Do NOT show | ✅ Show instead |
|---|---|
| Real-time OCR results with accurate text | Mock results with the 2 hardcoded dishes (clearly labeled as demo/mock if context allows) |
| "Production-ready" in any caption or overlay | No production-readiness claims |
| Real AI provider logos or badges | No provider branding |
| Firestore / Firebase indicators | No backend technology branding |

---

## 10. Copy-Safe Screenshot Caption Ideas

These captions are **safe to use** in the current MVP Alpha state. They describe what the app does without overclaiming about production readiness, AI accuracy, or food safety guarantees.

### 10.1 Core Captions (Primary Set)

| # | Caption | Target Screenshot | Why It's Safe |
|---|---|---|---|
| 1 | **Scan a menu** | Scan screen | Factual — the app has a scan flow |
| 2 | **Understand dishes faster** | Processing overlay → Results | Claims speed, not accuracy |
| 3 | **Flag possible allergens** | Results screen with allergen badge | "Possible" — not "guaranteed" |
| 4 | **Compare prices** | Dish detail with price conversion | Factual — mock price conversion exists |
| 5 | **Travel with more context** | Profile / Traveler settings | Vague benefit — no overclaim |

### 10.2 Extended Captions (Secondary Set)

| # | Caption | Target Screenshot | Why It's Safe |
|---|---|---|---|
| 6 | **Set your dietary preferences** | Profile screen (allergies/taste) | Factual — settings exist |
| 7 | **See dishes in your language** | Results screen (translated text) | The mock results do present in user's language |
| 8 | **Know before you order** | Results screen | "Know" = information, not "guarantee" |
| 9 | **Your food confidence companion** | Any | "Confidence" = emotional benefit, not safety claim |
| 10 | **Explore menus everywhere** | Any with passport visual | "Explore" = discovery, not guarantee |

### 10.3 Caption Length Constraints

App Store Connect limits:
- **Screenshot caption**: Not displayed on the product page — only for accessibility and search.
- **Promotional text**: 170 characters (appears above screenshots).
- **Full description**: 4,000 characters.

---

## 11. What NOT to Claim Visually

### 11.1 Absolutely Forbidden Claims

These claims must NEVER appear in any visual asset, screenshot caption, App Store description, marketing material, or support page — **at any stage, including future production**.

| ❌ Forbidden Claim | Why |
|---|---|
| "Guaranteed safe food choices" | The app cannot guarantee food safety. This is a legal liability. |
| "Medically reliable allergy detection" | The app is not a medical device. FDA/regulatory issues. |
| "Doctor-approved allergen screening" | No medical authority has approved this app. |
| "100% allergen detection" | Impossible — restaurant ingredient transparency varies. |
| "Certified food safety tool" | No certification exists for this app. |
| "Replace your epinephrine auto-injector" | Dangerous medical advice. |

### 11.2 Forbidden Claims for MVP Alpha / Mock-Only Phase

These claims must NOT appear while the app is in mock-only mode. They become permissible only AFTER real AI providers are enabled, tested, and `productionReady` is `true`.

| ❌ Forbidden in Mock Phase | When It Becomes Allowed |
|---|---|
| "Real AI provider enabled" | After Phase 16B-16D real smoke tests pass |
| "Production-ready" | After `productionReady` is set to `true` and backend is production-deployed |
| "App Store ready" | After all TestFlight criteria pass and App Store submission is prepared |
| "Real AI-powered translation" | After real OCR + analysis providers are enabled and verified |
| "Powered by [real provider name]" | After the specific provider is active in production |

### 11.3 Always-Required Disclaimers

Even in production, the following disclaimers must be present:

- "This app provides allergen awareness support, not medical advice."
- "Always confirm allergens directly with restaurant staff."
- "Menu translation accuracy depends on image quality and the AI provider used."

---

## 12. Future Implementation Steps

### 12.1 When to Proceed

Do NOT proceed with icon generation or launch screen editing until:
1. macOS with Xcode is available
2. Apple Developer Program membership is active (optional for local testing, required for TestFlight)
3. At least one successful iOS build exists
4. The Privacy Policy URL is live (✅ already done — Phase 21G/21H)

### 12.2 Icon Generation Flow

| Step | Action | Tool | Phase |
|---|---|---|---|
| 1 | Create vector icon concept matching this spec | Figma / Illustrator / Sketch | Future: visual design phase |
| 1a | **Use the prompt pack** — Ready-to-use AI image generation prompts for icon candidates are available in `APP_ICON_PROMPT_PACK.md` (Phase 21J). Generate 4-8 candidates per concept, then review against the acceptance checklist. | Image generation tool (DALL-E, Midjourney, Stable Diffusion, ImageGen) | Future: visual design phase |
| 2 | Export 1024x1024 PNG (opaque, sRGB) | Design tool export | Future: visual design phase |
| 3 | Verify legibility at all sizes (zoom test) | Manual review | Future: visual design phase |
| 4 | Configure `flutter_launcher_icons` in `pubspec.yaml` | Flutter | Future: Flutter config phase |
| 5 | Run `flutter pub run flutter_launcher_icons` | Flutter CLI | Future: Flutter build phase |
| 6 | Verify generated icons in `ios/Runner/Assets.xcassets/AppIcon.appiconset/` | Manual review | Future: verification phase |
| 7 | Upload 1024x1024 PNG to App Store Connect | App Store Connect | Future: App Store submission |

### 12.3 Launch Screen Flow

| Step | Action | Tool | Phase |
|---|---|---|---|
| 1 | Open `ios/Runner.xcworkspace` in Xcode | Xcode | Future: macOS/Xcode phase |
| 2 | Edit `LaunchScreen.storyboard` in Interface Builder | Xcode IB | Future: macOS/Xcode phase |
| 3 | Set background color to navy (`#1B2A4A`) | Xcode IB | Future: macOS/Xcode phase |
| 4 | Add UIImageView with simplified icon mark, centered | Xcode IB | Future: macOS/Xcode phase |
| 5 | Add UILabel with "AI Food Passport", centered below icon | Xcode IB | Future: macOS/Xcode phase |
| 6 | Build and verify launch screen on iOS Simulator | Xcode | Future: verification phase |
| 7 | Verify no loading spinners or progress indicators | Manual review | Future: verification phase |

### 12.4 Screenshot Production Flow

| Step | Action | Tool | Phase |
|---|---|---|---|
| 1 | Build the app on iOS Simulator | Xcode + Flutter | Future: iOS build phase |
| 2 | Capture screenshots at required resolutions | `xcrun simctl io booted screenshot` | Future: iOS build phase |
| 3 | Apply clean status bar (`9:41 AM`, full battery) | `xcrun simctl status_bar` | Future: iOS build phase |
| 4 | Add captions in App Store Connect (not baked into images) | App Store Connect | Future: App Store submission |
| 5 | Upload 3-10 screenshots per device size | App Store Connect | Future: App Store submission |

---

## 13. Decision Log

| # | Decision | Rationale | Phase |
|---|---|---|---|
| 1 | This phase is **design-spec only** — no assets generated | No macOS, no Xcode, no Apple Developer membership. Creating binary assets now with no way to verify them on iOS is wasteful. | Phase 21I |
| 2 | Icon concept: **passport booklet + fork/spoon crossing** | Selected in Phase 21D (Section 12). Reconfirmed here. Aligns with "food passport" brand. | Phase 21D / 21I |
| 3 | Colors: **deep navy + warm gold + off-white** | Selected in Phase 21D (Section 12.2). Reconfirmed here with specific hex values and contrast ratios. | Phase 21D / 21I |
| 4 | **No rounded corners baked into icon source** | iOS applies corner radii automatically. Pre-rounding causes double-rounding. | Phase 21I |
| 5 | **No loading spinners on launch screen** | Per Apple HIG. Launch screen should mirror the app's first frame — static, no progress indicators. | Phase 21I |
| 6 | **No app assets changed** | This is a spec document. No Flutter code, iOS config, or binary image files were modified. | Phase 21I |
| 7 | **No iOS config changed** | Bundle ID, display name, and other iOS settings remain at their current placeholder values. | Phase 21I |
| 8 | **Existing screenshots preserved** | The 7 MVP Alpha screenshots in `docs/screenshots/mvp-alpha/` are unchanged. This spec provides future guidance only. | Phase 21I |
| 9 | **App Store metadata draft updated** | `APP_STORE_METADATA_DRAFT.md` Section 13 (Required Assets) now references this spec for the icon and launch screen rows. | Phase 21I |
| 10 | **No secrets, keys, or credentials added** | No API keys, tokens, Firebase config, or other credentials were introduced. | Phase 21I |

---

## Appendix A: Icon Silhouette Test

When a mockup is available, apply this test:

1. **Convert to pure black and white** (threshold at 50%).
2. **Scale to 29x29 pt** (smallest iOS icon size).
3. **Ask a person unfamiliar with the project**: "What is this?"

Acceptable answers:
- "A book or passport with a fork"
- "Something about food and travel"
- "A passport with eating utensils"

Unacceptable answers:
- "I don't know"
- "A blob"
- "Some kind of app"

If the answer is unacceptable, simplify: thicker lines, fewer elements, stronger contrast.

---

## Appendix B: Reference Dimensions

### App Icon (iOS)

| Device | Icon Size (pt) | @1x (px) | @2x (px) | @3x (px) |
|---|---|---|---|---|
| iPhone (App) | 60x60 | 60 | 120 | 180 |
| iPad Pro (App) | 83.5x83.5 | — | 167 | — |
| iPad / iPad mini (App) | 76x76 | 76 | 152 | — |
| App Store | 1024x1024 | 1024 | — | — |
| Spotlight (iPhone) | 40x40 | 40 | 80 | 120 |
| Spotlight (iPad) | 40x40 | 40 | 80 | — |
| Settings (iPhone) | 29x29 | 29 | 58 | 87 |
| Settings (iPad) | 29x29 | 29 | 58 | — |
| Notification (iPhone) | 20x20 | 20 | 40 | 60 |
| Notification (iPad) | 20x20 | 20 | 40 | — |

### Launch Screen

| Device | Resolution (px) |
|---|---|
| iPhone 15 Pro Max | 1290 x 2796 |
| iPhone 15 Pro | 1179 x 2556 |
| iPhone 15 | 1170 x 2532 |
| iPhone SE (3rd gen) | 750 x 1334 |
| iPad Pro 12.9" | 2048 x 2732 |

---

*This document is a forward-looking design specification. No binary assets have been generated or changed. All iOS config, Flutter code, and existing files remain unmodified. This spec should be referenced when a future "apply visual identity" phase is executed on a macOS build machine with an active Apple Developer Program membership.*
