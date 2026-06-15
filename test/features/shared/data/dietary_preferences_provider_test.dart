import 'package:ai_food_passport/features/shared/data/dietary_preferences_provider.dart';
import 'package:ai_food_passport/features/shared/domain/models/dietary_preferences_model.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('DietaryPreferencesNotifier', () {
    late ProviderContainer container;

    setUp(() async {
      // Initialize shared_preferences for testing
      SharedPreferences.setMockInitialValues({});
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    test('starts with empty preferences', () async {
      final preferences =
          container.read(dietaryPreferencesProvider);
      expect(preferences.selectedAllergens.isEmpty, isTrue);
      expect(preferences.dietaryRestrictions.isEmpty, isTrue);
      expect(preferences.hasPreferences, isFalse);
    });

    test('toggleAllergen adds allergen', () async {
      final notifier =
          container.read(dietaryPreferencesProvider.notifier);
      notifier.toggleAllergen('gluten');

      // Wait for async save
      await Future.delayed(const Duration(milliseconds: 100));

      final preferences =
          container.read(dietaryPreferencesProvider);
      expect(preferences.selectedAllergens.contains('gluten'), isTrue);
    });

    test('toggleAllergen removes allergen when already present', () async {
      final notifier =
          container.read(dietaryPreferencesProvider.notifier);

      // Add then remove
      notifier.toggleAllergen('gluten');
      await Future.delayed(const Duration(milliseconds: 100));
      notifier.toggleAllergen('gluten');
      await Future.delayed(const Duration(milliseconds: 100));

      final preferences =
          container.read(dietaryPreferencesProvider);
      expect(preferences.selectedAllergens.contains('gluten'), isFalse);
    });

    test('toggleDietaryRestriction adds restriction', () async {
      final notifier =
          container.read(dietaryPreferencesProvider.notifier);
      notifier.toggleDietaryRestriction('vegetarian');

      await Future.delayed(const Duration(milliseconds: 100));

      final preferences =
          container.read(dietaryPreferencesProvider);
      expect(preferences.dietaryRestrictions.contains('vegetarian'), isTrue);
    });

    test('clear removes all preferences', () async {
      final notifier =
          container.read(dietaryPreferencesProvider.notifier);

      // Add some preferences
      notifier.toggleAllergen('gluten');
      notifier.toggleDietaryRestriction('vegetarian');
      await Future.delayed(const Duration(milliseconds: 100));

      // Clear
      notifier.clear();
      await Future.delayed(const Duration(milliseconds: 100));

      final preferences =
          container.read(dietaryPreferencesProvider);
      expect(preferences.hasPreferences, isFalse);
      expect(preferences.selectedAllergens.isEmpty, isTrue);
      expect(preferences.dietaryRestrictions.isEmpty, isTrue);
    });

    test('update replaces all preferences', () async {
      final notifier =
          container.read(dietaryPreferencesProvider.notifier);

      final newPreferences = DietaryPreferencesModel(
        selectedAllergens: {'dairy', 'nuts'},
        dietaryRestrictions: {'vegan'},
      );

      notifier.update(newPreferences);
      await Future.delayed(const Duration(milliseconds: 100));

      final preferences =
          container.read(dietaryPreferencesProvider);
      expect(preferences.selectedAllergens, {'dairy', 'nuts'});
      expect(preferences.dietaryRestrictions, {'vegan'});
    });
  });
}
