# App Icon Prompt Pack & Asset Generation Plan

> **Phase**: 21J
> **Date**: 2026-06-14
> **Type**: Prompt documentation — no binary assets generated, no config changed
> **Depends on**: Phase 21I (App Icon & Launch Screen Design Spec)
> **Purpose**: Prepare safe, reusable AI image-generation prompts for the AI Food Passport app icon and related visual assets

---

## Important Honesty Statements

**Before using these prompts, understand the current reality:**

- This project is **MVP Alpha / mock-only**. It returns the same 2 hardcoded dishes for every scan.
- **No real AI or OCR providers are enabled.** All Qwen/OpenAI/DeepSeek code sits behind safety gates that are NOT activated.
- **The backend is not production-ready.** `productionReady` remains `false`.
- **No binary image assets have been generated in this phase.** This document contains prompts only.
- **No Flutter code, iOS config, or existing assets have been changed.**
- **These prompts are for future use.** No image generation tool has been invoked in this phase.

---

## 1. Purpose

This document provides **ready-to-use AI image generation prompts** for creating the AI Food Passport app icon and related visual assets. These prompts are designed to be fed into text-to-image generators (e.g., DALL-E, Midjourney, Stable Diffusion, or WorkBuddy's built-in ImageGen tool) to produce icon candidates that align with the design specification in `APP_ICON_LAUNCH_SCREEN_SPEC.md`.

| Scope | In this document | NOT in this document |
|---|---|---|
| Primary icon prompt (English + Chinese) | ✅ Yes | — |
| Alternative concept prompts | ✅ Yes | — |
| Negative prompt / exclusion list | ✅ Yes | — |
| Launch screen concept prompt | ✅ Yes | — |
| Export and future implementation plan | ✅ Yes | — |
| Acceptance and rejection checklists | ✅ Yes | — |
| Generated images | — | ❌ No |
| Binary PNG/SVG assets | — | ❌ No |
| App icon file replacements | — | ❌ No |

---

## 2. Brand Summary (for Prompt Context)

Every prompt should encode or imply the following identity:

| Attribute | Value |
|---|---|
| **Product name** | AI Food Passport |
| **iOS display name** | Food Passport |
| **Category** | Travel utility |
| **Core function** | Menu scanning, dish translation, allergen awareness support |
| **Tone** | Trustworthy, helpful, calm, globally-minded |
| **Visual metaphor** | Travel passport + dining/food |
| **NOT** | Medical device, food safety certification, restaurant review platform |

---

## 3. Primary Icon Prompt

### 3.1 English Prompt (Recommended)

```
A clean, minimalist iOS app icon design featuring a dark navy blue passport booklet with rounded corners, centered on the canvas. Crossing over the passport are simple, elegant gold-colored fork and spoon silhouettes with bold, thick strokes. The composition is symmetrical, centered, and highly legible at small sizes. The background behind the passport is a warm off-white or soft ivory tone. The overall style is flat vector illustration with solid fills, no gradients, no shadows, no gradients, no tiny text, no national flags, no medical crosses, no restaurant logos, no AI robot icons, no camera icons, no globe icons. The icon fills the square canvas with generous padding. High contrast, simple shapes, recognizable silhouette. App icon style, square format, clean and modern.
```

### 3.2 Chinese Prompt (Alternative)

```
一个简洁的 iOS 应用图标设计：深海军蓝护照本，圆角，居中放置。护照上交叉着一对简洁的金色餐叉和餐勺剪影，线条粗壮清晰。构图对称、居中，在小尺寸下依然可辨识。护照背景为暖白或象牙色。整体风格为扁平矢量插图，纯色填充，无渐变，无阴影，无细碎文字，无国旗，无医疗十字，无餐厅标志，无 AI 机器人图标，无相机图标，无地球图标。图标填满方形画布并留有适当边距。高对比度，形状简洁，剪影可辨识。应用图标风格，正方形格式，干净现代。
```

### 3.3 Key Parameters

| Parameter | Value / Note |
|---|---|
| **Style** | Flat vector illustration, app icon |
| **Composition** | Centered, symmetrical, square canvas |
| **Colors specified** | Navy blue (passport), gold (fork/spoon), off-white (background) |
| **No text** | Explicitly excluded — meaning comes from shapes only |
| **No rounded corners** | Leave corners square — iOS applies rounding automatically |
| **Resolution hint** | 1024x1024 px target output |

---

## 4. Alternative Icon Prompts

### 4.1 Concept B: Passport + Menu Card

```
A clean iOS app icon showing a dark navy blue passport booklet slightly angled (5-10 degrees), with a white or cream-colored menu card centered on top of it. On the menu card, a subtle gold scan frame (thin corner brackets, not a full rectangle). A small gold fork and spoon sit on the menu card. The background is soft off-white. Flat vector style, no text, no flags, no medical symbols, no gradients. Symmetrical, centered, square format, high contrast.
```

### 4.2 Concept C: Passport + Scan Frame

```
A bold, minimalist iOS app icon: a dark navy passport booklet seen from above, centered. Overlaid on the passport cover is a thin gold scan-line or corner-bracket frame, suggesting a scanning function. Inside the frame area, simple fork and spoon outlines in gold. The passport has a subtle gold emblem line near the bottom (like a passport stamp element). Clean flat vector art, no text, no flags, high contrast, square format, app icon style.
```

### 4.3 Concept D: Fork/Spoon + Travel Stamp (No Passport Book)

```
A minimalist iOS app icon: a large, bold gold fork and spoon crossing at center, forming an X-shape, against a deep navy blue circular stamp or seal. The stamp has a subtle serrated or dotted edge (like a passport entry stamp). Small off-white accent dots around the stamp edge. No passport booklet — the stamp itself is the focal point. Flat vector style, high contrast, no text, simple shapes, iconic and distinct at small sizes.
```

### 4.4 Concept E: Chopsticks Variant (Asian Food Context)

```
A clean iOS app icon design: a deep navy blue passport booklet centered on canvas. Crossing over the passport are simple, elegant gold-colored chopsticks, held together near the top, forming a subtle V-shape. A small gold fork outline sits below the chopsticks. The composition is centered and symmetrical. Off-white background. Flat vector illustration, no text, no flags, no gradients. App icon style, square format, simple and modern.
```

---

## 5. Negative Prompt List

The following elements must ALWAYS be excluded from generated icons. Append this negative prompt to every generation request.

### 5.1 Full Negative Prompt (English)

```
no text, no letters, no words, no typography, no numbers,
no national flags, no country flags, no flag symbols,
no brand logos, no restaurant logos, no company logos,
no medical cross, no red cross, no green cross, no hospital symbols, no caduceus,
no guarantee symbols, no checkmark badges, no safety shields, no certification stamps,
no photo-realistic food, no photographs, no realistic textures,
no AI robot icons, no brain icons, no circuit board patterns,
no camera icons, no lens symbols, no shutter symbols,
no globe icons, no world map, no earth symbols,
no complex gradients, no 3D render, no shadows, no glossy effects,
no cluttered compositions, no collages, no multiple small elements,
no people, no faces, no hands, no human figures,
no chopsticks-only (fork or fork+spoon must be present unless chopsticks variant specified),
no tiny details that disappear at 29x29 pixels
```

### 5.2 Negative Prompt (Chinese — Short Form)

```
无文字，无字母，无语词，无数字，
无国旗，无品牌标志，无餐厅标志，
无医疗十字，无医院符号，
无安全认证标志，无担保印章，
无写实食物照片，无真实材质贴图，
无 AI 机器人，无大脑图标，无电路板图案，
无相机图标，无地球图标，
无复杂渐变，无 3D 渲染，无阴影，无光泽效果，
无杂乱构图，无人物，无面部
```

---

## 6. Launch Screen Concept Prompt

### 6.1 English Prompt

```
A minimal mobile app launch screen design: solid deep navy blue (#1B2A4A) background filling the entire frame. Centered in the upper-middle area is a small (~80pt), simplified version of a passport booklet icon with a gold fork and spoon crossing over it — the app icon mark, rendered cleanly. Below the icon, the text "AI Food Passport" in white, using a clean sans-serif system font, approximately 20pt size. Below that, optionally, "Scan Menus. Eat Safely." in warm gold (#D4A843), smaller and lighter weight. The overall feel is calm, professional, and travel-utility oriented. No loading spinners, no progress bars, no animations, no version numbers, no disclaimers. Static, minimal, mirrors the app's first frame.
```

### 6.2 Key Differences from Icon Prompt

| Aspect | App Icon | Launch Screen |
|---|---|---|
| **Text allowed** | No | Yes (app name + optional subtitle) |
| **Background** | Off-white or transparent | Solid navy (#1B2A4A) full screen |
| **Icon size** | Fills canvas (1024x1024) | Small centered mark (~80pt) |
| **Format** | Square | Phone-screen aspect ratio (e.g., 9:19.5) |
| **Purpose** | App identity (App Store, home screen) | Transition from cold-launch to first frame |

---

## 7. App Store Screenshot Caption Style

When generating captions for existing or future screenshots, follow these rules:

### 7.1 Format

- Short (3-6 words recommended)
- Benefit-led, not feature-list
- Positioned in App Store Connect, NOT baked into screenshot images
- Use the App Store Connect "caption" field — do not overlay text on images

### 7.2 Safe Caption Templates

| Template | Example |
|---|---|
| **[Verb] a [noun]** | Scan a menu, Compare prices, Flag allergens |
| **[Verb] [adverb]** | Understand dishes faster, Travel with confidence |
| **[Verb] before you [verb]** | Know before you order |
| **[Noun] + [context]** | Your food confidence companion |

### 7.3 Forbidden Caption Words

| ❌ Forbidden | ✅ Instead |
|---|---|
| Guaranteed / Guarantee | Possible, Flag, Check |
| Safe / Safety | Confidence, Awareness, Inform |
| Doctor-approved, Medical-grade | Not applicable — never imply |
| Production-ready | (Do not claim — this is MVP Alpha) |
| Real AI | (Do not claim — providers are mock-only) |
| 100% | (Do not claim — no certainty) |
| Accurate / Accuracy | Understand, Get context for |

---

## 8. Export Plan

### 8.1 Generation to Export Pipeline

```
Generate candidate → Review at 1024px → Zoom to 29px → Silhouette test
         ↓ (pass)
     Export 1024x1024 PNG (opaque, sRGB, square)
         ↓
     DO NOT bake rounded corners
         ↓
     DO NOT add text overlays to the source PNG
         ↓
     Validate in multiple sizes (manually zoom in/out)
         ↓
     Store source master in docs/ or assets/ folder
         ↓
     Future: feed to flutter_launcher_icons
```

### 8.2 Export Specifications

| Attribute | Value |
|---|---|
| **Format** | PNG |
| **Resolution** | 1024 x 1024 px |
| **Color space** | sRGB |
| **Transparency** | Opaque (no alpha channel for the App Store version) |
| **Corners** | Square — iOS applies rounding automatically |
| **File naming** | `app_icon_source_v1.png`, `app_icon_source_v2.png`, etc. |
| **Master location** | `docs/design-assets/` (create folder when assets are generated) |

### 8.3 What NOT to Do During Export

| ❌ Do NOT | Why |
|---|---|
| Bake rounded corners into the PNG | iOS applies corner radius — double-rounding ruins the icon |
| Add a fake iOS rounded-rect mask | Apple rejects icons with device frames baked in |
| Add text labels to the icon PNG | Text at icon sizes is unreadable; make meaning from shapes |
| Export as JPEG | Lossy compression introduces artifacts at small sizes |
| Use a non-square canvas | iOS icon asset catalog requires square source images |
| Overlay a glossy/3D effect | iOS removed the glossy icon overlay since iOS 7 |

---

## 9. Future Implementation Plan

### 9.1 Phased Approach

| Step | Action | Prerequisites | Phase |
|---|---|---|---|
| **1. Generate candidates** | Feed prompts from this pack to an image generator. Generate 4-8 candidates per concept. | Access to an image generation tool | Future: visual design |
| **2. First-pass review** | Review all candidates at full size. Eliminate any with forbidden imagery, text artifacts, or poor composition. | Generated candidates | Future: visual design |
| **3. Silhouette test** | Scale each candidate to 29x29 px. Check if the passport silhouette is recognizable. | Narrowed candidates | Future: visual design |
| **4. Select final candidate** | Choose the best candidate. Optionally request variations (slightly adjusted fork/spoon angle, color tweak). | Passed silhouette test | Future: visual design |
| **5. Manual cleanup** | If the generated icon has minor artifacts, use Figma/Illustrator to trace and clean up the vector shapes. | Selected candidate | Future: visual design |
| **6. Acceptance review** | Run through the acceptance checklist (Section 10). Get sign-off. | Cleaned vector | Future: visual design |
| **7. Export PNG master** | Export 1024x1024 PNG, sRGB, opaque, square corners. Save to `docs/design-assets/`. | Accepted icon | Future: visual design |
| **8. Apply to Flutter** | Configure `flutter_launcher_icons` in `pubspec.yaml`, run `flutter pub run flutter_launcher_icons`. | PNG master, macOS + Xcode available | Future: Flutter config |
| **9. Update launch screen** | Open `LaunchScreen.storyboard` in Xcode. Set navy background. Add icon mark + app name. | macOS + Xcode available | Future: iOS config |
| **10. Build and verify on iOS** | Build the app on iOS Simulator. Check icon on home screen, launch screen transition. | macOS + Xcode available | Future: iOS build |

### 9.2 What CAN Be Done Now (No macOS, No Apple Membership)

| ✅ Can do now | Tool needed |
|---|---|
| Generate icon candidates from prompts | Any image generation tool (DALL-E, Midjourney, Stable Diffusion, ImageGen) |
| Review and filter candidates | Manual visual inspection |
| Silhouette test at 29x29 | Manual zoom |
| Clean up generated vectors | Figma (free), Inkscape (free) |
| Prepare `flutter_launcher_icons` config (draft only) | Text editor |
| Accept and store PNG master in repo | File system |

| ❌ Cannot do now | Reason |
|---|---|
| Apply icons to Flutter/Xcode | No macOS with Xcode |
| Verify icon on iOS home screen | No iOS Simulator available |
| Apply launch screen changes | No Xcode Interface Builder |
| Upload to App Store Connect | No Apple Developer membership |

---

## 10. Acceptance Checklist

Before finalizing any generated icon candidate, verify ALL items on this checklist.

### 10.1 Visual Quality

- [ ] **Readable at 29x29 px** — Squint test: the silhouette should still suggest "passport" or "travel document"
- [ ] **Readable at 40x40 px** — Fork and spoon shapes should be distinguishable
- [ ] **Readable at 60x60 px** — All key elements (passport, fork, spoon) clearly visible
- [ ] **Clean at 1024x1024 px** — No visual artifacts, jagged edges, or AI hallucination artifacts

### 10.2 Content Safety

- [ ] **No forbidden imagery present** — Check against Section 5 negative prompt list (flags, medical crosses, logos, AI icons, cameras, globes)
- [ ] **No text in the icon** — Even tiny text artifacts from AI generation must be cleaned up
- [ ] **No real brand logos** — AI can hallucinate restaurant or food brand logos — verify none are present
- [ ] **No national flags** — Some prompts about "passports" may trigger flag associations in AI models
- [ ] **Meaning is shape-based, not text-dependent** — If you remove all text-like artifacts, does the icon still communicate "food passport"?

### 10.3 Brand Alignment

- [ ] **Matches app identity** — "Travel" + "food" is the expected interpretation
- [ ] **Does NOT imply medical/allergy guarantee** — No shields, checkmarks, crosses, or certification badges
- [ ] **Does NOT imply production readiness** — Icon is professional but not "final shipping product" in tone (no "v2.0" badges, no "Pro" labels)
- [ ] **Does NOT look like a food delivery app** — No delivery bags, motorbikes, maps, or restaurant storefronts

### 10.4 Technical

- [ ] **Square canvas** — 1:1 aspect ratio, not cropped or letterboxed
- [ ] **Opaque or near-opaque** — No large transparent areas that would look empty on the home screen
- [ ] **Sufficient padding** — Icon elements do not touch the canvas edges; at least 10% padding on all sides
- [ ] **Flat or near-flat style** — No complex gradients that won't survive resizing
- [ ] **High contrast** — Passes WCAG AA at minimum between key shapes (e.g., passport navy vs. gold fork)

---

## 11. Rejection Checklist

If a candidate hits ANY of these rejection criteria, discard it immediately.

| # | Rejection Criterion | Why |
|---|---|---|
| 1 | **Too detailed** — Contains many small shapes or intricate lines that blur at 29x29 | Unusable as app icon |
| 2 | **Looks like a medical app** — Dominant red/green cross, caduceus, stethoscope, heartbeat lines | Misleading category signal |
| 3 | **Looks like a food delivery app** — Delivery bags, motorbikes, maps, restaurant buildings, food containers | Wrong product category |
| 4 | **Contains flags or real logos** — Any recognizable national flag or brand mark | Trademark/political risk |
| 5 | **Contains text** — Any letters, words, or numbers (even small or incidental) | Unreadable at small sizes, looks unprofessional |
| 6 | **Implies guaranteed safety** — Checkmark badge, shield icon, green "safe" indicators | Legal liability risk |
| 7 | **Photo-realistic food present** — Actual food photographs or photorealistic renderings | Doesn't scale to icon sizes; wrong aesthetic |
| 8 | **Cluttered composition** — Multiple overlapping elements, collages, "busy" layouts | Unreadable at small sizes |
| 9 | **AI/robot icon present** — Brain, circuit, neural network, or robot imagery | Overclaims AI capability; icon should represent outcome, not technology |
| 10 | **Camera icon present** — Lens, shutter, viewfinder, or camera body shapes | Generic and overused; scanning is a feature, not the brand |
| 11 | **Globe/world map present** — Earth shapes, continents, map elements | Too similar to Safari, Maps, VPN apps |
| 12 | **3D render or heavy gradient** — Photorealistic lighting, shadow effects, glossy surfaces | Doesn't match iOS flat-design conventions |

---

## 12. Decision Log

| # | Decision | Rationale |
|---|---|---|
| 1 | This phase is **prompts/plans only** — no images generated | Phase 21J scope explicitly prohibits binary asset creation. Prompts are prepared for a future generation phase. |
| 2 | Primary prompt: passport booklet + fork/spoon crossing | Matches the concept approved in Phase 21D (Section 12) and detailed in Phase 21I (Section 4). |
| 3 | Five alternative concepts provided | Covers menu card, scan frame, stamp-only, and chopsticks variants for design exploration. |
| 4 | Comprehensive negative prompt with 18 exclusion categories | Ensures generated icons avoid all forbidden imagery. The negative prompt should be appended to EVERY generation request. |
| 5 | Separate launch screen prompt with different parameters | Launch screen allows text and uses full-screen navy background — different from the app icon requirements. |
| 6 | Export plan specifies square, opaque PNG with NO rounded corners | iOS applies corner radius. Pre-rounding causes double-rounding. |
| 7 | Acceptance checklist: 16 items across 4 categories | Covers visual quality, content safety, brand alignment, and technical requirements. |
| 8 | Rejection checklist: 12 hard-stop criteria | Immediate discard if any hit. Prevents wasting time on unsuitable candidates. |
| 9 | No code, config, or assets changed | All existing files, Flutter code, iOS config, and screenshots remain unmodified. |
| 10 | Cross-references added to `APP_ICON_LAUNCH_SCREEN_SPEC.md` and `README.md` | Navigation convenience — readers can find the prompt pack from the design spec. |
| 11 | **Candidate selected using these prompts** (Phase 22A) | Candidate 1, recolored version (royal/cobalt blue passport, gold fork/spoon, globe linework, cyan rim glow) was selected as the primary visual direction. See `APP_ICON_CANDIDATE_REVIEW.md` for the full review record, rejected candidates, and acceptance/rejection checklist results. |

---

## Appendix A: Prompt Usage Guide

### For WorkBuddy ImageGen Tool

```
Use the "Primary Icon Prompt (English)" from Section 3.1 as the positive prompt.
Use the "Full Negative Prompt" from Section 5.1 as the negative prompt.
Set aspect ratio to 1:1 (square).
Generate 3-4 candidates in the first batch.
```

### For DALL-E (via API or ChatGPT)

```
Paste the English prompt into the prompt field.
DALL-E does not support a separate negative prompt field —
include the negative constraints directly in the prompt text.
```

### For Midjourney

```
Use the English prompt as the main prompt.
Add "--no text, flags, logos, medical symbols, gradients" at the end.
Use "--ar 1:1" for square aspect ratio.
Add "--style raw" for cleaner, less artistic results.
```

### For Stable Diffusion

```
Use the English prompt as the positive prompt.
Use the negative prompt from Section 5.1 in the negative prompt field.
Set resolution to 1024x1024.
Use a model optimized for vector/illustration styles.
```

---

## Appendix B: Prompt Iteration Strategy

If the first batch of candidates doesn't produce an acceptable icon:

1. **Increase specificity** — Add explicit color hex codes to the prompt (e.g., "dark navy blue #1B2A4A passport")
2. **Simplify** — Remove secondary elements. Try "A single dark navy passport book with a gold fork on top. No other elements."
3. **Add style keywords** — "Flat app icon design, vector illustration, Material Design style, 2D flat art, no depth, no realism"
4. **Use reference images** — If the tool supports image references, provide a sketch or a similar-style icon as guidance.
5. **Switch concepts** — If Passport + Fork/Spoon fails after 3 batches, try Concept D (Fork/Spoon + Travel Stamp) which has fewer elements.

---

*This document contains image generation prompts and a future implementation plan. No binary image assets have been generated or changed. All Flutter code, iOS config, and existing files remain unmodified. These prompts should be used in a future visual design phase to generate icon candidates for review against the acceptance checklist in Section 10.*
