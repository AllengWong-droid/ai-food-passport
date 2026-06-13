function createDisabledOcrProviderError(provider) {
  const error = new Error('OCR provider is not configured.');
  error.code = 'OCR_PROVIDER_NOT_CONFIGURED';
  error.provider = provider;
  return error;
}

function createInvalidOcrProviderError(provider) {
  const error = new Error('OCR provider is invalid.');
  error.code = 'OCR_PROVIDER_INVALID';
  error.provider = provider;
  return error;
}

module.exports = {
  createDisabledOcrProviderError,
  createInvalidOcrProviderError
};
