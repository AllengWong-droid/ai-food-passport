class OcrResult {
  const OcrResult({
    required this.rawText,
    required this.detectedLanguage,
    required this.confidence,
    required this.source,
    required this.createdAt,
  });

  final String rawText;
  final String detectedLanguage;
  final double confidence;
  final String source;
  final DateTime createdAt;
}
