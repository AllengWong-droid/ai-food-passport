/**
 * Unit tests for redactForLogs utility.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  redactForLogs,
  redactError,
  REDACTED,
  isSensitiveKey
} = require('../../src/utils/redactForLogs');

describe('redactForLogs', () => {
  test('should return primitives unchanged', () => {
    assert.strictEqual(redactForLogs('hello'), 'hello');
    assert.strictEqual(redactForLogs(42), 42);
    assert.strictEqual(redactForLogs(null), null);
    assert.strictEqual(redactForLogs(undefined), undefined);
    assert.strictEqual(redactForLogs(true), true);
  });

  test('should mask apiKey field', () => {
    const obj = { apiKey: 'secret-key', name: 'test' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.apiKey, REDACTED);
    assert.strictEqual(result.name, 'test');
    assert.strictEqual(obj.apiKey, 'secret-key'); // original unchanged
  });

  test('should mask authorization field', () => {
    const obj = { authorization: 'Bearer xyz', type: 'header' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.authorization, REDACTED);
    assert.strictEqual(result.type, 'header');
  });

  test('should mask token field', () => {
    const obj = { token: 'abc123', userId: 'user1' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.token, REDACTED);
    assert.strictEqual(result.userId, 'user1');
  });

  test('should mask secret field', () => {
    const obj = { secret: 'my-secret', name: 'app' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.secret, REDACTED);
  });

  test('should mask password field', () => {
    const obj = { password: 'pass123', username: 'admin' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.password, REDACTED);
    assert.strictEqual(result.username, 'admin');
  });

  test('should mask image field', () => {
    const obj = { image: 'base64data', id: 1 };
    const result = redactForLogs(obj);
    assert.strictEqual(result.image, REDACTED);
  });

  test('should mask imageBytes field', () => {
    const obj = { imageBytes: Buffer.from('fake'), label: 'photo' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.imageBytes, REDACTED);
  });

  test('should mask base64 field', () => {
    const obj = { base64: 'iVBORw0KGgo=', name: 'pic' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.base64, REDACTED);
  });

  test('should mask rawImage field', () => {
    const obj = { rawImage: '<binary>', width: 100 };
    const result = redactForLogs(obj);
    assert.strictEqual(result.rawImage, REDACTED);
  });

  test('should mask menuImage field', () => {
    const obj = { menuImage: 'data:image/jpeg;base64,...', dishName: 'pizza' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.menuImage, REDACTED);
  });

  test('should mask providerRawResponse field', () => {
    const obj = { providerRawResponse: '{"choices":[]}', safe: true };
    const result = redactForLogs(obj);
    assert.strictEqual(result.providerRawResponse, REDACTED);
    assert.strictEqual(result.safe, true);
  });

  test('should mask providerRawError field', () => {
    const obj = { providerRawError: 'quota exceeded', code: 'OCR_FAILED' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.providerRawError, REDACTED);
    assert.strictEqual(result.code, 'OCR_FAILED');
  });

  test('should mask stack field', () => {
    const obj = { stack: 'Error: oops\n  at fn', message: 'oops' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.stack, REDACTED);
    assert.strictEqual(result.message, 'oops');
  });

  test('should be case-insensitive for field names', () => {
    const obj = { ApiKey: 'x', TOKEN: 'y', Password: 'z', Normal: 'ok' };
    const result = redactForLogs(obj);
    assert.strictEqual(result.ApiKey, REDACTED);
    assert.strictEqual(result.TOKEN, REDACTED);
    assert.strictEqual(result.Password, REDACTED);
    assert.strictEqual(result.Normal, 'ok');
  });

  test('should handle nested objects', () => {
    const obj = {
      outer: 'safe',
      inner: {
        secret: 'hidden',
        base64: 'img==',
        safe: 'yes'
      }
    };
    const result = redactForLogs(obj);
    assert.strictEqual(result.outer, 'safe');
    assert.strictEqual(result.inner.secret, REDACTED);
    assert.strictEqual(result.inner.base64, REDACTED);
    assert.strictEqual(result.inner.safe, 'yes');
  });

  test('should handle arrays', () => {
    const arr = [
      { apiKey: 'x', label: 'a' },
      { token: 'y', label: 'b' }
    ];
    const result = redactForLogs(arr);
    assert.strictEqual(result[0].apiKey, REDACTED);
    assert.strictEqual(result[1].token, REDACTED);
    assert.strictEqual(result[0].label, 'a');
    assert.strictEqual(result[1].label, 'b');
  });

  test('should handle circular references', () => {
    const obj = { a: 1 };
    obj.self = obj;
    const result = redactForLogs(obj);
    assert.strictEqual(result.a, 1);
    assert.strictEqual(result.self, '[Circular]');
  });

  test('REDACTED constant should be [REDACTED]', () => {
    assert.strictEqual(REDACTED, '[REDACTED]');
  });
});

describe('redactError', () => {
  test('should strip stack from Error objects', () => {
    const err = new Error('something went wrong');
    err.code = 'OCR_FAILED';
    const safe = redactError(err);
    assert.strictEqual(safe.message, 'something went wrong');
    assert.strictEqual(safe.code, 'OCR_FAILED');
    assert.strictEqual(safe.stack, undefined);
  });

  test('should handle Error with no code', () => {
    const err = new Error('oops');
    const safe = redactError(err);
    assert.strictEqual(safe.message, 'oops');
    assert.strictEqual(safe.code, undefined);
    assert.strictEqual(safe.stack, undefined);
  });

  test('should handle null input', () => {
    const safe = redactError(null);
    assert.strictEqual(safe.message, '[unknown error]');
    assert.strictEqual(safe.code, undefined);
  });

  test('should handle undefined input', () => {
    const safe = redactError(undefined);
    assert.strictEqual(safe.message, '[unknown error]');
  });

  test('should handle plain objects with message', () => {
    const obj = { message: 'error from provider', code: 'BAD' };
    const safe = redactError(obj);
    assert.strictEqual(safe.message, 'error from provider');
    assert.strictEqual(safe.code, 'BAD');
  });
});

describe('isSensitiveKey', () => {
  test('should return true for sensitive keys', () => {
    assert.strictEqual(isSensitiveKey('apiKey'), true);
    assert.strictEqual(isSensitiveKey('authorization'), true);
    assert.strictEqual(isSensitiveKey('token'), true);
    assert.strictEqual(isSensitiveKey('secret'), true);
    assert.strictEqual(isSensitiveKey('password'), true);
    assert.strictEqual(isSensitiveKey('image'), true);
    assert.strictEqual(isSensitiveKey('imageBytes'), true);
    assert.strictEqual(isSensitiveKey('base64'), true);
    assert.strictEqual(isSensitiveKey('rawImage'), true);
    assert.strictEqual(isSensitiveKey('menuImage'), true);
    assert.strictEqual(isSensitiveKey('providerRawResponse'), true);
    assert.strictEqual(isSensitiveKey('providerRawError'), true);
    assert.strictEqual(isSensitiveKey('stack'), true);
  });

  test('should be case-insensitive', () => {
    assert.strictEqual(isSensitiveKey('ApiKey'), true);
    assert.strictEqual(isSensitiveKey('TOKEN'), true);
    assert.strictEqual(isSensitiveKey('PASSWORD'), true);
  });

  test('should return false for non-sensitive keys', () => {
    assert.strictEqual(isSensitiveKey('name'), false);
    assert.strictEqual(isSensitiveKey('id'), false);
    assert.strictEqual(isSensitiveKey('data'), false);
    assert.strictEqual(isSensitiveKey('dishes'), false);
  });
});
