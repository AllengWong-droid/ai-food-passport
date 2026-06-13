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
  static String get currentBaseUrl {
    final raw = _dartDefineUrl.trim();
    if (raw.isEmpty) {
      return localDevUrl;
    }

    // Reject values that look like they might contain secrets.
    if (raw.contains('@') && raw.contains(':')) {
      // URLs with userinfo (username:password@host) are forbidden.
      // The @ symbol could also appear in OAuth callback URLs, so we only
      // reject when both @ and : appear before the first / (typical for
      // userinfo segments).
      final uri = Uri.tryParse(raw);
      if (uri != null && uri.userInfo.isNotEmpty) {
        return localDevUrl;
      }
    }

    // Reject values containing known secret/token patterns.
    if (raw.contains('api_key=') ||
        raw.contains('api-key=') ||
        raw.contains('secret=') ||
        raw.contains('token=') ||
        raw.contains('key=')) {
      return localDevUrl;
    }

    // Basic URL shape validation: must start with http:// or https://.
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      return localDevUrl;
    }

    // Attempt to parse the URL; fall back if it's not a valid URI.
    final parsed = Uri.tryParse(raw);
    if (parsed == null || !parsed.hasAuthority) {
      return localDevUrl;
    }

    // Remove trailing slash for consistency.
    final result = parsed.path.isEmpty || parsed.path == '/'
        ? '${parsed.scheme}://${parsed.authority}'
        : raw;
    return result;
  }

  /// Whether [BACKEND_BASE_URL] was explicitly provided at compile time.
  static bool get isCustomDefined =>
      _dartDefineUrl.trim().isNotEmpty && currentBaseUrl != localDevUrl;
}
