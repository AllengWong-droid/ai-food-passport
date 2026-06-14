# Phase 18B0 Report — Screenshot Data Source Alignment

**Status:** Complete  
**Date:** 2026-06-14

---

## Root Cause

Two independent issues prevented the Flutter scan/quick-preview flow from calling `/api/analyze-menu` and displaying the correct Render backend mock dishes.

### Root Cause 1 (Primary): Backend Mock Mode never activated

**File:** `lib/features/shared/data/mock_repositories.dart`  
**Line:** `backendMockModeProvider` StateProvider initial value

The `backendMockModeProvider` was hardcoded to `false`:

```dart
final backendMockModeProvider = StateProvider<bool>((ref) {
  return false;  // ← BUG: never enabled, even with BACKEND_BASE_URL set
});
```

In `scan_screen.dart:226`, the scan flow reads this provider:

```dart
final useBackendMock = !forceLocalMock && ref.read(backendMockModeProvider);
```

Because `backendMockModeProvider` always returned `false`, `useBackendMock` was always `false`, and the scan flow always fell through to the local `MockAiRepository` instead of `BackendMockMenuAnalysisRepository`. The backend was **never contacted**.

**Fix:** Changed the initial value to `BackendEndpointConfig.isCustomDefined`, which returns `true` when `BACKEND_BASE_URL` is provided as a dart-define at compile time:

```dart
final backendMockModeProvider = StateProvider<bool>((ref) {
  return BackendEndpointConfig.isCustomDefined;
});
```

### Root Cause 2 (Secondary): OCR language detection overmatches 'en' in 'menu'

**File:** `lib/features/shared/data/mock_repositories.dart`  
**Lines:** `MockOcrRepository.extractText()` and `MockScanRepository.createScanFromImage()`

The OCR mock uses naive `contains('en')` to detect English-language image paths:

```dart
final isEnglishMenu = normalizedPath.contains('english') ||
    normalizedPath.contains('harbor') ||
    normalizedPath.contains('en');  // ← overmatches 'mEnu'
```

The scan flow's default mock image path is `'mock-menu-image'`. Since `'mock-menu-image'` contains the substring `'en'` (from 'm**en**u'), the OCR incorrectly returns English text instead of Japanese text. This caused the local `MockAiRepository` to return `Fish and Chips` + `Peanut Sesame Slaw` (English menu dishes) instead of `Tonkotsu Ramen` + `Miso Katsu Skewers` (Japanese/default dishes).

The same pattern existed for `contains('zh')` in Chinese detection.

**Fix:** Replaced `contains('en')` and `contains('zh')` with a new `_hasLangCodeToken()` helper that requires the language code to appear as a delimited token:

```dart
bool _hasLangCodeToken(String path, String code) {
  final pattern = RegExp('(?:^|[/\\\\_.-])$code(?:[/\\\\_.-]|\$)');
  return pattern.hasMatch(path);
}
```

This correctly matches `harbor-en.png`, `menu_en.jpg`, `en/menu.jpg` but NOT `menu` or `mock-menu-image`.

### Why hot-reload does not pick up the fix

Riverpod `StateProvider` preserves its runtime state across hot-reloads. If the Flutter web server was started with the old code where `backendMockModeProvider` was initialized to `false`, the provider stores `state = false`. A hot-reload updates the Dart source but does **not** re-execute the provider's `create` function — the old `false` state persists.

**A full restart of `flutter run` is required** for the `StateProvider`'s initial value change to take effect.

---

## Files Changed

| File | Change |
|------|--------|
| `lib/features/shared/data/mock_repositories.dart` | 3 changes: (1) import `backend_endpoint_config.dart`, (2) `backendMockModeProvider` initial value → `BackendEndpointConfig.isCustomDefined`, (3) OCR lang detection → `_hasLangCodeToken()` helper |

**Only 1 file changed. No backend files modified.**

---

## Acceptance Criteria Checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Root cause documented | ✅ This report |
| 2 | Flutter code change is minimal | ✅ 1 file, 3 semantic edits |
| 3 | Backend code unchanged | ✅ Zero backend files touched |
| 4 | Offline/local fallback preserved | ✅ `forceLocalMock` path retained in `_processSelectedImage`; `MockAiRepository` unchanged |
| 5 | Flutter tests pass | ✅ 42/42 pass |
| 6 | No API keys/secrets/Firebase added | ✅ None added |
| 7 | `productionReady` remains `false` | ✅ Unchanged |
| 8 | No real providers enabled | ✅ All gates remain closed |

---

## Runbook Output

```
git status --short:
M  lib/features/shared/data/mock_repositories.dart
?? docs/

git diff --name-status:
M  lib/features/shared/data/mock_repositories.dart

git diff --check:
(clean — no whitespace errors)

flutter test:
42/42 All tests passed!
```

---

## Manual Browser Verification Steps

The user should perform the following steps to verify the fix after a **full restart** (not hot-reload):

### Prerequisites

1. Stop any running Flutter web server.
2. Start a fresh Flutter web server:
   ```sh
   flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 \
     --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
   ```
3. Ensure the Render backend is awake: `curl https://ai-food-passport.onrender.com/health`

### Verification steps

1. Open `http://127.0.0.1:8081` in Chrome.
2. Open DevTools → **Network** tab. Check "Preserve log".
3. Click **QUICK PREVIEW** → navigates to home screen.
4. Click **SCAN MENU** card → navigates to scan screen.
5. Click the capture button (center circle) → triggers scan flow.
6. **Observe Network tab:** A POST request to `https://ai-food-passport.onrender.com/api/analyze-menu` should appear.
7. **Observe results screen:**
   - Shows "2 dishes found"
   - Dishes are **Tonkotsu Ramen** and **Miso Katsu Skewers**
   - NOT "Fish and Chips" or "Peanut Sesame Slaw"
8. Navigate to **Profile** tab → if Developer section is visible, verify **Backend Mock Mode** toggle shows "ON" with "Connected to: https://ai-food-passport.onrender.com"
9. On the results screen, expand the **Developer Debug** panel → verify:
   - `Active provider: backend_mock`
   - `Backend mock enabled: true`
   - `Backend URL custom defined: true`

### Expected Network request

```
POST https://ai-food-passport.onrender.com/api/analyze-menu
Content-Type: application/json
Status: 200 OK
Response body includes: { "ok": true, "data": { "dishes": [...] } }
```

### Offline fallback test

1. Start Flutter **without** `--dart-define=BACKEND_BASE_URL=...`:
   ```sh
   flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8082
   ```
2. Go through the scan flow — should use local `MockAiRepository` with offline dishes.
3. No `/api/analyze-menu` request should appear in Network tab.

---

## Summary

| Item | Value |
|------|-------|
| Root cause | `backendMockModeProvider` hardcoded to `false` + OCR `contains('en')` overmatching substring |
| Files changed | 1 Flutter file (`mock_repositories.dart`) |
| Backend code changed | No |
| Docs changed | No (this report is new) |
| Test results | 42/42 pass |
| API keys/secrets/Firebase added | No |
| `productionReady` changed | No (remains `false`) |
| Real providers enabled | No |
