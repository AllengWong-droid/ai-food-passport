import 'price_intelligence_model.dart';

class DishAnalysisModel {
  const DishAnalysisModel({
    required this.dishName,
    required this.description,
    required this.ingredients,
    required this.allergens,
    required this.tasteScore,
    required this.safetyScore,
    required this.valueScore,
    required this.recommendationReason,
    required this.priceIntelligence,
    this.localName,
    this.foodConfidenceScore = 0,
    this.dietaryFlags = const [],
    this.hiddenIngredients = const [],
    this.imageSeed = 'dish',
  });

  final String dishName;
  final String description;
  final List<String> ingredients;
  final List<String> allergens;
  final int tasteScore;
  final int safetyScore;
  final int valueScore;
  final String recommendationReason;
  final PriceIntelligenceModel priceIntelligence;

  final String? localName;
  final int foodConfidenceScore;
  final List<String> dietaryFlags;
  final List<String> hiddenIngredients;
  final String imageSeed;

  String get id => dishName
      .toLowerCase()
      .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
      .replaceAll(RegExp(r'^-|-$'), '');
}
