import '../../domain/models/models.dart';
import '../../domain/repositories/repositories.dart';
import 'backend_ai_config.dart';

class BackendMenuAnalysisRepository implements AiRepository {
  const BackendMenuAnalysisRepository();

  static const providerSource = 'backend_proxy_skeleton';

  @override
  Future<List<DishAnalysisModel>> analyzeMenu(AiAnalysisRequest request) {
    throw UnimplementedError(
      'BackendMenuAnalysisRepository is a future integration skeleton and is not enabled yet. '
      'Backend enabled: ${BackendAiConfig.enabled}. Base URL placeholder: ${BackendAiConfig.baseUrl}.',
    );
  }

  @override
  List<DishAnalysisModel> loadLatestResults() {
    throw UnimplementedError(
      'BackendMenuAnalysisRepository is disabled and does not provide cached results.',
    );
  }

  @override
  DishAnalysisModel loadDish(String dishId) {
    throw UnimplementedError(
      'BackendMenuAnalysisRepository is disabled and does not provide dish lookup.',
    );
  }
}
