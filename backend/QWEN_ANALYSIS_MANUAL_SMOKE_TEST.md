# Qwen Analysis Manual Smoke Test

This document explains how to manually test the real Qwen analysis transport
using a local `.env` file. Automated tests remain offline — this is for
manual verification only.

**⚠️ Important:** Never commit `.env`. Never put real API keys in tests or
source code. Never expose API keys to Flutter.

---

## Prerequisites

1. A valid DashScope API key (format: `sk-...`)
2. The backend server running locally
3. `curl` or any HTTP client

---

## Step 1 — Create backend/.env

Create `backend/.env` in the project root's backend directory:

```bash
cd backend
# Create backend/.env with your real API key:
```

The `.env` file should contain:

```env
# Qwen Analysis Provider Gates
ANALYSIS_PROVIDER=qwen_analysis
QWEN_ANALYSIS_PROVIDER_ENABLED=true
QWEN_API_KEY=sk-your-real-dashscope-api-key-here
QWEN_ANALYSIS_MODEL=qwen-max
QWEN_ANALYSIS_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions

# Optional safety config
PROVIDER_TIMEOUT_MS=15000

# NOTE: Replace sk-your-real-dashscope-api-key-here with your actual key.
# NEVER commit this file.
```

Verify it's git-ignored:

```bash
git check-ignore backend/.env
# Should output: backend/.env
```

If not ignored, add `backend/.env` to `.gitignore`.

---

## Step 2 — Verify env gates

Ensure the following are set:

| Env Var | Required Value |
|---|---|
| `ANALYSIS_PROVIDER` | `qwen_analysis` |
| `QWEN_ANALYSIS_PROVIDER_ENABLED` | `true` |
| `QWEN_API_KEY` | `sk-...` (your real key, min 20 chars) |
| `QWEN_ANALYSIS_MODEL` | `qwen-max` (or custom) |
| `QWEN_ANALYSIS_BASE_URL` | DashScope URL (or custom) |

---

## Step 3 — Start the backend

```bash
cd backend
npm run dev
```

Verify health:

```bash
curl -s http://localhost:3000/health | jq .
```

Expected response shows `mock_ai` as active for default routes.
The Qwen analysis provider is available but must be explicitly requested.

---

## Step 4 — Test with a sample OCR text request

Send a POST to the analyze endpoint with OCR text:

```bash
curl -s -X POST http://localhost:3000/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{
    "ocrText": "Tonkotsu Ramen - 850 yen\nMiso Ramen - 750 yen\nGyoza (6pc) - 400 yen\nMatcha Ice Cream - 500 yen",
    "userHomeCurrency": "CNY",
    "scan": {
      "localCurrency": "JPY"
    }
  }' | jq .
```

**Expected success response shape:**

```json
{
  "provider": "qwen_analysis",
  "mode": "analysis",
  "confidence": 0.85,
  "dishes": [
    {
      "id": "dish_...",
      "name": "Tonkotsu Ramen",
      "description": "...",
      "recommendationScore": 85,
      "matchReasons": [...],
      "riskFlags": [...],
      "allergens": [...],
      "spiceLevel": null,
      "estimatedPrice": 850,
      "currency": "JPY",
      "valueRating": "Good Value",
      "safetyNotes": [...],
      "confidence": 0.9,
      "dishName": "Tonkotsu Ramen",
      "ingredients": [...],
      "tasteScore": 85,
      "safetyScore": ...,
      "valueScore": ...,
      "recommendationReason": "...",
      "priceIntelligence": {
        "localPrice": 850,
        "localCurrency": "JPY",
        "homePrice": ...,
        "homeCurrency": "CNY",
        "exchangeRate": ...,
        "assessment": "Good Value"
      }
    }
  ],
  "warnings": [],
  "rawMetadata": {
    "totalTokens": ...
  }
}
```

---

## Step 5 — Confirm response fields

- [ ] `provider` is `"qwen_analysis"`
- [ ] `mode` is `"analysis"`
- [ ] `confidence` is between 0 and 1
- [ ] `dishes` is a non-empty array
- [ ] Each dish has both standardized fields (`id`, `name`, `recommendationScore`) and backward-compatible fields (`dishName`, `tasteScore`, `priceIntelligence`)
- [ ] `warnings` is an array of known codes
- [ ] `rawMetadata` is safe (no API keys, no raw prompts, no raw responses)
- [ ] No stack traces in response
- [ ] No provider internals in response

---

## Step 6 — Turn it back off

To disable Qwen analysis and revert to mock:

1. Delete or comment out the Qwen lines in `backend/.env`:

```env
# ANALYSIS_PROVIDER=qwen_analysis
# QWEN_ANALYSIS_PROVIDER_ENABLED=true
```

Or set `QWEN_ANALYSIS_PROVIDER_ENABLED=false`:

```env
QWEN_ANALYSIS_PROVIDER_ENABLED=false
```

2. Restart the backend:

```bash
npm run dev
```

3. Verify health again — `mock_ai` should be the active analysis provider.

---

## Error cases to verify

Test that errors are handled safely:

**Without API key:**
```bash
curl -s -X POST http://localhost:3000/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{"ocrText": "test"}' | jq .
```
Expected: error with code `ANALYSIS_PROVIDER_NOT_CONFIGURED`.

**Invalid request (empty):**
```bash
curl -s -X POST http://localhost:3000/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
```
Expected: controlled error, no stack trace, no secrets.

---

## Safety checklist

- [ ] API key is only in `backend/.env` (never committed)
- [ ] `git status` does not show `backend/.env` as tracked
- [ ] Error responses never include stack traces
- [ ] Error responses never include raw API responses
- [ ] Error responses never include API keys or secrets
- [ ] Health endpoint shows `mock_ai` when Qwen is disabled
- [ ] Flutter UI continues to work with mock provider
