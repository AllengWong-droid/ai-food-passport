# AI Food Passport v0.2.0 Portfolio Demo Ready

**Release Title:** AI Food Passport v0.2.0 — Portfolio Demo Ready

**Release Date:** 2026-06-15

**Release Type:** Portfolio demo / MVP Alpha public demo

**Suggested Git Tag:** `v0.2.0-portfolio-demo-ready`

---

## 1. Release Status

| Item | Status |
|---|---|
| Public web demo | Live |
| Portfolio-ready MVP Alpha | Yes |
| Production-ready | No |
| TestFlight / App Store ready | No |
| Real OCR/AI providers enabled | No |
| API keys in Flutter | None |
| Firebase enabled | No |

---

## 2. Demo Links

| Resource | URL |
|---|---|
| Public Web Demo | [https://allengwong-droid.github.io/ai-food-passport/demo/](https://allengwong-droid.github.io/ai-food-passport/demo/) |
| Privacy Policy | [https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html](https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html) |
| Render Mock Backend Health | [https://ai-food-passport.onrender.com/health](https://ai-food-passport.onrender.com/health) |

---

## 3. What Is Included

### Flutter MVP Application

- **Mock-safe menu analysis**: Capture a menu image, get dish recommendations and home-currency pricing — the full product flow works without any paid APIs.
- **Personalized allergen warnings**: "Contains [allergen]" badges appear on dishes matching your saved dietary preferences, driven by case-insensitive matching.
- **Dietary preferences persistence**: 8 allergens (Gluten, Dairy, Egg, Peanut, Soy, Shellfish, Tree Nut, Sesame) + 5 dietary restrictions (Vegetarian, Vegan, Halal, Kosher, Low FODMAP), saved locally via shared_preferences and surviving app restarts.
- **Session-local scan history**: Each scan creates a history entry with timestamp, dish count, and dish name summary. Entries can be viewed, restored (re-opening the scan result), and cleared. History is in-memory only and resets on app restart or page refresh.
- **Scan result restoration without backend re-call**: Tapping a history entry restores the result instantly from local state — no second API call.
- **Traveler settings**: Home country, currency, and output language with local persistence.

### Public Demo Deployment

- Public Flutter web demo deployed on GitHub Pages at `https://allengwong-droid.github.io/ai-food-passport/demo/`.
- Connects to Render mock backend at `https://ai-food-passport.onrender.com`.
- Privacy policy hosted at GitHub Pages.

### Documentation & QA Package

- [DEMO_PRODUCT_FLOW_SCRIPT.md](DEMO_PRODUCT_FLOW_SCRIPT.md) — 6-act demo with 60s / 2min / detailed narration scripts.
- [MANUAL_QA_CHECKLIST.md](MANUAL_QA_CHECKLIST.md) — 74-point manual QA checklist.
- [DEMO_RECORDING_SHOT_LIST.md](DEMO_RECORDING_SHOT_LIST.md) — 10-shot recording guide (81s).
- [PORTFOLIO_DEMO_PACKAGE.md](PORTFOLIO_DEMO_PACKAGE.md) — Complete portfolio overview with pitch, architecture, talking points.
- [PUBLIC_WEB_DEMO_DEPLOYMENT.md](PUBLIC_WEB_DEMO_DEPLOYMENT.md) — Deployment details and rebuild instructions.
- [PUBLIC_WEB_DEMO_LIVE_VERIFICATION.md](PUBLIC_WEB_DEMO_LIVE_VERIFICATION.md) — Automated + manual live verification (22/22 checks passed).
- [PUBLIC_REPO_FINAL_QA.md](PUBLIC_REPO_FINAL_QA.md) — 9-section final QA (repository confirmed portfolio-ready).
- [MVP_ALPHA_RELEASE_SNAPSHOT.md](MVP_ALPHA_RELEASE_SNAPSHOT.md) — Frozen v0.1 MVP Alpha baseline.
- App icon design line: clean square master source (1254x1254 opaque RGB), design-only 14-size export set; not applied to Flutter/iOS.

---

## 4. What Is Real

| Component | Detail |
|---|---|
| Flutter UI & State | Production-quality Flutter/Dart code with Riverpod state management |
| Dietary Preferences Persistence | Saved to shared_preferences, survives app restart |
| Scan History Behavior | Session-local in-memory history, entries created and restorable |
| Allergen Warning Logic | Case-insensitive matching, badge rendering on result cards |
| Public Web Deployment | GitHub Pages via `docs/demo/`, correctly configured base-href |
| Render Mock Backend | Deployed on Render free tier, responds to health and analyze-menu |

---

## 5. What Is Mock / Limited

| Component | Detail |
|---|---|
| OCR / Image Recognition | Mock-only — deterministic dish data, no real image processing |
| AI Dish Analysis | Mock-only — 2 hardcoded mock dishes per scan |
| Backend `/api/analyze-menu` | Mock-only — Render mock backend, no real provider calls |
| Exchange Rates | Mock-only — hardcoded rates, not live FX data |
| Medical/Allergy Guarantee | None — not suitable for real allergy safety decisions |
| TestFlight / App Store Build | Not available — requires macOS + Apple Developer membership |
| Real OCR/AI Providers | Disabled — no API keys configured anywhere in the project |

---

## 6. Verification

| Check | Result |
|---|---|
| Flutter tests | **97/97 passing** |
| dart analyze | **Zero warnings, zero errors** — 54 pre-existing info-level lints only |
| git diff (product code) | Clean — no untracked or staged changes |
| Public web demo | **Live** — HTTP 200, base-href confirmed correct |
| Privacy policy | **Live** — HTTP 200, content intact |
| Render backend health | **Live** — HTTP 200, `ok: true`, `mock_ocr`, `mock_ai`, `realProvidersEnabled: false`, `productionReady: false` |
| Manual browser QA | **22/22 checks passed** (Phase 26B) |
| lib/ changed | No |
| ios/ changed | No |
| backend/ changed | No |
| pubspec.yaml changed | No |
| docs/demo/ changed | No |
| Secrets / API keys / Firebase added | No |
| productionReady changed | No |
| Real providers enabled | No |

---

## 7. Known Limitations

1. **Render free-tier cold start**: Backend may take 30-60 seconds to respond after idle period.
2. **Scan history is session-local**: Cleared on app restart or page refresh. No cloud sync or persistent storage.
3. **Mock backend only**: No real OCR or AI analysis. Dish results are deterministic mock data, not actual menu analysis.
4. **Not suitable for real allergy safety decisions**: Allergen warning uses mock data — do not rely on this for actual health decisions.
5. **No iOS build validation**: iOS project exists but has never been built. Apple certificates and provisioning profiles do not exist.
6. **No real providers**: Qwen OCR and Qwen Analysis scaffolding exist behind safety gates but are disabled pending real API key.
7. **GitHub Pages propagation delay**: Deployed changes may take 1-3 minutes to appear on the public URL.

---

## 8. Safety Disclaimers

- This release is a **portfolio demo and MVP Alpha**, not a production product.
- Menu analysis results are **deterministic mock data** and do not reflect actual menu content.
- Allergen warnings are driven by **mock analysis data** and should not be used for real allergy safety decisions.
- No medical advice is provided. Consult a healthcare professional for dietary and allergy concerns.
- No real OCR or AI providers are enabled. No API keys are stored in Flutter or the public repository.
- Privacy: The app collects no user data. No analytics, no tracking, no third-party services.

---

## 9. Suggested Next Phase

| Option | Description |
|---|---|
| **Phase 27B: Public Feedback Collection** | Share the demo link, collect user feedback, iterate on UX before committing to real providers. |
| **Phase 27C: Screenshot & Video Package** | Create a polished screenshot set and demo video for portfolio/LinkedIn/GitHub showcase. |
| **Phase 27D: Real Provider Integration Planning** | Plan Qwen OCR/Analysis integration when a real API key and safety policy are ready. |
| **Phase 26C: GitHub UI Configuration** | Configure GitHub About, Topics, website URL, LICENSE file, and pinned repository. |

---

## Appendix: Release Artifacts

| File | Description |
|---|---|
| `RELEASE_V0_2_0_PORTFOLIO_DEMO_READY.md` | This file — complete release notes |
| `GITHUB_RELEASE_V0_2_0_DRAFT.md` | Copy-paste-ready GitHub Release body |
| `PHASE_27A_REPORT.md` | Phase report with verification data and change log |
| `ROADMAP.md` | Updated with Phase 27A entry |
| `README.md` | Updated with release link (if applicable) |
