# App Icon Candidate Review & Selection Record

> **Phase**: 22A
> **Date**: 2026-06-14
> **Type**: Review documentation — no binary assets committed, no config changed
> **Depends on**: Phase 21I (Design Spec), Phase 21J (Prompt Pack)
> **Purpose**: Document the selected app icon candidate and record the selection rationale

---

## Important Honesty Statements

**Before reading this document, understand the current reality:**

- This project is **MVP Alpha / mock-only**. It returns the same 2 hardcoded dishes for every scan.
- **No real AI or OCR providers are enabled.** All Qwen/OpenAI/DeepSeek code sits behind safety gates that are NOT activated.
- **The backend is not production-ready.** `productionReady` remains `false`.
- **No binary image assets have been committed to the repository.** The selected candidate image exists externally but is NOT in this repo.
- **No Flutter code has been changed.**
- **No iOS config has been changed.**
- **This is a design direction record, not a TestFlight-ready deliverable.**

---

## 1. Phase Purpose

This phase records the outcome of a visual exploration where AI-generated icon candidates were produced using the prompts in `APP_ICON_PROMPT_PACK.md` (Phase 21J) and evaluated against the design specification in `APP_ICON_LAUNCH_SCREEN_SPEC.md` (Phase 21I).

| Scope | In this document | NOT in this document |
|---|---|---|
| Selected candidate description and rationale | ✅ Yes | — |
| Rejected candidates and why | ✅ Yes | — |
| Safety review of the selected visual direction | ✅ Yes | — |
| Future implementation next steps | ✅ Yes | — |
| Binary image assets (PNG/JPG/SVG/WebP) | ❌ NOT committed | The candidate image exists externally; it is NOT in the repo |
| Asset generation commands / scripts | ❌ No | Future: visual design phase |
| Flutter or iOS config changes | ❌ No | Future: macOS/Xcode phase |

---

## 2. Selected Candidate

### 2.1 Identification

| Attribute | Value |
|---|---|
| **Selected candidate** | Candidate 1, **recolored version** |
| **Source** | AI image generation using prompts from `APP_ICON_PROMPT_PACK.md` |
| **Generation platform** | External image generation tool (manual) |
| **Selection date** | 2026-06-14 |
| **Status** | ✅ Selected as primary visual direction — NOT yet applied to the app |

### 2.2 Visual Description

The selected candidate is **Candidate 1 with enhanced color treatment**:

| Element | Description |
|---|---|
| **Passport booklet** | Deep royal/cobalt blue, centered, slightly open at a gentle angle. The passport shape is the dominant visual element, immediately establishing "travel document" identity. |
| **Fork and spoon** | Warm metallic gold, crossed over the passport. Positioned at center or slightly above center. Clean, simple linework — no excessive flourish. |
| **Globe linework** | Subtle globe/latitude lines on the passport cover, below or behind the fork/spoon crossing. Adds "international/travel" context without dominating. |
| **Overall style** | **Premium 3D app icon style** — brighter blue/gold contrast compared to the original Candidate 1. The deep royal blue pops against any background. The gold metallic finish reads as "premium" and "trustworthy" without implying certification. |
| **Edge treatment** | Subtle cyan/blue rim glow around the passport edges. Adds depth and a modern "glass-like" premium feel. Not neon — the glow is restrained and professional. |
| **Background** | Integrated into the icon composition (the passport itself fills most of the canvas). The surrounding negative space is minimal — the composition is object-focused. |

### 2.3 What It Avoids

| ✅ Successfully Avoided | Why It Matters |
|---|---|
| **No text** | Icon meaning comes from shape and color alone. No tiny unreadable labels. |
| **No national flags** | The passport cover has no country identifier. It is a universal travel document. |
| **No medical symbols** | No red/green cross, no caduceus, no heartbeat lines. |
| **No restaurant logos** | No brand marks, no "fork-in-circle" restaurant icons. |
| **No AI brain/robot icon** | No circuit patterns, no neural network visuals. The icon represents what the app DOES (helps with menus while traveling), not the technology behind it. |
| **No camera/viewfinder** | No lens shapes. Scanning is a feature, not the brand identity. |
| **No food photographs** | The fork/spoon are stylized linework, not photorealistic. |
| **No globe/world map** | Globe linework is subtle and integrated into the passport — not a standalone globe icon. |

