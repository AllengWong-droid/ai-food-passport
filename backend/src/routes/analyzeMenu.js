const { buildMockAnalyzeMenuResponse } = require('../mock/mockAnalyzeMenuResponse');

async function handleAnalyzeMenu(request, response, body, startedAt) {
  if (request.method !== 'POST') {
    sendJson(response, 405, {
      error: {
        code: 'method_not_allowed',
        message: 'Use POST /api/analyze-menu.',
        source: 'mock_backend'
      }
    });
    return;
  }

  const parsedBody = parseJsonBody(body);
  if (!parsedBody.ok) {
    sendJson(response, 400, {
      error: {
        code: 'invalid_json',
        message: 'Request body must be valid JSON.',
        source: 'mock_backend'
      }
    });
    return;
  }

  const latencyMs = Date.now() - startedAt;
  sendJson(response, 200, buildMockAnalyzeMenuResponse(parsedBody.value, latencyMs));
}

function parseJsonBody(body) {
  if (!body) {
    return { ok: true, value: {} };
  }

  try {
    return { ok: true, value: JSON.parse(body) };
  } catch (_) {
    return { ok: false };
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });
  response.end(JSON.stringify(payload, null, 2));
}

module.exports = { handleAnalyzeMenu, sendJson };
