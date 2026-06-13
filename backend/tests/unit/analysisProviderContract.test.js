/**
 * analysisProviderContract.test.js
 *
 * Unit tests for the Analysis provider contract and normalization helpers.
 *
 * Tests cover:
 *   - Successful analysis result normalization
 *   - Dish normalization with backward-compatible mock fields
 *   - Multiple dishes
 *   - Empty dishes mapping
 *   - Low confidence warning preservation
 *   - Malformed provider result -> safe defaults
 *   - Provider failure -> ANALYSIS_FAILED mapping
 *   - Provider not configured -> ANALYSIS_PROVIDER_NOT_CONFIGURED mapping
 *   - No stack trace leakage
 *   - No raw prompt / raw provider response / header / secret leakage
 *   - Confidence clamping to [0, 1]
 *   - Dish score clamping to [0, 100]
 *   - Price clamping
 *   - Warnings de-duplication
 *   - ID generation and stable fallback
 *   - Compatibility with current mock_ai response shape
 *   - Contract shape stability
 *   - Idempotency
 */

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const {
  normalizeAnalysisResult,
  normalizeAnalysisError,
  normalizeProvider,
  normalizeMode,
  normalizeString,
  normalizeStringArray,
  clampConfidence,
  clampScore,
  clampPrice,
  normalizeSpiceLevel,
  normalizeWarnings,
  normalizeDishes,
  normalizeDish,
  normalizePriceIntelligence,
  normalizeCurrency,
  normalizeRawMetadata,
  generateDishId,
  resolveErrorCode,
  sanitizeMessage,
  stripForbiddenFields,
  looksLikeSecret,
  CONFIDENCE_MIN,
  CONFIDENCE_MAX,
  SCORE_MIN,
  SCORE_MAX,
  FORBIDDEN_FIELDS,
  KNOWN_ANALYSIS_ERROR_CODES,
  SAFE_METADATA_KEYS
} = require('../../src/providers/analysis/analysisProviderContract');

