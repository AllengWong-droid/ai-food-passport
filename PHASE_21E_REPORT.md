# Phase 21E Report — Privacy Policy & App Metadata Draft

> **Phase**: 21E
> **Date**: 2026-06-14
> **Type**: Documentation-only draft
> **Depends on**: Phase 21D (App Identity Decision)
> **Tag**: `phase-21e-privacy-metadata-draft`

---

## 1. What Was Done

Created two draft documents for future App Store / TestFlight submission preparation:

1. **`PRIVACY_POLICY_DRAFT.md`** — 11-section privacy policy draft covering current mock-only data collection (none), future production data processing, data handling principles, third-party services, user choices, contact/support placeholder, privacy policy URL plan, and App Store privacy label preparation notes.

2. **`APP_STORE_METADATA_DRAFT.md`** — 14-section App Store metadata draft covering app name, subtitle options, short description, full description, keywords, category, support/privacy URL plans, review notes draft (MVP Alpha + future production), TestFlight tester instructions, honesty notes (what NOT to claim), screenshot caption ideas, missing assets list, and next phase recommendation.

Both documents include prominent honesty disclaimers and do NOT claim production readiness, real AI provider enablement, or App Store readiness.

---

## 2. Files Changed

| File | Status | Description |
|---|---|---|
| `PRIVACY_POLICY_DRAFT.md` | **New** | 11-section privacy policy draft |
| `APP_STORE_METADATA_DRAFT.md` | **New** | 14-section App Store metadata draft |
| `README.md` | **Edited** | Added 2 new doc links to Demo & QA list |
| `ROADMAP.md` | **Edited** | Added Phase 21E to completed list |

**Total: 2 new files, 2 edited files. All documentation only.**

---

## 3. What Did NOT Change

| Dimension | Status | Explanation |
|---|---|---|
| **Flutter code** | ❌ Not changed | No `.dart` files touched |
| **iOS config** | ❌ Not changed | `Info.plist`, `project.pbxproj` unchanged |
| **Backend code** | ❌ Not changed | No `backend/src/` files touched |
| **Render config** | ❌ Not changed | `render.yaml`, `backend/.env` unchanged |
| **Screenshots** | ❌ Not changed | `docs/screenshots/` untouched |
| **Secrets / API keys** | ❌ Not added | No keys stored anywhere |
| **Firebase** | ❌ Not added | No Firebase integration |
| **Real providers** | ❌ Not enabled | All real providers remain behind safety gates |
| **productionReady** | ❌ Not changed | Remains `false` |
| **Git auto-commit** | ❌ Not performed | Per Phase 21E instructions |

---

## 4. Verification Results

### 4.1 `git status --short`

```
?? APP_STORE_METADATA_DRAFT.md
?? PRIVACY_POLICY_DRAFT.md
```

**2 untracked files (both documentation). No modified files yet (README.md and ROADMAP.md edits pending).**

### 4.2 `git diff --name-status`

*(Run after README.md and ROADMAP.md edits — see Section 6 for final result.)*

### 4.3 `git diff --check`

*(Run after all edits — see Section 6 for final result.)*

### 4.4 `flutter test`

*(Run after all edits — see Section 6 for final result.)*

---

## 5. Key Draft Decisions

### 5.1 Privacy Policy

| Decision | Value |
|---|---|
| Current MVP Alpha data collection | No accounts, login, payments, analytics, Firebase, or real AI provider calls. Local mode uses deterministic mock data. When backed by Render mock backend, requests are sent to Render but no real OCR/AI provider is enabled and no API keys are stored in Flutter. |
| Future production data | Menu images, OCR text, dietary preferences, diagnostics |
| API key handling | Server-side only; Flutter never sees them |
| Third-party services | Render (backend), future OCR/AI provider, GitHub Pages |
| Privacy policy URL plan | GitHub Pages first (`<username>.github.io/AI-Food-Passport/privacy`), custom domain later |
| App Store privacy label (current) | No data collected — simplest label |

### 5.2 App Store Metadata

| Decision | Value |
|---|---|
| App name | AI Food Passport |
| Subtitle | Scan Menus. Eat Safely. |
| Promotional text | Option A (149 chars) |
| Keywords | `menu,travel,food,allergen,translator,restaurant,price,currency,dietary,scanner` (98 chars) |
| Primary category | Travel |
| Secondary category | Food & Drink |
| Support URL | GitHub Issues |
| Privacy URL | GitHub Pages (to be created) |

---

## 6. Raw Command Output

### 6.1 `git status --short`

```
 M README.md
 M ROADMAP.md
?? APP_STORE_METADATA_DRAFT.md
?? PHASE_21E_REPORT.md
?? PRIVACY_POLICY_DRAFT.md
```

(2 modified, 3 untracked — all documentation.)

### 6.2 `git diff --name-status`

```
M       README.md
M       ROADMAP.md
```

(2 files modified. Both documentation only.)

### 6.3 `git diff --check`

```
(clean — no whitespace errors; only LF/CRLF warnings)
```

No whitespace errors found.

### 6.4 `flutter test`

```
00:01 +42: All tests passed!
```

42/42 tests pass. No regressions.

---

## 7. Honesty Statement

**This phase created draft documents. It did NOT:**

- Change any iOS config
- Enable any real AI or OCR providers
- Purchase an Apple Developer Program membership
- Create an App Store Connect record
- Build the app for iOS
- Make the app TestFlight-ready or App Store-ready
- Create a live privacy policy page (the draft exists; the hosted page does not)

**The app remains MVP Alpha / mock-only.** No real providers are enabled. `productionReady` remains `false`. All 42 Flutter tests pass.

The drafts in `PRIVACY_POLICY_DRAFT.md` and `APP_STORE_METADATA_DRAFT.md` should be updated when:
1. Real providers are enabled (Phase 16B-16D)
2. The privacy policy page is actually hosted (GitHub Pages or custom domain)
3. App Store Connect submission is prepared

---

## 8. Next Phase Recommendation

| Priority | Phase | Rationale |
|---|---|---|
| **1** | **Phase 21G: iOS Config Patch Plan** | Apply identity decisions (Phase 21D) to actual iOS config files. Depends on macOS + Apple Developer membership. |
| **2** | **Privacy policy page creation** (GitHub Pages) | The draft exists; the hosted page is still missing. Required for TestFlight. |
| **3** | **Phase 16B: Qwen OCR Real Smoke** | First real provider test. Blocked until real API key exists. Most impactful technical next step. |
| **4** | **App icon design** | Required for TestFlight. The Flutter default icon is not acceptable. |

**Do NOT submit to App Store Connect yet.** The app is not ready. These drafts are preparation only.

---

*End of Phase 21E Report*
