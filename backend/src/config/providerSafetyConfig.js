const DEFAULT_PROVIDER_TIMEOUT_MS = 15000;
const DEFAULT_PROVIDER_MAX_RETRIES = 0;

function getProviderSafetyConfig(env = process.env) {
  const warnings = [];
  const providerTimeoutMs = parsePositiveInteger(
    env.PROVIDER_TIMEOUT_MS,
    DEFAULT_PROVIDER_TIMEOUT_MS,
    'PROVIDER_TIMEOUT_MS',
    warnings
  );
  const providerMaxRetries = parseNonNegativeInteger(
    env.PROVIDER_MAX_RETRIES,
    DEFAULT_PROVIDER_MAX_RETRIES,
    'PROVIDER_MAX_RETRIES',
    warnings
  );
  const providerMonthlyBudgetUsd = parseOptionalPositiveNumber(
    env.PROVIDER_MONTHLY_BUDGET_USD,
    'PROVIDER_MONTHLY_BUDGET_USD',
    warnings
  );
  const providerDailyRequestLimit = parseOptionalPositiveInteger(
    env.PROVIDER_DAILY_REQUEST_LIMIT,
    'PROVIDER_DAILY_REQUEST_LIMIT',
    warnings
  );

  return {
    providerTimeoutMs,
    providerMaxRetries,
    providerMonthlyBudgetUsd,
    providerMonthlyBudgetConfigured: providerMonthlyBudgetUsd !== null,
    providerDailyRequestLimit,
    providerDailyRequestLimitConfigured: providerDailyRequestLimit !== null,
    providerSafetyConfigValid: warnings.length === 0,
    providerSafetyWarnings: warnings
  };
}

function parsePositiveInteger(rawValue, fallback, name, warnings) {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return fallback;
  }

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    warnings.push(`${name}_INVALID_DEFAULT_USED`);
    return fallback;
  }

  return parsed;
}

function parseNonNegativeInteger(rawValue, fallback, name, warnings) {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return fallback;
  }

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed < 0) {
    warnings.push(`${name}_INVALID_DEFAULT_USED`);
    return fallback;
  }

  return parsed;
}

function parseOptionalPositiveNumber(rawValue, name, warnings) {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return null;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    warnings.push(`${name}_INVALID_IGNORED`);
    return null;
  }

  return parsed;
}

function parseOptionalPositiveInteger(rawValue, name, warnings) {
  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    return null;
  }

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    warnings.push(`${name}_INVALID_IGNORED`);
    return null;
  }

  return parsed;
}

module.exports = {
  DEFAULT_PROVIDER_TIMEOUT_MS,
  DEFAULT_PROVIDER_MAX_RETRIES,
  getProviderSafetyConfig
};
