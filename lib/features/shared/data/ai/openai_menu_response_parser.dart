import 'dart:convert';

import '../../domain/models/models.dart';

class OpenAiMenuResponseParser {
  const OpenAiMenuResponseParser({
    this.defaultLocalCurrency = 'USD',
    this.defaultHomeCurrency = 'USD',
  });

  final String defaultLocalCurrency;
  final String defaultHomeCurrency;

  List<DishAnalysisModel> parseJson(String jsonText) {
    final decoded = jsonDecode(jsonText);
    if (decoded is! Map<String, dynamic>) {
      throw const FormatException('AI response must be a JSON object.');
    }

    return parseMap(decoded);
  }

  List<DishAnalysisModel> parseMap(Map<String, dynamic> payload) {
    final dishesPayload = payload['dishes'];
    if (dishesPayload is! List) {
      throw const FormatException('AI response is missing a dishes array.');
    }

    return [
      for (var i = 0; i < dishesPayload.length; i++)
        _parseDish(_asMap(dishesPayload[i], 'dishes[$i]')),
    ];
  }

  DishAnalysisModel _parseDish(Map<String, dynamic> payload) {
    return DishAnalysisModel(
      dishName: _requiredString(payload, 'dishName'),
      description: _requiredString(payload, 'description'),
      ingredients: _requiredStringList(payload, 'ingredients'),
      allergens: _requiredStringList(payload, 'allergens'),
      tasteScore: _requiredScore(payload, 'tasteScore'),
      safetyScore: _requiredScore(payload, 'safetyScore'),
      valueScore: _requiredScore(payload, 'valueScore'),
      recommendationReason: _requiredString(payload, 'recommendationReason'),
      priceIntelligence: _parsePriceIntelligence(payload['priceIntelligence']),
      localName: _optionalString(payload, 'localName'),
      foodConfidenceScore: _optionalScore(payload, 'foodConfidenceScore', defaultValue: 0),
      dietaryFlags: _optionalStringList(payload, 'dietaryFlags'),
      hiddenIngredients: _optionalStringList(payload, 'hiddenIngredients'),
      imageSeed: _optionalString(payload, 'imageSeed') ?? 'dish',
    );
  }

  PriceIntelligenceModel _parsePriceIntelligence(Object? payload) {
    if (payload == null) {
      return PriceIntelligenceModel(
        localPrice: 0,
        localCurrency: defaultLocalCurrency,
        homePrice: 0,
        homeCurrency: defaultHomeCurrency,
        exchangeRate: 1,
        assessment: PriceAssessment.fair,
      );
    }

    final map = _asMap(payload, 'priceIntelligence');
    return PriceIntelligenceModel(
      localPrice: _optionalNum(map, 'localPrice') ?? 0,
      localCurrency: _optionalString(map, 'localCurrency') ?? defaultLocalCurrency,
      homePrice: _optionalNum(map, 'homePrice') ?? 0,
      homeCurrency: _optionalString(map, 'homeCurrency') ?? defaultHomeCurrency,
      exchangeRate: _optionalNum(map, 'exchangeRate') ?? 1,
      assessment: _parseAssessment(_optionalString(map, 'assessment')),
    );
  }

  Map<String, dynamic> _asMap(Object? value, String fieldName) {
    if (value is Map<String, dynamic>) {
      return value;
    }
    if (value is Map) {
      return value.map((key, value) => MapEntry(key.toString(), value));
    }
    throw FormatException('$fieldName must be an object.');
  }

  String _requiredString(Map<String, dynamic> payload, String fieldName) {
    final value = payload[fieldName];
    if (value is String && value.trim().isNotEmpty) {
      return value;
    }
    throw FormatException('$fieldName is required and must be a non-empty string.');
  }

  String? _optionalString(Map<String, dynamic> payload, String fieldName) {
    final value = payload[fieldName];
    if (value == null) {
      return null;
    }
    if (value is String) {
      return value;
    }
    throw FormatException('$fieldName must be a string when provided.');
  }

  List<String> _requiredStringList(Map<String, dynamic> payload, String fieldName) {
    final value = payload[fieldName];
    if (value is List && value.every((item) => item is String)) {
      return value.cast<String>();
    }
    throw FormatException('$fieldName is required and must be a string array.');
  }

  List<String> _optionalStringList(Map<String, dynamic> payload, String fieldName) {
    final value = payload[fieldName];
    if (value == null) {
      return const [];
    }
    if (value is List && value.every((item) => item is String)) {
      return value.cast<String>();
    }
    throw FormatException('$fieldName must be a string array when provided.');
  }

  int _requiredScore(Map<String, dynamic> payload, String fieldName) {
    final value = payload[fieldName];
    if (value is num) {
      return value.round().clamp(0, 100).toInt();
    }
    throw FormatException('$fieldName is required and must be numeric.');
  }

  int _optionalScore(
    Map<String, dynamic> payload,
    String fieldName, {
    required int defaultValue,
  }) {
    final value = payload[fieldName];
    if (value == null) {
      return defaultValue;
    }
    if (value is num) {
      return value.round().clamp(0, 100).toInt();
    }
    throw FormatException('$fieldName must be numeric when provided.');
  }

  num? _optionalNum(Map<String, dynamic> payload, String fieldName) {
    final value = payload[fieldName];
    if (value == null) {
      return null;
    }
    if (value is num) {
      return value;
    }
    throw FormatException('$fieldName must be numeric when provided.');
  }

  PriceAssessment _parseAssessment(String? value) {
    return switch (value?.toLowerCase()) {
      'cheap' => PriceAssessment.cheap,
      'expensive' => PriceAssessment.expensive,
      _ => PriceAssessment.fair,
    };
  }
}
