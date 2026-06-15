# AI Food Passport — Manual QA Checklist

**Date:** 2026-06-15  
**Phase:** 25A  
**App Version:** MVP Alpha  
**Test Type:** Manual QA (no automated E2E)

---

## 1. Environment Checklist

Verify the environment is in a known-good state before QA.

| # | Check | Expected | Pass/Fail |
|---|-------|----------|-----------|
| 1.1 | Flutter app launches | App starts without crash, home screen renders | ☐ |
| 1.2 | `flutter test` passes | `All tests passed!` (97/97) | ☐ |
| 1.3 | `dart analyze` — no warnings/errors | Only pre-existing info-level lints, zero new warnings | ☐ |
| 1.4 | Backend health check | `GET /health` → `ok: true, mock_ocr: true, mock_ai: true` | ☐ |
| 1.5 | Backend mock mode | `productionReady: false, realProvidersEnabled: false` | ☐ |
| 1.6 | No API keys in Flutter | Environment variables for real providers are empty/unset | ☐ |
| 1.7 | `git status --short` shows no unexpected files | Only this phase's documentation files are new | ☐ |
| 1.8 | `ios/` has no uncommitted changes | `git diff --name-only` excludes `ios/` | ☐ |
| 1.9 | `backend/` has no uncommitted changes | `git diff --name-only` excludes `backend/` | ☐ |
| 1.10 | `pubspec.yaml` unchanged | `git diff pubspec.yaml` returns empty | ☐ |

---

## 2. Dietary Preferences QA

### 2.1 Empty State

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 2.1.1 | Open app for the first time (or clear preferences) → Profile | Dietary Preferences subtitle: "Allergens and dietary restrictions" | ☐ |
| 2.1.2 | Open Dietary Preferences | All 8 allergen toggles unselected (outlined icon, default background) | ☐ |
| 2.1.3 | All 5 dietary restriction toggles | All show `circle_outlined` icon (unselected) | ☐ |
| 2.1.4 | Scroll to bottom | Disclaimer banner visible with info icon and correct text | ☐ |

### 2.2 Select Allergen

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 2.2.1 | Tap "Gluten" toggle | Toggle fills accent-color, icon turns white, label turns white | ☐ |
| 2.2.2 | Tap "Eggs" toggle | Second toggle fills, "Gluten" remains selected | ☐ |
| 2.2.3 | Tap "Soy" toggle | Third toggle fills, all three stay selected | ☐ |
| 2.2.4 | Tap "Fish" toggle | Fourth toggle fills, all four stay selected | ☐ |
| 2.2.5 | Return to Profile (back arrow) | Dietary Preferences subtitle: "4 allergens avoided" | ☐ |

### 2.3 Deselect Allergen

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 2.3.1 | Reopen Dietary Preferences | All 4 previously selected toggles still filled | ☐ |
| 2.3.2 | Tap "Fish" toggle | Fish toggle returns to unselected state (outlined icon) | ☐ |
| 2.3.3 | Return to Profile | Subtitle updates to "3 allergens avoided" | ☐ |

### 2.4 Dietary Restrictions

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 2.4.1 | Tap "Vegetarian" | Icon changes to `check_circle` (filled) | ☐ |
| 2.4.2 | Tap "Pork-Free" | Icon changes to `check_circle`, "Vegetarian" stays selected | ☐ |
| 2.4.3 | Tap "Vegetarian" again | Icon returns to `circle_outlined`, "Pork-Free" stays selected | ☐ |

### 2.5 Clear All Preferences

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 2.5.1 | Scroll to bottom, tap "Clear All Preferences" | AlertDialog appears with warning text | ☐ |
| 2.5.2 | Verify dialog text | "This will remove all your dietary preferences and allergen settings. This action cannot be undone." | ☐ |
| 2.5.3 | Tap "Cancel" button | Dialog closes, preferences unchanged | ☐ |
| 2.5.4 | Tap "Clear All Preferences" → "Clear" | Dialog closes, all toggles reset to unselected | ☐ |
| 2.5.5 | Return to Profile | Subtitle: "Allergens and dietary restrictions" | ☐ |

### 2.6 Persistence (App Restart)

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 2.6.1 | Select "Gluten", "Dairy", "Peanuts" | Three toggles filled | ☐ |
| 2.6.2 | Close app completely (swipe away from recents) | App terminated | ☐ |
| 2.6.3 | Reopen app → Profile → Dietary Preferences | "Gluten", "Dairy", "Peanuts" still selected | ☐ |
| 2.6.4 | Profile subtitle shows "3 allergens avoided" | Count matches | ☐ |

---

