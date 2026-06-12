# AI Food Passport Manual Testing Checklist

## Launch

- [ ] Run `flutter pub get`.
- [ ] Run `flutter run -d web-server`.
- [ ] Confirm the app opens in a browser.

## Scan Flow

- [ ] Navigate through onboarding/auth/passport setup to Home.
- [ ] Open Scan.
- [ ] Select a menu image from gallery.
- [ ] Confirm the image preview appears inside the scan frame.
- [ ] Confirm the selected filename appears below the scan label.
- [ ] Tap the center analyze action.

## Mock OCR

- [ ] Confirm the app navigates to Results after analysis.
- [ ] Expand OCR Debug.
- [ ] Confirm raw OCR text appears.
- [ ] Confirm detected language appears.
- [ ] Confirm confidence appears.
- [ ] Confirm source appears as `mock_japanese`, `mock_chinese`, or `mock_english`.

## Mock AI

- [ ] Expand AI Debug.
- [ ] Confirm OCR language appears.
- [ ] Confirm taste preferences appear.
- [ ] Confirm allergies appear.
- [ ] Confirm dietary preferences appear.
- [ ] Confirm dish count appears.
- [ ] Confirm AI source appears as `mock_ai`.
- [ ] Confirm future provider appears as `openai_skeleton`.
- [ ] Confirm parser status appears as `ready`.
- [ ] Confirm real API enabled appears as `false`.

## Results

- [ ] Confirm dish result cards appear.
- [ ] Confirm scores appear on cards.
- [ ] Confirm price intelligence appears.
- [ ] Confirm allergen warnings appear where applicable.

## Dish Detail

- [ ] Tap a dish card.
- [ ] Confirm Dish Detail opens.
- [ ] Confirm recommendation reason appears.
- [ ] Confirm ingredients appear.
- [ ] Confirm hidden ingredient watch appears.
- [ ] Confirm price intelligence appears.
- [ ] Navigate back without errors.

## Known Environment Issues

- On some local Codex/Windows shells, Flutter commands may hang or Dart tooling may fail to read cached `flutter_lints` files due to permission restrictions.
- If `flutter analyze` fails due to analyzer/server/environment issues, record the exact terminal output and manually verify the web-server flow.
- Real OCR, real OpenAI calls, Firebase, and subscriptions are intentionally not implemented in this MVP Alpha.
