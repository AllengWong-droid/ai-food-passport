# Deployment Readiness — AI Food Passport Backend

> **Status**: Planning only. No deployment has been performed.
> **Date**: 2026-06-13
> **Phase**: 13A
> **productionReady**: `false`

---

## Required Environment Variables

### Runtime Configuration

| Variable              | Required | Default                    | Description                                      |
|-----------------------|----------|----------------------------|--------------------------------------------------|
| `NODE_ENV`            | Yes      | `development`              | Set to `production` for deployment               |
| `PORT`                | Yes      | `3000`                     | HTTP server listen port                          |
| `HOST`                | No       | `0.0.0.0`                  | Bind address (use `0.0.0.0` for cloud)           |
| `ALLOWED_ORIGINS`     | No       | `*`                        | CORS allowed origins (comma-separated)           |
| `PUBLIC_BACKEND_URL`  | No       | `http://localhost:3000`    | Public-facing backend URL for Flutter config     |
| `REQUEST_BODY_LIMIT`  | No       | `10mb`                     | Max request body size (for image uploads)        |

### Provider Safety Controls

| Variable                      | Default   | Description                                     |
|-------------------------------|-----------|-------------------------------------------------|
| `PROVIDER_TIMEOUT_MS`         | `15000`   | Timeout for each provider call (ms)             |
| `PROVIDER_MAX_RETRIES`        | `1`       | Max retries on transient provider failure       |
| `PROVIDER_DAILY_REQUEST_LIMIT`| `100`     | Max provider requests per day (0 = unlimited)   |
| `PROVIDER_MONTHLY_BUDGET_USD` | `5`       | Soft budget cap (USD, 0 = unlimited)            |

### Provider Selection (mock by default)

| Variable              | Default        | Description                           |
|-----------------------|----------------|---------------------------------------|
| `OCR_PROVIDER`        | `mock_ocr`     | OCR provider selection                |
| `ANALYSIS_PROVIDER`   | `mock_ai`      | AI analysis provider selection        |

### Qwen OCR Gate (ALL must be set to enable real Qwen OCR)

| Variable                       | Required | Default                                              |
|--------------------------------|----------|------------------------------------------------------|
| `OCR_PROVIDER`                 | Yes      | `qwen_ocr`                                           |
| `QWEN_OCR_PROVIDER_ENABLED`    | Yes      | `true`                                               |
| `QWEN_API_KEY`                 | Yes      | (real DashScope API key)                             |
| `QWEN_OCR_MODEL`               | No       | `qwen-vl-max`                                        |
| `QWEN_OCR_BASE_URL`            | No       | `https://dashscope.aliyuncs.com/compatible-mode/v1`  |

### Qwen Analysis Gate (ALL must be set to enable real Qwen Analysis)

| Variable                        | Required | Default                                                       |
|---------------------------------|----------|---------------------------------------------------------------|
| `ANALYSIS_PROVIDER`             | Yes      | `qwen_analysis`                                               |
| `QWEN_ANALYSIS_PROVIDER_ENABLED`| Yes      | `true`                                                        |
| `QWEN_API_KEY`                  | Yes      | (same key as OCR)                                             |
| `QWEN_ANALYSIS_MODEL`           | No       | `qwen-max`                                                    |
| `QWEN_ANALYSIS_BASE_URL`        | No       | `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions` |

---

## Startup Commands

### Development (current)
```bash
cd backend
npm install
NODE_ENV=development node src/server.js
```

### Production (future, do NOT run yet)
```bash
cd backend
npm ci --omit=dev                # Install only production deps
NODE_ENV=production node src/server.js
```

