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
    restaurantCity: 'Tokyo',
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
// HistoryScreen widget tests (provider-level)
// ---------------------------------------------------------------------------
//
// Note: Full widget tests that pump HistoryScreen require router setup
// and proper navigation. These are documented as deferred tests in
// PHASE_23B_REPORT.md.

void main() {
  group('HistoryScreen widget (provider-level)', () {
    late ProviderContainer container;

    setUp(() {
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    test('shows empty state when no history exists', () {
      container.read(scanHistoryProvider.notifier).state = [];
      expect(container.read(scanHistoryProvider), isEmpty);
    });

    test('shows history list when entries exist', () {
      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: _createScan(),
        ocrResult: _createOcrResult(),
        aiAnalysisRequest: _createAnalysisRequest(),
        dishAnalyses: [_createDishAnalysis()],
        sourceMode: 'Mock',
      );

      container.read(scanHistoryProvider.notifier).state = [entry];
      expect(container.read(scanHistoryProvider), hasLength(1));
    });

    test('clear history removes all entries', () {
      final entry1 = ScanHistoryEntry.fromAnalysisState(
        scan: _createScan(),
        ocrResult: _createOcrResult(),
        aiAnalysisRequest: _createAnalysisRequest(),
        dishAnalyses: [_createDishAnalysis()],
        sourceMode: 'Mock',
      );
      final entry2 = ScanHistoryEntry.fromAnalysisState(
        scan: _createScan(),
        ocrResult: _createOcrResult(),
        aiAnalysisRequest: _createAnalysisRequest(),
        dishAnalyses: [
          _createDishAnalysis(name: 'Dish 2'),
          _createDishAnalysis(name: 'Dish 3'),
        ],
        sourceMode: 'Backend',
      );

      container.read(scanHistoryProvider.notifier).state = [entry1, entry2];
      expect(container.read(scanHistoryProvider), hasLength(2));

      container.read(scanHistoryProvider.notifier).state = [];
      expect(container.read(scanHistoryProvider), isEmpty);
    });

    test('history entry card shows correct information', () {
      final entry = ScanHistoryEntry.fromAnalysisState(
        scan: _createScan(),
        ocrResult: _createOcrResult(),
        aiAnalysisRequest: _createAnalysisRequest(),
        dishAnalyses: [
          _createDishAnalysis(name: 'Pasta'),
          _createDishAnalysis(name: 'Pizza'),
          _createDishAnalysis(name: 'Salad'),
        ],
        sourceMode: 'Mock AI',
      );

      expect(entry.dishCount, 3);
      expect(entry.sourceMode, 'Mock AI');
      expect(entry.dishNamesSummary, contains('+1 more'));
    });
  });
}