## 3. Scan & Result QA

### 3.1 Successful Scan Flow

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 3.1.1 | From Home, tap scan/camera button | Scan screen opens with camera view, frame overlay | ☐ |
| 3.1.2 | Frame a menu in the scan area | Overlay guides framing, capture button visible | ☐ |
| 3.1.3 | Trigger capture/scan | Processing overlay: "Analyzing..." with spinner | ☐ |
| 3.1.4 | Wait for analysis | Results screen appears with dish cards | ☐ |
| 3.1.5 | Verify dishes appear | At least one dish card with name, price, score, allergen list | ☐ |

### 3.2 Allergen Warning Badge — Positive Match

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 3.2.1 | Pre-condition: Gluten selected in preferences | Verify via Profile subtitle | ☐ |
| 3.2.2 | Run scan, view dish containing gluten in its allergen list | Orange ScoreBadge: "Contains gluten" | ☐ |
| 3.2.3 | Verify badge text is factual | Text says "Contains gluten" — NOT "unsafe", "dangerous", etc. | ☐ |
| 3.2.4 | Multiple matching allergens in one dish | Orange ScoreBadge: "Contains: gluten, dairy" | ☐ |

### 3.3 Allergen Warning — Negative (No Match)

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 3.3.1 | View dish with allergens NOT in preferences | No orange "Contains" badge visible | ☐ |
| 3.3.2 | Dish has no allergens listed at all | No orange "Contains" badge visible | ☐ |

### 3.4 Warning When Preferences Empty

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 3.4.1 | Clear all dietary preferences | All toggles unselected | ☐ |
| 3.4.2 | Run scan, view any dish | No "Contains" badge on ANY dish (preferences empty → no match possible) | ☐ |

---

## 4. Scan History QA

### 4.1 History Entry Creation

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 4.1.1 | Pre-condition: have dietary preferences set (e.g., gluten) | Verified | ☐ |
| 4.1.2 | Complete a successful scan | Results screen appears | ☐ |
| 4.1.3 | Go to Profile → Scan History | History list shows new entry | ☐ |
| 4.1.4 | Verify entry shows timestamp | Date/time is displayed (not empty, not null) | ☐ |
| 4.1.5 | Verify entry shows dish count | Number badge (e.g., "3 dishes") | ☐ |
| 4.1.6 | Verify entry shows dish names | Summary text lists dish names | ☐ |

### 4.2 Failed Scan — No History Entry

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 4.2.1 | Attempt action that fails before analysis completes | No new history entry created | ☐ |
| 4.2.2 | Verify: Profile → Scan History | Entry count unchanged from before failed scan | ☐ |

> **Note:** Testing a genuinely "failed" scan on mock backend may require manually triggering an error. If not practical to test, mark as N/A and document.

### 4.3 History List

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 4.3.1 | Multiple successful scans (2+ times) | History shows entries in order (most recent first) | ☐ |
| 4.3.2 | Profile → Scan History subtitle | Shows e.g. "3 past scans" | ☐ |
| 4.3.3 | Empty history | "No scan history yet" empty state with icon | ☐ |

### 4.4 History Restore

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 4.4.1 | Tap a history entry | Navigates to Results screen | ☐ |
| 4.4.2 | Verify dish cards restored | Same dishes as original scan, same scores/prices | ☐ |
| 4.4.3 | Verify allergen warnings recomputed | Badges reflect **current** dietary preferences (not necessarily original scan-time preferences) | ☐ |
| 4.4.4 | Verify no backend call | Network tab / backend logs show NO new request for this action | ☐ |
| 4.4.5 | Go back from restored result | Returns to History screen (not some unrelated screen) | ☐ |

### 4.5 Clear History

| # | Action | Expected Result | Pass/Fail |
|---|--------|-----------------|-----------|
| 4.5.1 | Tap trash icon on History screen | AlertDialog: "Are you sure you want to clear all scan history?" | ☐ |
| 4.5.2 | Tap "Cancel" | Dialog closes, history list unchanged | ☐ |
| 4.5.3 | Tap trash icon → "Clear" | Dialog closes, history list empty | ☐ |
| 4.5.4 | Verify empty state | "No scan history yet" with icon shown | ☐ |
| 4.5.5 | Return to Profile | Scan History subtitle: "No scans yet" | ☐ |

---

## 5. Safety Wording QA

### 5.1 Result Card Wording

