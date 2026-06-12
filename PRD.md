# AI Food Passport - Product Requirements Document

## Product Vision

AI Food Passport helps international travelers understand unfamiliar restaurant menus, avoid food risks, discover dishes they are likely to enjoy, and make smarter dining decisions abroad.

Tagline: Travel Smarter. Eat Better.

## Target Users

- International travelers
- Business travelers
- Digital nomads
- Food enthusiasts

## Core Problems

Travelers often cannot confidently:

- Understand foreign menu items
- Identify ingredients
- Detect allergens or hidden risk
- Compare prices in local and home currency
- Decide what to order based on personal taste

## MVP Alpha Scope

The MVP Alpha demonstrates the end-to-end user flow with real image selection and mock intelligence layers.

Implemented:

- Taste Passport setup UI
- Home, Scan, Results, Dish Detail, and Profile screens
- Gallery image selection
- Selected image preview
- Typed `ScanModel`
- Mock OCR adapter returning typed OCR results
- OCR Debug section
- Typed AI analysis request model
- Mock AI repository returning dish analysis results
- AI Debug section
- OpenAI prompt builder, response schema, parser, and disabled repository skeleton

Not implemented:

- Firebase
- Real OCR
- Real OpenAI calls
- API keys
- Backend proxy
- Subscriptions
- Persistent user accounts or scan history

## Main User Flow

1. User opens app.
2. User enters or uses demo taste passport.
3. User selects a menu image.
4. App previews the image.
5. Mock OCR extracts menu text.
6. Mock AI analyzes dishes using OCR text and taste passport context.
7. User reviews ranked results.
8. User opens Dish Detail.

## Future Production Features

- Real OCR provider
- Backend OpenAI proxy
- Firebase Auth and persistence
- Saved scans and travel history
- Real price intelligence
- Subscription and App Store purchase flow
