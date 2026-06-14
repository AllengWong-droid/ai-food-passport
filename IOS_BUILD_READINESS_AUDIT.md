# iOS Build Readiness Audit

> **Phase**: 21C
> **Date**: 2026-06-14
> **Type**: Documentation-only audit
> **Depends on**: Phase 21B (TestFlight Preparation Plan)
> **Purpose**: Audit current Flutter iOS project configuration for future TestFlight readiness

---

## 1. Current iOS Project Status

| Attribute | Current Value | Verdict |
|---|---|---|
| iOS project exists | Yes (`ios/` directory, 42 files) | ✅ Present |
| Flutter iOS scaffold | Standard `flutter create` output | ✅ Valid |
| Swift version | Swift (AppDelegate.swift, SceneDelegate.swift) | ✅ Modern |
| Deployment target | iOS 13.0 | ✅ Reasonable |
| Xcode project | `Runner.xcodeproj` (project.pbxproj, 678 lines) | ✅ Valid |
| Workspace | `Runner.xcworkspace` with Flutter plugin integration | ✅ Valid |
| Unit test target | `RunnerTests.swift` scaffold | ✅ Present |
| Flutter plugins | GeneratedPluginRegistrant (auto-managed) | ✅ Auto |

**Bottom line**: A standard, well-formed Flutter iOS project exists. It has never been built for iOS on a real device.

---

## 2. Can iOS Be Built on Current Windows Machine?

**No.** Flutter's iOS compilation chain requires Xcode, which only runs on macOS.

| Capability | Windows | macOS |
|---|---|---|
| `flutter build ios` | ❌ `Unable to find Xcode` | ✅ |
| `.ipa` archive creation | ❌ | ✅ (with Xcode + signing) |
| iOS simulator | ❌ | ✅ |
| `flutter test` (Dart) | ✅ | ✅ |
| `flutter build web` | ✅ | ✅ |
| iOS code editing (Info.plist, Swift, etc.) | ✅ (text edit only) | ✅ (Xcode) |

**Current limitation**: All Phase 21C analysis below is based on file inspection — no build has been attempted because no macOS machine is available.

---

## 3. Why Mac/Xcode Is Required for Real iOS Archive/TestFlight

Three hard dependencies make macOS mandatory:

1. **Xcode toolchain**: `xcodebuild` compiles Swift/ObjC code, links Flutter engine, and signs the binary. No alternative exists on Windows or Linux.
2. **Code signing**: Apple requires cryptographic signing via certificates stored in Keychain (macOS-only). Without signing, no `.ipa` can be installed on a real device.
3. **App Store Connect upload**: Xcode's Organizer or `altool` handle `.ipa` validation and upload. TestFlight distribution flows exclusively through App Store Connect.

**Cloud alternatives** (Codemagic, GitHub Actions macOS runners, etc.) can run the Xcode build step, but still require a Mac somewhere in the pipeline.

---

## 4. Current Bundle ID Status

| Field | Value | Verdict |
|---|---|---|
| Info.plist | `$(PRODUCT_BUNDLE_IDENTIFIER)` | Placeholder variable |
| project.pbxproj (Debug) | `com.example.aiFoodPassport` | Flutter default |
| project.pbxproj (Release) | `com.example.aiFoodPassport` | Flutter default |
| project.pbxproj (Profile) | `com.example.aiFoodPassport` | Flutter default |
| RunnerTests | `com.example.aiFoodPassport.RunnerTests` | Flutter default |

**Assessment**: The Bundle ID `com.example.aiFoodPassport` is a Flutter-generated placeholder.

- `com.example.*` prefix is Apple's documented example domain — not suitable for submission.
- Must be changed to a reverse-domain ID you control (e.g., `com.yourdomain.aifoodpassport`).
- Changing the Bundle ID after App Store Connect record creation is **difficult** (requires new app record or explicit transfer).
- **Recommendation**: Finalize Bundle ID **before** creating the App Store Connect record.

