# AI Food Passport — Portfolio Demo Package

**Last updated:** 2026-06-15 (Phase 25B)
**Status:** MVP Alpha — portfolio-ready, not production-ready

---

## 1. Project Pitch

AI Food Passport is a **Flutter MVP** that helps international travelers understand foreign menus. Snap a photo, and the app identifies dishes, converts prices to your home currency, and warns you about allergens that match your saved dietary preferences — all with a clean, passport-inspired interface. Designed as a portfolio showcase of product thinking, safe provider architecture, and end-to-end Flutter engineering.

---

## 2. Target User Problem

Travelers eating in unfamiliar countries face three recurring problems:

1. **Language barrier** — menus in foreign scripts are hard to parse
2. **Price confusion** — unfamiliar currencies make it hard to judge value
3. **Allergen risk** — hidden ingredients can trigger dietary reactions

AI Food Passport addresses all three in a single scan flow, with results tailored to the traveler's home currency, output language, and dietary preferences.

---

## 3. MVP Feature List

| Feature | Status | Details |
|---|---|---|
| Menu scan & analysis | ✅ Mock-safe | 2 deterministic mock dishes per scan |
| Price intelligence | ✅ Real UX | Home currency conversion for 6+ currencies |
| Saved dietary preferences | ✅ Real persistence | 8 allergens + 5 dietary restrictions, shared_preferences |
| Personalized allergen warnings | ✅ Real UX | "Contains [allergen]" badge on matching dishes |
| Scan history | ✅ Session-local | Restore past scans without backend re-call |
| Multilingual results | ✅ Mock data | Language-aware dish names and helper text |
| Traveler settings | ✅ Real persistence | Home country, currency, output language |
| Backend API | ✅ Deployed | Render free tier, mock-only, health endpoint |
| Privacy policy | ✅ Live | GitHub Pages hosted |
| Demo/QA package | ✅ Complete | Demo script, QA checklist, recording shot list |

---

## 4. Demo Script Summary

The full demo flow is documented in [DEMO_PRODUCT_FLOW_SCRIPT.md](DEMO_PRODUCT_FLOW_SCRIPT.md). Three narration scripts are provided:

| Script | Length | Use Case |
|---|---|---|
| **60-second elevator** | ~1 min | Quick intro, portfolio header, social media |
| **2-minute portfolio** | ~2 min | Interview walkthrough, portfolio review |
| **Detailed walkthrough** | 5+ min | Technical deep-dive, QA validation |

**6-act demo flow:**
1. Open app → see passport-style home
2. Profile → Dietary Preferences → select allergens (Wheat, Egg, Soy)
3. Scan menu → processing animation
4. Results → personalized allergen badges + price intelligence
5. Profile → Scan History → restore past result
6. Clear history, return to scan

**Recording guide:** [DEMO_RECORDING_SHOT_LIST.md](DEMO_RECORDING_SHOT_LIST.md) — 10 shots, 81 seconds total.

---

## 5. Manual QA Checklist Summary

The full QA checklist is at [MANUAL_QA_CHECKLIST.md](MANUAL_QA_CHECKLIST.md) — **74 items** across 8 sections:

| Section | Items | Coverage |
|---|---|---|
| Environment | 4 | App launch, test pass, backend mode |
| Dietary Preferences | 8 | Select/deselect/clear/persist |
| Scan & Results | 8 | Analysis, warnings, no false positives |
| Scan History | 8 | Entry creation, restore, clear |
| Safety Wording | 6 | No "safe/unsafe/guaranteed/diagnosis" |
| Regression | 9 | No forbidden path changes |
| Known Limitations | 10 | Mock-only, session history, no TestFlight |

---

## 6. Technical Architecture Summary

```
┌─────────────────────────────────────────────────┐
│                  Flutter App                      │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Scan    │  │ Results  │  │ Profile       │  │
│  │  Screen  │  │  Screen  │  │ Screen        │  │
│  └────┬─────┘  └────┬─────┘  └───────┬───────┘  │
│       │             │               │           │
│  ┌────▼─────────────▼───────────────▼───────┐   │
│  │         Riverpod State Layer              │   │
│  │  (scanHistoryProvider, dietaryPrefs, ...) │   │
│  └────┬──────────────────────────────┬──────┘   │
│       │                              │           │
│  ┌────▼─────┐                  ┌─────▼──────┐   │
│  │ Local    │                  │ Backend    │   │
│  │ Mock OCR │                  │ Adapter    │   │
│  │ Mock AI  │                  │ (optional) │   │
│  └──────────┘                  └─────┬──────┘   │
│                                      │           │
│                            shared_preferences    │
│                            (dietary prefs,       │
│                             traveler settings)    │
└──────────────────────────────────────┼───────────┘
                                       │
                              ┌────────▼────────┐
                              │  Render Backend  │
                              │  (Node.js)       │
                              │  Mock OCR + AI   │
                              │  /health         │
                              │  /api/analyze    │
                              └──────────────────┘
```

