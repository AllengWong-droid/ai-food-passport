/**
 * Unit tests for safeErrorResponse utility.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  extractSafeErrorCode,
  isSafeErrorCode,
  buildSafeLogEntry,
  KNOWN_SAFE_ERROR_CODES_ARRAY
} = require('../../src/utils/safeErrorResponse');

describe('extractSafeErrorCode', () => {
  test('should return known safe code from error object', () => {
    const err = new Error('ocr error');
    err.code = 'OCR_FAILED';
    assert.strictEqual(extractSafeErrorCode(err, 'PROVIDER_FAILURE'), 'OCR_FAILED');
  });

  test('should return fallback for unknown code', () => {
    const err = new Error('internal');
    err.code = 'ECONNREFUSED';
    assert.strictEqual(extractSafeErrorCode(err, 'PROVIDER_FAILURE'), 'PROVIDER_FAILURE');
  });

  test('should return fallback for error with no code', () => {
    const err = new Error('oops');
    assert.strictEqual(extractSafeErrorCode(err, 'PROVIDER_FAILURE'), 'PROVIDER_FAILURE');
  });

  test('should return fallback for null error', () => {
    assert.strictEqual(extractSafeErrorCode(null, 'PROVIDER_FAILURE'), 'PROVIDER_FAILURE');
  });

  test('should return fallback for undefined error', () => {
    assert.strictEqual(extractSafeErrorCode(undefined, 'PROVIDER_FAILURE'), 'PROVIDER_FAILURE');
  });

  test('should accept all known safe codes', () => {
    const knownCodes = [
      'METHOD_NOT_ALLOWED',
      'BAD_REQUEST',
      'NOT_FOUND',
      'REQUEST_BODY_TOO_LARGE',
      'OCR_FAILED',
      'OCR_EMPTY_TEXT',
      'OCR_PROVIDER_NOT_CONFIGURED',
      'OCR_PROVIDER_INVALID',
      'ANALYSIS_FAILED',
      'ANALYSIS_PROVIDER_NOT_CONFIGURED',
      'ANALYSIS_PROVIDER_INVALID',
      'PROVIDER_FAILURE',
      'PROVIDER_UNAVAILABLE',
      'PROVIDER_TIMEOUT',
      'PROVIDER_GUARD_INVALID_OPERATION'
    ];
    for (const code of knownCodes) {
      const err = new Error('test');
      err.code = code;
      assert.strictEqual(extractSafeErrorCode(err, 'PROVIDER_FAILURE'), code);
    }
  });
});

describe('isSafeErrorCode', () => {
  test('should return true for known safe codes', () => {
    assert.strictEqual(isSafeErrorCode('OCR_FAILED'), true);
    assert.strictEqual(isSafeErrorCode('ANALYSIS_FAILED'), true);
    assert.strictEqual(isSafeErrorCode('BAD_REQUEST'), true);
  });

  test('should return false for unknown codes', () => {
    assert.strictEqual(isSafeErrorCode('STACK_OVERFLOW'), false);
    assert.strictEqual(isSafeErrorCode('ENOENT'), false);
    assert.strictEqual(isSafeErrorCode('QuotaExceeded'), false);
  });

  test('should return false for null/undefined', () => {
    assert.strictEqual(isSafeErrorCode(null), false);
    assert.strictEqual(isSafeErrorCode(undefined), false);
  });
});

describe('buildSafeLogEntry', () => {
  test('should include code and message for known safe code', () => {
    const err = new Error('something bad');
    err.code = 'ANALYSIS_FAILED';
    err.stack = 'Error: something bad\n  at /path/to/file.js:10:5';
    const entry = buildSafeLogEntry(err, 'analyzeMenu');
    assert.strictEqual(entry.code, 'ANALYSIS_FAILED');
    assert.strictEqual(entry.message, 'something bad');
    assert.strictEqual(entry.context, 'analyzeMenu');
    assert.strictEqual(entry.stack, undefined);
  });

  test('should not expose unknown code', () => {
    const err = new Error('lib error');
    err.code = 'ENOENT';
    const entry = buildSafeLogEntry(err);
    assert.strictEqual(entry.code, undefined);
    assert.strictEqual(entry.message, 'lib error');
  });

  test('should not include stack trace', () => {
    const err = new Error('oops');
    err.stack = 'Error: oops\n  at fn';
    const entry = buildSafeLogEntry(err);
    assert.strictEqual(entry.stack, undefined);
  });

  test('should handle null error', () => {
    const entry = buildSafeLogEntry(null);
    assert.strictEqual(entry.message, '[unknown error]');
  });

  test('should include context when provided', () => {
    const err = new Error('test');
    err.code = 'OCR_FAILED';
    const entry = buildSafeLogEntry(err, 'ocrStage');
    assert.strictEqual(entry.context, 'ocrStage');
  });

  test('should not include raw provider fields', () => {
    const err = {
      code: 'OCR_FAILED',
      message: 'failed',
      providerRawResponse: '{"choices":[]}',
      providerRawError: 'quota',
      stack: '...'
    };
    const entry = buildSafeLogEntry(err);
    assert.strictEqual(entry.providerRawResponse, undefined);
    assert.strictEqual(entry.providerRawError, undefined);
    assert.strictEqual(entry.stack, undefined);
  });
});

describe('KNOWN_SAFE_ERROR_CODES_ARRAY', () => {
  test('should be an array of strings', () => {
    assert.strictEqual(Array.isArray(KNOWN_SAFE_ERROR_CODES_ARRAY), true);
    for (const code of KNOWN_SAFE_ERROR_CODES_ARRAY) {
      assert.strictEqual(typeof code, 'string');
    }
  });

  test('should contain expected codes', () => {
    assert.strictEqual(KNOWN_SAFE_ERROR_CODES_ARRAY.includes('OCR_FAILED'), true);
    assert.strictEqual(KNOWN_SAFE_ERROR_CODES_ARRAY.includes('ANALYSIS_FAILED'), true);
    assert.strictEqual(KNOWN_SAFE_ERROR_CODES_ARRAY.includes('BAD_REQUEST'), true);
  });
});
