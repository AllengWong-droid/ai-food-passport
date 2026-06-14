# Phase 15C: Post-Polish Manual Demo Smoke Test Checklist

**Date**: 2026-06-14  
**Phase**: 15C  
**Status**: Manual verification required  
**Commit**: a89d3a2  
**Tag**: phase-15b-mvp-alpha-demo-polish  

---

## Pre-Test Setup

```bash
cd "C:\Users\皇国喜\Documents\Codex\2026-06-12\i-am-building-an-ios-application\AI-Food-Passport"

flutter run -d web-server --web-hostname=127.0.0.1 --web-port=8081 \
  --dart-define=BACKEND_BASE_URL=https://ai-food-passport.onrender.com
```

Then open: http://127.0.0.1:8081

> **Note**: If Render backend is sleeping, click the health URL first to wake it:
> https://ai-food-passport.onrender.com/health

---

## Manual Verification Checklist

### 1. App Launch ✅
- [ ] Flutter Web app loads without console errors
- [ ] No crash on startup

### 2. Onboarding Screen ✅
- [ ] Onboarding screen renders without overflow
- [ ] Title shows: "AI FOOD PASSPORT"
- [ ] Subtitle shows: "Travel smarter. Eat better."
- [ ] Button shows: **"QUICK PREVIEW"** (not "TRY DEMO SCAN")
- [ ] Clicking "QUICK PREVIEW" navigates to Home

### 3. Home Screen ✅
- [ ] Home screen loads after onboarding
- [ ] Status shows: **"Guest passport active"** (not "Demo passport active")
- [ ] Home currency is displayed correctly

### 4. Developer Controls (Debug Only) ✅
- [ ] Navigate to Profile tab
- [ ] "Backend Mock Mode" toggle is visible (debug builds only)
- [ ] Subtitle shows: "Connected to: https://ai-food-passport.onrender.com" (when enabled)
- [ ] Subtitle shows: "Using offline preview data..." (when disabled)
- [ ] No "Mock AI" or "MVP" text appears in subtitles

### 5. Backend URL Points to Render ✅
- [ ] Enable "Backend Mock Mode" in Profile
- [ ] AI Debug area (if visible) shows Render URL
- [ ] Backend base URL is: `https://ai-food-passport.onrender.com`

### 6. Analyze Flow Works ✅
- [ ] Navigate to Scan tab
- [ ] Language chip shows: **"AUTO-DETECT"** (not "AUTO-DETECT JAPANESE")
- [ ] Click "FRAME THE MENU" (or equivalent scan button)
- [ ] Processing overlay appears
- [ ] Loading messages are clear

### 7. Expected Mock Dishes ✅
- [ ] Results screen shows: **"2 dishes found"** (dynamic, not "8 of 14 Match")
- [ ] Section header shows: **"Last scanned menu"** (not "Tokyo - Izakaya Gonpachi")
- [ ] Dish 1: **"Tonkotsu Ramen"** - ¥980 - Allergens: Wheat, Egg
- [ ] Dish 2: **"Miso Katsu Skewers"** - ¥800 - Allergens: Soy, Wheat, Egg
- [ ] No "Mock AI" text in recommendation reasons

### 8. Dish Detail Screen ✅
- [ ] Tap a dish to open Dish Detail
- [ ] Local price shows in JPY (¥)
- [ ] Converted price shows in home currency
- [ ] Exchange rate is displayed
- [ ] Ingredients list is visible
- [ ] Recommendation reason is natural (no "Mock AI" references)

### 9. No Real Provider Calls ✅
- [ ] Check browser DevTools Network tab
- [ ] All requests go to `https://ai-food-passport.onrender.com`
- [ ] No requests to Qwen, DeepSeek, or OpenAI APIs
- [ ] No provider API keys in network headers

### 10. No API Keys in UI or Logs ✅
- [ ] Check browser console for API keys
- [ ] Check Flutter debug banner for sensitive data
- [ ] No `api_key`, `secret`, `token` in UI text
- [ ] No keys in network request URLs

### 11. Release Safety ✅
- [ ] Verify `kReleaseMode` hides developer controls
- [ ] No backend URL exposed in release UI
- [ ] No debug banners in release build

---

## Stop Command

Press **Ctrl + C** in the Flutter server terminal to stop the web server.

---

## Expected Test Results Summary

| Check | Expected Result |
|-------|-----------------|
| App launch | ✅ Success |
| Onboarding button | "QUICK PREVIEW" |
| Home status | "Guest passport active" |
| Scan language chip | "AUTO-DETECT" |
| Results header | "2 dishes found" |
| Results subtitle | "Last scanned menu" |
| Mock dish 1 | "Tonkotsu Ramen" |
| Mock dish 2 | "Miso Katsu Skewers" |
| Recommendation reasons | No "Mock AI" text |
| Backend URL | Render URL when mock mode enabled |
| API keys | None visible |
| Real provider calls | None |

---

## Post-Verification Steps

After manual verification:

```bash
# 1. Stop Flutter server (Ctrl + C)

# 2. Run automated checks
flutter test
git diff --check
git status --short

# 3. Update documentation
# - Mark Phase 15C complete in ROADMAP.md
# - Add verification results to TESTING_CHECKLIST.md
```

---

## Troubleshooting

**Render backend sleeping**: Click https://ai-food-passport.onrender.com/health first

**Port 8081 in use**: Use `--web-port=8082` (or any free port)

**Build errors**: Run `flutter clean` then retry

**Overflow errors**: Check console for RenderFlex warnings
