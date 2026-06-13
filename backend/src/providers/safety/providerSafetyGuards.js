function withProviderTimeout(operation, timeoutMs, label = 'provider') {
  if (typeof operation !== 'function') {
    return Promise.reject(createGuardError(
      'PROVIDER_GUARD_INVALID_OPERATION',
      'Provider operation is not callable.'
    ));
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(createGuardError(
        'PROVIDER_TIMEOUT',
        `${label} timed out.`
      ));
    }, timeoutMs);

    Promise.resolve()
      .then(operation)
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function checkRateLimit() {
  return {
    ok: true,
    enforced: false,
    reason: 'Rate limit guard is a future skeleton and is not enforced in mock mode.'
  };
}

function checkCostBudget() {
  return {
    ok: true,
    enforced: false,
    reason: 'Cost guard is a future skeleton and is not enforced in mock mode.'
  };
}

function createGuardError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

module.exports = {
  withProviderTimeout,
  checkRateLimit,
  checkCostBudget
};
