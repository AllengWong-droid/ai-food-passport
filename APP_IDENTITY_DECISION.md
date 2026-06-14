# App Identity Decision

> **Phase**: 21D
> **Date**: 2026-06-14
> **Type**: Documentation-only decision document
> **Depends on**: Phase 21C (iOS Build Readiness Audit)
> **Purpose**: Decide the iOS/TestFlight app identity before any config changes are made

---

## Important Honesty Statements

**Before reading this document, understand the current reality:**

- This project is **MVP Alpha / mock-only**. It returns the same 2 hardcoded dishes for every scan.
- **No real AI or OCR providers are enabled.** All Qwen/OpenAI/DeepSeek code sits behind safety gates that are NOT activated.
- **The backend is not production-ready.** `productionReady` remains `false`.
- **This app has never been built for iOS.** No Mac/Xcode build has been performed.
- **No Apple Developer Program membership has been purchased.** No App Store Connect record exists.
- **This document is a forward-looking decision.** Nothing in it will be applied to iOS config until a future "apply identity" phase.

---

## 1. Current Identity Problems

### 1.1 Default Bundle ID

| Field | Current Value | Problem |
|---|---|---|
| `Info.plist` CFBundleIdentifier | `$(PRODUCT_BUNDLE_IDENTIFIER)` | Resolves to placeholder via build variable |
| `project.pbxproj` Debug | `com.example.aiFoodPassport` | Flutter default; `com.example.*` is Apple's documented example domain |
| `project.pbxproj` Release | `com.example.aiFoodPassport` | Same — unsuitable for any submission |
| `project.pbxproj` Profile | `com.example.aiFoodPassport` | Same |
| RunnerTests | `com.example.aiFoodPassport.RunnerTests` | Same |
| **Verdict** | ❌ Must be changed before App Store Connect record creation | |

`com.example.*` is explicitly reserved by Apple as a placeholder namespace. Using it for any TestFlight or App Store submission will be rejected. The Bundle ID must be finalized **before** creating an App Store Connect record — changing it afterward requires a new app record or a transfer process.

---

### 1.2 App Display Name Length Issue

| Field | Current Value | Characters | Apple Limit | Problem |
|---|---|---|---|---|
| `CFBundleDisplayName` | `Ai Food Passport` | 17 | 30 | ✅ Within limit |
| `CFBundleName` | `ai_food_passport` | 17 | 15 | ❌ Exceeds limit by 2 chars |

`CFBundleName` is the internal short name. If `CFBundleDisplayName` is absent or the system falls back, `CFBundleName` is used — and it will be **truncated to 15 characters**. On the home screen this could appear as `ai_food_passp...` or `ai_food_passpor` depending on iOS truncation behavior.

The use of underscores in `CFBundleName` is also unusual — most iOS apps use a short, human-readable, PascalCase or space-separated name here.

---

### 1.3 Default Flutter Icon

| Attribute | Current Value | Verdict |
|---|---|---|
| Icon files | 19 PNG files (13 unique sizes) | ✅ Sufficient count |
| Content | Default Flutter blue/white globe logo | ❌ Not branded |
| 1024x1024 (App Store) | Flutter default | ❌ Placeholder |
| **Verdict** | ❌ Needs custom design before any submission | |

All 19 icon PNGs are the generic Flutter scaffold icon — a stylized "F" on a blue gradient. This conveys no identity and won't pass App Store review. A custom icon must be designed and applied.

---

### 1.4 Unbranded Launch Screen

| Attribute | Current Value | Verdict |
|---|---|---|
| Storyboard file | `LaunchScreen.storyboard` (Flutter default) | ✅ Exists |
| Content | Blank white screen | ❌ Unbranded |
| **Verdict** | ⚠️ Functional but unbranded — needs design before TestFlight | |

The launch screen is a plain white view with no logo, no app name, and no branding. Apple requires launch screens to be minimal (not a splash screen that delays launch), but a simple centered logo or app name is both acceptable and recommended.

---

## 2. App Name Options

Four candidate names are evaluated against Apple's 30-character limit and user discoverability.

| # | Name | Characters | Pros | Cons |
|---|---|---|---|---|
| 1 | **AI Food Passport** | 17 | Full name; describes AI + food + passport concept; consistent with project branding | "AI" may trigger additional App Store review scrutiny |
| 2 | **Food Passport** | 13 | Clean, short; drops "AI" for broader appeal; easier to fit on home screen | Loses the "AI" differentiation; may be confused with food delivery apps |
| 3 | **Menu Passport** | 13 | Specific to menu scanning; unique angle | Narrow scope; "Menu" doesn't convey travel/translation |
| 4 | **Travel Menu Guide** | 17 | Descriptive of the use case | Generic; easily confused with travel guide apps; no brand identity |

