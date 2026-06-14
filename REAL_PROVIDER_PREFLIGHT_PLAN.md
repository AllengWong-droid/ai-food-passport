# Real Provider Preflight Plan

> **Phase**: 16A
> **Date**: 2026-06-14
> **Status**: Documentation and safety planning only — NO real providers enabled
> **productionReady**: `false`

---

## Purpose

This document defines the exact preconditions, env gates, forbidden actions, rollback plan, and test matrix for future real Qwen OCR / Qwen analysis testing. **Nothing is enabled in this phase.** This plan ensures that when Phase 16B (Qwen OCR real smoke) or Phase 16C (Qwen analysis real smoke) begins, all safety mechanisms are understood and verified.

---

## 1. Prerequisites — What Must Be True Before Real Provider Testing

Before ANY real provider test runs, ALL of the following must be confirmed:

### 1.1 Backend-Only API Key Available

- [ ] A valid `QWEN_API_KEY` exists (obtained from Qwen/Alibaba Cloud console).
- [ ] The key has sufficient quota for a handful of test calls (1-5 OCR + 1-5 analysis).
- [ ] The key is stored **only** in the Render Dashboard environment variables — never in Git, never in Flutter.
- [ ] The key is a **test key** (non-production). Production billing is not active.

### 1.2 Render Env Vars Understood

- [ ] Render Dashboard env var interface is accessible to the operator.
- [ ] Operator knows how to add, edit, and remove env vars without redeploying (Render auto-restarts on env var change).
- [ ] Operator knows that env var changes trigger a brief restart (~30-60s on free tier).

### 1.3 Rollback Plan Ready

- [ ] Full rollback plan (Section 5 below) is printed or immediately accessible.
- [ ] Operator is prepared to revert all env vars to mock values within 2 minutes.
- [ ] `/health` endpoint is bookmarked for immediate verification after rollback.

### 1.4 Mock Baseline Confirmed

- [ ] Before enabling any real provider, a fresh `/health` call confirms:
  - `activeOcrProvider: mock_ocr`
  - `activeAnalysisProvider: mock_ai`
  - `realProvidersEnabled: false`
  - `productionReady: false`
- [ ] A fresh `POST /api/analyze-menu` call confirms mock dishes (Tonkotsu Ramen, Miso Katsu Skewers) still return correctly.
- [ ] `flutter test` passes 42/42.
- [ ] Local backend test suite still passes 509/509.

### 1.5 Logs Safe and Redacted

- [ ] Render logs panel is open during testing.
- [ ] Operator confirms no API keys appear in Render logs after first real call.
- [ ] If any key leaks appear, the key is rotated immediately.
- [ ] Log sanitisation (`sanitizeMessage`, `stripForbiddenFields`, `normalizeOcrError`, `normalizeAnalysisError`) is verified active in runtime config.

---

## 2. Exact Env Gates for Future Qwen OCR

To enable Qwen OCR real provider, ALL three gates must be set on Render Dashboard:

| Env Var | Required Value | Where | Notes |
|---------|---------------|-------|-------|
| `OCR_PROVIDER` | `qwen_ocr` | Render Dashboard | Must be exact string |
| `QWEN_OCR_PROVIDER_ENABLED` | `true` | Render Dashboard | Must be exact string |
| `QWEN_API_KEY` | *(valid Qwen API key)* | Render Dashboard | Backend-only; never in Git/Flutter |

### Optional OCR overrides (use defaults unless troubleshooting)

| Env Var | Default | Notes |
|---------|---------|-------|
| `QWEN_OCR_MODEL` | `qwen-vl-max` | Qwen vision model |
| `QWEN_OCR_BASE_URL` | `https://dashscope.aliyuncs.com/api/v1` | Qwen API base |
| `PROVIDER_TIMEOUT_MS` | `30000` | 30s default |

### Env var values when reverting OCR to mock

```
OCR_PROVIDER=mock_ocr
QWEN_OCR_PROVIDER_ENABLED=false
```

