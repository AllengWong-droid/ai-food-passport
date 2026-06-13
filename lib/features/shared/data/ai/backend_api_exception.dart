enum BackendErrorCode {
  ocrFailed,
  ocrEmptyText,
  analysisFailed,
  analysisEmptyResult,
  badRequest,
  notFound,
  providerFailure,
  unavailable,
  unknown;

  static BackendErrorCode fromCode(String? code) {
    switch (code) {
      case 'OCR_FAILED':
        return BackendErrorCode.ocrFailed;
      case 'OCR_EMPTY_TEXT':
        return BackendErrorCode.ocrEmptyText;
      case 'ANALYSIS_FAILED':
        return BackendErrorCode.analysisFailed;
      case 'ANALYSIS_EMPTY_RESULT':
        return BackendErrorCode.analysisEmptyResult;
      case 'BAD_REQUEST':
        return BackendErrorCode.badRequest;
      case 'NOT_FOUND':
      case 'UNKNOWN_ROUTE':
        return BackendErrorCode.notFound;
      case 'PROVIDER_FAILURE':
        return BackendErrorCode.providerFailure;
      default:
        return BackendErrorCode.unknown;
    }
  }
}

class BackendApiError {
  const BackendApiError({
    required this.code,
    required this.message,
    this.details,
  });

  final BackendErrorCode code;
  final String message;
  final Object? details;

  factory BackendApiError.fromJson(Map<String, dynamic> json) {
    return BackendApiError(
      code: BackendErrorCode.fromCode(json['code'] as String?),
      message: json['message'] as String? ?? 'Backend mock request failed.',
      details: json['details'],
    );
  }
}

class BackendApiException implements Exception {
  const BackendApiException(this.error);

  final BackendApiError error;

  BackendErrorCode get code => error.code;

  @override
  String toString() => 'BackendApiException(${code.name})';
}
