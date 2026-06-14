# AI Food Passport — Portfolio Handoff Packet

> **Status**: Mock-only. All real providers disabled. Ready for portfolio presentation.
> **Last updated**: 2026-06-14 (Phase 19A)
> **Latest tag**: `phase-18d-public-repo-qa-audit`

---

## 1. One-Sentence Pitch

AI Food Passport is a Flutter mobile app that helps travelers understand foreign menus, compare prices in their home currency, and choose dishes that fit their taste and dietary safety profile — with the entire OCR + AI analysis pipeline proxied through a backend that enforces provider safety gates.

---

## 2. 30-Second Explanation

AI Food Passport solves a real traveler pain point: standing in front of a foreign menu and not knowing what anything says, what it costs in your own currency, or whether it is safe to eat given your allergies and preferences.

The app lets you point your camera at any menu — any language, any cuisine — and instantly get:

- Translated dish names and descriptions
- Prices converted to your home currency
- Personalized recommendations based on dietary restrictions, allergies, and taste affinity

The MVP Alpha demonstrates the complete scan → results → dish detail flow against a deployed Render backend. All analysis is mock data today; the real AI pipeline is fully implemented behind safety gates, ready to activate when a provider key is supplied.

---

## 3. Two-Minute Explanation

AI Food Passport addresses a gap in the travel-tech space: existing translation tools handle individual words, and currency converters handle numbers, but neither understands what a dish *is* — its ingredients, allergens, preparation style, or whether it matches your personal profile.

### How It Works

1. **Scan** — The user captures or selects a menu image from their gallery.
2. **OCR** — The app (or backend) extracts raw text from the menu, detecting language automatically.
3. **AI Analysis** — Each dish is parsed, translated, and enriched with: ingredients, allergens, taste profile, and a personalized recommendation reason.
4. **Price Intelligence** — Prices are detected in the menu's local currency and converted to the traveler's home currency.
5. **Results** — A scrollable list of dishes with safety badges, price comparisons, and match scores. Tapping any dish opens a detail view with full ingredient lists and reasoning.

### Architecture Choices

The system uses a **Flutter frontend** with a **Node.js + Express backend** deployed on Render. This architecture was chosen deliberately:

- **Backend proxy**: Keeps API keys and provider credentials on server infrastructure only — never in client code. The Flutter app sends menu images to the backend; the backend handles OCR, AI analysis, and returns results.
- **Provider safety gates**: Real providers (Qwen OCR, Qwen Analysis) are implemented behind triple safety gates (`PROVIDER=enabled=true+KEY=valid`). Until all three conditions are met, the system routes to mock providers only. This prevents accidental API usage and cost leakage.
- **Mock-first development**: All features are built against deterministic mock data, making the app fully demonstrable without any external API dependencies.

### Current State

- **226 automated tests** verify the safety gates across all provider paths.
- **Render deployment** is live at `https://ai-food-passport.onrender.com` with mock providers only.
- **7 portfolio screenshots** capture the complete user flow: onboarding → home → profile → scan → results → dish detail.
- **Public repo QA passed** — no secrets, no broken links, no misleading claims.

---

## 4. What the Demo Shows

The demo walks through the complete user journey:

| Step | Screen | What It Demonstrates |
|---|---|---|
| 00 | Onboarding | App introduction, "QUICK PREVIEW" entry point |
| 01 | Home | Current mission (Tokyo), scan call-to-action, recent crossings |
| 02 | Profile | Traveler settings: home country, currency, language, dietary restrictions, allergies |
| 03 | Scan | Menu image selection, staged processing overlay with progress messages |
| 04 | Results | Dish list with safety badges, match scores, home-currency prices |
| 05 | Dish Detail | Full dish view: local price, converted price, exchange rate, ingredients, allergens, recommendation reason |
| 06 | Dish Detail (alternate) | Second dish showing different allergen profile and recommendation |

All results are served from the live Render backend (`https://ai-food-passport.onrender.com`) and are deterministic: every scan produces the same 2 mock dishes (Tonkotsu Ramen + Miso Katsu Skewers).

---

## 5. What Is Intentionally Mocked

Everything that touches external services is mocked — **by design**. This is not a shortcoming; it is a deliberate engineering choice that makes the app demonstrable, testable, and safe at all times.

