# Backend Proxy Spec: Future OpenAI Menu Analysis

## Purpose

AI Food Passport must never call OpenAI directly from Flutter with a secret API key. This document defines the future backend proxy contract for real menu analysis while the current MVP Alpha continues to use mock OCR and mock AI.

The expanded Phase 6A direction is OCR-first multi-provider routing. The backend proxy is expected to choose a China, global, auto, or mock route before returning the same structured dish response to Flutter.

## Why API Keys Must Stay On Backend

Flutter client code can be inspected, reverse engineered, or modified. Any OpenAI key shipped in the app would be exposed to users and attackers. The backend proxy must own all secret management, provider calls, rate limiting, request validation, logging, and abuse protection.

## Proposed Endpoint

`POST /api/analyze-menu`

The Flutter app will send typed menu analysis context to this endpoint. The backend will call the AI provider later and return structured dish analysis results.

## Request Body

```json
{
  "ocrResult": {
    "rawText": "Izakaya Gonpachi\nTonkotsu ramen 980 JPY",
    "detectedLanguage": "Japanese"
  },
  "tastePassport": {
    "travelStyle": "standard",
    "dietaryPreferences": ["Vegetarian-friendly", "Mild spice"],
    "allergies": ["Soy", "Shellfish", "Peanut"],
    "tastePreferences": ["Savory", "Mild", "Umami"]
  },
  "scan": {
    "restaurantCountry": "Japan",
    "restaurantCity": "Tokyo",
    "localCurrency": "JPY"
  },
  "userHomeCountry": "Germany",
  "userHomeCurrency": "EUR"
}
```

Required request fields:

- `ocrResult.rawText`
- `ocrResult.detectedLanguage`
- `tastePassport.travelStyle`
- `tastePassport.dietaryPreferences`
- `tastePassport.allergies`
- `tastePassport.tastePreferences`
- `scan.restaurantCountry`
- `scan.restaurantCity`
- `scan.localCurrency`
- `userHomeCountry`
- `userHomeCurrency`

## Success Response Body

The response maps to `List<DishAnalysisModel>` in Flutter.

```json
{
  "dishes": [
    {
      "dishName": "Tonkotsu Ramen",
      "description": "Rich pork broth with noodles, egg, scallion, and chashu.",
      "ingredients": ["Pork broth", "Wheat noodles", "Egg", "Scallion", "Chashu"],
      "allergens": ["Wheat", "Egg"],
      "tasteScore": 96,
      "safetyScore": 74,
      "valueScore": 84,
      "recommendationReason": "Strong umami match with manageable allergen flags.",
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

Required dish fields:

- `dishName`
- `description`
- `ingredients`
- `allergens`
- `tasteScore`
- `safetyScore`
- `valueScore`
- `recommendationReason`
- `priceIntelligence.localPrice`
- `priceIntelligence.localCurrency`
- `priceIntelligence.homePrice`
- `priceIntelligence.homeCurrency`
- `priceIntelligence.exchangeRate`
- `priceIntelligence.assessment`

Allowed `priceIntelligence.assessment` values:

- `Cheap`
- `Fair`
- `Expensive`
- `Good Value`

## Error Response Body

```json
{
  "error": {
    "code": "invalid_request",
    "message": "ocrResult.rawText is required.",
    "source": "backend_proxy",
    "requestId": "optional-request-id"
  }
}
```

Recommended error codes:

- `invalid_request`
- `unauthorized`
- `rate_limited`
- `ai_provider_unavailable`
- `ai_response_invalid`
- `internal_error`

## Mapping To Existing Flutter Domain Models

- Request source model: `AiAnalysisRequest`
- OCR input: `OcrResult`
- Taste input: `TastePassportModel`
- Scan input: `ScanModel`
- Provider mode: `AiProviderMode`
- Routing metadata: `AiRoutingDecision`
- Response output: `List<DishAnalysisModel>`
- Price output: `PriceIntelligenceModel`
- Client failure placeholder: `AiAnalysisFailure`

## Relationship To OCR-First Routing

See `OCR_FIRST_MULTI_PROVIDER_ROUTING_SPEC.md` for the backend routing strategy. This endpoint contract stays stable while the backend decides whether OCR and analysis should use China-optimized providers, global providers, automatic routing, or mock mode.

## Security Notes

- Store OpenAI API keys only in backend environment variables or secret manager.
- Never return provider secrets to Flutter.
- Validate request shape before calling any AI provider.
- Enforce request size limits for OCR text.
- Rate limit by user/session/IP before provider calls.
- Log request IDs and error codes, not full sensitive menu/user payloads by default.
- Add server-side content filtering and schema validation before sending results to the client.
- Keep Flutter pointed at a public backend endpoint only, never at OpenAI directly.

## Future Deployment Options

- Cloudflare Workers
- Vercel serverless functions
- Firebase Cloud Functions
- Google Cloud Run
- AWS Lambda
- A small containerized API service

## Intentionally Not Implemented Yet

- No real OpenAI calls
- No real Qwen or DeepSeek calls
- No API keys
- No backend deployment
- No authentication
- No Firebase
- No real OCR
- No subscription or billing logic
- No Flutter provider switch to the backend skeleton
