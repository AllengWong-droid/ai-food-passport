import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../domain/models/models.dart';
import '../../domain/repositories/repositories.dart';
import 'backend_api_exception.dart';
import 'backend_ai_config.dart';

class BackendMockMenuAnalysisRepository implements AiRepository {
  BackendMockMenuAnalysisRepository({
    http.Client? client,
    this.baseUrl = BackendAiConfig.baseUrl,
    this.enabled = BackendAiConfig.mockEnabled,
    this.debugScenario = 'normal',
  }) : _client = client ?? http.Client();

  final http.Client _client;
  final String baseUrl;
  final bool enabled;
  final String debugScenario;

  static const providerSource = 'backend_mock_adapter';

  @override
  Future<List<DishAnalysisModel>> analyzeMenu(AiAnalysisRequest request) async {
    if (!enabled) {
      throw UnimplementedError(
        'BackendMockMenuAnalysisRepository is disabled by default and is not the active provider.',
      );
    }

    final http.Response response;
    try {
      response = await _client.post(
        Uri.parse('$baseUrl/api/analyze-menu'),
        headers: const {'Content-Type': 'application/json'},
        body: jsonEncode(_toBackendRequestJson(request)),
      );
    } catch (_) {
      throw const BackendApiException(
        BackendApiError(
          code: BackendErrorCode.unavailable,
          message: 'Backend mock server is unavailable.',
        ),
      );
    }

    final decodedBody = _decodeResponseBody(response.body);
    if (decodedBody is! Map<String, dynamic>) {
      throw const BackendApiException(
        BackendApiError(
          code: BackendErrorCode.unknown,
          message: 'Backend mock response was not readable.',
        ),
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw BackendApiException(_parseBackendError(decodedBody));
    }

    if (decodedBody['ok'] == false) {
      throw BackendApiException(_parseBackendError(decodedBody));
    }

    _throwIfAnalysisEmptyResult(decodedBody);
    return _parseDishes(decodedBody);
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
    final payload = <String, dynamic>{
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

    if (debugScenario != 'normal') {
      payload['debugScenario'] = debugScenario;
    }

    return payload;
  }

  List<DishAnalysisModel> _parseDishes(dynamic decodedBody) {
    if (decodedBody is! Map<String, dynamic>) {
      throw const FormatException('Backend mock response must be a JSON object.');
    }

    final data = decodedBody['data'];
    final dishes = data is Map<String, dynamic> ? data['dishes'] : decodedBody['dishes'];
    if (dishes is! List) {
      throw const FormatException('Backend mock response must include dishes.');
    }

    return dishes.map(_parseDish).toList();
  }

  dynamic _decodeResponseBody(String body) {
    try {
      return jsonDecode(body);
    } catch (_) {
      return null;
    }
  }

  BackendApiError _parseBackendError(Map<String, dynamic> decodedBody) {
    final error = decodedBody['error'];
    if (error is Map<String, dynamic>) {
      return BackendApiError.fromJson(error);
    }

    return const BackendApiError(
      code: BackendErrorCode.unknown,
      message: 'Backend mock request failed.',
    );
  }

  void _throwIfAnalysisEmptyResult(Map<String, dynamic> decodedBody) {
    final data = decodedBody['data'];
    if (data is! Map<String, dynamic>) {
      return;
    }

    final routing = data['routing'];
    if (routing is! Map<String, dynamic>) {
      return;
    }

    final analysisWarnings = routing['analysisWarnings'];
    final warnings = routing['warnings'];
    final hasEmptyResultWarning =
        _containsWarning(analysisWarnings, 'ANALYSIS_EMPTY_RESULT') ||
            _containsWarning(warnings, 'ANALYSIS_EMPTY_RESULT');
    if (!hasEmptyResultWarning) {
      return;
    }

    throw const BackendApiException(
      BackendApiError(
        code: BackendErrorCode.analysisEmptyResult,
        message: 'No dishes were found in the backend mock analysis.',
      ),
    );
  }

  bool _containsWarning(dynamic value, String warning) {
    return value is List && value.whereType<String>().contains(warning);
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
