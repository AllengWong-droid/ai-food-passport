# AI Food Passport 鈥?MVP Alpha Release Notes

> **Release**: MVP Alpha (portfolio preview)
> **Date**: 2026-06-14
> **Commit**: `253f315` (tag `phase-19b-demo-walkthrough-script`)
> **Status**: Mock-only. All real providers disabled. `productionReady: false`.

---

## 1. Release Title

**AI Food Passport MVP Alpha** 鈥?Flutter Frontend + Render Mock Backend + Provider Safety Gates

---

## 2. Short Summary

AI Food Passport is a Flutter mobile application that helps travelers understand foreign menus using OCR and AI analysis. Point your camera at a menu 鈥?any language, any cuisine 鈥?and the app translates every dish, converts prices to your home currency, and flags allergens based on your dietary profile.

This MVP Alpha release demonstrates the complete scan-to-results user flow against a live Render backend. All AI analysis is mock data today. Real provider integration paths are prepared behind backend safety gates, but no real provider is enabled in MVP Alpha.

---

## 3. What Is Included

### Application & Infrastructure

| Component | Description |
|---|---|
| **Flutter Web Demo** | 6 screens: Onboarding, Home, Profile, Scan, Results, Dish Detail. Complete scan-to-results flow with staged processing overlay. |
| **Render Mock Backend** | Deployed Node.js + Express server at `https://ai-food-passport.onrender.com`. Health and analyze-menu endpoints verified. |
| **Deterministic Mock Analysis** | Every scan returns 2 consistent, reviewable dishes: Tonkotsu Ramen (楼980) and Miso Katsu Skewers (楼800). |
| **Provider Safety Gates** | Triple-gate system prevents real API calls: provider name + enabled flag + valid API key must ALL be set. 226 automated tests verify. |

### Portfolio Documentation

| Document | Purpose |
|---|---|
| **7 Screenshots** (`docs/screenshots/mvp-alpha/`) | Full user flow captured: onboarding 鈫?home 鈫?profile 鈫?scan 鈫?results 鈫?2x dish detail |
| **Demo Showcase** ([MVP_ALPHA_DEMO_SHOWCASE.md](MVP_ALPHA_DEMO_SHOWCASE.md)) | Polished portfolio walkthrough with screenshots, system status, limitations |
| **Portfolio Handoff** ([PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md)) | Pitch, talking points, claim boundaries, next engineering steps |
| **Walkthrough Script** ([DEMO_WALKTHROUGH_SCRIPT.md](DEMO_WALKTHROUGH_SCRIPT.md)) | 30s/90s/3min recording scripts, screen-by-screen narration, recording checklist |
| **Demo Runbook** ([MVP_ALPHA_DEMO_RUNBOOK.md](MVP_ALPHA_DEMO_RUNBOOK.md)) | Step-by-step technical QA walkthrough |
| **Release Snapshot** ([MVP_ALPHA_RELEASE_SNAPSHOT.md](MVP_ALPHA_RELEASE_SNAPSHOT.md)) | Frozen Alpha baseline (commit `d097239`) |

### Test Suite

| Suite | Tests | Status |
|---|---|---|
| Flutter unit/widget | 42 | All pass |
| Backend provider safety gates | 226 | All pass (verified in Phase 16B0) |

Additional phase-level checks are documented in individual phase reports.

---

## 4. Demo Command

```bash
cd AI-Food-Passport
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

Open `http://127.0.0.1:8081` in Chrome.

> **Tip**: The Render free instance may take 30-60 seconds to wake up on first request. Pre-warm it:
> ```bash
> curl https://ai-food-passport.onrender.com/health
> ```

---

## 5. Expected Demo Dishes

Scanning any menu image (or tapping the scan button directly) produces exactly:

| Dish | Local Price | Allergens | Recommendation |
|---|---|---|---|
| **Tonkotsu Ramen** | 楼980 | Wheat, Egg | Rich pork broth ramen 鈥?a hearty classic. Mild spice level, generally safe for most travelers. |
| **Miso Katsu Skewers** | 楼800 | Soy, Wheat, Egg | Crispy fried skewers with savory miso glaze. Contains soy and wheat 鈥?check your allergy settings. |

Prices are converted to the traveler's home currency using static mock exchange rates. All results are deterministic by design.

---

## 6. Safety & Scope Boundaries

### What This Release IS

- A **fully functional Flutter MVP Alpha** with a complete scan-to-results user flow
- A **deployed Render backend** with health and analyze-menu endpoints
- A **rigorously tested provider safety gate system** (226 tests)
- A **portfolio-ready documentation package** (screenshots, showcase, handoff, walkthrough script, release notes)

### What This Release IS NOT

| Boundary | Value |
|---|---|
| **Production-ready** | No. `productionReady` is explicitly `false`. |
| **Using real AI providers** | No. All OCR and analysis is deterministic mock data. Qwen OCR and Qwen Analysis integration paths are prepared but disabled behind backend safety gates. |
| **Ready for App Store** | No. No App Store screenshots, metadata, compliance review, or production backend. |
| **Using Firebase** | No. No authentication, cloud sync, or persistent storage. Guest passport mode only. |
| **Using real exchange rates** | No. Static mock rates for USD, EUR, GBP, JPY, CNY, etc. |

### Key Safety Facts

- **Mock-only backend**: `activeOcrProvider: mock_ocr`, `activeAnalysisProvider: mock_ai`
- **No real providers enabled**: `realProvidersEnabled: false`
- **No API keys in Flutter**: All future provider keys will live on Render backend environment variables only
- **No API keys committed**: Zero secrets in the repository, verified by multiple grep audits
- **`productionReady` remains `false`**: This flag has never been set to `true`

