# AI Food Passport - App Store Preparation Notes

## Current Status

The project is an MVP Alpha and is not App Store ready yet.

Current app behavior uses:

- Real image selection
- Real image preview
- Mock OCR
- Mock AI analysis
- Mock price intelligence
- Local traveler settings persistence
- Local mock multilingual helper copy
- Debug OCR and AI panels
- Optional developer backend mock mode, disabled by default
- OCR-first backend mock pipeline for local testing only
- Provider registry/routing skeleton where non-mock modes safely fall back to mock

## Not Yet Ready For Store Submission

- No production OCR
- No production backend
- No real Qwen integration
- No real DeepSeek integration
- No real OpenAI integration
- No real provider routing
- China/global/auto provider modes do not call external providers
- No real exchange-rate API
- No Firebase persistence
- No production authentication
- No subscriptions
- No privacy policy copy finalized
- No medical/allergen disclaimer review
- No App Store screenshots or metadata finalized
- Developer backend scenario testing is not a production user feature

## Backend URL Configuration for Production Builds (Phase 11D)

- Production Flutter builds **must** use a deployed HTTPS backend URL via the `BACKEND_BASE_URL` dart-define.
- `BACKEND_BASE_URL` is **not a secret** — it is a compile-time configuration value, not an API key.
- Flutter **must never** contain provider API keys or secrets.
- The app's default local mock behavior **must not require** a backend.
- Backend Mock Mode **must remain disabled** in production builds.

## Developer Controls Release Safety (Phase 11E)

- Developer-only UI controls are gated behind `DeveloperControlsConfig.areVisible` (`lib/features/shared/config/developer_controls_config.dart`).
- In release builds, the following are hidden by default:
  - Backend Mock Mode toggle
  - Backend Scenario selector
  - AI Provider Mode dropdown (future routing — not a user feature)
  - Backend URL debug display
  - Results AI Debug / OCR Debug panels
  - Raw backend routing metadata
- Normal traveler settings (Home Country, Home Currency, Output Language, dietary preferences, etc.) remain visible for all users.
- `SHOW_DEVELOPER_CONTROLS` dart-define can enable developer controls for internal / QA / TestFlight builds.
- App Store builds **should keep** `SHOW_DEVELOPER_CONTROLS` off.
- `SHOW_DEVELOPER_CONTROLS` is **not a secret** — it is a compile-time flag that gates debug UI visibility only.
- Backend Mock Mode is **not a normal user feature**.

## Config and Release Safety Tests (Phase 11F)

- Flutter config tests are located in `test/shared/config/`.
- `backend_endpoint_config_test.dart` (33 tests): covers URL validation, secret-pattern rejection, fallback behaviour.
- `developer_controls_config_test.dart` (8 tests): covers visibility gating for debug/release/override modes.
- Run with: `flutter test test/shared/config/` — all 41 tests must pass.
- Helper functions (`validateAndResolve`, `isSafeBackendBaseUrl`, `resolveVisibility`) are pure and testable without compile-time constants.
- Flutter must never contain provider API keys.
- Release builds should not expose Backend Mock Mode or raw provider routing metadata.
- `SHOW_DEVELOPER_CONTROLS` is for internal builds only.

## Future App Store Work

- Production privacy policy
- Terms and allergy/safety disclaimer
- Subscription copy and purchase flow
- Screenshots
- App preview video
- Store description
- Support URL
- Data collection disclosure
- Production backend/provider compliance review
