const http = require('http');
const { handleAnalyzeMenu, sendJson } = require('./routes/analyzeMenu');

const port = Number(process.env.PORT || 8787);

const server = http.createServer((request, response) => {
  const startedAt = Date.now();

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  let body = '';
  request.on('data', chunk => {
    body += chunk;
    if (body.length > 1024 * 1024) {
      request.destroy();
    }
  });

  request.on('end', () => {
    if (request.url === '/api/analyze-menu') {
      handleAnalyzeMenu(request, response, body, startedAt);
      return;
    }

    sendJson(response, 404, {
      error: {
        code: 'not_found',
        message: 'Route not found.',
        source: 'mock_backend'
      }
    });
  });
});

server.listen(port, () => {
  console.log(`AI Food Passport mock backend listening on http://localhost:${port}`);
});
