import '../models/ai_analysis_request.dart';
import '../models/dish_analysis_model.dart';

abstract class AiRepository {
  Future<List<DishAnalysisModel>> analyzeMenu(AiAnalysisRequest request);

  List<DishAnalysisModel> loadLatestResults();

  DishAnalysisModel loadDish(String dishId);
}