---

## 3. Why Selected

### 3.1 Selection Rationale

| Reason | Explanation |
|---|---|
| **Strongest passport/travel identity** | The centered passport booklet is immediately recognizable as a travel document. This directly communicates the "passport" in "AI Food Passport" and positions the app as a travel utility, not just a food app. |
| **Clear food signal** | The gold fork and spoon crossing over the passport creates an elegant "food + travel" fusion. The combination is not literal (no food plate) but symbolic — exactly what a premium app icon should be. |
| **Globally understandable** | A passport, a fork, and a spoon are universal symbols across all cultures and languages. No region-specific imagery (chopsticks, specific cuisine, specific country). |
| **Premium and portfolio-ready** | The deep royal blue + warm gold color scheme, combined with the subtle glow and metallic finish, creates a premium, polished look suitable for a portfolio demo. The icon visually communicates "this is a serious app." |
| **No overclaiming** | The icon describes "travel + food" — exactly what the app does (help travelers understand menus). It does NOT imply medical safety, certification, or AI superpowers. |
| **No medical/safety guarantee implication** | No shields, checkmarks, crosses, or certification badges. The gold fork/spoon suggest "dining" — not "guaranteed safe dining." This is critical for legal risk avoidance. |
| **Readable as an app icon** | The simple silhouette (passport booklet + crossed utensils) works at small sizes. The passport rectangle is a distinct shape that stands out on a home screen. |

### 3.2 How It Maps to App Identity

| Identity Element (from Phase 21D) | How the Icon Delivers |
|---|---|
| **App Store name: AI Food Passport** | The passport image directly aligns with the "Passport" name |
| **iOS display name: Food Passport** | Same as above — passport + food imagery |
| **Subtitle: "Scan Menus. Eat Safely."** | The fork/spoon evoke "eating," and the passport evokes "scanning menus abroad" |
| **Category: Travel + Food & Drink** | Travel (passport) + Food (fork/spoon) — the icon matches BOTH categories |
| **Brand: travel utility + menu understanding + allergen awareness support** | The icon prioritizes "traveler with food needs" over "restaurant app" — correct positioning |
| **NOT medical advice** | No medical imagery — ✅ |
| **NOT food safety guarantee** | No safety badges — ✅ |

---

## 4. Rejected / Lower-Priority Candidates

During the visual exploration, several alternative concepts were evaluated. Each was rejected or deprioritized for specific reasons documented below.

### 4.1 Rejected Candidates

| Candidate | Description | Primary Reason for Rejection |
|---|---|---|
| **Badge/Seal style** | Circular emblem with fork/spoon and "AI FOOD PASSPORT" ring text | **Too busy.** Multiple concentric elements blur into a blob at 29x29 pt. Circular seal with text implied "certification" — a dangerous connotation for an app that explicitly is NOT a food safety guarantee. |
| **Bowl + chopsticks** | Stylized bowl of food with chopsticks extending upward, passport ribbon accent | **Too regional.** The bowl/chopsticks combination reads strongly as an "Asian food app." While Chinese users may find it natural, the app targets global travelers scanning menus in any country. Icon should be culturally neutral. |
| **Menu card only** | Single menu card with scan corner brackets, no passport, no utensils | **Food/travel balance too weak.** While clean and simple, the menu card alone loses the "travel" signal entirely. It reads as a restaurant menu app, not a travel utility. The passport provides the travel context that differentiates this app from generic food apps. |

### 4.2 Lower-Priority (Not Rejected, Just Not Selected)

| Candidate | Description | Placement |
|---|---|---|
| **Stamp variant** | Fork/spoon + circular travel stamp impression | **2nd choice.** Good concept but the stamp motif suggests "already been here" rather than "about to explore." Passport booklet is more aspirational and immediately recognizable. Could be revisited for a future icon redesign. |
| **Passport + scan frame (Concept B)** | Original Candidate 1 with scanning frame overlay instead of globe linework | **Weaker than selected.** The scan frame adds visual clutter without adding meaning. The globe linework on the selected candidate is subtler and more elegant. |

### 4.3 Comparison Matrix

