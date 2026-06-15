# Public Web Demo Deployment

## Purpose

Public Flutter Web demo deployment for portfolio review. Makes the AI Food Passport MVP Alpha directly accessible in a browser without any local development setup.

## URL

**[https://allengwong-droid.github.io/ai-food-passport/demo/](https://allengwong-droid.github.io/ai-food-passport/demo/)**

## Build Command

```bash
flutter build web --release \
  --base-href /ai-food-passport/demo/ \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

## Backend Mode

- **Backend**: Render free tier at `https://ai-food-passport.onrender.com`
- **OCR provider**: `mock_ocr` (no real image processing)
- **AI Analysis provider**: `mock_ai` (deterministic dish data)
- **Real providers enabled**: No (`realProvidersEnabled: false`)
- **`productionReady`**: `false`
- **API keys in Flutter**: None

The web demo functions identically to the local `flutter run -d web-server` setup but is deployed to GitHub Pages for public access.

## Deployment Directory

```
docs/demo/
├── index.html                  # Entry point with <base href="/ai-food-passport/demo/">
├── main.dart.js                # Compiled Flutter Web JS (~2.7 MB)
├── flutter.js                  # Flutter Web loader
├── flutter_bootstrap.js        # Bootstrap script
├── flutter_service_worker.js   # Service worker for offline caching
├── manifest.json               # Web app manifest
├── version.json                # Build version
├── favicon.png                 # Favicon
├── assets/                     # Font and asset files
├── canvaskit/                  # CanvasKit renderer files
└── icons/                      # PWA icon files
```

**File count**: 37 files  
**Total size**: ~41 MB

## Existing Files Preserved

The following files in `docs/` remain untouched:

- `docs/privacy-policy.html` — Privacy policy page (unchanged, live at `https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html`)
- `docs/screenshots/` — MVP Alpha screenshots directory (unchanged)

## Scope Boundary

| Scope | Status |
|---|---|
| **Web demo deployment** | ✅ This phase |
| **iOS/TestFlight/App Store** | ❌ Out of scope — requires macOS + Apple Developer membership |
| **Production deployment** | ❌ Out of scope — backend is mock-only, `productionReady: false` |
| **Real OCR/AI providers** | ❌ Out of scope — providers are implemented behind gates but not enabled |
| **API keys / Firebase** | ❌ Out of scope — no keys are stored or transmitted in Flutter |
| **App icon / launch screen** | ❌ Out of scope — design line is closed but not applied |

## Manual Verification Checklist

After GitHub Pages deploys (may take 1-3 minutes), verify:

- [ ] **Demo URL opens** — `https://allengwong-droid.github.io/ai-food-passport/demo/` loads the app
- [ ] **App loads correctly** — Flutter Web renders without console errors
- [ ] **Profile screen opens** — Traveler settings are accessible
- [ ] **Dietary preferences page opens** — Allergen grid and restriction list render correctly
- [ ] **Dietary preferences can be set** — Select allergens (e.g., Wheat, Egg, Soy), navigate back
- [ ] **Mock scan works** — Tap the scan button, see 2 mock dishes (Tonkotsu Ramen, Miso Katsu Skewers)
- [ ] **Allergen warnings work** — If allergens were set, result cards show "Contains [allergen]" badges
- [ ] **Price intelligence works** — Home currency conversion displays for configured currency
- [ ] **Dish detail page works** — Tap a dish to see full details
- [ ] **Scan history works** — After a scan, go to Profile → Scan History, see the entry; restore it and verify results reload; clear history
- [ ] **Settings persist** — Dietary preferences survive navigation between screens
- [ ] **Privacy policy link works** — `https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html` loads correctly
- [ ] **Backend health check** — `https://ai-food-passport.onrender.com/health` returns `ok: true`

## Known Limitations

| Limitation | Detail |
|---|---|
| **GitHub Pages propagation** | May take 1-3 minutes after push for changes to go live |
| **Render cold start** | Free-tier backend sleeps after inactivity; first request may take 30-60 seconds |
| **Mock-only backend** | All dish data is deterministic mock — no real OCR or AI analysis |
| **No medical/allergy guarantee** | App provides information for reference only; always verify with restaurant staff |
| **Session-only scan history** | History is lost on page refresh / app restart |
| **Flutter Web rendering** | Uses CanvasKit renderer; may be slower on low-end devices |
| **No offline support** | Requires internet for backend communication (even mock data comes from Render) |
| **No wasm build** | Standard JS build used; wasm dry-run passed but `--wasm` flag not used for compatibility |

## Deployment Steps (for future rebuilds)

1. Make any Flutter code changes
2. Run build:
   ```bash
   flutter build web --release \
     --base-href /ai-food-passport/demo/ \
     --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
   ```
3. Copy output:
   ```bash
   rm -rf docs/demo
   cp -r build/web docs/demo
   ```
4. Commit and push to `main` branch
5. Wait 1-3 minutes for GitHub Pages to deploy

## Related Documents

- [DEMO_PRODUCT_FLOW_SCRIPT.md](DEMO_PRODUCT_FLOW_SCRIPT.md) — Demo narration scripts (60s, 2min, detailed)
- [MANUAL_QA_CHECKLIST.md](MANUAL_QA_CHECKLIST.md) — 74-point manual QA checklist
- [DEMO_RECORDING_SHOT_LIST.md](DEMO_RECORDING_SHOT_LIST.md) — 10-shot recording guide
- [PORTFOLIO_DEMO_PACKAGE.md](PORTFOLIO_DEMO_PACKAGE.md) — Complete portfolio overview
- [PUBLIC_REPO_FINAL_QA.md](PUBLIC_REPO_FINAL_QA.md) — Phase 25C public repo QA
- [PHASE_26A_REPORT.md](PHASE_26A_REPORT.md) — This phase's build and deployment report