const {
  AnalysisProviderName,
  AnalysisProviderMode,
  AnalysisWarningCode
} = require('../../src/providers/analysis/analysisProviderTypes');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadFixture(name) {
  var filePath = path.join(__dirname, '..', 'fixtures', 'analysis', name);
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
      var lower = key.toLowerCase();
      assert.ok(
        !FORBIDDEN_FIELDS.has(lower),
        'Forbidden key "' + key + '" found at ' + pathName
      );
      assertNoForbiddenKeys(obj[key], pathName + '.' + key);
    });
  }
}

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — success cases
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — success normalization', function () {
  test('should normalize a valid multi-dish result', function () {
    var fixture = loadFixture('validSuccessResult.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.provider, 'mock_ai');
    assert.strictEqual(result.mode, 'mock');
    assert.strictEqual(result.confidence, 0.96);
    assert.deepStrictEqual(result.warnings, []);
    assert.strictEqual(result.dishes.length, 2);

    // First dish
    var d1 = result.dishes[0];
    assert.strictEqual(d1.name, 'Tonkotsu Ramen');
    assert.strictEqual(d1.dishName, 'Tonkotsu Ramen');
    assert.strictEqual(d1.recommendationScore, 96);
    assert.strictEqual(d1.tasteScore, 96);
    assert.ok(d1.id && d1.id.startsWith('dish_'), 'should have stable id');
    assert.ok(d1.matchReasons.length > 0, 'should have match reasons');
    assert.strictEqual(d1.matchReasons[0], d1.recommendationReason);
    assert.deepStrictEqual(d1.allergens, ['Wheat', 'Egg']);
    assert.deepStrictEqual(d1.ingredients, ['Pork broth', 'Wheat noodles', 'Egg', 'Scallion', 'Chashu']);
    assert.strictEqual(d1.estimatedPrice, 980);
    assert.strictEqual(d1.currency, 'JPY');
    assert.strictEqual(d1.valueRating, 'Fair');
    assert.strictEqual(d1.originalName, null);
    assert.strictEqual(d1.spiceLevel, null);
    assert.deepStrictEqual(d1.riskFlags, []);
    assert.deepStrictEqual(d1.safetyNotes, []);

    // Price intelligence backward compatibility
    var pi = d1.priceIntelligence;
    assert.strictEqual(pi.localPrice, 980);
    assert.strictEqual(pi.localCurrency, 'JPY');
    assert.strictEqual(pi.homePrice, 6.62);
    assert.strictEqual(pi.homeCurrency, 'EUR');
    assert.strictEqual(pi.exchangeRate, 0.00675);
    assert.strictEqual(pi.assessment, 'Fair');

    // Second dish
    var d2 = result.dishes[1];
    assert.strictEqual(d2.name, 'Miso Katsu Skewers');
    assert.strictEqual(d2.valueRating, 'Good Value');
    assert.notStrictEqual(d2.id, d1.id, 'each dish should have unique id');

    // rawMetadata
    assert.ok(result.rawMetadata !== null);
    assert.strictEqual(result.rawMetadata.processingTimeMs, 45);
    assert.strictEqual(result.rawMetadata.modelVersion, 'mock-v1');
  });

  test('should normalize a single-dish result', function () {
    var fixture = loadFixture('singleDishResult.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.dishes.length, 1);
    assert.strictEqual(result.dishes[0].name, 'Beef Noodle Soup');
    assert.strictEqual(result.dishes[0].estimatedPrice, 180);
    assert.strictEqual(result.dishes[0].currency, 'TWD');
    assert.strictEqual(result.confidence, 0.90);
  });

  test('should normalize an empty input object with safe defaults', function () {
    var result = normalizeAnalysisResult({});

    assert.strictEqual(result.provider, 'unknown_analysis');
    assert.strictEqual(result.mode, 'analysis');
    assert.strictEqual(result.confidence, 0);
    assert.deepStrictEqual(result.dishes, []);
    assert.deepStrictEqual(result.warnings, []);
    assert.strictEqual(result.rawMetadata, null);
  });

  test('should normalize null/undefined input with safe defaults', function () {
    var r1 = normalizeAnalysisResult(null);
    var r2 = normalizeAnalysisResult(undefined);

    assert.strictEqual(r1.provider, 'unknown_analysis');
    assert.strictEqual(r2.provider, 'unknown_analysis');
    assert.deepStrictEqual(r1.dishes, []);
    assert.deepStrictEqual(r2.dishes, []);
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — empty result
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — empty result', function () {
  test('should preserve empty dishes array', function () {
    var fixture = loadFixture('emptyResult.json');
    var result = normalizeAnalysisResult(fixture);

    assert.deepStrictEqual(result.dishes, []);
    assert.strictEqual(result.confidence, 0);
  });

  test('should preserve ANALYSIS_EMPTY_RESULT warning', function () {
    var fixture = loadFixture('emptyResult.json');
    var result = normalizeAnalysisResult(fixture);

    assert.deepStrictEqual(result.warnings, ['ANALYSIS_EMPTY_RESULT']);
  });

  test('non-array dishes should become empty array', function () {
    var result = normalizeAnalysisResult({ dishes: 'not-an-array', provider: 'mock_ai' });
    assert.deepStrictEqual(result.dishes, []);
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — low confidence
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — low confidence', function () {
  test('should preserve low confidence value', function () {
    var fixture = loadFixture('lowConfidenceResult.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.confidence, 0.55);
    assert.ok(result.confidence < 0.6, 'confidence should be below 0.6');
  });

  test('should preserve LOW_ANALYSIS_CONFIDENCE and NEEDS_REVIEW warnings', function () {
    var fixture = loadFixture('lowConfidenceResult.json');
    var result = normalizeAnalysisResult(fixture);

    assert.deepStrictEqual(result.warnings, ['LOW_ANALYSIS_CONFIDENCE', 'NEEDS_REVIEW']);
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — forbidden field leakage prevention
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — no secret / stack / raw data leakage', function () {
  test('should strip all forbidden fields from result', function () {
    var fixture = loadFixture('rawWithSecrets.json');
    var result = normalizeAnalysisResult(fixture);

    assertNoForbiddenKeys(result, 'result');
  });

  test('should not include stack trace in result', function () {
    var fixture = loadFixture('rawWithSecrets.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.stack, undefined);
    assert.strictEqual(result.stackTrace, undefined);
  });

  test('should not include API keys or secrets in result', function () {
    var fixture = loadFixture('rawWithSecrets.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.apiKey, undefined);
    assert.strictEqual(result.authorization, undefined);
    assert.strictEqual(result.bearer, undefined);
    assert.strictEqual(result.token, undefined);
    assert.strictEqual(result.secret, undefined);
    assert.strictEqual(result.credentials, undefined);
  });

  test('should not include raw provider response data in result', function () {
    var fixture = loadFixture('rawWithSecrets.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.providerRawResponse, undefined);
    assert.strictEqual(result.providerRawError, undefined);
    assert.strictEqual(result.rawHttpResponse, undefined);
    assert.strictEqual(result.requestHeaders, undefined);
    assert.strictEqual(result.responseHeaders, undefined);
  });

  test('should not include raw prompt or raw OCR text in result', function () {
    var fixture = loadFixture('rawWithSecrets.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.rawPrompt, undefined);
    assert.strictEqual(result.completionPayload, undefined);
    assert.strictEqual(result.rawOcrText, undefined);
    assert.strictEqual(result.rawOcrResult, undefined);
    assert.strictEqual(result.systemPrompt, undefined);
    assert.strictEqual(result.userPrompt, undefined);
    assert.strictEqual(result.rawCompletion, undefined);
  });

  test('should not include image or base64 data in result', function () {
    var fixture = loadFixture('rawWithSecrets.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.image, undefined);
    assert.strictEqual(result.imageBytes, undefined);
    assert.strictEqual(result.imagePayload, undefined);
    assert.strictEqual(result.base64, undefined);
    assert.strictEqual(result.rawImage, undefined);
    assert.strictEqual(result.menuImage, undefined);
  });

  test('should strip forbidden fields from rawMetadata', function () {
    var fixture = loadFixture('rawWithSecrets.json');
    var result = normalizeAnalysisResult(fixture);

    assert.ok(result.rawMetadata !== null);
    assert.strictEqual(result.rawMetadata.processingTimeMs, 300);
    assert.strictEqual(result.rawMetadata.apiKey, undefined);
    assert.strictEqual(result.rawMetadata.token, undefined);
    assert.strictEqual(result.rawMetadata.stack, undefined);
    assert.strictEqual(result.rawMetadata.image, undefined);
    assert.strictEqual(result.rawMetadata.base64, undefined);
    assert.strictEqual(result.rawMetadata.rawPrompt, undefined);
    assert.strictEqual(result.rawMetadata.rawOcrText, undefined);
    assert.strictEqual(result.rawMetadata.requestHeaders, undefined);
    assert.strictEqual(result.rawMetadata.responseHeaders, undefined);
    assert.strictEqual(result.rawMetadata.completionPayload, undefined);
  });

  test('result should be a plain object (not an Error)', function () {
    var result = normalizeAnalysisResult({ provider: 'mock_ai', dishes: [] });
    assert.ok(!(result instanceof Error));
    assert.strictEqual(typeof result, 'object');
  });

  test('dish objects should also have no forbidden fields', function () {
    var fixture = loadFixture('rawWithSecrets.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.dishes.length, 1);
    assertNoForbiddenKeys(result.dishes[0], 'result.dishes[0]');
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — warning preservation
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — warning preservation', function () {
  test('should preserve known warning codes', function () {
    var result = normalizeAnalysisResult({
      provider: 'mock_ai',
      warnings: ['ANALYSIS_EMPTY_RESULT', 'LOW_ANALYSIS_CONFIDENCE', 'NEEDS_REVIEW']
    });

    assert.deepStrictEqual(result.warnings, ['ANALYSIS_EMPTY_RESULT', 'LOW_ANALYSIS_CONFIDENCE', 'NEEDS_REVIEW']);
  });

  test('should filter out unknown warning codes', function () {
    var result = normalizeAnalysisResult({
      provider: 'mock_ai',
      warnings: ['LOW_ANALYSIS_CONFIDENCE', 'CUSTOM_WARNING', 'NEEDS_REVIEW', 'bad_code']
    });

    assert.deepStrictEqual(result.warnings, ['LOW_ANALYSIS_CONFIDENCE', 'NEEDS_REVIEW']);
  });

  test('should deduplicate warnings', function () {
    var result = normalizeAnalysisResult({
      provider: 'mock_ai',
      warnings: ['LOW_ANALYSIS_CONFIDENCE', 'LOW_ANALYSIS_CONFIDENCE', 'LOW_ANALYSIS_CONFIDENCE']
    });

    assert.deepStrictEqual(result.warnings, ['LOW_ANALYSIS_CONFIDENCE']);
  });

  test('should handle non-array warnings gracefully', function () {
    var result = normalizeAnalysisResult({ provider: 'mock_ai', warnings: 'not-array' });
    assert.deepStrictEqual(result.warnings, []);
  });

  test('should handle null warnings gracefully', function () {
    var result = normalizeAnalysisResult({ provider: 'mock_ai', warnings: null });
    assert.deepStrictEqual(result.warnings, []);
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — confidence clamping
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — confidence clamping', function () {
  test('should clamp confidence above 1.0 to 1.0', function () {
    var result = normalizeAnalysisResult({ provider: 'mock_ai', confidence: 1.5 });
    assert.strictEqual(result.confidence, 1.0);
  });

  test('should clamp confidence below 0.0 to 0.0', function () {
    var result = normalizeAnalysisResult({ provider: 'mock_ai', confidence: -0.3 });
    assert.strictEqual(result.confidence, 0.0);
  });

  test('should accept exactly 1.0', function () {
    var result = normalizeAnalysisResult({ provider: 'mock_ai', confidence: 1.0 });
    assert.strictEqual(result.confidence, 1.0);
  });

  test('should map NaN to 0.0', function () {
    var result = normalizeAnalysisResult({ provider: 'mock_ai', confidence: NaN });
    assert.strictEqual(result.confidence, 0.0);
  });

  test('should map non-number confidence to 0.0', function () {
    var r1 = normalizeAnalysisResult({ provider: 'mock_ai', confidence: 'high' });
    var r2 = normalizeAnalysisResult({ provider: 'mock_ai', confidence: null });

    assert.strictEqual(r1.confidence, 0.0);
    assert.strictEqual(r2.confidence, 0.0);
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — score clamping
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — score clamping', function () {
  test('should clamp scores to [0, 100]', function () {
    var fixture = loadFixture('extremeScores.json');
    var result = normalizeAnalysisResult(fixture);

    var dish = result.dishes[0];
    assert.strictEqual(dish.tasteScore, 100, 'tasteScore 150 should clamp to 100');
    assert.strictEqual(dish.safetyScore, 0, 'safetyScore -20 should clamp to 0');
    assert.strictEqual(dish.valueScore, 100, 'valueScore 999 should clamp to 100');
    assert.strictEqual(dish.recommendationScore, 100, 'recommendationScore should match clamped tasteScore');
  });

  test('should clamp per-dish confidence', function () {
    var fixture = loadFixture('extremeScores.json');
    var result = normalizeAnalysisResult(fixture);

    var dish = result.dishes[0];
    assert.strictEqual(dish.confidence, 1.0, 'dish confidence 2.5 should clamp to 1.0');
  });

  test('should clamp negative prices to 0', function () {
    var fixture = loadFixture('extremeScores.json');
    var result = normalizeAnalysisResult(fixture);

    var dish = result.dishes[0];
    assert.strictEqual(dish.estimatedPrice, 0, 'negative price should clamp to 0');
    assert.strictEqual(dish.priceIntelligence.localPrice, 0);
  });

  test('deduplication of warnings on extremeScores', function () {
    var fixture = loadFixture('extremeScores.json');
    var result = normalizeAnalysisResult(fixture);

    assert.deepStrictEqual(result.warnings, ['LOW_ANALYSIS_CONFIDENCE']);
  });

  test('parent confidence should clamp independent of dishes', function () {
    var fixture = loadFixture('extremeScores.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.confidence, 1.0, 'parent confidence 1.5 should clamp to 1.0');
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — malformed input defaults
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — malformed input', function () {
  test('should handle completely malformed input', function () {
    var fixture = loadFixture('malformedResult.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.provider, 'unknown_analysis');
    assert.strictEqual(result.mode, 'analysis');
    assert.strictEqual(result.confidence, 0.0);
    assert.deepStrictEqual(result.dishes, []);
    assert.deepStrictEqual(result.warnings, []);
    assert.strictEqual(result.rawMetadata, null);
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisResult — mock compatibility
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — mock_ai compatibility', function () {
  test('normalized mock result should still have all mock dish fields', function () {
    var fixture = loadFixture('validSuccessResult.json');
    var result = normalizeAnalysisResult(fixture);
    var dish = result.dishes[0];

    // Old mock fields must still be present
    assert.strictEqual(typeof dish.dishName, 'string');
    assert.ok(Array.isArray(dish.ingredients));
    assert.strictEqual(typeof dish.tasteScore, 'number');
    assert.strictEqual(typeof dish.safetyScore, 'number');
    assert.strictEqual(typeof dish.valueScore, 'number');
    assert.strictEqual(typeof dish.recommendationReason, 'string');
    assert.ok(dish.priceIntelligence && typeof dish.priceIntelligence === 'object');
    assert.strictEqual(typeof dish.priceIntelligence.localPrice, 'number');
    assert.strictEqual(typeof dish.priceIntelligence.localCurrency, 'string');
    assert.strictEqual(typeof dish.priceIntelligence.homePrice, 'number');
    assert.strictEqual(typeof dish.priceIntelligence.homeCurrency, 'string');
    assert.strictEqual(typeof dish.priceIntelligence.exchangeRate, 'number');
    assert.strictEqual(typeof dish.priceIntelligence.assessment, 'string');

    // New contract fields should also be present
    assert.strictEqual(typeof dish.id, 'string');
    assert.ok(dish.id.length > 0);
    assert.strictEqual(typeof dish.name, 'string');
    assert.strictEqual(typeof dish.description, 'string');
    assert.strictEqual(typeof dish.recommendationScore, 'number');
    assert.ok(Array.isArray(dish.matchReasons));
    assert.ok(Array.isArray(dish.riskFlags));
    assert.ok(Array.isArray(dish.allergens));
    assert.ok(dish.spiceLevel === null || typeof dish.spiceLevel === 'string');
    assert.strictEqual(typeof dish.estimatedPrice, 'number');
    assert.strictEqual(typeof dish.currency, 'string');
    assert.strictEqual(typeof dish.valueRating, 'string');
    assert.ok(Array.isArray(dish.safetyNotes));
    assert.strictEqual(typeof dish.confidence, 'number');
  });

  test('mock result provider and mode are preserved', function () {
    var fixture = loadFixture('validSuccessResult.json');
    var result = normalizeAnalysisResult(fixture);

    assert.strictEqual(result.provider, 'mock_ai');
    assert.strictEqual(result.mode, 'mock');
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisError — failure mapping
// ---------------------------------------------------------------------------

describe('normalizeAnalysisError — failure mapping', function () {
  test('should map ANALYSIS_FAILED to a safe error', function () {
    var fixture = loadFixture('analysisFailureError.json');
    var error = normalizeAnalysisError(fixture.error);

    assert.ok(error instanceof Error);
    assert.strictEqual(error.code, 'ANALYSIS_FAILED');
    assert.strictEqual(error.message, 'Mock analysis failure scenario requested.');
  });

  test('should not include stack trace in normalized error', function () {
    var fixture = loadFixture('analysisFailureError.json');
    var error = normalizeAnalysisError(fixture.error);

    assert.strictEqual(error.stack, undefined);
  });

  test('should not include raw provider response in normalized error', function () {
    var fixture = loadFixture('analysisFailureError.json');
    var error = normalizeAnalysisError(fixture.error);

    assert.strictEqual(error.providerRawResponse, undefined);
    assert.strictEqual(error.providerRawError, undefined);
  });

  test('should not include API keys or raw prompt data in normalized error', function () {
    var fixture = loadFixture('analysisFailureError.json');
    var error = normalizeAnalysisError(fixture.error);

    assert.strictEqual(error.apiKey, undefined);
    assert.strictEqual(error.rawPrompt, undefined);
    assert.strictEqual(error.rawOcrText, undefined);
  });

  test('should preserve provider in normalized error if valid', function () {
    var fixture = loadFixture('analysisFailureError.json');
    var error = normalizeAnalysisError(fixture.error);

    assert.strictEqual(error.provider, 'mock_ai');
  });

  test('unknown error codes should fall back to ANALYSIS_FAILED', function () {
    var fixture = loadFixture('unknownError.json');
    var error = normalizeAnalysisError(fixture.error);

    assert.strictEqual(error.code, 'ANALYSIS_FAILED');
  });

  test('API key in error message should be redacted', function () {
    var fixture = loadFixture('unknownError.json');
    var error = normalizeAnalysisError(fixture.error);

    // The error message contained sk-abc123... which should be redacted
    assert.ok(
      error.message.indexOf('sk-abc123') === -1,
      'API key should be redacted from message'
    );
    assert.ok(
      error.message.indexOf('[REDACTED]') !== -1,
      'message should contain [REDACTED]'
    );
  });

  test('unknown error should not preserve stack trace', function () {
    var fixture = loadFixture('unknownError.json');
    var error = normalizeAnalysisError(fixture.error);

    assert.strictEqual(error.stack, undefined);
  });

  test('unknown error should have a friendly fallback message', function () {
    var error = normalizeAnalysisError(null, 'ANALYSIS_FAILED');
    assert.ok(error instanceof Error);
    assert.strictEqual(error.code, 'ANALYSIS_FAILED');
    assert.ok(error.message.length > 0);
  });

  test('ANALYSIS_PROVIDER_NOT_CONFIGURED should pass through', function () {
    var fixture = loadFixture('analysisNotConfiguredError.json');
    var error = normalizeAnalysisError(fixture.error);

    assert.strictEqual(error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(error.provider, 'qwen_analysis_skeleton');
    assert.strictEqual(error.message, 'Analysis provider is not configured.');
  });

  test('ANALYSIS_PROVIDER_INVALID should pass through', function () {
    var error = normalizeAnalysisError({
      code: 'ANALYSIS_PROVIDER_INVALID',
      message: 'Analysis provider setting is invalid.'
    });

    assert.strictEqual(error.code, 'ANALYSIS_PROVIDER_INVALID');
  });

  test('custom fallback code can be provided', function () {
    var error = normalizeAnalysisError(
      { message: 'Something went wrong' },
      'ANALYSIS_PROVIDER_NOT_CONFIGURED'
    );
    assert.strictEqual(error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
  });
});

// ---------------------------------------------------------------------------
// normalizeAnalysisError — provider mapping
// ---------------------------------------------------------------------------

describe('normalizeAnalysisError — provider mapping', function () {
  test('should map ANALYSIS_FAILED for unknown errors', function () {
    var error = normalizeAnalysisError(new Error('Something failed'));
    assert.strictEqual(error.code, 'ANALYSIS_FAILED');
  });

  test('should map ANALYSIS_PROVIDER_NOT_CONFIGURED when code present', function () {
    var err = new Error('Not configured');
    err.code = 'ANALYSIS_PROVIDER_NOT_CONFIGURED';
    var error = normalizeAnalysisError(err);
    assert.strictEqual(error.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
  });

  test('should not leak message from unknown code error', function () {
    var err = new Error('internal panic: secret=xyz');
    err.code = 'INTERNAL_ERROR';
    var error = normalizeAnalysisError(err);
    assert.strictEqual(error.code, 'ANALYSIS_FAILED');
    assert.ok(!error.stack);
  });
});

// ---------------------------------------------------------------------------
// normalizeDish — detailed dish normalization
// ---------------------------------------------------------------------------

describe('normalizeDish — detailed normalization', function () {
  test('should generate stable id from dish name', function () {
    var d1 = normalizeDish({ dishName: 'Tonkotsu Ramen' });
    var d2 = normalizeDish({ dishName: 'Tonkotsu Ramen' });
    var d3 = normalizeDish({ dishName: 'Miso Katsu Skewers' });

    assert.strictEqual(d1.id, d2.id, 'same name should produce same id');
    assert.notStrictEqual(d1.id, d3.id, 'different names should produce different ids');
    assert.ok(d1.id.startsWith('dish_'), 'id should have dish_ prefix');
    assert.strictEqual(d1.id.length, 13, 'id should be dish_ + 8 hex chars');
  });

  test('empty dish name should get fallback id', function () {
    var d = normalizeDish({});
    assert.strictEqual(d.id, 'dish_00000000');
    assert.strictEqual(d.name, '');
    assert.strictEqual(d.dishName, '');
  });

  test('should preserve originalName when provided', function () {
    var d = normalizeDish({ dishName: 'Ramen', originalName: 'ラーメン' });
    assert.strictEqual(d.name, 'Ramen');
    assert.strictEqual(d.originalName, 'ラーメン');
  });

  test('originalName should be null when empty/whitespace', function () {
    var d1 = normalizeDish({ dishName: 'Ramen', originalName: '' });
    var d2 = normalizeDish({ dishName: 'Ramen', originalName: '  ' });
    assert.strictEqual(d1.originalName, null);
    assert.strictEqual(d2.originalName, null);
  });

  test('should convert recommendationReason to matchReasons array', function () {
    var d = normalizeDish({
      dishName: 'Ramen',
      recommendationReason: 'Great taste and value'
    });
    assert.deepStrictEqual(d.matchReasons, ['Great taste and value']);
    assert.strictEqual(d.recommendationReason, 'Great taste and value');
  });

  test('should prefer explicit matchReasons over recommendationReason', function () {
    var d = normalizeDish({
      dishName: 'Ramen',
      matchReasons: ['Reason A', 'Reason B'],
      recommendationReason: 'Old reason'
    });
    assert.deepStrictEqual(d.matchReasons, ['Reason A', 'Reason B']);
    assert.strictEqual(d.recommendationReason, 'Reason A');
  });

  test('should normalize spiceLevel to known values', function () {
    assert.strictEqual(normalizeDish({ dishName: 'Hot', spiceLevel: 'mild' }).spiceLevel, 'mild');
    assert.strictEqual(normalizeDish({ dishName: 'Hot', spiceLevel: 'medium' }).spiceLevel, 'medium');
    assert.strictEqual(normalizeDish({ dishName: 'Hot', spiceLevel: 'hot' }).spiceLevel, 'hot');
    assert.strictEqual(normalizeDish({ dishName: 'Hot', spiceLevel: '  HOT  ' }).spiceLevel, 'hot');
    assert.strictEqual(normalizeDish({ dishName: 'Hot', spiceLevel: 'very spicy' }).spiceLevel, null);
    assert.strictEqual(normalizeDish({ dishName: 'Hot', spiceLevel: null }).spiceLevel, null);
  });

  test('should preserve explicit riskFlags and safetyNotes', function () {
    var d = normalizeDish({
      dishName: 'Ramen',
      riskFlags: ['Shellfish cross-contamination', 'High sodium'],
      safetyNotes: ['Ask about gluten-free noodles']
    });
    assert.deepStrictEqual(d.riskFlags, ['Shellfish cross-contamination', 'High sodium']);
    assert.deepStrictEqual(d.safetyNotes, ['Ask about gluten-free noodles']);
  });
});

// ---------------------------------------------------------------------------
// Sub-normalizer unit tests
// ---------------------------------------------------------------------------

describe('normalizeProvider', function () {
  test('known provider names pass through', function () {
    assert.strictEqual(normalizeProvider('mock_ai'), 'mock_ai');
    assert.strictEqual(normalizeProvider('qwen_analysis_skeleton'), 'qwen_analysis_skeleton');
    assert.strictEqual(normalizeProvider('deepseek_analysis_skeleton'), 'deepseek_analysis_skeleton');
    assert.strictEqual(normalizeProvider('openai_analysis_skeleton'), 'openai_analysis_skeleton');
  });

  test('unknown provider name returns unknown_analysis', function () {
    assert.strictEqual(normalizeProvider('random_provider'), 'unknown_analysis');
    assert.strictEqual(normalizeProvider(''), 'unknown_analysis');
    assert.strictEqual(normalizeProvider(null), 'unknown_analysis');
    assert.strictEqual(normalizeProvider(undefined), 'unknown_analysis');
    assert.strictEqual(normalizeProvider(42), 'unknown_analysis');
  });
});

describe('normalizeMode', function () {
  test('explicit mode passes through', function () {
    assert.strictEqual(normalizeMode('analysis', 'qwen_analysis_skeleton'), 'analysis');
    assert.strictEqual(normalizeMode('mock', 'mock_ai'), 'mock');
  });

  test('missing mode derives from mock_ai provider', function () {
    assert.strictEqual(normalizeMode('', 'mock_ai'), 'mock');
    assert.strictEqual(normalizeMode(null, 'mock_ai'), 'mock');
    assert.strictEqual(normalizeMode(undefined, 'mock_ai'), 'mock');
  });

  test('missing mode for non-mock provider defaults to analysis', function () {
    assert.strictEqual(normalizeMode('', 'qwen_analysis_skeleton'), 'analysis');
    assert.strictEqual(normalizeMode(null, 'deepseek_analysis_skeleton'), 'analysis');
  });
});

describe('normalizeString', function () {
  test('string passes through', function () {
    assert.strictEqual(normalizeString('hello'), 'hello');
    assert.strictEqual(normalizeString(''), '');
  });

  test('non-string becomes empty string', function () {
    assert.strictEqual(normalizeString(null), '');
    assert.strictEqual(normalizeString(123), '');
    assert.strictEqual(normalizeString(undefined), '');
    assert.strictEqual(normalizeString({}), '');
  });
});

describe('clampScore', function () {
  test('normal scores pass through', function () {
    assert.strictEqual(clampScore(50), 50);
    assert.strictEqual(clampScore(0), 0);
    assert.strictEqual(clampScore(100), 100);
  });

  test('above 100 clamps to 100', function () {
    assert.strictEqual(clampScore(150), 100);
    assert.strictEqual(clampScore(999), 100);
  });

  test('below 0 clamps to 0', function () {
    assert.strictEqual(clampScore(-10), 0);
    assert.strictEqual(clampScore(-50), 0);
  });

  test('NaN returns default', function () {
    assert.strictEqual(clampScore(NaN, 0), 0);
    assert.strictEqual(clampScore(NaN, 50), 50);
  });

  test('non-number returns default', function () {
    assert.strictEqual(clampScore('high'), 0);
    assert.strictEqual(clampScore(null), 0);
    assert.strictEqual(clampScore(undefined), 0);
  });
});

describe('clampPrice', function () {
  test('normal prices pass through', function () {
    assert.strictEqual(clampPrice(100), 100);
    assert.strictEqual(clampPrice(0), 0);
    assert.strictEqual(clampPrice(14.90), 14.90);
  });

  test('negative prices become 0', function () {
    assert.strictEqual(clampPrice(-1), 0);
    assert.strictEqual(clampPrice(-100), 0);
  });

  test('NaN becomes 0', function () {
    assert.strictEqual(clampPrice(NaN), 0);
  });
});

describe('normalizeCurrency', function () {
  test('valid 3-letter codes pass through', function () {
    assert.strictEqual(normalizeCurrency('JPY'), 'JPY');
    assert.strictEqual(normalizeCurrency('EUR'), 'EUR');
    assert.strictEqual(normalizeCurrency('CNY'), 'CNY');
    assert.strictEqual(normalizeCurrency('usd'), 'USD');
    assert.strictEqual(normalizeCurrency('  sgd  '), 'SGD');
  });

  test('invalid codes become empty string', function () {
    assert.strictEqual(normalizeCurrency('JP'), '');
    assert.strictEqual(normalizeCurrency('DOLLAR'), '');
    assert.strictEqual(normalizeCurrency(''), '');
    assert.strictEqual(normalizeCurrency(null), '');
    assert.strictEqual(normalizeCurrency(123), '');
  });
});

describe('normalizePriceIntelligence', function () {
  test('full price intelligence normalizes correctly', function () {
    var result = normalizePriceIntelligence({
      localPrice: 980,
      localCurrency: 'JPY',
      homePrice: 6.62,
      homeCurrency: 'EUR',
      exchangeRate: 0.00675,
      assessment: 'Fair'
    });

    assert.strictEqual(result.localPrice, 980);
    assert.strictEqual(result.localCurrency, 'JPY');
    assert.strictEqual(result.homePrice, 6.62);
    assert.strictEqual(result.homeCurrency, 'EUR');
    assert.strictEqual(result.exchangeRate, 0.00675);
    assert.strictEqual(result.assessment, 'Fair');
  });

  test('missing fields get safe defaults', function () {
    var result = normalizePriceIntelligence({});
    assert.strictEqual(result.localPrice, 0);
    assert.strictEqual(result.localCurrency, '');
    assert.strictEqual(result.homePrice, 0);
    assert.strictEqual(result.homeCurrency, '');
    assert.strictEqual(result.exchangeRate, 1);
    assert.strictEqual(result.assessment, '');
  });

  test('null input returns default', function () {
    var result = normalizePriceIntelligence(null);
    assert.strictEqual(result.localPrice, 0);
  });

  test('assessment normalizes to known value', function () {
    assert.strictEqual(normalizePriceIntelligence({ assessment: 'Good Value' }).assessment, 'Good Value');
    assert.strictEqual(normalizePriceIntelligence({ assessment: 'Cheap' }).assessment, 'Cheap');
    assert.strictEqual(normalizePriceIntelligence({ assessment: 'Fair' }).assessment, 'Fair');
    assert.strictEqual(normalizePriceIntelligence({ assessment: 'Premium' }).assessment, 'Premium');
    assert.strictEqual(normalizePriceIntelligence({ assessment: 'Expensive' }).assessment, 'Expensive');
    assert.strictEqual(normalizePriceIntelligence({ assessment: 'Unknown' }).assessment, '');
  });
});

describe('resolveErrorCode', function () {
  test('known codes pass through', function () {
    assert.strictEqual(resolveErrorCode('ANALYSIS_FAILED', 'FALLBACK'), 'ANALYSIS_FAILED');
    assert.strictEqual(resolveErrorCode('ANALYSIS_PROVIDER_NOT_CONFIGURED', 'FALLBACK'), 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
    assert.strictEqual(resolveErrorCode('ANALYSIS_PROVIDER_INVALID', 'FALLBACK'), 'ANALYSIS_PROVIDER_INVALID');
  });

  test('unknown codes fall back', function () {
    assert.strictEqual(resolveErrorCode('UNKNOWN', 'ANALYSIS_FAILED'), 'ANALYSIS_FAILED');
    assert.strictEqual(resolveErrorCode(null, 'ANALYSIS_FAILED'), 'ANALYSIS_FAILED');
    assert.strictEqual(resolveErrorCode(undefined, 'ANALYSIS_FAILED'), 'ANALYSIS_FAILED');
  });
});

describe('stripForbiddenFields', function () {
  test('should strip all forbidden fields from object', function () {
    var input = {
      provider: 'mock_ai',
      dishes: [{ dishName: 'test' }],
      stack: 'trace',
      apiKey: 'sk-secret',
      rawPrompt: 'System prompt...',
      rawOcrText: 'OCR text',
      nested: {
        token: 'secret-token',
        providerRawResponse: { status: 500 },
        completionPayload: { data: '...' }
      }
    };
    var result = stripForbiddenFields(input);

    assert.strictEqual(result.provider, 'mock_ai');
    assert.deepStrictEqual(result.dishes, [{ dishName: 'test' }]);
    assert.strictEqual(result.stack, undefined);
    assert.strictEqual(result.apiKey, undefined);
    assert.strictEqual(result.rawPrompt, undefined);
    assert.strictEqual(result.rawOcrText, undefined);
    assert.strictEqual(result.nested.token, undefined);
    assert.strictEqual(result.nested.providerRawResponse, undefined);
    assert.strictEqual(result.nested.completionPayload, undefined);
  });

  test('original object is not mutated', function () {
    var input = { provider: 'mock_ai', stack: 'trace' };
    var result = stripForbiddenFields(input);

    assert.strictEqual(result.stack, undefined);
    assert.strictEqual(input.stack, 'trace');
  });
});

describe('looksLikeSecret', function () {
  test('sk- prefixed strings are secrets', function () {
    assert.strictEqual(looksLikeSecret('sk-abc123'), true);
  });

  test('JWT-like strings are secrets', function () {
    var jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOnRydWV9.abcdefghij1234567890';
    assert.strictEqual(looksLikeSecret(jwt), true);
  });

  test('long strings are secrets', function () {
    assert.strictEqual(looksLikeSecret('a'.repeat(600)), true);
  });

  test('short normal strings are not secrets', function () {
    assert.strictEqual(looksLikeSecret('mock-v1'), false);
    assert.strictEqual(looksLikeSecret('qwen-vl-max'), false);
    assert.strictEqual(looksLikeSecret(''), false);
  });
});

describe('sanitizeMessage', function () {
  test('removes API keys', function () {
    var result = sanitizeMessage('Error from sk-abc123def456ghijklmnopqrstuvwxyz');
    assert.ok(result.indexOf('sk-abc123') === -1);
    assert.ok(result.indexOf('[REDACTED]') !== -1);
  });

  test('removes JWT tokens', function () {
    var result = sanitizeMessage('Auth failed: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5');
    assert.ok(result.indexOf('[REDACTED]') !== -1);
  });

  test('removes Bearer tokens', function () {
    var result = sanitizeMessage('Unauthorized: Bearer abc123def456');
    assert.ok(result.indexOf('Bearer [REDACTED]') !== -1);
  });

  test('preserves normal messages', function () {
    var result = sanitizeMessage('Mock analysis failure scenario requested.');
    assert.strictEqual(result, 'Mock analysis failure scenario requested.');
  });
});

describe('normalizeRawMetadata', function () {
  test('only safe keys pass through', function () {
    var result = normalizeRawMetadata({
      processingTimeMs: 500,
      modelVersion: 'v1',
      analysisEngine: 'test-engine',
      promptTokens: 100,
      completionTokens: 200,
      totalTokens: 300,
      requestId: 'req-123',
      arbitraryField: 'should-be-dropped',
      apiKey: 'sk-secret'
    });

    assert.deepStrictEqual(result, {
      processingTimeMs: 500,
      modelVersion: 'v1',
      analysisEngine: 'test-engine',
      promptTokens: 100,
      completionTokens: 200,
      totalTokens: 300,
      requestId: 'req-123'
    });
  });

  test('secret-like strings in safe fields are dropped', function () {
    var result = normalizeRawMetadata({
      processingTimeMs: 500,
      modelVersion: 'sk-secret-key-abc123def456ghijklmnopqrstuvwxyz'
    });

    assert.deepStrictEqual(result, { processingTimeMs: 500 });
    assert.strictEqual(result.modelVersion, undefined);
  });

  test('all-forbidden metadata returns null', function () {
    var result = normalizeRawMetadata({
      apiKey: 'sk-secret',
      token: 'jwt-token'
    });
    assert.strictEqual(result, null);
  });

  test('NaN numbers are dropped', function () {
    var result = normalizeRawMetadata({
      processingTimeMs: NaN,
      modelVersion: 'v1'
    });
    assert.deepStrictEqual(result, { modelVersion: 'v1' });
  });

  test('infinite numbers are dropped', function () {
    var result = normalizeRawMetadata({
      totalTokens: Infinity,
      modelVersion: 'v1'
    });
    assert.deepStrictEqual(result, { modelVersion: 'v1' });
  });
});

// ---------------------------------------------------------------------------
// Constraint: contract shape stability
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — contract shape stability', function () {
  test('result must always contain all contract fields', function () {
    var result = normalizeAnalysisResult({});

    var keys = Object.keys(result).sort();
    assert.deepStrictEqual(keys, [
      'confidence',
      'dishes',
      'mode',
      'provider',
      'rawMetadata',
      'warnings'
    ]);
  });

  test('result must not contain extra fields beyond the contract', function () {
    var result = normalizeAnalysisResult({ extraField: 'should-not-survive', provider: 'mock_ai' });

    assert.strictEqual(result.extraField, undefined);
  });
});

// ---------------------------------------------------------------------------
// Constraint: idempotency
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — idempotency', function () {
  test('normalizing a normalized result should be a no-op', function () {
    var input = {
      provider: 'mock_ai',
      mode: 'mock',
      confidence: 0.88,
      dishes: [{
        dishName: 'Test Dish',
        tasteScore: 85,
        safetyScore: 90,
        valueScore: 80,
        ingredients: ['Ingredient A'],
        allergens: ['Allergen A'],
        recommendationReason: 'Tasty',
        priceIntelligence: {
          localPrice: 100,
          localCurrency: 'EUR',
          homePrice: 100,
          homeCurrency: 'EUR',
          exchangeRate: 1,
          assessment: 'Good Value'
        }
      }],
      warnings: ['LOW_ANALYSIS_CONFIDENCE'],
      rawMetadata: { processingTimeMs: 100 }
    };

    var first = normalizeAnalysisResult(input);
    var second = normalizeAnalysisResult(first);

    assert.deepStrictEqual(second, first);
  });
});

// ---------------------------------------------------------------------------
// Constraint: empty dishes still produce empty array
// ---------------------------------------------------------------------------

describe('normalizeAnalysisResult — empty dishes handling', function () {
  test('zero dishes with mock_ai provider is valid contract result', function () {
    var result = normalizeAnalysisResult({
      provider: 'mock_ai',
      mode: 'mock',
      dishes: [],
      confidence: 0,
      warnings: ['ANALYSIS_EMPTY_RESULT']
    });

    assert.strictEqual(result.dishes.length, 0);
    assert.deepStrictEqual(result.warnings, ['ANALYSIS_EMPTY_RESULT']);
  });
});
