# Phase 21D Report — App Identity Decision

> **Phase**: 21D
> **Date**: 2026-06-14
> **Type**: Documentation-only decision document
> **Depends on**: Phase 21C (iOS Build Readiness Audit)
> **Tag**: `phase-21d-app-identity-decision`

---

## 1. What Was Done

Created `APP_IDENTITY_DECISION.md` — a comprehensive decision document covering all iOS/TestFlight app identity decisions for the future submission-ready app.

The document is a **decision plan**, not an implementation. No iOS config files were changed. No Xcode project settings were modified. The decisions are recorded so they can be applied in a future "apply identity" phase (Phase 21G).

---

## 2. Files Changed

| File | Status | Description |
|---|---|---|
| `APP_IDENTITY_DECISION.md` | **New** | 15-section app identity decision document |
| `README.md` | **Edited** | Added `APP_IDENTITY_DECISION.md` to Demo & QA document list |
| `ROADMAP.md` | **Edited** | Added Phase 21A, 21B, 21C, 21D to completed list |

**Total: 1 new file, 2 edited files. All documentation only.**

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
| **Git auto-commit** | ❌ Not performed | Per Phase 21D instructions |

---

## 4. Verification Results

### 4.1 `git status --short`

```
 M README.md
 M ROADMAP.md
?? APP_IDENTITY_DECISION.md
?? PHASE_21D_REPORT.md
```

**2 modified, 2 untracked (all documentation).**

### 4.2 `git diff --name-status`

```
M       README.md
M       ROADMAP.md
```

**2 files modified. Both documentation only.**

### 4.3 `git diff --check`

```
(clean — no whitespace errors; only LF/CRLF warnings)
```

**No whitespace errors found.**

### 4.4 `flutter test`

```
00:01 +42: All tests passed!
```

**42/42 tests pass. No regressions.**

---

## 5. App Identity Decisions (Summary)

| Decision | Recommended Value | Fallback |
|---|---|---|
| App Store name | AI Food Passport | Food Passport |
| iOS display name (`CFBundleDisplayName`) | AI Food Passport | Food Passport |
| iOS bundle name (`CFBundleName`) | Food Passport | (none needed — 13 chars ≤ 15) |
| Bundle ID | `com.<yourdomain>.aifoodpassport` | `com.github.<username>.aifoodpassport` |
| Primary category | Travel | — |
| Secondary category | Food & Drink | — |
| Subtitle | Scan Menus. Eat Safely. | Your Travel Menu Translator |
| Support URL | GitHub Issues | GitHub Discussions |
| Privacy URL | GitHub Pages (`<username>.github.io/AI-Food-Passport/privacy`) | Backend static route |
| Icon concept | Passport booklet + fork/spoon | Menu card + magnifying glass |
| Launch screen | Solid navy + centered icon/name | — |

Full details: `APP_IDENTITY_DECISION.md`, Section 14 (Final Decision Table).

---

## 6. Honesty Statement

**This phase created a decision document. It did NOT:**

- Change any iOS config (`Info.plist`, `project.pbxproj`, icons, launch screen)
- Enable any real AI or OCR providers
- Purchase an Apple Developer Program membership
- Create an App Store Connect record
- Build the app for iOS
- Make the app TestFlight-ready or App Store-ready

**The app remains MVP Alpha / mock-only.** No real providers are enabled. `productionReady` remains `false`. All 42 Flutter tests pass.

The decisions in `APP_IDENTITY_DECISION.md` should be applied in a future "apply identity" phase (Phase 21G), which depends on:
1. Apple Developer Program membership being purchased
2. A Mac/Xcode environment being available
3. Real providers being enabled and tested (Phase 16B-16D)

---

## 8. Next Phase Recommendation

| Priority | Phase | Rationale |
|---|---|---|
| **1** | **Phase 21E: Privacy Policy Draft** | Required for TestFlight. Can be drafted now without Apple membership. |
| **2** | **Phase 21F: App Store Metadata Draft** | Full description, keywords, screenshots plan — all draftable now. |
| **3** | **Phase 16B: Qwen OCR Real Smoke** | First real provider test. Blocked until real API key exists. Most impactful technical next step. |
| **4** | **Phase 21G: iOS Config Patch Plan** | Apply identity decisions to actual iOS config files. Only after macOS + membership available. |

**Do NOT apply iOS config changes yet.** The decisions are recorded. The implementation comes later.

---

*End of Phase 21D Report*
