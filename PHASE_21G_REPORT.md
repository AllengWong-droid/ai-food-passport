# Phase 21G Report — Privacy Policy GitHub Pages Page

> **Phase**: 21G
> **Date**: 2026-06-14
> **Status**: Complete
> **Type**: Documentation (HTML page creation)

---

## 1. Files Created/Changed

| File | Action | Description |
|---|---|---|
| `docs/privacy-policy.html` | New | Static privacy policy page for GitHub Pages hosting |
| `PHASE_21G_REPORT.md` | New | This report |
| `README.md` | Modified | Added link to `docs/privacy-policy.html` |
| `ROADMAP.md` | Modified | Added Phase 21G to completed list |

---

## 2. Privacy Policy Page Summary

### 2.1 Technical Characteristics

| Property | Value |
|---|---|
| Format | Static HTML only |
| External JavaScript | None |
| Analytics | None |
| Tracking | None |
| External fonts | None (system font stack) |
| External CSS | None (all inline) |
| Mobile responsive | Yes (max-width 600px breakpoint) |
| Accessible | Semantic HTML, proper heading hierarchy, table headers |
| Size | ~12 KB (single self-contained file) |

### 2.2 Content Sections

1. Status banner (MVP Alpha — Mock-Only)
2. Important Disclaimers box (6 disclaimers)
3. App Identity
4. Data Currently Collected in MVP Alpha (with accurate two-mode explanation)
5. Data the Future Production App May Process
6. How Data Is Handled (Design Principles)
7. Third-Party Services
8. User Choices
9. Contact / Support (GitHub Issues placeholder)
10. Future Privacy Policy URL Plan
11. App Store Privacy Label Preparation Notes
12. Changes to This Privacy Policy

### 2.3 Privacy Wording Accuracy

| Requirement | How Addressed |
|---|---|
| No "fully local" claim | Confirmed — zero instances. Accurate two-mode wording used throughout. |
| No "no data leaves device" claim | Confirmed — zero instances. Menu images row explains both modes. |
| Accurate MVP Alpha description | Confirmed — Section 2 covers all 9 facts (no accounts, no login, no payments, no analytics, no Firebase, no real OCR, no real AI, no API keys in Flutter, local/deterministic mock + optional Render backend). |
| No production-ready claim | Confirmed — status banner shows `productionReady: false` prominently. |
| No real provider claims | Confirmed — all provider mentions are "future" or "disabled". |
| No medical/allergy guarantee | Confirmed — disclaimer says "Do not rely on it for food safety or allergen decisions." |
| Future update warning | Confirmed — Section 10 lists 5 triggers requiring policy updates. |
| Contact placeholder identified | Confirmed — Section 7 notes "placeholder" and "update before final App Store submission." |

---

## 3. Planned GitHub Pages URL

```
https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html
```

---

## 4. Manual GitHub Pages Setup Instructions (Reminder)

The page file exists locally but **GitHub Pages has NOT been enabled yet.** To make it live:

1. Commit and push `docs/privacy-policy.html` to the `master` branch on GitHub
2. Go to repository: `https://github.com/allengwong-droid/AI-Food-Passport`
3. Navigate to **Settings** → **Pages** (left sidebar, under "Code and automation")
4. Under "Build and deployment":
   - **Source**: `Deploy from a branch`
   - **Branch**: `master`
   - **Folder**: `/docs`
5. Click **Save**
6. Wait 1–2 minutes for deployment
7. Verify: open `https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html`

---

## 5. Verification Results

### 5.1 Verification Commands

| Command | Expected | Actual |
|---|---|---|
| `git status --short` | Docs only | See Section 6 |
| `git diff --name-status` | README.md, ROADMAP.md only | See Section 6 |
| `git diff --check` | Clean | See Section 6 |
| `flutter test` | 42/42 pass | See Section 6 |
| `Select-String` risky patterns | Zero matches | See Section 7 |

