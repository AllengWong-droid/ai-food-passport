# Render Deployment Dry-Run Checklist — AI Food Passport Backend

> **Status**: Dry-run documentation completed. Deployment executed and verified (Phase 13C).
> **Date**: 2026-06-13
> **Phase**: 13C
> **Deployed URL**: `https://ai-food-passport.onrender.com`
> **productionReady**: `false`

---

## Purpose

This document is a **pre-flight and smoke-test checklist** for deploying the AI Food Passport backend to Render.com. It covers the full workflow from local preflight → first deploy → post-deploy verification → enabling real Qwen providers later.

Nothing in this document requires real API keys or an actual deployment.

---

## Part 0: Decision — Blueprint (render.yaml) vs. Manual Dashboard Setup

### Option A: Manual Dashboard Setup (Recommended for First Deploy)

**Why this is safer for the first deploy:**

1. `QWEN_API_KEY` never touches Git or `render.yaml`
2. `ALLOWED_ORIGINS` can be set precisely for your Flutter domain
3. No risk of Blueprint auto-sync overwriting manual changes
4. Simpler for a small MVP

**Steps (manual setup):**

1. Push `backend/` code to a GitHub repo
2. Render Dashboard → New + → Web Service → Connect GitHub repo
3. Fill in settings manually (see Part 2 below)
4. Click Deploy

### Option B: Blueprint (`render.yaml`) Sync

**When to use this:**

- After the first successful manual deploy
- When you want version-controlled infrastructure

**Steps:**

1. Ensure `backend/render.yaml` exists and is committed
2. Render Dashboard → New + → Blueprint → Connect GitHub repo
3. Render prompts for `sync: false` env vars → enter them
4. **Immediately**: Blueprint → Auto Sync → **Off**
5. Set `QWEN_API_KEY` and `ALLOWED_ORIGINS` manually in Dashboard
6. Future changes: edit `render.yaml` → commit → Dashboard → Manual Sync

> **This phase includes `render.yaml` as a committed reference file, but the
> recommended first deploy method is Manual Dashboard Setup (Option A).**

---

## Part 1: Local Preflight (Run BEFORE Any Deploy)

```bash
# 1. Enter backend directory
cd backend

# 2. Run ALL contract tests
npm run test:contract
# Expected: all tests pass, 0 failures

# 3. Run ALL unit tests
node --test
# Expected: 509 tests pass, 0 failures

# 4. Start local server
npm run dev
# Expected: "AI Food Passport mock backend listening on http://0.0.0.0:3000"

# 5. In another terminal — test /health
curl http://localhost:3000/health
# Expected: HTTP 200, JSON with "ok": true, "activeOcrProvider": "mock_ocr"

# 6. Test POST /api/analyze-menu with mock provider
curl -s -X POST http://localhost:3000/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{}' | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8');const j=JSON.parse(d);console.log('ok:',j.ok,'dishes:',j.data?.dishes?.length,'error:',j.error?.code||'none')"
# Expected: ok: true, dishes: >0, error: none

# 7. Verify CORS preflight
curl -s -i -X OPTIONS http://localhost:3000/api/analyze-menu \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" | head -20
# Expected: HTTP 204, Access-Control-Allow-Origin header present

# 8. Verify body limit enforcement
# (Skipped in dry-run — tested by contract tests)

# 9. Secret scan
grep -rn "sk-[a-zA-Z0-9]" . --include="*.js" --include="*.yaml" --include="*.json" --include="*.md" \
  | grep -v "sk-placeholder" \
  | grep -v "sk-test" \
  | grep -v "sk-dummy" \
  | grep -v "sk-example" \
  | grep -v "node_modules" \
  || echo "No real API keys found — PASS"
# Expected: "No real API keys found — PASS"

# 10. Verify .env is NOT tracked
git status --porcelain ../.env 2>/dev/null || echo ".env not in repo — PASS"
# Expected: ".env not in repo — PASS"

# 11. git diff --check
cd ..
git diff --check
# Expected: no errors (warnings about CRLF/LF are acceptable)
```

---

## Part 2: Render Service Configuration (Manual Dashboard Setup)

