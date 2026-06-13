# Deployment Target Comparison — AI Food Passport Backend

> **Status**: Analysis and recommendation only. No deployment has been performed.
> **Date**: 2026-06-13
> **Phase**: 13A

---

## Summary Recommendation

**Render** is the recommended first deployment target for the AI Food Passport backend MVP.

Render offers the best balance of:
- True ongoing free tier (750 h/month)
- Zero-code-change Node.js HTTP server deployment
- Free managed TLS + custom domain
- Simple env-var secret handling
- Built-in health checks
- Acceptable China latency (~178 ms)
- Free Postgres database for future data persistence needs

The only meaningful trade-off is a 15-minute idle sleep with ~30-second cold-start wake-up. This is acceptable for a TestFlight MVP with low traffic and can be mitigated with an external uptime monitor (e.g., UptimeRobot free tier).

---

## Platform Comparison Matrix

| Dimension               | Render Free                     | Railway (Free / Hobby)          | Fly.io Free                    | VPS ($4–6/mo)                  | Cloudflare Workers             |
|--------------------------|----------------------------------|----------------------------------|--------------------------------|--------------------------------|--------------------------------|
| **Cost (MVP scale)**     | $0/month                        | $0 trial (30 days), then $1/mo (extremely limited) | $0/month (3 VMs) | $4–6/month                   | $0/month (100k req/day)       |
| **Free tier longevity**  | Permanent free tier              | Trial only (no meaningful ongoing free tier) | Permanent (3 VMs) | None                        | Permanent free tier            |
| **Credit card required** | Yes                              | Yes                              | Yes                            | Yes                            | No                             |
| **Node.js deployment**   | Git push / direct upload         | Git push / Dockerfile            | Dockerfile + fly.toml          | Manual (SSH + PM2/Docker)      | Framework rewrite needed (Hono) |
| **HTTPS / TLS**          | Free auto-managed                | Free auto-managed                | Free auto-managed              | Manual (certbot / acme.sh)     | Free auto-managed              |
| **Custom domain**        | Free                             | Free                             | Free                           | Manual DNS config              | Free                           |
| **Env var secrets**      | Web dashboard / render.yaml      | Web dashboard / railway.json     | `fly secrets set` CLI           | Manual (.env on server)        | Web dashboard / wrangler.toml  |
| **Health checks**        | Built-in (HTTP GET on /health)   | Built-in                         | Built-in                       | Manual (systemd / monit)       | Built-in                       |
| **Logs**                 | Web dashboard                    | Web dashboard + CLI              | `fly logs` CLI                 | Manual (journalctl / PM2)      | `wrangler tail`                |
| **Sleep / cold start**   | 15 min idle → ~30s wake-up       | No sleep (usage-based stop)      | No sleep (VMs run continuously) | No sleep (always on)          | No sleep (5ms cold start)      |
| **China latency**        | ~178 ms                          | ~200–300 ms                     | ~100–200 ms (SG/Tokyo)         | Varies by provider (CN: ~30ms) | ~189 ms                        |
| **China accessibility**  | Accessible, moderate speed       | Accessible, slower               | Accessible, best with SG node  | Best if Chinese provider       | Accessible, moderate speed     |
| **Postgres / DB**        | Free 1 GB (30-day expiry, upgradable) | Paid only ($ add-on)         | Paid Postgres add-on           | Manual install                 | D1 (SQLite, free tier)         |
| **Build pipeline**       | 500 min/month free               | Included in credits              | Local build + push image       | Manual                         | 500 builds/month free          |
| **Suitable for MVP/TestFlight** | **Yes — best choice**       | No (no real free tier)           | Yes (higher complexity)        | Yes (but costs money)          | No (needs framework rewrite)   |

---

## Platform Details

### 1. Render (Recommended)

**URL**: https://render.com

**Free tier includes**:
- 750 instance hours/month (one service running 24/7 uses ~720 h)
- 100 GB bandwidth/month
- 500 build minutes/month
- Free managed TLS certificates
- Free custom domain
- Free Postgres database (1 GB, 30-day expiry, can upgrade to keep data)
- Built-in health checks (HTTP GET on configurable endpoint)
- Web dashboard for logs, env vars, deploys
- Git-push or direct-upload deploy

**Sleep behavior**:
- Web service sleeps after 15 minutes of no inbound HTTP traffic
- Wake-up takes ~30 seconds on next request
- Mitigation: UptimeRobot (free) pings /health every 5 minutes to prevent sleep

**China considerations**:
- Accessible from China (~178 ms average)
- No special China-optimized nodes, but consistently reachable
- No GFW-related blocking reported

