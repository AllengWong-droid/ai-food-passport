import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../domain/models/models.dart';
import '../../domain/repositories/repositories.dart';
import 'backend_ai_config.dart';

class BackendMockMenuAnalysisRepository implements AiRepository {
  BackendMockMenuAnalysisRepository({
    http.Client? client,
    this.baseUrl = BackendAiConfig.baseUrl,
    this.enabled = BackendAiConfig.mockEnabled,
  }) : _client = client ?? http.Client();

  final http.Client _client;
  final String baseUrl;
  final bool enabled;

  static const providerSource = 'backend_mock_adapter';

  @override
  Future<List<DishAnalysisModel>> analyzeMenu(AiAnalysisRequest request) async {
    if (!enabled) {
      throw UnimplementedError(
        'BackendMockMenuAnalysisRepository is disabled by default and is not the active provider.',
      );
    }

    final response = await _client.post(
      Uri.parse('$baseUrl/api/analyze-menu'),
      headers: const {'Content-Type': 'application/json'},
      body: jsonEncode(_toBackendRequestJson(request)),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw StateError(
        'Backend mock analyze-menu failed with status ${response.statusCode}.',
      );
    }

    return _parseDishes(jsonDecode(response.body));
  }

  @override
  List<DishAnalysisModel> loadLatestResults() {
    throw UnimplementedError(
      'BackendMockMenuAnalysisRepository is optional and does not provide cached results.',
    );
  }

  @override
  DishAnalysisModel loadDish(String dishId) {
    throw UnimplementedError(
      'BackendMockMenuAnalysisRepository is optional and does not provide dish lookup.',
    );
  }

  Map<String, dynamic> _toBackendRequestJson(AiAnalysisRequest request) {
    return {
      'ocrResult': {
        'rawText': request.ocrResult.rawText,
        'detectedLanguage': request.ocrResult.detectedLanguage,
        'confidence': request.ocrResult.confidence,
        'source': request.ocrResult.source,
        'createdAt': request.ocrResult.createdAt.toIso8601String(),
      },
      'tastePassport': {
        'travelStyle': request.tastePassport.travelStyle.name,
        'dietaryPreferences': request.tastePassport.dietaryPreferences,
        'allergies': request.tastePassport.allergies,
        'tastePreferences': request.tastePassport.tastePreferences,
      },
      'scan': {
        'scanId': request.scan.scanId,
        'imagePath': request.scan.imagePath,
        'restaurantCountry': request.scan.restaurantCountry,
        'restaurantCity': request.scan.restaurantCity,
        'localCurrency': request.scan.localCurrency,
        'createdAt': request.scan.createdAt.toIso8601String(),
      },
      'userHomeCountry': request.userHomeCountry,
      'userHomeCurrency': request.userHomeCurrency,
      'outputLanguage': request.outputLanguage,
      'providerMode': request.providerMode.name,
    };
  }

  List<DishAnalysisModel> _parseDishes(dynamic decodedBody) {
    if (decodedBody is! Map<String, dynamic>) {
      throw const FormatException('Backend mock response must be a JSON object.');
    }

    final dishes = decodedBody['dishes'];
    if (dishes is! List) {
      throw const FormatException('Backend mock response must include dishes.');
    }

    return dishes.map(_parseDish).toList();
  }

  DishAnalysisModel _parseDish(dynamic value) {
    if (value is! Map<String, dynamic>) {
      throw const FormatException('Dish item must be a JSON object.');
    }

    final price = value['priceIntelligence'];
    if (price is! Map<String, dynamic>) {
      throw const FormatException('Dish item must include priceIntelligence.');
    }

    return DishAnalysisModel(
      dishName: _requiredString(value, 'dishName'),
      description: _requiredString(value, 'description'),
      ingredients: _stringList(value['ingredients']),
      allergens: _stringList(value['allergens']),
      tasteScore: _requiredInt(value, 'tasteScore'),
      safetyScore: _requiredInt(value, 'safetyScore'),
      valueScore: _requiredInt(value, 'valueScore'),
      recommendationReason: _requiredString(value, 'recommendationReason'),
      priceIntelligence: PriceIntelligenceModel(
        localPrice: _requiredNum(price, 'localPrice'),
        localCurrency: _requiredString(price, 'localCurrency'),
        homePrice: _requiredNum(price, 'homePrice'),
        homeCurrency: _requiredString(price, 'homeCurrency'),
        exchangeRate: _requiredNum(price, 'exchangeRate'),
        assessment: _parseAssessment(_requiredString(price, 'assessment')),
      ),
      localName: value['localName'] as String?,
      foodConfidenceScore: _optionalInt(value, 'foodConfidenceScore'),
      dietaryFlags: _stringList(value['dietaryFlags']),
      hiddenIngredients: _stringList(value['hiddenIngredients']),
      imageSeed: value['imageSeed'] as String? ?? 'dish',
    );
  }

  String _requiredString(Map<String, dynamic> value, String key) {
    final field = value[key];
    if (field is String && field.isNotEmpty) {
      return field;
    }
    throw FormatException('Missing required string field: $key.');
  }

  int _requiredInt(Map<String, dynamic> value, String key) {
    final field = value[key];
    if (field is int) {
      return field;
    }
    if (field is num) {
      return field.round();
    }
    throw FormatException('Missing required int field: $key.');
  }

  int _optionalInt(Map<String, dynamic> value, String key) {
    final field = value[key];
    if (field is int) {
      return field;
    }
    if (field is num) {
      return field.round();
    }
    return 0;
  }

  num _requiredNum(Map<String, dynamic> value, String key) {
    final field = value[key];
    if (field is num) {
      return field;
    }
    throw FormatException('Missing required num field: $key.');
  }

  List<String> _stringList(dynamic value) {
    if (value is! List) {
      return const [];
    }

    return value.whereType<String>().toList();
  }

  PriceAssessment _parseAssessment(String value) {
    return switch (value.toLowerCase()) {
      'cheap' => PriceAssessment.cheap,
      'fair' => PriceAssessment.fair,
      'expensive' => PriceAssessment.expensive,
      'good value' => PriceAssessment.goodValue,
      'good_value' => PriceAssessment.goodValue,
      _ => throw FormatException('Unknown price assessment: $value.'),
    };
  }
}
