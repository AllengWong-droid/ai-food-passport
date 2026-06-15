# AI Food Passport — User Testing Script

> Step-by-step scripts for conducting a structured test session of the public web demo. Choose the 5-minute or 10-minute version.

---

## Before You Start — Critical Reminder

**This is a mock-safe MVP Alpha.** Please keep these in mind throughout testing:

- No real OCR/AI provider is enabled — food recognition and analysis are simulated
- Not production-ready — App Store / TestFlight not available
- No allergy safety guarantee — dietary warnings are mock data, not medical advice
- Do not use for real allergy safety decisions
- Backend on Render free tier — first request may experience up to 50-second cold start

---

## 5-Minute Testing Script

> Best for classmates, friends, or quick portfolio reviews.

| Step | Action | Expected Result | Time |
|------|--------|-----------------|------|
| 1 | Open demo: https://allengwong-droid.github.io/ai-food-passport/demo/ | App loads in browser; may briefly show loading if Render backend is cold-starting | 30s |
| 2 | Read the main screen content | Understand what the app does (menu analysis for travelers) | 30s |
| 3 | Navigate to Settings (gear icon or navigation) | Settings screen appears with dietary preference options | 30s |
| 4 | Toggle 2-3 dietary preferences (e.g., Peanuts allergy, Vegetarian) | Toggles respond immediately; preferences are saved locally | 30s |
| 5 | Return to main screen and tap "Scan Menu" | A mock dish list appears (simulated menu scan result) | 30s |
| 6 | Look at the analysis result — note any allergen badge | If you toggled a matching allergen, a warning badge should appear | 30s |
| 7 | Navigate to scan history | Previous scan appears in the history list | 30s |
| 8 | Overall impression — rate 1-5 | Form your first-impression score | 30s |

**Total: approximately 4 minutes** (plus any Render cold-start delay)

### After the Script — Quick Questions

1. On a scale of 1-5, how was your first impression?
2. What was the most confusing part?
3. Did the allergen badge make sense?
4. Would this project make a recruiter interested? Why or why not?

---

## 10-Minute Testing Script

> Best for mentors, technical reviewers, or detailed portfolio assessment.

| Step | Action | Expected Result | Time |
|------|--------|-----------------|------|
| 1 | Open demo in browser | App loads; check for any loading errors or long delays | 1 min |
| 2 | Read the onboarding text / main screen carefully | Information architecture is clear; safety disclaimers visible | 1 min |
| 3 | Navigate to Settings. Explore ALL available dietary preferences (allergens + restrictions) | Full list appears; toggles work; labels are clear | 1 min |
| 4 | Set a complex preference combination (e.g., Peanuts + Shellfish allergy, Vegetarian restriction) | Multiple toggles work simultaneously; no crashes | 1 min |
| 5 | Run mock menu scan | Dish list appears; loading indicator shown during backend call | 1 min |
| 6 | Inspect each dish in the result: dish name, price currency, description, allergen badge | All fields populated; allergen badge matches dietary preferences | 1 min |
| 7 | Change dietary preferences, then re-scan | Allergen badge updates to reflect new preferences | 1 min |
| 8 | Navigate to scan history (session-local) | All scans from current session appear; most recent on top | 1 min |
| 9 | Browse privacy policy link | Privacy policy page loads; content is clear and honest | 30s |
| 10 | Check the demo UI on different screen sizes (resize browser window) | Responsive layout; no elements cutoff or misaligned | 1 min |
| 11 | Overall assessment | Form detailed impression | 30s |

**Total: approximately 10 minutes** (plus any Render cold-start delay)

### After the Script — Detailed Questions

1. What impressed you most?
2. What needs the most improvement?
3. Were the safety disclaimers appropriate? Anything missing?
4. Does the project feel like it was built by one person or a team? (Hint: it was one person)
5. Would you recommend this for a job interview portfolio?
6. What is the single biggest gap between this and a "real" app?

---

## What to Do If Render Cold Start Delays Backend

Render free tier spins down after 15 minutes of inactivity. The first request can take **30-50 seconds**.

**What you will see:** The demo may show a loading state or timeout initially.

**What to do:**

1. **Wait** — the backend will wake up. Try refreshing after 30-40 seconds.
2. **Alternative:** Open the Render health check URL first to wake it up:
   - https://ai-food-passport.onrender.com/health
   - Wait for `"status": "ok"` response, then return to the demo.
3. **If it still fails:** Note it as a bug report — include the time you tried and whether the health endpoint responded.

---

## What to Screenshot or Report

Take screenshots or notes if you see any of these:

- [ ] App shows blank screen or never loads
- [ ] Error message that is confusing or unhelpful
- [ ] UI element cut off, overlapping, or misaligned
- [ ] Dietary preference toggle does not respond
- [ ] Scan result shows no dishes or garbled text
- [ ] Allergen badge shows wrong warning (does not match your preferences)
- [ ] Scan history is empty after a scan completed
- [ ] Privacy policy link is broken or returns 404
- [ ] Any text that feels misleading or inconsistent with mock-safe status

---

## Reminder: This Is Mock-Only

Throughout testing, remember:

- Food "recognition" is simulated — you are seeing pre-defined mock dishes
- Allergen "analysis" is simulated — warnings are pattern-matched, not AI-inferred
- No real AI is running — this is a demonstration of the product concept and Flutter UI

Your feedback helps make this portfolio project stronger. Thank you for testing.
