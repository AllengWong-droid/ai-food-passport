import '../../domain/models/models.dart';

class AiProviderConfig {
  const AiProviderConfig._();

  static const defaultMode = AiProviderMode.mock;
  static const backendRoutingEnabled = false;
  static const backendMockEnabled = false;
  static const backendBaseUrl = 'http://localhost:8787';
  static const qwenEnabled = false;
  static const deepSeekEnabled = false;
  static const openAiEnabled = false;
  static const realOcrEnabled = false;
}