| # | Text to Scan For | Expected Presence | Actual |
|---|-----------------|-------------------|--------|
| 5.1.1 | "safe" | Should NOT appear in any allergen-related text | ☐ |
| 5.1.2 | "unsafe" | Should NOT appear anywhere | ☐ |
| 5.1.3 | "guaranteed" / "guarantee" | Should NOT appear in allergen context | ☐ |
| 5.1.4 | "diagnosis" | Should NOT appear except in disclaimer "not a medical diagnosis" | ☐ |
| 5.1.5 | "dangerous" / "hazard" / "risk" | Should NOT appear in allergen badge text | ☐ |
| 5.1.6 | "allergy warning" (as medical claim) | Should NOT appear | ☐ |
| 5.1.7 | "Contains [allergen]" | SHOULD appear for matching dishes | ☐ |
| 5.1.8 | "Matches your avoid list" | Was used in Phase 24A, may have been replaced. Either is acceptable. | ☐ |

### 5.2 Disclaimer Visibility

| # | Location | Expected Text | Visible? |
|---|----------|---------------|----------|
| 5.2.1 | Dietary Preferences Screen, bottom | "This app provides information for reference only." | ☐ |
| 5.2.2 | Dietary Preferences Screen, bottom | "Always verify ingredients and consult with restaurant staff about allergens." | ☐ |
| 5.2.3 | Dietary Preferences Screen, bottom | "This is not a medical diagnosis." | ☐ |
| 5.2.4 | Clear All dialog | "This action cannot be undone." | ☐ |

---

## 6. Regression Checklist

Confirm these invariants hold after QA is complete:

| # | Item | Expected | Pass/Fail |
|---|------|----------|-----------|
| 6.1 | `ios/` directory unchanged | `git diff --name-only` excludes `ios/` | ☐ |
| 6.2 | `backend/` directory unchanged | `git diff --name-only` excludes `backend/` | ☐ |
| 6.3 | `pubspec.yaml` unchanged | `git diff pubspec.yaml` empty | ☐ |
| 6.4 | `.env` file unchanged (or absent) | Verified | ☐ |
| 6.5 | No Firebase files added | No `google-services.json`, `GoogleService-Info.plist`, etc. | ☐ |
| 6.6 | No API keys in Flutter code | Environment variables for real providers are unset | ☐ |
| 6.7 | `productionReady` remains `false` | Backend `/health` confirms | ☐ |
| 6.8 | Real providers remain disabled | `realProvidersEnabled: false` in health check | ☐ |
| 6.9 | App icon assets unchanged | No new/modified PNGs in `ios/Runner/Assets.xcassets/` | ☐ |
| 6.10 | Launch screen assets unchanged | No changes to `LaunchScreen.storyboard` | ☐ |
| 6.11 | `flutter test` still passes | `All tests passed!` (97/97) | ☐ |
| 6.12 | `dart analyze` — no new warnings/errors | Only pre-existing info-level lints | ☐ |

---

## 7. Known Limitations (for QA Context)

These are intentional limitations of the current MVP. QA should verify they behave as described, not treat them as bugs:

| # | Limitation | Expected Behavior |
|---|------------|-------------------|
| 7.1 | **History is session-only** | Scan history is in-memory. It does NOT survive app restart. This is by design (Phase 23A). |
| 7.2 | **Backend is mock-only** | All OCR and AI analysis returns simulated results. Real providers are behind environment variable gates. |
| 7.3 | **No real OCR/AI provider** | QRWEN_OCR_PROVIDER_ENABLED and QWEN_ANALYSIS_PROVIDER_ENABLED are `false`. |
| 7.4 | **No TestFlight build** | iOS project exists but has never been built. No macOS environment available. |
| 7.5 | **History warnings recompute** | When viewing historical results, allergen badges reflect **current** preferences, not original scan-time preferences. |
| 7.6 | **No cloud sync** | Dietary preferences are local-only (shared_preferences). No user accounts, no Firebase. |
| 7.7 | **No backend re-call on history restore** | History entries cache the full analysis result. Restoring a result does NOT trigger a new backend request. |
| 7.8 | **App icon uses Flutter defaults** | Design-only export set exists (Phase 22F), but not applied to the app. App shows Flutter default icon. |

---

## 8. QA Summary

| Section | # of Checks | Result |
|---------|-------------|--------|
| 1. Environment | 10 | ☐ |
| 2. Dietary Preferences | 18 | ☐ |
| 3. Scan & Result | 9 | ☐ |
| 4. Scan History | 14 | ☐ |
| 5. Safety Wording | 11 | ☐ |
| 6. Regression | 12 | ☐ |
| **Total** | **74** | ☐ |

**QA Date:** ___________  
**QA Tester:** ___________  
**App Version/Build:** MVP Alpha  
**Device/Emulator:** ___________  
**Notes:** ___________
