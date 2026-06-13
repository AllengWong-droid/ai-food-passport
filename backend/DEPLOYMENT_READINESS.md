# Backend Deployment Readiness

Phase 11C — CORS enforcement and request body limit enforcement.

## Purpose

This document tracks what is required before the AI Food Passport backend can be deployed to a production environment for real Flutter app users (App Store / TestFlight).

The backend is currently **mock-only**. No real OCR or AI provider calls are implemented. Deployment readiness at this stage means:

- The backend can be started in production mode (`NODE_ENV=production`)
- Environment variables are parsed safely with documented defaults
- CORS origin validation is enforced (not just skeleton)
- Request body size is limited with a controlled error envelope
- Health check reports deployment readiness metadata
- Contract tests pass before any deployment

---

## Current Status (Phase 11C)

| Area | Status | Notes |
|---|---|---|---|
| Runtime config (`runtimeConfig.js`) | ✅ Ready | Parses NODE_ENV, PORT, HOST, ALLOWED_ORIGINS, PUBLIC_BACKEND_URL, REQUEST_BODY_LIMIT |
| Environment variable validation | ✅ Ready | Warnings (not crashes) on invalid values |
| `/health` deployment metadata | ✅ Ready | Exposes `nodeEnv`, `port`, `host`, `corsConfigured`, `corsEnforcementReady`, `requestBodyLimitBytes`, `requestBodyLimitReady`, `productionReady`, `deploymentReadinessReady` |
| CORS enforcement | ✅ Ready | Origin validation via `corsEnforcement.js`. Dev: permissive localhost. Prod: explicit origins only, no `*`. OPTIONS preflight handled. |
| Request body limit | ✅ Ready | `REQUEST_BODY_LIMIT` enforced. Oversized bodies return `413` with `REQUEST_BODY_TOO_LARGE` controlled error envelope. |
| Secrets management | ⚠️ Documented | `.env.example` placeholders only; no real keys anywhere |
| Contract tests | ✅ Ready | `npm run test:contract` passes (102 tests) |
| Real provider calls | ❌ Disabled | All real providers are skeletons |
| HTTPS / TLS | ❌ Not configured | Must be handled by deployment platform (e.g. Cloud Run, Heroku) |
| Rate limiting | ❌ Skeleton | Config parsed, not enforced |
| Cost guards | ❌ Skeleton | Config parsed, not enforced |
| Logging redaction | ✅ Skeleton | `redactForLogs` and `redactError` available, not yet wrapped on live paths |
| Safe error envelopes | ✅ Ready | `extractSafeErrorCode` and `buildSafeLogEntry` available; all API responses use controlled envelopes |

---

## Pre-Deployment Checklist

Before deploying to a real production environment, complete:

### 1. Real Provider Phase
- [ ] Activate one real OCR provider (e.g. Qwen OCR)
- [ ] Activate one real analysis provider (e.g. Qwen analysis)
- [ ] Wrap real provider calls with `withProviderTimeout`
- [ ] Wrap real provider calls with `redactForLogs` for logging
- [ ] Wrap real provider catch handlers with `extractSafeErrorCode`
- [ ] Add cost guards and rate limits
- [ ] Integration test real providers in `china` providerMode

### 2. CORS Enforcement ✅ (Completed in Phase 11C)
- [x] Validate `ALLOWED_ORIGINS` in production (reject unrecognised origins)
- [x] Remove `Access-Control-Allow-Origin: *` for non-localhost requests in production
- [x] Handle OPTIONS preflight with origin validation
- [ ] Test Flutter web production build CORS behaviour

### 3. Secrets Management
- [ ] Deploy backend with real API keys as deployment environment variables (NOT in `.env` file)
- [ ] Verify no secrets appear in `/health` or any API response
- [ ] Verify `redactForLogs` masks secrets in all log output
- [ ] Rotate any accidentally-committed keys immediately

### 4. Deployment Platform Configuration
- [ ] Configure `HOST=0.0.0.0` for containerised deployments
- [ ] Set `PORT` to match deployment platform's assigned port
- [ ] Set `PUBLIC_BACKEND_URL` to the deployed HTTPS URL
- [ ] Configure `ALLOWED_ORIGINS` to the Flutter app's production origin(s)
- [ ] Enable HTTPS (via load balancer or deployment platform)
- [ ] Configure health check endpoint for platform's liveness probe