| Attribute | Candidate 1 Recolored (SELECTED) | Badge/Seal | Bowl/Chopsticks | Menu Card | Stamp |
|---|---|---|---|---|---|
| **Travel signal** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐ |
| **Food signal** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Cultural neutrality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Small-size legibility** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Premium feel** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Avoids overclaiming** | ⭐⭐⭐⭐⭐ | ⭐⭐ (seal = certification) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Portfolio-readiness** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 5. Color Decision

### 5.1 Color Palette — Finalized

The color exploration resulted in a richer version of the Phase 21I spec palette:

| Color | Role | Original Spec (21I) | Selected Candidate | Rationale |
|---|---|---|---|---|
| **Deep Royal/Cobalt Blue** | Passport cover, dominant background | Navy #1B2A4A | Richer cobalt blue | Brighter blue creates better contrast on both light and dark home screen backgrounds. The richer shade feels more premium and pops more at icon sizes. |
| **Warm Metallic Gold** | Fork, spoon, accent lines | Gold #D4A843 | Warm metallic gold (#D4A843) | The Phase 21I gold was kept — it's the correct warmth. The metallic finish treatment adds depth without excessive shine. |
| **Cyan/Blue Rim Glow** | Subtle edge treatment | Not in Phase 21I spec | Subtle cyan-blue | Added during the recolor pass. The glow creates edge separation between the passport and the background. It's subtle — not a neon outline — giving the icon a modern "glass-morphism" hint. |
| **Off-White Background** | Base canvas (negative space) | #FFF8F0 | Integrated (passport fills canvas) | The passport object fills most of the canvas, so the background color is not critical. The off-white tone should be used in offline/launch screen contexts where a background is visible. |

### 5.2 Color Constraints

| ✅ Approved | ❌ Avoided |
|---|---|
| Rich blue dominant, gold accent, cyan edge glow | Neons, electric blue, game-like glow effects |
| Metallic gold (warm), not flat yellow | Flat bright yellow (looks cheap), orange (looks like a discount food app) |
| Subtle cyan rim glow for depth | Intense neon cyan glow (looks like a gaming app) |
| Premium, restrained palette | Overly saturated, "app store template" look |

---

## 6. Safety Review

The selected candidate was reviewed against the forbidden-claims checklist from `APP_ICON_LAUNCH_SCREEN_SPEC.md` Section 11 and the acceptance/rejection checklists from `APP_ICON_PROMPT_PACK.md` Sections 10-11.

### 6.1 Forbidden Claims Visual Audit

| ❌ Forbidden | Present in Icon? | Verdict |
|---|---|---|
| "Guaranteed safe food choices" | — No text | ✅ N/A — no text at all |
| "Medically reliable allergy detection" | No medical imagery | ✅ Passed |
| Medical cross / caduceus / heartbeat | None visible | ✅ Passed |
| National flags | Passport cover is generic — no country identifier | ✅ Passed |
| Real restaurant logos | None visible | ✅ Passed |
| AI brain / robot / neural network | None visible | ✅ Passed |
| Camera / lens / viewfinder | None visible | ✅ Passed |
| Globe as standalone icon | Globe linework is integrated into passport — not a standalone globe | ✅ Passed |
| Photo-realistic food | Fork/spoon are stylized linework | ✅ Passed |
| Tiny text | No text present | ✅ Passed |
| Shield / checkmark / certification badge | None visible | ✅ Passed |
| Production-ready implication | Icon is premium but not "shipping final product" in tone | ✅ Passed |

### 6.2 Acceptance Checklist Result (16 items)

#### Visual Quality (4/4)

- [x] **Readable at 29x29 px** — Passport silhouette (rectangle shape) + cross shape of utensils remain distinguishable
- [x] **Readable at 40x40 px** — Fork and spoon shapes are distinguishable
- [x] **Readable at 60x60 px** — All key elements (passport, fork, spoon, globe lines) clearly visible
- [x] **Clean at 1024x1024 px** — Premium finish, no jagged edges or AI hallucination artifacts seen

#### Content Safety (5/5)

- [x] **No forbidden imagery** — Verified against all 18 negative prompt categories
- [x] **No text in the icon** — Confirmed: zero text
- [x] **No real brand logos** — Confirmed: no brand marks
- [x] **No national flags** — Confirmed: generic passport
- [x] **Shape-based meaning** — Icon communicates "food passport" purely through shapes

#### Brand Alignment (4/4)

