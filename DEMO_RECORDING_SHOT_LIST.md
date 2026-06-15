# AI Food Passport — Demo Recording Shot List

**Date:** 2026-06-15  
**Phase:** 25A  
**Purpose:** Guide for recording a polished demo video or screen capture of the MVP product flow.  
**Target Duration:** 2–4 minutes

---

## Recording Setup

- [ ] Device/emulator with clean app state (clear preferences, clear history)
- [ ] Screen recorder enabled (iOS: Control Center; Android: built-in; emulator: `adb shell screenrecord`)
- [ ] Do Not Disturb mode ON (no notifications during recording)
- [ ] Backend verified reachable: `https://ai-food-passport.onrender.com/health`
- [ ] Brightness at 80%+ for clear capture

---

## Shot List

### Shot 1: App Launch & Home Screen (5 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Wide | App icon tap → splash → home screen | 3s |
| Hold | Home screen with camera button prominent | 2s |

**Narration overlay (optional):** "AI Food Passport — smart menu analysis with personalized allergen warnings."

---

### Shot 2: Navigate to Profile (5 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Tap animation | Bottom nav: Profile tab tapped | 1s |
| Hold | Profile screen: Quick Actions section visible, dietary & history tiles | 4s |

**Key visual:** "Quick Actions" section header, Dietary Preferences with default subtitle.

---

### Shot 3: Dietary Preferences — Empty State (5 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Tap animation | Dietary Preferences tile tapped | 1s |
| Scroll down slowly | Show all 8 allergen toggles (unselected), 5 restriction toggles, disclaimer banner | 4s |

**Key visual:** All toggles in default state, yellow disclaimer banner visible.

---

### Shot 4: Select Allergens (10 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Tap animation | Tap "Gluten" — toggle fills accent color | 2s |
| Tap animation | Tap "Eggs" — second toggle fills | 2s |
| Tap animation | Tap "Soy" — third toggle fills | 2s |
| Back button tap | Return to Profile | 1s |
| Hold | Profile subtitle: "3 allergens avoided" | 3s |

**Key visual:** Three filled toggles, dynamic subtitle update.

---

### Shot 5: Scan a Menu (15 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Tap animation | Tap scan/camera button from bottom nav | 1s |
| Hold | Camera view with scan frame overlay | 3s |
| Hold | Frame a menu (real or test image) in the overlay | 4s |
| Tap animation | Capture button pressed | 1s |
| Hold | "Analyzing..." processing overlay with spinner | 3s |
| Transition | Processing overlay → Results screen with dish cards | 3s |

---

### Shot 6: Allergen Warning Badges (12 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Hold | Result card #1: dish with gluten → badge "Contains gluten" visible | 3s |
| Slow scroll | Scroll to next dish with multiple allergens → badge "Contains: gluten, eggs" | 3s |
| Hold | Dish without matching allergens → clean card, no badge | 3s |
| Hold | Contrast: two cards side by side (one with badge, one without) | 3s |

**Key visual:** Orange badge pops against card background. Clear visual distinction between "has match" and "no match."

---

### Shot 7: Navigate to Scan History (8 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Tap animation | Tab to Profile | 1s |
| Hold | Profile subtitle: "Scan History — 1 past scans" | 3s |
| Tap animation | Tap Scan History tile | 1s |
| Hold | History list with timestamp, dish count badge, dish names | 3s |

---

### Shot 8: Restore Previous Scan (8 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Tap animation | Tap history entry | 1s |
| Transition | Navigates to Results screen | 2s |
| Hold | Same dish cards restored, allergen badges still visible | 5s |

**Key visual:** Instant restore — no loading spinner (no backend call), badges recomputed from current preferences.

---

### Shot 9: Clear & Empty States (10 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Back button tap | Return to History screen | 1s |
| Tap animation | Tap trash icon → confirmation dialog | 2s |
| Tap animation | Tap "Clear" → history empties | 2s |
| Hold | "No scan history yet" empty state | 2s |
| Tap Profile → Dietary → Clear All → Clear | Reset preferences | 3s |

---

### Shot 10: End Card (3 seconds)

| Frame | Content | Duration |
|-------|---------|----------|
| Hold | App home screen after clean reset | 2s |
| Fade to black | End title: "AI Food Passport — MVP Alpha" | 1s |

---

## Shot Timing Summary

| Shot | Scene | Duration |
|------|-------|----------|
| 1 | App Launch & Home | 5s |
| 2 | Navigate to Profile | 5s |
| 3 | Dietary Preferences (empty) | 5s |
| 4 | Select Allergens | 10s |
| 5 | Scan a Menu | 15s |
| 6 | Allergen Warning Badges | 12s |
| 7 | Navigate to Scan History | 8s |
| 8 | Restore Previous Scan | 8s |
| 9 | Clear & Empty States | 10s |
| 10 | End Card | 3s |
| **Total** | | **81 seconds** |

---

## Post-Recording Notes

- Trim dead air at start/end of each shot
- Add subtle captions for key actions (e.g., "Tap to select allergens", "Orange badge = personal match")
- Overlay disclaimers as text on last few seconds: "MVP Alpha · Mock Backend · Not Medical Advice"
- Export at 1080p minimum for portfolio use
