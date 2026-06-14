# App Store Metadata Draft

> **Status**: Draft only — not yet submitted to App Store Connect
> **Phase**: 21E
> **Date**: 2026-06-14
> **App**: AI Food Passport (MVP Alpha — mock-only)
> **Depends on**: Phase 21D (App Identity Decision)

---

## Important Honesty Notes

**Before using this metadata for any submission, understand:**

- This app is **MVP Alpha / mock-only**. It returns the same 2 hardcoded dishes for every scan.
- **No real AI or OCR providers are enabled.**
- **The backend is not production-ready.** `productionReady` remains `false`.
- **This metadata is a draft.** It must be updated when real providers are enabled and the app is production-ready.
- **Do NOT claim production readiness.** Apple may reject the app if the metadata overclaims.
- **Allergen detection is NOT medically reliable** in the current mock-only version.

---

## 1. App Name

**Recommended**: `AI Food Passport`

| Field | Value | Limit |
|---|---|---|
| App Name (App Store Connect) | AI Food Passport | 30 characters |
| Characters used | 17 | ✅ Within limit |
| Fallback if "AI" rejected | Food Passport | 13 characters |

---

## 2. Subtitle Options

App Store subtitle appears below the app name in search results. Max 30 characters.

| # | Subtitle | Characters | Tone |
|---|---|---|---|
| 1 | **Scan Menus. Eat Safely.** | 24 | Action-oriented, safety |
| 2 | **Travel Menu Translator** | 22 | Functional, descriptive |
| 3 | **Menu Scanner for Travelers** | 26 | Clear, use-case |
| 4 | **Know What You're Eating** | 25 | Trust-building |
| 5 | **Smart Menu Reader & Guide** | 27 | Tech-focused |

**Recommendation**: **Option 1** (`Scan Menus. Eat Safely.`) — punchy, describes the core value in 4 words.

---

## 3. Short Description / Promotional Text

Promotional text (170 characters max) appears above the "More" fold on the App Store product page.

### Option A (149 chars)

> Scan foreign menus, translate dishes, check allergens, and compare prices in your home currency. Travel with confidence, one meal at a time.

### Option B (152 chars)

> AI Food Passport helps travelers understand foreign menus, flag possible allergens, and make informed food choices — no language barrier, no guesswork.

### Option C (Short, 128 chars)

> Your travel menu translator. Scan menus, check allergens, and order with confidence — in any language.

**Recommendation**: Option A — concise, benefit-led, within 170-char limit.

---

## 4. Full App Store Description Draft

*This is the main description that appears on the App Store product page. Apple allows up to 4,000 characters. This draft is ~1,800 characters — well within limit.*

---

**AI Food Passport: Your Travel Menu Translator**

Eating abroad should be an adventure, not a gamble. AI Food Passport helps you understand foreign menus, check dishes against your dietary needs, and make informed choices — all in your own language.

**HOW IT WORKS**

