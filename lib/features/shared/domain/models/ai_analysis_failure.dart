class AiAnalysisFailure {
  const AiAnalysisFailure({
    required this.message,
    required this.code,
    required this.source,
    required this.createdAt,
  });

  final String message;
  final String code;
  final String source;
  final DateTime createdAt;
}
