# OCR-First Multi-Provider Routing Spec

## Purpose

AI Food Passport should use an OCR-first pipeline for future production analysis: extract readable menu text from an image first, then send that text plus traveler context to an LLM for structured dish recommendations and price intelligence.

The current MVP Alpha remains mock-only. This spec prepares the contract for future backend routing across China-optimized, global, auto, and mock provider modes without adding real provider calls or secrets.

## Why OCR-First Is Preferred

OCR-first keeps the product flow predictable and fast. Menu images can be noisy, multilingual, handwritten, or poorly lit. Separating OCR from dish analysis allows the backend to:

- Choose the best image/text extraction provider for the user's region.
- Cache or retry OCR independently from LLM analysis.
- Show useful debug information during development.
- Send cleaner, smaller text payloads to analysis models.
- Preserve the existing Flutter domain flow: image -> OCR result -> AI analysis -> dish results.

## Why Routing Belongs On Backend

Provider choice depends on region, latency, availability, cost, rate limits, and compliance. Those decisions should happen on a backend proxy, not inside Flutter.

Backend routing can safely manage:

- Provider API keys and credentials.
- Provider availability checks and fallbacks.
- Latency measurement and timeout policy.
- Request validation and abuse protection.
- Schema validation before returning results to the app.
- Provider-specific prompt and response adaptation.

## Why Flutter Must Not Call Providers Directly

Flutter client code can be inspected and modified. The app must never ship Qwen, DeepSeek, OpenAI, or OCR provider secrets. Flutter should call only a public backend endpoint and receive typed app-domain responses.

## Low-Latency UX Strategy

The user should not feel provider switching. The future backend should:

- Pick a provider mode before expensive work begins.
- Use short provider timeouts.
- Fall back to another provider when latency or availability is poor.
- Return structured partial errors only when no route can complete.
- Keep the Flutter UI focused on scan progress and final recommendations.
- Avoid surfacing provider names to normal users.

## China Mode

China mode is optimized for mainland China travel and latency constraints.

Planned OCR providers:

- Qwen-OCR
- Qwen-VL

Planned analysis providers:

- Qwen
- DeepSeek

This mode is skeleton-only. No Qwen or DeepSeek calls are implemented.

## Global Mode

Global mode is optimized for international availability outside mainland China.

Planned OCR or vision providers:

- OpenAI vision-capable model
- Another global OCR provider if needed

Planned analysis providers:

- GPT-4o mini or a similar small OpenAI model

This mode is skeleton-only. No OpenAI calls are implemented.

## Auto Mode

Auto mode lets the backend choose between China mode and global mode using signals such as:

- User-selected region.
- Restaurant country.
- Current network latency.
- Provider health.
- Cost and rate-limit status.

Auto mode should still return the same Flutter response shape.

## Mock Mode

Mock mode is the only active mode in the current MVP Alpha.

Current flow:

image selection -> mock OCR -> mock AI analysis -> results with price intelligence -> dish detail.

Mock mode remains active by default through `MockAiRepository` and the existing mock OCR repository.

## Fallback Strategy

Future backend fallback order should be route-specific:

- China mode can fall back from Qwen-OCR to Qwen-VL for OCR.
- China analysis can fall back between Qwen and DeepSeek.
- Global mode can fall back between a vision model and a dedicated OCR provider.
- Global analysis can fall back to another compatible small model.
- If all real providers fail, the backend should return a clear structured error, not silently fake production data.

Fallback decisions should be represented by a routing decision object with `fallbackUsed`, `reason`, and `latencyMs`.

## Multilingual Support Strategy

The OCR layer should preserve raw menu text and detected language. The analysis layer should support multilingual menus by using:

- Raw OCR text.
- Detected language.
- Restaurant country and city.
- Local currency.
- Traveler home country and currency.
- Taste passport preferences, allergies, and dietary preferences.

The returned dish recommendations should be readable to the user while preserving original dish names when useful.

## Image Scanning Strategy

Flutter should continue to handle image selection and preview. Future real OCR should happen through the backend or a backend-approved OCR route.

The app should not upload images directly to Qwen, DeepSeek, OpenAI, or other provider APIs from Flutter. If image upload is needed, Flutter should upload only to the app backend, which then routes the request.

## Structured Response Strategy

All routes should return a response that maps to `List<DishAnalysisModel>`.

Each dish should include:

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

The backend should validate provider output before returning it to Flutter.

## Relationship With BACKEND_PROXY_SPEC.md

`BACKEND_PROXY_SPEC.md` defines the future backend endpoint contract. This document extends that contract with OCR-first routing strategy and provider mode decisions.

Together:

- `BACKEND_PROXY_SPEC.md` answers what Flutter sends and receives.
- `OCR_FIRST_MULTI_PROVIDER_ROUTING_SPEC.md` answers how the backend should choose OCR and analysis providers before producing that response.

## Intentionally Not Implemented Yet

- No real Qwen calls.
- No real DeepSeek calls.
- No real OpenAI calls.
- No provider SDKs.
- No API keys or secrets.
- No backend deployment.
- No real OCR.
- No Flutter provider switch away from mocks.
