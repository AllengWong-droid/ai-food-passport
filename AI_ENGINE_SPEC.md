# AI Food Passport - AI Engine Specification

## Current State

The MVP Alpha uses `MockAiRepository` as the active AI engine. It accepts a typed `AiAnalysisRequest` and returns `List<DishAnalysisModel>`.

No real OCR, Qwen, DeepSeek, OpenAI, backend, provider routing, or exchange-rate API calls are made.

## Active Pipeline

1. Scan screen creates or uses a mock/default image source.
2. Mock OCR returns typed `OcrResult`.
3. Scan builds `AiAnalysisRequest`.
4. `MockAiRepository` returns deterministic dish results.
5. Results and Dish Detail present price intelligence and local mock helper copy.

## Input Model

`AiAnalysisRequest` includes:

- OCR result
- Taste passport
- Scan model
- User home country
- User home currency
- Restaurant country
- Restaurant city
- Local currency
- Output language
- Provider mode

Provider mode is informational only in the MVP Alpha.

## Output Model

The AI layer currently returns `List<DishAnalysisModel>`.

Each dish includes:

- Dish name
- Description
- Ingredients
- Allergens
- Taste score
- Safety score
- Value score
- Recommendation reason
- Price intelligence

## Price Intelligence

Mock price intelligence includes:

- Local price
- Local currency
- Home price
- Home currency
- Exchange rate
- Assessment: Cheap, Fair, Expensive, or Good Value

Home currency conversion uses deterministic mock rates for supported currencies. No real exchange-rate API is implemented.

## Output Language

Output language affects local mock helper text in Results and Dish Detail for:

- English
- Traditional Chinese
- Simplified Chinese
- Japanese

This is not real translation. Dish content remains deterministic mock data.

## Prepared But Disabled

- OpenAI prompt builder
- OpenAI response schema
- OpenAI response parser
- OpenAI repository skeleton
- Backend proxy repository skeleton
- Multi-provider routing repository skeleton

## Future Response Shape

Future provider responses should map to:

```json
{
  "dishes": [
    {
      "dishName": "Sample Dish",
      "description": "Short explanation",
      "ingredients": ["Ingredient"],
      "allergens": ["Allergen"],
      "tasteScore": 90,
      "safetyScore": 85,
      "valueScore": 80,
      "recommendationReason": "Why this dish fits",
      "priceIntelligence": {
        "localPrice": 1200,
        "localCurrency": "JPY",
        "homePrice": 8.1,
        "homeCurrency": "USD",
        "exchangeRate": 0.00675,
        "assessment": "Fair"
      }
    }
  ]
}
```

## Future Integration Rule

Real provider calls must be made through a backend proxy. Flutter should send typed requests to the backend and receive structured dish results. API keys must stay server-side.
