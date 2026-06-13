class BackendRoutingMetadata {
  const BackendRoutingMetadata({
    required this.requestedProviderMode,
    required this.resolvedProviderMode,
    required this.fallbackUsed,
    required this.routingReason,
    required this.realProvidersEnabled,
    required this.providerRoutingReady,
  });

  final String requestedProviderMode;
  final String resolvedProviderMode;
  final bool fallbackUsed;
  final String routingReason;
  final bool realProvidersEnabled;
  final bool providerRoutingReady;

  factory BackendRoutingMetadata.fromJson(Map<String, dynamic> json) {
    return BackendRoutingMetadata(
      requestedProviderMode: json['requestedProviderMode'] as String? ?? 'mock',
      resolvedProviderMode: json['resolvedProviderMode'] as String? ?? 'mock',
      fallbackUsed: json['fallbackUsed'] as bool? ?? false,
      routingReason:
          json['routingReason'] as String? ?? 'No routing reason provided.',
      realProvidersEnabled: json['realProvidersEnabled'] as bool? ?? false,
      providerRoutingReady: json['providerRoutingReady'] as bool? ?? false,
    );
  }
}
