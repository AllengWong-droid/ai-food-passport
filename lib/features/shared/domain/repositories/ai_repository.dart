import '../models/dish_analysis_model.dart';
import '../models/scan_model.dart';

abstract class AiRepository {
  List<DishAnalysisModel> analyzeScan(ScanModel scan);

  List<DishAnalysisModel> loadLatestResults();

  DishAnalysisModel loadDish(String dishId);
}
