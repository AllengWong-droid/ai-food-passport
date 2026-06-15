import 'package:ai_food_passport/features/shared/domain/models/dietary_preferences_model.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('DietaryPreferencesModel', () {
    test('creates empty preferences by default', () {
      const preferences = DietaryPreferencesModel();
      expect(preferences.selectedAllergens.isEmpty, isTrue);
      expect(preferences.dietaryRestrictions.isEmpty, isTrue);
      expect(preferences.hasPreferences, isFalse);
    });

    test('copyWith updates selected fields', () {
      const preferences = DietaryPreferencesModel();
      final updated = preferences.copyWith(
        selectedAllergens: {'gluten', 'dairy'},
        dietaryRestrictions: {'vegetarian'},
      );
      expect(updated.selectedAllergens, {'gluten', 'dairy'});
      expect(updated.dietaryRestrictions, {'vegetarian'});
      expect(updated.hasPreferences, isTrue);
    });

    test('toggleAllergen adds allergen when not present', () {
      const preferences = DietaryPreferencesModel();
      final updated = preferences.toggleAllergen('gluten');
      expect(updated.selectedAllergens.contains('gluten'), isTrue);
    });

    test('toggleAllergen removes allergen when already present', () {
      final preferences = DietaryPreferencesModel(
        selectedAllergens: {'gluten'},
      );
      final updated = preferences.toggleAllergen('gluten');
      expect(updated.selectedAllergens.contains('gluten'), isFalse);
      expect(updated.selectedAllergens.isEmpty, isTrue);
    });

    test('toggleDietaryRestriction adds restriction when not present', () {
      const preferences = DietaryPreferencesModel();
      final updated = preferences.toggleDietaryRestriction('vegetarian');
      expect(updated.dietaryRestrictions.contains('vegetarian'), isTrue);
    });

    test('toggleDietaryRestriction removes restriction when already present',
        () {
      final preferences = DietaryPreferencesModel(
        dietaryRestrictions: {'vegetarian'},
      );
      final updated = preferences.toggleDietaryRestriction('vegetarian');
      expect(updated.dietaryRestrictions.contains('vegetarian'), isFalse);
    });

    test('matchesDishAllergens returns false when no preferences selected',
        () {
      const preferences = DietaryPreferencesModel();
      final result = preferences.matchesDishAllergens(['gluten', 'dairy']);
      expect(result, isFalse);
    });

    test('matchesDishAllergens returns false when dish has no allergens', () {
      final preferences = DietaryPreferencesModel(
        selectedAllergens: {'gluten'},
      );
      final result = preferences.matchesDishAllergens([]);
      expect(result, isFalse);
    });

    test('matchesDishAllergens returns true when dish matches user allergens',
        () {
      final preferences = DietaryPreferencesModel(
        selectedAllergens: {'gluten', 'dairy'},
      );
      final result = preferences.matchesDishAllergens(['gluten', 'soy']);
      expect(result, isTrue);
    });

    test('matchesDishAllergens returns false when no match', () {
      final preferences = DietaryPreferencesModel(
        selectedAllergens: {'gluten'},
      );
      final result = preferences.matchesDishAllergens(['dairy', 'soy']);
      expect(result, isFalse);
    });

    test('matchesDishAllergens is case-insensitive', () {
      final preferences = DietaryPreferencesModel(
        selectedAllergens: {'GLUTEN'},
      );
      final result = preferences.matchesDishAllergens(['gluten']);
      expect(result, isTrue);
    });

    test('getMatchingAllergens returns correct matches', () {
      final preferences = DietaryPreferencesModel(
        selectedAllergens: {'gluten', 'dairy', 'nuts'},
      );
      final result = preferences.getMatchingAllergens(['gluten', 'soy']);
      expect(result, ['gluten']);
    });

    test('getMatchingAllergens returns empty list when no match', () {
      final preferences = DietaryPreferencesModel(
        selectedAllergens: {'gluten'},
      );
      final result = preferences.getMatchingAllergens(['dairy', 'soy']);
      expect(result.isEmpty, isTrue);
    });

    test('toJson and fromJson preserve data', () {
      const original = DietaryPreferencesModel(
        selectedAllergens: {'gluten', 'dairy'},
        dietaryRestrictions: {'vegetarian'},
      );
      final json = original.toJson();
      final restored = DietaryPreferencesModel.fromJson(json);
      expect(restored.selectedAllergens, original.selectedAllergens);
      expect(restored.dietaryRestrictions, original.dietaryRestrictions);
    });

    test('equality works correctly', () {
      const p1 = DietaryPreferencesModel(
        selectedAllergens: {'gluten'},
      );
      const p2 = DietaryPreferencesModel(
        selectedAllergens: {'gluten'},
      );
      const p3 = DietaryPreferencesModel(
        selectedAllergens: {'dairy'},
      );
      expect(p1 == p2, isTrue);
      expect(p1 == p3, isFalse);
    });
  });
}