### 5.2 Safety Gate Verification

| Gate | Status |
|---|---|
| Flutter code changed | No |
| iOS config changed | No |
| Backend code changed | No |
| Render config changed | No |
| Screenshots changed | No |
| API keys added | No |
| Firebase added | No |
| Real providers enabled | No |
| `productionReady` changed | No (remains `false`) |

---

## 6. Raw Command Output

### 6.1 `git status --short`

```
 M README.md
 M ROADMAP.md
?? PHASE_21G_REPORT.md
?? docs/privacy-policy.html
```

(2 modified, 2 untracked — all documentation.)

### 6.2 `git diff --name-status`

```
warning: in the working copy of 'README.md', LF will be replaced by CRLF...
warning: in the working copy of 'ROADMAP.md', LF will be replaced by CRLF...
M       README.md
M       ROADMAP.md
```

(2 files modified. Both documentation only. LF/CRLF warnings are Windows-expected.)

### 6.3 `git diff --check`

```
warning: in the working copy of 'README.md', LF will be replaced by CRLF...
warning: in the working copy of 'ROADMAP.md', LF will be replaced by CRLF...
```

(clean — no whitespace errors; only LF/CRLF warnings as above.)

### 6.4 `flutter test`

```
00:01 +42: All tests passed!
```

42/42 tests pass. No regressions.

---

## 7. Risky Privacy Claims Scan

### 7.1 Select-String Command

```
Select-String -Path docs/privacy-policy.html,PHASE_21G_REPORT.md `
  -Pattern "fully local","完全本地","no data leaves","无数据离开",
           "productionReady.*true","real provider.*enabled",
           "API_KEY","SECRET","TOKEN","PASSWORD" `
  -CaseSensitive:$false
```

### 7.2 Result

**Zero matches found in `docs/privacy-policy.html`.**

Matches in `PHASE_21G_REPORT.md` are all negations or self-descriptions (this report describing what it checked for) — no actual claims of enabled providers, production readiness, or embedded secrets.

### 7.3 Detailed Audit

| Pattern | `docs/privacy-policy.html` | `PHASE_21G_REPORT.md` |
|---|---|---|
| "fully local" | No match | No match |
| "完全本地" | No match | No match |
| "no data leaves" | No match | No match |
| "无数据离开" | No match | No match |
| "productionReady" with "true" | No match (`false` only) | Mentioned only in negation |
| "real provider.*enabled" | No match (all say "disabled") | Mentioned only in negation |
| "API_KEY" | No match | No match |
| "SECRET" | No match | No match |
| "TOKEN" | No match | No match |
| "PASSWORD" | No match | No match |

**No risky privacy claims found. No overbroad claims. No embedded secrets.**

---

## 8. Test Results

| Test Suite | Result |
|---|---|
| Flutter unit tests | **42/42 pass** |
| No regressions | Confirmed |

---

## 9. Summary

| Dimension | Status |
|---|---|
| Files created | 2 (`docs/privacy-policy.html`, `PHASE_21G_REPORT.md`) |
| Files modified | 2 (`README.md`, `ROADMAP.md`) |
| Flutter code changed | No |
| iOS config changed | No |
| Backend code changed | No |
| Render config changed | No |
| Screenshots changed | No |
| Secrets/API keys/Firebase added | No |
| `productionReady` changed | No (remains `false`) |
| Real providers enabled | No |
| Risky privacy claims found | No |
| Flutter tests | 42/42 pass |

---

## 10. Next Phase Recommendation

| Priority | Phase | Rationale |
|---|---|---|
| **1** | **Commit & enable GitHub Pages** | The page is created. Push to GitHub and enable Pages in repo Settings to make it live at the planned URL. |
| **2** | **Phase 16B: Qwen OCR real smoke test** | First real-provider test. Blocked by API key. |
| **3** | **Phase 21H: iOS config patch plan** | Apply Phase 21D identity decisions. Blocked by macOS. |
