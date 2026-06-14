# MVP Alpha Screenshot & Portfolio Package Plan

> **Phase**: 18A
> **Date**: 2026-06-14
> **Status**: Documentation only — no screenshots captured yet
> **Related**: [MVP_ALPHA_RELEASE_SNAPSHOT.md](MVP_ALPHA_RELEASE_SNAPSHOT.md) — frozen baseline (commit `d097239`)

---

## 1. Screenshots to Capture

Capture all screenshots at **web-browser resolution** (recommended: 1280x800 or 1440x900). Use the Flutter Web demo running against the live Render mock backend.

Seven screens cover the complete user journey:

| # | Filename | Screen | What to Show | Key Copy / UI Elements |
|---|---|---|---|---|
| 00 | `00-onboarding.png` | Onboarding | Initial landing, allergy selector, CTA visible | "QUICK PREVIEW" button |
| 01 | `01-home.png` | Home | After onboarding, passport status, scan CTA | "Guest passport active" indicator |
| 02 | `02-profile.png` | Profile / Settings | Connected backend status, provider info | "Connected to" label, mock_ocr status |
| 03 | `03-scan.png` | Scan | Scanner UI with image picker | "AUTO-DETECT" badge |
| 04 | `04-results.png` | Results | Two mock dishes from scan | "2 dishes found", Tonkotsu Ramen card, Miso Katsu Skewers card |
| 05 | `05-detail-tonkotsu-ramen.png` | Dish Detail | Tonkotsu Ramen detail view | ¥980, allergens (Wheat, Egg), reason, home currency price |
| 06 | `06-detail-miso-katsu-skewers.png` | Dish Detail | Miso Katsu Skewers detail view | ¥800, allergens (Soy, Wheat, Egg), reason, home currency price |

### Expected Content Detail

**00-onboarding.png**
- App bar or logo visible
- Allergy/dietary preference selector (if shown on this screen)
- "QUICK PREVIEW" CTA button prominently displayed

**01-home.png**
- "Guest passport active" status badge or text
- Scan button / camera icon
- Any recent scan references (if applicable)

**02-profile.png**
- "Connected to:" label showing backend mode
- Provider status: `mock_ocr`, `mock_ai`
- Developer controls (only visible in debug builds with `SHOW_DEVELOPER_CONTROLS=true`)

**03-scan.png**
- Scanner-style UI (centered viewfinder or similar)
- "AUTO-DETECT" text indicator
- Gallery image picker (if visible as button/icon)

**04-results.png**
- "2 dishes found" dynamic counter
- "Last scanned menu" subtitle (not hardcoded location name)
- Two dish cards:
  - Tonkotsu Ramen — ¥980
  - Miso Katsu Skewers — ¥800
- Each card shows: dish name, local price, allergen icons

**05-detail-tonkotsu-ramen.png**
- Dish name: **Tonkotsu Ramen**
- Local price: ¥980
- Home currency price (converted)
- Exchange rate shown
- Allergens: Wheat, Egg
- Recommendation reason: "Rich pork broth ramen — a hearty classic. Mild spice level, generally safe for most travelers."
- Ingredients list (if displayed)

**06-detail-miso-katsu-skewers.png**
- Dish name: **Miso Katsu Skewers**
- Local price: ¥800
- Home currency price (converted)
- Exchange rate shown
- Allergens: Soy, Wheat, Egg
- Recommendation reason: "Crispy fried skewers with savory miso glaze. Contains soy and wheat — check your allergy settings."
- Ingredients list (if displayed)

---

## 2. Demo Command

Start Flutter Web pointing to the deployed Render backend:

```bash
cd /path/to/AI-Food-Passport
flutter run -d web-server \
  --web-hostname=127.0.0.1 \
  --web-port=8081 \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

Open `http://127.0.0.1:8081` in Chrome.

Note: if the Render free instance has slept, the first `/health` check may take 30-60 seconds. Pre-warm the backend by visiting `https://ai-food-passport.onrender.com/health` in a browser tab first.

---

## 3. Screenshot Naming Convention

```
{two-digit-number}-{short-descriptive-slug}.png
```

| Element | Convention | Example |
|---|---|---|
| Zero-padded number | `00`–`06` | `04` |
| Screen slug | lowercase, hyphen-separated, descriptive | `results` |
| Format | `.png` (lossless) | `.png` |
| Resolution | 1280x800 or 1440x900 | Browser viewport |

### Full list

```
00-onboarding.png
01-home.png
02-profile.png
03-scan.png
04-results.png
05-detail-tonkotsu-ramen.png
06-detail-miso-katsu-skewers.png
```

Optionally, a subdirectory: `docs/screenshots/` or `portfolio/screenshots/`.

---

## 4. Portfolio Description