> Do NOT delete `QWEN_API_KEY` from Dashboard during preflight unless there is a confirmed leak. Simply setting the gates to `false` + `mock_ocr` is sufficient to disable real calls.

---

## 3. Exact Env Gates for Future Qwen Analysis

To enable Qwen analysis real provider, ALL three gates must be set on Render Dashboard:

| Env Var | Required Value | Where | Notes |
|---------|---------------|-------|-------|
| `ANALYSIS_PROVIDER` | `qwen_analysis` | Render Dashboard | Must be exact string |
| `QWEN_ANALYSIS_PROVIDER_ENABLED` | `true` | Render Dashboard | Must be exact string |
| `QWEN_API_KEY` | *(valid Qwen API key)* | Render Dashboard | Same key as OCR; must also be valid |

### Optional Analysis overrides (use defaults unless troubleshooting)

| Env Var | Default | Notes |
|---------|---------|-------|
| `QWEN_ANALYSIS_MODEL` | `qwen-max` | Qwen chat model |
| `QWEN_ANALYSIS_BASE_URL` | `https://dashscope.aliyuncs.com/api/v1` | Qwen API base |
| `PROVIDER_TIMEOUT_MS` | `30000` | 30s default |

### Env var values when reverting Analysis to mock

```
ANALYSIS_PROVIDER=mock_ai
QWEN_ANALYSIS_PROVIDER_ENABLED=false
```

---

## 4. Explicit Forbidden Actions

These actions are **NEVER** permitted during preflight or real provider testing:

| # | Forbidden Action | Severity | Reason |
|---|------------------|----------|--------|
| 1 | Put provider API keys in Flutter code | **BLOCKER** | Would leak keys in client-side code |
| 2 | Commit `.env` to Git | **BLOCKER** | Would leak keys into repository history |
| 3 | Add `QWEN_API_KEY` or any real key to `render.yaml` | **BLOCKER** | `render.yaml` is committed to Git |
| 4 | Enable both OCR and analysis providers together without separate validation | **BLOCKER** | Must isolate failures; Phase 16B tests OCR only, Phase 16C tests analysis only |
| 5 | Set `productionReady=true` during preflight | **BLOCKER** | Preflight is exploratory testing, not production |
| 6 | Remove mock fallback code | **BLOCKER** | Mock fallback is the safety net |
| 7 | Hardcode Render URL or provider config in Flutter | **BLOCKER** | All config flows through dart-define and backend env vars |
| 8 | Run real provider tests without Render logs open | **WARNING** | Must monitor for key leaks in real-time |
| 9 | Use production billing account for preflight | **WARNING** | Use a test/development API key with limited quota |
| 10 | Skip rollback verification after testing | **WARNING** | Always confirm mock routing works after real provider test |

---

## 5. Rollback Plan

### Quick Rollback (back to mock, ~2 minutes)

**Step 1**: In Render Dashboard → Environment, set:

```
OCR_PROVIDER=mock_ocr
QWEN_OCR_PROVIDER_ENABLED=false
ANALYSIS_PROVIDER=mock_ai
QWEN_ANALYSIS_PROVIDER_ENABLED=false
```

**Step 2**: Wait for Render to auto-restart (~30-60s).

**Step 3**: Verify rollback with curl:

```bash
# Health check
curl https://ai-food-passport.onrender.com/health

# Expected: activeOcrProvider: "mock_ocr", activeAnalysisProvider: "mock_ai", realProvidersEnabled: false

# Mock dish check
curl -X POST https://ai-food-passport.onrender.com/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"dGVzdA==","homeCountry":"CN","homeCurrency":"CNY","outputLanguage":"zh"}'

# Expected: ok:true, 2 mock dishes (Tonkotsu Ramen, Miso Katsu Skewers)
```

**Step 4**: Run `flutter test` locally — confirm 42/42 pass.

**Step 5**: Run `node --test backend/tests/` locally — confirm 509/509 pass.

### Key Rotation (if key leaked)

If `QWEN_API_KEY` appears in any log, response, or UI:

1. Immediately delete `QWEN_API_KEY` from Render Dashboard.
2. Execute Quick Rollback (above).
3. Generate a new key from Alibaba Cloud console.
4. Set the new key in Render Dashboard **only when rollback is confirmed**.
5. Do NOT set the new key and real providers simultaneously — first set the key, verify mock still works, then proceed.

---

## 6. Preflight Test Matrix

This matrix maps every sensible env var combination through the expected outcome. Execute in order.

### 6.1 Mock Baseline (Phase 16A baseline)

| OCR_PROVIDER | QWEN_OCR_ENABLED | ANALYSIS_PROVIDER | QWEN_ANALYSIS_ENABLED | QWEN_API_KEY | Expected Result |
|---|---|---|---|---|---|
| `mock_ocr` | `false` | `mock_ai` | `false` | *(absent)* | Mock dishes; no real calls |

### 6.2 Missing Key Scenarios

| OCR_PROVIDER | QWEN_OCR_ENABLED | ANALYSIS_PROVIDER | QWEN_ANALYSIS_ENABLED | QWEN_API_KEY | Expected Result |
|---|---|---|---|---|---|
| `qwen_ocr` | `true` | `mock_ai` | `false` | *(absent)* | `OCR_PROVIDER_NOT_CONFIGURED`; falls back to mock |
| `mock_ocr` | `false` | `qwen_analysis` | `true` | *(absent)* | `ANALYSIS_PROVIDER_NOT_CONFIGURED`; falls back to mock |

### 6.3 Placeholder Key Scenarios

| OCR_PROVIDER | QWEN_OCR_ENABLED | ANALYSIS_PROVIDER | QWEN_ANALYSIS_ENABLED | QWEN_API_KEY | Expected Result |
|---|---|---|---|---|---|
| `qwen_ocr` | `true` | `mock_ai` | `false` | `sk-placeholder` | `OCR_PROVIDER_NOT_CONFIGURED`; key rejected as placeholder |
| `mock_ocr` | `false` | `qwen_analysis` | `true` | `sk-placeholder` | `ANALYSIS_PROVIDER_NOT_CONFIGURED`; key rejected as placeholder |

### 6.4 Gate Disabled Scenarios

| OCR_PROVIDER | QWEN_OCR_ENABLED | ANALYSIS_PROVIDER | QWEN_ANALYSIS_ENABLED | QWEN_API_KEY | Expected Result |
|---|---|---|---|---|---|
| `qwen_ocr` | `false` | `mock_ai` | `false` | valid key | Mock OCR used; gate disabled |
| `mock_ocr` | `false` | `qwen_analysis` | `false` | valid key | Mock AI used; gate disabled |

### 6.5 OCR Only Enabled (Phase 16B)

| OCR_PROVIDER | QWEN_OCR_ENABLED | ANALYSIS_PROVIDER | QWEN_ANALYSIS_ENABLED | QWEN_API_KEY | Expected Result |
|---|---|---|---|---|---|
| `qwen_ocr` | `true` | `mock_ai` | `false` | valid key | Real OCR text extraction; mock analysis on real OCR text |

### 6.6 Analysis Only Enabled (Phase 16C)

| OCR_PROVIDER | QWEN_OCR_ENABLED | ANALYSIS_PROVIDER | QWEN_ANALYSIS_ENABLED | QWEN_API_KEY | Expected Result |
|---|---|---|---|---|---|
| `mock_ocr` | `false` | `qwen_analysis` | `true` | valid key | Mock OCR text; real analysis on mock OCR text |

### 6.7 Both Enabled (Phase 16D — only after 16B + 16C pass)

| OCR_PROVIDER | QWEN_OCR_ENABLED | ANALYSIS_PROVIDER | QWEN_ANALYSIS_ENABLED | QWEN_API_KEY | Expected Result |
|---|---|---|---|---|---|
| `qwen_ocr` | `true` | `qwen_analysis` | `true` | valid key | Real OCR + real analysis end-to-end |

### 6.8 Rollback Verification