| Component | Mock Behavior | Why |
|---|---|---|
| OCR | Returns pre-written menu text (Japanese) | No real OCR API keys needed; demo is deterministic |
| AI Analysis | Returns 2 hardcoded dishes with full detail | No real LLM costs; results are always correct and reviewable |
| Exchange Rates | Static lookup table (USD, EUR, GBP, JPY, CNY, etc.) | No external API dependency; demo works offline |
| Authentication | None | Firebase is planned but not yet integrated |
| Storage | `shared_preferences` (local only) | No cloud sync needed for demo |

**Safety declaration**: `productionReady` remains `false`. `realProvidersEnabled` remains `false`. No API keys exist anywhere in this repository or on the Render deployment. Every real provider code path is unreachable behind safety gates.

---

## 6. Technical Work Completed

### Flutter Frontend

- **6 screens**: Onboarding, Home, Profile, Scan, Results, Dish Detail
- **Scanner-style UI**: Gallery image selection with staged processing overlay
- **Personalization engine**: Taste profile, dietary restrictions, allergy flags
- **Price intelligence**: Local currency detection + home currency conversion display
- **Multilingual support**: Mock copy in 6 languages based on traveler output-language setting
- **Developer controls gating**: All debug panels hidden in release builds; toggle via `--dart-define`
- **Backend URL config**: `BACKEND_BASE_URL` via dart-define; no secrets in Flutter code
- **42 unit/widget tests**: All passing

### Backend Proxy Architecture

- **Node.js + Express server** with structured error handling
- **OCR-first pipeline**: Scan → OCR → text extraction → AI analysis → results
- **Controlled debug scenarios**: Success, low confidence, empty text, failure recovery — all through `/api/analyze-menu`
- **CORS enforcement + body limit enforcement**
- **Health endpoint**: `GET /health` returns provider status, config validity, and readiness flags
- **509+ automated tests**: 68 contract + 158 unit for provider gates only; 400+ additional across all phases

### Render Mock Deployment

- **Deployed URL**: `https://ai-food-passport.onrender.com`
- **Blueprint template**: `backend/render.yaml` (safe placeholder-only; no API keys)
- **Dry-run checklist**: 8-part deployment verification
- **Live verified**: Health, analyze-menu, error handling all tested against deployed instance

### Provider Safety Gates

- **Triple-gate system**: `PROVIDER=<name>` + `<PROVIDER>_ENABLED=true` + `<PROVIDER>_API_KEY=valid` — all three must be set before any real API call
- **Qwen OCR adapter**: Full implementation behind gates; routes to `mock_ocr` by default
- **Qwen Analysis adapter**: Full implementation behind gates; routes to `mock_ai` by default
- **226 gate-specific tests**: 68 real-provider-gate contract tests + 158 unit tests
- **Provider routing skeleton**: Modes `mock`, `china`, `global`, `auto` — all resolve safely to mock today

### Demo Screenshot Package

- **7 screenshots** in `docs/screenshots/mvp-alpha/`:
  - `00-onboarding.png`, `01-home.png`, `02-profile.png`
  - `03-scan.png`, `04-results.png`, `05-dish-detail.png`, `06-dish-detail-alt.png`
- **Screenshot plan**: `MVP_ALPHA_SCREENSHOT_PLAN.md`
- **Data source alignment fix**: Root-cause analysis and fix for backend routing + OCR language detection (Phase 18B0)

### Public Repo QA

- **Full audit**: All docs checked for broken links, misleading claims, and leaked secrets
- **Zero secrets found**: No API keys, Firebase credentials, or `.env` files in the repository
- **Fixed 2 issues**: Removed misleading "Still Not Implemented" item; replaced stale "Next" section
- **Final verdict**: READY for portfolio sharing

---

## 7. What NOT to Claim

When presenting this project in interviews, portfolio reviews, or demo settings, **do not claim**:

| Do NOT Claim | Reality |
|---|---|
| "Production-ready" | `productionReady` is `false`. The backend is mock-only. No real providers are enabled. |
| "Uses real AI OCR" | All OCR output is deterministic mock data. The real Qwen OCR adapter exists but is behind disabled safety gates. |
| "Uses real AI analysis" | All dish analysis is deterministic mock data. The real Qwen Analysis adapter exists but is behind disabled safety gates. |
| "Ready for App Store" | No App Store screenshots, metadata, compliance review, or production backend exist. |
| "Uses Firebase" | No Firebase is integrated. Authentication and cloud sync are future work. |

**What you CAN claim**: A fully functional Flutter MVP Alpha with a deployed backend proxy, complete user flow, 509+ passing tests, rigorous provider safety gates, portfolio-quality screenshots, and public-repo-ready documentation.

---