---

## 5. Current App Display Name Status

| Field | Value | Verdict |
|---|---|---|
| `CFBundleDisplayName` | `Ai Food Passport` | Good start |
| `CFBundleName` | `ai_food_passport` | Internal identifier |

**Assessment**:
- `CFBundleDisplayName` ("Ai Food Passport") is the user-visible name on the home screen. Reasonable as-is.
- Apple guidelines allow up to 30 characters for the display name.
- `CFBundleName` is the internal short name (max 15 chars) — used if display name is absent. `ai_food_passport` exceeds 15 characters (17 chars) and would be truncated. This needs fixing before submission.
- **Recommendation**: Shorten `CFBundleName` to ≤15 chars (e.g., "AI Food Passport" = 15, or "Food Passport"). See section 14 for candidates.

---

## 6. Current App Icon Status

| Attribute | Value | Verdict |
|---|---|---|
| Icons present | 19 PNG files (13 unique sizes) | ✅ Sufficient count |
| Source | Default Flutter placeholder | ❌ Not branded |
| 1024x1024 (App Store) | Present (Icon-App-1024x1024@1x.png) | ⚠️ Placeholder |
| iPad sizes | Present (20, 29, 40, 76, 83.5) | ✅ Covered |
| iPhone sizes | Present (20@2x/3x, 29, 40, 60) | ✅ Covered |
| Design | Generic Flutter logo | ❌ Not for submission |

**Assessment**: The icon set is technically complete (19 entries in `Contents.json`) but uses the default Flutter brand icon. Apple **will reject** apps with generic/placeholder icons.

**Required before TestFlight submission**:
- Replace all 19 PNG files with a custom-designed icon
- Ensure the 1024x1024 App Store icon is high-quality (no alpha channel for App Store)
- All sizes in the asset catalog must be filled

---

## 7. Current Launch Screen Status

| Attribute | Value | Verdict |
|---|---|---|
| Storyboard file | `LaunchScreen.storyboard` | ✅ Present |
| Image resource | `LaunchImage` (168×185, centered) | Default Flutter |
| Background color | White (`sRGB 1,1,1`) | ✅ Clean |
| Layout | Single centered imageView with Auto Layout | ✅ Valid |

**Assessment**: The launch screen is the standard Flutter splash screen — a white background with the Flutter logo centered. This is functional but unbranded.

**Apple requirements**:
- Launch screen must be a storyboard (not static image) — **already met** ✅
- Should not contain interactive elements — **already met** ✅
- Should mirror the app's initial UI to create a seamless launch experience — **not met** ❌

**Recommendation**: Replace with a branded launch screen that shows the app logo/name. This is a cosmetic requirement, not a hard rejection criterion, but improves review experience.

---

## 8. Current Info.plist Readiness

| Key | Current Value | TestFlight Ready? |
|---|---|---|
| `CFBundleDisplayName` | `Ai Food Passport` | ✅ Acceptable |
| `CFBundleName` | `ai_food_passport` (17 chars) | ❌ Exceeds 15-char limit |
| `CFBundleIdentifier` | `$(PRODUCT_BUNDLE_IDENTIFIER)` | ❌ Placeholder |
| `CFBundleShortVersionString` | `$(FLUTTER_BUILD_NAME)` → `0.1.0` | ✅ OK for TestFlight |
| `CFBundleVersion` | `$(FLUTTER_BUILD_NUMBER)` → `1` | ✅ OK for TestFlight |
| `CFBundlePackageType` | `APPL` | ✅ Correct |
| `UIApplicationSceneManifest` | Scene-based (modern) | ✅ Correct |
| `UILaunchStoryboardName` | `LaunchScreen` | ✅ Correct |
| `UIMainStoryboardFile` | `Main` | ✅ Correct |
| `UISupportedInterfaceOrientations` | Portrait + Landscape | ✅ Complete |
| `CADisableMinimumFrameDurationOnPhone` | `true` | ✅ ProMotion support |

