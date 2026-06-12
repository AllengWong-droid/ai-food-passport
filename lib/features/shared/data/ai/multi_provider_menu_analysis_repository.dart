import '../../domain/models/models.dart';
import '../../domain/repositories/repositories.dart';
import 'ai_provider_config.dart';

class MultiProviderMenuAnalysisRepository implements AiRepository {
  const MultiProviderMenuAnalysisRepository();

  static const providerSource = 'multi_provider_backend_skeleton';

  AiRoutingDecision createDisabledRoutingDecision() {
    return AiRoutingDecision(
      mode: AiProviderConfig.defaultMode,
      region: 'mock',
      ocrProvider: 'mock_ocr',
      analysisProvider: 'mock_ai',
      reason: 'Multi-provider backend routing is planned but disabled.',
      fallbackUsed: false,
      latencyMs: 0,
      createdAt: DateTime.now(),
    );
  }

  @override
  Future<List<DishAnalysisModel>> analyzeMenu(AiAnalysisRequest request) {
    throw UnimplementedError(
      'MultiProviderMenuAnalysisRepository is a future backend routing skeleton and is not enabled yet.',
    );
  }

  @override
  List<DishAnalysisModel> loadLatestResults() {
    throw UnimplementedError(
      'MultiProviderMenuAnalysisRepository is disabled and does not provide cached results.',
    );
  }

  @override
  DishAnalysisModel loadDish(String dishId) {
    throw UnimplementedError(
      'MultiProviderMenuAnalysisRepository is disabled and does not provide dish lookup.',
    );
  }
}
