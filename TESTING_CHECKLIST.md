# AI Food Passport Manual QA Checklist

## Launch

- [ ] Run `flutter pub get`.
- [ ] Run `flutter run -d web-server`.
- [ ] Confirm the app opens in a browser.

## Profile Settings

- [ ] Open Profile.
- [ ] Change Home country.
- [ ] Change Home currency to `TWD`.
- [ ] Change Output language to Traditional Chinese or Simplified Chinese.
- [ ] Change Provider mode to `china`.
- [ ] Refresh/restart the app.
- [ ] Confirm settings persisted.
- [ ] Tap Reset traveler settings.
- [ ] Confirm settings return to Germany / EUR / English / mock.
- [ ] Refresh/restart again and confirm defaults remain.
- [ ] Confirm provider mode is presented as future/informational only.

## Scan Flow

- [ ] Open Scan.
- [ ] Tap the main scan button without selecting an image.
- [ ] Confirm the processing overlay appears.
- [ ] Confirm Results opens.
- [ ] Return to Scan.
- [ ] Tap Gallery.
- [ ] Select a menu image.
- [ ] Confirm image preview appears on Flutter Web.
- [ ] Tap the main scan button.
- [ ] Confirm the processing overlay appears.
- [ ] Confirm Results opens.
- [ ] Confirm no "Select a menu image first" message appears.

## Results

- [ ] Confirm dish result cards appear.
- [ ] Confirm taste, safety, and value scores appear.
- [ ] Confirm local price appears.
- [ ] Confirm traveler home-currency price appears.
- [ ] Confirm price assessment appears.
- [ ] Confirm Results shows a traveler context summary such as "Prices converted to EUR/TWD/USD".
- [ ] Change Home currency in Profile and rescan.
- [ ] Confirm Results reflects the selected home currency.
- [ ] Change Output language in Profile and rescan.
- [ ] Confirm Results helper text changes language.

## Dish Detail

- [ ] Tap a dish card.
- [ ] Confirm Dish Detail opens.
- [ ] Confirm local menu price is clearly labeled.
- [ ] Confirm traveler home-currency price is clearly labeled.
- [ ] Confirm exchange rate appears.
- [ ] Confirm recommendation reason appears.
- [ ] Confirm ingredients appear.
- [ ] Confirm hidden ingredient watch appears.
- [ ] Confirm selected Output language affects helper labels.
- [ ] Tap the Dish Detail back arrow.
- [ ] Confirm it returns to Results.
- [ ] Tap the Results back arrow.
- [ ] Confirm it returns to Scan.

## Developer Debug

- [ ] Expand OCR Debug only after Results appears.
- [ ] Confirm OCR raw text, detected language, confidence, and source appear.
- [ ] Expand AI Debug.
- [ ] Confirm Home country, Home currency, Output language, and Provider mode appear.
- [ ] Confirm Active provider remains `mock_ai`.
- [ ] Confirm Qwen, DeepSeek, OpenAI, real OCR, and backend routing are disabled/planned.
- [ ] Confirm Debug remains collapsed/secondary by default.

## Negative Checks

- [ ] Confirm no real OCR call happens.
- [ ] Confirm no Qwen call happens.
- [ ] Confirm no DeepSeek call happens.
- [ ] Confirm no OpenAI call happens.
- [ ] Confirm no backend proxy call happens.
- [ ] Confirm no Firebase call happens.
- [ ] Confirm no real exchange-rate API call happens.

## Known Environment Issues

- On some local Codex/Windows shells, Flutter and Dart commands may hang or fail due to cache/permission restrictions.
- If `flutter analyze` fails due to analyzer/server/environment issues, record the exact terminal output and manually verify the web-server flow.
