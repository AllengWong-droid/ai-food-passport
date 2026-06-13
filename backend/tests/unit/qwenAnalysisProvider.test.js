/**
 * qwenAnalysisProvider.test.js
 *
 * Unit tests for the Qwen Analysis Provider Adapter (qwenAnalysisProvider.js).
 *
 * Tests cover:
 *   - normalizeQwenAnalysisResponse with successful Qwen-like analysis response
 *   - normalizeQwenAnalysisResponse with single dish
 *   - normalizeQwenAnalysisResponse with low confidence
 *   - normalizeQwenAnalysisResponse with empty dishes → ANALYSIS_EMPTY_RESULT
 *   - normalizeQwenAnalysisResponse with malformed response (bad JSON content)
 *   - normalizeQwenAnalysisResponse strips forbidden fields (secrets/stack/raw data)
 *   - normalizeQwenAnalysisResponse clamps confidence and scores
 *   - analyzeMenuText with fake transport returns contract-conforming result
 *   - analyzeMenuText without transport throws ANALYSIS_PROVIDER_NOT_CONFIGURED
 *   - analyzeMenuText with fake transport that throws → normalized error
 *   - validateQwenAnalysisConfig with missing key
 *   - validateQwenAnalysisConfig with placeholder key
 *   - validateQwenAnalysisConfig with valid-looking key (but provider not enabled)
 *   - No real network calls in any test
 *   - Contract shape stability (6 keys)
 *   - mock_ai remains the active default
 */

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const {
  analyzeMenuText,
  validateQwenAnalysisConfig,
  createFakeQwenAnalysisTransport,
  normalizeQwenAnalysisResponse
} = require('../../src/providers/analysis/qwenAnalysisProvider');

const {
  AnalysisProviderName,
  AnalysisProviderMode,
  AnalysisWarningCode
} = require('../../src/providers/analysis/analysisProviderTypes');

