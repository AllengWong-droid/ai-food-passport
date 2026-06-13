const { buildMockAnalyzeMenuResponse } = require('../mock/mockAnalyzeMenuResponse');

async function handleAnalyzeMenu(request, response, body, startedAt) {
  if (request.method !== 'POST') {
    sendJson(request, response, 405, errorPayload(
      'METHOD_NOT_ALLOWED',
      'Use POST /api/analyze-menu.'
    ));
    return;
  }

  const parsedBody = parseJsonBody(body);
  if (!parsedBody.ok) {
    sendJson(request, response, 400, errorPayload(
      'BAD_REQUEST',
      'Request body must be valid JSON.'
    ));
    return;
  }

  const latencyMs = Date.now() - startedAt;
  const mockData = buildMockAnalyzeMenuResponse(parsedBody.value, latencyMs);
  sendJson(request, response, 200, {
    ok: true,
    data: mockData,
    error: null,
    // Backwards compatibility for Phase 7C Flutter parser.
    routing: mockData.routing,
    dishes: mockData.dishes
  });
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

function sendJson(request, response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...corsHeaders(request),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });

  if (statusCode === 204) {
    response.end();
    return;
  }

  response.end(JSON.stringify(payload, null, 2));
}

function errorPayload(code, message, details = null) {
  return {
    ok: false,
    data: null,
    error: {
      code,
      message,
      details
    }
  };
}

function corsHeaders(request) {
  const origin = request.headers.origin;
  if (!origin) {
    return { 'Access-Control-Allow-Origin': '*' };
  }

  if (isAllowedLocalOrigin(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin'
    };
  }

  return {};
}

function isAllowedLocalOrigin(origin) {
  try {
    const url = new URL(origin);
    return url.protocol === 'http:' &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
  } catch (_) {
    return false;
  }
}

module.exports = {
  handleAnalyzeMenu,
  sendJson,
  errorPayload
};
