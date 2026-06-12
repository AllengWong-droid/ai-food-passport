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

final latestOcrTextProvider = StateProvider<String?>((ref) {
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
    return ScanModel(
      scanId: 'scan-${DateTime.now().millisecondsSinceEpoch}',
      imagePath: imagePath,
      restaurantCountry: 'Japan',
      restaurantCity: 'Tokyo',
      localCurrency: 'JPY',
      createdAt: DateTime.now(),
    );
  }
}

class MockOcrRepository implements OcrRepository {
  @override
  Future<String> extractText(String imagePath) async {
    await Future<void>.delayed(const Duration(milliseconds: 450));

    final normalizedPath = imagePath.toLowerCase();
    if (normalizedPath.contains('china') ||
        normalizedPath.contains('chinese') ||
        normalizedPath.contains('zh')) {
      return mockChineseMenuText;
    }
    if (normalizedPath.contains('english') ||
        normalizedPath.contains('harbor') ||
        normalizedPath.contains('en')) {
      return mockEnglishMenuText;
    }

    return mockJapaneseMenuText;
  }
}

class MockAiRepository implements AiRepository {
  @override
  List<DishAnalysisModel> analyzeScan(ScanModel scan) => mockDishAnalyses;

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
