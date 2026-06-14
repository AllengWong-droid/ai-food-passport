# Privacy Policy Draft

> **Status**: Draft only — not legal advice
> **Review required**: Must be reviewed by a qualified person before public App Store submission
> **Phase**: 21E
> **Date**: 2026-06-14
> **App**: AI Food Passport (MVP Alpha — mock-only)

---

## Important Disclaimer

**This document is a draft template.** It is not legal advice. Privacy laws vary by jurisdiction (GDPR in Europe, CCPA in California, etc.). Before using this privacy policy for any public App Store or TestFlight submission, have it reviewed by a qualified professional familiar with app privacy requirements in your target markets.

This draft is designed for **MVP Alpha / mock-only** status. When real AI providers are enabled and the app moves toward production, this policy must be updated.

---

## 1. App Identity

| Field | Value |
|---|---|
| App name | AI Food Passport |
| Version covered | MVP Alpha (mock-only) |
| Current status | No real OCR or AI providers enabled. All scan results are deterministic mock data. |
| Backend | Render free-tier mock backend (`https://ai-food-passport.onrender.com`). No real provider calls. |
| `productionReady` | `false` |

---

## 2. Data Currently Collected in MVP Alpha

**Short answer: None.**

The MVP Alpha app does not use accounts, login, payments, analytics, Firebase, or real AI provider calls. In local/offline preview mode, demo data is deterministic mock data. When configured to use the Render demo backend, requests may be sent to the Render-hosted mock backend, but no real OCR/AI provider is enabled and no API keys are stored in Flutter.

| Data Type | Collected? | How? |
|---|---|---|
| Account information | ❌ No | No account system exists |
| Login credentials | ❌ No | No login flow |
| Firebase data | ❌ No | No Firebase integration |
| Payment information | ❌ No | No payments or subscriptions |
| Analytics / crash reports | ❌ No | No analytics SDKs integrated |
| Real AI provider calls | ❌ No | All providers disabled; mock-only |
| Persistent personal cloud storage | ❌ No | All data is local on-device |
| Menu images | ⚠️ Depends on mode | In local/offline preview mode: images are used for local mock flow only. When `BACKEND_BASE_URL` is configured to point to the Render mock backend: menu images are transmitted to the Render-hosted mock backend for processing. No real OCR/AI provider is enabled and no API keys are stored in Flutter. |
| Traveler settings | ⚠️ Local only | Home country, currency, allergies stored locally via `shared_preferences`; not transmitted |

**Summary**: Current MVP Alpha does not use accounts, login, payments, analytics, Firebase, or real AI provider calls. In local/offline preview mode, demo data is deterministic mock data. When configured to use the Render demo backend, requests may be sent to the Render-hosted mock backend, but no real OCR/AI provider is enabled and no API keys are stored in Flutter.

---

## 3. Data the Future Production App May Process

When real OCR and AI providers are enabled in a future production release, the app may process:

| Data Type | How It's Used | Stored? |
|---|---|---|
| **Menu images** | Sent to backend for OCR processing | Not stored permanently; processed in memory |
| **OCR text** (extracted from images) | Sent to AI analysis provider | Not stored permanently |
| **Dietary preferences** (allergies, spice tolerance) | Included in AI analysis prompt | Local only (on-device) |
| **Allergen preferences** | Included in AI analysis prompt | Local only (on-device) |
| **App diagnostics** (crash logs, performance) | Used to improve app stability | Optional; user can opt out |

**Important**: Even in the future production app, API keys never live in the Flutter app. All provider calls go through the backend proxy, which keeps keys server-side.

---

## 4. How Data Is Handled (Design Principles)

These are the intended data-handling principles for the production app. They are **not yet fully implemented** in MVP Alpha.

| Principle | Status | Detail |
|---|---|---|
| API keys server-side only | ✅ Designed | Keys live in backend env vars; Flutter never sees them |
| Provider calls through backend proxy | ✅ Designed | Flutter sends images to backend; backend calls providers |
| No API keys in Flutter | ✅ Enforced | Checked by 41 config unit tests |
| No unnecessary data retention | 🔲 Planned | Backend should not store menu images after processing |
| User control over data | 🔲 Planned | Future: delete scan history, export data |
| HTTPS only | ✅ Enforced | Backend URL validation rejects non-HTTPS in production config |

---

## 5. Third-Party Services

| Service | Purpose | Data Shared | Privacy Policy |
|---|---|---|---|
| **Render** (backend hosting) | Hosts the backend mock server | No personal data (mock-only) | https://render.com/privacy |
| **Future OCR/AI provider** (e.g., Qwen) | Menu image analysis | Menu images + dietary preferences (when enabled) | TBD — link to provider's privacy policy |
| **GitHub Pages** (privacy policy hosting) | Hosts this privacy policy page | No data | https://docs.github.com/en/pages |

**Note**: When real AI providers are enabled, their privacy policies must be linked here, and users must be informed that menu images are sent to those providers for processing.

---

## 6. User Choices

| Choice | How |
|---|---|
| **Avoid uploading sensitive images** | Only scan menu images; avoid personal documents |
| **Use mock-only mode** | Current default; no real providers are called |
| **Delete local data** | Uninstall the app (clears `shared_preferences`) |
| **Contact support** | Via GitHub Issues (see Section 7) |

---

## 7. Contact / Support

| Method | URL / Address |
|---|---|
| **Support** | https://github.com/`<username>`/AI-Food-Passport/issues |
| **Privacy questions** | Same as support URL |

