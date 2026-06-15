# GitHub Release v0.2.0 Draft

**Tag:** `v0.2.0-portfolio-demo-ready`

**Release Title:** AI Food Passport v0.2.0 — Portfolio Demo Ready

---

## Copy-Paste-Ready GitHub Release Body

Use the content below directly in the GitHub Release description field.

---

# AI Food Passport v0.2.0 — Portfolio Demo Ready

**Portfolio demo / MVP Alpha public demo.** Not production-ready. Not TestFlight or App Store ready.

---

## Try the Live Demo

**[Launch Public Web Demo](https://allengwong-droid.github.io/ai-food-passport/demo/)**

No installation. No API keys. Open in any browser.

**Quick walkthrough:**
1. Open Profile → Dietary Preferences → select Wheat, Egg, Soy
2. Tap Scan → see 2 mock dishes with personalized allergen warnings
3. Profile → Scan History → view, restore, or clear past scans

---

## What's New in v0.2.0

Since the v0.1 MVP Alpha snapshot:

- **Public web demo** deployed on GitHub Pages — try the app without building Flutter.
- **Privacy policy** published at GitHub Pages — required for App Store later.
- **Dietary preferences** with 8 allergens + 5 dietary restrictions, persisted locally.
- **Personalized allergen warning badges** on result cards ("Contains gluten", "Contains: gluten, dairy").
- **Scan history** — session-local, entries created after each scan, restorable with one tap.
- **Comprehensive documentation**: demo script (6 acts), QA checklist (74 points), recording guide (10 shots, 81s), portfolio package.
- **Public repo QA** passed — all internal links verified, all 9 safety disclosures present.
- **Live verification** — automated HTTP checks + 22 manual browser checks all passed.

---

## Key Features

| Feature | Type |
|---|---|
| Menu scan & mock analysis | Mock-safe flow |
| Personalized allergen warnings | Real UX, mock data |
| Dietary preferences (saved) | Real persistence |
| Price intelligence (6+ currencies) | Real UX, mock rates |
| Scan history (session-local) | Real behavior |
| Public web demo | Live on GitHub Pages |
| Mock backend API | Live on Render (free tier) |
| Privacy policy | Live |

---

## Verification

| Check | Result |
|---|---|
| Flutter tests | 97/97 pass |
| dart analyze | Zero warnings, zero errors (54 info-level only) |
| Public web demo | Live, HTTP 200 |
| Render backend health | Live, mock-only confirmed |
| Manual browser QA | 22/22 checks passed |
| API keys in repo | None |
| Real providers enabled | None |

---

## Important Limitations

- **Mock-only backend** — no real OCR or AI analysis. Dish results are deterministic mock data.
- **Not for real allergy safety decisions** — allergen warnings use mock data.
- **Scan history is session-local** — cleared on app restart or page refresh.
- **Render free-tier cold start** — backend may take 30-60 seconds on first request.
- **No iOS build** — iOS project exists but has never been built.
- **No TestFlight / App Store** — requires macOS + Apple Developer membership.
- **No medical advice** — consult a healthcare professional for dietary concerns.

---

## Safety Disclaimers

- This is a **portfolio demo**, not a production product.
- Allergen warnings are driven by mock analysis data and should not be used for real allergy safety decisions.
- No medical advice is provided.
- No real OCR or AI providers are enabled. No API keys are stored in the public repository.
- Privacy: The app collects no user data. No analytics, no tracking, no third-party services.

---

## Links

| Resource | URL |
|---|---|
| Public Web Demo | https://allengwong-droid.github.io/ai-food-passport/demo/ |
| Privacy Policy | https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html |
| Render Backend Health | https://ai-food-passport.onrender.com/health |
| Demo Script | [DEMO_PRODUCT_FLOW_SCRIPT.md](DEMO_PRODUCT_FLOW_SCRIPT.md) |
| QA Checklist | [MANUAL_QA_CHECKLIST.md](MANUAL_QA_CHECKLIST.md) |
| Portfolio Package | [PORTFOLIO_DEMO_PACKAGE.md](PORTFOLIO_DEMO_PACKAGE.md) |
| Full Release Notes | [RELEASE_V0_2_0_PORTFOLIO_DEMO_READY.md](RELEASE_V0_2_0_PORTFOLIO_DEMO_READY.md) |
