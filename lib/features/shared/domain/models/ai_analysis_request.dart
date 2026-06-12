import 'ocr_result.dart';
import 'scan_model.dart';
import 'taste_passport_model.dart';

class AiAnalysisRequest {
  const AiAnalysisRequest({
    required this.ocrResult,
    required this.tastePassport,
    required this.scan,
    required this.userHomeCountry,
    required this.userHomeCurrency,
    required this.restaurantCountry,
    required this.restaurantCity,
    required this.localCurrency,
  });

  final OcrResult ocrResult;
  final TastePassportModel tastePassport;
  final ScanModel scan;
  final String userHomeCountry;
  final String userHomeCurrency;
  final String restaurantCountry;
  final String restaurantCity;
  final String localCurrency;
}
