/**
 * ocrProviderContract.test.js
 *
 * Unit tests for the OCR provider contract and normalization helpers.
 *
 * Tests cover:
 *   - Successful OCR result normalization
 *   - Low-confidence normalization
 *   - Empty text handling
 *   - Provider failure -> OCR_FAILED mapping
 *   - Provider not configured -> OCR_PROVIDER_NOT_CONFIGURED mapping
 *   - No stack trace leakage
 *   - No raw image / base64 leakage
 *   - No API key / secret leakage
 *   - Warning preservation (only known codes survive)
 *   - Language hints preservation
 *   - Confidence clamping to [0, 1]
 *   - rawMetadata safe-field whitelisting
 *   - Malformed input defaults
 *   - Unknown error codes fall back safely
 */

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const {
  normalizeOcrResult,
  normalizeOcrError,
  normalizeProvider,
  normalizeMode,
  normalizeText,
  clampConfidence,
  normalizeLanguageHints,
  normalizeWarnings,
  normalizeRawMetadata,
  resolveErrorCode,
  stripForbiddenFields,
  looksLikeSecret,
  CONFIDENCE_MIN,
  CONFIDENCE_MAX,
  FORBIDDEN_FIELDS,
  KNOWN_OCR_ERROR_CODES,
  SAFE_METADATA_KEYS
} = require('../../src/providers/ocr/ocrProviderContract');

const { OcrProviderName, OcrProviderMode, OcrWarningCode } = require('../../src/providers/ocr/ocrProviderTypes');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadFixture(name) {
  const filePath = path.join(__dirname, '..', 'fixtures', 'ocr', name);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function assertNoForbiddenKeys(obj, pathName) {
  if (obj === null || obj === undefined) return;
  if (Array.isArray(obj)) {
    obj.forEach(function (item, i) { assertNoForbiddenKeys(item, pathName + '[' + i + ']'); });
    return;
  }
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(function (key) {
      const lower = key.toLowerCase();
      assert.ok(
        !FORBIDDEN_FIELDS.has(lower),
        'Forbidden key "' + key + '" found at ' + pathName
      );
      assertNoForbiddenKeys(obj[key], pathName + '.' + key);
    });
  }
}