## 8. Suggested Talking Points

### For Technical Interviews

- **Architecture decision**: Why the backend proxy pattern matters for AI apps — keeps API keys server-side, enables provider switching without client updates, and enforces cost/safety guardrails.
- **Safety gates**: The triple-gate design (`provider name + enabled flag + valid key`) prevents accidental real API calls and cost leakage. All 226 gate tests pass before any real provider can activate.
- **Mock-first development**: Building against deterministic mock data means the app is always demonstrable, testable, and reviewable — no API outages or rate limits can block a demo.
- **Test discipline**: 509+ automated tests across 18+ phases, including contract tests that verify the safety gates prevent real provider access under all conditions.
- **Deployment**: Render free-tier deployment with zero-code-change Node.js setup. Blueprint template, dry-run checklist, and manual verification process documented.

### For Product/Design Interviews

- **Real user pain point**: Menu anxiety is a universal travel experience. Existing tools solve translation and currency conversion separately but don't understand food.
- **Personalization**: Dietary restrictions, allergies, and taste preferences make the output personal — not just a translation.
- **Onboarding flow**: "QUICK PREVIEW" button gets users to value in one tap. Full profile setup is available but never required.
- **Scan UX**: Staged progress messages keep users informed during processing. Recovery UX handles failures gracefully.

### For Portfolio Reviews

- **End-to-end ownership**: Flutter frontend, Node.js backend, Render deployment, provider architecture, safety gates, test suite, and documentation — all built and documented.
- **Clean repo**: No secrets, no broken links, no misleading claims. Fully audited and portfolio-ready.
- **7 screenshots**: Walk through the complete user flow from onboarding to dish detail.

---

## 9. Known Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| **Mock-only backend** | All scans return the same 2 dishes regardless of input image | Clearly documented everywhere; framed as a deliberate demo strategy |
| **Render free-tier cold start** | First request after 15+ minutes of inactivity takes 30-60 seconds | Demo script accounts for this; health-check pre-warming recommended |
| **No real OCR or AI** | Cannot demonstrate actual text extraction or analysis quality | Real providers are fully implemented behind gates; can activate with a key |
| **No authentication** | No user accounts, login, or cloud sync | Planned for future phase; local `shared_preferences` used for settings |
| **No real exchange rates** | Currency conversion uses static rates | Real exchange-rate API planned; static rates are accurate enough for demo |
| **Deterministic results only** | No variability between scans | Makes demo consistent and reviewable; real providers would add variability |
| **No backend homepage** | `GET /` returns 404 | By design; use `GET /health` for status |

---

## 10. Next Realistic Engineering Steps

| Step | Prerequisites | What It Involves |
|---|---|---|
| **Phase 16B: Qwen OCR real smoke test** | Real Qwen API test key (backend-only) | Enable `QWEN_API_KEY` + `OCR_PROVIDER=qwen_ocr` + `QWEN_OCR_PROVIDER_ENABLED=true` on Render; verify real OCR output for one test image |
| **Phase 16C: Qwen Analysis real smoke test** | Phase 16B completed | Enable `ANALYSIS_PROVIDER=qwen_analysis` + `QWEN_ANALYSIS_PROVIDER_ENABLED=true`; verify real dish analysis |
| **Phase 16D: Combined OCR + Analysis test** | Phases 16B + 16C completed | End-to-end real provider test: menu image → real OCR → real analysis → dish results |
| **Auth/account system** | Firebase project setup | Email + social login, user profiles, cloud-synced preferences |
| **Persistent scan history** | Auth system + database | Save scans per user, browse history, revisit past dishes |
| **Production security hardening** | Real providers enabled | Rate limiting, request logging, secret rotation, CORS tightening, HTTPS enforcement |
| **Real exchange-rate API** | API key for exchange-rate service | Replace static rates with live rates |
| **App Store readiness** | Production backend, real providers, auth | App Store screenshots, metadata, privacy policy, compliance review |

All real-provider steps require a **backend-only API key** — never committed to the repository, never embedded in Flutter code.

---

## Safety Language Summary

- **Mock-only backend**: All OCR and analysis results are deterministic mock data.
- **No real providers enabled**: `realProvidersEnabled` is `false` on Render and in all test environments.
- **`productionReady` remains `false`**: This flag has never been set to `true`.
- **API keys belong on backend infrastructure only**: Never in Flutter, never in the repository, never in `render.yaml`.
- **All real provider code paths are behind triple safety gates**: Can only be activated by setting 3 environment variables simultaneously on the backend.