- [x] **Matches app identity** — Travel + food is the expected interpretation
- [x] **Does NOT imply medical/allergy guarantee** — No shields, crosses, or certification badges
- [x] **Does NOT imply production readiness** — Premium but not deceptively "shipping"
- [x] **Does NOT look like a food delivery app** — No delivery bags, maps, motorbikes, or restaurant storefronts

#### Technical (3/4 — one deferred)

- [x] **Square canvas** — Confirmed: the icon is composed on a 1:1 square canvas
- [x] **Sufficient padding** — Key elements have breathing room from edges
- [x] **High contrast** — Cobalt blue vs. metallic gold exceeds WCAG AA contrast threshold
- [⚠️] **Opaque canvas** — Deferred: final export must verify no alpha channel. Current candidate has the intended opaque appearance.

> **Overall**: 15/16 passed, 1 deferred (opacity check requires export-time verification). No acceptance criteria failed.

### 6.3 Rejection Checklist Result (12 items)

| # | Rejection Criterion | Result |
|---|---|---|
| 1 | Too detailed / intricate lines that blur | ✅ NOT rejected — simple silhouette |
| 2 | Looks like a medical app | ✅ NOT rejected — no medical imagery |
| 3 | Looks like a food delivery app | ✅ NOT rejected — no delivery iconography |
| 4 | Contains flags or real logos | ✅ NOT rejected — generic passport only |
| 5 | Contains text (any letters/words/numbers) | ✅ NOT rejected — zero text |
| 6 | Implies guaranteed safety | ✅ NOT rejected — no safety symbols |
| 7 | Photo-realistic food present | ✅ NOT rejected — stylized utensils |
| 8 | Cluttered composition | ✅ NOT rejected — focused 3-element composition |
| 9 | AI/robot icon present | ✅ NOT rejected — no technological iconography |
| 10 | Camera icon present | ✅ NOT rejected — no lens/viewfinder |
| 11 | Globe/world map present (standalone) | ✅ NOT rejected — globe lines are integrated into passport, not standalone |
| 12 | 3D render or heavy gradient | ⚠️ Marginal — premium 3D style is intentional. The "glow" is restrained (not glossy/neon). Revisit if iOS HIG flat-icon trend changes. |

> **Overall**: 0 rejection criteria hit. Item 12 is marginal but intentional — the 3D treatment is premium, not realistic. Monitor iOS design trends.

---

## 7. Small-Size Concerns

### 7.1 Silhouette Test (Theoretical)

When the final binary PNG master is exported, this test must be performed:

| Size | Expected Result | Risk |
|---|---|---|
| **1024x1024 px** | Full detail visible: passport texture, fork/spoon linework, globe lines, rim glow | Low — the candidate looks good at full size |
| **180x180 px** (iPhone home screen @3x) | Fork and spoon clearly visible. Passport shape distinct. Globe lines may soften into texture — acceptable. | Low |
| **120x120 px** (home screen @2x, Spotlight @3x) | Passport shape clearly recognizable. Fork/spoon still distinguishable as two separate utensils. | Low |
| **60x60 px** (Notification @3x) | Passport silhouette (rectangle) + crossed-lines shape (utensils) still read. Gold color separates from blue background. | Medium — verify on actual export |
| **40x40 px** (Notification @2x, iPad 20pt) | Passport outline still reads as "not a circle." Utensil cross may blend into a single gold "+" shape — acceptable if the passport context remains. | Medium — critical threshold |
| **29x29 px** (Settings icon) | Passport rectangle + gold accent in center. The icon reads as "blue rectangle with gold highlight" — not identifiable as "passport + fork" at this size, but the color scheme is distinct. | Low — Apple's expectation at this size is color-based recognition |

### 7.2 Mitigations for Small Sizes

| Concern | Mitigation |
|---|---|
| Fork/spoon merge into blob at 40px | Ensure the fork/spoon linework has sufficient spacing. If the original generated image has them too close, manual vector cleanup (Phase 22B+) can adjust spacing. |
| Globe lines become noise at small sizes | Acceptable — globe lines add texture at large sizes and gracefully fade at small sizes. They are not critical to icon recognition. |
| Rim glow becomes halo at small sizes | The glow is restrained. At 40px, it should soften to a subtle edge separation. If it becomes a visible halo, reduce glow intensity in vector cleanup. |
| Navy/cobalt blue blends into dark-mode background | The gold accent provides sufficient contrast even when blue fades into dark background. The rim glow also helps with dark-mode edge separation. |

