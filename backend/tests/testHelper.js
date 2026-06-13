/**
 * Test helper for backend contract tests.
 * Starts/stops the backend server as a child process.
 */

const { spawn } = require('child_process');
const http = require('http');

const PORT = 8787;
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess = null;

function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn('node', ['src/server.js'], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'pipe'
    });

    serverProcess.stderr.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes('running') || msg.includes('listening')) {
        // Server is ready, but we'll still poll to be safe
      }
    });

    // Poll until server is ready
    const startTime = Date.now();
    const poll = setInterval(() => {
      http.get(BASE_URL + '/health', (res) => {
        clearInterval(poll);
        resolve();
      }).on('error', () => {
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
      const proc = serverProcess;
      serverProcess = null;

      // On Windows, SIGTERM may not work; use taskkill as primary
      if (process.platform === 'win32') {
        try {
          const { execSync } = require('child_process');
          execSync(`taskkill /pid ${proc.pid} /T /F 2>nul`, { stdio: 'ignore' });
        } catch (_) {
          // Process may have already exited
        }
        resolve();
      } else {
        proc.kill('SIGTERM');
        proc.on('exit', () => resolve());
        // Force kill after 2 seconds
        setTimeout(() => {
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
