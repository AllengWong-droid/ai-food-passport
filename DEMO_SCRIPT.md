# AI Food Passport Written Demo Walkthrough

## Short Demo

Opening:
"AI Food Passport helps travelers understand menus abroad, compare prices in their own currency, and choose dishes that fit their taste and safety profile."

Flow:

1. Open Profile.
2. Show Home country, Home currency, Output language, and Provider mode.
3. Explain that settings persist locally and can be reset.
4. Open Scan.
5. Optionally select a menu image from Gallery.
6. Tap the main scan button.
7. Show the processing overlay.
8. Show Results with prices converted to the selected home currency.
9. Change Output language and run another scan to show localized helper text.
10. Open Dish Detail and show local price, home-currency price, and value explanation.

Closing:
"This MVP Alpha uses mock OCR and mock AI, but the product flow, domain models, local settings, price intelligence, and future provider-routing skeleton are in place."

## Detailed Demo Script

### 1. Profile Settings

Say:
"The traveler can set their home country, home currency, output language, and provider mode. These settings are persisted locally with shared preferences."

Show:

- Home country
- Home currency
- Output language
- Provider mode
- Reset traveler settings

Clarify:
"Provider mode is currently informational only. Mock AI remains active in this MVP. China, Global, and Auto are future routing modes."

### 2. Scan

Say:
"The scan flow works whether or not an image is selected. On web, Gallery image preview is real, while OCR remains mocked."

Show:

- Scanner-style Scan screen
- Gallery image preview if available
- Main scan button

### 3. Processing Overlay

Say:
"After tapping scan, the app shows staged progress so the user does not feel stuck."

Messages include:

- Reading menu image
- Recognizing dishes
- Checking taste and allergy fit
- Comparing local prices
- Preparing recommendations

### 4. Results

Say:
"Results show deterministic mock dish recommendations with price intelligence. Prices are converted into the selected traveler home currency using mock rates."

Show:

- Traveler context summary
- Dish cards
- Local price
- Home-currency price
- Price assessment
- Taste, safety, and value scores

### 5. Multilingual Helper Text

Say:
"Output language changes local helper text in Results and Dish Detail. This is deterministic mock UI copy, not real translation."

Try:

- English
- Traditional Chinese
- Simplified Chinese
- Japanese

### 6. Dish Detail

Say:
"Dish Detail explains why a dish was recommended and separates local menu price from the traveler's selected currency price."

Show:

- Recommendation reason
- Ingredients
- Hidden ingredient watch
- Local menu price
- Your currency price
- Exchange rate
- Value explanation
- Back navigation to Results

### 7. Future Provider Routing

Say:
"The architecture prepares for OCR-first routing. In the future, China mode could use Qwen-OCR or Qwen-VL plus Qwen or DeepSeek analysis, while Global mode could use OpenAI or other global providers through a backend proxy."

Clarify:
"No real OCR, Qwen, DeepSeek, OpenAI, backend proxy, Firebase, or real exchange-rate API is implemented yet."