| OCR_PROVIDER | QWEN_OCR_ENABLED | ANALYSIS_PROVIDER | QWEN_ANALYSIS_ENABLED | QWEN_API_KEY | Expected Result |
|---|---|---|---|---|---|
| `mock_ocr` | `false` | `mock_ai` | `false` | *(present but gated off)* | Mock dishes; real providers disabled |

---

## 7. Decision Point — Phase Boundaries

### Phase 16A (THIS PHASE)
- Creates this preflight plan document.
- Updates related documentation.
- Runs automated tests to confirm baseline.
- **Does NOT execute any real provider testing.**

### Phase 16B — Qwen OCR Real Smoke Test
**Prerequisites to begin Phase 16B:**
- [ ] All Phase 16A prerequisites confirmed (Section 1).
- [ ] A real backend-only test `QWEN_API_KEY` exists and is set on Render Dashboard.
- [ ] Operator is logged into Render Dashboard with logs panel open.
- [ ] Rollback plan is printed or on a second screen.

**Phase 16B scope:**
- Set `OCR_PROVIDER=qwen_ocr`, `QWEN_OCR_PROVIDER_ENABLED=true`.
- Keep `ANALYSIS_PROVIDER=mock_ai`, `QWEN_ANALYSIS_PROVIDER_ENABLED=false`.
- Test with a real menu image.
- Verify OCR text appears without key leaks.
- Roll back to mock after testing.

### Phase 16C — Qwen Analysis Real Smoke Test
**Prerequisites to begin Phase 16C:**
- [ ] Phase 16B completed successfully and rolled back.
- [ ] Phase 16B findings documented.

**Phase 16C scope:**
- Set `ANALYSIS_PROVIDER=qwen_analysis`, `QWEN_ANALYSIS_PROVIDER_ENABLED=true`.
- Keep `OCR_PROVIDER=mock_ocr`, `QWEN_OCR_PROVIDER_ENABLED=false`.
- Test with a real menu image (mock OCR text + real analysis).
- Verify analysis results appear without key leaks.
- Roll back to mock after testing.

### Phase 16D — Combined Real Provider Test
**Prerequisites to begin Phase 16D:**
- [ ] Phase 16B and 16C both passed independently.
- [ ] Both preflight reports reviewed.

**Phase 16D scope:**
- Enable both OCR and analysis.
- End-to-end test with real menu image.
- Verify full pipeline without key leaks.
- Roll back to mock after testing.

---

## 8. Verification Commands

Run these after every preflight test matrix row:

```bash
# Backend health check (should show real provider status)
curl https://ai-food-passport.onrender.com/health

# Backend mock dish check (should still work during preflight with mock fallback)
curl -X POST https://ai-food-passport.onrender.com/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"dGVzdA==","homeCountry":"CN","homeCurrency":"CNY","outputLanguage":"zh"}'

# Flutter tests
flutter test

# Git check
git diff --check
git status --short
```

---

## 9. Related Documents

| Document | Purpose |
|----------|---------|
| `REAL_PROVIDER_READINESS_CHECKLIST.md` | Full readiness checklist (509 tests, contracts, contracts) |
| `backend/DEPLOYMENT_READINESS.md` | Render deployment config and env var reference |
| `backend/RENDER_DEPLOYMENT_DRY_RUN.md` | Manual Dashboard setup walkthrough |
| `backend/QWEN_OCR_MANUAL_SMOKE_TEST.md` | OCR smoke test guide (Phase 16B target) |
| `backend/QWEN_ANALYSIS_MANUAL_SMOKE_TEST.md` | Analysis smoke test guide (Phase 16C target) |
| `backend/SECURITY_AND_SECRETS.md` | Secret handling and redaction policies |
| `MVP_ALPHA_DEMO_RUNBOOK.md` | Current demo flow (mock-only baseline) |
| `PHASE_15C_MANUAL_SMOKE_TEST.md` | Post-polish demo smoke test results |

---

> **This document is a plan only. No real providers have been enabled.**
> **`productionReady` remains `false`.**
> **`realProvidersEnabled` remains `false`.**
> **All tests pass on mock baseline.**
