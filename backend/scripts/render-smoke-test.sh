#!/bin/bash
# Render Deploy Smoke Test — AI Food Passport Backend (Mock Only)
# Usage: bash scripts/render-smoke-test.sh https://YOUR-APP.onrender.com
#
# Phase 13C: Verifies a deployed mock-only backend.
# No real providers, no secrets, no production readiness.

set -euo pipefail

BASE_URL="${1:-}"
if [ -z "$BASE_URL" ]; then
  echo "Usage: bash scripts/render-smoke-test.sh https://your-app.onrender.com"
  exit 1
fi

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

pass() { echo -e "${GREEN}[PASS]${NC} $1"; PASS=$((PASS + 1)); }
fail() { echo -e "${RED}[FAIL]${NC} $1 — $2"; FAIL=$((FAIL + 1)); }
warn() { echo -e "${YELLOW}[WARN]${NC} $1 — $2"; }

echo "========================================"
echo " Render Mock Deploy Smoke Test"
echo " Target: $BASE_URL"
echo " $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "========================================"
echo ""

# ────────────────────────────────────────────────────
# 1. GET /health
# ────────────────────────────────────────────────────
echo "--- Test 1: GET /health ---"
HEALTH=$(curl -s -w "\n%{http_code}" "$BASE_URL/health" 2>&1) || true
HTTP_CODE=$(echo "$HEALTH" | tail -1)
BODY=$(echo "$HEALTH" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  pass "HTTP 200 OK"
else
  fail "HTTP status is $HTTP_CODE (expected 200)"
fi

OK=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.ok)" 2>/dev/null || echo "parse_error")
if [ "$OK" = "true" ]; then
  pass "ok: true"
else
  fail "ok: true" "got: $OK"
fi

OCR=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.activeOcrProvider)" 2>/dev/null || echo "parse_error")
if [ "$OCR" = "mock_ocr" ]; then
  pass "activeOcrProvider: mock_ocr"
else
  fail "activeOcrProvider: mock_ocr" "got: $OCR"
fi

ANALYSIS=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.activeAnalysisProvider)" 2>/dev/null || echo "parse_error")
if [ "$ANALYSIS" = "mock_ai" ]; then
  pass "activeAnalysisProvider: mock_ai"
else
  fail "activeAnalysisProvider: mock_ai" "got: $ANALYSIS"
fi

REAL=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.realProvidersEnabled)" 2>/dev/null || echo "parse_error")
if [ "$REAL" = "false" ]; then
  pass "realProvidersEnabled: false"
else
  fail "realProvidersEnabled: false" "got: $REAL"
fi

PROD=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.productionReady)" 2>/dev/null || echo "parse_error")
if [ "$PROD" = "false" ]; then
  pass "productionReady: false"
else
  fail "productionReady: false" "got: $PROD"
fi

DEPLOY=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.deploymentReadinessReady)" 2>/dev/null || echo "parse_error")
if [ "$DEPLOY" = "true" ]; then
  pass "deploymentReadinessReady: true"
else
  fail "deploymentReadinessReady: true" "got: $DEPLOY"
fi

CORS=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.corsEnforcementReady)" 2>/dev/null || echo "parse_error")
if [ "$CORS" = "true" ]; then
  pass "corsEnforcementReady: true"
else
  fail "corsEnforcementReady: true" "got: $CORS"
fi

BODY_LIMIT=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.requestBodyLimitReady)" 2>/dev/null || echo "parse_error")
if [ "$BODY_LIMIT" = "true" ]; then
  pass "requestBodyLimitReady: true"
else
  fail "requestBodyLimitReady: true" "got: $BODY_LIMIT"
fi

# Secret check on /health
if echo "$BODY" | grep -qE 'sk-[a-zA-Z0-9]{10,}'; then
  fail "No secrets in /health" "found sk- pattern"
elif echo "$BODY" | grep -q '"apiKey"'; then
  fail "No secrets in /health" "found apiKey field"
else
  pass "No secrets in /health response"
fi

# Stack trace check
if echo "$BODY" | grep -q 'at Object\.'; then
  fail "No stack trace in /health" "found 'at Object.' pattern"
else
  pass "No stack trace in /health"
fi

echo ""

# ────────────────────────────────────────────────────
# 2. POST /api/analyze-menu with {}
# ────────────────────────────────────────────────────
echo "--- Test 2: POST /api/analyze-menu {} ---"
ANALYZE=$(curl -s -X POST "$BASE_URL/api/analyze-menu" \
  -H "Content-Type: application/json" \
  -d '{}' 2>&1) || true

ANALYZE_OK=$(echo "$ANALYZE" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.ok)" 2>/dev/null || echo "parse_error")
if [ "$ANALYZE_OK" = "true" ]; then
  pass "ok: true"
else
  fail "ok: true" "got: $ANALYZE_OK"
fi

DISH_COUNT=$(echo "$ANALYZE" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.data?.dishes?.length||0)" 2>/dev/null || echo "0")
if [ "$DISH_COUNT" -gt 0 ]; then
  pass "dishes non-empty (count: $DISH_COUNT)"
