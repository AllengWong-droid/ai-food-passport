/// Local scan history entry model.
///
/// Represents a single menu analysis result saved in the current session.
/// This is session-local only (not persisted across app restarts).
library;

import 'scan_model.dart';
import 'ocr_result.dart';
import 'ai_analysis_request.dart';
import 'dish_analysis_model.dart';

class ScanHistoryEntry {
  const ScanHistoryEntry({
    required this.timestamp,
    required this.dishCount,
    required this.dishNamesSummary,
    required this.sourceMode,
    required this.scan,
    required this.ocrResult,
    required this.aiAnalysisRequest,
    required this.dishAnalyses,
  });

  final DateTime timestamp;
  final int dishCount;
  final String dishNamesSummary;
  final String sourceMode;
  final ScanModel scan;
  final OcrResult ocrResult;
  final AiAnalysisRequest aiAnalysisRequest;
  final List<DishAnalysisModel> dishAnalyses;

  /// Creates a history entry from the current analysis state.
  ///
  /// Called after a successful menu analysis in [ScanScreen].
  static ScanHistoryEntry fromAnalysisState({
    required ScanModel scan,
    required OcrResult ocrResult,
    required AiAnalysisRequest aiAnalysisRequest,
    required List<DishAnalysisModel> dishAnalyses,
    required String sourceMode,
  }) {
    final dishNames = dishAnalyses.map((dish) => dish.dishName).toList();
    final dishNamesSummary = dishNames.length <= 2
        ? dishNames.join(', ')
        : '${dishNames.first}, ${dishNames[1]}, +${dishNames.length - 2} more';

    return ScanHistoryEntry(
      timestamp: DateTime.now(),
      dishCount: dishAnalyses.length,
      dishNamesSummary: dishNamesSummary,
      sourceMode: sourceMode,
      scan: scan,
      ocrResult: ocrResult,
      aiAnalysisRequest: aiAnalysisRequest,
      dishAnalyses: dishAnalyses,
    );
  }
}