// ---------------------------------------------------------------------------
// normalizeOcrResult — success cases
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — success normalization', function () {
  test('should normalize a valid high-confidence result', function () {
    const fixture = loadFixture('validSuccessResult.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.provider, 'qwen_ocr_skeleton');
    assert.strictEqual(result.mode, 'ocr');
    assert.strictEqual(result.text, 'Tonkotsu Ramen JPY 980\nMiso Katsu Skewers JPY 800');
    assert.deepStrictEqual(result.languageHints, ['ja']);
    assert.strictEqual(result.confidence, 0.95);
    assert.deepStrictEqual(result.warnings, []);
    assert.deepStrictEqual(result.rawMetadata, {
      processingTimeMs: 1200,
      modelVersion: 'qwen-vl-max',
      ocrEngine: 'qwen-vl',
      pageCount: 1,
      detectedOrientation: 'up'
    });
  });

  test('should normalize a minimal valid result', function () {
    const fixture = loadFixture('minimalResult.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.provider, 'mock_ocr');
    assert.strictEqual(result.mode, 'mock');
    assert.strictEqual(result.text, 'Fish and Chips $14.90');
    assert.deepStrictEqual(result.languageHints, ['en']);
    assert.strictEqual(result.confidence, 0.98);
    assert.deepStrictEqual(result.warnings, []);
    assert.strictEqual(result.rawMetadata, null);
  });

  test('should normalize an empty input object with safe defaults', function () {
    const result = normalizeOcrResult({});

    assert.strictEqual(result.provider, 'unknown_ocr');
    assert.strictEqual(result.mode, 'ocr');
    assert.strictEqual(result.text, '');
    assert.deepStrictEqual(result.languageHints, []);
    assert.strictEqual(result.confidence, 0);
    assert.deepStrictEqual(result.warnings, []);
    assert.strictEqual(result.rawMetadata, null);
  });

  test('should normalize null/undefined input with safe defaults', function () {
    const r1 = normalizeOcrResult(null);
    const r2 = normalizeOcrResult(undefined);

    assert.strictEqual(r1.provider, 'unknown_ocr');
    assert.strictEqual(r2.provider, 'unknown_ocr');
    assert.strictEqual(r1.text, '');
    assert.strictEqual(r2.text, '');
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrResult — low confidence
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — low confidence', function () {
  test('should preserve low confidence value', function () {
    const fixture = loadFixture('lowConfidenceResult.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.confidence, 0.35);
    assert.ok(result.confidence < 0.5, 'confidence should be below 0.5');
  });

  test('should preserve LOW_OCR_CONFIDENCE warning', function () {
    const fixture = loadFixture('lowConfidenceResult.json');
    const result = normalizeOcrResult(fixture);

    assert.deepStrictEqual(result.warnings, ['LOW_OCR_CONFIDENCE']);
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrResult — empty text
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — empty text', function () {
  test('should preserve empty text string', function () {
    const fixture = loadFixture('emptyTextResult.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.text, '');
  });

  test('should preserve OCR_EMPTY_TEXT warning', function () {
    const fixture = loadFixture('emptyTextResult.json');
    const result = normalizeOcrResult(fixture);

    assert.deepStrictEqual(result.warnings, ['OCR_EMPTY_TEXT']);
  });

  test('should map non-string text to empty string', function () {
    const result = normalizeOcrResult({ text: 12345, provider: 'mock_ocr' });
    assert.strictEqual(result.text, '');
  });

  test('should map null text to empty string', function () {
    const fixture = loadFixture('malformedInput.json');
    const result = normalizeOcrResult(fixture);
    assert.strictEqual(result.text, '');
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrResult — forbidden field leakage prevention
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — no stack trace / secret / image leakage', function () {
  test('should strip all forbidden fields from result', function () {
    const fixture = loadFixture('rawWithSecrets.json');
    const result = normalizeOcrResult(fixture);

    assertNoForbiddenKeys(result, 'result');
  });

  test('should not include stack trace in result', function () {
    const fixture = loadFixture('rawWithSecrets.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.stack, undefined);
    assert.strictEqual(result.stackTrace, undefined);
  });

  test('should not include API keys or secrets in result', function () {
    const fixture = loadFixture('rawWithSecrets.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.apiKey, undefined);
    assert.strictEqual(result.authorization, undefined);
    assert.strictEqual(result.bearer, undefined);
    assert.strictEqual(result.token, undefined);
    assert.strictEqual(result.secret, undefined);
    assert.strictEqual(result.credentials, undefined);
  });

  test('should not include image or base64 data in result', function () {
    const fixture = loadFixture('rawWithSecrets.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.image, undefined);
    assert.strictEqual(result.imageBytes, undefined);
    assert.strictEqual(result.imagePayload, undefined);
    assert.strictEqual(result.base64, undefined);
    assert.strictEqual(result.rawImage, undefined);
    assert.strictEqual(result.menuImage, undefined);
  });

  test('should not include raw provider response data in result', function () {
    const fixture = loadFixture('rawWithSecrets.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.providerRawResponse, undefined);
    assert.strictEqual(result.providerRawError, undefined);
    assert.strictEqual(result.rawHttpResponse, undefined);
    assert.strictEqual(result.requestHeaders, undefined);
    assert.strictEqual(result.responseHeaders, undefined);
  });

  test('should strip forbidden fields from rawMetadata', function () {
    const fixture = loadFixture('rawWithSecrets.json');
    const result = normalizeOcrResult(fixture);

    assert.ok(result.rawMetadata !== null);
    assert.strictEqual(result.rawMetadata.processingTimeMs, 300);
    assert.strictEqual(result.rawMetadata.apiKey, undefined);
    assert.strictEqual(result.rawMetadata.token, undefined);
    assert.strictEqual(result.rawMetadata.stack, undefined);
    assert.strictEqual(result.rawMetadata.image, undefined);
    assert.strictEqual(result.rawMetadata.base64, undefined);
  });

  test('result should be a plain object (not an Error)', function () {
    const result = normalizeOcrResult({ provider: 'mock_ocr', text: 'hello' });
    assert.ok(!(result instanceof Error));
    assert.strictEqual(typeof result, 'object');
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrResult — warning preservation
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — warning preservation', function () {
  test('should preserve known warning codes', function () {
    const result = normalizeOcrResult({
      provider: 'mock_ocr',
      warnings: ['LOW_OCR_CONFIDENCE', 'OCR_EMPTY_TEXT']
    });

    assert.deepStrictEqual(result.warnings, ['LOW_OCR_CONFIDENCE', 'OCR_EMPTY_TEXT']);
  });

  test('should filter out unknown warning codes', function () {
    const result = normalizeOcrResult({
      provider: 'mock_ocr',
      warnings: ['LOW_OCR_CONFIDENCE', 'CUSTOM_WARNING', 'OCR_EMPTY_TEXT', 'bad_code']
    });

    assert.deepStrictEqual(result.warnings, ['LOW_OCR_CONFIDENCE', 'OCR_EMPTY_TEXT']);
  });

  test('should deduplicate warnings', function () {
    const result = normalizeOcrResult({
      provider: 'mock_ocr',
      warnings: ['LOW_OCR_CONFIDENCE', 'LOW_OCR_CONFIDENCE', 'LOW_OCR_CONFIDENCE']
    });

    assert.deepStrictEqual(result.warnings, ['LOW_OCR_CONFIDENCE']);
  });

  test('should handle non-array warnings gracefully', function () {
    const result = normalizeOcrResult({ provider: 'mock_ocr', warnings: 'not-array' });
    assert.deepStrictEqual(result.warnings, []);
  });

  test('should handle null warnings gracefully', function () {
    const result = normalizeOcrResult({ provider: 'mock_ocr', warnings: null });
    assert.deepStrictEqual(result.warnings, []);
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrResult — language hints preservation
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — language hints', function () {
  test('should preserve valid language hints', function () {
    const result = normalizeOcrResult({
      provider: 'mock_ocr',
      languageHints: ['ja', 'en', 'zh-Hant']
    });

    assert.deepStrictEqual(result.languageHints, ['ja', 'en', 'zh-Hant']);
  });

  test('should filter out non-string language hints', function () {
    const result = normalizeOcrResult({
      provider: 'mock_ocr',
      languageHints: ['ja', 123, null, 'en', {}, true]
    });

    assert.deepStrictEqual(result.languageHints, ['ja', 'en']);
  });

  test('should trim whitespace from language hints', function () {
    const result = normalizeOcrResult({
      provider: 'mock_ocr',
      languageHints: ['  ja  ', ' en ']
    });

    assert.deepStrictEqual(result.languageHints, ['ja', 'en']);
  });

  test('should handle non-array language hints', function () {
    const r1 = normalizeOcrResult({ provider: 'mock_ocr', languageHints: 'ja' });
    const r2 = normalizeOcrResult({ provider: 'mock_ocr', languageHints: null });

    assert.deepStrictEqual(r1.languageHints, []);
    assert.deepStrictEqual(r2.languageHints, []);
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrResult — confidence clamping
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — confidence clamping', function () {
  test('should clamp confidence above 1.0 to 1.0', function () {
    const result = normalizeOcrResult({ provider: 'mock_ocr', confidence: 1.5 });
    assert.strictEqual(result.confidence, 1.0);
  });

  test('should clamp confidence below 0.0 to 0.0', function () {
    const result = normalizeOcrResult({ provider: 'mock_ocr', confidence: -0.3 });
    assert.strictEqual(result.confidence, 0.0);
  });

  test('should accept exactly 1.0', function () {
    const result = normalizeOcrResult({ provider: 'mock_ocr', confidence: 1.0 });
    assert.strictEqual(result.confidence, 1.0);
  });

  test('should accept exactly 0.0', function () {
    const result = normalizeOcrResult({ provider: 'mock_ocr', confidence: 0.0 });
    assert.strictEqual(result.confidence, 0.0);
  });

  test('should map NaN to 0.0', function () {
    const result = normalizeOcrResult({ provider: 'mock_ocr', confidence: NaN });
    assert.strictEqual(result.confidence, 0.0);
  });

  test('should map non-number confidence to 0.0', function () {
    const r1 = normalizeOcrResult({ provider: 'mock_ocr', confidence: 'high' });
    const r2 = normalizeOcrResult({ provider: 'mock_ocr', confidence: null });
    const r3 = normalizeOcrResult({ provider: 'mock_ocr', confidence: undefined });

    assert.strictEqual(r1.confidence, 0.0);
    assert.strictEqual(r2.confidence, 0.0);
    assert.strictEqual(r3.confidence, 0.0);
  });

  test('should accept confidence at boundary values', function () {
    assert.strictEqual(clampConfidence(0), 0);
    assert.strictEqual(clampConfidence(1), 1);
    assert.strictEqual(clampConfidence(0.5), 0.5);
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrResult — malformed input defaults
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — malformed input', function () {
  test('should handle completely malformed input', function () {
    const fixture = loadFixture('malformedInput.json');
    const result = normalizeOcrResult(fixture);

    assert.strictEqual(result.provider, 'unknown_ocr');
    assert.strictEqual(result.mode, 'ocr');
    assert.strictEqual(result.text, '');
    assert.deepStrictEqual(result.languageHints, []);
    assert.strictEqual(result.confidence, 0.0);
    assert.deepStrictEqual(result.warnings, []);
    assert.strictEqual(result.rawMetadata, null);
  });

  test('rawMetadata for malformed type should be null', function () {
    assert.strictEqual(normalizeRawMetadata('not-object'), null);
    assert.strictEqual(normalizeRawMetadata(123), null);
    assert.strictEqual(normalizeRawMetadata([]), null);
    assert.strictEqual(normalizeRawMetadata(null), null);
    assert.strictEqual(normalizeRawMetadata(undefined), null);
  });

  test('rawMetadata with empty object should be null', function () {
    assert.strictEqual(normalizeRawMetadata({}), null);
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrError — failure mapping
// ---------------------------------------------------------------------------

describe('normalizeOcrError — failure mapping', function () {
  test('should map OCR_FAILED to a safe error', function () {
    const fixture = loadFixture('ocrFailureError.json');
    const error = normalizeOcrError(fixture.error);

    assert.ok(error instanceof Error);
    assert.strictEqual(error.code, 'OCR_FAILED');
    assert.strictEqual(error.message, 'Mock OCR failure scenario requested.');
  });

  test('should not include stack trace in normalized error', function () {
    const fixture = loadFixture('ocrFailureError.json');
    const error = normalizeOcrError(fixture.error);

    assert.strictEqual(error.stack, undefined);
  });

  test('should not include raw provider response in normalized error', function () {
    const fixture = loadFixture('ocrFailureError.json');
    const error = normalizeOcrError(fixture.error);

    assert.strictEqual(error.providerRawResponse, undefined);
    assert.strictEqual(error.providerRawError, undefined);
  });

  test('should not include API keys or image data in normalized error', function () {
    const fixture = loadFixture('ocrFailureError.json');
    const error = normalizeOcrError(fixture.error);

    assert.strictEqual(error.apiKey, undefined);
    assert.strictEqual(error.imagePayload, undefined);
  });

  test('should preserve provider in normalized error if valid', function () {
    const fixture = loadFixture('ocrFailureError.json');
    const error = normalizeOcrError(fixture.error);

    assert.strictEqual(error.provider, 'mock_ocr');
  });

  test('unknown error codes should fall back to OCR_FAILED', function () {
    const fixture = loadFixture('unknownError.json');
    const error = normalizeOcrError(fixture.error);

    assert.strictEqual(error.code, 'OCR_FAILED');
  });

  test('unknown error should not preserve stack trace', function () {
    const fixture = loadFixture('unknownError.json');
    const error = normalizeOcrError(fixture.error);

    assert.strictEqual(error.stack, undefined);
  });

  test('unknown error should have a friendly fallback message', function () {
    const error = normalizeOcrError(null, 'OCR_FAILED');
    assert.ok(error instanceof Error);
    assert.strictEqual(error.code, 'OCR_FAILED');
    assert.ok(error.message.length > 0);
  });

  test('OCR_PROVIDER_NOT_CONFIGURED should pass through', function () {
    const error = normalizeOcrError({
      code: 'OCR_PROVIDER_NOT_CONFIGURED',
      message: 'OCR provider is not configured.',
      provider: 'qwen_ocr_skeleton'
    });

    assert.strictEqual(error.code, 'OCR_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(error.provider, 'qwen_ocr_skeleton');
  });

  test('OCR_PROVIDER_INVALID should pass through', function () {
    const error = normalizeOcrError({
      code: 'OCR_PROVIDER_INVALID',
      message: 'OCR provider setting is invalid.'
    });

    assert.strictEqual(error.code, 'OCR_PROVIDER_INVALID');
  });

  test('custom fallback code can be provided', function () {
    const error = normalizeOcrError({ message: 'Something went wrong' }, 'OCR_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(error.code, 'OCR_PROVIDER_NOT_CONFIGURED');
  });
});

// ---------------------------------------------------------------------------
// normalizeOcrError — provider mapping
// ---------------------------------------------------------------------------

describe('normalizeOcrError — provider mapping', function () {
  test('should map OCR_FAILED for unknown errors', function () {
    const error = normalizeOcrError(new Error('Something failed'));
    assert.strictEqual(error.code, 'OCR_FAILED');
  });

  test('should map OCR_PROVIDER_NOT_CONFIGURED when code present', function () {
    const err = new Error('Not configured');
    err.code = 'OCR_PROVIDER_NOT_CONFIGURED';
    const error = normalizeOcrError(err);
    assert.strictEqual(error.code, 'OCR_PROVIDER_NOT_CONFIGURED');
  });

  test('should not leak message from unknown code error', function () {
    const err = new Error('internal panic: secret=xyz');
    err.code = 'INTERNAL_ERROR';
    const error = normalizeOcrError(err);
    // Message is preserved but code is sanitised
    assert.strictEqual(error.code, 'OCR_FAILED');
    assert.ok(!error.stack);
  });
});

// ---------------------------------------------------------------------------
// Sub-normalizer unit tests
// ---------------------------------------------------------------------------

describe('normalizeProvider', function () {
  test('known provider names pass through', function () {
    assert.strictEqual(normalizeProvider('mock_ocr'), 'mock_ocr');
    assert.strictEqual(normalizeProvider('qwen_ocr_skeleton'), 'qwen_ocr_skeleton');
    assert.strictEqual(normalizeProvider('google_vision_skeleton'), 'google_vision_skeleton');
    assert.strictEqual(normalizeProvider('openai_vision_skeleton'), 'openai_vision_skeleton');
  });

  test('unknown provider name returns unknown_ocr', function () {
    assert.strictEqual(normalizeProvider('random_provider'), 'unknown_ocr');
    assert.strictEqual(normalizeProvider(''), 'unknown_ocr');
    assert.strictEqual(normalizeProvider(null), 'unknown_ocr');
    assert.strictEqual(normalizeProvider(undefined), 'unknown_ocr');
    assert.strictEqual(normalizeProvider(42), 'unknown_ocr');
  });
});

describe('normalizeMode', function () {
  test('explicit mode passes through', function () {
    assert.strictEqual(normalizeMode('ocr', 'qwen_ocr_skeleton'), 'ocr');
    assert.strictEqual(normalizeMode('mock', 'mock_ocr'), 'mock');
  });

  test('missing mode derives from mock_ocr provider', function () {
    assert.strictEqual(normalizeMode('', 'mock_ocr'), 'mock');
    assert.strictEqual(normalizeMode(null, 'mock_ocr'), 'mock');
    assert.strictEqual(normalizeMode(undefined, 'mock_ocr'), 'mock');
  });

  test('missing mode for non-mock provider defaults to ocr', function () {
    assert.strictEqual(normalizeMode('', 'qwen_ocr_skeleton'), 'ocr');
    assert.strictEqual(normalizeMode(null, 'google_vision_skeleton'), 'ocr');
  });
});

describe('normalizeText', function () {
  test('string passes through', function () {
    assert.strictEqual(normalizeText('hello'), 'hello');
    assert.strictEqual(normalizeText(''), '');
  });

  test('non-string becomes empty string', function () {
    assert.strictEqual(normalizeText(null), '');
    assert.strictEqual(normalizeText(123), '');
    assert.strictEqual(normalizeText(undefined), '');
    assert.strictEqual(normalizeText({}), '');
  });
});

describe('normalizeLanguageHints', function () {
  test('valid array passes through', function () {
    assert.deepStrictEqual(normalizeLanguageHints(['ja', 'en']), ['ja', 'en']);
  });

  test('non-string entries are filtered', function () {
    assert.deepStrictEqual(normalizeLanguageHints(['ja', 123, null, 'en']), ['ja', 'en']);
  });

  test('non-array becomes empty array', function () {
    assert.deepStrictEqual(normalizeLanguageHints('ja'), []);
    assert.deepStrictEqual(normalizeLanguageHints(null), []);
    assert.deepStrictEqual(normalizeLanguageHints(undefined), []);
  });

  test('trims whitespace', function () {
    assert.deepStrictEqual(normalizeLanguageHints(['  zh  ']), ['zh']);
  });
});

describe('normalizeWarnings', function () {
  test('known codes pass through', function () {
    assert.deepStrictEqual(normalizeWarnings(['LOW_OCR_CONFIDENCE']), ['LOW_OCR_CONFIDENCE']);
    assert.deepStrictEqual(normalizeWarnings(['OCR_EMPTY_TEXT']), ['OCR_EMPTY_TEXT']);
  });

  test('unknown codes are filtered', function () {
    assert.deepStrictEqual(normalizeWarnings(['LOW_OCR_CONFIDENCE', 'bad', 'OCR_EMPTY_TEXT']),
      ['LOW_OCR_CONFIDENCE', 'OCR_EMPTY_TEXT']);
  });

  test('duplicates are removed', function () {
    assert.deepStrictEqual(
      normalizeWarnings(['LOW_OCR_CONFIDENCE', 'LOW_OCR_CONFIDENCE']),
      ['LOW_OCR_CONFIDENCE']
    );
  });
});

describe('resolveErrorCode', function () {
  test('known codes pass through', function () {
    assert.strictEqual(resolveErrorCode('OCR_FAILED', 'FALLBACK'), 'OCR_FAILED');
    assert.strictEqual(resolveErrorCode('OCR_EMPTY_TEXT', 'FALLBACK'), 'OCR_EMPTY_TEXT');
    assert.strictEqual(resolveErrorCode('OCR_PROVIDER_NOT_CONFIGURED', 'FALLBACK'), 'OCR_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(resolveErrorCode('OCR_PROVIDER_INVALID', 'FALLBACK'), 'OCR_PROVIDER_INVALID');
  });

  test('unknown codes fall back', function () {
    assert.strictEqual(resolveErrorCode('UNKNOWN', 'OCR_FAILED'), 'OCR_FAILED');
    assert.strictEqual(resolveErrorCode(null, 'OCR_FAILED'), 'OCR_FAILED');
    assert.strictEqual(resolveErrorCode(undefined, 'OCR_FAILED'), 'OCR_FAILED');
  });
});

describe('stripForbiddenFields', function () {
  test('should strip all forbidden fields from object', function () {
    const input = {
      text: 'hello',
      provider: 'mock_ocr',
      stack: 'trace',
      apiKey: 'sk-secret',
      image: 'base64-data',
      nested: {
        text: 'nested',
        token: 'secret-token',
        providerRawResponse: { status: 500 }
      }
    };
    const result = stripForbiddenFields(input);

    assert.strictEqual(result.text, 'hello');
    assert.strictEqual(result.provider, 'mock_ocr');
    assert.strictEqual(result.stack, undefined);
    assert.strictEqual(result.apiKey, undefined);
    assert.strictEqual(result.image, undefined);
    assert.strictEqual(result.nested.text, 'nested');
    assert.strictEqual(result.nested.token, undefined);
    assert.strictEqual(result.nested.providerRawResponse, undefined);
  });

  test('original object is not mutated', function () {
    const input = { text: 'hello', stack: 'trace' };
    const result = stripForbiddenFields(input);

    assert.strictEqual(result.stack, undefined);
    assert.strictEqual(input.stack, 'trace'); // original intact
  });

  test('handles arrays correctly', function () {
    const input = [
      { text: 'a', stack: 't1' },
      { text: 'b', image: 'img' }
    ];
    const result = stripForbiddenFields(input);

    assert.strictEqual(result[0].text, 'a');
    assert.strictEqual(result[0].stack, undefined);
    assert.strictEqual(result[1].text, 'b');
    assert.strictEqual(result[1].image, undefined);
  });
});

describe('looksLikeSecret', function () {
  test('sk- prefixed strings are secrets', function () {
    assert.strictEqual(looksLikeSecret('sk-abc123'), true);
  });

  test('JWT-like strings are secrets', function () {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOnRydWV9.abcdefghij1234567890';
    assert.strictEqual(looksLikeSecret(jwt), true);
  });

  test('long base64-like strings are secrets', function () {
    const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/==';
    assert.strictEqual(looksLikeSecret(b64), true);
  });

  test('very long strings are secrets', function () {
    const long = 'a'.repeat(600);
    assert.strictEqual(looksLikeSecret(long), true);
  });

  test('short normal strings are not secrets', function () {
    assert.strictEqual(looksLikeSecret('qwen-vl-max'), false);
    assert.strictEqual(looksLikeSecret('up'), false);
    assert.strictEqual(looksLikeSecret('model-v1'), false);
  });
});

describe('normalizeRawMetadata', function () {
  test('only safe keys pass through', function () {
    const result = normalizeRawMetadata({
      processingTimeMs: 500,
      modelVersion: 'v1',
      ocrEngine: 'test-engine',
      pageCount: 3,
      detectedOrientation: 'up',
      arbitraryField: 'should-be-dropped',
      apiKey: 'sk-secret'
    });

    assert.deepStrictEqual(result, {
      processingTimeMs: 500,
      modelVersion: 'v1',
      ocrEngine: 'test-engine',
      pageCount: 3,
      detectedOrientation: 'up'
    });
  });

  test('secret-like string values in safe fields are dropped', function () {
    const result = normalizeRawMetadata({
      processingTimeMs: 500,
      modelVersion: 'sk-secret-key-abc123def456ghijklmnopqrstuvwxyz'
    });

    assert.deepStrictEqual(result, { processingTimeMs: 500 });
    assert.strictEqual(result.modelVersion, undefined);
  });

  test('all-forbidden metadata returns null', function () {
    const result = normalizeRawMetadata({
      apiKey: 'sk-secret',
      token: 'jwt-token'
    });

    assert.strictEqual(result, null);
  });
});

// ---------------------------------------------------------------------------
// Constraint: result shape stability
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — contract shape stability', function () {
  test('result must always contain all contract fields', function () {
    const result = normalizeOcrResult({});

    const keys = Object.keys(result).sort();
    assert.deepStrictEqual(keys, [
      'confidence',
      'languageHints',
      'mode',
      'provider',
      'rawMetadata',
      'text',
      'warnings'
    ]);
  });

  test('result must not contain extra fields beyond the contract', function () {
    const result = normalizeOcrResult({ extraField: 'should-not-survive', provider: 'mock_ocr' });

    assert.strictEqual(result.extraField, undefined);
  });
});

// ---------------------------------------------------------------------------
// Constraint: idempotency
// ---------------------------------------------------------------------------

describe('normalizeOcrResult — idempotency', function () {
  test('normalizing a normalized result should be a no-op', function () {
    const input = {
      provider: 'mock_ocr',
      mode: 'mock',
      text: 'Test text',
      languageHints: ['en'],
      confidence: 0.88,
      warnings: ['LOW_OCR_CONFIDENCE'],
      rawMetadata: { processingTimeMs: 100 }
    };

    const first = normalizeOcrResult(input);
    const second = normalizeOcrResult(first);

    assert.deepStrictEqual(second, first);
  });
});
