/**
 * Test helper for backend contract tests.
 * Starts/stops the backend server as a child process.
 */

const { spawn } = require('child_process');
const http = require('http');

const PORT = 8787;
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess = null;

/**
 * Start the backend server as a child process.
 *
 * @param {object} [envOverrides] — Additional env vars to merge on top of
 *   { ...process.env, NODE_ENV: 'test' }. Use this for tests that need custom
 *   provider configuration (e.g. OCR_PROVIDER=qwen_ocr, QWEN_API_KEY=placeholder).
 *   Existing env vars from process.env are preserved; envOverrides wins on conflict.
 * @returns {Promise<void>}
 */
function startServer(envOverrides) {
  var mergedEnv = { ...process.env, NODE_ENV: 'test', PORT: String(PORT) };
  if (envOverrides) {
    Object.assign(mergedEnv, envOverrides);
  }
  return new Promise((resolve, reject) => {
    serverProcess = spawn('node', ['src/server.js'], {
      cwd: process.cwd(),
      env: mergedEnv,
      stdio: 'pipe'
    });

    serverProcess.stderr.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('running') || msg.includes('listening')) {
        // Server is ready, but we'll still poll to be safe
      }
    });

    // Poll until server is ready
    var startTime = Date.now();
    var poll = setInterval(function () {
      // Guard: if the spawned process has already exited (e.g. port conflict),
      // stop polling and reject immediately. Without this check, the poll
      // loop might connect to an old server instance still listening on the
      // same port, giving a false positive.
      if (serverProcess && serverProcess.exitCode !== null) {
        clearInterval(poll);
        reject(new Error('Server process exited prematurely with code ' + serverProcess.exitCode));
        return;
      }

      http.get(BASE_URL + '/health', function (res) {
        clearInterval(poll);
        resolve();
      }).on('error', function () {
        if (Date.now() - startTime > 5000) {
          clearInterval(poll);
          reject(new Error('Server failed to start within 5 seconds'));
        }
      });
    }, 200);
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (serverProcess) {
      var proc = serverProcess;
      serverProcess = null;

      // On Windows, SIGTERM may not work; use taskkill as primary
      if (process.platform === 'win32') {
        try {
          var { execSync } = require('child_process');
          execSync('taskkill /pid ' + proc.pid + ' /T /F 2>nul', { stdio: 'ignore' });
        } catch (_) {
          // Process may have already exited
        }

        // Poll until the process is actually dead, then wait an extra
        // small delay for the OS to release the port. Without this,
        // the next startServer may accidentally connect to the old
        // server instance still occupying the same port, causing
        // cross-contamination between test scenarios.
        var killPollStart = Date.now();
        var killPoll = setInterval(function () {
          try {
            process.kill(proc.pid, 0);
            // Process still alive — keep waiting
            if (Date.now() - killPollStart > 5000) {
              // Force timeout after 5 seconds
              clearInterval(killPoll);
              resolve();
            }
          } catch (_e) {
            // Process is dead — wait 200ms for port release, then resolve
            clearInterval(killPoll);
            setTimeout(resolve, 200);
          }
        }, 100);
      } else {
        proc.kill('SIGTERM');
        proc.on('exit', function () { resolve(); });
        // Force kill after 2 seconds
        setTimeout(function () {
          try { proc.kill('SIGKILL'); } catch (_) {}
          resolve();
        }, 2000);
      }
    } else {
      resolve();
    }
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(BASE_URL + path, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    }).on('error', reject);
  });
}

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function postRaw(path, payload, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'POST',
      headers: headers
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function options(path, origin) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    }, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers
      });
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = {
  startServer,
  stopServer,
  get,
  post,
  postRaw,
  options,
  PORT,
  BASE_URL
};