**Analysis**:

- **AI Food Passport** has the strongest brand continuity — the project, GitHub repo, documentation, README, portfolio, and demo video all use this name. Apple's "AI" scrutiny is a known risk (guideline 5.2.1 for AI-generated content disclosure), but since the mock app does not use real AI and would only move to real AI after explicit opt-in, this is manageable.
- **Food Passport** is the strongest alternative if "AI" becomes a review blocker. It keeps the "passport" brand concept and is short enough for home screen.
- **Menu Passport** and **Travel Menu Guide** are weaker — the former narrows the concept, the latter is generic.

---

## 3. Recommended App Store Display Name

**Recommendation: "AI Food Passport"**

| Aspect | Detail |
|---|---|
| Name | AI Food Passport |
| Characters | 17 (well within 30-char limit) |
| Rationale | Brand continuity across GitHub, docs, portfolio, demo video |
| Risk mitigation | If App Store review flags "AI", fall back to "Food Passport" |
| Commit timeline | Finalize now; apply to iOS config in a future "apply identity" phase |

---

## 4. Recommended iOS Internal Bundle Name

**Recommendation: "Food Passport"**

| Field | Recommended Value | Characters | Limit |
|---|---|---|---|
| `CFBundleName` | `Food Passport` | 13 | ≤15 ✅ |
| Rationale | 13 chars — within the 15-char limit with 2 chars margin. Human-readable, no underscores. |

Note: `CFBundleDisplayName` will remain "Ai Food Passport" (or updated to "AI Food Passport") as the user-visible name. `CFBundleName` is the fallback short name used when the display name is unavailable — keeping it short and readable is the primary goal.

---

## 5. Recommended Bundle ID

**Primary recommendation: `com.<yourdomain>.aifoodpassport`**

| Component | Value | Notes |
|---|---|---|
| Reverse domain prefix | `com.<yourdomain>` | Replace `<yourdomain>` with your actual domain (e.g., personal site, company domain) |
| App identifier | `aifoodpassport` | Lowercase, no special characters, concise |
| Full Bundle ID | `com.<yourdomain>.aifoodpassport` | Standard iOS reverse-domain convention |

**Why this format**:
- Apple requires a reverse-domain identifier.
- The domain you use should be one you control or have rights to.
- `aifoodpassport` is concise (15 chars for the app part), no hyphens or underscores.
- This is the identifier App Store Connect uses forever — changing it post-creation is painful.

---

## 6. Bundle ID Fallback Options If Domain Ownership Is Unavailable

If you do not own a domain or prefer not to use one, these are the practical fallback options:

| # | Bundle ID | Viability | Notes |
|---|---|---|---|
| 1 | `com.github.<username>.aifoodpassport` | ✅ Good | Uses your GitHub username as the namespace. Common in open-source apps. Valid as long as you own the GitHub account. |
| 2 | `com.<yourname>.aifoodpassport` | ✅ Okay | Uses your personal name. Loose but acceptable if you don't want to register a domain. |
| 3 | `app.aifoodpassport.ios` | ⚠️ Risky | Non-standard reverse order. Apple may accept it but it's not the convention. |
| 4 | `com.aifoodpassport.app` | ⚠️ Risky | Looks like a domain `aifoodpassport.app` — only use this if you actually own `aifoodpassport.app`. |
| 5 | Any `com.example.*` variant | ❌ Rejected | `com.example.*` is explicitly reserved by Apple. Will be rejected at submission. |

**Recommendation if no domain is available**: Use **`com.github.<username>.aifoodpassport`** (option 1). It's specific, verifiable (tied to your GitHub account), and follows the reverse-domain convention.

---

## 7. App Category Recommendation

**Primary category: Travel**
**Secondary category: Food & Drink**

| Category | Rationale |
|---|---|
| **Travel** (Primary) | Core use case: travelers scanning foreign menus, currency conversion, dietary safety. Aligns with "passport" branding. |
| **Food & Drink** (Secondary) | Food content focus. Users searching for food-related apps may discover it here. |

**Not recommended**:
- **Utilities** — Too broad; this is not a general-purpose tool.
- **Productivity** — Not accurate for a consumer scanner app.
- **Lifestyle** — Too vague; Travel is more specific and discoverable.

---

## 8. App Subtitle Options

App Store allows a subtitle of up to 30 characters. This appears below the app name in search results.

