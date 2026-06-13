# AI Food Passport Demo Walkthrough

## Opening

"AI Food Passport helps travelers understand menus abroad, compare prices in their own currency, and choose dishes that fit their taste and safety profile."

Clarify early:

"This MVP Alpha uses local mock OCR, local mock AI, and an optional mock backend for developer testing. No real OCR or real AI providers are being called."

## Normal User Flow

1. Open Profile.
2. Show Home country, Home currency, Output language, and Provider mode.
3. Explain that settings persist locally and can be reset.
4. Open Scan.
5. Optionally choose a Gallery image.
6. Tap the main scan button.
7. Show staged processing.
8. Show Results with local price and home-currency price.
9. Open Dish Detail.
10. Show recommendation reason, ingredients, local price, home-currency price, and exchange rate.

Suggested narration:

"The normal app flow does not require the backend. It runs with local mock OCR and local mock AI, so the product experience can be tested without secrets or provider accounts."

## Developer Backend Mock Mode Flow

Before the demo, start the backend:

```bash
cd backend
npm run dev
```

Steps:

1. Open Profile in Flutter debug mode.
2. Enable Backend Mock Mode.
3. Set Backend Scenario to `normal`.
4. Run Scan.
5. Show that Results still appear.
6. Expand AI Debug briefly and show Active provider `backend_mock`.

Suggested narration:

"For developer testing, Flutter can optionally call a local backend mock server. The backend route is OCR-first: request, mock OCR provider, mock analysis provider, standardized response envelope, then Flutter Results."

## Failure And Recovery Demo

Use Profile -> Backend Scenario:

- `ocr_failure`
- `ocr_empty_text`
- `analysis_failure`
- `analysis_empty_result`

For each scenario:

1. Select the scenario.
2. Run Scan.
3. Show friendly recovery copy.
4. Tap Continue with sample result.
5. Confirm local mock Results opens.

Suggested narration:

"These scenarios simulate future real provider failures without calling real providers. The user sees friendly recovery actions, not stack traces or raw backend JSON."

## Low Confidence Demo

Use Profile -> Backend Scenario:

- `ocr_low_confidence`
- `analysis_low_quality`

Steps:

1. Select `ocr_low_confidence`.
2. Run Scan.
3. Confirm Results still opens.
4. Select `analysis_low_quality`.
5. Run Scan.
6. Confirm Results still opens.

Suggested narration:

"Low-confidence scenarios still return recommendations, but the backend metadata marks the response for review. This prepares the app for future provider quality signals."

## Future Provider Routing Explanation

Say:

"The backend mock architecture is designed for future OCR-first provider routing. In a future China-friendly mode, OCR could route to Qwen-OCR or Qwen-VL and analysis to Qwen or DeepSeek. In a global mode, OCR or analysis could route to OpenAI or another global provider. Those integrations are not implemented yet, and no API keys are in Flutter."

## Closing

"The MVP Alpha now demonstrates the core user experience, local traveler settings, deterministic price intelligence, an optional backend mock proxy, OCR-first provider structure, and friendly fallback UX. Real OCR, real AI providers, Firebase, subscriptions, and App Store readiness remain future work."