**Why recommended for MVP**:
1. True free tier — no cost during TestFlight alpha/beta
2. Zero code changes — our Node.js backend runs as-is
3. env vars managed through secure dashboard
4. Free Postgres available when we need persistence
5. Simple rollback (one-click deploy rollback)
6. Paid plans start at $7/month when ready to scale

**Node.js deployment example**:
```yaml
# render.yaml (optional, can also configure via dashboard)
services:
  - type: web
    name: ai-food-passport-api
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && node src/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: OCR_PROVIDER
        value: mock_ocr
      - key: ANALYSIS_PROVIDER
        value: mock_ai
```

---

### 2. Railway

**URL**: https://railway.com

**Free tier**:
- $5 one-time trial credit (30 days)
- After trial: $1/month credit (extremely limited — only supports one tiny service)
- Essentially no meaningful ongoing free tier

**Advantages**:
- Very simple deployment (connect GitHub repo)
- Good developer experience
- Built-in env var management
- Free TLS + custom domain

**Disadvantages for MVP**:
- No real ongoing free tier — costs begin immediately after trial
- Hobby plan ($5/month) required for any real usage
- Slower from China (~200–300 ms)
- Requires credit card

**Verdict**: Not recommended for MVP due to lack of viable free tier.

---

### 3. Fly.io

**URL**: https://fly.io

**Free tier**:
- 3 shared-CPU VMs (256 MB RAM each)
- 3 GB persistent storage
- 160 GB outbound bandwidth/month
- VMs run continuously (no sleep)
- Free TLS + custom domain

**Advantages**:
- Permanent free tier with decent resources
- VMs don't sleep
- Better China latency with Singapore/Tokyo nodes (~100–200 ms)
- `fly logs` for real-time log access

**Disadvantages for MVP**:
- Requires credit card (Chinese-issued cards often fail verification)
- Docker-based deployment (more complex than git-push)
- Requires `fly.toml` configuration
- Steeper learning curve
- 256 MB RAM may be tight for Node.js with memory-intensive operations

**Verdict**: Good alternative if Render doesn't work out, but higher friction for initial setup.

---

### 4. VPS (Virtual Private Server)

**Providers**: DigitalOcean, Vultr, Alibaba Cloud (阿里云), Tencent Cloud (腾讯云)

**Cost**: $4–6/month for basic tier (1 vCPU, 1 GB RAM)

**Advantages**:
- Full control over the environment
- No sleep/startup issues
- Chinese providers offer excellent China latency (~30 ms)
- No platform-specific limitations
- Can run any software (Redis, Postgres, Nginx locally)

**Disadvantages for MVP**:
- Costs money (no free tier)
- Manual setup: Nginx reverse proxy, SSL certificates, PM2/Docker, firewall, OS updates
- Manual health checks and monitoring
- Manual log rotation and management
- Higher maintenance burden

**Best Chinese VPS option**:
- Alibaba Cloud 轻量应用服务器: ~¥34/month (2 vCPU, 2 GB RAM, 50 GB SSD)
- Excellent China accessibility
- One-click Node.js image available

**Verdict**: Best for China-focused production, but overkill and costly for initial MVP.

---

### 5. Cloudflare Workers

**URL**: https://workers.cloudflare.com

**Free tier**:
- 100,000 requests/day
- 10 ms CPU time per request
- 128 MB RAM per isolate
- 1 MB code bundle size
- 320+ global edge nodes

**Advantages**:
- Excellent global latency (5 ms cold start)
- True free tier with generous limits
- No credit card required
- Built-in TLS + custom domain
- Edge caching and routing

**Disadvantages for MVP**:
- **Requires framework rewrite**: Our backend uses Node.js `http.createServer` and Express-style patterns; Workers require Hono or similar Workers-native framework
- No `node:fs` — our backend uses filesystem (test logs, OCR cache)
- No `node:child_process` — our dry-run tests and some util scripts rely on spawning processes
- 128 MB RAM limit — may be tight for AI-related operations
- 1 MB bundle limit (free) — may not fit larger dependencies
- Not suitable for long-running requests (AI provider calls may timeout)

**Verdict**: Not suitable for this backend without significant architecture changes. Could be revisited later as an edge caching layer in front of the Node.js backend.

---

## Decision Matrix

