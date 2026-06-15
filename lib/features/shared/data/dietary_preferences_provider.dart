import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../domain/models/dietary_preferences_model.dart';

/// Provider for the user's dietary preferences.
///
/// Persists to shared_preferences so preferences survive app restarts.
/// Key: 'dietary_preferences'
final dietaryPreferencesProvider =
    StateNotifierProvider<DietaryPreferencesNotifier, DietaryPreferencesModel>(
  (ref) {
    return DietaryPreferencesNotifier();
  },
);

/// Notifier that manages dietary preferences with persistence.
class DietaryPreferencesNotifier
    extends StateNotifier<DietaryPreferencesModel> {
  DietaryPreferencesNotifier() : super(const DietaryPreferencesModel()) {
    _loadPreferences();
  }

  static const _prefsKey = 'dietary_preferences';

  /// Load preferences from shared_preferences.
  Future<void> _loadPreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_prefsKey);
      if (jsonString != null) {
        final json = jsonDecode(jsonString) as Map<String, dynamic>;
        state = DietaryPreferencesModel.fromJson(json);
      }
    } catch (e) {
      // If loading fails, keep default state (empty preferences)
      if (kDebugMode) {
        print('Failed to load dietary preferences: $e');
      }
    }
  }

  /// Save preferences to shared_preferences.
  Future<void> _savePreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = jsonEncode(state.toJson());
      await prefs.setString(_prefsKey, jsonString);
    } catch (e) {
      if (kDebugMode) {
        print('Failed to save dietary preferences: $e');
      }
    }
  }

  /// Toggle an allergen preference.
  void toggleAllergen(String allergenKey) {
    state = state.toggleAllergen(allergenKey);
    _savePreferences();
  }

  /// Toggle a dietary restriction.
  void toggleDietaryRestriction(String restrictionKey) {
    state = state.toggleDietaryRestriction(restrictionKey);
    _savePreferences();
  }

  /// Update the entire preferences object.
  void update(DietaryPreferencesModel newPreferences) {
    state = newPreferences;
    _savePreferences();
  }

  /// Clear all preferences.
  void clear() {
    state = const DietaryPreferencesModel();
    _savePreferences();
  }
}
