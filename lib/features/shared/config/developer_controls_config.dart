import 'package:flutter/foundation.dart';

/// Centralized gate for developer-only UI controls.
///
/// ## Behaviour
///
/// - **Debug builds** (`kDebugMode == true`): developer controls are visible
///   by default.
/// - **Release builds**: hidden by default.
/// - **Compile-time override**:
///   `flutter build web --dart-define=SHOW_DEVELOPER_CONTROLS=true`
///   forces visibility even in release builds (useful for internal / QA /
///   TestFlight hand-off builds).
///
/// ## What is gated
///
/// - Backend Mock Mode toggle (Profile > Developer)
/// - Backend Scenario selector
/// - Backend URL debug display (Profile subtitle, Results AI Debug)
/// - AI Provider Mode dropdown (future routing — not a user feature yet)
/// - Results AI Debug / OCR Debug panels
/// - Raw backend routing metadata
///
/// ## What is NOT gated
///
/// - Dietary preferences, spice tolerance, budget, currency, locale
/// - Normal traveler settings (Home Country, Home Currency, Output Language)
/// - Taste & Allergies, Notifications, Email, Travel History
/// - Country Stamp Grid, Passport Card
/// - "Continue with sample result" error recovery
/// - Normal Profile UX
///
/// ## Security
///
/// `SHOW_DEVELOPER_CONTROLS` is **not a secret**. It is a compile-time flag
/// that gates debug UI visibility. It does not enable real providers, does
/// not change backend behaviour, and does not leak API keys.
class DeveloperControlsConfig {
  const DeveloperControlsConfig._();

  /// Whether developer-only controls should be visible in the current build.
  ///
  /// Visible by default in debug builds. In release builds, only visible if
  /// the [SHOW_DEVELOPER_CONTROLS] dart-define is set to `'true'`.
  static bool get areVisible =>
      kDebugMode ||
      const String.fromEnvironment('SHOW_DEVELOPER_CONTROLS') == 'true';

  /// Whether the dart-define override is active.
  ///
  /// Useful for debug UI that wants to display whether the override was
  /// explicitly set.
  static bool get isOverrideEnabled =>
      const String.fromEnvironment('SHOW_DEVELOPER_CONTROLS') == 'true';
}
