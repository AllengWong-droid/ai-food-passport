# AI Food Passport -- Public Sharing Package

> v0.2.0 Portfolio Demo Ready | 2026-06-15

---

## 1. One-Line Pitch

**AI Food Passport** is a Flutter-based mobile app that scans restaurant menus and flags allergens matching your dietary preferences -- built as a portfolio project to demonstrate end-to-end mobile + cloud architecture.

---

## 2. 30-Second Explanation

AI Food Passport lets you save your dietary preferences (allergens and restrictions), then mock-scan a restaurant menu to see personalized allergen warnings on each dish. The app uses a Flutter frontend, a Node.js mock backend deployed on Render, and is publicly demoable through GitHub Pages. It is an MVP Alpha portfolio project -- not a production medical app -- but demonstrates real Flutter UI, local persistence, state management, and full-stack integration.

---

## 3. 2-Minute Explanation

### What it does

1. **Set dietary preferences** -- Choose allergens (gluten, dairy, nuts, shellfish, etc.) and dietary restrictions (vegetarian, vegan, halal, etc.). Preferences persist locally via shared_preferences.
2. **Mock-scan a menu** -- Since no real OCR/AI providers are enabled, the app uses a mock backend that returns pre-defined analysis results simulating what a real scan would produce.
3. **See personalized warnings** -- Each dish in the result shows an allergen badge (e.g., "Contains: gluten, dairy") when it matches your preferences.
4. **Browse scan history** -- Previous scan results are stored in session-local memory and can be reviewed anytime during the app session.
5. **Try the public demo** -- A Flutter Web build is deployed on GitHub Pages so anyone can try the app without installing anything.

### Architecture

- **Frontend:** Flutter (Dart) with Riverpod state management, go_router navigation, shared_preferences persistence
- **Backend:** Node.js Express mock server on Render (free tier), with provider-routing architecture ready for real OCR/AI when API keys become available
- **Deployment:** Flutter Web on GitHub Pages, backend on Render, code on GitHub
- **Testing:** 97/97 Flutter tests, 54 pre-existing info-level lints only (zero warnings/errors)

### What's real vs. mock

| Aspect | Status |
|---|---|
| Flutter UI | Real, fully functional |
| Dietary preferences persistence | Real (shared_preferences) |
| Scan history (session-local) | Real |
| Public web deployment | Real (GitHub Pages) |
| Backend integration | Real (Render) |
| OCR text extraction | Mock (simulated results) |
| AI dish analysis | Mock (simulated results) |
| Real allergy/medical safety | NOT provided -- mock-only |

---

## 4. Key Links

| Link | URL |
|---|---|
| GitHub Repository | https://github.com/AllengWong-droid/ai-food-passport |
| Public Web Demo | https://allengwong-droid.github.io/ai-food-passport/demo/ |
| GitHub Release (v0.2.0) | https://github.com/AllengWong-droid/ai-food-passport/releases/tag/v0.2.0-portfolio-demo-ready |
| Privacy Policy | https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html |
| Backend Health | https://ai-food-passport.onrender.com/health |

---

## 5. Feature Highlights

- **Menu analysis demo** -- Mock-scan a menu image and get per-dish analysis results
- **Dietary preferences** -- 8 allergens + 5 dietary restrictions, case-insensitive matching
- **Personalized allergen warnings** -- Badge on each dish showing matched allergens (e.g., "Contains: gluten, dairy")
- **Scan history** -- Session-local in-memory history with timestamps, dish summaries, and restore
- **Public web demo** -- Flutter Web build deployed on GitHub Pages, no installation needed
- **Mock-safe backend** -- All analysis is simulated; no real data leaves the device to external providers

---

## 6. Technical Highlights

| Area | Detail |
|---|---|
| Framework | Flutter 3.x (Dart) |
| State management | Riverpod |
| Navigation | go_router |
| Local persistence | shared_preferences |
| Backend | Node.js Express on Render |
| Backend architecture | Provider-routing pattern (mock/real interchangeable) |
| Deployment | Flutter Web on GitHub Pages (`docs/demo/`) |
| Testing | 97/97 Flutter tests; 54 info-level lints, zero warnings/errors |
| Safety | No API keys in Flutter; no real providers enabled; mock-only |

---

## 7. Honest Limitations

1. **Mock OCR/AI only.** All menu text recognition and dish analysis results are simulated pre-defined data. There is no real intelligent analysis happening.
2. **Not production-ready.** `productionReady: false`. The app is an MVP Alpha portfolio project.
3. **No allergy safety guarantee.** This app must NOT be used for real allergy safety decisions. It is a mock demo.
4. **No App Store / TestFlight build.** The iOS project exists but has never been built (no macOS available). No Apple Developer membership.
5. **Session-local scan history.** Scan history is stored in memory only; it is lost when the app/page is refreshed.
6. **Render free tier cold start.** The mock backend may take 30-60 seconds to wake up on first request.
7. **No real providers enabled.** No OCR provider (Qwen, etc.) and no AI analysis provider have valid API keys configured.

---

## 8. Suggested Use Cases

| Context | What to use | Reference File |
|---|---|---|
| Resume / CV | 1-line or 2-line blurb | `RESUME_PROJECT_BLURB.md` |
| Interview talking points | Technical or product-oriented version | `RESUME_PROJECT_BLURB.md` |
| Portfolio website | 2-minute explanation + links | This document + demo link |
| LinkedIn post | Professional project post | `LINKEDIN_POST_DRAFT.md` |
| Dcard / social post (Chinese) | Conversational Chinese post | `DCARD_POST_DRAFT.md` |
| GitHub profile pinned repo | Repo description + topics | `GITHUB_PROFILE_PINNED_REPO_TEXT.md` |
| Personal introduction | 30-second explanation | This document |

---

## 9. Related Documentation

| Document | Purpose |
|---|---|
| `RELEASE_V0_2_0_PORTFOLIO_DEMO_READY.md` | Full release notes for v0.2.0 |
| `RELEASE_V0_2_0_VERIFICATION.md` | Verification of published GitHub Release |
| `GITHUB_RELEASE_V0_2_0_DRAFT.md` | GitHub Release body draft |
| `DEMO_WALKTHROUGH_SCRIPT.md` | Step-by-step demo guide |
| `MANUAL_QA_CHECKLIST.md` | Manual QA testing checklist |
| `PORTFOLIO_DEMO_PACKAGE.md` | Portfolio demo package overview |
