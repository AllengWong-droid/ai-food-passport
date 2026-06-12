import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/models/models.dart';
import '../domain/repositories/repositories.dart';
import 'mock_data.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return MockAuthRepository();
});

final passportRepositoryProvider = Provider<PassportRepository>((ref) {
  return MockPassportRepository();
});

final homeRepositoryProvider = Provider<MockHomeRepository>((ref) {
  return MockHomeRepository();
});

final scanRepositoryProvider = Provider<ScanRepository>((ref) {
  return MockScanRepository();
});

final ocrRepositoryProvider = Provider<OcrRepository>((ref) {
  return MockOcrRepository();
});

final aiRepositoryProvider = Provider<AiRepository>((ref) {
  return MockAiRepository();
});

final priceRepositoryProvider = Provider<PriceRepository>((ref) {
  return MockPriceRepository();
});

final currentUserProvider = Provider<UserModel>((ref) {
  return ref.watch(authRepositoryProvider).currentUser();
});

final tastePassportProvider = Provider<TastePassportModel>((ref) {
  return ref.watch(passportRepositoryProvider).loadPassport();
});

final recentCrossingsProvider = Provider<List<RecentCrossingModel>>((ref) {
  return ref.watch(homeRepositoryProvider).loadRecentCrossings();
});

final latestScanProvider = StateProvider<ScanModel>((ref) {
  return mockScan;
});

final latestOcrResultProvider = StateProvider<OcrResult?>((ref) {
  return null;
});

final latestAiAnalysisRequestProvider = StateProvider<AiAnalysisRequest?>((ref) {
  return null;
});

final dishAnalysesProvider = StateProvider<List<DishAnalysisModel>>((ref) {
  return ref.watch(aiRepositoryProvider).loadLatestResults();
});

final dishByIdProvider = Provider.family<DishAnalysisModel, String>((ref, dishId) {
  final dishes = ref.watch(dishAnalysesProvider);
  final aiRepository = ref.watch(aiRepositoryProvider);

  return dishes.firstWhere(
    (item) => item.id == dishId,
    orElse: () => aiRepository.loadDish(dishId),
  );
});

class MockAuthRepository implements AuthRepository {
  @override
  UserModel currentUser() => mockUser;

  @override
  UserModel signInWithApple() => mockUser;

  @override
  UserModel signInWithGoogle() => mockUser;

  @override
  UserModel continueAsGuest() => mockUser;
}

class MockPassportRepository implements PassportRepository {
  @override
  TastePassportModel loadPassport() => mockPassport;

  @override
  TastePassportModel saveDemoPassport() => mockPassport;
}

class MockHomeRepository {
  List<RecentCrossingModel> loadRecentCrossings() => mockRecentCrossings;
}

class MockScanRepository implements ScanRepository {
  @override
  ScanModel captureDemoScan() => mockScan;

  @override
  ScanModel createScanFromImage(String imagePath) {
    final normalizedPath = imagePath.toLowerCase();
    final isChineseMenu =
        normalizedPath.contains('china') ||
        normalizedPath.contains('chinese') ||
        normalizedPath.contains('zh');
    final isEnglishMenu =
        normalizedPath.contains('english') ||
        normalizedPath.contains('harbor') ||
        normalizedPath.contains('en');

    return ScanModel(
      scanId: 'scan-${DateTime.now().millisecondsSinceEpoch}',
      imagePath: imagePath,
      restaurantCountry: isChineseMenu
          ? 'China'
          : isEnglishMenu
              ? 'United States'
              : 'Japan',
      restaurantCity: isChineseMenu
          ? 'Shanghai'
          : isEnglishMenu
              ? 'Seattle'
              : 'Tokyo',
      localCurrency: isChineseMenu
          ? 'CNY'
          : isEnglishMenu
              ? 'USD'
              : 'JPY',
      createdAt: DateTime.now(),
    );
  }
}

