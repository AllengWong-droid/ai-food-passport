# AI Food Passport Backend Mock Skeleton

## Purpose

This folder contains a minimal mock backend proxy skeleton for AI Food Passport. It prepares the shape of a future server that can protect API keys, run OCR-first routing, and call OCR/AI providers from a trusted backend.

Flutter uses local `MockAiRepository` by default. Developer Backend Mock Mode can optionally call this server during local testing. Flutter's developer selector uses `normal` for the default success scenario and sends no `debugScenario` field in that case.

## What Is Implemented

- Local Node.js HTTP server using built-in Node modules.
- `GET /health`.
- `POST /api/analyze-menu`.
- OCR-first mock pipeline:
  - mock OCR provider
  - mock menu analysis provider
  - standardized API envelope
- Mock OCR debug scenarios for success, low confidence, empty text, and OCR failure.
- Mock analysis debug scenarios for success, low quality, empty result, and analysis failure.
- Deterministic mock response shaped like the future backend response.
- Standardized `ok`, `data`, and `error` API envelope.
- Mock dish results with `priceIntelligence`.
- CORS headers for local Flutter Web development origins.

## What Is Not Implemented

- No real OCR.
- No Qwen OCR, Google Vision, Azure OCR, Tesseract, or OpenAI Vision.
- No real Qwen calls.
- No real DeepSeek calls.
- No real OpenAI calls.
- No real exchange-rate API.
- No Firebase.
- No production authentication.
- No provider health checks.
- No production fallback routing.
- No API keys or secrets.

## Install Dependencies

No runtime dependencies are required beyond Node.js 18 or newer.

```bash
cd backend
npm install
```

## Run Local Server

```bash
cd backend
npm run dev
```

or:

```bash
cd backend
npm start
```

Default URL:

```text
http://localhost:8787
```

You can override the port:

```bash
PORT=8790 npm start
```

## Health Check

```powershell
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8787/health"
```

Response shape:

```json
{
  "ok": true,
  "service": "ai-food-passport-backend",
  "mode": "mock",
  "ocrProvider": "mock_ocr",
  "analysisProvider": "mock_ai",
  "timestamp": "2026-06-13T00:00:00.000Z"
}
```

## Analyze Menu Endpoint

```text
POST /api/analyze-menu
```

PowerShell smoke test:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body "{}"
```

## Example Success Response Shape

```json
{
  "ok": true,
  "data": {
    "routing": {
      "mode": "mock",
      "ocrProvider": "mock_ocr",
      "ocrMode": "mock",
      "ocrConfidence": 0.98,
      "ocrWarnings": [],
      "analysisProvider": "mock_ai",
      "analysisMode": "mock",
      "analysisConfidence": 0.96,
      "analysisWarnings": [],
      "warnings": [],
      "fallbackUsed": false,
      "latencyMs": 2
    },
    "ocr": {
      "provider": "mock_ocr",
      "mode": "mock",
      "text": "Tonkotsu Ramen JPY 980\nMiso Katsu Skewers JPY 800",
      "languageHints": ["ja"],
      "confidence": 0.98,
      "warnings": []
    },
    "dishes": [
      {
        "dishName": "Tonkotsu Ramen",
        "description": "Rich pork broth with noodles, egg, scallion, and sliced chashu.",
        "ingredients": ["Pork broth", "Wheat noodles", "Egg", "Scallion", "Chashu"],
        "allergens": ["Wheat", "Egg"],
        "tasteScore": 96,
        "safetyScore": 84,
        "valueScore": 86,
        "recommendationReason": "Mock backend selected this because OCR-first text matched a savory, umami-forward menu item.",
        "priceIntelligence": {
          "localPrice": 980,
          "localCurrency": "JPY",
          "homePrice": 6.1,
          "homeCurrency": "EUR",
          "exchangeRate": 0.00622,
          "assessment": "Fair"
        }
      }
    ]
  },
  "error": null,
  "routing": {
    "mode": "mock",
    "ocrProvider": "mock_ocr",
    "ocrMode": "mock",
    "ocrConfidence": 0.98,
    "ocrWarnings": [],
    "analysisProvider": "mock_ai",
    "analysisMode": "mock",
    "analysisConfidence": 0.96,
    "analysisWarnings": [],
    "warnings": [],
    "fallbackUsed": false,
    "latencyMs": 2
  },
  "dishes": [
    {
      "dishName": "Tonkotsu Ramen"
    }
  ]
}
```

The top-level `routing` and `dishes` fields mirror `data.routing` and `data.dishes` temporarily for Flutter adapter backwards compatibility.

## OCR-First Provider Skeleton

The current route is structured as:

```text
POST /api/analyze-menu
-> mock OCR provider
-> mock menu analysis provider
-> standardized response envelope
```

Current provider files:

- `src/providers/ocr/mockOcrProvider.js`
- `src/providers/ocr/ocrProviderTypes.js`
- `src/providers/analysis/mockMenuAnalysisProvider.js`
- `src/providers/analysis/analysisProviderTypes.js`

The OCR provider returns deterministic local text and metadata. It does not read real images or call any external OCR service. The analysis provider uses that mock OCR result to create deterministic dish recommendations and price intelligence.

## Mock OCR Debug Scenarios

`POST /api/analyze-menu` accepts an optional `debugScenario` field for local testing. Omitting it is equivalent to Flutter's `normal` scenario.

- `ocr_success`: default successful mock OCR flow.
- `ocr_low_confidence`: returns OCR text with confidence `0.42`, keeps `ok: true`, and includes `LOW_OCR_CONFIDENCE`.
- `ocr_empty_text`: returns a clean `OCR_EMPTY_TEXT` error envelope.
- `ocr_failure`: simulates an OCR provider failure and returns a clean `OCR_FAILED` error envelope.

Default success:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body "{}"
```

