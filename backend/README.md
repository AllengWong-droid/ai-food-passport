# AI Food Passport Backend Mock Skeleton

## Purpose

This folder contains a minimal mock backend proxy skeleton for AI Food Passport. It prepares the shape of a future server that can protect API keys, run OCR-first routing, and call OCR/AI providers from a trusted backend.

This backend is not wired to the Flutter app yet. The Flutter MVP Alpha still uses mock OCR and `MockAiRepository`.

## What Is Implemented

- Local Node.js HTTP server using built-in Node modules.
- `POST /api/analyze-menu`.
- Deterministic mock response shaped like the future backend response.
- Mock routing metadata:
  - `mode: mock`
  - `ocrProvider: mock_ocr`
  - `analysisProvider: mock_ai`
  - `fallbackUsed: false`
  - `latencyMs`
- Mock dish results with `priceIntelligence`.
- CORS headers for local development.

## What Is Not Implemented

- No real OCR.
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
  "routing": {
    "mode": "mock",
    "ocrProvider": "mock_ocr",
    "analysisProvider": "mock_ai",
    "fallbackUsed": false,
    "latencyMs": 2
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
}
```

## Security Notes

- `.env` is ignored by Git.
- `.env.example` contains empty placeholder names only.
- Do not put real provider keys in Flutter.
- Future real provider calls should happen only from backend code.

## Future Steps

- Real backend proxy implementation.
- Real OCR adapter.
- Qwen, DeepSeek, and OpenAI provider adapters.
- Provider health checks.
- Fallback routing.
- Real exchange rates.
- Production authentication and rate limiting.