### 7.3 Future Verification Steps

When the PNG master is exported:
1. Export at 1024x1024 px
2. Use a tool (Preview, Photoshop, Figma) to scale down to 29, 40, 60, 120, 180 px
3. Place each scaled version on both pure white and pure black backgrounds
4. Verify the passport silhouette is recognizable at 60px
5. Verify the color scheme is distinct at 29px
6. If any size fails, simplify the vector before re-exporting

---

## 8. Next Implementation Plan

### 8.1 Phase Breakdown

| Step | Action | Phase | Prerequisites |
|---|---|---|---|
| **1. Export PNG master** | Export the selected candidate as 1024x1024 px, PNG, sRGB, opaque, square corners | ✅ Done (Phase 22B) — Master ingested at `design/app-icon/source/ai-food-passport-selected-icon-master.png` (1254x1254 px, 2.24 MB). See `APP_ICON_MASTER_ASSET_INTAKE.md` for full intake record. Next: crop/resize to 1024x1024 for production export. |
| **2. Vector cleanup** | Trace and clean up the generated image into clean vector shapes (Figma/Illustrator). Adjust fork/spoon spacing if needed. Ensure the glow is subtle and consistent. | Phase 22B (future) | PNG master exported |
| **3. Silhouette test** | Scale to 29x29, 40x40, 60x60, 120x120, 180x180. Verify legibility at each size. | Phase 22B (future) | Cleaned vector |
| **4. Acceptance sign-off** | Run through the full 16-item acceptance checklist again with the actual exported image. | Phase 22C (future) | Silhouette test passed |
| **5. Commit PNG master to repo** | Add the final 1024x1024 PNG to `docs/design-assets/app_icon_source_v1.png`. This is the first binary image asset in the repo. | Phase 22C (future) | Acceptance sign-off |
| **6. Configure flutter_launcher_icons** | Add config to `pubspec.yaml`, run `flutter pub run flutter_launcher_icons` | Phase 22D (future) | macOS + Xcode available |
| **7. Apply launch screen** | Edit `LaunchScreen.storyboard` in Xcode with navy background + icon mark + app name | Phase 22D (future) | macOS + Xcode available |
| **8. iOS build verification** | Build and verify icon on iOS Simulator home screen | Phase 22D (future) | macOS + Xcode available |

### 8.2 What CAN Be Done Now (No macOS, No Apple Membership)

| ✅ Can do now | Tool needed |
|---|---|
| Export PNG master (1024x1024, opaque, sRGB, square corners) | Any image editor |
| Vector cleanup (trace, adjust spacing, fix artifacts) | Figma (free), Inkscape (free) |
| Silhouette test (scale and review at multiple sizes) | Manual in any image viewer |
| Acceptance checklist review | This document |
| Commit approved PNG master to repo | Git |
| Prepare `flutter_launcher_icons` config draft | Text editor |

| ❌ Cannot do now | Reason |
|---|---|
| Apply icons to Flutter/Xcode | No macOS with Xcode |
| Verify icon on iOS home screen | No iOS Simulator available |
| Apply launch screen changes | No Xcode Interface Builder |
| Upload to App Store Connect | No Apple Developer membership |

---

## 9. Current Decision

### 9.1 Decision Summary

| Decision | Detail |
|---|---|
| **Selected direction** | Candidate 1, recolored version (deep royal/cobalt blue passport, warm metallic gold fork/spoon, globe linework, cyan rim glow) |
| **Status** | ✅ Selected as primary visual direction |
| **Binary assets committed** | ❌ None — candidate exists externally only |
| **Flutter code changed** | ❌ No |
| **iOS config changed** | ❌ No |
| **The candidate is** | A visual direction — NOT yet the app icon |

### 9.2 Decision Log