### Health check
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","activeOcrProvider":"mock_ocr","activeAnalysisProvider":"mock_ai","realProvidersEnabled":false}
```

---

## Secret Handling Policy

### Where secrets live
| Secret Type          | Location                                 | Never In               |
|----------------------|------------------------------------------|------------------------|
| Provider API keys    | Backend deployment env vars ONLY         | Flutter, Git, client   |
| Qwen API key         | `QWEN_API_KEY` env var on server         | `.env` (in gitignore)  |
| Firebase (if added)  | Backend env vars / service account file  | Flutter, client        |

### Rules (mandatory)
1. Flutter `BACKEND_BASE_URL` is the ONLY backend-dependent config in the app
2. Flutter MUST NEVER contain provider API keys
3. Provider keys live ONLY in backend deployment environment variables
4. `.env` is in `.gitignore` — never committed
5. All secrets are excluded from error messages, logs, and HTTP responses (enforced by sanitization code)
6. Dry-run and contract tests verify no secret leakage in error paths

---

## Cost and Rate-Limit Controls

### Provider daily request limit
```javascript
// in src/providers/providerSafetyGuards.js
// PROVIDER_DAILY_REQUEST_LIMIT (default: 100)
// When limit is hit, requests return a controlled error without calling the provider
```

### Monthly budget cap
```javascript
// PROVIDER_MONTHLY_BUDGET_USD (default: $5)
// Tracks cumulative estimated provider cost
// When cap is hit, real provider calls are disabled until the next month
```

### Timeout wrapper
```javascript
// PROVIDER_TIMEOUT_MS (default: 15000)
// All provider calls pass through withProviderTimeout()
// Timeouts return clean ANALYSIS_FAILED / OCR_FAILED errors
```

### Retry policy
```javascript
// PROVIDER_MAX_RETRIES (default: 1)
// Only retries on transient errors (network, 5xx)
// Does NOT retry on auth errors (4xx) or malformed responses
```

---

## Rollback Steps

If the deployment causes issues, rollback by:

1. **Render dashboard**: One-click "Deploy" → "Rollback to previous deploy"
2. **Manual**: Re-deploy the last known-good commit
3. **Emergency**: Set `OCR_PROVIDER=mock_ocr` and `ANALYSIS_PROVIDER=mock_ai` to disable all real providers
4. **Flutter**: App continues to work with mock data (no backend dependency for basic UI)

---

## Pre-Deployment Checklist

Before attempting the first deployment:

- [ ] All backend tests pass: `node --test`
- [ ] Contract tests pass: `node --test tests/contract/`
- [ ] `git diff --check` passes (no trailing whitespace)
- [ ] Secret scan: no `sk-` keys in committed files
- [ ] `backend/.env` is in `.gitignore` and untracked
- [ ] `NODE_ENV=production` does not crash the server (test locally)
- [ ] `/health` returns expected JSON
- [ ] `POST /api/analyze-menu` works with mock providers
- [ ] CORS allows Flutter dev origin (if configured)
- [ ] Body limit rejects oversized requests
- [ ] No stack traces in error responses
- [ ] No secrets in log output
- [ ] `productionReady` remains `false`

---

## Future Deployment Smoke Checklist

> **Do NOT execute this checklist yet.** This is for when real API keys become available
> and the decision is made to deploy with real providers.

### Phase 1: Deploy with mock providers
- [ ] Deploy backend to recommended platform (Render)
- [ ] Verify `GET /health` returns `{"status":"ok"}`
- [ ] Verify `POST /api/analyze-menu` returns mock data (`ok: true`)
- [ ] Verify CORS headers allow Flutter origin
- [ ] Verify body limit rejects oversized image payloads
- [ ] Verify error responses contain no stack traces
- [ ] Verify log output contains no API keys or secrets
- [ ] Run contract tests against deployed backend

### Phase 2: Enable real Qwen OCR (manual smoke test)
- [ ] Set `QWEN_API_KEY` to a valid DashScope key
- [ ] Set `OCR_PROVIDER=qwen_ocr`
- [ ] Set `QWEN_OCR_PROVIDER_ENABLED=true`
- [ ] Send a known menu image via `POST /api/analyze-menu`
- [ ] Verify OCR returns real extracted text (not mock)
- [ ] Verify no API key appears in response or logs
- [ ] Verify error handling on malformed images
- [ ] Set `OCR_PROVIDER=mock_ocr` and `QWEN_OCR_PROVIDER_ENABLED=false` to revert

### Phase 3: Enable real Qwen Analysis (manual smoke test)
- [ ] Set `QWEN_API_KEY` validated from Phase 2
- [ ] Set `ANALYSIS_PROVIDER=qwen_analysis`
- [ ] Set `QWEN_ANALYSIS_PROVIDER_ENABLED=true`
- [ ] Send a known menu text via `POST /api/analyze-menu`
- [ ] Verify analysis returns real AI-generated dishes
- [ ] Verify no API key appears in response or logs
- [ ] Verify error handling on empty/malformed prompts
- [ ] Revert if any issue is found

### Phase 4: Both providers together (manual smoke test)
- [ ] Set all gates for both OCR and Analysis
- [ ] Full pipeline test: image → OCR → analysis → dishes
- [ ] Verify end-to-end latency is acceptable
- [ ] Verify cost tracking works
- [ ] Only after all checks pass → consider setting `productionReady=true`

---

## Flutter Configuration

### Development (current)
```dart
// lib/config.dart or similar
const String BACKEND_BASE_URL = 'http://localhost:3000';
```

### Production (future)
```dart
// Point to deployed backend — MUST be configurable, never hardcoded
const String BACKEND_BASE_URL = 'https://your-app.onrender.com';
// OR: load from environment/build config
```

### Rules
- Flutter MUST NOT contain any provider API keys
- Flutter MUST NOT contain any secrets beyond the backend URL
- If Firebase is added later, Firebase config belongs in Flutter, but service account keys belong on the backend
- `BACKEND_BASE_URL` should be the ONLY backend-dependent configuration in Flutter

---

## What This Phase Does NOT Do

- ❌ No deployment has been performed
- ❌ No accounts created on any platform
- ❌ No production environment variables set on any server
- ❌ No domain purchased or configured
- ❌ No real API keys added
- ❌ No Flutter code changed
- ❌ No backend runtime behavior changed
- ❌ `productionReady` remains `false`
- ❌ No cost/budget tracking is active (only documented)