When creating the Web Service in the Render Dashboard, use these exact values:

| Field | Value | Notes |
|-------|-------|-------|
| **Service Type** | Web Service | |
| **Runtime** | Node | Auto-detected from `package.json` |
| **Region** | Oregon (US West) | Best balance for China latency |
| **Branch** | `main` | Change to your default branch |
| **Root Directory** | `backend` | Monorepo: backend lives in `/backend` |
| **Build Command** | `npm install` | Installs production + dev deps |
| **Start Command** | `npm start` | Resolves to `node src/server.js` |
| **Plan** | Free | 750 hrs/month; sleeps after 15 min idle |

### Environment Variables (Dashboard → Environment)

Set these in the Render Dashboard **before first deploy**:

| Variable | Value | Secret? | Notes |
|----------|---------|----------|-------|
| `NODE_ENV` | `production` | No | Enables production path |
| `HOST` | `0.0.0.0` | No | Required for cloud binding |
| `PORT` | *(leave blank)* | No | Render sets this automatically |
| `ALLOWED_ORIGINS` | `https://your-flutter-app.com,https://*.onrender.com` | No | CHANGE before production! |
| `REQUEST_BODY_LIMIT` | `10mb` | No | Max image upload size |
| `OCR_PROVIDER` | `mock_ocr` | No | Real providers OFF by default |
| `ANALYSIS_PROVIDER` | `mock_ai` | No | Real providers OFF by default |
| `QWEN_OCR_PROVIDER_ENABLED` | `false` | No | Safety gate — disabled |
| `QWEN_ANALYSIS_PROVIDER_ENABLED` | `false` | No | Safety gate — disabled |
| `PROVIDER_TIMEOUT_MS` | `15000` | No | 15-second timeout |
| `PROVIDER_MAX_RETRIES` | `0` | No | No retries in MVP |
| `PUBLIC_BACKEND_URL` | `https://your-app.onrender.com` | No | Set after first deploy |
| `QWEN_API_KEY` | *(DO NOT SET YET)* | **YES** | Only set after first deploy succeeds |

### Health Check

| Field | Value |
|-------|-------|
| **Health Check Path** | `/health` |
| **Check Frequency** | Every 30 seconds (Render default) |
| **Failure Threshold** | 3 consecutive failures → unhealthy |

---

## Part 3: First Deploy (Mock Providers Only)

### Deploy Steps

1. Click **Deploy** in Render Dashboard
2. Watch build logs for errors
3. Wait for build to complete (~2–5 minutes)
4. Note the assigned `.onrender.com` URL

### Post-Deploy Smoke Tests (DO THESE BEFORE ANYTHING ELSE)

```bash
# Replace YOUR-APP with your actual Render subdomain

# 1. Health check
curl -s https://YOUR-APP.onrender.com/health | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log('ok:',j.ok,'ocr:',j.activeOcrProvider,'analysis:',j.activeAnalysisProvider,'real:',j.realProvidersEnabled)"
# Expected: ok: true, ocr: mock_ocr, analysis: mock_ai, real: false

# 2. CORS preflight
curl -s -i -X OPTIONS https://YOUR-APP.onrender.com/api/analyze-menu \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" | grep -i "Access-Control"
# Expected: Access-Control-Allow-Origin header present

# 3. POST /api/analyze-menu with mock provider
curl -s -X POST https://YOUR-APP.onrender.com/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{}' | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log('ok:',j.ok,'dishes:',j.data?.dishes?.length)"
# Expected: ok: true, dishes: >0 (mock data)

# 4. Verify no stack traces in error responses
curl -s https://YOUR-APP.onrender.com/health -X POST | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log('no stack:',!JSON.stringify(j).includes('at '))"
# Expected: no stack: true

# 5. Verify PUBLIC_BACKEND_URL matches deployed URL
curl -s https://YOUR-APP.onrender.com/health | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log('publicUrl:',j.publicBackendUrl||'not set')"
# Expected: publicUrl matches your .onrender.com URL (or "not set" if not yet configured)
```

### Update `PUBLIC_BACKEND_URL`

After the first successful deploy:

1. Render Dashboard → Environment
2. Add/Edit `PUBLIC_BACKEND_URL` = `https://YOUR-APP.onrender.com`
3. Save Changes
4. Trigger Manual Deploy (or wait for auto-deploy)

---

## Part 4: Keep Real Providers Disabled (Initial Phase)

After the first deploy succeeds with mock providers:

### Verify Real Providers Are Still Disabled

```bash
curl -s https://YOUR-APP.onrender.com/health | node -e "
const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
console.log('realProvidersEnabled:', j.realProvidersEnabled);
console.log('realOcrEnabled:', j.realOcrEnabled);
console.log('realAnalysisEnabled:', j.realAnalysisEnabled);
console.log('ocrProvider:', j.activeOcrProvider);
console.log('analysisProvider:', j.activeAnalysisProvider);
"
# Expected: all false, both providers = mock
```

### How to Verify Qwen Gates Block Correctly

Even if someone accidentally sets `OCR_PROVIDER=qwen_ocr` without the API key:

```bash
# This should return a controlled error, NOT call the real Qwen API
curl -s -X POST https://YOUR-APP.onrender.com/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{"image":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWgANCA=="}}'
# Expected: {"ok":false,"error":{"code":"OCR_PROVIDER_NOT_CONFIGURED"}}
```

---

## Part 5: Enabling Real Providers (Future — After Qwen Key Is Available)

> **Do NOT do this until:**
> 1. Mock deploy succeeds (Part 3)
> 2. Flutter app can reach backend (`BACKEND_BASE_URL` configured)
> 3. You have a valid DashScope API key
> 4. You have tested the key manually (Phase 12G smoke test)

### Step-by-Step: Enable Qwen OCR

1. **Render Dashboard → Environment**
2. Add `QWEN_API_KEY` = `YOUR_DASHSCOPE_API_KEY_HERE`
3. Set `OCR_PROVIDER` = `qwen_ocr`
4. Set `QWEN_OCR_PROVIDER_ENABLED` = `true`
5. Save Changes → Manual Deploy
6. **Smoke test**: Send a small test image → verify OCR returns real text
7. **Rollback**: If anything fails, revert env vars to `mock_ocr` + `false`

### Step-by-Step: Enable Qwen Analysis

1. **Render Dashboard → Environment** (QWEN_API_KEY already set from step above)
2. Set `ANALYSIS_PROVIDER` = `qwen_analysis`
3. Set `QWEN_ANALYSIS_PROVIDER_ENABLED` = `true`
4. Save Changes → Manual Deploy
5. **Smoke test**: Send menu text → verify analysis returns real AI dishes
6. **Rollback**: If anything fails, revert env vars to `mock_ai` + `false`

---

## Part 6: Rollback Plan

If the deployed backend behaves incorrectly:

### Instant Rollback (Render Dashboard)

1. Render Dashboard → Your Service → Events
2. Find the last known-good deploy
3. Click **Rollback** → Confirm
4. Render redeploys that version within ~1 minute

### Manual Rollback (Disable Real Providers)

1. Render Dashboard → Environment
2. Set `OCR_PROVIDER` = `mock_ocr`
3. Set `ANALYSIS_PROVIDER` = `mock_ai`
4. Set `QWEN_OCR_PROVIDER_ENABLED` = `false`
5. Set `QWEN_ANALYSIS_PROVIDER_ENABLED` = `false`
6. Save → Manual Deploy
7. Flutter app continues working with mock data

### Emergency: Delete Service

1. Render Dashboard → Settings → Delete Service
2. Flutter app still works with local mock (if `BACKEND_BASE_URL` falls back to localhost)

---

## Part 7: Render Free Tier — Important Caveats

| Caveat | Impact | Mitigation |
|--------|--------|------------|
| Sleeps after 15 min idle | ~30s cold-start delay for users | UptimeRobot free tier (ping `/health` every 14 min) |
| 750 hrs/month limit | Shared across all free services | One service = ~31 days; fine for MVP |
| Build minutes: 500/month | Exceeded if deploying very frequently | `git commit --amend` for quick fixes |
| Postgres expires after 30 days (free) | Data loss if forgotten | Upgrade to paid plan before expiry |
| Custom domain requires verification | Extra setup step | Use `.onrender.com` subdomain for TestFlight |

