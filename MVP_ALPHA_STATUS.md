# MVP Alpha Status

> **Last updated**: 2026-06-14 (Phase 17A)
> **Status**: Mock-only. All real providers disabled. Ready to demo.

## Quick Demo

```bash
cd AI-Food-Passport
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

Opens Flutter Web at `http://127.0.0.1:8081`, connected to the live Render mock backend.

## Deployed Backend

| Endpoint | URL | Result |
|---|---|---|
| Health | `GET https://ai-food-passport.onrender.com/health` | `ok: true` |
| Analyze Menu | `POST https://ai-food-passport.onrender.com/api/analyze-menu` | `ok: true`, 2 mock dishes |

### Backend Configuration

| Field | Value |
|---|---|
| `activeOcrProvider` | `mock_ocr` |
| `activeAnalysisProvider` | `mock_ai` |
| `realOcrEnabled` | `false` |
| `realAnalysisEnabled` | `false` |
| `realProvidersEnabled` | `false` |
| `productionReady` | `false` |
| `configValid` | `true` |
| `analysisConfigValid` | `true` |

## Expected Demo Output

Scanning any menu image produces **2 deterministic mock dishes**:

| Dish | Price | Allergens | Reason |
|---|---|---|---|
| **Tonkotsu Ramen** | ¥980 | Wheat, Egg | Rich pork broth ramen — a hearty classic. Mild spice level, generally safe for most travelers. |
| **Miso Katsu Skewers** | ¥800 | Soy, Wheat, Egg | Crispy fried skewers with savory miso glaze. Contains soy and wheat — check your allergy settings. |

- Home currency conversion works for all supported currencies (USD, EUR, GBP, JPY, CNY, etc.).
- Dish Detail shows local price, home-currency price, exchange rate, ingredients, and recommendation reason.

## Test Suite

| Suite | Tests | Status |
|---|---|---|
| Flutter unit/widget | 42 | All pass |
| Backend contract (realProviderGate) | 68 | All pass |
| Backend unit (Qwen providers) | 158 | All pass |
| Backend total (all tests) | 509+ | All pass |
| Git (`diff --check`, `status --short`) | — | Clean |

## Known Limitations

- **Mock-only**: All results are deterministic mock data — no real OCR or AI analysis.
- **Render sleep**: Free-tier instances spin down after 15 minutes of inactivity. First request after sleep may take 30-60 seconds (cold start).
- **No homepage**: `GET /` returns 404 by design. Use `GET /health` or `POST /api/analyze-menu`.
- **No real providers**: Qwen OCR and Qwen Analysis are implemented behind safety gates but **not enabled**. All three env gates (`QWEN_API_KEY`, `QWEN_OCR_PROVIDER_ENABLED`/`QWEN_ANALYSIS_PROVIDER_ENABLED`, `OCR_PROVIDER`/`ANALYSIS_PROVIDER`) must be set before real calls are possible.
- **No API keys**: No `QWEN_API_KEY`, DeepSeek key, or any other provider key is configured on Render or committed to the repository.
- **No Firebase**: Authentication, cloud sync, and persistent storage are not yet integrated.
- **Developer controls hidden**: By default in release builds. Use `--dart-define=SHOW_DEVELOPER_CONTROLS=true` for debug.

## What Is Implemented

- Scanner-style Scan screen with gallery image selection
- Processing overlay with staged progress messages
- Deterministic mock dish recommendations with price intelligence
- Dish Detail: local price, home-currency price, exchange rate, ingredients, allergens, recommendation reason
- Traveler settings: home country, home currency, output language — persisted locally
- Multilingual mock helper copy (6 languages)
- Backend mock server with OCR-first pipeline and controlled debug scenarios
- OCR and analysis provider registries with safe config validation
- Provider routing decision skeleton (modes: `mock`, `china`, `global`, `auto`)
- Secret handling and real-provider readiness documentation
- Logging redaction and safe error response utilities
- CORS enforcement and request body limit enforcement
- Developer controls gating (hidden in release builds)
- Render deployment with health and analyze-menu endpoints
- Flutter backend URL configuration via dart-define
- Real provider safety gates with 226 automated tests

## What Is Not Implemented

- Real OCR (Qwen VL, or any other OCR provider)
- Real AI analysis (Qwen, DeepSeek, OpenAI, Claude, Gemini)
- Real exchange-rate API
- Firebase authentication, cloud sync, or persistence
- Subscriptions or purchase flow
- App Store readiness (screenshots, metadata, compliance)
- Production secret management

## Related Docs

| Document | Purpose |
|---|---|
| [README.md](README.md) | Project overview, architecture, and developer guide |
| [MVP_ALPHA_DEMO_RUNBOOK.md](MVP_ALPHA_DEMO_RUNBOOK.md) | Step-by-step demo script and manual QA runbook |
| [PHASE_15C_MANUAL_SMOKE_TEST.md](PHASE_15C_MANUAL_SMOKE_TEST.md) | Post-polish manual smoke test checklist |
| [REAL_PROVIDER_PREFLIGHT_PLAN.md](REAL_PROVIDER_PREFLIGHT_PLAN.md) | Real provider safety gates and enablement plan |
| [PHASE_16B0_DRY_RUN_REPORT.md](PHASE_16B0_DRY_RUN_REPORT.md) | Real provider gate dry-run verification |
| [MVP_ALPHA_RELEASE_SNAPSHOT.md](MVP_ALPHA_RELEASE_SNAPSHOT.md) | Frozen Alpha baseline snapshot (commit `d097239`) |
| [MVP_ALPHA_SCREENSHOT_PLAN.md](MVP_ALPHA_SCREENSHOT_PLAN.md) | Screenshot capture plan and portfolio description |
| [ROADMAP.md](ROADMAP.md) | Full phase history and future plans |
| [backend/DEPLOYMENT_READINESS.md](backend/DEPLOYMENT_READINESS.md) | Backend deployment readiness checklist |

## Next Steps

- **Phase 16B**: Qwen OCR real smoke test — requires a real backend-only test API key
- **Phase 16C**: Qwen Analysis real smoke test — requires 16B completed
- **Phase 16D**: Combined OCR + Analysis real smoke test — requires 16B and 16C completed
- **Firebase integration**: Authentication, cloud sync, persistence
- **Real exchange-rate API**: Replace mock currency conversion
- **App Store preparation**: Screenshots, metadata, compliance review
