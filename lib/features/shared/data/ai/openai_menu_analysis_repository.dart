import '../../domain/models/models.dart';
import '../../domain/repositories/repositories.dart';
import 'openai_menu_prompt_builder.dart';
import 'openai_menu_response_parser.dart';

class OpenAiMenuAnalysisRepository implements AiRepository {
  OpenAiMenuAnalysisRepository({
    this.fallbackRepository,
    OpenAiMenuPromptBuilder? promptBuilder,
    OpenAiMenuResponseParser? responseParser,
  })  : promptBuilder = promptBuilder ?? const OpenAiMenuPromptBuilder(),
        responseParser = responseParser ?? const OpenAiMenuResponseParser();

  final AiRepository? fallbackRepository;
  final OpenAiMenuPromptBuilder promptBuilder;
  final OpenAiMenuResponseParser responseParser;

  static const providerSource = 'openai_skeleton';
  static const realApiEnabled = false;
  static const parserStatus = 'ready';

  @override
  Future<List<DishAnalysisModel>> analyzeMenu(AiAnalysisRequest request) async {
    promptBuilder.build(request);

    final fallback = fallbackRepository;
    if (fallback != null) {
      return fallback.analyzeMenu(request);
    }

    throw AiAnalysisNotImplementedException(
      AiAnalysisFailure(
        message: 'OpenAI menu analysis is prepared but disabled. No network call was made.',
        code: 'openai_disabled',
        source: providerSource,
        createdAt: DateTime.now(),
      ),
    );
  }

  @override
  List<DishAnalysisModel> loadLatestResults() {
    return fallbackRepository?.loadLatestResults() ?? const [];
  }

  @override
  DishAnalysisModel loadDish(String dishId) {
    final fallback = fallbackRepository;
    if (fallback != null) {
      return fallback.loadDish(dishId);
    }

    throw AiAnalysisNotImplementedException(
      AiAnalysisFailure(
        message: 'OpenAI menu analysis dish lookup is disabled.',
        code: 'openai_disabled',
        source: providerSource,
        createdAt: DateTime.now(),
      ),
    );
  }
}

class AiAnalysisNotImplementedException implements Exception {
  const AiAnalysisNotImplementedException(this.failure);

  final AiAnalysisFailure failure;

  @override
  String toString() {
    return '${failure.code}: ${failure.message}';
  }
}
