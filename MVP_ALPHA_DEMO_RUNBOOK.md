# AI Food Passport — MVP Alpha Demo Script & Manual QA Runbook

**Version**: Phase 14B (MVP Alpha Freeze)
**Last Updated**: 2026-06-14
**Tag**: phase-14b-mvp-alpha-demo-runbook

---

## 1. Demo Setup

### Prerequisites

- Flutter SDK (3.x stable)
- Chrome or Chromium-based browser
- Git working tree is clean (`git status --short` empty)
- Node.js 22+ (optional, for local backend smoke checks)

### Start Flutter Web with Deployed Render Backend

```bash
cd AI-Food-Passport
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

Wait for the build to complete. Flutter will print a URL (usually `http://127.0.0.1:8081`). Open it in Chrome.

> **Tip**: If the Render free instance is asleep, the first backend request may take 30-60 seconds to wake up. Do a quick health check first:
>
> ```bash
> curl https://ai-food-passport.onrender.com/health
> ```
>
> Expected: `{"ok":true,"activeOcrProvider":"mock_ocr","activeAnalysisProvider":"mock_ai","realProvidersEnabled":false,"productionReady":false}`

### Alternative: Start Without Render (Local Mock Only)

```bash
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081
```

The app defaults to local mock providers. No backend connection needed.

---

## 2. Demo Walkthrough

### Step 1 — Onboarding Screen

1. App launches — you should see the **AI FOOD PASSPORT** onboarding screen.
2. Verify the screen renders without layout overflow:
   - "AI FOOD PASSPORT" section label
   - "Travel smarter. Eat better." display text
   - Body text explaining the app
   - Feature cards (Scan Menus, Food Risks, Smart Recommendations)
3. Tap **"Get Started"** to proceed to the main app.

> **Pass**: Onboarding renders fully, no `RenderFlex overflow` errors in console.

### Step 2 — Main App & Tab Bar

1. After onboarding, the main app appears with a bottom tab bar:
   - **Scan** (camera icon)
   - **Results** (list icon)
   - **Passport** (passport icon)
   - **Profile** (person icon)
2. The Scan tab is active by default.

### Step 3 — Profile & Developer Controls (Debug Only)

1. Tap **Profile** tab.
2. Scroll to find the developer controls section. **In debug builds**, you should see:
   - **Backend Mock Mode** toggle (disabled by default)
   - **Backend Scenario** dropdown (disabled when Backend Mock Mode is off)
   - **AI Provider Mode** dropdown (informational — mock only)
   - **Backend URL** subtitle or debug display showing `https://ai-food-passport.onrender.com` (with `--dart-define=BACKEND_BASE_URL`)
3. Enable **Backend Mock Mode** by toggling it on.
4. The **Backend Scenario** dropdown becomes active. Leave it on `normal` for the demo.

> **Pass**: Developer controls visible in debug; Backend URL reflects Render; Backend Mock Mode toggleable.

### Step 4 — Backend URL Verification

1. With Backend Mock Mode enabled, the Profile page should show the active backend URL.
2. If the `BACKEND_BASE_URL` dart-define was set, it should display `https://ai-food-passport.onrender.com`.
3. The **AI Debug** section (if expanded) shows provider metadata: `mock_ocr`, `mock_ai`.

> **Pass**: Backend URL points to Render, provider info shows mock only.

### Step 5 — Analyze Menu Flow

1. Navigate to the **Scan** tab.
2. Optionally tap the gallery button to select a menu image, or tap the main scan button directly.
3. The processing overlay appears with staged messages:
   - "Scanning menu..."
   - "Analyzing dishes..."
4. After a few seconds, the app navigates to **Results**.

### Step 6 — Expected Mock Dishes

The Results screen should show two mock dishes:

| Dish | Local Price | Allergens |
|------|-------------|--------|
| **Tonkotsu Ramen** | ¥980 | Wheat, Egg |
| **Miso Katsu Skewers** | ¥800 | Soy, Wheat, Egg |

Tap a dish to see the **Dish Detail** page with:
- Local price in JPY (¥)
- Converted price in traveler's home currency
- Exchange rate used
- Ingredient list
- Recommendation reason

> **Pass**: Two mock dishes appear; price conversion works; Dish Detail renders correctly.

### Step 7 — Backend Scenario Testing (Optional)

1. Go to Profile, change **Backend Scenario** to `ocr_failure`.
2. Run Scan again.
3. The app should show a friendly error recovery screen instead of crashing.
4. Reset Backend Scenario to `normal` for the rest of the demo.

### Step 8 — Release Safety Verification

1. Run without `SHOW_DEVELOPER_CONTROLS=true`:
   ```bash
   flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 \
     --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
   ```
2. Go to Profile — **developer controls should be hidden**.
3. Only user-facing controls (Home Country, Currency, Language, Taste & Allergies, Reset) should be visible.

