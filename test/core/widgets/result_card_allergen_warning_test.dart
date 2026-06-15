import 'package:ai_food_passport/core/widgets/result_card.dart';
import 'package:ai_food_passport/features/shared/data/dietary_preferences_provider.dart';
import 'package:ai_food_passport/features/shared/domain/models/dish_analysis_model.dart';
import 'package:ai_food_passport/features/shared/domain/models/dietary_preferences_model.dart';
import 'package:ai_food_passport/features/shared/domain/models/price_intelligence_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('ResultCard Allergen Warning', () {
    late ProviderContainer container;

    setUp(() {
      SharedPreferences.setMockInitialValues({});
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    Widget createTestCard({
      required List<String> allergens,
    }) {
      final dish = DishAnalysisModel(
        dishName: 'Test Dish',
        description: 'A test dish',
        ingredients: ['ingredient1'],
        allergens: allergens,
        tasteScore: 85,
        safetyScore: 90,
        valueScore: 80,
        recommendationReason: 'Good dish',
        priceIntelligence: PriceIntelligenceModel(
          localPrice: 10.0,
          localCurrency: 'USD',
          homePrice: 10.0,
          homeCurrency: 'USD',
          exchangeRate: 1.0,
          assessment: PriceAssessment.fair,
        ),
      );

      return ResultCard(
        dish: dish,
        onTap: () {},
      );
    }

    testWidgets('shows no allergen warning when no preferences selected',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: createTestCard(
                allergens: ['gluten'],
              ),
            ),
          ),
        ),
      );

      // Should not show "Matches your avoid list" badge
      expect(find.text('Matches your avoid list'), findsNothing);
    });

    testWidgets('shows allergen warning when dish matches user preferences',
        (WidgetTester tester) async {
      // Set user preferences before building widget
      final container = ProviderContainer();
      final notifier = container.read(dietaryPreferencesProvider.notifier);
      notifier.toggleAllergen('gluten');

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: createTestCard(
                allergens: ['gluten'],
              ),
            ),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Should show "Matches your avoid list" badge
      expect(find.text('Matches your avoid list'), findsOneWidget);
    });
  });
}
