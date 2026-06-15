# Phase 26A Report: Public Flutter Web Demo Deployment

**Phase 26A complete. Documentation + build output. Zero Flutter code changes.**

---

## Files Created

| File | Size | Description |
|---|---|---|
| `docs/demo/` | 37 files, ~41 MB | Flutter Web release build output |
| `PUBLIC_WEB_DEMO_DEPLOYMENT.md` | ~3 KB | Deployment doc: URL, build command, verification checklist, known limitations |
| `PHASE_26A_REPORT.md` | This file | Phase report |

## Files Modified

| File | Change |
|---|---|
| `README.md` | Added "Public Web Demo" section with demo link, caveats, and safety disclosures |
| `ROADMAP.md` | Added Phase 26A entry to Completed list |

## Build Details

### Command

```bash
flutter build web --release \
  --base-href /ai-food-passport/demo/ \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

### Build Output Summary

```
Build successful in 39.6s
Output: build/web/
  - index.html (with <base href="/ai-food-passport/demo/">)
  - main.dart.js (~2.7 MB)
  - assets/, canvaskit/, icons/
  - 37 files total, ~41 MB
  - Font tree-shaking: MaterialIcons-Regular.otf reduced 99.2% (1645184 → 13984 bytes)
  - Wasm dry run: passed
```

### Deployment Directory

`docs/demo/` — copied from `build/web/` after successful build.

### Existing Files Preserved

- `docs/privacy-policy.html` — unchanged (14,262 bytes, last modified Jun 14)
- `docs/screenshots/` — unchanged

## Public Demo URL

**https://allengwong-droid.github.io/ai-food-passport/demo/**

The demo URL points to the GitHub Pages deployment of `docs/demo/`. After the `main` branch is pushed, GitHub Pages will serve the Flutter Web app at this URL. Propagation typically takes 1-3 minutes.

## README Changes

Added a new "Public Web Demo" section after "Demo Flow" with:

1. **Link**: `https://allengwong-droid.github.io/ai-food-passport/demo/`
2. **Caveats**: mock-safe backend, no real OCR/AI, not production-ready, no allergy guarantee
3. **What to expect**: scan menu → 2 mock dishes → allergen badges → price intelligence → scan history
4. **Related docs**: links to DEMO_PRODUCT_FLOW_SCRIPT.md, MANUAL_QA_CHECKLIST.md, PORTFOLIO_DEMO_PACKAGE.md
5. **Known limitations**: Render cold start, session-only history, GitHub Pages propagation delay

## Safety & Scope Confirmation

| Check | Result |
|---|---|
| Flutter code (`lib/`) changed | **No** |
| iOS config (`ios/`) changed | **No** |
| Backend code (`backend/`) changed | **No** |
| Render config changed | **No** |
| `pubspec.yaml` changed | **No** |
| App icon assets changed | **No** |
| Launch screen changed | **No** |
| API keys added | **No** |
| Firebase added | **No** |
| Real providers enabled | **No** (`mock_ocr` + `mock_ai` only) |
| `productionReady` changed | **No** (remains `false`) |
| Secrets/`.env` added | **No** |

## Verification Results

| Check | Result |
|---|---|
| `dart analyze` | 54 pre-existing info-level lints, zero warnings/errors |
| `flutter test` | 97/97 passing |
| `git status --short` | 5 files: 2 modified (README.md, ROADMAP.md) + 1 new doc + docs/demo/ |
| `git diff --check` | No whitespace errors |
| `git diff --name-status` | M README.md, M ROADMAP.md (only intentional changes) |

## Public Demo Manual Verification

The demo URL `https://allengwong-droid.github.io/ai-food-passport/demo/` **requires push to GitHub `main` branch and GitHub Pages propagation** before it becomes live. Manual verification should be performed after deployment:

- [ ] Demo URL opens and app loads
- [ ] Dietary preferences page opens
- [ ] Mock scan works (2 mock dishes appear)
- [ ] Allergen warnings render if preferences are set
- [ ] Price intelligence displays home-currency conversion
- [ ] Scan history works (create → view → restore → clear)
- [ ] Privacy policy link works
- [ ] No console errors on load

## Next Recommended Phase

**Phase 26B: GitHub Pages Manual Verification** — after pushing to GitHub, manually verify the live demo URL against the checklist in `PUBLIC_WEB_DEMO_DEPLOYMENT.md`. This is a manual phase that requires browser testing after GitHub Pages deploys.

Then: **Phase 25D: GitHub Repository Configuration** (About text, Topics, website URL, pinned repo, LICENSE, GitHub Release) — still pending from the Phase 25C public repo QA.
