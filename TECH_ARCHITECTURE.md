# AI Food Passport - Technical Architecture

## Current MVP Alpha Stack

- Flutter
- Dart
- Riverpod
- GoRouter
- image_picker

## Current Architecture

The app uses a feature-based structure with shared domain models and repository interfaces.

Key folders:

- `lib/features/shared/domain/models/`
- `lib/features/shared/domain/repositories/`
- `lib/features/shared/data/`
- `lib/features/shared/data/ai/`

## Implemented Repository Interfaces

- `AuthRepository`
- `PassportRepository`
- `ScanRepository`
- `OcrRepository`
- `AiRepository`
- `PriceRepository`

## Active Implementations

- Mock auth/passport/scan repositories
- Mock OCR repository
- Mock AI repository
- Mock price repository

## Prepared But Disabled

- `OpenAiMenuAnalysisRepository`
- `OpenAiMenuPromptBuilder`
- `OpenAiMenuResponseSchema`
- `OpenAiMenuResponseParser`

The OpenAI skeleton does not call the network and is not the default provider.

## Not Yet Implemented

- Firebase Auth
- Firestore
- Firebase Storage
- Firebase Analytics
- Firebase Crashlytics
- Real OCR
- Real OpenAI API integration
- Backend API proxy
- Apple In-App Purchase
- Android/iOS production deployment

## Future Architecture Direction

Real OpenAI calls should be made through a backend proxy, not directly from Flutter. API keys must never be stored in client code.

Real OCR should be introduced behind `OcrRepository`, allowing Apple Vision, Google ML Kit, cloud OCR, or another provider to replace the mock adapter.