| Criteria              | Weight | Render | Railway | Fly.io | VPS   | Cloudflare |
|-----------------------|--------|--------|---------|--------|-------|------------|
| Free tier viability   | High   | ★★★★★   | ★★☆☆☆    | ★★★★☆   | ★☆☆☆☆  | ★★★★☆       |
| Ease of Node.js deploy| High   | ★★★★★   | ★★★★★    | ★★★☆☆   | ★★☆☆☆  | ★☆☆☆☆       |
| China accessibility   | Medium | ★★★☆☆   | ★★☆☆☆    | ★★★★☆   | ★★★★★  | ★★★☆☆       |
| Secret/env handling   | High   | ★★★★★   | ★★★★★    | ★★★★☆   | ★★☆☆☆  | ★★★★☆       |
| Health checks         | Medium | ★★★★★   | ★★★★☆    | ★★★★☆   | ★★★☆☆  | ★★★★★       |
| Cost at scale         | Medium | ★★★☆☆   | ★★★☆☆    | ★★★☆☆   | ★★★★☆  | ★★★★★       |
| **Overall**           |        | **4.4** | **3.4**   | **3.6**  | **2.8** | **3.2**      |

---

## Migration Path

```
Phase 13A (now)     → Render free tier (MVP / TestFlight alpha)
Phase 17 (later)    → Render paid ($7–19/mo) for production
Phase 18 (optional) → Add Fly.io multi-region for better China latency
Phase 19 (optional) → Alibaba Cloud VPS for dedicated China deployment
```

---

## What This Phase Does NOT Do

- ❌ No deployment has been performed
- ❌ No Render/Fly.io/Railway account has been created
- ❌ No production environment variables have been set
- ❌ No domain has been purchased or configured
- ❌ No real API keys have been added
- ❌ `productionReady` remains `false`

---

## Phase 13B: Render.yaml and Dry-Run Checklist (2026-06-13)

### What Was Added

1. **`backend/render.yaml`** — Render Blueprint (Infrastructure-as-Code) template
   - Safe placeholder-only values (no secrets)
   - `QWEN_API_KEY` intentionally absent
   - Real providers disabled by default (`QWEN_OCR_PROVIDER_ENABLED=false`, `QWEN_ANALYSIS_PROVIDER_ENABLED=false`)
   - `healthCheckPath: /health` configured
   - `autoDeployTrigger: 'off'` (safe default)
   - `sync: false` used for `ALLOWED_ORIGINS` and `PUBLIC_BACKEND_URL` (prompted on first create)

2. **`backend/RENDER_DEPLOYMENT_DRY_RUN.md`** — Comprehensive dry-run checklist
   - Part 0: Blueprint vs. Manual Dashboard setup decision
   - Part 1: Local preflight commands (all tests, /health, CORS, secret scan)
   - Part 2: Render Dashboard manual setup values reference
   - Part 3: First deploy smoke tests (mock providers only)
   - Part 4: Verify real providers remain disabled
   - Part 5: Future steps to enable real Qwen providers (after key is available)
   - Part 6: Rollback plan (Render Dashboard + env var revert)
   - Part 7: Render free tier caveats and mitigations

### render.yaml Decision: Why It Is Committed

The `render.yaml` file is committed to the repo as a **reference/documentation file**, NOT to enable automatic Blueprint sync. Reasons:

1. Documents the intended Render configuration in version control
2. Can be used for future Blueprint sync (with `autoDeployTrigger: 'off'`)
3. Serves as a template for other contributors
4. `QWEN_API_KEY` is intentionally absent — must be set in Dashboard

**Recommended first deploy method**: Manual Dashboard Setup (see `RENDER_DEPLOYMENT_DRY_RUN.md` Part 0)

### Files Added

| File | Status | Description |
|------|--------|-------------|
| `backend/render.yaml` | New | Render Blueprint template (safe values only) |
| `backend/RENDER_DEPLOYMENT_DRY_RUN.md` | New | Dry-run checklist (8 parts) |

### render.yaml Key Configuration

```yaml
services:
  - type: web
    name: ai-food-passport-backend
    runtime: node
    plan: free
    region: oregon
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /health
    autoDeployTrigger: 'off'
    envVars:
      - key: NODE_ENV
        value: production
      - key: OCR_PROVIDER
        value: mock_ocr          # ← real providers OFF by default
      - key: ANALYSIS_PROVIDER
        value: mock_ai           # ← real providers OFF by default
      - key: QWEN_OCR_PROVIDER_ENABLED
        value: 'false'
      - key: QWEN_ANALYSIS_PROVIDER_ENABLED
        value: 'false'
      # QWEN_API_KEY is NOT here — set manually in Dashboard
```

### Next Steps (When Ready to Deploy)

1. Push `backend/` code to GitHub
2. Follow `RENDER_DEPLOYMENT_DRY_RUN.md` Part 0 → choose Manual Setup
3. Follow Part 1 → run all local preflight checks
4. Follow Part 2 → configure Render Dashboard
5. Follow Part 3 → first deploy with mock providers only
6. Only after mock deploy succeeds → Part 5 (enable real Qwen providers)