---

## Part 8: Dry-Run Validation Checklist (Phase 13B Completion)

Run this checklist to confirm Phase 13B is complete (no actual deployment needed):

- [ ] `backend/render.yaml` exists with safe placeholder-only values
- [ ] `render.yaml` does NOT contain `QWEN_API_KEY`
- [ ] `render.yaml` has `QWEN_OCR_PROVIDER_ENABLED=false` and `QWEN_ANALYSIS_PROVIDER_ENABLED=false`
- [ ] `render.yaml` has `OCR_PROVIDER=mock_ocr` and `ANALYSIS_PROVIDER=mock_ai`
- [ ] `backend/RENDER_DEPLOYMENT_DRY_RUN.md` exists (this file)
- [ ] All local preflight checks pass (Part 1)
- [ ] `node --test` passes (509 tests)
- [ ] `npm run test:contract` passes
- [ ] `GET /health` returns expected JSON locally
- [ ] `POST /api/analyze-menu` returns mock dishes locally
- [ ] No real API keys in any committed file
- [ ] `backend/.env` is in `.gitignore`
- [ ] `productionReady` is still `false`
- [ ] Flutter files are unchanged
- [ ] No deployment was performed
- [ ] `git diff --check` passes

---

## Part 9: Live Deployment Results (Phase 13C)

### Deployment Summary

| Field | Value |
|-------|-------|
| **URL** | `https://ai-food-passport.onrender.com` |
| **Branch** | `master` |
| **Commit** | `53968d7` |
| **Deploy Method** | Manual Dashboard Setup |
| **Result** | Success — service is live |

### Health Check (`GET /health`)

```
ok: true
activeOcrProvider: mock_ocr
activeAnalysisProvider: mock_ai
realOcrEnabled: false
realAnalysisEnabled: false
realProvidersEnabled: false
productionReady: false
```

### POST `/api/analyze-menu` (with `{}`)

```
ok: true
dishes: 2 (mock dishes)
error: none
```

### Provider Status

| Provider | Active | Enabled |
|----------|--------|---------|
| OCR | `mock_ocr` | Real Qwen OCR: `false` |
| Analysis | `mock_ai` | Real Qwen Analysis: `false` |

### Safety Verification

| Check | Result |
|-------|--------|
| `QWEN_API_KEY` configured? | No |
| Any API key configured? | No |
| Real provider calls made? | None |
| `productionReady` changed? | No (still `false`) |
| Flutter behavior changed? | No |
| Backend `src/` files changed? | No |
| Secrets committed? | No |

### Known Notes

- `GET /` returns 404 — no homepage route exists (by design).
- `POST /api/analyze-menu` must not include a trailing slash; `/api/analyze-menu/` is undefined and may 404.
- `PUBLIC_BACKEND_URL` was set to the deployed URL after initial deploy and redeployed.

### Deployed Environment Variables (non-secret)

```
NODE_ENV=production
HOST=0.0.0.0
OCR_PROVIDER=mock_ocr
ANALYSIS_PROVIDER=mock_ai
QWEN_OCR_PROVIDER_ENABLED=false
QWEN_ANALYSIS_PROVIDER_ENABLED=false
PROVIDER_TIMEOUT_MS=15000
PROVIDER_MAX_RETRIES=0
REQUEST_BODY_LIMIT=1048576
ALLOWED_ORIGINS=<safe testing origins>
PUBLIC_BACKEND_URL=https://ai-food-passport.onrender.com
```

No API keys (`QWEN_API_KEY`, `DEEPSEEK_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_VISION_API_KEY`, `EXCHANGE_RATE_API_KEY`) are configured.

## What This Phase Does NOT Do

- ❌ No deployment to Render has been performed **beyond the mock-only Phase 13C deploy**
- ❌ No real API keys were added
- ❌ No `QWEN_API_KEY` was set anywhere
- ❌ `ALLOWED_ORIGINS` was not configured for production frontend origins (testing only)
- ❌ No Flutter code was changed
- ❌ No backend runtime behavior was changed
- ❌ `productionReady` remains `false`
