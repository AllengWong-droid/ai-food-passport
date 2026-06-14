# AI Food Passport — Demo Walkthrough Script & Recording Checklist

> **Status**: Mock-only. All real providers disabled. Ready for portfolio recording.
> **Last updated**: 2026-06-14 (Phase 19B)
> **Purpose**: Timeboxed narration scripts for recording a portfolio demo video, plus a pre-flight checklist for clean capture.

---

## 1. 30-Second Demo Script (Elevator Pitch)

> [Screen: App open on onboarding. Cursor hovers over "QUICK PREVIEW".]

"AI Food Passport helps travelers understand foreign menus instantly. Point your camera at a menu — in any language, any cuisine — and the app translates every dish, converts prices to your home currency, and flags what's safe for your dietary needs."

> [Click QUICK PREVIEW → processing overlay → results appear with Tonkotsu Ramen and Miso Katsu Skewers.]

"This MVP Alpha runs against a live backend deployed on Render. The complete scan-to-results pipeline is working. Real AI providers are fully implemented behind safety gates and ready to activate."

> [Show Dish Detail with price conversion.]

"Prices in yen, converted to your home currency. Ingredients, allergens, and a personalized recommendation — all from a single menu photo."

---

## 2. 90-Second Demo Script (Portfolio Overview)

> **Time allocation**: 10s open + 15s scan + 15s results + 15s dish detail + 15s profile + 20s architecture/safety wrap-up

**[0:00-0:10 — Open + Problem Statement]**
"Travelers face a universal problem: standing in front of a foreign menu with no idea what anything says, what it costs, or whether they can even eat it. AI Food Passport solves this."

**[0:10-0:25 — Scan Flow]**
"Here's how. Tap scan — the app processes the menu image through our backend. You'll see staged progress messages as OCR extracts the text and AI analyzes each dish. In a few seconds, you get results."

**[0:25-0:40 — Results]**
"Two dishes found: Tonkotsu Ramen at 980 yen, Miso Katsu Skewers at 800. Each has a match score, safety badges, and your home-currency price right there on the card."

**[0:40-0:55 — Dish Detail]**
"Tap into any dish and you get the full picture: local price, converted price, exchange rate, ingredient list, allergens flagged, and a personalized recommendation reason. No guessing. No Google Translate. No currency math in your head."

**[0:55-1:10 — Profile & Personalization]**
"Behind this is a traveler profile you set once: home country, currency, dietary restrictions, allergies. The app uses this to filter and recommend. Once set, it works across every scan."

**[1:10-1:30 — Architecture & Safety Summary]**
"This is an MVP Alpha running a mock backend on Render. The architecture is built for production: a Flutter frontend, a Node.js backend proxy that keeps all API keys server-side, and provider safety gates that prevent real API calls until explicitly enabled. Real providers — Qwen OCR and Qwen Analysis — are fully implemented behind those gates."

---

## 3. 3-Minute Demo Script (Full Walkthrough)

> **Time allocation**: 15s open + 20s onboarding + 20s home + 20s profile + 25s scan + 25s results + 25s dish detail 1 + 20s dish detail 2 + 25s architecture + 25s safety & wrap

**[0:00-0:15 — Title Screen]**
Show title screen or app icon. Narrate: "AI Food Passport — a Flutter application that helps travelers navigate foreign menus with confidence."

**[0:15-0:35 — Onboarding]**
"This is the first screen every traveler sees. The headline is simple: 'Travel smarter. Eat better.' Three feature cards explain what the app does — scan menus, get food risk alerts, and receive smart recommendations. And this button — 'QUICK PREVIEW' — lets anyone try the scan immediately. No sign-up, no setup, no API keys. One tap and you're in the demo."

Click QUICK PREVIEW.

**[0:35-0:55 — Home Screen]**
"Here's the home screen — the traveler's dashboard. The current mission shows you're in Tokyo. The scan button is front and center. Below, recent crossings show your travel history. The bottom tab bar gives quick access to Scan, Results, Passport, and Profile."

