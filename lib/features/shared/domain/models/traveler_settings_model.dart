import 'ai_provider_mode.dart';

class TravelerSettingsModel {
  const TravelerSettingsModel({
    required this.homeCountry,
    required this.homeCurrency,
    required this.outputLanguage,
    required this.providerMode,
  });

  final String homeCountry;
  final String homeCurrency;
  final String outputLanguage;
  final AiProviderMode providerMode;

  TravelerSettingsModel copyWith({
    String? homeCountry,
    String? homeCurrency,
    String? outputLanguage,
    AiProviderMode? providerMode,
  }) {
    return TravelerSettingsModel(
      homeCountry: homeCountry ?? this.homeCountry,
      homeCurrency: homeCurrency ?? this.homeCurrency,
      outputLanguage: outputLanguage ?? this.outputLanguage,
      providerMode: providerMode ?? this.providerMode,
    );
  }
}