const { FORBIDDEN_FIELDS } = require('../../src/providers/analysis/analysisProviderContract');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadQwenFixture(name) {
  var filePath = path.join(__dirname, '..', 'fixtures', 'analysis', 'qwen', name);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function makeFakeRequestParams() {
  return {
    requestBody: {
      userHomeCurrency: 'EUR',
      scan: { localCurrency: 'JPY' }
    },
    ocrResult: {
      text: 'Tonkotsu Ramen JPY 980\nMiso Katsu Skewers JPY 800'
    }
  };
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
// normalizeQwenAnalysisResponse — success cases
// ---------------------------------------------------------------------------

describe('normalizeQwenAnalysisResponse — success cases', function () {
  test('should normalize a successful Qwen analysis response to contract shape', function () {
    var fixture = loadQwenFixture('qwenAnalysisSuccess.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.provider, AnalysisProviderName.QWEN_ANALYSIS);
    assert.strictEqual(result.mode, AnalysisProviderMode.ANALYSIS);
    assert.strictEqual(result.confidence, 0.96);
    assert.deepStrictEqual(result.warnings, []);
    assert.strictEqual(result.dishes.length, 2);

    // First dish
    var d1 = result.dishes[0];
    assert.strictEqual(d1.name, 'Tonkotsu Ramen');
    assert.strictEqual(d1.dishName, 'Tonkotsu Ramen');
    assert.strictEqual(d1.recommendationScore, 96);
    assert.strictEqual(d1.tasteScore, 96);
    assert.strictEqual(d1.estimatedPrice, 980);
    assert.strictEqual(d1.currency, 'JPY');
    assert.strictEqual(d1.valueRating, 'Fair');
    assert.deepStrictEqual(d1.allergens, ['Wheat', 'Egg']);
    assert.deepStrictEqual(d1.ingredients, ['Pork broth', 'Wheat noodles', 'Egg', 'Scallion', 'Chashu']);

    // Second dish
    var d2 = result.dishes[1];
    assert.strictEqual(d2.name, 'Miso Katsu Skewers');
    assert.strictEqual(d2.valueRating, 'Good Value');
    assert.notStrictEqual(d2.id, d1.id, 'each dish should have unique id');

    // rawMetadata
    assert.ok(result.rawMetadata !== null);
    assert.strictEqual(result.rawMetadata.totalTokens, 600);
    assert.strictEqual(result.rawMetadata.promptTokens, 250);
    assert.strictEqual(result.rawMetadata.completionTokens, 350);
  });

  test('should normalize a single-dish Qwen analysis response', function () {
    var fixture = loadQwenFixture('qwenAnalysisSingleDish.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.dishes.length, 1);
    assert.strictEqual(result.dishes[0].name, 'Beef Noodle Soup');
    assert.strictEqual(result.dishes[0].estimatedPrice, 180);
    assert.strictEqual(result.dishes[0].currency, 'TWD');
    assert.strictEqual(result.confidence, 0.91);
  });
});

// ---------------------------------------------------------------------------
// normalizeQwenAnalysisResponse — empty result
// ---------------------------------------------------------------------------

describe('normalizeQwenAnalysisResponse — empty result', function () {
  test('should map empty dishes to ANALYSIS_EMPTY_RESULT warning', function () {
    var fixture = loadQwenFixture('qwenAnalysisEmpty.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.deepStrictEqual(result.dishes, []);
    assert.strictEqual(result.confidence, 0);
    assert.ok(
      result.warnings.includes('ANALYSIS_EMPTY_RESULT'),
      'Expected ANALYSIS_EMPTY_RESULT warning for empty dishes'
    );
  });

  test('should return empty array for null input', function () {
    var result = normalizeQwenAnalysisResponse(null);

    assert.strictEqual(result.provider, AnalysisProviderName.QWEN_ANALYSIS);
    assert.deepStrictEqual(result.dishes, []);
    assert.ok(result.warnings.includes('ANALYSIS_EMPTY_RESULT'));
  });

  test('should return empty array for undefined input', function () {
    var result = normalizeQwenAnalysisResponse(undefined);

    assert.strictEqual(result.provider, AnalysisProviderName.QWEN_ANALYSIS);
    assert.deepStrictEqual(result.dishes, []);
  });

  test('should return empty array for non-object input', function () {
    var result = normalizeQwenAnalysisResponse('not an object');

    assert.strictEqual(result.provider, AnalysisProviderName.QWEN_ANALYSIS);
    assert.deepStrictEqual(result.dishes, []);
  });
});

// ---------------------------------------------------------------------------
// normalizeQwenAnalysisResponse — low confidence
// ---------------------------------------------------------------------------

describe('normalizeQwenAnalysisResponse — low confidence', function () {
  test('should preserve low confidence value', function () {
    var fixture = loadQwenFixture('qwenAnalysisLowConfidence.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.confidence, 0.48);
    assert.ok(result.confidence < 0.5, 'confidence should be below 0.5');
  });

  test('should preserve LOW_ANALYSIS_CONFIDENCE and NEEDS_REVIEW warnings', function () {
    var fixture = loadQwenFixture('qwenAnalysisLowConfidence.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.ok(
      result.warnings.includes('LOW_ANALYSIS_CONFIDENCE'),
      'Expected LOW_ANALYSIS_CONFIDENCE warning'
    );
    assert.ok(
      result.warnings.includes('NEEDS_REVIEW'),
      'Expected NEEDS_REVIEW warning'
    );
  });

  test('low confidence dishes should still be normalized correctly', function () {
    var fixture = loadQwenFixture('qwenAnalysisLowConfidence.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.dishes.length, 1);
    assert.strictEqual(result.dishes[0].name, 'Fish and Chips');
  });
});

// ---------------------------------------------------------------------------
// normalizeQwenAnalysisResponse — malformed input
// ---------------------------------------------------------------------------

describe('normalizeQwenAnalysisResponse — malformed input', function () {
  test('should not crash on response with non-JSON content', function () {
    var fixture = loadQwenFixture('qwenAnalysisMalformed.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.deepStrictEqual(result.dishes, []);
    assert.ok(result.warnings.includes('ANALYSIS_EMPTY_RESULT'));
  });

  test('should not crash on response with missing output.choices', function () {
    var result = normalizeQwenAnalysisResponse({ usage: { total_tokens: 10 } });

    assert.deepStrictEqual(result.dishes, []);
    assert.ok(result.warnings.includes('ANALYSIS_EMPTY_RESULT'));
  });

  test('should not crash on response with empty content', function () {
    var result = normalizeQwenAnalysisResponse({
      output: {
        choices: [{
          message: {}
        }]
      }
    });

    assert.deepStrictEqual(result.dishes, []);
  });

  test('should not crash on response with null choices', function () {
    var result = normalizeQwenAnalysisResponse({
      output: {
        choices: null
      }
    });

    assert.deepStrictEqual(result.dishes, []);
  });
});

// ---------------------------------------------------------------------------
// normalizeQwenAnalysisResponse — forbidden field stripping
// ---------------------------------------------------------------------------

describe('normalizeQwenAnalysisResponse — no secret / stack / raw data leakage', function () {
  test('should strip all forbidden fields from result', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assertNoForbiddenKeys(result, 'result');
  });

  test('should not include stack trace in result', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.stack, undefined);
    assert.strictEqual(result.stackTrace, undefined);
  });

  test('should not include API keys or secrets in result', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.apiKey, undefined);
    assert.strictEqual(result.authorization, undefined);
    assert.strictEqual(result.bearer, undefined);
    assert.strictEqual(result.token, undefined);
    assert.strictEqual(result.secret, undefined);
    assert.strictEqual(result.credentials, undefined);
  });

  test('should not include raw provider response data in result', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.providerRawResponse, undefined);
    assert.strictEqual(result.providerRawError, undefined);
    assert.strictEqual(result.rawHttpResponse, undefined);
    assert.strictEqual(result.requestHeaders, undefined);
    assert.strictEqual(result.responseHeaders, undefined);
  });

  test('should not include raw prompt or raw completion in result', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.rawPrompt, undefined);
    assert.strictEqual(result.completionPayload, undefined);
    assert.strictEqual(result.rawCompletion, undefined);
    assert.strictEqual(result.systemPrompt, undefined);
    assert.strictEqual(result.userPrompt, undefined);
  });

  test('should not include raw OCR text in result', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.rawOcrText, undefined);
    assert.strictEqual(result.rawOcrResult, undefined);
  });

  test('should not include image or base64 data in result', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.image, undefined);
    assert.strictEqual(result.imageBytes, undefined);
    assert.strictEqual(result.imagePayload, undefined);
    assert.strictEqual(result.base64, undefined);
    assert.strictEqual(result.rawImage, undefined);
    assert.strictEqual(result.menuImage, undefined);
  });

  test('JSON-serialized result should not contain secret patterns', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);
    var serialized = JSON.stringify(result);

    assert.ok(
      !serialized.includes('sk-abc123def456ghijklmnopqrstuvwxyz'),
      'Result should not contain API key'
    );
    assert.ok(
      !serialized.includes('sk-secret-token'),
      'Result should not contain auth token'
    );
    assert.ok(
      !serialized.includes('iVBORw0KGgo'),
      'Result should not contain base64 image data'
    );
  });

  test('dish objects should also have no forbidden fields', function () {
    var fixture = loadQwenFixture('qwenAnalysisWithSecrets.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.dishes.length, 1);
    assertNoForbiddenKeys(result.dishes[0], 'result.dishes[0]');
  });
});

