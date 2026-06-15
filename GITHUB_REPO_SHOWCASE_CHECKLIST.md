# GitHub Repository Showcase Checklist — AI Food Passport

**Phase 25B** | **Last updated:** 2026-06-15

This checklist helps prepare the AI Food Passport GitHub repository as a polished portfolio showcase. Check off each item as completed.

---

## 1. README Top Summary

- [ ] Top-level project summary is clear and compelling (one paragraph)
- [ ] "Current MVP Features" section lists all implemented product features
- [ ] "Demo Flow" section links to demo scripts, QA checklist, recording guide
- [ ] "What is Real vs Mock" section clearly separates real features from mock
- [ ] "Safety and Limitations" section is honest and visible
- [ ] "How to Run" quickstart is simple and copy-paste ready
- [ ] "Portfolio Value" section highlights product thinking and engineering
- [ ] "Related Docs" table is up to date with all current documents
- [ ] No broken internal links
- [ ] No placeholder text or TODO items visible

## 2. Repository About / Metadata

- [ ] **About text** (sidebar): Brief one-liner describing the project
  - Suggestion: `Flutter MVP — AI menu analysis for travelers with dietary preferences and allergen warnings`
- [ ] **Repository website** (sidebar): Link to live demo or deployed backend
  - Suggestion: `https://ai-food-passport.onrender.com/health`
- [ ] **Topics** (tags): Relevant GitHub topics added
  - Suggested: `flutter`, `dart`, `riverpod`, `mvp`, `mobile-app`, `travel`, `food`, `allergens`, `portfolio`, `mock-backend`
- [ ] **Primary language** is correctly detected as Dart

## 3. Screenshots & Demo Links

- [ ] Screenshots directory exists: `docs/screenshots/mvp-alpha/`
- [ ] At least one screenshot visible in README (or linked)
- [ ] Demo video placeholder or link (if video exists)
- [ ] Recording shot list available: [DEMO_RECORDING_SHOT_LIST.md](DEMO_RECORDING_SHOT_LIST.md)
- [ ] Demo flow script available: [DEMO_PRODUCT_FLOW_SCRIPT.md](DEMO_PRODUCT_FLOW_SCRIPT.md)

## 4. Documentation Links

- [ ] [PORTFOLIO_DEMO_PACKAGE.md](PORTFOLIO_DEMO_PACKAGE.md) — complete portfolio overview
- [ ] [DEMO_PRODUCT_FLOW_SCRIPT.md](DEMO_PRODUCT_FLOW_SCRIPT.md) — demo script (60s, 2min, detailed)
- [ ] [MANUAL_QA_CHECKLIST.md](MANUAL_QA_CHECKLIST.md) — 74-point QA checklist
- [ ] [DEMO_RECORDING_SHOT_LIST.md](DEMO_RECORDING_SHOT_LIST.md) — recording guide
- [ ] [ROADMAP.md](ROADMAP.md) — full phase history
- [ ] [MVP_ALPHA_DEMO_SHOWCASE.md](MVP_ALPHA_DEMO_SHOWCASE.md) — portfolio showcase with screenshots
- [ ] [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md) — pitch and talking points
- [ ] Privacy policy: [docs/privacy-policy.html](docs/privacy-policy.html) (live on GitHub Pages)
- [ ] Phase reports: All phase reports linked in README Related Docs

## 5. Release & Tag

- [ ] Latest release created on GitHub Releases tab
  - Suggestion: Tag `phase-17a-mvp-alpha-demo-packaging` with release notes
- [ ] Release notes document: [RELEASE_NOTES_MVP_ALPHA.md](RELEASE_NOTES_MVP_ALPHA.md)
- [ ] Release includes portfolio blurbs (LinkedIn, portfolio site)

## 6. Safety & Honesty

- [ ] README clearly states "not production-ready"
- [ ] README clearly states "mock-only backend"
- [ ] README clearly states "no real OCR/AI provider enabled"
- [ ] README clearly states "no allergy safety guarantee"
- [ ] README clearly states "not medical advice"
- [ ] README clearly states "not TestFlight/App Store-ready"
- [ ] No API keys, secrets, or credentials visible in repository
- [ ] `.env` files are in `.gitignore` or use `.env.example` with placeholders

## 7. Code Quality Signals

- [ ] Test count visible in README: **97/97 passing**
- [ ] `dart analyze` result documented (54 pre-existing info-level, zero warnings/errors)
- [ ] Architecture diagram or summary present
- [ ] Tech stack listed
- [ ] CI badge (if CI is set up)
- [ ] Code is formatted (`dart format`)

## 8. Pinned Repository (GitHub Profile)

If this is a portfolio anchor project:
- [ ] Repository is pinned to GitHub profile
- [ ] Pinned order makes it visible in top 6
- [ ] Other portfolio repos complement (not compete with) this one

## 9. First-Visit Experience

A new visitor to the repo should be able to answer within 30 seconds:
- [ ] What does this project do?
- [ ] Is it real or a demo?
- [ ] How do I run it?
- [ ] What tech stack is used?
- [ ] Is it production-ready?

## 10. Final Public Repo QA

- [ ] `git status` is clean (no uncommitted changes in public view)
- [ ] All links in README resolve correctly
- [ ] All linked documents exist at the expected paths
- [ ] No merge conflict markers in any file
- [ ] No `.DS_Store` or editor temp files committed
- [ ] `.gitignore` covers common Flutter artifacts (`build/`, `.dart_tool/`, `*.iml`, `.idea/`)
- [ ] License file present (if desired for public repo)
- [ ] Code of Conduct file present (if desired for public repo)

---

## Quick Reference: Suggested Repository Configuration

| Setting | Suggested Value |
|---|---|
| **Description** | Flutter MVP — AI menu analysis for travelers with dietary preferences and allergen warnings |
| **Website** | https://ai-food-passport.onrender.com/health |
| **Topics** | flutter, dart, riverpod, mvp, mobile-app, travel, food, allergens, portfolio, mock-backend |
| **Include in homepage** | ☑ Releases, ☑ Packages |
