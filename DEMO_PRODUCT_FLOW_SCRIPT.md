# AI Food Passport — Demo Product Flow Script

**Date:** 2026-06-15  
**Phase:** 25A  
**App Version:** MVP Alpha  
**Backend Mode:** Mock-only (no real OCR/AI providers active)

---

## 1. Demo Purpose

This script demonstrates AI Food Passport as a working mobile MVP with:

- **Menu photo scan** → AI food analysis (mock backend)
- **Personalized allergen warnings** based on saved dietary preferences
- **Session scan history** with one-tap result restoration
- **Local-first architecture**: no login, no cloud sync, all preferences on-device

The demo is designed for portfolio review, stakeholder walkthrough, and manual QA sessions. It does **not** demonstrate production readiness, real provider integration, or TestFlight deployment.

---

## 2. Demo Setup

### Prerequisites

| Item | Status |
|------|--------|
| Flutter SDK installed | Required |
| Project at `AI-Food-Passport/` | Required |
| `flutter test` passes (97/97) | Verified |
| Backend running at `https://ai-food-passport.onrender.com` | Mock-only, no real providers |
| Backend health check: `GET /health` returns `ok: true, mock_ocr: true` | Mock-safe mode |
| App compiled and running on device/emulator | Required for demo |

### Pre-Demo Checklist

- [ ] `flutter run` launches the app successfully
- [ ] Mock backend is reachable (`https://ai-food-passport.onrender.com/health`)
- [ ] No real API keys are set in environment variables
- [ ] `Developer Controls` in Profile shows `backendMockMode: true`
- [ ] Dietary Preferences screen loads without errors

### Suggested Preferences to Configure (Before Demo)

For a compelling demo, pre-select these allergens:

