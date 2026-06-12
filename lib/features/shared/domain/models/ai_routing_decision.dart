import 'ai_provider_mode.dart';

class AiRoutingDecision {
  const AiRoutingDecision({
    required this.mode,
    required this.region,
    required this.ocrProvider,
    required this.analysisProvider,
    required this.reason,
    required this.fallbackUsed,
    required this.latencyMs,
    required this.createdAt,
  });

  final AiProviderMode mode;
  final String region;
  final String ocrProvider;
  final String analysisProvider;
  final String reason;
  final bool fallbackUsed;
  final int latencyMs;
  final DateTime createdAt;
}
