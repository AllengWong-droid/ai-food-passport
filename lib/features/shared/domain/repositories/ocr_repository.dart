import '../models/ocr_result.dart';

abstract class OcrRepository {
  Future<OcrResult> extractText(String imagePath);
}