**[0:55-1:15 — Profile & Backend Status]**
"Let's check the profile. This is where the traveler sets their home country, preferred currency, output language, and dietary restrictions. Scrolling down, we can see the backend connection status. This demo is connected to our live Render deployment at ai-food-passport.onrender.com — but it's running in mock-only mode. Real AI providers are disabled behind safety gates. productionReady is false."

**[1:15-1:40 — Scan & Processing]**
"Now the main event. Navigate to the Scan tab. Select a menu image — any image works for this demo since results are deterministic. Tap scan. The processing overlay appears with staged progress messages: 'Scanning menu...' then 'Analyzing dishes...' This is the OCR-first pipeline — text extraction followed by AI dish analysis. Behind these messages, the app is calling our backend proxy, which runs mock providers to produce consistent, reviewable results."

**[1:40-2:05 — Results Screen]**
"In a few seconds, we land on Results. Two dishes found from the menu. Tonkotsu Ramen at 980 yen and Miso Katsu Skewers at 800 yen. Each card shows a match score, safety badges for allergens, and the price converted to your home currency. The loading state was smooth, the transition natural, and the data is clean."

**[2:05-2:30 — Tonkotsu Ramen Detail]**
"Tap Tonkotsu Ramen for the full detail view. You'll see the local price — 980 yen — followed by the converted price in your home currency. The exchange rate used is clearly displayed. Ingredients are listed. Allergens — wheat and egg — are flagged. And at the bottom, a personalized recommendation reason. This is what makes the app different from a translation tool: it understands food."

**[2:30-2:50 — Miso Katsu Skewers Detail + Comparison]**
"Let's look at the second dish — Miso Katsu Skewers at 800 yen. Different allergens: soy, wheat, egg. Different recommendation. This demonstrates that the system handles multiple dishes per menu and produces distinct, useful analysis for each. A traveler can quickly scan through, compare prices, and find the dishes that fit their profile."

**[2:50-3:15 — Architecture & Safety]**
"Under the hood, this is a Flutter frontend communicating with a Node.js Express backend deployed on Render. The backend proxy pattern is important: all API keys — for real OCR and AI providers — live only on the server, never in client code. The provider safety gates require three independent conditions before any real API call: the provider must be named, explicitly enabled, and given a valid non-placeholder API key. Without all three, the system routes to mock-only. 226 automated tests verify these gates in every state."

**[3:15-3:30 — Wrap-Up]**
"This is AI Food Passport MVP Alpha — a fully functional scan-to-results pipeline with a deployed backend, rigorous provider safety gates, and a complete set of portfolio-ready documentation. Real providers are implemented and tested, waiting for an API key. Production hardening, auth, and App Store readiness are the next engineering milestones."

---

## 4. Screen-by-Screen Narration

Each screen matches a screenshot in `docs/screenshots/mvp-alpha/`. Narrate while the screen is visible, or record voiceover to match each transition.

### 00 — Onboarding (`00-onboarding.png`)

| What to Show | What to Say |
|---|---|
| App title "AI FOOD PASSPORT" with tagline | "AI Food Passport — a mobile app that helps travelers understand foreign menus." |
| Three feature cards: Scan Menus, Food Risks, Smart Recommendations | "Scan any menu. Get food risk alerts. Receive personalized dish recommendations." |
| "QUICK PREVIEW" button | "This button launches a demo scan instantly — no setup, no sign-up." |
| "Get Started" button | "Or tap Get Started to go through the full onboarding." |

### 01 — Home (`01-home.png`)

| What to Show | What to Say |
|---|---|
| Current mission banner (Tokyo) | "The home dashboard shows your current travel mission — in this case, Tokyo." |
| "Guest passport active" indicator | "In demo mode, a guest passport is active. No account required." |
| Scan call-to-action button | "The scan button is always one tap away — front and center." |
| Recent crossings list | "Below, a history of recent travel destinations." |
| Bottom tab bar: Scan, Results, Passport, Profile | "Four tabs give you quick access to every feature." |

### 02 — Profile & Backend Status (`02-profile.png`)

