# Feedback Outreach Checklist — AI Food Passport

> **Purpose**: Step-by-step checklist for real feedback collection.
> **Status**: Not yet started. Pending user action.
> **Last updated**: 2026-06-15

---

## 1. Outreach Targets

| Target | Requirement | Status |
|--------|-------------|--------|
| Minimum | Send to **3 people** | ⬜ Not started |
| Recommended | Send to **5 people/channels** | ⬜ Not started |

---

## 2. Suggested First Batch (5 channels)

| # | Audience | Message Template | Priority | Sent? |
|---|----------|-----------------|----------|-------|
| 1 | 1 classmate / friend | [Classmates/Friends (Chinese) →](FEEDBACK_INVITATION_MESSAGES.md#4-classmatesfriends-chinese) or [Short DM (Chinese) →](FEEDBACK_INVITATION_MESSAGES.md#1-short-dm-wechatline-chinese) | 🔴 Must | ⬜ |
| 2 | 1 technical reviewer | [Technical Reviewers (English) →](FEEDBACK_INVITATION_MESSAGES.md#6-technical-reviewers-english) | 🔴 Must | ⬜ |
| 3 | 1 mentor / teacher | [Mentors/Teachers (Chinese) →](FEEDBACK_INVITATION_MESSAGES.md#5-mentorsteachers-chinese) | 🔴 Must | ⬜ |
| 4 | 1 Dcard or community post | [Dcard-style (Chinese) →](FEEDBACK_INVITATION_MESSAGES.md#2-dcard-style-chinese) | 🟡 Recommended | ⬜ |
| 5 | 1 LinkedIn / recruiter-style post | [LinkedIn (English) →](FEEDBACK_INVITATION_MESSAGES.md#3-linkedin-english) or [Recruiters (English) →](FEEDBACK_INVITATION_MESSAGES.md#7-recruiters-english) | 🟢 Optional | ⬜ |

**Minimum completion**: #1, #2, #3 sent (3 people).
**Recommended completion**: All 5 sent.

---

## 3. Copy-Paste References

Before sending any message, review these documents:

| Document | Link | What it contains |
|----------|------|------------------|
| Invitation Messages | [FEEDBACK_INVITATION_MESSAGES.md](FEEDBACK_INVITATION_MESSAGES.md) | 7 ready-to-use message templates in Chinese and English |
| Feedback Guide | [PUBLIC_FEEDBACK_GUIDE.md](PUBLIC_FEEDBACK_GUIDE.md) | How testers should use the demo, what to look for, how to report |
| Feedback Form | [FEEDBACK_FORM_QUESTIONS.md](FEEDBACK_FORM_QUESTIONS.md) | Short form (~8Q, 3 min) and full form (~20Q, 8 min) |
| Outreach Log | [FEEDBACK_OUTREACH_LOG.md](FEEDBACK_OUTREACH_LOG.md) | Where to record outreach attempts and responses |

---

## 4. What to Send with Each Message

Every outreach message should include these 3 items:

### Required

1. **Demo link**
   ```
   https://allengwong-droid.github.io/ai-food-passport/demo/
   ```

2. **Feedback guide link** (or tell them how to give feedback)
   ```
   https://github.com/AllengWong-droid/ai-food-passport/blob/main/PUBLIC_FEEDBACK_GUIDE.md
   ```

3. **Short disclaimer** (verbatim — include in EVERY message)
   > Note: This is a mock-safe MVP Alpha. No real OCR/AI providers are enabled. Not production-ready. No allergy safety guarantee. Not on App Store. I'm looking for honest feedback on the concept, UX, and portfolio presentation.

### Optional

4. **Feedback form link** (if they prefer structured feedback)
   ```
   https://github.com/AllengWong-droid/ai-food-passport/blob/main/FEEDBACK_FORM_QUESTIONS.md
   ```

5. **GitHub Release link** (for technical reviewers or recruiters who want context)
   ```
   https://github.com/AllengWong-droid/ai-food-passport/releases/tag/v0.2.0-portfolio-demo-ready
   ```

---

## 5. What to Record After Sending

For each outreach attempt, update [FEEDBACK_OUTREACH_LOG.md](FEEDBACK_OUTREACH_LOG.md) with:

| Field | What to write |
|-------|---------------|
| Date Sent | YYYY-MM-DD |
| Channel | WeChat / Line / Discord / Email / Dcard / LinkedIn / other |
| Status | Sent → Opened → Replied → Feedback received → Follow-up needed |
| Response? | Yes / No (with brief note) |
| Feedback Summary | What they said (key points only, no personal info) |
| Action Item | What to do with this feedback (e.g., "fix confusing button label", "add tooltip on X") |
| Priority | High / Medium / Low (based on impact and effort) |

---

## 6. Completion Criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | At least 3 outreach attempts sent | ⬜ |
| 2 | At least 1 feedback response received | ⬜ |
| 3 | Outreach log updated honestly | ⬜ |
| 4 | Zero invented testers or feedback | ✅ (document is honest by design) |

**All 4 criteria must be met before this phase is considered complete.**

---

## 7. Tips for Effective Outreach

### DO

- Send individually, not in a group chat — personal outreach gets better responses
- Give them the demo link and let them explore on their own first
- Tell them honest feedback is more valuable than polite praise
- Follow up gently after 2-3 days if no response
- Thank them regardless of whether they found issues

### DON'T

- Pressure anyone to respond quickly
- Ask for "positive reviews" or "stars" — this is about honest feedback, not promotion
- Claim the app does things it doesn't (no real AI, no allergy guarantee)
- Share the feedback log publicly — it may contain personal context

---

## 8. After First Batch: Triage and Next Round

After the first batch of feedback arrives:

1. **Read all feedback** without filtering or dismissing
2. **Sort by theme** using the categories in [FEEDBACK_OUTREACH_LOG.md §5](FEEDBACK_OUTREACH_LOG.md#5-feedback-themes-to-be-filled-after-real-feedback-arrives)
3. **Identify patterns** — if 2+ people mention the same issue, prioritize it
4. **Create GitHub Issues** for actionable feedback (optional, for portfolio visibility)
5. **Decide on second batch** — if first batch was productive, send more
6. **Update the outreach log** with all new data

---

*This checklist tracks real outreach only. No invented testers, no invented feedback.*
*Last updated: 2026-06-15. Status: Pending user action.*
