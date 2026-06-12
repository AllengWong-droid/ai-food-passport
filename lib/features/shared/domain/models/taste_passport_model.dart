enum TravelStyle { budget, standard, luxury }

class TastePassportModel {
  const TastePassportModel({
    required this.travelStyle,
    required this.dietaryPreferences,
    required this.allergies,
    required this.tastePreferences,
  });

  final TravelStyle travelStyle;
  final List<String> dietaryPreferences;
  final List<String> allergies;
  final List<String> tastePreferences;
}
