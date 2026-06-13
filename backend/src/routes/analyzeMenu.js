const { extractMenuText } = require('../providers/ocr/mockOcrProvider');
const { analyzeMenuText } = require('../providers/analysis/mockMenuAnalysisProvider');

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

  try {
    const ocr = await extractMenuText(parsedBody.value);
    if (!ocr.text || !ocr.text.trim()) {
      sendJson(request, response, 422, errorPayload(
        'OCR_EMPTY_TEXT',
        'Could not find readable menu text.'
      ));
      return;
    }

    const analysis = await analyzeMenuText({
      requestBody: parsedBody.value,
      ocrResult: ocr
    });
    const latencyMs = Date.now() - startedAt;
    const warnings = [
      ...(ocr.warnings || []),
      ...(analysis.warnings || [])
    ];
    const routing = {
      mode: 'mock',
      ocrProvider: ocr.provider,
      ocrMode: ocr.mode,
      ocrConfidence: ocr.confidence,
      ocrWarnings: ocr.warnings || [],
      analysisProvider: analysis.provider,
      analysisMode: analysis.mode,
      analysisConfidence: analysis.confidence,
      analysisWarnings: analysis.warnings || [],
      warnings,
      fallbackUsed: false,
      latencyMs
    };
    const data = {
      routing,
      ocr,
      dishes: analysis.dishes
    };

    sendJson(request, response, 200, {
      ok: true,
      data,
      error: null,
      // Backwards compatibility for Phase 7C Flutter parser.
      routing: data.routing,
      dishes: data.dishes
    });
  } catch (error) {
    if (error.code === 'OCR_FAILED') {
      sendJson(request, response, 502, errorPayload(
        'OCR_FAILED',
        'Could not read the menu image.'
      ));
      return;
    }

    if (error.code === 'ANALYSIS_FAILED') {
      sendJson(request, response, 502, errorPayload(
        'ANALYSIS_FAILED',
        'Could not analyze the menu.'
      ));
      return;
    }

    sendJson(request, response, 502, errorPayload(
      'PROVIDER_FAILURE',
      'Menu analysis is temporarily unavailable.'
    ));
  }
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
