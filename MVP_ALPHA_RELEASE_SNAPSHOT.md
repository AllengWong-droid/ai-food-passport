# MVP Alpha Release Snapshot

> **Snapshot Date**: 2026-06-14
> **Commit**: `d097239`
> **Tag**: `phase-17a-mvp-alpha-demo-packaging`
> **Status**: Frozen Alpha baseline. Mock-only. No real providers enabled.
> **productionReady**: `false`

---

## What Works

| Feature | Status | Notes |
|---|---|---|
| Flutter Web Demo | ✅ Works | Run with `BACKEND_BASE_URL` dart-define |
| Render Backend (mock mode) | ✅ Live | `https://ai-food-passport.onrender.com` |
| Onboarding Flow | ✅ Works | "QUICK PREVIEW" CTA, allergy selection |
| Profile / Developer Controls | ✅ Works | Debug builds only (`SHOW_DEVELOPER_CONTROLS=true`) |
| Scan / Analyze Flow | ✅ Works | Scanner UI → processing overlay → mock results |
| Results Screen | ✅ Works | Dynamic dish count, "Last scanned menu" |
| Dish Detail Flow | ✅ Works | Price, allergens, ingredients, recommendation reason |
| Expected Dishes | ✅ Deterministic | **Tonkotsu Ramen** (¥980, Wheat/Egg), **Miso Katsu Skewers** (¥800, Soy/Wheat/Egg) |
| Home Currency Conversion | ✅ Works | USD, EUR, GBP, JPY, CNY, etc. |
| Traveler Settings Persistence | ✅ Works | Home country, currency, output language saved locally |
| Multilingual Mock Copy | ✅ Works | EN, JA, ZH-HANS, ZH-HANT, KO, TH |
| Backend Mock Server | ✅ Live | Health check, analyze-menu endpoint |
| Provider Gate Unit Tests | ✅ 226 tests | 68 contract + 158 unit — all pass |
| Flutter Unit/Widget Tests | ✅ 42 tests | All pass |
| CORS Enforcement | ✅ Active | Backend rejects non-allowlisted origins |
| Request Body Limit | ✅ Active | 10 MB cap on POST body |
| Logging Redaction | ✅ Implemented | No secrets in logs |
| Safe Error Responses | ✅ Implemented | No stack traces or secrets in errors |

---

## How to Run

### Prerequisites

- Flutter SDK installed
- Browser (Chrome recommended for `flutter run -d web-server`)
- Network access to `https://ai-food-passport.onrender.com`

### 1. Start Flutter Web Against Render Backend

```bash
cd /path/to/AI-Food-Passport
flutter run -d web-server \
  --web-hostname=127.0.0.1 \
  --web-port=8081 \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

Then open: `http://127.0.0.1:8081`

### 2. Verify Render Backend Health

```bash
curl -s https://ai-food-passport.onrender.com/health | python -m json.tool
```

Expected:
```json
{
  "ok": true,
  "mode": "mock",
  "activeOcrProvider": "mock_ocr",
  "activeAnalysisProvider": "mock_ai",
  "realProvidersEnabled": false,
  "realOcrEnabled": false,
  "realAnalysisEnabled": false,
  "productionReady": false,
  "configValid": true,
  "analysisConfigValid": true
}
```

### 3. Smoke Test Analyze-Menu Endpoint

```bash
curl -s -X POST https://ai-food-passport.onrender.com/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{}' | python -m json.tool
```

Expected: `ok: true` with 2 mock dishes (Tonkotsu Ramen, Miso Katsu Skewers).

---

## What Is Intentionally Not Included

| Feature | Reason |
|---|---|
| Real Qwen OCR | Requires API key + safety gate enablement (Phase 16B) |
| Real Qwen Analysis | Requires API key + safety gate enablement (Phase 16C) |
| Firebase | Planned for post-Alpha (auth, cloud sync, persistence) |
| Production Authentication | Planned for post-Alpha |
| `productionReady: true` | Must remain `false` until all gates verified |
| App Store Readiness | Planned for Beta/Release |
| Real Exchange-Rate API | Using deterministic mock rates |
| Subscriptions / IAP | Planned for post-Alpha |
| Saved Scan History | Planned for post-Alpha (requires Firebase) |

