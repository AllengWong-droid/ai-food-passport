/// Test helpers for creating mock model instances.
library;

import 'package:ai_food_passport/features/shared/domain/models/models.dart';

/// Helper class for creating test model instances.
class TestModels {
  /// Creates a test [ScanModel] instance.
  static ScanModel createScan({
    String scanId = 'test-scan-001',
    String imagePath = 'test/path/photo.jpg',
    String restaurantCountry = 'Japan',
    String restaurantCity = 'Tokyo',
    String localCurrency = 'JPY',
  }) {
    return ScanModel(
      scanId: scanId,
      imagePath: imagePath,
      restaurantCountry: restaurantCountry,
      restaurantCity: restaurantCity,
      localCurrency: localCurrency,
      createdAt: DateTime(2026, 6, 15, 12, 0),
    );
  }

  /// Creates a test [OcrResult] instance.
  static OcrResult createOcrResult({
    String rawText = 'Test menu text',
    String detectedLanguage = 'en',
    double confidence = 0.95,
    String source = 'mock',
  }) {
    return OcrResult(
      rawText: rawText,
      detectedLanguage: detectedLanguage,
      confidence: confidence,
      source: source,
      createdAt: DateTime(2026, 6, 15, 12, 0),
    );
  }

  /// Creates a test [AiAnalysisRequest] instance.
  static AiAnalysisRequest createAnalysisRequest({
    String userHomeCountry = 'United States',
    String userHomeCurrency = 'USD',
    String restaurantCountry = 'Japan',
    String restaurantCity = 'tokyo',
    String localCurrency = 'JPY',
    String outputLanguage = 'en-US',
    AiProviderMode providerMode = AiProviderMode.mock,
  }) {
    return AiAnalysisRequest(
      ocrResult: createOcrResult(),
      tastePassport: createTastePassport(),
      scan: createScan(),
      userHomeCountry: userHomeCountry,
      userHomeCurrency: userHomeCurrency,
      restaurantCountry: restaurantCountry,
      restaurantCity: restaurantCity,
      localCurrency: localCurrency,
      outputLanguage: outputLanguage,
      providerMode: providerMode,
    );
  }

  /// Creates a test [TastePassportModel] instance.
  static TastePassportModel createTastePassport({
    TravelStyle travelStyle = TravelStyle.standard,
    List<String> dietaryPreferences = const [],
    List<String> allergies = const [],
    List<String> tastePreferences = const ['Savory', 'Umami'],
  }) {
    return TastePassportModel(
      travelStyle: travelStyle,
      dietaryPreferences: dietaryPreferences,
      allergies: allergies,
      tastePreferences: tastePreferences,
    );
  }

  /// Creates a test [DishAnalysisModel] instance.
  static DishAnalysisModel createDishAnalysis({
    String name = 'Test Dish',
    String description = 'A test dish description',
    List<String> ingredients = const ['ingredient1', 'ingredient2'],
    List<String> allergens = const [],
    int tasteScore = 80,
    int safetyScore = 90,
    int valueScore = 85,
    String recommendationReason = 'Test recommendation',
    num localPrice = 1000,
    num homePrice = 8,
  }) {
    return DishAnalysisModel(
      dishName: name,
      description: description,
      ingredients: ingredients,
      allergens: allergens,
      tasteScore: tasteScore,
      safetyScore: safetyScore,
      valueScore: valueScore,
      recommendationReason: recommendationReason,
      priceIntelligence: PriceIntelligenceModel(
        localPrice: localPrice,
        localCurrency: 'JPY',
        homePrice: homePrice,
        homeCurrency: 'USD',
        exchangeRate: 150.0,
        assessment: PriceAssessment.goodValue,
      ),
    );
  }

  /// Creates a test [ScanHistoryEntry] instance.
  static ScanHistoryEntry createHistoryEntry({
    String sourceMode = 'Mock',
    int dishCount = 3,
  }) {
    final dishes = List.generate(
      dishCount,
      (i) => createDishAnalysis(name: 'Dish ${i + 1}'),
    );

    return ScanHistoryEntry.fromAnalysisState(
      scan: createScan(),
      ocrResult: createOcrResult(),
      aiAnalysisRequest: createAnalysisRequest(),
      dishAnalyses: dishes,
      sourceMode: sourceMode,
    );
  }
}