| Allergen | Why |
|----------|-----|
| **Gluten** | Common dietary concern, easy to reference |
| **Eggs** | Widely recognized allergen |
| **Soy** | Common in Asian cuisine (app's target market) |

Alternatively, demonstrate the preferences screen during the demo itself (recommended for live audiences).

---

## 3. Step-by-Step Demo Flow

### Act 1: Onboarding & Profile (30 seconds)

| Step | Action | Screen | What's Showing |
|------|--------|--------|----------------|
| 1 | Launch the app | Home screen | AI Food Passport logo, camera button prominent |
| 2 | Tap Profile tab (bottom nav) | Profile Screen | Quick Actions section at top, dietary and history tiles visible |

**Narration cue:** *"AI Food Passport analyzes restaurant menus from photos. But what makes it personal is the dietary preferences system — let me show you."*

### Act 2: Configure Dietary Preferences (45 seconds)

| Step | Action | Screen | What's Showing |
|------|--------|--------|----------------|
| 3 | Tap **Dietary Preferences** (shield icon, under Quick Actions) | Dietary Preferences Screen | 8 allergen toggles in 2-column grid, 5 dietary restriction toggles below |
| 4 | Tap **Gluten** toggle | Same | Toggle turns accent-color (filled background, white icon) |
| 5 | Tap **Eggs** toggle | Same | Second toggle turns accent-color |
| 6 | Tap **Soy** toggle | Same | Third toggle turns accent-color |
| 7 | Scroll down to disclaimer | Same | Yellow info banner: "not a medical diagnosis" |
| 8 | Tap back arrow (top-left) | Profile Screen | Subtitle now reads "3 allergens avoided" |

**Narration cue:** *"Eight common allergens — gluten, dairy, eggs, nuts, peanuts, soy, fish, shellfish. I'll select gluten, eggs, and soy. These save locally — no cloud account needed. And the disclaimer makes it clear: this is reference info, not a medical diagnosis."*

### Act 3: Scan a Menu (60 seconds)

| Step | Action | Screen | What's Showing |
|------|--------|--------|----------------|
| 9 | Tap scan/camera button from bottom nav | Scan Screen | Camera view, scan frame overlay, capture button |
| 10 | Point camera at a menu (real or test image) | Same | Overlaid scan frame guides framing |
| 11 | Tap capture / trigger analysis | Processing overlay | "Analyzing..." spinner with progress indicator |
| 12 | Wait for analysis to complete | Results Screen | List of dish cards with names, prices, scores |

**Narration cue:** *"Now let's scan a menu. The camera opens with a guided frame. Capture the menu, and the mock backend simulates OCR and AI analysis. In production this would use a real vision model — right now it returns mock results for development."*

### Act 4: Show Personalized Allergen Warnings (30 seconds)

| Step | Action | Screen | What's Showing |
|------|--------|--------|----------------|
| 13 | Scroll through result cards | Results Screen | Orange warning badge "Contains gluten" / "Contains eggs" on matching dishes |
| 14 | Point out dishes without matching allergens | Same | No warning badge — clean dish card |
| 15 | Explain the badge logic | (narration) | Badge appears ONLY when scanned dish allergens intersect with user's saved preferences |

**Narration cue:** *"Here's the payoff. Dishes that contain gluten, eggs, or soy show an orange 'Contains' badge — notice it's factual, not alarmist. It says 'Contains eggs', not 'unsafe to eat'. Dishes without matching allergens show no badge at all. The app watches your preferences in real time."*

### Act 5: Scan History & Restore (45 seconds)

| Step | Action | Screen | What's Showing |
|------|--------|--------|----------------|
| 16 | Tap Profile tab (bottom nav) | Profile Screen | "Scan History" tile now shows "1 past scans" |
| 17 | Tap **Scan History** (history icon, under Quick Actions) | Scan History Screen | List with one entry: timestamp, dish count, dish names |
| 18 | Tap the history entry | Results Screen | Same dish cards restored, allergen badges recomputed from current preferences |
| 19 | Verify badges still appear for current preferences | Results Screen | "Contains gluten" / "Contains eggs" badges visible |

**Narration cue:** *"Every successful scan is saved to history — locally, in-memory. Tap a history entry and the full result restores instantly. No backend re-call — it's all cached. And the warnings are recomputed from your current preferences, so if you add or remove an allergen, old history reflects the new settings."*

### Act 6: Clear & Summary (15 seconds)

| Step | Action | Screen | What's Showing |
|------|--------|--------|----------------|
| 20 | Tap trash icon on History Screen → confirm clear | Scan History Screen | "No scan history yet" empty state |
| 21 | Return to Profile → Dietary Preferences → Clear All | Dietary Preferences Screen | All toggles reset, subtitle back to default |

**Narration cue:** *"Clear history removes the in-memory entries. Clear preferences resets your settings. Both are immediate, local operations — no network call, no account deletion form."*

### Full Flow Summary (13 Steps, ~4 minutes)

```
Profile → Dietary Preferences → Select allergens (gluten, eggs, soy)
→ Back to Scan → Capture menu → View results with allergen badges
→ Profile → Scan History → Restore previous result → Clear history
→ Profile → Dietary Preferences → Clear preferences
```

---

## 4. Suggested Narration Scripts

### 4.1 60-Second Elevator Demo

> "AI Food Passport analyzes restaurant menus from photos and personalizes results based on your dietary needs.
>
> Let me show you — I've set gluten, eggs, and soy as my avoid list. I scan a menu, and the app identifies each dish with its allergens.
>
> Dishes containing gluten or eggs get flagged with an orange badge — factual, not alarmist. Every scan is saved to local history. Tap to restore without re-calling the backend.
>
> Preferences persist locally. No cloud account, no login, no API keys in the app. This is MVP Alpha — mock backend, real UX."

### 4.2 2-Minute Portfolio Walkthrough

> "AI Food Passport is a Flutter mobile app that scans restaurant menus and gives personalized food analysis.
>
> **The personalized layer** — Users set dietary preferences locally: 8 allergens, 5 dietary restrictions. These save to shared_preferences with no server call.
>
> **The scan** — Camera capture with frame overlay. The mock backend simulates OCR and AI dish analysis, returning structured results with dish names, prices, allergens, and recommendations.
>
> **The warning system** — Result cards match scanned dish allergens against the user's avoid list. A match triggers an orange badge: 'Contains gluten'. No match means no badge. The text is deliberately factual — no 'safe', 'unsafe', or medical language anywhere except the explicit 'this is not a medical diagnosis' disclaimer.
>
> **History** — Successfully scanned results are saved in-memory. Tap any entry and the full analysis restores without hitting the backend. Warnings recompute from current preferences, so updating your avoid list retroactively updates old results.
>
> **Architecture** — Flutter frontend, Riverpod state management, Node.js backend on Render. All providers (OCR, AI analysis) have mock implementations behind feature gates. No real API keys, no Firebase, no cloud user accounts.
>
> **What this is** — MVP Alpha. A working product demo showing the personalized scan-to-warning-to-history loop. Portfolio-ready, not TestFlight-ready."

### 4.3 Detailed Walkthrough (5+ minutes)

Use the full 21-step flow from Section 3, adding commentary at each step. Ideal for:

- Technical interviews
- Architecture review sessions
- Team onboarding for new contributors

---

## 5. What to Say Clearly

During any demo, explicitly state:

| Topic | What to Say |
|-------|-------------|
| **MVP status** | "This is MVP Alpha — functional, tested, but not production-ready." |
| **Mock backend** | "The backend returns simulated results. Real OCR and AI are behind feature gates, disabled in this build." |
| **No medical guarantee** | "Allergen information is for reference only. Always verify with restaurant staff. The app is not a medical device." |
| **No API keys** | "No API keys or Firebase configuration is present in the Flutter app. Everything runs locally or against mock endpoints." |
| **Local-first** | "All preferences and history stay on-device. No user account, no cloud sync, no login." |
| **Personalization** | "Warnings are computed client-side by comparing scanned dish allergens with saved user preferences." |

---

## 6. What NOT to Claim

- ❌ "Production-ready" or "App Store ready"
- ❌ "Real OCR" or "Real AI analysis"
- ❌ "Allergy-safe" or "Guaranteed allergen detection"
- ❌ "TestFlight build available"
- ❌ "Real-time API" or "Cloud AI"
- ❌ "HIPAA-compliant" or "FDA-approved"
- ❌ "Diagnostic tool" or "Allergy detection system"

---

## 7. Demo Success Criteria

| # | Criterion | How to Verify |
|---|-----------|---------------|
| 1 | Preferences are saved after toggling | Close and reopen Dietary Preferences screen; selections persist |
| 2 | Warning badge appears for matching allergens | Scan result with allergens matching preferences shows orange "Contains" badge |
| 3 | Warning badge does NOT appear for non-matching allergens | Dishes without matching allergens show no badge |
| 4 | History entry created after successful scan | Profile → Scan History shows entry count incremented |
| 5 | Restored result opens from history tap | Tapping history entry navigates to results with all dish cards |
| 6 | No backend re-call during history restore | Network tab / backend logs show no new request (history is cached in-memory) |
| 7 | Clear history works with confirmation | Trash icon → confirm → empty state shown |
| 8 | Clear preferences works with confirmation | Dietary Preferences → Clear All → confirm → all toggles reset |
| 9 | Empty states render correctly | No preferences: "Allergens and dietary restrictions" subtitle; No history: "No scan history yet" |
| 10 | App does not crash during full flow | Complete all 21 steps without error screens or crashes |

---

## 8. Troubleshooting During Demo

| Issue | Quick Fix |
|-------|-----------|
| Backend unreachable | Verify Render service is running; show mock backend explanation |
| Scan hangs on processing | Restart app; verify mock OCR is enabled in backend health check |
| History empty after scan | Verify scan completed to results screen (history is saved only on successful analysis) |
| Allergen badge missing | Check dietary preferences are actually selected; verify scanned dish has matching allergens in mock data |
| Clear preferences dialog doesn't close | Tap "Cancel" or "Clear All" — ensure dialog button is tappable |
