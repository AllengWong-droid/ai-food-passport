import 'ai_provider_config.dart';
import 'backend_endpoint_config.dart';

class BackendAiConfig {
  const BackendAiConfig._();

  static const enabled = AiProviderConfig.backendRoutingEnabled;
  static const mockEnabled = AiProviderConfig.backendMockEnabled;
  static String get baseUrl => BackendEndpointConfig.currentBaseUrl;
}