| What to Show | What to Say |
|---|---|
| Traveler settings: Home Country, Currency, Language | "The traveler sets their preferences once: home country, currency, output language." |
| Dietary restrictions and allergies | "Dietary restrictions and allergies personalize every recommendation." |
| Backend connection status: "Connected to:" with Render URL | "This demo connects to our live Render backend at ai-food-passport.onrender.com." |
| Provider mode showing mock_ocr / mock_ai | "The backend is running in mock-only mode — real AI providers are disabled behind safety gates." |
| "Using offline preview data" subtitle | "By design, this is deterministic mock data — consistent, reviewable, and safe to demonstrate." |

**Must say clearly**: "The Render backend is live and responding, but it's using mock providers. No real AI API keys are configured. productionReady is false. This is a demo, not a production deployment."

### 03 — Scan (`03-scan.png`)

| What to Show | What to Say |
|---|---|
| Camera/gallery selection UI | "Select a menu image — from camera or gallery. Any image works for this demo." |
| Processing overlay with staged messages | "After tapping scan, the processing overlay appears. Staged messages show progress: 'Scanning menu...' then 'Analyzing dishes...'" |
| AUTO-DETECT language label | "The system auto-detects the menu language — Japanese in this case." |

**Must say clearly**: "Behind this processing overlay, the Flutter app sends the menu image to our backend. The backend runs deterministic mock OCR and mock AI analysis — consistent, repeatable results every time."

### 04 — Results (`04-results.png`)

| What to Show | What to Say |
|---|---|
| "2 dishes found" header | "Two dishes found from this menu." |
| Tonkotsu Ramen card with ¥980, match score, allergens | "Tonkotsu Ramen — 980 yen — high match score — wheat and egg allergens flagged." |
| Miso Katsu Skewers card with ¥800 | "Miso Katsu Skewers — 800 yen — soy, wheat, and egg allergens." |
| Home-currency price on each card | "Prices are converted to your home currency automatically — no mental math needed." |
| Safety badges and recommendation preview | "Each card shows safety badges and a preview of the personalized recommendation." |

### 05 — Tonkotsu Ramen Detail (`05-dish-detail.png`)

| What to Show | What to Say |
|---|---|
| Dish name and local price: Tonkotsu Ramen, ¥980 | "Tapping Tonkotsu Ramen opens the full detail view. Local price: 980 yen." |
| Home-currency converted price | "Converted to your home currency — here shown in the traveler's configured currency." |
| Exchange rate display | "The exchange rate used for conversion is clearly shown." |
| Ingredients list | "Full ingredient list so you know exactly what's in the dish." |
| Allergens: Wheat, Egg | "Allergens are flagged explicitly — wheat and egg in this dish." |
| Recommendation reason | "And a personalized recommendation: 'Rich pork broth ramen — a hearty classic. Mild spice level, generally safe for most travelers.'" |

**Must say clearly**: "This is what differentiates AI Food Passport from a translation app. It doesn't just tell you what a dish is called — it tells you what's in it, whether it's safe for your dietary needs, and whether it's worth trying."

### 06 — Miso Katsu Skewers Detail (`06-dish-detail-alt.png`)

| What to Show | What to Say |
|---|---|
| Dish name and local price: Miso Katsu Skewers, ¥800 | "The second dish — Miso Katsu Skewers at 800 yen." |
| Different allergen profile: Soy, Wheat, Egg | "Different allergens — soy, wheat, and egg. A traveler with a soy allergy would see this flagged immediately." |
| Different recommendation reason | "And a different recommendation: 'Crispy fried skewers with savory miso glaze. Contains soy and wheat — check your allergy settings.'" |
| Back navigation to Results | "From here, the traveler can go back to browse other dishes, or start a new scan." |

**Must say clearly**: "Each dish gets its own detailed analysis — different ingredients, different allergens, different recommendations. The system handles multiple dishes per menu and produces distinct, useful analysis for each one."

---

## 5. What to Say Clearly (Safety Disclosures)

Throughout the demo, regardless of which script length you use, you **must** say these points clearly:

1. **Live Render backend is used in mock-only mode.**
   > "The backend at ai-food-passport.onrender.com is live and responding, but it's running mock OCR and mock AI providers. No real AI analysis is happening today."

2. **No real AI provider is enabled yet.**
   > "Real providers — Qwen OCR and Qwen Analysis — are fully implemented but disabled behind safety gates. They're code-complete and tested, waiting for an API key."

3. **API keys belong only on backend infrastructure.**
   > "All API keys live on the server side only — never in Flutter code, never in the repository, never visible to end users. The backend proxy pattern keeps credentials safe."

4. **productionReady remains false.**
   > "This is an MVP Alpha. productionReady is explicitly set to false. This is a demo, not a production launch."

---

## 6. What NOT to Say (Prohibited Claims)

| Do NOT Claim | Instead Say |
|---|---|
| "This app is production-ready." | "This is MVP Alpha — productionReady is false." |
| "The AI is analyzing real menus." | "The backend is using deterministic mock providers for this demo." |
| "This app uses real OCR and AI." | "Real OCR and AI are implemented behind safety gates but not yet enabled." |
| "This app is ready for the App Store." | "App Store readiness is a future milestone after production hardening." |
| "This app has real-time exchange rates." | "Exchange rates are static mock values in this demo." |
| "Firebase handles authentication." | "Authentication is not yet integrated — guest passport is used for the demo." |
| "This is a production deployment on Render." | "This is a free-tier Render deployment for demonstration purposes only." |

---

## 7. Recording Checklist

Run through this checklist **before** you press record.

### 7.1 Browser Setup

- [ ] **Browser window**: Resize to 1280×720 or 1920×1080 (16:9 ratio for portfolio video).
- [ ] **Clean browser**: Close all other tabs. Open only one tab for the Flutter web app.
- [ ] **Bookmarks bar hidden**: No personal bookmarks visible in recording.
- [ ] **No private info**: Address bar shows only `http://127.0.0.1:8081/` — no tokens, no query params.
- [ ] **Browser theme**: Use a clean, light or neutral theme. Avoid dark themes that may not record well.
- [ ] **Cursor visible**: Enable cursor highlighting in your recording tool (mouse clicks should be visible).

### 7.2 System Cleanliness

- [ ] **No notifications**: Turn on Do Not Disturb. No OS notifications, Slack pings, or email popups.
- [ ] **No overlays**: Close any floating widgets, clipboard managers, or system monitoring tools.
- [ ] **No API keys visible anywhere**: Not in terminal, not in browser dev tools, not in env vars shown on screen.
- [ ] **No passwords or tokens**: If using a terminal for curl commands, ensure no secrets are in scrollback.
- [ ] **Taskbar hidden or clean**: Auto-hide the taskbar, or ensure only neutral app icons are visible.

### 7.3 Flutter App Preparation

- [ ] **Clean launch**: Stop any previous Flutter server. Start fresh:
  ```bash
  cd AI-Food-Passport
  flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 \
    --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
  ```
- [ ] **Render warmed up**: Before recording, hit the health endpoint to wake the Render instance:
  ```bash
  curl https://ai-food-passport.onrender.com/health
  ```
  Expected: `{"ok":true,"activeOcrProvider":"mock_ocr","activeAnalysisProvider":"mock_ai","realProvidersEnabled":false,"productionReady":false}`
- [ ] **No dev tools visible**: Close Chrome DevTools. No console, no network tab, no elements panel.
- [ ] **No Flutter debug banner**: If the debug banner ("DEBUG") appears in the top-right corner, this is fine — it signals this is a dev build. If you want it removed, add `--dart-define=FLUTTER_DEBUG=false` or record in release mode.
- [ ] **App in default state**: The app should start on the Onboarding screen. Do not pre-navigate to another screen.

### 7.4 Recording Settings

- [ ] **Recording tool**: OBS Studio (free, recommended), Loom, or macOS QuickTime screen recording.
- [ ] **Resolution**: Record at 1920×1080 (1080p) minimum. 60 fps optional but smoother.
- [ ] **Audio**: Use a good microphone. Test audio levels before recording. Avoid keyboard noise.
- [ ] **Mouse clicks**: Enable click visualization in your recording tool so viewers can follow interactions.
- [ ] **Recording area**: Record only the browser window, not the entire desktop.