---

## 7. Known Limitations

| Limitation | Impact |
|---|---|
| **Mock-only analysis** | All scans return the same 2 dishes regardless of input image. |
| **Render free-tier cold start** | First request after 15+ minutes of inactivity takes 30-60 seconds. |
| **No real OCR or AI** | Real providers are implemented but disabled. Requires a Qwen API key to activate. |
| **No authentication** | Guest passport only. No accounts, login, or cloud sync. |
| **Static exchange rates** | Currency conversion uses fixed lookup table, not live rates. |
| **Backend has no homepage** | `GET /` returns 404. Use `GET /health` for status checks. |
| **Developer controls hidden in release** | Backend Mock Mode toggle requires `SHOW_DEVELOPER_CONTROLS=true`. |

---

## 8. Suggested GitHub Release Body

Copy and paste this into a GitHub release description:

```markdown
# AI Food Passport 鈥?MVP Alpha

A Flutter mobile application that helps travelers understand foreign menus using
OCR and AI analysis. Point your camera at a menu in any language, and the app
translates every dish, converts prices to your home currency, and flags allergens
based on your dietary profile.

## What's Included

- **Flutter Web Demo**: 6 screens 鈥?Onboarding, Home, Profile, Scan, Results, Dish Detail
- **Render Mock Backend**: Deployed at https://ai-food-passport.onrender.com
- **Provider Safety Gates**: Triple-gate system prevents real API calls (226 tests)
- **Portfolio Documentation**: Screenshots, showcase, handoff packet, walkthrough script

## Demo

```bash
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

## Status

- `productionReady`: **false**
- `realProvidersEnabled`: **false**
- Active providers: `mock_ocr`, `mock_ai`
- Flutter tests: 42/42 pass
- Backend provider safety gates: 226 tests pass

## Important

This is an MVP Alpha portfolio preview. All AI analysis is deterministic mock data.
Real provider integration paths are prepared behind safety gates but no real provider
is enabled. No API keys, Firebase, or production configurations are included.

See [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md) for pitch, talking points, and
next engineering steps.
```

---

## 9. Suggested Portfolio / LinkedIn Blurb

### LinkedIn / Portfolio (short)

> **AI Food Passport** 鈥?A Flutter mobile app I built to help travelers understand foreign menus. Scan any menu, and the app translates every dish, converts prices to your home currency, and flags allergens based on your dietary profile.
>
> **Tech**: Flutter frontend + Node.js/Express backend proxy + Render deployment. Real AI provider integration paths are prepared behind triple safety gates with 226 automated tests. Portfolio-ready documentation with screenshots, demo showcase, and recording script.
>
> **Status**: MVP Alpha 鈥?mock-only backend. `productionReady: false`. All API keys kept server-side.
>
> 馃敆 [GitHub repo link] | 馃摳 [Screenshots link]

### LinkedIn / Portfolio (longer, technical)

> I built **AI Food Passport** 鈥?a Flutter mobile application that addresses a real travel pain point: standing in front of a foreign menu with no idea what anything says, what it costs, or whether it's safe to eat.
>
> **How it works**: Point your camera at a menu 鈫?OCR extracts text 鈫?AI analyzes each dish 鈫?results show translated names, home-currency prices, allergens, and personalized recommendations.
>
> **Technical highlights**:
> - Flutter frontend with 6 screens and complete scan-to-results flow
> - Node.js/Express backend proxy deployed on Render 鈥?keeps API keys server-side
> - Triple provider safety gate system (name + enabled flag + valid key) prevents accidental AI API calls 鈥?226 automated tests verify every gate state
> - Portfolio package: 7 screenshots, demo showcase, handoff packet, walkthrough script with 30s/90s/3min recording scripts
>
> **What I learned**: Building AI apps requires rigorous provider safety gates, mock-first development, and clear separation between client code and server-side credentials. The backend proxy pattern is essential for keeping API keys safe.
>
> **Status**: MVP Alpha. Real AI provider integration paths are prepared and tested behind gates, waiting for an API key. Production hardening and App Store readiness are the next engineering steps.
>
> 馃敆 [GitHub repo link] | 馃搫 [PORTFOLIO_HANDOFF.md]

---

## 10. Links

| Document | Purpose |
|---|---|
| [MVP_ALPHA_DEMO_SHOWCASE.md](MVP_ALPHA_DEMO_SHOWCASE.md) | Polished portfolio showcase with 7 screenshots |
| [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md) | Portfolio pitch, talking points, claim boundaries |
| [DEMO_WALKTHROUGH_SCRIPT.md](DEMO_WALKTHROUGH_SCRIPT.md) | Recording scripts (30s/90s/3min), narration, checklist |
| [MVP_ALPHA_STATUS.md](MVP_ALPHA_STATUS.md) | One-page system status overview |
| [MVP_ALPHA_DEMO_RUNBOOK.md](MVP_ALPHA_DEMO_RUNBOOK.md) | Technical QA walkthrough |
| [MVP_ALPHA_RELEASE_SNAPSHOT.md](MVP_ALPHA_RELEASE_SNAPSHOT.md) | Frozen Alpha baseline snapshot |
| [ROADMAP.md](ROADMAP.md) | Full phase history and future plans |
| [README.md](README.md) | Project overview and developer guide |

---

## Version History

| Release | Date | Tag | Notes |
|---|---|---|---|
| MVP Alpha (this release) | 2026-06-14 | `phase-19b-demo-walkthrough-script` | Portfolio preview: mock-only, all docs complete |
| Alpha baseline snapshot | 2026-06-14 | `phase-17a-mvp-alpha-demo-packaging` | Frozen baseline (commit `d097239`) |
