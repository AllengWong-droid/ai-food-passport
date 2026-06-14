# Phase 21C Report — iOS Build Readiness Audit

> **Phase**: 21C
> **Date**: 2026-06-14
> **Status**: Complete
> **Type**: Documentation-only

---

## Deliverables

| File | Action | Type |
|---|---|---|
| `IOS_BUILD_READINESS_AUDIT.md` | Created | 16-section iOS build audit |
| `PHASE_21C_REPORT.md` | Created | This report |

---

## Audit Coverage

| # | Section | Key Finding |
|---|---|---|
| 1 | Current iOS project status | Valid Flutter scaffold: 42 files, Swift, iOS 13.0 target |
| 2 | Can iOS be built on Windows? | **No** — Xcode requires macOS |
| 3 | Why Mac/Xcode is required | 3 hard dependencies: toolchain, signing, App Store Connect upload |
| 4 | Bundle ID status | `com.example.aiFoodPassport` — **Flutter placeholder, must change** |
| 5 | App display name status | `CFBundleName` = 17 chars — **exceeds 15-char limit** |
| 6 | App icon status | 19 PNG files (13 sizes) — **all Flutter defaults, must replace** |
| 7 | Launch screen status | Default storyboard — functional but unbranded |
| 8 | Info.plist readiness | Missing privacy manifest, encryption key; Bundle name too long |
| 9 | Signing/provisioning | No DEVELOPMENT_TEAM, no certs, automatic signing enabled |
| 10 | Build command readiness | Never built; `flutter build ios` has 0% success rate history |
| 11 | Required changes before first build | 2 blockers (name + Bundle ID), 4 high, 3 medium |
| 12 | Checks once Mac is available | 11-step checklist: open project → archive |
| 13 | Bundle ID candidates | Recommended: `com.<domain>.aifoodpassport` or GitHub fallback |
| 14 | App name candidates | Recommended: "AI Food Passport" / "Food Passport" |
| 15 | Risks and blockers | 4 blockers, 7 risks with mitigations |
| 16 | Next steps | 5 immediate (free) + 5 short-term + 6 medium-term (needs Mac/$) |

---

## Key Findings

### Blockers (4)
1. No macOS machine — cannot run Xcode
2. `com.example.*` Bundle ID — Apple will reject
3. `CFBundleName` = 17 chars — exceeds 15-char limit
4. No Apple Developer Program membership — $99/year required

### Can Be Done Now (10 items, all free)
- Finalize Bundle ID and app name (20 min)
- Apply to Info.plist and project.pbxproj (15 min)
- Create PrivacyInfo.xcprivacy template (30 min)
- Design custom app icon (2-4 hrs)
- Customize launch screen storyboard (30 min)
- Add camera usage description (5 min)
- Add encryption compliance key (5 min)

---

## Verification

| Check | Result |
|---|---|
| Flutter tests | 42/42 pass |
| `git diff --check` | Clean |
| `git status` | 2 new untracked files |
| Flutter code changed? | **No** |
| Backend code changed? | **No** |
| iOS config changed? | **No** (audit-only) |
| Render config changed? | **No** |
| Screenshots changed? | **No** |
| API keys/Firebase added? | **No** |
| `productionReady` changed? | **No** (remains `false`) |
| Real providers enabled? | **No** |

---

## Overall Assessment

**TestFlight readiness: ❌ Not ready.** The iOS project scaffold is healthy but ~16 items need work. The first iOS build requires macOS access, Bundle ID/name fixes, and Apple Developer membership — but none of these block the parallel backend/provider work stream.

---

## Next Phase Recommendation

- **Phase 16B** (Qwen OCR real smoke) — when real API key exists
- **Phase 21D** (privacy policy and app metadata draft) — anytime, no prerequisites
