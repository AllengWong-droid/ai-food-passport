# Public Repository Freeze Notice — AI Food Passport

> **Status**: This notice marks the public repository as a frozen portfolio demo. See below for what this means for future development.
> **Date**: 2026-06-15
> **Version**: v0.2.0 Portfolio Demo Ready

---

## 1. Repository Identity

This repository represents **AI Food Passport v0.2.0 — Portfolio Demo Ready**.

It is a **public portfolio demo** and **mock-safe MVP Alpha**. It is not a live product, not a service, and does not claim to be production-ready.

**Live demo**: https://allengwong-droid.github.io/ai-food-passport/demo/
**GitHub Release**: https://github.com/AllengWong-droid/ai-food-passport/releases/tag/v0.2.0-portfolio-demo-ready

---

## 2. What Remains Public

The following content is and will remain part of this public repository:

| Category | Description |
|----------|-------------|
| Flutter demo UI | Full UI with scan flow, results, profile, history, dietary preferences, onboarding |
| Public GitHub Pages web demo | Deployed at `docs/demo/`, live and verified (22/22 checks) |
| Mock-safe Render backend | Backend at `ai-food-passport.onrender.com` with mock OCR and mock AI |
| Dietary preferences | 8 allergens + 5 diet restrictions saved locally |
| Session-local scan history | In-memory scan history, cleared on app restart |
| Release notes | v0.2.0 release notes, verification reports |
| QA and verification docs | 25+ phase reports, QA checklists, portfolio audit |
| Public sharing materials | Feedback guide, invitation messages, outreach tracking, resume blurbs, social post drafts |
| Public documentation index | PROJECT_INDEX.md with 50+ indexed documents |
| MIT License | Standard MIT License applies to all public code |

---

## 3. What Is Intentionally NOT Included

The following are intentionally absent from this public repository:

| Not Included | Why |
|-------------|-----|
| Real OCR provider | Mock OCR only; real provider code exists but is gated behind env variables and is not active |
| Real AI analysis provider | Mock AI only; real provider code exists but is gated behind env variables and is not active |
| Production backend | Render free-tier mock backend only; no production server, no database, no auth |
| Subscription system | No StoreKit, no RevenueCat, no payment integration, no paywalls |
| App Store / TestFlight release setup | No App Store Connect config, no provisioning profiles, no certificates |
| API keys | No real API keys in repo; `.env` is gitignored; only placeholder documentation exists |
| Private prompts | No proprietary LLM prompts or system instructions are included |
| Production security logic | No authentication, no rate limiting, no encryption beyond what Render provides |
| Commercial backend logic | No user accounts, no data persistence, no analytics, no telemetry |
| Firebase configuration | No Firebase project, no Firestore, no Firebase Auth |
| Real allergy safety or medical claims | Explicitly labeled as "not for real allergy safety decisions" throughout all docs |

---

## 4. Future Commercial Product Boundary

**Any future App Store, subscription, or production work should happen in a separate private repository or private branch.**

This public repository should not receive:

- Commercial subscription architecture (StoreKit, RevenueCat, in-app purchase logic)
- Real OCR/AI provider wiring with live credentials
- Production backend with user authentication, databases, or billing
- Proprietary prompts or system instructions
- Backend security architecture details
- Product monetization roadmap specifics
- API key management code or documentation

The public repo will remain the portfolio demo version. Future commercial development should start from a **private fork** or **new private repository** — not from this public base with sensitive additions.

---

## 5. License Note

The public portfolio demo code is licensed under the **MIT License** (see [LICENSE](LICENSE)). This license applies to all current public code.

Future commercial code may use a separate private codebase and is not required to be published here. The MIT License does not impose any obligation to open-source future commercial work.

---

## 6. Safety Note

This public repository and all its contents carry the following ongoing disclosures:

- **Mock-only**: OCR and AI analysis are simulated. No real providers are enabled.
- **Not production-ready**: The backend is a free-tier Render deployment with cold starts and no persistence.
- **No allergy guarantee**: This demo does not provide reliable allergy safety information. Do not use it for real medical decisions.
- **No medical advice**: This is a concept demo, not a medical device or diagnostic tool.
- **Not for real allergy safety decisions**: The mock AI may produce incorrect or incomplete ingredient analysis.

These disclosures are embedded in the README, the demo UI, the privacy policy, and all public-facing documents.

---

## 7. Final Verdict

**This public repository is safe as a portfolio demo and mock-safe MVP Alpha.**

- All sensitive implementation details are either excluded or gated behind environment variables that are not committed.
- The repo clearly communicates its mock-only, not-production-ready status.
- Future commercial work should be separated into a private codebase from this point forward.
- This freeze notice serves as a permanent boundary marker between the public portfolio and any future commercial development.

---

## 8. Related Documents

| Document | Link |
|----------|------|
| Public Demo QA | [PUBLIC_REPO_FINAL_QA.md](PUBLIC_REPO_FINAL_QA.md) |
| Release v0.2.0 Verification | [RELEASE_V0_2_0_VERIFICATION.md](RELEASE_V0_2_0_VERIFICATION.md) |
| Public Web Demo Live Verification | [PUBLIC_WEB_DEMO_LIVE_VERIFICATION.md](PUBLIC_WEB_DEMO_LIVE_VERIFICATION.md) |
| Feedback Collection Guide | [PUBLIC_FEEDBACK_GUIDE.md](PUBLIC_FEEDBACK_GUIDE.md) |
| Project Documentation Index | [PROJECT_INDEX.md](PROJECT_INDEX.md) |
| License | [LICENSE](LICENSE) |

---

*This freeze notice was published on 2026-06-15 as part of Phase 31A. It marks the boundary between public portfolio demo and future private commercial development.*