else
  fail "dishes non-empty" "got: $DISH_COUNT dishes"
fi

MOCK_MODE=$(echo "$ANALYZE" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.data?.routing?.resolvedProviderMode||'none')" 2>/dev/null || echo "parse_error")
if [ "$MOCK_MODE" = "mock" ]; then
  pass "resolvedProviderMode: mock"
else
  fail "resolvedProviderMode: mock" "got: $MOCK_MODE"
fi

# Secret check on analyze-menu
if echo "$ANALYZE" | grep -qE 'sk-[a-zA-Z0-9]{10,}'; then
  fail "No secrets in analyze-menu" "found sk- pattern"
elif echo "$ANALYZE" | grep -q '"apiKey"'; then
  fail "No secrets in analyze-menu" "found apiKey field"
else
  pass "No secrets in analyze-menu response"
fi

# Stack trace check
if echo "$ANALYZE" | grep -q 'at Object\.'; then
  fail "No stack trace in analyze-menu" "found 'at Object.'"
else
  pass "No stack trace in analyze-menu"
fi

echo ""

# ────────────────────────────────────────────────────
# 3. providerMode routing
# ────────────────────────────────────────────────────
echo "--- Test 3: providerMode routing ---"
for MODE in china global auto; do
  RES=$(curl -s -X POST "$BASE_URL/api/analyze-menu" \
    -H "Content-Type: application/json" \
    -d "{\"providerMode\":\"$MODE\"}" 2>&1) || true
  RES_MODE=$(echo "$RES" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.data?.routing?.resolvedProviderMode||j.data?.routing?.fallbackMode||'none')" 2>/dev/null || echo "error")
  if echo "$RES" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));process.exit(j.ok?0:1)" 2>/dev/null; then
    pass "providerMode=$MODE → ok (fallback: $RES_MODE)"
  else
    fail "providerMode=$MODE" "not ok"
  fi
done

echo ""

# ────────────────────────────────────────────────────
# 4. Invalid JSON test
# ────────────────────────────────────────────────────
echo "--- Test 4: Invalid JSON ---"
INVALID=$(curl -s -X POST "$BASE_URL/api/analyze-menu" \
  -H "Content-Type: application/json" \
  -d 'not json' 2>&1) || true
INVALID_CODE=$(echo "$INVALID" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.error?.code||'none')" 2>/dev/null || echo "parse_error")
if [ "$INVALID_CODE" = "BAD_REQUEST" ]; then
  pass "Invalid JSON → BAD_REQUEST"
else
  fail "Invalid JSON → BAD_REQUEST" "got: $INVALID_CODE"
fi

if echo "$INVALID" | grep -q 'at Object\.'; then
  fail "No stack trace in invalid JSON" "found 'at Object.'"
else
  pass "No stack trace in invalid JSON error"
fi

echo ""

# ────────────────────────────────────────────────────
# 5. CORS preflight
# ────────────────────────────────────────────────────
echo "--- Test 5: CORS preflight ---"
CORS_RES=$(curl -s -i -X OPTIONS "$BASE_URL/api/analyze-menu" \
  -H "Origin: http://localhost:8081" \
  -H "Access-Control-Request-Method: POST" 2>&1) || true
if echo "$CORS_RES" | grep -qi "Access-Control-Allow-Origin"; then
  pass "CORS → Access-Control-Allow-Origin header present"
else
  warn "CORS → Access-Control-Allow-Origin header not found (may be ok for API-only deploy)"
fi

if echo "$CORS_RES" | grep -q "204"; then
  pass "CORS preflight → HTTP 204"
else
  warn "CORS preflight status not 204 (may be ok)"
fi

echo ""

# ────────────────────────────────────────────────────
# 6. Confirm no real calls / no misconfig
# ────────────────────────────────────────────────────
echo "--- Test 6: Real provider safety ---"
REAL_OCR=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.realOcrEnabled||false)" 2>/dev/null || echo "error")
REAL_ANALYSIS=$(echo "$BODY" | node -e "const j=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(j.realAnalysisEnabled||false)" 2>/dev/null || echo "error")

if [ "$REAL_OCR" = "false" ] && [ "$REAL_ANALYSIS" = "false" ]; then
  pass "Both real providers disabled (realOcrEnabled=$REAL_OCR, realAnalysisEnabled=$REAL_ANALYSIS)"
else
  fail "Real providers should be disabled" "realOcrEnabled=$REAL_OCR, realAnalysisEnabled=$REAL_ANALYSIS"
fi

echo ""

# ────────────────────────────────────────────────────
# Summary
# ────────────────────────────────────────────────────
echo "========================================"
echo " Results: $PASS passed, $FAIL failed"
echo "========================================"
if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}DEPLOY VERIFICATION FAILED${NC}"
  exit 1
else
  echo -e "${GREEN}ALL SMOKE TESTS PASSED${NC}"
  exit 0
fi