Low confidence:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"ocr_low_confidence"}'
```

Empty OCR text:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"ocr_empty_text"}'
```

OCR failure:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"ocr_failure"}'
```

Low-confidence success shape:

```json
{
  "ok": true,
  "data": {
    "routing": {
      "ocrConfidence": 0.42,
      "ocrWarnings": ["LOW_OCR_CONFIDENCE"],
      "warnings": ["LOW_OCR_CONFIDENCE"]
    },
    "ocr": {
      "confidence": 0.42,
      "warnings": ["LOW_OCR_CONFIDENCE"]
    },
    "dishes": []
  },
  "error": null
}
```

Empty text response shape:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "OCR_EMPTY_TEXT",
    "message": "Could not find readable menu text.",
    "details": null
  }
}
```

OCR failure response shape:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "OCR_FAILED",
    "message": "Could not read the menu image.",
    "details": null
  }
}
```

## Mock Analysis Debug Scenarios

The same `debugScenario` field also supports analysis-layer simulations:

- `analysis_success`: default successful mock analysis flow.
- `analysis_low_quality`: returns dishes with analysis confidence `0.55` and warnings.
- `analysis_empty_result`: returns `ok: true`, `dishes: []`, and `ANALYSIS_EMPTY_RESULT` warning metadata.
- `analysis_failure`: simulates an analysis provider failure and returns a clean `ANALYSIS_FAILED` error envelope.

Low quality:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"analysis_low_quality"}'
```

Empty analysis result:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"analysis_empty_result"}'
```

Analysis failure:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8787/api/analyze-menu" `
  -ContentType "application/json" `
  -Body '{"debugScenario":"analysis_failure"}'
```

Low-quality success shape:

```json
{
  "ok": true,
  "data": {
    "routing": {
      "analysisConfidence": 0.55,
      "analysisWarnings": ["LOW_ANALYSIS_CONFIDENCE", "NEEDS_REVIEW"],
      "warnings": ["LOW_ANALYSIS_CONFIDENCE", "NEEDS_REVIEW"]
    },
    "dishes": []
  },
  "error": null
}
```

Empty analysis result shape:

```json
{
  "ok": true,
  "data": {
    "routing": {
      "analysisConfidence": 0,
      "analysisWarnings": ["ANALYSIS_EMPTY_RESULT"],
      "warnings": ["ANALYSIS_EMPTY_RESULT"]
    },
    "dishes": []
  },
  "error": null,
  "dishes": []
}
```

Analysis failure shape:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "ANALYSIS_FAILED",
    "message": "Could not analyze the menu.",
    "details": null
  }
}
```

## Error Response Shape

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Request body must be valid JSON.",
    "details": null
  }
}
```

Unknown routes return the same envelope with `NOT_FOUND`.

## CORS

The mock server allows local Flutter Web development origins such as:

- `http://localhost:<port>`
- `http://127.0.0.1:<port>`

This is a local development convenience only. It is not a production CORS or authentication policy.

## Security Notes

- `.env` is ignored by Git.
- `.env.example` contains empty placeholder names only.
- Do not put real provider keys in Flutter.
- Future real provider calls should happen only from backend code.
- This mock backend contains no API keys or secrets.

## Future Steps

- Real backend proxy implementation.
- Real OCR adapter.
- Qwen, DeepSeek, and OpenAI provider adapters.
- Provider health checks.
- Fallback routing.
- Real exchange rates.
- Production authentication and rate limiting.
