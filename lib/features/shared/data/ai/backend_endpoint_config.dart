/// Centralized backend endpoint configuration.
///
/// Reads the compile-time [BACKEND_BASE_URL] dart-define for production
/// deployments and falls back to the local development URL when the define
/// is absent, empty, or invalid.
///
/// This file must NEVER contain API keys, secrets, provider credentials,
/// or any other sensitive values.
///
/// ## dart-define usage
///
/// ```sh
/// # Local testing with a running backend:
/// flutter run -d web-server --dart-define=BACKEND_BASE_URL=http://127.0.0.1:8787
///
/// # Production web build:
/// flutter build web --dart-define=BACKEND_BASE_URL=https://api.foodpassport.example.com
/// ```
///
/// ## Backend Mock Mode
///
/// Backend Mock Mode remains **disabled by default**. The app continues to
/// use local [MockAiRepository] unless the developer explicitly toggles
/// "Backend Mock Mode" in the Profile > Developer section (debug builds only).
class BackendEndpointConfig {
  const BackendEndpointConfig._();

  /// Compile-time dart-define for the backend base URL.
  ///
  /// Falls back to an empty string so the caller can decide whether to use
  /// the local development default.
  static const _dartDefineUrl = String.fromEnvironment(
    'BACKEND_BASE_URL',
    defaultValue: '',
  );

  /// The default local backend URL used during development when
  /// [BACKEND_BASE_URL] is not provided at compile time.
  static const localDevUrl = 'http://localhost:8787';

  /// The resolved backend base URL at runtime.
  ///
  /// - If [BACKEND_BASE_URL] is provided and passes basic validation,
  ///   returns that value.
  /// - If [BACKEND_BASE_URL] is absent, empty, or invalid, falls back to
  ///   [localDevUrl].
  ///
  /// This is a *non-secret* value. It is safe to log in debug contexts.
  static String get currentBaseUrl => validateAndResolve(_dartDefineUrl.trim());

  /// Whether [BACKEND_BASE_URL] was explicitly provided at compile time.
  static bool get isCustomDefined =>
      _dartDefineUrl.trim().isNotEmpty && currentBaseUrl != localDevUrl;

  // ---------------------------------------------------------------------------
  // Pure helpers — testable without compile-time constants.
  // ---------------------------------------------------------------------------

  /// Validates and resolves a raw backend base URL string.
  ///
  /// Returns the validated URL or [fallback] if the raw value is empty,
  /// unsafe, or an invalid URI.
  ///
  /// This is a **pure function** — it depends only on its arguments, making
  /// it directly testable in `flutter test` without compile-time constants.
  static String validateAndResolve(String raw,
      {String fallback = localDevUrl}) {
    final trimmed = raw.trim();
    if (trimmed.isEmpty) {
      return fallback;
    }

    if (!isSafeBackendBaseUrl(trimmed)) {
      return fallback;
    }

    // Attempt to parse the URL; fall back if it's not a valid URI.
    final parsed = Uri.tryParse(trimmed);
    if (parsed == null || !parsed.hasAuthority || parsed.host.isEmpty) {
      return fallback;
    }

    // Remove trailing slash for consistency.
    final result = parsed.path.isEmpty || parsed.path == '/'
        ? '${parsed.scheme}://${parsed.authority}'
        : trimmed;
    return result;
  }

  /// Checks whether the raw backend base URL string is safe to use.
  ///
  /// Returns `false` for:
  /// - URLs containing userinfo (`username:password@host`).
  /// - URLs containing known secret/token query string patterns.
  /// - URLs starting with schemes other than `http://` or `https://`.
  ///
  /// This is a **pure function** — it depends only on its argument, making
  /// it directly testable in `flutter test` without compile-time constants.
  static bool isSafeBackendBaseUrl(String raw) {
    // Must start with http:// or https://.
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      return false;
    }

    // Reject values that look like they might contain secrets via userinfo.
    if (raw.contains('@') && raw.contains(':')) {
      final uri = Uri.tryParse(raw);
      if (uri != null && uri.userInfo.isNotEmpty) {
        return false;
      }
    }

    // Reject values containing known secret/token query patterns.
    if (raw.contains('api_key=') ||
        raw.contains('api-key=') ||
        raw.contains('secret=') ||
        raw.contains('token=') ||
        raw.contains('key=')) {
      return false;
    }

    return true;
  }
}
