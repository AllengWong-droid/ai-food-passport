import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/models/models.dart';
import '../domain/repositories/repositories.dart';
import 'ai/backend_endpoint_config.dart';
import 'ai/backend_routing_metadata.dart';
import 'mock_data.dart';
import 'traveler_settings_controller.dart';

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

final backendMockModeProvider = StateProvider<bool>((ref) {
  return BackendEndpointConfig.isCustomDefined;
});

final backendDebugScenarioProvider = StateProvider<String>((ref) {
  return 'normal';
});

final latestAiProviderLabelProvider = StateProvider<String>((ref) {
  return 'mock_ai';
});

final latestBackendErrorCodeProvider = StateProvider<String?>((ref) {
  return null;
});

final latestBackendRoutingMetadataProvider =
    StateProvider<BackendRoutingMetadata?>((ref) {
  return null;
});

final priceRepositoryProvider = Provider<PriceRepository>((ref) {
  return MockPriceRepository();
});

final travelerSettingsProvider =
    StateNotifierProvider<TravelerSettingsController, TravelerSettingsModel>(
        (ref) {
  return TravelerSettingsController();
});

final currentUserProvider = Provider<UserModel>((ref) {
  final user = ref.watch(authRepositoryProvider).currentUser();
  final settings = ref.watch(travelerSettingsProvider);

  return UserModel(
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    homeCountry: settings.homeCountry,
    homeCurrency: settings.homeCurrency,
  );
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

final latestAiAnalysisRequestProvider =
    StateProvider<AiAnalysisRequest?>((ref) {
  return null;
});

final dishAnalysesProvider = StateProvider<List<DishAnalysisModel>>((ref) {
  return ref.watch(aiRepositoryProvider).loadLatestResults();
});

final dishByIdProvider =
    Provider.family<DishAnalysisModel, String>((ref, dishId) {
  final dishes = ref.watch(dishAnalysesProvider);
  final aiRepository = ref.watch(aiRepositoryProvider);

  return dishes.firstWhere(
    (item) => item.id == dishId,
    orElse: () => aiRepository.loadDish(dishId),
  );
});

final scanHistoryProvider = StateProvider<List<ScanHistoryEntry>>((ref) {
  return [];
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
    final isChineseMenu = normalizedPath.contains('china') ||
        normalizedPath.contains('chinese') ||
        _hasLangCodeToken(normalizedPath, 'zh');
    final isEnglishMenu = normalizedPath.contains('english') ||
        normalizedPath.contains('harbor') ||
        _hasLangCodeToken(normalizedPath, 'en');

    return ScanModel(
      scanId: 'scan-${DateTime.now().millisecondsSinceEpoch}',
      imagePath: imagePath,
      restaurantCountry: isChineseMenu
          ? 'Taiwan'
          : isEnglishMenu
              ? 'United States'
              : 'Japan',
      restaurantCity: isChineseMenu
          ? 'Taipei'
          : isEnglishMenu
              ? 'Seattle'
              : 'Tokyo',
      localCurrency: isChineseMenu
          ? 'TWD'
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
        _hasLangCodeToken(normalizedPath, 'zh')) {
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
        _hasLangCodeToken(normalizedPath, 'en')) {
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
          dishName: 'Beef Noodle Soup',
          localName: 'Niu Rou Mian',
          description:
              'Braised beef noodle soup with rich broth and tender wheat noodles.',
          tasteScore: tasteSummary.toLowerCase().contains('savory') ? 94 : 86,
          safetyScore: allergySummary.toLowerCase().contains('wheat') ? 74 : 88,
          valueScore: 93,
          foodConfidenceScore: 90,
          priceIntelligence: PriceIntelligenceModel(
            localPrice: 180,
            localCurrency: request.localCurrency,
            homePrice: _homePriceFor(
              request.userHomeCurrency,
              localPrice: 180,
              localCurrency: request.localCurrency,
            ),
            homeCurrency: request.userHomeCurrency,
            exchangeRate: _exchangeRateFor(
              request.userHomeCurrency,
              localCurrency: request.localCurrency,
            ),
            assessment: PriceAssessment.goodValue,
          ),
          recommendationReason:
              'Matched the savory broth profile against $tasteSummary and flagged wheat noodles for $allergySummary.',
          ingredients: [
            'Beef',
            'Wheat noodles',
            'Soy-braised broth',
            'Scallion'
          ],
          allergens: ['Wheat', 'Soy'],
          dietaryFlags: ['Beef', dietarySummary],
          hiddenIngredients: ['Broth may include soy sauce and spices'],
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
            localPrice: 120,
            localCurrency: request.localCurrency,
            homePrice: _homePriceFor(
              request.userHomeCurrency,
              localPrice: 120,
              localCurrency: request.localCurrency,
            ),
            homeCurrency: request.userHomeCurrency,
            exchangeRate: _exchangeRateFor(
              request.userHomeCurrency,
              localCurrency: request.localCurrency,
            ),
            assessment: PriceAssessment.cheap,
          ),
          recommendationReason:
              'A lighter option aligned with $dietarySummary, with fewer allergen flags detected.',
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
          dishName: 'Fish and Chips',
          description: 'Crisp battered fish with fries and tartar sauce.',
          tasteScore: 87,
          safetyScore: allergySummary.toLowerCase().contains('wheat') ? 70 : 84,
          valueScore: 80,
          foodConfidenceScore: 91,
          priceIntelligence: PriceIntelligenceModel(
            localPrice: 14.90,
            localCurrency: request.localCurrency,
            homePrice: _homePriceFor(
              request.userHomeCurrency,
              localPrice: 14.90,
              localCurrency: request.localCurrency,
            ),
            homeCurrency: request.userHomeCurrency,
            exchangeRate: _exchangeRateFor(
              request.userHomeCurrency,
              localCurrency: request.localCurrency,
            ),
            assessment: PriceAssessment.fair,
          ),
          recommendationReason:
              'Selected this familiar seafood option for $tasteSummary while checking wheat and fish risks.',
          ingredients: ['White fish', 'Wheat batter', 'Potato', 'Tartar sauce'],
          allergens: ['Fish', 'Wheat', 'Egg'],
          dietaryFlags: ['Seafood', dietarySummary],
          hiddenIngredients: ['Shared fryer oil'],
          imageSeed: 'cod',
        ),
        DishAnalysisModel(
          dishName: 'Peanut Sesame Slaw',
          description: 'Crisp vegetable slaw with peanut sesame dressing.',
          tasteScore: 76,
          safetyScore:
              allergySummary.toLowerCase().contains('peanut') ? 54 : 82,
          valueScore: 86,
          foodConfidenceScore: 88,
          priceIntelligence: PriceIntelligenceModel(
            localPrice: 12,
            localCurrency: request.localCurrency,
            homePrice: _homePriceFor(
              request.userHomeCurrency,
              localPrice: 12,
              localCurrency: request.localCurrency,
            ),
            homeCurrency: request.userHomeCurrency,
            exchangeRate: _exchangeRateFor(
              request.userHomeCurrency,
              localCurrency: request.localCurrency,
            ),
            assessment: PriceAssessment.cheap,
          ),
          recommendationReason:
              'Flagged because peanut and sesame allergen notes were detected in the menu.',
          ingredients: ['Cabbage', 'Carrot', 'Peanut', 'Sesame'],
          allergens: ['Peanut', 'Sesame'],
          dietaryFlags: ['Vegetarian-friendly'],
          hiddenIngredients: ['Shared prep surfaces'],
          imageSeed: 'skewer',
        ),
      ];
    }

    return [
      DishAnalysisModel(
        dishName: 'Tonkotsu Ramen',
        localName: 'Pork Bone Ramen',
        description:
            'Rich pork broth with noodles, egg, scallion, and sliced chashu.',
        ingredients: [
          'Pork broth',
          'Wheat noodles',
          'Egg',
          'Scallion',
          'Chashu'
        ],
        allergens: ['Wheat', 'Egg'],
        tasteScore: tasteSummary.toLowerCase().contains('umami') ? 96 : 88,
        safetyScore: allergySummary.toLowerCase().contains('egg') ? 74 : 86,
        valueScore: 84,
        recommendationReason:
            'Strong umami match for $tasteSummary. Checked $allergySummary before ranking this first.',
        priceIntelligence: PriceIntelligenceModel(
          localPrice: 980,
          localCurrency: request.localCurrency,
          homePrice: _homePriceFor(
            request.userHomeCurrency,
            localPrice: 980,
            localCurrency: request.localCurrency,
          ),
          homeCurrency: request.userHomeCurrency,
          exchangeRate: _exchangeRateFor(
            request.userHomeCurrency,
            localCurrency: request.localCurrency,
          ),
          assessment: PriceAssessment.fair,
        ),
        foodConfidenceScore: 93,
        dietaryFlags: ['Pork', dietarySummary],
        hiddenIngredients: ['Broth may contain soy sauce or fish powder'],
        imageSeed: 'porridge',
      ),
      DishAnalysisModel(
        dishName: 'Miso Katsu Skewers',
        localName: 'Miso Kushikatsu',
        description: 'Panko-fried pork skewers with hatcho miso glaze.',
        ingredients: ['Pork', 'Panko', 'Miso', 'Egg', 'Wheat'],
        allergens: ['Soy', 'Wheat', 'Egg'],
        tasteScore: 82,
        safetyScore: 70,
        valueScore: 89,
        recommendationReason:
            'Good local value, but soy, wheat, and egg require attention for your allergy profile.',
        priceIntelligence: PriceIntelligenceModel(
          localPrice: 800,
          localCurrency: request.localCurrency,
          homePrice: _homePriceFor(
            request.userHomeCurrency,
            localPrice: 800,
            localCurrency: request.localCurrency,
          ),
          homeCurrency: request.userHomeCurrency,
          exchangeRate: _exchangeRateFor(
            request.userHomeCurrency,
            localCurrency: request.localCurrency,
          ),
          assessment: PriceAssessment.goodValue,
        ),
        foodConfidenceScore: 80,
        dietaryFlags: ['Pork'],
        hiddenIngredients: [
          'Fryer cross-contact',
          'Wheat in panko',
          'Egg wash'
        ],
        imageSeed: 'skewer',
      ),
    ];
  }

  num _homePriceFor(
    String homeCurrency, {
    required num localPrice,
    required String localCurrency,
  }) {
    final exchangeRate =
        _exchangeRateFor(homeCurrency, localCurrency: localCurrency);
    final homePrice = localPrice * exchangeRate;
    return num.parse(homePrice.toStringAsFixed(2));
  }

  num _exchangeRateFor(String homeCurrency, {required String localCurrency}) {
    final normalizedHome = homeCurrency.toUpperCase();
    final normalizedLocal = localCurrency.toUpperCase();
    if (normalizedHome == normalizedLocal) {
      return 1;
    }
    return switch ((normalizedLocal, normalizedHome)) {
      ('JPY', 'EUR') => 0.00622,
      ('JPY', 'USD') => 0.00675,
      ('JPY', 'TWD') => 0.216,
      ('JPY', 'SGD') => 0.0091,
      ('TWD', 'EUR') => 0.0289,
      ('TWD', 'USD') => 0.0314,
      ('TWD', 'JPY') => 4.63,
      ('TWD', 'SGD') => 0.042,
      ('USD', 'EUR') => 0.919,
      ('USD', 'TWD') => 31.8,
      ('USD', 'SGD') => 1.35,
      ('USD', 'JPY') => 148,
      ('EUR', 'USD') => 1.09,
      ('EUR', 'TWD') => 34.6,
      ('EUR', 'SGD') => 1.47,
      ('EUR', 'JPY') => 161,
      ('SGD', 'EUR') => 0.68,
      ('SGD', 'USD') => 0.74,
      ('SGD', 'TWD') => 23.6,
      ('SGD', 'JPY') => 109.6,
      _ => 1,
    };
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
    final homePrice =
        localCurrency == homeCurrency ? localPrice : localPrice * exchangeRate;
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

/// Checks whether [path] contains [code] as a language-code token.
///
/// A token is delimited by `/`, `-`, `_`, `.`, or string boundaries.
/// This prevents `contains('en')` from matching the `en` inside `menu`
/// or `contains('zh')` from matching accidental substrings.
///
/// Examples:
/// - `_hasLangCodeToken('harbor-en.png', 'en')` → `true`
/// - `_hasLangCodeToken('mock-menu-image', 'en')` → `false`
/// - `_hasLangCodeToken('zh-cn/menu', 'zh')` → `true`
bool _hasLangCodeToken(String path, String code) {
  final pattern = RegExp('(?:^|[/\\\\_.-])$code(?:[/\\\\_.-]|\$)');
  return pattern.hasMatch(path);
}
