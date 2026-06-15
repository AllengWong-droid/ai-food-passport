import 'package:ai_food_passport/features/shared/data/mock_repositories.dart';
import 'package:ai_food_passport/features/shared/domain/models/models.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

// ---------------------------------------------------------------------------
// Inline test helpers (avoiding import path issues)
// ---------------------------------------------------------------------------

ScanModel _createScan() {
  return ScanModel(
    scanId: 'test-scan-001',
    imagePath: 'test/path/photo.jpg',
    restaurantCountry: 'Japan',
    restaurantCity: 'Tokyo',
    localCurrency: 'JPY',
    createdAt: DateTime(2026, 6, 15, 12, 0),
  );
}

OcrResult _createOcrResult() {
  return OcrResult(
    rawText: 'Test menu text',
    detectedLanguage: 'en',
    confidence: 0.95,
    source: 'mock',
    createdAt: DateTime(2026, 6, 15, 12, 0),
  );
}

AiAnalysisRequest _createAnalysisRequest() {
  return AiAnalysisRequest(
    ocrResult: _createOcrResult(),
    tastePassport: TastePassportModel(
      travelStyle: TravelStyle.standard,
      dietaryPreferences: [],
      allergies: [],
      tastePreferences: ['Savory', 'Umami'],
    ),
    scan: _createScan(),
    userHomeCountry: 'United States',
    userHomeCurrency: 'USD',
    restaurantCountry: 'Japan',
    restaurantCity: 'tokyo',
    localCurrency: 'JPY',
    outputLanguage: 'en-US',
    providerMode: AiProviderMode.mock,
  );
}

DishAnalysisModel _createDishAnalysis({String name = 'Test Dish'}) {
  return DishAnalysisModel(
    dishName: name,
    description: 'A test dish',
    ingredients: ['ingredient1', 'ingredient2'],
    allergens: [],
    tasteScore: 80,
    safetyScore: 90,
    valueScore: 85,
    recommendationReason: 'Test recommendation',
    priceIntelligence: PriceIntelligenceModel(
      localPrice: 1000,
      localCurrency: 'JPY',
      homePrice: 8,
      homeCurrency: 'USD',
      exchangeRate: 150.0,
      assessment: PriceAssessment.goodValue,
    ),
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

void main() {
  group('ScanScreen history integration (provider-level)', () {
    late ProviderContainer container;

    setUp(() {
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    test('successful analysis creates a history entry', () {
      final scan = _createScan();
      final ocrResult = _createOcrResult();
      final analysisRequest = _createAnalysisRequest();
      final dishes = [
        _createDishAnalysis(name: 'Pasta'),
        _createDishAnalysis(name: 'Pizza'),
      ];

      container.read(dishAnalysesProvider.notifier).state = dishes;

      final historyEntry = ScanHistoryEntry.fromAnalysisState(
        scan: scan,
        ocrResult: ocrResult,
        aiAnalysisRequest: analysisRequest,
        dishAnalyses: container.read(dishAnalysesProvider),
        sourceMode: 'Mock AI',
      );

      container.read(scanHistoryProvider.notifier).state = [
        historyEntry,
        ...container.read(scanHistoryProvider),
      ];

      final history = container.read(scanHistoryProvider);
      expect(history, hasLength(1));
      expect(history.first.dishCount, 2);
      expect(history.first.dishNamesSummary, contains('Pasta'));
      expect(history.first.sourceMode, 'Mock AI');
    });

    test('multiple successful analyses create multiple history entries', () {
      final dishes1 = [_createDishAnalysis(name: 'Pasta')];
      final dishes2 = [
        _createDishAnalysis(name: 'Pizza'),
        _createDishAnalysis(name: 'Salad'),
      ];

      container.read(dishAnalysesProvider.notifier).state = dishes1;
      final entry1 = ScanHistoryEntry.fromAnalysisState(
        scan: _createScan(),
        ocrResult: _createOcrResult(),
        aiAnalysisRequest: _createAnalysisRequest(),
        dishAnalyses: container.read(dishAnalysesProvider),
        sourceMode: 'Mock AI',
      );
      container.read(scanHistoryProvider.notifier).state = [
        entry1,
        ...container.read(scanHistoryProvider),
      ];

      container.read(dishAnalysesProvider.notifier).state = dishes2;
      final entry2 = ScanHistoryEntry.fromAnalysisState(
        scan: _createScan(),
        ocrResult: _createOcrResult(),
        aiAnalysisRequest: _createAnalysisRequest(),
        dishAnalyses: container.read(dishAnalysesProvider),
        sourceMode: 'Backend Mock',
      );
      container.read(scanHistoryProvider.notifier).state = [
        entry2,
        ...container.read(scanHistoryProvider),
      ];

      final history = container.read(scanHistoryProvider);
      expect(history, hasLength(2));
      expect(history.first.dishCount, 2);
      expect(history.last.dishCount, 1);
    });

    test('history entry stores correct dish count and summary', () {
      final dishes = [
        _createDishAnalysis(name: 'Pasta'),
        _createDishAnalysis(name: 'Pizza'),
        _createDishAnalysis(name: 'Salad'),
      ];

      container.read(dishAnalysesProvider.notifier).state = dishes;

      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: _createScan(),
        ocrResult: _createOcrResult(),
        aiAnalysisRequest: _createAnalysisRequest(),
        dishAnalyses: container.read(dishAnalysesProvider),
        sourceMode: 'Mock',
      );

      expect(entry.dishCount, 3);
      expect(entry.dishNamesSummary, contains('+1 more'));
    });

    test('history entry stores source mode correctly', () {
      container.read(dishAnalysesProvider.notifier).state = [
        _createDishAnalysis(),
      ];

      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: _createScan(),
        ocrResult: _createOcrResult(),
        aiAnalysisRequest: _createAnalysisRequest(),
        dishAnalyses: container.read(dishAnalysesProvider),
        sourceMode: 'Backend Mock',
      );

      expect(entry.sourceMode, 'Backend Mock');
    });
  });
}
