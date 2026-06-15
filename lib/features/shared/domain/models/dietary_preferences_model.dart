import 'package:flutter/foundation.dart';

/// Dietary preferences and allergen settings for the user.
///
/// This model stores what the user wants to avoid in their food analysis.
/// It persists across app restarts using shared_preferences.
@immutable
class DietaryPreferencesModel {
  const DietaryPreferencesModel({
    this.selectedAllergens = const {},
    this.dietaryRestrictions = const {},
  });

  /// Set of allergen keys that the user wants to avoid.
  ///
  /// Supported allergen keys (matched to DishAnalysisModel.allergens):
  /// - 'gluten', 'dairy', 'eggs', 'nuts', 'peanuts', 'soy', 'fish', 'shellfish'
  final Set<String> selectedAllergens;

  /// Set of dietary restriction keys.
  ///
  /// Supported restrictions:
  /// - 'vegetarian', 'vegan', 'pork-free', 'alcohol-free', 'shellfish-free'
  final Set<String> dietaryRestrictions;

  /// Whether the user has any active preferences.
  bool get hasPreferences =>
      selectedAllergens.isNotEmpty || dietaryRestrictions.isNotEmpty;

  /// Create a copy with updated fields.
  DietaryPreferencesModel copyWith({
    Set<String>? selectedAllergens,
    Set<String>? dietaryRestrictions,
  }) {
    return DietaryPreferencesModel(
      selectedAllergens: selectedAllergens ?? this.selectedAllergens,
      dietaryRestrictions:
          dietaryRestrictions ?? this.dietaryRestrictions,
    );
  }

  /// Toggle an allergen in the selected list.
  DietaryPreferencesModel toggleAllergen(String allergenKey) {
    final updated = Set<String>.from(selectedAllergens);
    if (updated.contains(allergenKey)) {
      updated.remove(allergenKey);
    } else {
      updated.add(allergenKey);
    }
    return copyWith(selectedAllergens: updated);
  }

  /// Toggle a dietary restriction in the selected list.
  DietaryPreferencesModel toggleDietaryRestriction(String restrictionKey) {
    final updated = Set<String>.from(dietaryRestrictions);
    if (updated.contains(restrictionKey)) {
      updated.remove(restrictionKey);
    } else {
      updated.add(restrictionKey);
    }
    return copyWith(dietaryRestrictions: updated);
  }

  /// Check if a dish's allergens match any of the user's selected allergens.
  ///
  /// [dishAllergens] is the list of allergens from DishAnalysisModel.allergens.
  /// Returns true if there's any intersection between the two sets.
  bool matchesDishAllergens(List<String> dishAllergens) {
    if (selectedAllergens.isEmpty || dishAllergens.isEmpty) {
      return false;
    }
    final dishAllergenSet = dishAllergens.map((a) => a.toLowerCase()).toSet();
    return selectedAllergens.any((a) => dishAllergenSet.contains(a.toLowerCase()));
  }

  /// Get the list of matching allergens between user's preferences and dish.
  List<String> getMatchingAllergens(List<String> dishAllergens) {
    if (selectedAllergens.isEmpty || dishAllergens.isEmpty) {
      return [];
    }
    final dishAllergenSet = dishAllergens.map((a) => a.toLowerCase()).toSet();
    return selectedAllergens
        .where((a) => dishAllergenSet.contains(a.toLowerCase()))
        .toList();
  }

  @override
  bool operator ==(Object other) {
    return other is DietaryPreferencesModel &&
        setEquals(other.selectedAllergens, selectedAllergens) &&
        setEquals(other.dietaryRestrictions, dietaryRestrictions);
  }

  @override
  int get hashCode =>
      Object.hash(selectedAllergens.hashCode, dietaryRestrictions.hashCode);

  /// Convert to JSON for persistence.
  Map<String, dynamic> toJson() {
    return {
      'selectedAllergens': selectedAllergens.toList(),
      'dietaryRestrictions': dietaryRestrictions.toList(),
    };
  }

  /// Create from JSON (from persistence).
  factory DietaryPreferencesModel.fromJson(Map<String, dynamic> json) {
    return DietaryPreferencesModel(
      selectedAllergens:
          (json['selectedAllergens'] as List<dynamic>?)?.cast<String>().toSet() ??
              const {},
      dietaryRestrictions:
          (json['dietaryRestrictions'] as List<dynamic>?)
              ?.cast<String>()
              .toSet() ??
          const {},
    );
  }
}
