import '../../domain/models/models.dart';
import 'openai_menu_response_schema.dart';

class OpenAiMenuPrompt {
  const OpenAiMenuPrompt({
    required this.systemInstructions,
    required this.userPrompt,
    required this.structuredOutputExpectations,
  });

  final String systemInstructions;
  final String userPrompt;
  final Map<String, dynamic> structuredOutputExpectations;
}

class OpenAiMenuPromptBuilder {
  const OpenAiMenuPromptBuilder();

  OpenAiMenuPrompt build(AiAnalysisRequest request) {
    return OpenAiMenuPrompt(
      systemInstructions: _buildSystemInstructions(),
      userPrompt: _buildUserPrompt(request),
      structuredOutputExpectations: OpenAiMenuResponseSchema.spec,
    );
  }

  String _buildSystemInstructions() {
    return '''
You are a menu analysis engine for travelers.
Return structured dish analysis only.
Do not provide medical advice.
Flag likely allergens and hidden ingredients conservatively.
Score taste, safety, and value from 0 to 100.
Use the user's taste passport and allergy profile when ranking dishes.
''';
  }

  String _buildUserPrompt(AiAnalysisRequest request) {
    return '''
OCR raw text:
${request.ocrResult.rawText}

OCR detected language: ${request.ocrResult.detectedLanguage}
OCR confidence: ${request.ocrResult.confidence}

User taste preferences: ${_joinValues(request.tastePassport.tastePreferences)}
User allergies: ${_joinValues(request.tastePassport.allergies)}
User dietary preferences: ${_joinValues(request.tastePassport.dietaryPreferences)}
User home country: ${request.userHomeCountry}
User home currency: ${request.userHomeCurrency}

Restaurant country: ${request.restaurantCountry}
Restaurant city: ${request.restaurantCity}
Local currency: ${request.localCurrency}

Analyze the menu and return a list of dish analysis objects matching the structured output expectations.
''';
  }

  String _joinValues(List<String> values) {
    return values.isEmpty ? 'None provided' : values.join(', ');
  }
}
