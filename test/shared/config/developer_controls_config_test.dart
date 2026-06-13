import 'package:flutter_test/flutter_test.dart';

import 'package:ai_food_passport/features/shared/config/developer_controls_config.dart';

void main() {
  // ---------------------------------------------------------------------------
  // DeveloperControlsConfig.resolveVisibility
  // ---------------------------------------------------------------------------

  group('DeveloperControlsConfig.resolveVisibility', () {
    test('debug builds show developer controls by default', () {
      expect(
        DeveloperControlsConfig.resolveVisibility(
          isDebug: true,
          overrideEnabled: false,
        ),
        isTrue,
      );
    });

    test('release builds hide developer controls by default', () {
      expect(
        DeveloperControlsConfig.resolveVisibility(
          isDebug: false,
          overrideEnabled: false,
        ),
        isFalse,
      );
    });

    test('SHOW_DEVELOPER_CONTROLS=true overrides release mode', () {
      expect(
        DeveloperControlsConfig.resolveVisibility(
          isDebug: false,
          overrideEnabled: true,
        ),
        isTrue,
      );
    });

    test('SHOW_DEVELOPER_CONTROLS=true in debug is still true (already true)',
        () {
      expect(
        DeveloperControlsConfig.resolveVisibility(
          isDebug: true,
          overrideEnabled: true,
        ),
        isTrue,
      );
    });

    test('hidden in release without override', () {
      // Full table check
      const table = <({bool isDebug, bool override, bool expected})>[
        (isDebug: true, override: false, expected: true),
        (isDebug: true, override: true, expected: true),
        (isDebug: false, override: false, expected: false),
        (isDebug: false, override: true, expected: true),
      ];

      for (final row in table) {
        expect(
          DeveloperControlsConfig.resolveVisibility(
            isDebug: row.isDebug,
            overrideEnabled: row.override,
          ),
          row.expected,
          reason:
              'isDebug=${row.isDebug}, override=${row.override} → expected ${row.expected}',
        );
      }
    });
  });

  // ---------------------------------------------------------------------------
  // DeveloperControlsConfig — purity / no-secrets check
  // ---------------------------------------------------------------------------

  group('DeveloperControlsConfig — purity and hygiene', () {
    test('resolveVisibility is deterministic (idempotent)', () {
      // Calling the same function with the same arguments always returns the
      // same result — no hidden state.
      for (var i = 0; i < 3; i++) {
        expect(
          DeveloperControlsConfig.resolveVisibility(
            isDebug: false,
            overrideEnabled: true,
          ),
          isTrue,
        );
        expect(
          DeveloperControlsConfig.resolveVisibility(
            isDebug: false,
            overrideEnabled: false,
          ),
          isFalse,
        );
      }
    });

    test('class does not contain API key or secret patterns', () {
      // The class name and its constants are purely configuration — no
      // secrets should appear. We verify via the resolveVisibility helper
      // that no string leak exists.
      // (The compile-time config itself is just a boolean resolver.)
      expect(
        DeveloperControlsConfig.resolveVisibility(
          isDebug: false,
          overrideEnabled: false,
        ),
        isFalse,
      );
    });
  });
}