### 7.5 During Recording

- [ ] **Speak clearly and at a moderate pace**.
- [ ] **Pause between sections** — this makes editing easier.
- [ ] **Do NOT open the browser console or dev tools**.
- [ ] **Do NOT type any commands in a visible terminal** — pre-run any curl commands before recording.
- [ ] **Do NOT show any API keys, tokens, or credentials**.
- [ ] **If you make a mistake, pause and re-do that section** — easier to edit out later.

### 7.6 After Recording

- [ ] **Stop Flutter server**:
  ```bash
  # Press Ctrl+C in the terminal running flutter run
  # Wait for clean exit
  ```
- [ ] **Verify no secrets leaked**: Review the recording before publishing. Check that no API keys, passwords, or private information are visible in any frame.
- [ ] **Trim silence**: Remove dead air at the start and end.
- [ ] **Export**: Export as MP4 (H.264) at 1080p for broad compatibility.

---

## 8. Suggested Video Title and Description

### Title (choose one)

| Style | Title |
|---|---|
| Descriptive | **AI Food Passport — MVP Alpha Demo (Flutter + Render Backend)** |
| Pitch-focused | **AI Food Passport: Helping Travelers Understand Foreign Menus** |
| Technical | **AI Food Passport: Flutter Frontend, Node.js Backend Proxy, Provider Safety Gates** |

### Description (portfolio-ready)

```
AI Food Passport is a Flutter mobile application that helps travelers understand
foreign menus using OCR and AI analysis. Point your camera at a menu in any
language, and the app translates every dish, converts prices to your home
currency, and flags allergens based on your dietary profile.

This MVP Alpha demo shows the complete scan-to-results flow:
  - Onboarding with QUICK PREVIEW entry point
  - Home dashboard with active mission and travel history
  - Traveler profile with dietary preferences and allergy settings
  - Menu scan with staged processing overlay
  - Dish results with match scores, safety badges, and price conversion
  - Full dish detail with ingredients, allergens, and recommendations

Architecture: Flutter frontend + Node.js/Express backend proxy + Render deployment.
Real AI providers (Qwen OCR, Qwen Analysis) are fully implemented behind triple
safety gates, with 226 automated tests verifying safe-by-default behavior.

Status: MVP Alpha — mock-only backend. productionReady: false.
No real providers enabled. All API keys kept server-side only.

Repository: [link to GitHub repo]
Documentation: [link to docs or PORTFOLIO_HANDOFF.md]
```

---

## 9. Quick Reference Card

Print or screenshot this section for quick reference during recording.

```
DEMO COMMAND:
flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com

APP URL:       http://127.0.0.1:8081
HEALTH CHECK:  curl https://ai-food-passport.onrender.com/health

EXPECTED DISHES (mock, deterministic):
  Tonkotsu Ramen       ¥980  | Wheat, Egg
  Miso Katsu Skewers   ¥800  | Soy, Wheat, Egg

SAFETY FACTS TO STATE:
  - Live Render backend in mock-only mode
  - No real AI provider enabled
  - API keys belong on backend only
  - productionReady is false

PROHIBITED CLAIMS:
  - "Production-ready"
  - "Real AI / real OCR"
  - "App Store ready"
```

---

## 10. Related Documents

| Document | Purpose |
|---|---|
| [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md) | Portfolio pitch, talking points, claim boundaries |
| [MVP_ALPHA_DEMO_SHOWCASE.md](MVP_ALPHA_DEMO_SHOWCASE.md) | Polished portfolio showcase with 7 screenshots |
| [MVP_ALPHA_DEMO_RUNBOOK.md](MVP_ALPHA_DEMO_RUNBOOK.md) | Technical QA walkthrough and verification checklist |
| [MVP_ALPHA_STATUS.md](MVP_ALPHA_STATUS.md) | One-page system status overview |
| [ROADMAP.md](ROADMAP.md) | Full phase history and future plans |