1. **Scan a menu** — Point your camera at any menu, or pick a photo from your gallery.
2. **Get instant translations** — Dishes are translated into your preferred language.
3. **Check your allergens** — The app flags dishes that may contain ingredients you avoid.
4. **See price in your currency** — Menu prices are converted to your home currency automatically.
5. **Choose with confidence** — Get a short reason why each dish fits (or doesn't fit) your taste and safety profile.

**KEY FEATURES**

- **Menu Scanning** — OCR-powered text extraction from any menu photo.
- **Allergen & Dietary Flags** — Set your allergies and dietary preferences; get matched recommendations.
- **Price Intelligence** — See menu prices converted to your home currency.
- **Personalized Recommendations** — Dishes are matched to your taste profile (spice tolerance, dietary style).
- **Travel-Ready** — Works offline for saved preferences; online for scanning and analysis.
- **Privacy-First** — Your dietary profile stays on your device. No account required.

**IMPORTANT NOTES**

- AI Food Passport is designed to help you make informed choices, but it is not a substitute for checking with restaurant staff about allergens.
- Menu translation quality depends on the clarity of the menu image and the AI provider used.
- Price conversion uses exchange rate data and may not reflect real-time rates.

**PERFECT FOR**

- Travelers eating abroad for the first time
- People with food allergies or dietary restrictions
- Anyone who wants to explore local food without the language barrier

Download AI Food Passport and turn every menu into an open book.

---

## 5. Keywords

*Keywords are invisible to users but affect App Store search ranking. Apple allows up to 100 characters, comma-separated.*

**Recommended keyword string** (98 characters):

```
menu,travel,food,allergen,translator,restaurant,price,currency,dietary,scanner
```

| Keyword | Reason |
|---|---|
| menu | Core use case |
| travel | Primary audience |
| food | Broad discoverability |
| allergen | Key value prop |
| translator | Core function |
| restaurant | Related search |
| price | Feature |
| currency | Feature |
| dietary | Value prop |
| scanner | Core action |

**Avoid**: "AI" (too broad), "passport" (may not be searched), "menu reader" (long-tail, low volume)

---

## 6. Category Recommendation

| Category | Role | Rationale |
|---|---|---|
| **Travel** | Primary | Core use case: travelers scanning foreign menus |
| **Food & Drink** | Secondary | Food content focus; users searching food apps may discover it |

**Not recommended**:
- Utilities — too broad
- Lifestyle — too vague
- Productivity — not accurate

---

## 7. Support URL Plan

| Phase | URL | Status |
|---|---|---|
| **Now (TestFlight / MVP)** | `https://github.com/<username>/AI-Food-Passport/issues` | ✅ Ready (replace `<username>`) |
| **Future (production)** | `https://aifoodpassport.com/support` | 🔲 To be created |

**Recommendation**: Use GitHub Issues for MVP/TestFlight. It's free, tracks feedback, and requires no maintenance.

---

## 8. Privacy Policy URL Plan

| Phase | URL | Status |
|---|---|---|
| **Now (TestFlight draft)** | `https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html` | ✅ Live (Phase 21G/21H) |
| **Future (custom domain)** | `https://aifoodpassport.com/privacy` | 🔲 Planned |

The privacy policy page is live and accessible at the GitHub Pages URL above. It includes all required disclaimers (draft only, MVP Alpha mock-only, productionReady: false, no real providers enabled, no API keys in Flutter). This URL is ready for future TestFlight and App Store Connect submission.

---

## 9. Review Notes Draft

*App Store review notes are visible only to Apple reviewers. They help explain the app's functionality and any special circumstances.*

---

**For MVP Alpha / Internal TestFlight Review:**

```
AI Food Passport MVP Alpha — Review Notes

OVERVIEW:
This is an MVP Alpha build for internal testing. The app currently runs on mock data (same 2 dishes returned for every scan). No real AI or OCR providers are enabled. The backend is a mock server hosted on Render free tier.

WHAT WORKS:
- Menu image selection (gallery)
- Mock scan flow with processing overlay
- Deterministic mock results (2 dishes)
- Price conversion (mock exchange rates)
- Traveler settings (local, on-device)
- Backend Mock Mode (developer feature, disabled by default)

WHAT DOES NOT WORK YET:
- Real OCR (mock only)
- Real AI analysis (mock only)
- Real exchange rate API (mock only)
- Account system (none)
- Cloud sync (none)

TESTFLIGHT NOTES:
This build is for internal testing of UI/UX flow only. Please do not reject for lack of real AI functionality — real providers will be enabled in a future release after API keys are purchased.

DEMO ACCOUNT:
None needed — the app has no login. All settings are stored locally.

CONTACT:
For review questions: https://github.com/<username>/AI-Food-Passport/issues
```

---

**For Future Production Review (when real providers are enabled):**

```
AI Food Passport — Production Review Notes

OVERVIEW:
This app uses AI (OCR + analysis) to translate foreign menus and flag allergens. All AI provider calls go through our backend proxy; API keys are server-side only.

AI TRANSPARENCY (Guideline 5.2.1):
- OCR provider: [TBD — e.g., Qwen OCR]
- AI analysis provider: [TBD — e.g., Qwen Analysis]
- Users are not required to provide personal data to use the core scan feature.
- Menu images are sent to our backend for processing. See Privacy Policy for details.

DEMO:
No demo account needed. The app works immediately after install.

CONTACT:
For review questions: [support URL]
```

---

## 10. TestFlight Tester Instructions Draft

*These are instructions for internal and external TestFlight testers. They set expectations about the mock-only status.*

---

**AI Food Passport — TestFlight Tester Guide**

Thank you for testing AI Food Passport! This is an early MVP Alpha build. Here's what to expect:

**WHAT'S REAL AND WHAT'S MOCK**

| Feature | Status |
|---|---|
| Menu image selection | ✅ Real (gallery picker) |
| OCR text extraction | 🔶 Mock (returns fake text) |
| AI dish analysis | 🔶 Mock (returns 2 fixed dishes) |
| Price conversion | 🔶 Mock (fixed exchange rate) |
| Traveler settings | ✅ Real (persisted locally) |
| Backend connection | 🔶 Mock (calls Render mock server) |

**HOW TO TEST**

1. Install the app from TestFlight.
2. Open the app. No login needed.
3. (Optional) Go to Profile and set your home country, currency, and allergies.
4. Go to Scan. Tap the scan button (you don't need to pick an image — the mock flow works without one).
5. Watch the processing overlay. After a few seconds, you'll see 2 mock dishes: **Tonkotsu Ramen** and **Miso Katsu Skewers**.
6. Tap a dish to see the detail view with price conversion and recommendation reason.
7. Go back and try changing your allergy settings — the mock results will adjust slightly.

**WHAT TO LOOK FOR (Feedback Priorities)**

- Is the scan flow intuitive?
- Is the processing overlay clear?
- Are the results presented in a useful way?
- Any UI bugs or layout issues?
- Any crashes?

**WHAT NOT TO TEST (Yet)**

- Real menu translation (it's mock-only for now)
- Real allergen detection accuracy (mock only)
- Real pricing (mock only)

**FEEDBACK**

Send feedback via: https://github.com/`<username>`/AI-Food-Passport/issues

Thank you!

---

## 11. What NOT to Claim

*This section lists claims that must NOT appear in App Store metadata, support material, or marketing — until the relevant feature is actually implemented.*

| ❌ DO NOT CLAIM | ✅ SAY INSTEAD |
|---|---|
| "Production-ready" | "MVP Alpha — portfolio demo" |
| "App Store ready" | "TestFlight internal testing" |
| "Real AI provider enabled" | "Mock-only demo; real AI coming in future release" |
| "Guarantees food safety" | "Helps flag possible allergens — always check with restaurant staff" |
| "Medically reliable allergen detection" | "Allergen flags are for guidance only" |
| "Complete food safety advice" | "Informed choices, not medical advice" |
| "Works offline for scanning" | "Scanning requires an internet connection (for future AI processing)" |
| "Supports all languages" | "Supports [list actual languages]" |
| "Free forever" | "Free during MVP testing" |

---

## 12. Screenshot Caption Ideas

*App Store requires at least 3 screenshots (up to 10). These are caption ideas for when real screenshots are captured.*

| Screenshot | Caption Idea |
|---|---|
| **Scan screen** | "Point. Tap. Discover." |
| **Processing overlay** | "Translating your menu..." |
| **Results screen** | "Two dishes. Full clarity." |
| **Dish detail** | "Price, allergens, and why it fits you." |
| **Profile / Settings** | "Set your allergies. Personalize every meal." |
| **Currency conversion** | "See prices in your home currency." |
| **Allergen flag** | "Wheat. Egg. Soy. Know before you order." |

**Note**: Screenshots must be taken with real data (or realistic mock data that doesn't look obviously fake). The current 2-dish mock is acceptable for MVP/TestFlight but may need upgrading for production App Store.

---

## 13. Required Assets Still Missing

| Asset | Status | Priority |
|---|---|---|
| **App icon** (custom, not Flutter default) | ❌ Missing | High (before TestFlight) |
| **Launch screen** (branded) | ❌ Missing | Medium (before TestFlight) |
| **Screenshots** (3-10, real device frames) | ❌ Missing | High (before App Store) |
| **Privacy policy page** (live URL) | ✅ Ready (`https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html`) | High (before TestFlight) |
| **Support page** (live URL) | ⚠️ Placeholder (GitHub Issues) | Medium |
| **App preview video** (optional) | ❌ Missing | Low |
| **App Store icon** (1024x1024, no transparency) | ❌ Missing (same as app icon) | High (before TestFlight) |

---

## 14. Next Recommended Phase

| Priority | Phase | Rationale |
|---|---|---|
| ~~**3**~~ **Done** | ~~Privacy policy page creation~~ | ✅ Completed in Phase 21G — live at `https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html` |
| **1** | **Phase 21G: iOS Config Patch Plan** | Apply the identity decisions (Phase 21D) to actual iOS config files. Depends on macOS + Apple Developer membership. |
| **2** | **Phase 16B: Qwen OCR Real Smoke** | First real provider test. Blocked until real API key exists. Most impactful technical next step. |
| **4** | **App icon design** | Required for TestFlight. The Flutter default icon is not acceptable. |

---

*This metadata draft must be updated when real AI providers are enabled and the app moves toward production readiness. Do NOT submit this draft as-is to App Store Connect without reviewing the honesty notes in Section 1.*

---

*End of APP_STORE_METADATA_DRAFT.md*