### What This Project Demonstrates

AI Food Passport is a cross-platform (Flutter) mobile app that helps international travelers scan foreign-language menus and get instant dish recommendations in their preferred language and home currency.

**Technical highlights:**
- Clean Flutter architecture with provider-based state management
- OCR-first multi-provider pipeline (scanner → OCR → AI analysis → results)
- Backend server (Node.js / Express) with provider-agnostic routing
- Deployed to Render (free tier) with mock providers active
- 509+ automated tests (Flutter widget tests + Node.js backend tests)
- Real provider integration behind explicit safety gates (Qwen OCR, Qwen Analysis)
- Developer controls gated in release builds via compile-time flags
- Secret handling: no API keys committed to version control, backend-only env vars

### What Is Mocked

| Component | Mock Behavior | Why |
|---|---|---|
| OCR | Returns deterministic mock text ("Japanese menu with 14 items...") | Real OCR requires Qwen VL API key |
| AI Analysis | Returns 2 pre-defined dishes (Tonkotsu Ramen, Miso Katsu Skewers) | Real analysis requires Qwen API key |
| Currency Conversion | Uses hardcoded rates | Real exchange-rate API not yet integrated |
| User Authentication | No login required; guest-only | Firebase not yet integrated |

### What Is Intentionally Not Production-Ready

- **`productionReady: false`** — explicitly set and enforced in backend config
- **Real providers disabled** — Qwen OCR and Qwen Analysis are implemented but require 3+ env gates each before any real call is possible
- **No Firebase** — authentication, cloud sync, and persistent storage not yet integrated
- **No App Store preparation** — screenshots, metadata, compliance review planned for Beta/Release
- **No subscriptions or IAP** — purchase flow planned for post-Alpha

### Why Provider Keys Are Backend-Only

| Reason | Detail |
|---|---|
| **Security** | API keys never exposed to client-side code or network requests |
| **Cost control** | Backend can enforce rate limits, quotas, and provider selection |
| **Auditability** | All provider calls logged on the server (with secret redaction) |
| **Safe by default** | 3 explicit env gates must ALL be set before any real call (provider, enabled flag, API key) |
| **Rollback safety** | Disable a real provider instantly by clearing one env var on Render Dashboard |
| **No Flutter secrets** | Zero key references in Flutter source code; `.env` gitignored |

---

## 5. Safety Statement

> **All screenshots in this plan capture mock-only behavior. No real AI providers are enabled. No API keys exist in Flutter code. `productionReady` remains `false`.**

| Check | Status |
|---|---|
| Real AI providers enabled? | **No** — `realOcrEnabled: false`, `realAnalysisEnabled: false` |
| API keys in Flutter? | **No** — zero key references in Flutter source |
| API keys in Git? | **No** — `.env` gitignored; `render.yaml` uses safe placeholders |
| Firebase connected? | **No** — not yet integrated |
| `productionReady`? | **No** — explicitly `false` on deployed backend |
| Screenshots representative of real AI? | **No** — all results are deterministic mock data |

### What to Tell Viewers

When sharing these screenshots or demo videos, include a note:

> "These screenshots show mock demo data from the MVP Alpha. The app returns 2 deterministic mock dishes (Tonkotsu Ramen and Miso Katsu Skewers). Real OCR and AI analysis are implemented behind safety gates but not yet enabled in this snapshot. No API keys or production infrastructure are connected."

---

## 6. Additional Portfolio Assets (Optional)

Beyond the 7 screenshots, consider capturing:

| Asset | Purpose | Format |
|---|---|---|
| **Demo video** (30-60s) | Show full scan → results → detail flow | MP4 or GIF |
| **App icon** | Portfolio header or App Store | PNG 1024×1024 |
| **Architecture diagram** | Explain OCR-first pipeline | SVG or PNG |
| **Test results screenshot** | Show 42 Flutter tests + backend tests passing | PNG |
| **Backend health JSON** | Document deployed status | JSON or screenshot |

---

## 7. Related Documents

| Document | Relevance |
|---|---|
| [MVP_ALPHA_RELEASE_SNAPSHOT.md](MVP_ALPHA_RELEASE_SNAPSHOT.md) | Baseline frozen at commit `d097239` |
| [MVP_ALPHA_DEMO_RUNBOOK.md](MVP_ALPHA_DEMO_RUNBOOK.md) | Step-by-step demo walkthrough |
| [MVP_ALPHA_STATUS.md](MVP_ALPHA_STATUS.md) | One-page current status overview |
| [REAL_PROVIDER_PREFLIGHT_PLAN.md](REAL_PROVIDER_PREFLIGHT_PLAN.md) | Provider safety gates documentation |
| [ROADMAP.md](ROADMAP.md) | Full phase history |
| [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) | All testing results |
