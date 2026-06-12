# AI Food Passport - AI Engine Specification

## Current State

The MVP Alpha uses `MockAiRepository` as the active AI engine. It accepts a typed `AiAnalysisRequest` and returns `List<DishAnalysisModel>`.

The OpenAI adapter is prepared but disabled:

- No real OpenAI API calls
- No API keys
- No client-side secrets
- No network calls from the OpenAI skeleton

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

## Score Definitions

### Taste Score

Range: 0-100

Represents likely fit with the user's taste preferences.

### Safety Score

Range: 0-100

Represents likely allergen and dietary safety. This is not medical advice.

### Value Score

Range: 0-100

Represents perceived value using local price, home currency, and travel context.

## Future OpenAI Response Shape

The prepared parser expects a JSON-like object:

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

OpenAI should be integrated through a backend proxy. Flutter should send a typed request to the backend and receive structured dish results. API keys must stay server-side.