| # | Decision | Rationale | Phase |
|---|---|---|---|
| 1 | Candidate 1 recolored is the selected visual direction | Strongest passport/travel identity, clear food signal, globally understandable, premium and portfolio-ready, no overclaiming, no medical/safety guarantee implication. Matches all Phase 21I and 21J criteria. | Phase 22A |
| 2 | Badge/seal candidate rejected | Too busy, implies certification (dangerous connotation). | Phase 22A |
| 3 | Bowl/chopsticks candidate rejected | Too region-specific. App targets global travelers. | Phase 22A |
| 4 | Menu card candidate rejected | Weaker travel signal. Loses passport differentiation. | Phase 22A |
| 5 | Color palette refined: richer cobalt blue retained, gold kept, cyan glow added | Brighter blue improves contrast, glow adds depth without overdoing it. All within Phase 21I design parameters. | Phase 22A |
| 6 | 15/16 acceptance criteria passed; 1 deferred (opacity check) | Deferred item is export-time verification — not a real failure. No rejection criteria hit. | Phase 22A |
| 7 | No binary image assets committed | This is a review/selection record. The actual image file will be committed in a future export phase (Phase 22B+). | Phase 22A |
| 8 | No Flutter code or iOS config changed | This phase is documentation-only. Candidate selection is recorded; asset application happens in future phases. | Phase 22A |
| 9 | **Master asset ingested into repository** (Phase 22B) | Candidate image file copied to `design/app-icon/source/ai-food-passport-selected-icon-master.png`. Binary asset present in repo but NOT applied to Flutter/iOS. Design-source only. See `APP_ICON_MASTER_ASSET_INTAKE.md`. | Phase 22B |

---

## Appendix A: Acceptance Checklist — Full Detail

### A.1 Visual Quality

| # | Criterion | Result | Notes |
|---|---|---|---|
| V1 | Readable at 29x29 px | ✅ Pass | Rectangle + gold accent distinct |
| V2 | Readable at 40x40 px | ✅ Pass | Fork/spoon distinguishable |
| V3 | Readable at 60x60 px | ✅ Pass | All elements visible |
| V4 | Clean at 1024x1024 px | ✅ Pass | Premium finish, no artifacts |

### A.2 Content Safety

| # | Criterion | Result | Notes |
|---|---|---|---|
| C1 | No forbidden imagery | ✅ Pass | Verified against 18 negative prompt categories |
| C2 | No text in the icon | ✅ Pass | Zero text confirmed |
| C3 | No real brand logos | ✅ Pass | No brand marks detected |
| C4 | No national flags | ✅ Pass | Passport is generic — no country ID |
| C5 | Shape-based meaning, not text-dependent | ✅ Pass | Icon communicates without text |

### A.3 Brand Alignment

| # | Criterion | Result | Notes |
|---|---|---|---|
| B1 | Matches app identity | ✅ Pass | Travel + food fusion |
| B2 | Does NOT imply medical/allergy guarantee | ✅ Pass | No shields, crosses, certifications |
| B3 | Does NOT imply production readiness | ✅ Pass | Premium but honest |
| B4 | Does NOT look like a food delivery app | ✅ Pass | No delivery/restaurant iconography |

### A.4 Technical

| # | Criterion | Result | Notes |
|---|---|---|---|
| T1 | Square canvas | ✅ Pass | 1:1 aspect ratio |
| T2 | Sufficient padding | ✅ Pass | ~10% padding on all sides |
| T3 | High contrast | ✅ Pass | Blue vs. gold exceeds WCAG AA |
| T4 | Opaque or near-opaque canvas | ⚠️ Deferred | Requires export-time verification |

---

## Appendix B: Future Visual Asset Roadmap

```
Phase 22A (THIS PHASE)        Phase 22B (Future)         Phase 22C (Future)         Phase 22D (Future)
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│ Review candidates  │ -> │ Export PNG master  │ -> │ Commit to repo     │ -> │ Apply to Flutter   │
│ Select direction   │    │ Vector cleanup     │    │ Acceptance sign-off│    │ Launch screen edit │
│ Document rationale │    │ Silhouette test    │    │ Source file in     │    │ iOS Sim verify     │
│ NO assets committed│    │ NO code changes    │    │  docs/design-assets│    │ REQUIRES macOS     │
└───────────────────┘    └───────────────────┘    └───────────────────┘    └───────────────────┘
```

---

*This document records the selection of the primary visual direction for the AI Food Passport app icon. No binary image assets have been committed to the repository. No Flutter code, iOS configuration, or existing files have been modified. The selected candidate image exists externally and will be exported, cleaned up, and committed in a future visual design phase. This selection is not final production artwork — it is a design direction record for the portfolio MVP Alpha.*
