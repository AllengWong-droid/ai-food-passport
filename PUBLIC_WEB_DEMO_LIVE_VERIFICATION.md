# Public Web Demo Live Verification

## 1. Purpose

Verify that the deployed public Flutter Web demo is actually live and usable from GitHub Pages after the Phase 26A deployment.

- **Date performed:** 2026-06-15
- **Phase:** 26B
- **Deployment commit:** `c5e2ed3` (Deploy public Flutter web demo)

---

## 2. URLs Checked

| # | URL | Type | Service |
|---|---|---|---|
| 1 | `https://allengwong-droid.github.io/ai-food-passport/demo/` | Public Demo | GitHub Pages |
| 2 | `https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html` | Privacy Policy | GitHub Pages |
| 3 | `https://ai-food-passport.onrender.com/health` | Backend Health | Render |
| 4 | `https://ai-food-passport.onrender.com/api/analyze-menu` | API Endpoint | Render |

---

## 3. HTTP Results

### 3.1 Public Demo URL

```
curl.exe -I https://allengwong-droid.github.io/ai-food-passport/demo/
```

| Field | Value |
|---|---|
| **Status** | `HTTP/1.1 200 OK` |
| **Content-Type** | `text/html; charset=utf-8` |
| **Content-Length** | `1542` |
| **Server** | `GitHub.com` |
| **Last-Modified** | `Mon, 15 Jun 2026 06:03:31 GMT` |
| **Cache-Control** | `max-age=600` |
| **Redirect** | None (direct 200) |
| **CORS** | `Access-Control-Allow-Origin: *` |
| **HSTS** | `max-age=31556952` |

**Full content check:**

```
curl.exe -L https://allengwong-droid.github.io/ai-food-passport/demo/ --max-time 30
```

- ✅ `<!DOCTYPE html>` present
- ✅ `<base href="/ai-food-passport/demo/">` — correct base-href
- ✅ `flutter.js` and `main.dart.js` references present
- ✅ iOS meta tags present (`mobile-web-app-capable`, `apple-mobile-web-app-title`)
- ✅ `icons/Icon-192.png` referenced

**Verdict: ✅ LIVE — Demo index page is serving correctly from GitHub Pages.**

### 3.2 Privacy Policy URL

```
curl.exe -I https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html
```

| Field | Value |
|---|---|
| **Status** | `HTTP/1.1 200 OK` |
| **Content-Type** | `text/html; charset=utf-8` |
| **Content-Length** | `14262` |
| **Server** | `GitHub.com` |
| **Last-Modified** | `Mon, 15 Jun 2026 06:03:31 GMT` |
| **Cache-Control** | `max-age=600` |
| **Redirect** | None (direct 200) |
| **CORS** | `Access-Control-Allow-Origin: *` |

**Verdict: ✅ LIVE — Privacy policy page is serving correctly from GitHub Pages.**

### 3.3 Render Backend Health

```
curl.exe https://ai-food-passport.onrender.com/health
```

| Field | Value |
|---|---|
| **Status** | `HTTP/1.1 200 OK` |
| **Content-Type** | `application/json; charset=utf-8` |
| **Response Size** | `1573` bytes |
| **Server** | `cloudflare` (Render origin) |

**Key health fields:**

| Field | Value | Expected | Match |
|---|---|---|---|
| `ok` | `true` | `true` | ✅ |
| `service` | `ai-food-passport-backend` | — | ✅ |
| `mode` | `mock` | `mock` | ✅ |
| `ocrProvider` | `mock_ocr` | `mock_ocr` | ✅ |
| `realOcrEnabled` | `false` | `false` | ✅ |
| `analysisProvider` | `mock_ai` | `mock_ai` | ✅ |
| `realAnalysisEnabled` | `false` | `false` | ✅ |
| `realProvidersEnabled` | `false` | `false` | ✅ |
| `productionReady` | `false` | `false` | ✅ |
| `corsConfigured` | `true` | `true` | ✅ |
| `corsEnforcementReady` | `true` | `true` | ✅ |
| `logRedactionReady` | `true` | `true` | ✅ |
| `safeErrorEnvelopeReady` | `true` | `true` | ✅ |

**Verdict: ✅ LIVE — Render backend is healthy, mock-only, all safety flags correct.**

### 3.4 Backend API Endpoint (Sanity Check)

```
curl.exe -I https://ai-food-passport.onrender.com/api/analyze-menu
```

| Field | Value |
|---|---|
| **Status** | `HTTP/1.1 405 Method Not Allowed` |
| **Content-Type** | `application/json; charset=utf-8` |
| **Server** | `cloudflare` (Render origin) |

**Note:** `405 Method Not Allowed` on HEAD is **expected** — `/api/analyze-menu` only accepts `POST`. The server is responding, confirming the endpoint exists and is reachable. Real providers were **not** enabled during this check.

**Verdict: ✅ REACHABLE — Endpoint exists (POST-only, 405 on HEAD is correct behavior).**

---

## 4. Manual Browser Verification Checklist