*Replace `<username>` with your actual GitHub username before submitting.*

---

## 8. Future Privacy Policy URL Plan

| Phase | URL | Status |
|---|---|---|
| **Now (MVP Alpha / TestFlight draft)** | `https://<username>.github.io/AI-Food-Passport/privacy` | 🔲 To be created |
| **Future (custom domain)** | `https://aifoodpassport.com/privacy` | 🔲 Planned (after domain purchase) |

The GitHub Pages version should be created before any TestFlight submission. It can be a simple Markdown file rendered as HTML.

---

## 9. App Store Privacy Label Preparation Notes

Apple requires a privacy label for App Store Connect. This section tracks what will need to be declared.

### 9.1 Current MVP Alpha / Mock-Only

| Label Category | Answer | Notes |
|---|---|---|
| **Data used to track you** | None | No tracking |
| **Data linked to you** | None | No login, no account |
| **Data not linked to you** | None | No data collected at all |

The current app qualifies for the simplest privacy label: **no data collected**.

### 9.2 Future Production (When Real Providers Enabled)

| Label Category | Likely Answer | Notes |
|---|---|---|
| **Contact Info** | Possibly (if support email is added) | Not yet decided |
| **Health & Fitness** | Possibly (allergen preferences) | Must be reviewed carefully — allergen data may be considered health data |
| **Location** | No | No location access |
| **Identifiers** | No | No device ID collection |
| **Usage Data** | Possibly (diagnostics) | Optional; user can opt out |
| **Photos or Videos** | Yes (menu images) | Must declare — images sent to backend for OCR |

**Action required before production submission**: Complete Apple's privacy label questionnaire in App Store Connect and update this policy accordingly.

---

## 10. Changes to This Privacy Policy

When this policy is updated, the new version will be posted at the same URL. For significant changes (new data collection, new third-party providers), a notice will be added to the app or the GitHub repo.

---

## 11. Full Privacy Policy Text (Draft for Hosting)

*This section contains the actual privacy policy text that can be copied into a GitHub Pages HTML page or a dedicated privacy policy host.*

---

# Privacy Policy

**Effective date**: [TO BE SET WHEN PUBLISHED]

**App**: AI Food Passport

---

## 1. Introduction

AI Food Passport ("the App") is a mobile application that helps travelers understand foreign menus, check dishes against their dietary preferences and allergen profile, and make informed food choices while traveling.

This privacy policy explains what data the App collects, how it is used, and your choices. This policy applies to the MVP Alpha version of the App and will be updated as the App evolves.

---

## 2. What Data We Collect

### 2.1 Data You Provide Directly

| Data | When | Stored |
|---|---|---|
| Menu images (photos) | When you use the scan feature | On-device (mock-only mode) or sent to backend (production mode) |
| Dietary preferences (allergies, spice tolerance) | When you set traveler preferences | On-device only (`shared_preferences`) |

### 2.2 Data Collected Automatically

None in the current MVP Alpha version.

In a future production version with analytics enabled, the App may collect:
- App crash reports (optional)
- Anonymous usage statistics (optional, opt-in)

### 2.3 Data We Do NOT Collect

- No account information (no login)
- No payment information (no subscriptions yet)
- No location data
- No contact list or photos outside of menu scanning
- No browsing history

---

## 3. How We Use Your Data

| Data | Purpose |
|---|---|
| Menu images | To extract text via OCR and analyze dishes via AI |
| Dietary preferences | To personalize dish recommendations and flag allergens |
| Crash reports | To fix bugs and improve stability |

We do NOT:
- Sell your data to third parties
- Use your data for advertising
- Train AI models on your menu images without your consent

---

## 4. Data Sharing

Menu images and extracted text are sent to our backend server (`https://ai-food-passport.onrender.com`) for processing. The backend forwards menu images to third-party OCR and AI providers (e.g., Qwen) for analysis.

These third-party providers have their own privacy policies. We encourage you to review them.

We do NOT share your data with advertisers, data brokers, or any other third parties except as described above.

---

## 5. Data Retention

- **On-device data** (traveler settings): Stored until you uninstall the App or reset settings.
- **Menu images sent to backend**: Not permanently stored. Images are processed in memory and discarded after the analysis is complete.
- **Backend logs**: May contain request metadata (timestamp, response status). Logs are retained according to the backend hosting provider's (Render) retention policy.

---

## 6. Your Rights

Depending on your jurisdiction, you may have the right to:
- Access the data we hold about you
- Delete your data
- Object to data processing
- Export your data

To exercise these rights, contact us at: [support URL — to be added]

---

## 7. Security

- API keys are stored server-side only; they are never embedded in the App.
- All backend communication uses HTTPS.
- The App does not implement end-to-end encryption for menu images (images are sent over HTTPS to the backend).

---

## 8. Children's Privacy

The App is not directed to children under 13 (or the applicable age in your jurisdiction). We do not knowingly collect data from children. If you believe a child has provided us with personal data, contact us and we will delete it.

---

## 9. Changes to This Policy

We may update this policy from time to time. The updated policy will be posted at the same URL. If there are significant changes, we will notify users via the App or the GitHub repository.

---

## 10. Contact

For questions about this privacy policy, contact:

**Support**: https://github.com/`<username>`/AI-Food-Passport/issues

---

*This privacy policy draft is provided as a template. It must be reviewed by a qualified professional before use in any public App Store or TestFlight submission.*

---

*End of PRIVACY_POLICY_DRAFT.md*
