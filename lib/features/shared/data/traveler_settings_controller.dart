import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../domain/models/models.dart';

class TravelerSettingsController extends StateNotifier<TravelerSettingsModel> {
  TravelerSettingsController() : super(defaultSettings) {
    _loadSavedSettings();
  }

  var _localUpdateCount = 0;

  static const defaultSettings = TravelerSettingsModel(
    homeCountry: 'Germany',
    homeCurrency: 'EUR',
    outputLanguage: 'English',
    providerMode: AiProviderMode.mock,
  );

  static const _homeCountryKey = 'traveler_settings.home_country';
  static const _homeCurrencyKey = 'traveler_settings.home_currency';
  static const _outputLanguageKey = 'traveler_settings.output_language';
  static const _providerModeKey = 'traveler_settings.provider_mode';

  Future<void> update(TravelerSettingsModel settings) async {
    _localUpdateCount++;
    state = settings;
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(_homeCountryKey, settings.homeCountry);
    await preferences.setString(_homeCurrencyKey, settings.homeCurrency);
    await preferences.setString(_outputLanguageKey, settings.outputLanguage);
    await preferences.setString(_providerModeKey, settings.providerMode.name);
  }

  Future<void> reset() {
    return update(defaultSettings);
  }

  Future<void> _loadSavedSettings() async {
    final updateCountAtStart = _localUpdateCount;
    final preferences = await SharedPreferences.getInstance();
    if (updateCountAtStart != _localUpdateCount) {
      return;
    }

    state = TravelerSettingsModel(
      homeCountry: preferences.getString(_homeCountryKey) ?? defaultSettings.homeCountry,
      homeCurrency: preferences.getString(_homeCurrencyKey) ?? defaultSettings.homeCurrency,
      outputLanguage:
          preferences.getString(_outputLanguageKey) ?? defaultSettings.outputLanguage,
      providerMode: _providerModeFromName(
        preferences.getString(_providerModeKey),
      ),
    );
  }

  AiProviderMode _providerModeFromName(String? name) {
    for (final mode in AiProviderMode.values) {
      if (mode.name == name) {
        return mode;
      }
    }

    return defaultSettings.providerMode;
  }
}
