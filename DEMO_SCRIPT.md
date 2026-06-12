# AI Food Passport Demo Script

## 30-Second Version

Opening line:
"AI Food Passport helps travelers understand foreign menus before they order."

Demo beats:
1. Show the Scan screen.
2. Select a menu image from gallery.
3. Point out the image preview.
4. Run the mock OCR and mock AI analysis.
5. Show Results with ranked dishes.
6. Expand OCR Debug and AI Debug briefly.
7. Open Dish Detail.

Closing line:
"This MVP Alpha uses real image selection and typed adapter layers, with mock OCR and mock AI ready to be replaced by production services."

## 60-Second Version

Opening line:
"When travelers cannot read a menu, they also cannot easily judge ingredients, allergens, value, or what they will actually enjoy. AI Food Passport turns a menu image into personalized dish guidance."

Step-by-step:
1. Start on Scan.
   Say: "This is the menu scan flow. For the MVP Alpha, image selection is real, while OCR is mocked behind a production-ready repository interface."
2. Select an image from gallery.
   Say: "The selected image is stored in the scan model and previewed immediately."
3. Tap the center analyze action.
   Say: "The app sends the selected image path into a mock OCR adapter, then builds a typed AI analysis request."
4. Show Results.
   Say: "Results are mock AI dish analyses ranked for the user's taste passport, allergies, dietary preferences, restaurant location, and currency."
5. Expand OCR Debug.
   Say: "OCR Debug shows the raw text, detected language, confidence, and source. This is development-only visibility."
6. Expand AI Debug.
   Say: "AI Debug shows the context used by the mock AI layer and confirms the future OpenAI skeleton is available but disabled."
7. Open Dish Detail.
   Say: "Dish Detail explains ingredients, allergens, scores, price intelligence, and recommendation reasons."

Closing line:
"The important part is the architecture: the user flow works today with mocks, and the OCR and AI adapters are ready for real services without redesigning the app."

## Demo Checklist

- Use a menu image with a recognizable filename if you want a specific mock language:
  - Japanese/default: any normal image name
  - Chinese: include `china`, `chinese`, or `zh`
  - English: include `english`, `harbor`, or `en`
- Keep the OCR Debug panel collapsed until Results appears.
- Expand OCR Debug first, then AI Debug.
- End on Dish Detail to show the final user-facing value.