### 5. Flutter App Configuration
- [ ] Update Flutter `AnalyzeMenuService` to call `PUBLIC_BACKEND_URL` in production
- [ ] Keep Flutter calling `localhost:8787` in development mode
- [ ] Test Flutter production build against deployed backend

### 6. Final Contract Test Pass
- [ ] `npm run test:contract` passes against the deployed backend (smoke test)
- [ ] All 7 `debugScenario` values return controlled responses
- [ ] Invalid provider config returns controlled errors (not stack traces)

---

## Environment Variables Reference

See `backend/.env.example` for the full list.

### Critical for Production

| Variable | Required in Production | Notes |
|---|---|---|
| `NODE_ENV` | Yes | Must be `production` |
| `PORT` | Yes | Match deployment platform port |
| `HOST` | Yes | Usually `0.0.0.0` for containers |
| `ALLOWED_ORIGINS` | Yes | Comma-separated Flutter app origins |
| `PUBLIC_BACKEND_URL` | Yes | HTTPS URL for Flutter to call |
| `OCR_PROVIDER` | Yes | Must be a real provider (not `mock_ocr`) |
| `ANALYSIS_PROVIDER` | Yes | Must be a real provider (not `mock_ai`) |
| `PROVIDER_MODE` | Yes | `china` or `global` for production use |
| `PROVIDER_TIMEOUT_MS` | Recommended | Prevent hanging calls |
| `PROVIDER_MAX_RETRIES` | Recommended | 0 for launch, 1-2 after stabilising |

---

## What "productionReady: false" Means

The `/health` endpoint returns `productionReady: false` until:

1. At least one real OCR provider is configured and working
2. At least one real analysis provider is configured and working
3. CORS enforcement is implemented ✅ (Completed in Phase 11C)
4. Rate limiting and cost guards are enforced
5. Logging redaction is wrapped on all provider request/response logging
6. Contract tests pass with real providers

While `productionReady: false`, the backend is safe for local development and testing, but **must not** be exposed to real users.

---

## Deployment Platform Notes

### Recommended Platforms
- **Google Cloud Run**: Good for containerised Node.js, automatic HTTPS
- **Fly.io**: Simple container deployment with global edge
- **Render**: Easy Node.js deployment with free tier
- **Heroku**: Classic PaaS, straightforward environment variable management

### Platform-Agnostic Requirements
- Must support setting environment variables
- Must support health check endpoints (`GET /health`)
- Must provide HTTPS (either natively or via a load balancer)
- Must allow CORS configuration (no wildcard `*` in production)

---

## Current Mock Backend Behaviour (Preserved)

All existing behaviour is preserved in Phase 11C:

- `GET /health` → returns extended metadata (new fields: `corsEnforcementReady`, `requestBodyLimitBytes`, `requestBodyLimitReady`)
- `POST /api/analyze-menu` with `{}` → returns mock dishes
- `providerMode: mock` → mock path, no fallback
- `providerMode: china/global/auto` → safely resolves to mock with fallback metadata
- All 7 `debugScenario` values → controlled mock behaviour
- Invalid JSON → `BAD_REQUEST` with no stack trace
- Invalid `OCR_PROVIDER` / `ANALYSIS_PROVIDER` → controlled error codes
- Oversized request body → `413` with `REQUEST_BODY_TOO_LARGE` controlled envelope

---

## Next Phases

After Phase 11C, the recommended next steps are:

1. **Phase 12**: Real provider skeleton activation (Qwen OCR or Google Vision)
2. **Phase 13**: Real analysis provider activation (Qwen analysis or DeepSeek)
3. **Phase 14**: Cost guards and rate limiting enforcement
4. **Phase 15**: Production deployment dry run (staging environment)
5. **Phase 16**: Flutter production backend URL configuration
6. **Phase 17**: Full integration test with real providers

---

## Contact / History

- Phase 11B implemented by: AI assistant
- Phase 11C implemented by: AI assistant
- Date: 2026-06-13
- Tags: `phase-11b-backend-deployment-readiness-skeleton`, `phase-11c-cors-and-body-limit-enforcement`
