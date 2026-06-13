# AI Food Passport - Product Requirements Document

## Product Vision

AI Food Passport helps international travelers understand unfamiliar restaurant menus, avoid food risks, compare prices in their home currency, and choose dishes they are likely to enjoy.

Tagline: Travel Smarter. Eat Better.

## Target Users

- International travelers
- Business travelers
- Digital nomads
- Food enthusiasts
- Travelers with dietary restrictions or allergy concerns

## Core Problems

Travelers often cannot confidently:

- Understand foreign menu items
- Identify ingredients
- Detect allergens or hidden risk
- Compare prices in local and home currency
- Decide what to order based on personal taste
- Use the same app experience in regions where provider availability differs

## MVP Alpha Scope

The MVP Alpha demonstrates the end-to-end user flow with real UI interactions and mock intelligence layers.

Implemented:

- Taste Passport setup UI
- Home, Scan, Results, Dish Detail, and Profile screens
- Gallery image selection and Flutter Web image preview
- Scan without requiring an image
- Processing overlay with staged progress messages
- Friendly fallback/failure recovery UX prepared for future failures
- Typed `ScanModel`
- Mock OCR adapter returning typed `OcrResult`
- Mock AI repository returning `DishAnalysisModel` results
- Price intelligence with deterministic mock exchange rates
- Results and Dish Detail price presentation
- Dish Detail back navigation
- Traveler settings in Profile
- Local persistence for traveler settings using `shared_preferences`
- Reset traveler settings action
- Output language affecting local mock Results/Dish Detail helper text
- Provider mode setting for future routing, informational only
- OCR-first multi-provider routing skeleton for future China/global support
- Local backend mock proxy for developer testing, disabled by default
- Backend OCR-first mock pipeline with standardized response envelopes
- Backend and Flutter debug scenarios for OCR/analysis success, low quality, empty result, and failure recovery
- Disabled OpenAI/multi-provider skeletons

Not implemented:

- Real OCR
- Real Qwen
- Real DeepSeek
- Real OpenAI
- Real production backend proxy
- Real provider routing
- Firebase
- Subscriptions
- Production authentication
- Real exchange-rate API
- Real translation
- Saved scans or cloud sync

## Main User Flow

1. User opens Profile and optionally adjusts traveler settings.
2. User opens Scan.
3. User optionally selects a menu image.
4. App previews the image if selected.
5. User taps the scan button.
6. App shows staged processing messages.
7. Mock OCR extracts menu text.
8. Mock AI analyzes dishes using OCR text, taste passport, traveler settings, and mock prices.
9. User reviews ranked Results.
10. User opens Dish Detail.
11. User returns to Results and Scan.

## Developer Backend Mock Flow

In debug builds, developers can enable Backend Mock Mode from Profile and choose a Backend Scenario. This optionally calls the local backend mock server at `POST /api/analyze-menu`.

Supported scenarios:

- `normal`
- `ocr_low_confidence`
- `ocr_empty_text`
- `ocr_failure`
- `analysis_low_quality`
- `analysis_empty_result`
- `analysis_failure`

This is for local testing only. It is not a production user feature and does not call real providers.

## Future Production Features

- Backend proxy for server-side provider calls
- Real OCR adapter
- Qwen/DeepSeek/OpenAI provider adapters through backend
- Provider health checks and fallback routing
- Real exchange rates
- Firebase or another production persistence layer
- Saved scan history
- Production auth
- Subscription and App Store purchase flow