| # | Subtitle | Characters | Vibe |
|---|---|---|---|
| 1 | **Scan Menus. Eat Safely.** | 24 | Action-oriented, safety-focused |
| 2 | **Your Travel Menu Translator** | 26 | Descriptive, functional |
| 3 | **Menu Scanner for Travelers** | 26 | Generic but clear |
| 4 | **Know What You're Eating** | 23 | Emotional, trust-building |
| 5 | **Smart Menu Reader & Guide** | 25 | Tech-focused |

**Recommendation: "Scan Menus. Eat Safely."** (option 1)

It's punchy, describes exactly what the app does in 4 words, and emphasizes the safety value proposition. The period creates a rhythmic pause that reads well on the App Store.

**Runner-up: "Your Travel Menu Translator"** (option 2) — if a more functional/descriptive tone is preferred.

---

## 9. Short App Store Description Draft

*This is a 170-character-or-less "Promotional Text" draft for the App Store listing. This is NOT the full description — that comes later.*

> AI Food Passport helps travelers scan foreign menus, translate dishes, check allergens, and compare prices in their home currency — so you always know what you're ordering.

**Characters**: 173 (slightly over; can trim to fit 170)

**Trimmed version (under 170)**:

> Scan foreign menus, translate dishes, check allergens, and compare prices in your home currency. Travel with confidence, one meal at a time.

**Characters**: 149 ✅

---

## 10. Support URL Strategy

**Recommendation: GitHub Issues page**

| Option | URL Format | Pros | Cons |
|---|---|---|---|
| **GitHub Issues** (Recommended) | `https://github.com/<username>/AI-Food-Passport/issues` | Free, already exists, public, low maintenance | Not a dedicated support portal; public visibility |
| GitHub Discussions | `https://github.com/<username>/AI-Food-Passport/discussions` | More conversational than Issues | Must be enabled in repo settings |
| Dedicated support page | Custom URL | Professional | Requires hosting, maintenance, cost |
| Email support | `mailto:support@<domain>` | Personal | Exposes personal email; harder to track |

**Recommendation**: Use **GitHub Issues** for the MVP/TestFlight phase. It's free, already set up, and tracks feedback automatically. Upgrade to a dedicated support page when the app moves toward App Store submission.

---

## 11. Privacy Policy URL Strategy

**Recommendation: Host a privacy policy page on the Render backend or a static site**

| Option | Pros | Cons |
|---|---|---|---|
| **Render backend static route** | Free, same domain as backend, lightweight | Requires adding a route; Render free tier spins down |
| **GitHub Pages** | Free, always online, separate from backend | Requires a new repo or `/docs` folder setup |
| **GitHub repo file** (raw URL) | Free, dead simple | Unprofessional; raw markdown on App Store looks bad |
| **Privacy policy generator + static host** | Professional, legally sound | May cost money; overkill for TestFlight |

**Recommendation**: For TestFlight, use **GitHub Pages** with a simple `privacy.md` rendered as HTML, at `https://<username>.github.io/AI-Food-Passport/privacy`. This URL stays alive even when Render spins down.

Key content the privacy policy must cover:
- What data is collected (currently: none — all local, mock-only)
- Camera usage (for menu scanning)
- No third-party data sharing (true for mock-only phase)
- Contact information (GitHub Issues link)
- Future: AI provider data processing disclosure (when real providers are enabled)

---

## 12. Icon Direction

### 12.1 Visual Concept

**Core metaphor**: A **passport booklet + fork/spoon** or a **passport booklet + menu card**

- The passport shape conveys "travel" instantly.
- A subtle fork/spoon (or chopsticks, considering the Asian food context) conveys "food."
- The combination = "food passport" — exactly what the app is.

**Alternative concept**: A **menu card with a magnifying glass overlay** — emphasizing the scanning/translation function.

### 12.2 Colors

| Color | Role | Rationale |
|---|---|---|
| **Deep navy blue** (`#1B2A4A`) | Primary background | Passport color; professional, travel-associated |
| **Gold/amber** (`#D4A843`) | Accent / emblem | Passport stamp color; warmth; premium |
| **Warm white** (`#FFF8F0`) | Secondary / text on dark | Readable, warm, menu-like |

**What to avoid**: The default Flutter blue (`#0553B1`) — it's already associated with the "F" logo and feels generic.

### 12.3 What NOT to Include

- ❌ **No AI/robot icons** — The app's AI is backend-only and mock for now. Don't overclaim.
- ❌ **No camera icons** — While scanning is a feature, the icon should represent the *outcome* (understanding food), not the *input method* (camera).
- ❌ **No globe icons** — Too similar to Safari, maps, or translation apps.
- ❌ **No text in the icon** — Unreadable at small sizes; Apple recommends symbolic icons.
- ❌ **No real food photography** — Photos don't scale well to icon sizes. Stick to stylized vector art.

---