**Missing keys for App Store**:
- No `NSPrivacyCollectedDataTypes` or privacy manifest (`PrivacyInfo.xcprivacy`) — required for App Store submission
- No `ITSAppUsesNonExemptEncryption` — may be needed for App Store export compliance
- No `UIRequiredDeviceCapabilities` — auto-inferred, but explicit is safer
- No `NSAppTransportSecurity` — needed if backend is HTTP (Render is HTTPS, so fine)

**Priority fixes**:
1. Shorten `CFBundleName` to ≤15 characters
2. Finalize Bundle ID (no longer `com.example.*`)
3. Add `PrivacyInfo.xcprivacy` (required for App Store, strongly recommended for TestFlight)

---

## 9. Current Signing/Provisioning Readiness

| Attribute | Value | Verdict |
|---|---|---|
| CODE_SIGN_STYLE | `Automatic` | ✅ Prefer automatic |
| CODE_SIGN_IDENTITY | `iPhone Developer` | ⚠️ Default; needs real certificate |
| DEVELOPMENT_TEAM | Not set (empty in all configs) | ❌ No Apple Developer team |
| PROVISIONING_PROFILE_SPECIFIER | Not set | ❌ Required for device install |

**Assessment**: The project uses Xcode's automatic signing, which is the recommended approach. However:

- No `DEVELOPMENT_TEAM` is assigned — Xcode will prompt for Apple ID on first build.
- No provisioning profile exists — automatic signing creates these, but requires an Apple ID with a paid Developer Program membership for device deployment.
- `iPhone Developer` identity is the default; a real signing certificate will be generated by Xcode on first build with a valid Apple ID.

**What's needed before TestFlight**:
1. Apple Developer Program enrollment ($99/year)
2. Apple ID associated with the team in Xcode
3. Xcode will handle certificate creation and provisioning automatically (Automatic signing)

---

## 10. Current Flutter iOS Build Command Readiness

### Commands that would be needed

```bash
# Simulator build (no signing, no device)
flutter build ios --debug --no-codesign

# Device build (needs signing + provisioning)
flutter build ios --release

# Archive for TestFlight
flutter build ipa
```

### Current readiness

| Command | Works on Windows? | Works on macOS? |
|---|---|---|
| `flutter build ios --debug --no-codesign` | ❌ No Xcode | ✅ (if Xcode installed) |
| `flutter build ios --release` | ❌ No Xcode | ⚠️ Needs signing certs |
| `flutter build ipa` | ❌ No Xcode | ⚠️ Needs signing + App Store Connect |

**Current state**: None of these commands have ever been executed. `flutter build ios` has a 0% success rate history. The Dart code compiles fine (42/42 Flutter tests pass), but the iOS native layer has never been compiled.

---

## 11. Required Changes Before First iOS Build

### A. Must fix before ANY iOS build attempt

| # | Change | File(s) | Priority |
|---|---|---|---|
| A1 | Shorten `CFBundleName` to ≤15 characters | `Info.plist` | 🔴 Blocker |
| A2 | Finalize Bundle ID (replace `com.example.*`) | `project.pbxproj` (6 occurrences) | 🔴 Blocker |

### B. Strongly recommended before first build

| # | Change | File(s) | Priority |
|---|---|---|---|
| B1 | Create branded app icon (replace 19 PNG files) | `AppIcon.appiconset/` | 🟡 High |
| B2 | Customize launch screen storyboard | `LaunchScreen.storyboard` | 🟡 High |
| B3 | Create `PrivacyInfo.xcprivacy` | `ios/Runner/` | 🟡 High |
| B4 | Set `UIRequiredDeviceCapabilities` | `Info.plist` | 🟢 Medium |

### C. Nice to have before first build

| # | Change | File(s) | Priority |
|---|---|---|---|
| C1 | Add `ITSAppUsesNonExemptEncryption` | `Info.plist` | 🟢 Low |
| C2 | Set explicit `UIStatusBarStyle` | `Info.plist` | 🟢 Low |
| C3 | Configure `UIViewControllerBasedStatusBarAppearance` | `Info.plist` | 🟢 Low |

