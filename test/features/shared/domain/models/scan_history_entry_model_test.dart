import 'package:ai_food_passport/features/shared/domain/models/scan_history_entry_model.dart';
import 'package:ai_food_passport/features/shared/domain/models/models.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../../helpers/test_models.dart';

void main() {
  // ---------------------------------------------------------------------------
  // ScanHistoryEntry — model creation
  // ---------------------------------------------------------------------------

  group('ScanHistoryEntry model creation', () {
    test('stores timestamp', () {
      final entry = TestModels.createHistoryEntry();
      expect(entry.timestamp, isA<DateTime>());
    });

    test('stores dish count', () {
      final entry = TestModels.createHistoryEntry();
      expect(entry.dishCount, greaterThan(0));
    });

    test('stores dishNamesSummary', () {
      final entry = TestModels.createHistoryEntry();
      expect(entry.dishNamesSummary, isA<String>());
      expect(entry.dishNamesSummary.isNotEmpty, isTrue);
    });

    test('stores sourceMode', () {
      final entry = TestModels.createHistoryEntry();
      expect(entry.sourceMode, isA<String>());
      expect(entry.sourceMode.isNotEmpty, isTrue);
    });

    test('stores scan', () {
      final entry = TestModels.createHistoryEntry();
      expect(entry.scan, isA<ScanModel>());
    });

    test('stores ocrResult', () {
      final entry = TestModels.createHistoryEntry();
      expect(entry.ocrResult, isA<OcrResult>());
    });

    test('stores aiAnalysisRequest', () {
      final entry = TestModels.createHistoryEntry();
      expect(entry.aiAnalysisRequest, isA<AiAnalysisRequest>());
    });

    test('stores dishAnalyses', () {
      final entry = TestModels.createHistoryEntry();
      expect(entry.dishAnalyses, isA<List<DishAnalysisModel>>());
      expect(entry.dishAnalyses.isNotEmpty, isTrue);
    });
  });

  // ---------------------------------------------------------------------------
  // ScanHistoryEntry.fromAnalysisState — dishNamesSummary logic
  // ---------------------------------------------------------------------------

  group('ScanHistoryEntry.fromAnalysisState — dishNamesSummary', () {
    test('uses comma-separated list for 1 dish', () {
      final dishes = [TestModels.createDishAnalysis(name: 'Pasta')];
      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: TestModels.createScan(),
        ocrResult: TestModels.createOcrResult(),
        aiAnalysisRequest: TestModels.createAnalysisRequest(),
        dishAnalyses: dishes,
        sourceMode: 'Mock',
      );
      expect(entry.dishNamesSummary, 'Pasta');
    });

    test('uses comma-separated list for 2 dishes', () {
      final dishes = [
        TestModels.createDishAnalysis(name: 'Pasta'),
        TestModels.createDishAnalysis(name: 'Pizza'),
      ];
      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: TestModels.createScan(),
        ocrResult: TestModels.createOcrResult(),
        aiAnalysisRequest: TestModels.createAnalysisRequest(),
        dishAnalyses: dishes,
        sourceMode: 'Mock',
      );
      expect(entry.dishNamesSummary, 'Pasta, Pizza');
    });

    test('uses "+N more" format for 3+ dishes', () {
      final dishes = [
        TestModels.createDishAnalysis(name: 'Pasta'),
        TestModels.createDishAnalysis(name: 'Pizza'),
        TestModels.createDishAnalysis(name: 'Salad'),
      ];
      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: TestModels.createScan(),
        ocrResult: TestModels.createOcrResult(),
        aiAnalysisRequest: TestModels.createAnalysisRequest(),
        dishAnalyses: dishes,
        sourceMode: 'Mock',
      );
      expect(entry.dishNamesSummary, contains('+1 more'));
    });

    test('uses "+N more" format for 4+ dishes', () {
      final dishes = [
        TestModels.createDishAnalysis(name: 'Pasta'),
        TestModels.createDishAnalysis(name: 'Pizza'),
        TestModels.createDishAnalysis(name: 'Salad'),
        TestModels.createDishAnalysis(name: 'Soup'),
      ];
      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: TestModels.createScan(),
        ocrResult: TestModels.createOcrResult(),
        aiAnalysisRequest: TestModels.createAnalysisRequest(),
        dishAnalyses: dishes,
        sourceMode: 'Mock',
      );
      expect(entry.dishNamesSummary, contains('+2 more'));
    });
  });

  // ---------------------------------------------------------------------------
  // ScanHistoryEntry.fromAnalysisState — sourceMode
  // ---------------------------------------------------------------------------

  group('ScanHistoryEntry.fromAnalysisState — sourceMode', () {
    test('stores "Backend Mock" source mode', () {
      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: TestModels.createScan(),
        ocrResult: TestModels.createOcrResult(),
        aiAnalysisRequest: TestModels.createAnalysisRequest(),
        dishAnalyses: [TestModels.createDishAnalysis()],
        sourceMode: 'Backend Mock',
      );
      expect(entry.sourceMode, 'Backend Mock');
    });

    test('stores "Mock AI" source mode', () {
      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: TestModels.createScan(),
        ocrResult: TestModels.createOcrResult(),
        aiAnalysisRequest: TestModels.createAnalysisRequest(),
        dishAnalyses: [TestModels.createDishAnalysis()],
        sourceMode: 'Mock AI',
      );
      expect(entry.sourceMode, 'Mock AI');
    });
  });
}
