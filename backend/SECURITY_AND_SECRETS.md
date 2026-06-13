# Backend Security And Secret Handling

## Current State

The backend is still mock-only. It does not call real OCR, Qwen, DeepSeek, OpenAI, Google Vision, Firebase, exchange-rate APIs, or any external provider.

`mock_ocr` and `mock_ai` remain the only active providers. Skeleton providers are disabled and return controlled errors if selected.

## Secret Rules

- Flutter must never contain provider API keys.
- Real provider keys must live on the backend only.
- Local `.env` files are for development only and must not be committed.
- Production secrets should be configured through deployment environment variables or a managed secret store.
- `.env.example` is a placeholder template only.
- Provider keys alone must not enable real calls without explicit provider implementation, config validation, and QA.

## Ignored Files

`backend/.gitignore` ignores:

- `.env`
- `node_modules/`
- `npm-debug.log*`

Do not create or commit a real `.env` file with secrets.

## Future Provider Environment Variables

Placeholder variables are documented in `backend/.env.example`:

- `OCR_PROVIDER`
- `ANALYSIS_PROVIDER`
- `QWEN_API_KEY`
- `DEEPSEEK_API_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_VISION_API_KEY`
- `EXCHANGE_RATE_API_KEY`
- `PROVIDER_TIMEOUT_MS`
- `PROVIDER_MAX_RETRIES`
- `PROVIDER_MONTHLY_BUDGET_USD`
- `PROVIDER_DAILY_REQUEST_LIMIT`

## Logging Redaction

A logging redaction utility skeleton is available at `src/utils/redactForLogs.js`.

`redactForLogs(object)` returns a safe deep copy of any object with the following fields replaced by `'[REDACTED]'`:

- `apiKey`
- `authorization`
- `token`
- `secret`
- `password`
- `image`
- `imageBytes`
- `base64`
- `rawImage`
- `menuImage`
- `providerRawResponse`
- `providerRawError`
- `stack`

`redactError(error)` strips a JavaScript Error down to `{ code, message }`. The stack trace is always removed.

These utilities are skeleton-only in Phase 10C. They do not yet wrap any live code path. Future real provider adapters must call them before logging any request, response, or caught error.

## Safe Error Response

A safe error response helper skeleton is available at `src/utils/safeErrorResponse.js`.

`extractSafeErrorCode(error, fallback)` returns a known application-controlled error code or the fallback. It prevents internal JavaScript error strings, library exception names, or raw provider error codes from appearing in API response bodies.

`buildSafeLogEntry(error, context)` produces a minimal structured log entry containing only `code` (if known-safe), `message`, and `context`. It never includes stack traces, headers, raw image data, or provider internals.

## Provider Safety Policy

Future real provider adapters must follow these rules:

- Timeout every provider call.
- Use no automatic retries by default.
- Return friendly standardized error envelopes.
- Do not leak raw provider errors to users.
- Do not expose stack traces in user-facing responses.
- Pass all objects through `redactForLogs` before writing to logs.
- Pass all caught errors through `redactError` or `buildSafeLogEntry` before writing to logs.
- Wrap catch handlers with `extractSafeErrorCode` before building error payloads.
- Avoid logging raw menu images, full OCR payloads, or sensitive user preference data.
- Add cost guards before production use.
- Add rate limits before production use.
- Keep fallback behavior explicit and testable.

## Standard Failure Shape

Provider failures should map to the existing backend envelope:

```json
{
  "ok": false,
  "data": null,
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "Could not process this menu right now.",
    "details": null
  }
}
```

Use specific codes such as `OCR_FAILED`, `OCR_PROVIDER_NOT_CONFIGURED`, `ANALYSIS_FAILED`, or `ANALYSIS_PROVIDER_NOT_CONFIGURED` where available.

## Production Readiness Gate

Before enabling real providers:

- Confirm keys are backend-only.
- Confirm provider calls are disabled by default.
- Confirm timeout, rate-limit, and budget behavior.
- Confirm logs redact secrets and sensitive payloads.
- Confirm fallback and recovery UX.
- Confirm rollback steps.
- Confirm no provider secrets exist in Flutter, committed files, or screenshots.