---

## 12. Required Checks Once Mac/Xcode Is Available

When a macOS machine with Xcode becomes available, perform these checks in order:

| Step | Action | Success Criteria |
|---|---|---|
| 1 | Open `ios/Runner.xcworkspace` in Xcode | Project opens without errors |
| 2 | Select Runner target → Signing & Capabilities | DEVELOPMENT_TEAM is assignable |
| 3 | Set Bundle ID in Xcode to finalized value | Matches App Store Connect record |
| 4 | Build for simulator (`flutter build ios --debug --no-codesign`) | Build succeeds |
| 5 | Fix any compilation errors | Zero errors, zero warnings |
| 6 | Run on iOS simulator (`flutter run`) | App launches, all screens work |
| 7 | Connect physical iOS device | Xcode recognizes device |
| 8 | Build for device (`flutter build ios --release`) | Build succeeds, app installs on device |
| 9 | Run on device | App functions correctly (network, camera, etc.) |
| 10 | Archive (`flutter build ipa`) | `.ipa` file produced |
| 11 | Validate archive (`xcodebuild -exportArchive`) | Validation passes |

---

## 13. Recommended Bundle ID Candidate

The Bundle ID must use reverse-domain notation (`com.<domain>.<appname>`).

### Requirements
- No `com.example.*` prefix (Apple rejects)
- Unique — not already registered in App Store Connect
- Permanent — hard to change after App Store Connect record creation
- Reflects your organization/domain

### Candidates

| Bundle ID | Pros | Cons |
|---|---|---|
| `com.yourdomain.aifoodpassport` | Standard, professional | Requires a domain you own |
| `com.github.<username>.aifoodpassport` | Free, unique to your GitHub | Ties to GitHub identity |
| `com.<yourname>.aifoodpassport` | Personal, meaningful | Needs a name you control |
| `app.aifoodpassport.ios` | Clean, modern | Not reverse-domain form |

**Recommendation**: Use `com.<yourdomain>.aifoodpassport` if you own a domain. Otherwise, `com.github.<username>.aifoodpassport` is a pragmatic free alternative that satisfies Apple's uniqueness requirement.

---

## 14. Recommended App Display Name Candidate

### Requirements
- ≤30 characters (`CFBundleDisplayName`)
- ≤15 characters (`CFBundleName`) — currently 17 characters ("ai_food_passport")
- Recognizable, distinct
- Consistent with app branding

### Candidates

| Display Name (CFBundleDisplayName) | Short Name (CFBundleName) | Length Check |
|---|---|---|
| `AI Food Passport` | `Food Passport` | ✅ 13 short / 17 display |
| `Food Passport` | `Food Passport` | ✅ 13 / 13 |
| `FoodPassport` | `FoodPassport` | ✅ 12 / 12 |
| `AI FoodPassport` | `FoodPassport` | ✅ 12 / 14 |

**Recommendation**: `AI Food Passport` for display, `Food Passport` for short name. This is clean, professional, and fits within all constraints.

---

## 15. Risks and Blockers

### Blockers (must resolve before any iOS build)

| # | Blocker | Impact | Resolution |
|---|---|---|---|
| 1 | **No macOS machine available** | Cannot run Xcode, cannot build iOS | Acquire Mac, use cloud CI (Codemagic/GitHub Actions), or Mac cloud service |
| 2 | **Bundle ID uses `com.example.*`** | Apple rejects on sight | Choose and set real Bundle ID (section 13) |
| 3 | **CFBundleName exceeds 15 characters** | Truncation at build time or App Store rejection | Shorten to ≤15 chars (section 14) |
| 4 | **No Apple Developer Program membership** | Cannot sign builds, cannot use TestFlight | Enroll ($99/year) when ready |