class MockOcrRepository implements OcrRepository {
  @override
  Future<OcrResult> extractText(String imagePath) async {
    await Future<void>.delayed(const Duration(milliseconds: 450));

    final normalizedPath = imagePath.toLowerCase();
    if (normalizedPath.contains('china') ||
        normalizedPath.contains('chinese') ||
        normalizedPath.contains('zh')) {
      return OcrResult(
        rawText: mockChineseMenuText,
        detectedLanguage: 'Chinese',
        confidence: 0.92,
        source: 'mock_chinese',
        createdAt: DateTime.now(),
      );
    }
    if (normalizedPath.contains('english') ||
        normalizedPath.contains('harbor') ||
        normalizedPath.contains('en')) {
      return OcrResult(
        rawText: mockEnglishMenuText,
        detectedLanguage: 'English',
        confidence: 0.96,
        source: 'mock_english',
        createdAt: DateTime.now(),
      );
    }

    return OcrResult(
      rawText: mockJapaneseMenuText,
      detectedLanguage: 'Japanese',
      confidence: 0.94,
      source: 'mock_japanese',
      createdAt: DateTime.now(),
    );
  }
}

class MockAiRepository implements AiRepository {
  @override
  Future<List<DishAnalysisModel>> analyzeMenu(AiAnalysisRequest request) async {
    await Future<void>.delayed(const Duration(milliseconds: 350));

    final rawText = request.ocrResult.rawText.toLowerCase();
    final allergySummary = request.tastePassport.allergies.isEmpty
        ? 'your listed allergens'
        : request.tastePassport.allergies.join(', ');
    final tasteSummary = request.tastePassport.tastePreferences.isEmpty
        ? 'your taste profile'
        : request.tastePassport.tastePreferences.join(', ');
    final dietarySummary = request.tastePassport.dietaryPreferences.isEmpty
        ? 'your dietary preferences'
        : request.tastePassport.dietaryPreferences.join(', ');

    if (request.ocrResult.detectedLanguage == 'Chinese' ||
        rawText.contains('kung pao') ||
        rawText.contains('mapo')) {
      return [
        DishAnalysisModel(
          dishName: 'Mapo Tofu',
          localName: 'Mapo Doufu',
          description: 'Silken tofu in a spicy bean paste sauce with Sichuan pepper.',
          tasteScore: tasteSummary.toLowerCase().contains('savory') ? 91 : 84,
          safetyScore: allergySummary.toLowerCase().contains('soy') ? 72 : 86,
          valueScore: 88,
          foodConfidenceScore: 90,
          priceIntelligence: PriceIntelligenceModel(
            localPrice: 42,
            localCurrency: request.localCurrency,
            homePrice: 5.80,
            homeCurrency: request.userHomeCurrency,
            exchangeRate: 0.138,
            assessment: PriceAssessment.cheap,
          ),
          recommendationReason:
              'Mock AI matched this against $tasteSummary and checked $allergySummary from the ${request.restaurantCountry} menu OCR.',
          ingredients: ['Tofu', 'Chili bean paste', 'Scallion', 'Sichuan pepper'],
          allergens: ['Soy'],
          dietaryFlags: [dietarySummary],
          hiddenIngredients: ['Bean paste may contain wheat'],
          imageSeed: 'skewer',
        ),
        DishAnalysisModel(
          dishName: 'Stir-Fried Greens',
          localName: 'Qingchao Shishu',
          description: 'Seasonal vegetables quickly fried with garlic.',
          tasteScore: 86,
          safetyScore: 92,
          valueScore: 84,
          foodConfidenceScore: 87,
          priceIntelligence: PriceIntelligenceModel(
            localPrice: 38,
            localCurrency: request.localCurrency,
            homePrice: 5.24,
            homeCurrency: request.userHomeCurrency,
            exchangeRate: 0.138,
            assessment: PriceAssessment.cheap,
          ),
          recommendationReason:
              'A lighter option aligned with $dietarySummary, with fewer allergen flags in the mock OCR text.',
          ingredients: ['Seasonal vegetables', 'Garlic', 'Cooking oil'],
          allergens: [],
          dietaryFlags: ['Vegetable-forward'],
          hiddenIngredients: ['Possible wok cross-contact'],
          imageSeed: 'porridge',
        ),
      ];
    }

    if (request.ocrResult.detectedLanguage == 'English' ||
        rawText.contains('salmon') ||
        rawText.contains('risotto')) {
      return [
        DishAnalysisModel(
          dishName: 'Roasted Mushroom Risotto',
          description: 'Creamy rice with roasted mushrooms and herbs.',
          tasteScore: 89,
          safetyScore: allergySummary.toLowerCase().contains('dairy') ? 78 : 88,
          valueScore: 79,
          foodConfidenceScore: 91,
          priceIntelligence: PriceIntelligenceModel(
            localPrice: 18,
            localCurrency: request.localCurrency,
            homePrice: 18,
            homeCurrency: request.userHomeCurrency,
            exchangeRate: 1,
            assessment: PriceAssessment.fair,
          ),
          recommendationReason:
              'Mock AI selected this as a strong fit for $tasteSummary while checking $allergySummary.',
          ingredients: ['Rice', 'Mushrooms', 'Parmesan', 'Butter', 'Herbs'],
          allergens: ['Dairy'],
          dietaryFlags: [dietarySummary],
          hiddenIngredients: ['Stock may contain meat or dairy'],
          imageSeed: 'cod',
        ),
        DishAnalysisModel(
          dishName: 'Peanut Sesame Slaw',
          description: 'Crisp vegetable slaw with peanut sesame dressing.',
          tasteScore: 76,
          safetyScore: allergySummary.toLowerCase().contains('peanut') ? 54 : 82,
          valueScore: 86,
          foodConfidenceScore: 88,
          priceIntelligence: PriceIntelligenceModel(
            localPrice: 12,
            localCurrency: request.localCurrency,
            homePrice: 12,
            homeCurrency: request.userHomeCurrency,
            exchangeRate: 1,
            assessment: PriceAssessment.cheap,
          ),
          recommendationReason:
              'Flagged by mock AI because the OCR text includes peanut and sesame allergen notes.',
          ingredients: ['Cabbage', 'Carrot', 'Peanut', 'Sesame'],
          allergens: ['Peanut', 'Sesame'],
          dietaryFlags: ['Vegetarian-friendly'],
          hiddenIngredients: ['Shared prep surfaces'],
          imageSeed: 'skewer',
        ),
      ];
    }

    return [
      for (final dish in mockDishAnalyses)
        DishAnalysisModel(
          dishName: dish.dishName,
          localName: dish.localName,
          description: dish.description,
          ingredients: dish.ingredients,
          allergens: dish.allergens,
          tasteScore: dish.tasteScore,
          safetyScore: dish.safetyScore,
          valueScore: dish.valueScore,
          recommendationReason:
              '${dish.recommendationReason} Mock AI used $tasteSummary, $dietarySummary, and allergen checks for $allergySummary in ${request.restaurantCity}.',
          priceIntelligence: PriceIntelligenceModel(
            localPrice: dish.priceIntelligence.localPrice,
            localCurrency: request.localCurrency,
            homePrice: dish.priceIntelligence.homePrice,
            homeCurrency: request.userHomeCurrency,
            exchangeRate: dish.priceIntelligence.exchangeRate,
            assessment: dish.priceIntelligence.assessment,
          ),
          foodConfidenceScore: dish.foodConfidenceScore,
          dietaryFlags: dish.dietaryFlags,
          hiddenIngredients: dish.hiddenIngredients,
          imageSeed: dish.imageSeed,
        ),
    ];
  }

  @override
  List<DishAnalysisModel> loadLatestResults() => mockDishAnalyses;

  @override
  DishAnalysisModel loadDish(String dishId) {
    return mockDishAnalyses.firstWhere(
      (item) => item.id == dishId,
      orElse: () => mockDishAnalyses.first,
    );
  }
}

class MockPriceRepository implements PriceRepository {
  @override
  PriceIntelligenceModel assessPrice({
    required num localPrice,
    required String localCurrency,
    required String homeCurrency,
  }) {
    const exchangeRate = 0.00675;
    final homePrice = localCurrency == homeCurrency ? localPrice : localPrice * exchangeRate;
    final assessment = switch (homePrice) {
      < 8 => PriceAssessment.cheap,
      > 15 => PriceAssessment.expensive,
      _ => PriceAssessment.fair,
    };

    return PriceIntelligenceModel(
      localPrice: localPrice,
      localCurrency: localCurrency,
      homePrice: homePrice,
      homeCurrency: homeCurrency,
      exchangeRate: exchangeRate,
      assessment: assessment,
    );
  }
}