> **Pass**: Developer controls hidden in non-overridden builds.

---

## 3. Manual QA Checklist

### Core Flow

- [ ] App launches in Chrome without console errors.
- [ ] Onboarding screen renders without `RenderFlex` overflow.
- [ ] "Get Started" navigates to main app with bottom tab bar.
- [ ] All four tabs (Scan, Results, Passport, Profile) are navigable.
- [ ] Backend Mock Mode toggle works in Profile (debug builds).
- [ ] Backend Scenario dropdown changes produce expected behaviors.

### Backend Integration

- [ ] Backend URL in Profile shows `https://ai-food-passport.onrender.com` (with dart-define).
- [ ] Health endpoint returns `ok: true` with `mock_ocr` and `mock_ai`.
- [ ] POST `/api/analyze-menu` returns 2 mock dishes.
- [ ] Processing overlay shows staged messages.
- [ ] Results page displays mock dishes correctly.
- [ ] Dish Detail shows price conversion with traveler's home currency.

### Safety & Secrets

- [ ] No API keys appear in Flutter console logs.
- [ ] No API keys appear in UI (debug panels, Profile, etc.).
- [ ] No `QWEN_API_KEY`, `DEEPSEEK_API_KEY`, `OPENAI_API_KEY` anywhere in UI or logs.
- [ ] `realProvidersEnabled` remains `false` (confirmed via health endpoint).
- [ ] `productionReady` remains `false`.
- [ ] Backend Mock Mode is **disabled by default** on fresh launch.
- [ ] Release builds hide developer controls (no `SHOW_DEVELOPER_CONTROLS=true`).

### Demo Polish

- [ ] "Get Started" button is tappable and responsive.
- [ ] Processing overlay transitions smoothly.
- [ ] Results cards are visually complete (price, recommendation).
- [ ] Dish Detail back-navigation works (Results, Scan, etc.).
- [ ] No blank screens or broken images.

---

## 4. Known Demo Caveats

| Caveat | Impact | Mitigation |
|--------|--------|------------|
| **Render free instance sleeps** | First request may take 30-60s | Hit `/health` before demo to wake it |
| **First request may be slow** | Cold start delay | Warm up with a `curl` or early scan |
| **`GET /` returns 404 by design** | No homepage at root URL | Use `/health` endpoint for verification |
| **`/api/analyze-menu` no trailing slash** | Extra `/` causes redirect/404 | Ensure POST exactly to `/api/analyze-menu` |
| **Results are mock-only** | Same two dishes every time | Explain this is MVP Alpha, real OCR coming |
| **No real AI/provider integration** | No intelligent analysis yet | Stick to mock demo; don't pretend it's real AI |
| **Backend Mock Mode disabled by default** | Dev controls hidden in release | Must be in debug or with `SHOW_DEVELOPER_CONTROLS=true` |
| **No real exchange rates** | Prices use fixed mock rates | Explain rates will be live in future phase |

---

## 5. Stop Command

To stop the Flutter web server, press **Ctrl + C** in the terminal where `flutter run` is running.

Wait for the process to exit cleanly before starting a new session.

---

## 6. Quick Reference

### Verification Commands

```bash
# Flutter tests
flutter test

# Git health check
git diff --check
git status --short

# Backend health (requires curl)
curl https://ai-food-passport.onrender.com/health

# Backend analyze-menu smoke (requires curl)
curl -X POST https://ai-food-passport.onrender.com/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "dGVzdA==", "homeCountry": "CN", "homeCurrency": "CNY", "outputLanguage": "zh"}'
```

### Important URLs

| Endpoint | URL |
|----------|-----|
| **Health** | `https://ai-food-passport.onrender.com/health` |
| **Analyze Menu** | `https://ai-food-passport.onrender.com/api/analyze-menu` |
| **Flutter Web (local)** | `http://127.0.0.1:8081` (with dart-define) |

### Key Facts for the Demo

- **This is MVP Alpha** — mock OCR, mock AI, mock exchange rates.
- **No real AI today** — the backend uses deterministic mock providers.
- **The backend is live on Render** — proving deployment works.
- **Real providers are disabled** — gated behind multiple safety switches.
- **No API keys exist in the codebase** — all keys live in backend deployment env vars (none configured yet).
- **Phase 14A confirmed productionReady: false** — this is not a production release.

---

## 7. Related Documents

- [Roadmap](./ROADMAP.md)
- [Testing Checklist](./TESTING_CHECKLIST.md)
- [Real Provider Readiness Checklist](./REAL_PROVIDER_READINESS_CHECKLIST.md)
- [Deployment Readiness](./backend/DEPLOYMENT_READINESS.md)
- [Phase 14A Audit Report](./PHASE_14A_AUDIT_REPORT.md)
