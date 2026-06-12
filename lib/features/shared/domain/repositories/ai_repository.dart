import '../models/dish_analysis_model.dart';
import '../models/ocr_result.dart';
import '../models/scan_model.dart';

abstract class AiRepository {
  List<DishAnalysisModel> analyzeScan(ScanModel scan, String ocrText);

  List<DishAnalysisModel> analyzeOcrResult(ScanModel scan, OcrResult ocrResult);

  List<DishAnalysisModel> loadLatestResults();

  DishAnalysisModel loadDish(String dishId);
}