## 13. Launch Screen Direction

### 13.1 Design Principle

Apple's Human Interface Guidelines: The launch screen should **mirror the app's first frame** — not be a branding splash. It should feel like the app loads instantly.

### 13.2 Recommended Design

| Element | Detail |
|---|---|
| **Background** | Solid deep navy (`#1B2A4A`) — matches icon primary color |
| **Center content** | Small centered app icon (simplified, ~80pt) + "AI Food Passport" in gold/white text below |
| **No loading spinners** | Apple discourages spinners on launch screens |
| **No animations** | Launch screen is static — iOS animates the transition to the app |

### 13.3 Implementation

The launch screen is a `LaunchScreen.storyboard` file in `ios/Runner/`. This can be edited in Xcode's Interface Builder or manually in XML. The design uses standard UIKit views — no Flutter code involved.

---

## 14. Final Decision Table

| Decision | Recommended Value | Fallback | When to Apply |
|---|---|---|---|
| **App Store name** | AI Food Passport | Food Passport (if AI rejected) | When creating App Store Connect record |
| **iOS display name** (`CFBundleDisplayName`) | AI Food Passport | Food Passport | Future "apply identity" phase |
| **iOS bundle name** (`CFBundleName`) | Food Passport | — | Future "apply identity" phase |
| **Bundle ID** | `com.<yourdomain>.aifoodpassport` | `com.github.<username>.aifoodpassport` | Before App Store Connect record creation |
| **Primary category** | Travel | — | App Store Connect metadata |
| **Secondary category** | Food & Drink | — | App Store Connect metadata |
| **Subtitle** | Scan Menus. Eat Safely. | Your Travel Menu Translator | App Store Connect metadata |
| **Support URL** | GitHub Issues | GitHub Discussions | App Store Connect metadata |
| **Privacy URL** | GitHub Pages (`<username>.github.io/AI-Food-Passport/privacy`) | Backend static route | App Store Connect metadata |
| **Icon concept** | Passport booklet + fork/spoon | Menu card + magnifying glass | Future "apply identity" phase |
| **Launch screen** | Solid navy + centered icon/name | — | Future "apply identity" phase |

---

## 15. Next Phase Recommendation

### 15.1 Do NOT Apply iOS Config Changes Yet

Reasons:
1. **No macOS available** — even if we change Info.plist values, the build can't be verified.
2. **No Apple Developer membership** — changing Bundle ID before having a membership adds no value.
3. **No App Store Connect record** — identity decisions should be locked in before creating the record, not after.
4. **Mock-only app** — applying identity to a mock-only app is premature. Real AI providers should come first.

### 15.2 Recommended Next Phases (in order)

| Priority | Phase | Rationale |
|---|---|---|
| **1** | **Phase 21E: Privacy Policy Draft** | Required for TestFlight AND App Store. Can be drafted now without any Apple membership. |
| **2** | **Phase 21F: App Store Metadata Draft** | Full description, keywords, screenshots plan — all draftable now. |
| **3** | **Phase 16B: Qwen OCR Real Smoke** | The first real provider test. Blocked until real API key exists. This is the most impactful technical next step. |
| **4** | **Phase 21G: iOS Config Patch Plan** | Apply the decisions from this document to actual iOS config files. Only after macOS is available and membership is purchased. |

### 15.3 What CAN Be Done Now (Free, No Apple Membership, No Mac)

- ✅ Write the privacy policy (Phase 21E)
- ✅ Draft App Store metadata: description, keywords, promotional text (Phase 21F)
- ✅ Design the app icon concept (sketch/Figma)
- ✅ Design the launch screen concept
- ✅ Secure a domain or confirm GitHub username for Bundle ID
- ✅ Enable GitHub Discussions (if desired as support URL fallback)

---

## Appendix: Honesty Checklist

Before any App Store or TestFlight submission, verify:

- [ ] `productionReady` is `true` (currently: **false**)
- [ ] Real AI/OCR providers are enabled and tested (currently: **mock-only**)
- [ ] Backend is production-deployed with real providers (currently: **mock-only**)
- [ ] App icon is custom-designed, not Flutter default (currently: **default**)
- [ ] Bundle ID is finalized and NOT `com.example.*` (currently: **placeholder**)
- [ ] Privacy policy is published and accessible at the submitted URL (currently: **not drafted**)
- [ ] Launch screen is branded (currently: **blank white**)
- [ ] Apple Developer Program is active (currently: **not purchased**)
- [ ] At least one successful iOS build exists (currently: **never built**)

**None of these conditions are met yet. This document is a plan, not a status report.**

---

*This document will be updated when Phase 21G (iOS Config Patch Plan) applies these decisions.*