### Risks (may cause delays)

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| 1 | First iOS build reveals platform-specific bugs | Medium | Plan for 1-2 weeks of iOS debugging |
| 2 | `image_picker` plugin needs iOS camera permission | Medium | Add `NSCameraUsageDescription` to Info.plist |
| 3 | Network calls may need App Transport Security config | Low | Render uses HTTPS — likely fine |
| 4 | Flutter plugin compatibility with iOS 13.0 target | Low | All Flutter plugins support iOS 13+ |
| 5 | Xcode version mismatch with Flutter SDK | Medium | Pin Flutter and Xcode versions in CI |
| 6 | App icon design iteration takes longer than expected | Low | Start icon design early, independent of build |
| 7 | Apple Developer enrollment verification delay | Medium | Can take 24-48 hours for D-U-N-S verification |

---

## 16. Clear Next Steps Before TestFlight

### Immediate (free, no Mac needed)

| Step | What | Effort |
|---|---|---|
| 1 | Finalize Bundle ID (section 13) | 10 min |
| 2 | Finalize app display name (section 14) | 10 min |
| 3 | Apply name changes to `Info.plist` | 5 min |
| 4 | Apply Bundle ID changes to `project.pbxproj` | 10 min |
| 5 | Create `PrivacyInfo.xcprivacy` template | 30 min |

### Short-term (free, no Mac needed)

| Step | What | Effort |
|---|---|---|
| 6 | Design custom app icon (all 13 sizes) | 2-4 hours |
| 7 | Replace Flutter placeholder icons | 15 min |
| 8 | Customize LaunchScreen.storyboard | 30 min |
| 9 | Add `NSCameraUsageDescription` to Info.plist | 5 min |
| 10 | Add `ITSAppUsesNonExemptEncryption` to Info.plist | 5 min |

### Medium-term (requires spending and/or Mac)

| Step | What | Prerequisites |
|---|---|---|
| 11 | Enroll in Apple Developer Program ($99/year) | Steps 1-5 done, real providers enabled |
| 12 | Acquire access to macOS + Xcode | Physical Mac, Mac cloud, or CI runner |
| 13 | First `flutter build ios` attempt | Steps 1-12 done |
| 14 | Debug iOS-specific issues | Step 13 done |
| 15 | Create App Store Connect record | Step 11 done |
| 16 | First TestFlight build upload | Steps 13-15 done |

---

## Summary

| Dimension | Status |
|---|---|
| iOS project structure | ✅ Valid Flutter scaffold |
| Bundle ID | ❌ `com.example.*` placeholder |
| Display name | ⚠️ `CFBundleName` too long (17 > 15) |
| App icon | ❌ Default Flutter placeholder |
| Launch screen | ⚠️ Default Flutter — functional but unbranded |
| Info.plist completeness | ⚠️ Missing privacy manifest, encryption key |
| Signing | ❌ No team, no certificates |
| iOS build history | ❌ Never built |
| macOS access | ❌ Windows-only current session |
| Dart code quality | ✅ 42/42 Flutter tests pass |
| **Overall TestFlight readiness** | **❌ Not ready — ~16 items need work** |

**Bottom line**: The iOS project scaffold is healthy but entirely untested. The path to a first iOS build requires (1) fixing the Bundle ID and name, (2) obtaining macOS + Xcode access, and (3) enrolling in the Apple Developer Program. None of these require backend/production changes — the iOS build work can start in parallel with provider readiness work.

---

## Related Documents

- [APP_STORE_READINESS_AUDIT.md](APP_STORE_READINESS_AUDIT.md) — Phase 21A: full App Store readiness audit
- [TESTFLIGHT_PREPARATION_PLAN.md](TESTFLIGHT_PREPARATION_PLAN.md) — Phase 21B: step-by-step TestFlight roadmap
- [MVP_ALPHA_STATUS.md](MVP_ALPHA_STATUS.md) — Current MVP Alpha system status
- [ROADMAP.md](ROADMAP.md) — Full project roadmap