---

## Safety Status

| Check | Status |
|---|---|
| No provider keys in Flutter code | ✅ Confirmed — zero key references in Flutter source |
| No provider keys in Git | ✅ Confirmed — `.env` is gitignored; no keys committed |
| No keys in `render.yaml` | ✅ Confirmed — only safe placeholders |
| `realProvidersEnabled: false` | ✅ Verified on deployed backend |
| `productionReady: false` | ✅ Verified on deployed backend |
| Developer controls gated in release | ✅ Confirmed — `SHOW_DEVELOPER_CONTROLS` defaults to `false` |
| No real provider calls possible without 3+ env gates | ✅ Verified by 226 gate tests |

---

## Known Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| Mock-only results | Deterministic, not real OCR/AI | Phase 16B/16C will enable real providers |
| Render free-tier sleep | First request after inactivity takes 30-60s | Inform demo audience; ping `/health` before demo |
| `GET /` returns 404 | No homepage route implemented | Use `/health` or `/api/analyze-menu` |
| `/api/analyze-menu` must not have trailing slash | Render routing | Client must send exact path |
| No real allergy disclaimers | Mock demo only | Add production disclaimers before Beta |
| Cold start delay (Render) |.demo flow interruption | Pre-warm backend before demo |
| No offline mode | Requires backend connection | Planned for future (local fallback) |

---

## Next Possible Phases

### If a Real Qwen Test Key Exists

| Phase | Prerequisite | Description |
|---|---|---|
| **16B**: Qwen OCR Real Smoke Test | Real `QWEN_API_KEY` (backend-only) | Enable real OCR with safety gates; verify billable call |
| **16C**: Qwen Analysis Real Smoke Test | 16B complete | Enable real analysis; verify billable call |
| **16D**: Combined Real Provider Smoke Test | 16B + 16C complete | Full real pipeline end-to-end |

### Regardless of API Key Availability

| Phase | Description |
|---|---|
| UI Polish | Refine animations, transitions, microcopy |
| Demo Screenshots | Capture high-quality screens for documentation/App Store |
| Persistence / Auth Planning | Design Firebase integration architecture |
| App Store Metadata Prep | Screenshots, descriptions, keywords |
| Beta TestFlight Setup | iOS distribution preparation |
| Firebase Auth Integration | User accounts, cloud sync |
| Real Exchange-Rate API | Replace mock currency conversion |

---

## Snapshot Artifacts

| Artifact | Path | Purpose |
|---|---|---|
| This snapshot | `MVP_ALPHA_RELEASE_SNAPSHOT.md` | Frozen baseline reference |
| Demo runbook | `MVP_ALPHA_DEMO_RUNBOOK.md` | Step-by-step demo script |
| Status overview | `MVP_ALPHA_STATUS.md` | One-page status for quick reference |
| Manual smoke test | `PHASE_15C_MANUAL_SMOKE_TEST.md` | QA verification checklist |
| Real provider plan | `REAL_PROVIDER_PREFLIGHT_PLAN.md` | Safety gates and enablement plan |
| Gate dry-run report | `PHASE_16B0_DRY_RUN_REPORT.md` | 226 gate tests verification |
| Roadmap | `ROADMAP.md` | Full phase history |
| Test checklist | `TESTING_CHECKLIST.md` | All testing phases and results |

---

## Reproducibility

To reproduce this exact snapshot:

```bash
git clone <repo-url>
cd AI-Food-Passport
git checkout d097239
flutter test               # should pass 42/42
node --test backend/tests/  # should pass all tests
```

Then run the Flutter Web demo as described in "How to Run" above. The Render backend at `https://ai-food-passport.onrender.com` should still be serving mock responses from the `d097239` deployment.
