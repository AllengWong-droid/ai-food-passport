import '../../domain/models/models.dart';
import 'backend_endpoint_config.dart';

class AiProviderConfig {
  const AiProviderConfig._();

  static const defaultMode = AiProviderMode.mock;
  static const backendRoutingEnabled = false;
  static const backendMockEnabled = false;
  static String get backendBaseUrl => BackendEndpointConfig.currentBaseUrl;
  static const qwenEnabled = false;
  static const deepSeekEnabled = false;
  static const openAiEnabled = false;
  static const realOcrEnabled = false;
}