> **✅ 手动验证已完成 (2026-06-15)** — 用户在所有 22 项检查通过后更新了状态。

### 4.1 Page Load

| # | Check | Status |
|---|---|---|
| 1 | Demo page opens at `https://allengwong-droid.github.io/ai-food-passport/demo/` | ✅ Verified |
| 2 | Flutter app loads (loading spinner → app UI) | ✅ Verified |
| 3 | No console errors (CORS, 404s, JS errors) | ✅ Verified |

### 4.2 Profile & Dietary Preferences

| # | Check | Status |
|---|---|---|
| 4 | Profile screen opens from bottom navigation | ✅ Verified |
| 5 | Dietary Preferences screen opens from Profile | ✅ Verified |
| 6 | Allergen grid renders (8 allergens) | ✅ Verified |
| 7 | Restriction list renders (5 restrictions) | ✅ Verified |
| 8 | Disclaimer banner visible | ✅ Verified |
| 9 | Toggle Wheat, Egg, Soy → saved (shared_preferences in Web uses localStorage) | ✅ Verified |

### 4.3 Mock Scan Flow

| # | Check | Status |
|---|---|---|
| 10 | Camera/Gallery opens or scan button triggers mock flow | ✅ Verified |
| 11 | Scan initiates (loading state visible) | ✅ Verified |
| 12 | Mock results appear (2 dishes expected) | ✅ Verified |
| 13 | Personalized allergen warning badge appears (matches Wheat/Egg/Soy) | ✅ Verified |
| 14 | Price intelligence card shows mock data | ✅ Verified |

### 4.4 Scan History

| # | Check | Status |
|---|---|---|
| 15 | Scan history entry appears after successful scan | ✅ Verified |
| 16 | Navigate to Profile → Scan History | ✅ Verified |
| 17 | History entry card shows dish count and timestamp | ✅ Verified |
| 18 | Tap history entry → results restore without backend re-call | ✅ Verified |
| 19 | Clear history works | ✅ Verified |
| 20 | Page refresh → history cleared (session-local) | ✅ Verified |

### 4.5 Privacy Policy

| # | Check | Status |
|---|---|---|
| 21 | `https://allengwong-droid.github.io/ai-food-passport/privacy-policy.html` still opens | ✅ Verified |
| 22 | Privacy policy content is readable and intact | ✅ Verified |

---

## 5. Known Limitations

| # | Limitation | Impact |
|---|---|---|
| 1 | **Render free backend cold start** | First scan may take 30-60 seconds while Render wakes up |
| 2 | **Scan history is session-local** | Lost on page refresh; no persistence in Web storage |
| 3 | **Backend is mock-only** | No real OCR or AI analysis; dish names and prices are deterministic mock data |
| 4 | **No real OCR/AI provider** | `realOcrEnabled: false`, `realAnalysisEnabled: false` confirmed |
| 5 | **Not production-ready** | `productionReady: false` confirmed |
| 6 | **No medical or allergy safety guarantee** | Mock data is for demo only; not a substitute for real allergen analysis |
| 7 | **GitHub Pages caching** | `Cache-Control: max-age=600` — updates take up to 10 minutes to propagate |
| 8 | **Web platform limitations** | Camera access may be restricted on some browsers; image picker fallback recommended |
| 9 | **Flutter Web Wasm** | Requires a modern browser with WebAssembly support (Chrome, Firefox, Edge, Safari 15+) |

---

## 6. Final Verdict

### Automated HTTP Verification: ✅ ALL PASS

| URL | Status | Result |
|---|---|---|
| Public Demo | HTTP 200 | ✅ Live |
| Privacy Policy | HTTP 200 | ✅ Live |
| Render Backend Health | HTTP 200 | ✅ Healthy, mock-only |
| API Endpoint (HEAD) | HTTP 405 | ✅ Reachable (POST-only, expected) |

### Overall: ✅ **LIVE VERIFIED (Automated + Manual Complete)**

The public demo, privacy policy, and mock backend are all confirmed live and serving correctly via automated HTTP checks. The `base-href` is correctly set to `/ai-food-passport/demo/`, all Render safety flags confirm mock-only mode, and the privacy policy is accessible.

**Manual browser verification: ✅ COMPLETED (22/22 checks passed) — 2026-06-15**

All 22 manual browser checks in Section 4 were completed by the user:
- Page load (3/3): demo page opens, Flutter app loads, no console errors
- Profile & dietary preferences (6/6): all screens render, allergen selection works, preferences saved
- Mock scan flow (5/5): scan/analyze works, 2 mock dishes returned, personalized allergen warning badge appears
- Scan history (6/6): entry created after scan, history restores without backend re-call, clear history works, session-local behavior confirmed
- Privacy policy (2/2): link opens, content intact

**No remaining manual checks. The public demo is fully verified.**

### Recommended Next Step

Phase 26C: GitHub Repository Configuration — GitHub UI-side settings (About text, Topics, website URL, LICENSE file, GitHub Release, pinned repository) that require web interface access to complete.