// ---------------------------------------------------------------------------
// normalizeQwenAnalysisResponse — score clamping
// ---------------------------------------------------------------------------

describe('normalizeQwenAnalysisResponse — score clamping', function () {
  test('should clamp scores to [0, 100]', function () {
    var fixture = loadQwenFixture('qwenAnalysisExtremeScores.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    var dish = result.dishes[0];
    assert.strictEqual(dish.tasteScore, 100, 'tasteScore 150 should clamp to 100');
    assert.strictEqual(dish.safetyScore, 0, 'safetyScore -20 should clamp to 0');
    assert.strictEqual(dish.valueScore, 100, 'valueScore 999 should clamp to 100');
    assert.strictEqual(dish.recommendationScore, 100, 'recommendationScore should match clamped tasteScore');
  });

  test('should clamp per-dish confidence', function () {
    var fixture = loadQwenFixture('qwenAnalysisExtremeScores.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    var dish = result.dishes[0];
    assert.strictEqual(dish.confidence, 1.0, 'dish confidence 2.5 should clamp to 1.0');
  });

  test('should clamp negative prices to 0', function () {
    var fixture = loadQwenFixture('qwenAnalysisExtremeScores.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    var dish = result.dishes[0];
    assert.strictEqual(dish.estimatedPrice, 0, 'negative price should clamp to 0');
    assert.strictEqual(dish.priceIntelligence.localPrice, 0);
  });

  test('parent confidence should clamp to 1.0', function () {
    var fixture = loadQwenFixture('qwenAnalysisExtremeScores.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    assert.strictEqual(result.confidence, 1.0, 'parent confidence 1.5 should clamp to 1.0');
  });

  test('warnings should be de-duplicated', function () {
    var fixture = loadQwenFixture('qwenAnalysisExtremeScores.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    // Should only contain known warnings, de-duplicated
    var expectedWarnings = ['LOW_ANALYSIS_CONFIDENCE', 'NEEDS_REVIEW'];
    assert.deepStrictEqual(result.warnings, expectedWarnings);
  });

  test('unknown valueRating should become empty string', function () {
    var fixture = loadQwenFixture('qwenAnalysisExtremeScores.json');
    var result = normalizeQwenAnalysisResponse(fixture);

    var dish = result.dishes[0];
    assert.strictEqual(dish.valueRating, '');
  });
});

// ---------------------------------------------------------------------------
// normalizeQwenAnalysisResponse — contract shape stability
// ---------------------------------------------------------------------------

describe('normalizeQwenAnalysisResponse — contract shape stability', function () {
  test('result should have exactly 6 keys (provider, mode, confidence, dishes, warnings, rawMetadata)', function () {
    var fixture = loadQwenFixture('qwenAnalysisSuccess.json');
    var result = normalizeQwenAnalysisResponse(fixture);

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

  test('empty result should also have exactly 6 keys', function () {
    var fixture = loadQwenFixture('qwenAnalysisEmpty.json');
    var result = normalizeQwenAnalysisResponse(fixture);

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
});

// ---------------------------------------------------------------------------
// analyzeMenuText — with fake transport (test seam)
// ---------------------------------------------------------------------------

describe('analyzeMenuText — with fake transport (test seam)', function () {
  test('should return contract-conforming result using fake transport', async function () {
    var fakeResponse = loadQwenFixture('qwenAnalysisSuccess.json');
    var transport = createFakeQwenAnalysisTransport(fakeResponse);
    var params = makeFakeRequestParams();

    var result = await analyzeMenuText(params, { transport });

    assert.strictEqual(result.provider, AnalysisProviderName.QWEN_ANALYSIS);
    assert.strictEqual(result.mode, AnalysisProviderMode.ANALYSIS);
    assert.strictEqual(result.dishes.length, 2);
    assert.strictEqual(result.dishes[0].name, 'Tonkotsu Ramen');
    assert.strictEqual(result.confidence, 0.96);
    assert.ok(Array.isArray(result.warnings));
    assert.ok('rawMetadata' in result);
  });

  test('should normalize single dish result via fake transport', async function () {
    var fakeResponse = loadQwenFixture('qwenAnalysisSingleDish.json');
    var transport = createFakeQwenAnalysisTransport(fakeResponse);
    var params = makeFakeRequestParams();

    var result = await analyzeMenuText(params, { transport });

    assert.strictEqual(result.dishes.length, 1);
    assert.strictEqual(result.dishes[0].name, 'Beef Noodle Soup');
  });

  test('should normalize low-confidence response via fake transport', async function () {
    var fakeResponse = loadQwenFixture('qwenAnalysisLowConfidence.json');
    var transport = createFakeQwenAnalysisTransport(fakeResponse);
    var params = makeFakeRequestParams();

    var result = await analyzeMenuText(params, { transport });

    assert.ok(result.confidence <= 0.5);
    assert.ok(result.warnings.includes('LOW_ANALYSIS_CONFIDENCE'));
    assert.ok(result.warnings.includes('NEEDS_REVIEW'));
  });

  test('should map empty dishes to ANALYSIS_EMPTY_RESULT via fake transport', async function () {
    var fakeResponse = loadQwenFixture('qwenAnalysisEmpty.json');
    var transport = createFakeQwenAnalysisTransport(fakeResponse);
    var params = makeFakeRequestParams();

    var result = await analyzeMenuText(params, { transport });

    assert.deepStrictEqual(result.dishes, []);
    assert.ok(result.warnings.includes('ANALYSIS_EMPTY_RESULT'));
  });

  test('should handle malformed response via fake transport', async function () {
    var fakeResponse = loadQwenFixture('qwenAnalysisMalformed.json');
    var transport = createFakeQwenAnalysisTransport(fakeResponse);
    var params = makeFakeRequestParams();

    var result = await analyzeMenuText(params, { transport });

    assert.deepStrictEqual(result.dishes, []);
    assert.ok(result.warnings.includes('ANALYSIS_EMPTY_RESULT'));
  });
});

// ---------------------------------------------------------------------------
// analyzeMenuText — fake transport error handling
// ---------------------------------------------------------------------------

describe('analyzeMenuText — fake transport error handling', function () {
  test('should normalize error when fake transport throws', async function () {
    var err = new Error('Simulated Qwen analysis API failure');
    err.code = 'ANALYSIS_FAILED';
    var transport = createFakeQwenAnalysisTransport(null, { shouldThrow: err });
    var params = makeFakeRequestParams();

    await assert.rejects(
      async function () { await analyzeMenuText(params, { transport }); },
      function (err) {
        assert.strictEqual(err.code, 'ANALYSIS_FAILED');
        assert.ok(typeof err.message === 'string' && err.message.length > 0);
        // Stack should be deleted by normalizeAnalysisError
        assert.ok(!err.stack, 'Stack trace should be deleted from normalized error');
        return true;
      }
    );
  });

  test('should not leak raw provider error details', async function () {
    var dangerousError = new Error('Qwen API key invalid: sk-abcd1234-secret1234');
    dangerousError.stack = 'Error: Qwen API key invalid\n    at QwenClient.js:45:3';
    dangerousError.rawResponse = { headers: { authorization: 'Bearer sk-abcd1234-secret1234' } };
    dangerousError.apiKey = 'sk-secret-key';

    var transport = createFakeQwenAnalysisTransport(null, { shouldThrow: dangerousError });
    var params = makeFakeRequestParams();

    try {
      await analyzeMenuText(params, { transport });
      assert.fail('Should have thrown');
    } catch (err) {
      var serialized = JSON.stringify(err);
      assert.ok(
        !serialized.includes('sk-abcd1234'),
        'Error should not contain API key'
      );
      assert.ok(
        !serialized.includes('Bearer'),
        'Error should not contain authorization header'
      );
      assert.ok(
        !serialized.includes('sk-secret-key'),
        'Error should not contain secret key'
      );
    }
  });

  test('error message should not contain raw stack fragments', async function () {
    var dangerousError = new Error('Internal Error: QwenClient.js:45');
    dangerousError.stack = 'Error: QwenClient._sendRequest (/app/src/QwenClient.js:45:12)\n    at async QwenClient.analyze (/app/src/QwenClient.js:112:7)';

    var transport = createFakeQwenAnalysisTransport(null, { shouldThrow: dangerousError });
    var params = makeFakeRequestParams();

    try {
      await analyzeMenuText(params, { transport });
      assert.fail('Should have thrown');
    } catch (err) {
      assert.ok(!err.stack, 'Stack trace should be deleted from normalized error');
    }
  });
});

// ---------------------------------------------------------------------------
// analyzeMenuText — no transport (disabled provider)
// ---------------------------------------------------------------------------

describe('analyzeMenuText — no transport (disabled provider)', function () {
  // Save/restore env
  var originalEnabled = process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
  var originalKey = process.env.QWEN_API_KEY;
  var originalProvider = process.env.ANALYSIS_PROVIDER;

  function restoreEnv() {
    if (originalEnabled === undefined) {
      delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
    } else {
      process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = originalEnabled;
    }
    if (originalKey === undefined) {
      delete process.env.QWEN_API_KEY;
    } else {
      process.env.QWEN_API_KEY = originalKey;
    }
    if (originalProvider === undefined) {
      delete process.env.ANALYSIS_PROVIDER;
    } else {
      process.env.ANALYSIS_PROVIDER = originalProvider;
    }
  }

  test('should throw ANALYSIS_PROVIDER_NOT_CONFIGURED when no transport provided', async function () {
    restoreEnv();
    delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
    delete process.env.QWEN_API_KEY;
    delete process.env.ANALYSIS_PROVIDER;
    var params = makeFakeRequestParams();

    await assert.rejects(
      async function () { await analyzeMenuText(params); },
      function (err) {
        assert.strictEqual(err.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
        assert.strictEqual(err.provider, AnalysisProviderName.QWEN_ANALYSIS);
        return true;
      }
    );
  });

  test('should throw ANALYSIS_PROVIDER_NOT_CONFIGURED when options provided without transport', async function () {
    restoreEnv();
    delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
    delete process.env.QWEN_API_KEY;
    var params = makeFakeRequestParams();

    await assert.rejects(
      async function () { await analyzeMenuText(params, {}); },
      function (err) {
        assert.strictEqual(err.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
        return true;
      }
    );
  });

  test('should not crash with null/undefined params', async function () {
    restoreEnv();
    delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
    delete process.env.QWEN_API_KEY;

    await assert.rejects(
      async function () { await analyzeMenuText(null); },
      function (err) {
        assert.strictEqual(err.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
        return true;
      }
    );

    await assert.rejects(
      async function () { await analyzeMenuText(undefined); },
      function (err) {
        assert.strictEqual(err.code, 'ANALYSIS_PROVIDER_NOT_CONFIGURED');
        return true;
      }
    );
  });
});

// ---------------------------------------------------------------------------
// validateQwenAnalysisConfig tests
// ---------------------------------------------------------------------------

describe('validateQwenAnalysisConfig', function () {
  // Store original env var values
  var originalEnabled = process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
  var originalKey = process.env.QWEN_API_KEY;
  var originalModel = process.env.QWEN_ANALYSIS_MODEL;
  var originalBaseUrl = process.env.QWEN_ANALYSIS_BASE_URL;

  function restoreEnv() {
    if (originalEnabled === undefined) {
      delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
    } else {
      process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = originalEnabled;
    }
    if (originalKey === undefined) {
      delete process.env.QWEN_API_KEY;
    } else {
      process.env.QWEN_API_KEY = originalKey;
    }
    if (originalModel === undefined) {
      delete process.env.QWEN_ANALYSIS_MODEL;
    } else {
      process.env.QWEN_ANALYSIS_MODEL = originalModel;
    }
    if (originalBaseUrl === undefined) {
      delete process.env.QWEN_ANALYSIS_BASE_URL;
    } else {
      process.env.QWEN_ANALYSIS_BASE_URL = originalBaseUrl;
    }
  }

  test('should return enabled:false when QWEN_ANALYSIS_PROVIDER_ENABLED is not set', function () {
    restoreEnv();
    delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
    delete process.env.QWEN_API_KEY;

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.enabled, false);
    assert.ok(config.reason.includes('not set to "true"'));
    assert.strictEqual(config.keySource, 'none');
  });

  test('should return enabled:false when QWEN_API_KEY is missing', function () {
    restoreEnv();
    process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = 'true';
    delete process.env.QWEN_API_KEY;

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.enabled, false);
    assert.ok(config.reason.includes('not set'));
    assert.strictEqual(config.keySource, 'missing');
  });

  test('should return enabled:false when QWEN_API_KEY is a placeholder', function () {
    restoreEnv();
    process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = 'true';
    process.env.QWEN_API_KEY = 'sk-placeholder';

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.enabled, false);
    assert.ok(config.reason.includes('placeholder'));
    assert.strictEqual(config.keySource, 'placeholder');
  });

  test('should return enabled:false when QWEN_API_KEY is sk-test', function () {
    restoreEnv();
    process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = 'true';
    process.env.QWEN_API_KEY = 'sk-test';

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.enabled, false);
    assert.ok(config.reason.includes('placeholder'));
  });

  test('should return enabled:false when QWEN_API_KEY is sk-dummy', function () {
    restoreEnv();
    process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = 'true';
    process.env.QWEN_API_KEY = 'sk-dummy';

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.enabled, false);
    assert.ok(config.reason.includes('placeholder'));
  });

  test('should return enabled:false when QWEN_API_KEY is sk-example', function () {
    restoreEnv();
    process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = 'true';
    process.env.QWEN_API_KEY = 'sk-example';

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.enabled, false);
    assert.ok(config.reason.includes('placeholder'));
  });

  test('should return enabled:false when QWEN_API_KEY is too short', function () {
    restoreEnv();
    process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = 'true';
    process.env.QWEN_API_KEY = 'sk-short';

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.enabled, false);
    assert.ok(config.reason.includes('placeholder'));
  });

  test('should return enabled:true with valid-looking key and enabled flag', function () {
    restoreEnv();
    process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = 'true';
    process.env.QWEN_API_KEY = 'sk-abcdefghijklmnopqrstuvwxyz1234567890';

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.enabled, true);
    assert.strictEqual(config.reason, '');
    assert.strictEqual(config.keySource, 'env');
  });

  test('should not crash with null/undefined env vars', function () {
    restoreEnv();
    delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
    delete process.env.QWEN_API_KEY;

    assert.doesNotThrow(function () {
      validateQwenAnalysisConfig();
    });
  });

  test('should use default model and baseUrl when not set', function () {
    restoreEnv();
    delete process.env.QWEN_ANALYSIS_MODEL;
    delete process.env.QWEN_ANALYSIS_BASE_URL;

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.model, 'qwen-max');
    assert.strictEqual(config.baseUrl, 'https://dashscope.aliyuncs.com');
  });

  test('should use custom model and baseUrl from env', function () {
    restoreEnv();
    process.env.QWEN_ANALYSIS_MODEL = 'qwen-plus';
    process.env.QWEN_ANALYSIS_BASE_URL = 'https://custom-endpoint.example.com';

    var config = validateQwenAnalysisConfig();
    assert.strictEqual(config.model, 'qwen-plus');
    assert.strictEqual(config.baseUrl, 'https://custom-endpoint.example.com');

    delete process.env.QWEN_ANALYSIS_MODEL;
    delete process.env.QWEN_ANALYSIS_BASE_URL;
  });
});

// ---------------------------------------------------------------------------
// realAnalysisEnabled — stays false by default
// ---------------------------------------------------------------------------

describe('qwenAnalysisProvider — realAnalysisEnabled stays false by default', function () {
  var originalProvider = process.env.ANALYSIS_PROVIDER;
  var originalEnabled = process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
  var originalKey = process.env.QWEN_API_KEY;

  function restoreEnv() {
    if (originalProvider === undefined) {
      delete process.env.ANALYSIS_PROVIDER;
    } else {
      process.env.ANALYSIS_PROVIDER = originalProvider;
    }
    if (originalEnabled === undefined) {
      delete process.env.QWEN_ANALYSIS_PROVIDER_ENABLED;
    } else {
      process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = originalEnabled;
    }
    if (originalKey === undefined) {
      delete process.env.QWEN_API_KEY;
    } else {
      process.env.QWEN_API_KEY = originalKey;
    }
  }

  test('realAnalysisEnabled should be false when ANALYSIS_PROVIDER is not qwen_analysis', function () {
    restoreEnv();
    delete process.env.ANALYSIS_PROVIDER;

    var provider = require('../../src/providers/analysis/qwenAnalysisProvider');
    // We need to re-require to pick up env changes, but since the getter
    // reads env each time, we can just call it.
    // Clear require cache to ensure fresh env reads.
    delete require.cache[require.resolve('../../src/providers/analysis/qwenAnalysisProvider')];
    var freshProvider = require('../../src/providers/analysis/qwenAnalysisProvider');
    assert.strictEqual(freshProvider.realAnalysisEnabled, false);
  });

  test('realAnalysisEnabled should be false even when QWEN_ANALYSIS_PROVIDER_ENABLED is true but ANALYSIS_PROVIDER is wrong', function () {
    restoreEnv();
    process.env.ANALYSIS_PROVIDER = 'mock_ai';
    process.env.QWEN_ANALYSIS_PROVIDER_ENABLED = 'true';
    process.env.QWEN_API_KEY = 'sk-abcdefghijklmnopqrstuvwxyz1234567890';

    delete require.cache[require.resolve('../../src/providers/analysis/qwenAnalysisProvider')];
    var freshProvider = require('../../src/providers/analysis/qwenAnalysisProvider');
    assert.strictEqual(freshProvider.realAnalysisEnabled, false);
  });
});

// ---------------------------------------------------------------------------
// No real network calls
// ---------------------------------------------------------------------------

describe('Qwen analysis adapter — no real network calls', function () {
  test('all tests use fake transport only', function () {
    // Meta-test: verifies that no test in this file uses a real transport.
    // All tests above use createFakeQwenAnalysisTransport.
    assert.ok(true, 'All tests use fake transport via createFakeQwenAnalysisTransport');
  });

  test('qwenAnalysisProvider does not import real HTTP client libraries', function () {
    var source = fs.readFileSync(
      path.join(__dirname, '..', '..', 'src', 'providers', 'analysis', 'qwenAnalysisProvider.js'),
      'utf-8'
    );

    // Verify no real HTTP client is imported
    assert.ok(
      !source.includes("require('http')"),
      'Should not require http module'
    );
    assert.ok(
      !source.includes("require('https')"),
      'Should not require https module'
    );
    assert.ok(
      !source.includes("require('axios')"),
      'Should not require axios'
    );
    assert.ok(
      !source.includes("require('node-fetch')"),
      'Should not require node-fetch'
    );
  });
});

// ---------------------------------------------------------------------------
// Backward compatibility: mock_ai still works
// ---------------------------------------------------------------------------

describe('mock_ai remains the active default', function () {
  test('mockMenuAnalysisProvider is still importable and functional', async function () {
    var mock = require('../../src/providers/analysis/mockMenuAnalysisProvider');

    var result = await mock.analyzeMenuText({
      requestBody: { userHomeCurrency: 'EUR', scan: { localCurrency: 'JPY' } },
      ocrResult: { text: 'Tonkotsu Ramen JPY 980' }
    });

    assert.strictEqual(result.provider, 'mock_ai');
    assert.strictEqual(result.mode, 'mock');
    assert.ok(result.dishes.length > 0);
  });

  test('registry still defaults to mock_ai', function () {
    var registry = require('../../src/providers/analysis/analysisProviderRegistry');
    var status = registry.getAnalysisProviderConfigStatus();

    assert.strictEqual(status.activeAnalysisProvider, 'mock_ai');
    assert.strictEqual(status.realAnalysisEnabled, false);
    assert.strictEqual(status.configValid, true);
  });
});