### Key Technical Choices

| Layer | Technology | Purpose |
|---|---|---|
| **UI Framework** | Flutter + Dart | Cross-platform mobile from single codebase |
| **State Management** | Riverpod | Provider-based reactive state, testable |
| **Navigation** | GoRouter | Declarative routing with named routes |
| **Local Persistence** | shared_preferences | Dietary preferences, traveler settings |
| **Backend** | Node.js (built-in modules) | Mock OCR/AI analysis API |
| **Deployment** | Render (free tier) | Live mock backend |
| **Privacy Policy** | GitHub Pages | Static HTML hosting |
| **Testing** | Flutter test + Riverpod | 97/97 tests, provider-level + widget |
| **Safety** | No API keys in Flutter | All real providers gated behind env vars |

---

## 7. Testing Summary

| Metric | Value |
|---|---|
| **Flutter test suite** | **97/97 passing** |
| **Backend contract tests** | 102 passing |
| **Provider gate dry-run** | 226 gate tests verified |
| **dart analyze** | 54 pre-existing info-level lints, **zero warnings/errors** |
| **Test categories** | Model tests, provider tests, widget tests |

Key test files:
- `test/features/shared/domain/models/dietary_preferences_model_test.dart` (15 tests)
- `test/features/shared/data/dietary_preferences_provider_test.dart` (6 tests)
- `test/core/widgets/result_card_allergen_warning_test.dart` (3 tests)
- `test/features/shared/domain/models/scan_history_entry_model_test.dart` (14 tests)
- `test/features/shared/data/scan_history_provider_test.dart` (9 tests)

---

## 8. Portfolio Talking Points

### Product Thinking
- Identified a real traveler pain point (menu comprehension, price, allergens)
- Designed a 3-in-1 solution (scan → analyze → personalize) in a single flow
- Chose mock-safe architecture to demonstrate product value without production dependencies

### Engineering Discipline
- **97/97 automated tests** with model, provider, and widget-level coverage
- **Provider safety gates** — real API keys are server-side only, never in Flutter
- **Developer controls gating** — debug UI hidden in release builds
- **Mock-first development** — full product flow works without any paid API

### Feature Depth
- **Scan history** with session-local restore, no backend re-call
- **Dietary preferences** with case-insensitive allergen matching and shared_preferences persistence
- **Personalized warnings** that update when preferences change
- **Safe language** — no "safe/unsafe/guaranteed/diagnosis" wording

### Documentation Quality
- Complete demo scripts (60s, 2min, detailed versions)
- 74-point manual QA checklist
- 10-shot recording guide
- Full phase history with reports (25+ phases documented)

---

## 9. Honest Limitations

| Limitation | Detail |
|---|---|
| **Mock-only OCR/AI** | All dish data is deterministic mock — no real image recognition |
| **No production provider** | Qwen OCR/Analysis implemented behind gates but not enabled |
| **No TestFlight build** | Requires macOS + Apple Developer membership |
| **No App Store readiness** | Bundle ID, app icon, and launch screen need production assets |
| **Session-only history** | Scan history lost on app restart (no persistence yet) |
| **Free-tier backend** | Render free tier spins down after inactivity (30-60s cold start) |
| **No real exchange rates** | Home currency conversion uses mock rates |
| **No allergy guarantee** | App explicitly states it's not medical advice |

---

## 10. Suggested Next Product Phase

**Phase 26A: Enrich Mock Data for Demos** — Add more mock dishes and realistic mock scenarios to make the demo look richer without enabling real providers.

Then, in priority order:
1. **Phase 26B: Scan History Persistence** — Persist scan history across app restarts
2. **Phase 26C: Empty State & Navigation Polish** — Polish empty states across all screens
3. **Real provider enablement** — requires valid API keys and backend env configuration
4. **iOS/TestFlight** — requires macOS + Apple Developer membership
