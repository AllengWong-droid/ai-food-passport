import 'ai_provider_config.dart';

class BackendAiConfig {
  const BackendAiConfig._();

  static const enabled = AiProviderConfig.backendRoutingEnabled;
  static const mockEnabled = AiProviderConfig.backendMockEnabled;
  static const baseUrl = AiProviderConfig.backendBaseUrl;
}
