# AI Food Passport Backend Mock Skeleton

## Purpose

This folder contains a minimal mock backend proxy skeleton for AI Food Passport. It prepares the shape of a future server that can protect API keys, run OCR-first routing, and call OCR/AI providers from a trusted backend.

Flutter uses local `MockAiRepository` by default. Developer Backend Mock Mode can optionally call this server during local testing.

## What Is Implemented

- Local Node.js HTTP server using built-in Node modules.
- `GET /health`.
- `POST /api/analyze-menu`.
- OCR-first mock pipeline:
  - mock OCR provider
  - mock menu analysis provider
  - standardized API envelope
- Deterministic mock response shaped like the future backend response.
- Standardized `ok`, `data`, and `error` API envelope.
- Mock routing metadata:
  - `mode: mock`
  - `ocrProvider: mock_ocr`
  - `analysisProvider: mock_ai`
  - `fallbackUsed: false`
  - `latencyMs`
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
- No fallback routing.
- No API keys or secrets.

## Install Dependencies

No runtime dependencies are required beyond Node.js 18 or newer.

```bash
cd backend
npm install
```

`npm install` is optional today because the mock server has no package dependencies, but it is safe to run and prepares the folder for future backend packages.

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

## Example Curl Request

```bash
curl -X POST http://localhost:8787/api/analyze-menu \
  -H "Content-Type: application/json" \
  -d '{
    "ocrResult": {
      "rawText": "Tonkotsu ramen 980 JPY",
      "detectedLanguage": "Japanese"
    },
    "tastePassport": {
      "travelStyle": "standard",
      "dietaryPreferences": ["Mild spice"],
      "allergies": ["Egg"],
      "tastePreferences": ["Umami"]
    },
    "scan": {
      "restaurantCountry": "Japan",
      "restaurantCity": "Tokyo",
      "localCurrency": "JPY"
    },
    "userHomeCountry": "Germany",
    "userHomeCurrency": "EUR"
  }'
```

## Example Response Shape

```json
{
  "ok": true,
  "data": {
    "routing": {
      "mode": "mock",
      "ocrProvider": "mock_ocr",
      "ocrMode": "mock",
      "ocrConfidence": 0.98,
      "analysisProvider": "mock_ai",
      "analysisMode": "mock",
      "fallbackUsed": false,
      "latencyMs": 2
    },
    "ocr": {
      "provider": "mock_ocr",
      "mode": "mock",
      "text": "Tonkotsu Ramen ¥980\nMiso Katsu Skewers ¥800",
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
        "recommendationReason": "Mock backend selected this because it fits a savory, umami-forward traveler profile.",
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
    "analysisProvider": "mock_ai",
    "analysisMode": "mock",
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

The top-level `routing` and `dishes` fields mirror `data.routing` and `data.dishes` temporarily for Flutter adapter backwards compatibility. The shortened top-level dish above represents the same dish object from `data.dishes`.

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
