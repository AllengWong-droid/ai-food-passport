import 'package:flutter_test/flutter_test.dart';

import 'package:ai_food_passport/features/shared/data/ai/backend_endpoint_config.dart';

void main() {
  // ---------------------------------------------------------------------------
  // BackendEndpointConfig.validateAndResolve
  // ---------------------------------------------------------------------------

  group('BackendEndpointConfig.validateAndResolve', () {
    test('empty string falls back to localDevUrl', () {
      final result = BackendEndpointConfig.validateAndResolve('');
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('whitespace-only string falls back to localDevUrl', () {
      final result = BackendEndpointConfig.validateAndResolve('   ');
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('valid http URL is accepted (development)', () {
      const url = 'http://127.0.0.1:8787';
      final result = BackendEndpointConfig.validateAndResolve(url);
      expect(result, url);
    });

    test('valid http URL with trailing slash is normalised', () {
      final result =
          BackendEndpointConfig.validateAndResolve('http://localhost:8787/');
      expect(result, 'http://localhost:8787');
    });

    test('valid https URL is accepted (production/deployed backend)', () {
      const url = 'https://api.foodpassport.example.com';
      final result = BackendEndpointConfig.validateAndResolve(url);
      expect(result, url);
    });

    test('valid https URL with path is preserved', () {
      const url = 'https://api.example.com/v1';
      final result = BackendEndpointConfig.validateAndResolve(url);
      expect(result, url);
    });

    test('URL with userinfo (user:pass@host) is rejected', () {
      final result = BackendEndpointConfig.validateAndResolve(
        'http://user:pass@example.com',
      );
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('URL with only a username in userinfo is rejected', () {
      final result = BackendEndpointConfig.validateAndResolve(
        'http://admin@example.com',
      );
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('URL with api_key= query param is rejected', () {
      final result = BackendEndpointConfig.validateAndResolve(
        'http://example.com?api_key=abc123',
      );
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('URL with api-key= query param is rejected', () {
      final result = BackendEndpointConfig.validateAndResolve(
        'http://example.com?api-key=abc123',
      );
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('URL with secret= query param is rejected', () {
      final result = BackendEndpointConfig.validateAndResolve(
        'http://example.com?secret=xyz',
      );
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('URL with token= query param is rejected', () {
      final result = BackendEndpointConfig.validateAndResolve(
        'http://example.com?token=bearer-token-here',
      );
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('URL with key= query param is rejected', () {
      final result = BackendEndpointConfig.validateAndResolve(
        'http://example.com?key=abc',
      );
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('URL with secret patterns is rejected even with valid host', () {
      final result = BackendEndpointConfig.validateAndResolve(
        'https://example.com/path?api_key=hidden',
      );
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('non-http scheme is rejected', () {
      final result =
          BackendEndpointConfig.validateAndResolve('ftp://example.com');
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('non-https scheme is rejected', () {
      final result =
          BackendEndpointConfig.validateAndResolve('ws://example.com');
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('gibberish string falls back safely', () {
      final result =
          BackendEndpointConfig.validateAndResolve('not-a-url-at-all');
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('empty scheme (no colon-slash) falls back safely', () {
      final result =
          BackendEndpointConfig.validateAndResolve('just words here');
      expect(result, BackendEndpointConfig.localDevUrl);
    });

    test('custom fallback is used when provided', () {
      const custom = 'http://custom-fallback:3000';
      final result = BackendEndpointConfig.validateAndResolve(
        '',
        fallback: custom,
      );
      expect(result, custom);
    });

    test('custom fallback is used for unsafe URL', () {
      const custom = 'http://custom-fallback:3000';
      final result = BackendEndpointConfig.validateAndResolve(
        'http://example.com?secret=s3cr3t',
        fallback: custom,
      );
      expect(result, custom);
    });

    test('URL without authority falls back', () {
      final result = BackendEndpointConfig.validateAndResolve('http://');
      expect(result, BackendEndpointConfig.localDevUrl);
    });
  });

  // ---------------------------------------------------------------------------
  // BackendEndpointConfig.isSafeBackendBaseUrl
  // ---------------------------------------------------------------------------

  group('BackendEndpointConfig.isSafeBackendBaseUrl', () {
    test('valid http URL is safe', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl('http://localhost:8787'),
        isTrue,
      );
    });

    test('valid https URL is safe', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl('https://api.example.com'),
        isTrue,
      );
    });

    test('URL with userinfo is NOT safe', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl(
          'http://user:pass@example.com',
        ),
        isFalse,
      );
    });

    test('URL with api_key pattern is NOT safe', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl(
          'http://example.com?api_key=abc',
        ),
        isFalse,
      );
    });

    test('URL with secret pattern is NOT safe', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl(
          'http://example.com?secret=xyz',
        ),
        isFalse,
      );
    });

    test('non-http scheme is NOT safe', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl('ftp://example.com'),
        isFalse,
      );
    });

    test('gibberish is NOT safe', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl('gibberish'),
        isFalse,
      );
    });

    test('URL with safe query params is safe', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl(
          'http://example.com?version=2&lang=en',
        ),
        isTrue,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // BackendEndpointConfig.localDevUrl constant
  // ---------------------------------------------------------------------------

  group('BackendEndpointConfig.localDevUrl', () {
    test('is the expected development default', () {
      expect(BackendEndpointConfig.localDevUrl, 'http://localhost:8787');
    });

    test('starts with http (not https in dev)', () {
      expect(
        BackendEndpointConfig.localDevUrl.startsWith('http://'),
        isTrue,
      );
    });

    test('is safe by its own isSafeBackendBaseUrl check', () {
      expect(
        BackendEndpointConfig.isSafeBackendBaseUrl(
          BackendEndpointConfig.localDevUrl,
        ),
        isTrue,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // BackendEndpointConfig — no secrets check
  // ---------------------------------------------------------------------------

  group('BackendEndpointConfig — secret hygiene', () {
    test('localDevUrl does not contain API keys or secrets', () {
      expect(
        BackendEndpointConfig.localDevUrl.contains('api_key'),
        isFalse,
      );
      expect(
        BackendEndpointConfig.localDevUrl.contains('secret'),
        isFalse,
      );
      expect(
        BackendEndpointConfig.localDevUrl.contains('token'),
        isFalse,
      );
    });

    test('validateAndResolve never leaks fallback contents with secrets', () {
      // Even a malicious fallback containing secrets is safe because
      // validateAndResolve always returns the fallback as-is — it never
      // appends secrets to it. This test verifies fallback passthrough.
      const fallback = 'http://safe-fallback:3000';
      final result = BackendEndpointConfig.validateAndResolve(
        'http://bad.com?api_key=secret',
        fallback: fallback,
      );
      expect(result, fallback);
    });
  });
}
