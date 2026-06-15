import 'package:ai_food_passport/features/shared/data/mock_repositories.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../helpers/test_models.dart';

void main() {
  // ---------------------------------------------------------------------------
  // scanHistoryProvider — behavior
  // ---------------------------------------------------------------------------

  group('scanHistoryProvider', () {
    late ProviderContainer container;

    setUp(() {
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    test('starts empty', () {
      final history = container.read(scanHistoryProvider);
      expect(history, isEmpty);
    });

    test('can add an entry', () {
      final entry = TestModels.createHistoryEntry();

      container.read(scanHistoryProvider.notifier).state = [entry];

      final history = container.read(scanHistoryProvider);
      expect(history, hasLength(1));
      expect(history.first.dishCount, greaterThan(0));
    });

    test('can add multiple entries', () {
      final entry1 = TestModels.createHistoryEntry(sourceMode: 'Mock');
      final entry2 = TestModels.createHistoryEntry(sourceMode: 'Backend');

      container.read(scanHistoryProvider.notifier).state = [entry1, entry2];

      final history = container.read(scanHistoryProvider);
      expect(history, hasLength(2));
    });

    test('newest entry is first (prepend logic)', () {
      final entry1 = TestModels.createHistoryEntry();
      final entry2 = TestModels.createHistoryEntry();

      // Simulate the prepend logic from ScanScreen
      container.read(scanHistoryProvider.notifier).state = [
        entry2,
        ...container.read(scanHistoryProvider),
      ];
      container.read(scanHistoryProvider.notifier).state = [
        entry1,
        ...container.read(scanHistoryProvider),
      ];

      final history = container.read(scanHistoryProvider);
      expect(history, hasLength(2));
      // The first entry should be entry1 (newest first)
      expect(history.first.sourceMode, entry1.sourceMode);
    });

    test('can clear all entries', () {
      final entry = TestModels.createHistoryEntry();

      // Add an entry
      container.read(scanHistoryProvider.notifier).state = [entry];
      expect(container.read(scanHistoryProvider), hasLength(1));

      // Clear all entries
      container.read(scanHistoryProvider.notifier).state = [];

      final history = container.read(scanHistoryProvider);
      expect(history, isEmpty);
    });

    test('stores timestamp for each entry', () {
      final entry = TestModels.createHistoryEntry();
      container.read(scanHistoryProvider.notifier).state = [entry];

      final history = container.read(scanHistoryProvider);
      expect(history.first.timestamp, isA<DateTime>());
    });

    test('stores dish count for each entry', () {
      final entry = TestModels.createHistoryEntry(dishCount: 3);
      container.read(scanHistoryProvider.notifier).state = [entry];

      final history = container.read(scanHistoryProvider);
      expect(history.first.dishCount, 3);
    });

    test('stores dishNamesSummary for each entry', () {
      final entry = TestModels.createHistoryEntry();
      container.read(scanHistoryProvider.notifier).state = [entry];

      final history = container.read(scanHistoryProvider);
      expect(history.first.dishNamesSummary, isNotEmpty);
    });

    test('stores sourceMode for each entry', () {
      final entry = TestModels.createHistoryEntry(sourceMode: 'Backend Mock');
      container.read(scanHistoryProvider.notifier).state = [entry];

      final history = container.read(scanHistoryProvider);
      expect(history.first.sourceMode, 'Backend Mock');
    });
  });
}
