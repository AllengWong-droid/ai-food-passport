# Qwen OCR — Manual Smoke Test Guide

This document explains how to manually test the real Qwen OCR transport path.  
**No real API key is included in this document.** You must obtain your own Qwen
API key from [DashScope](https://dashscope.aliyun.com/).

---

## Prerequisites

- Node.js >= 18
- A valid Qwen API key from DashScope (starts with `sk-`)
- This project's backend directory as the working directory

---

## 1. Create `backend/.env` Locally

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set the following:

```bash
# Required gates — all must be set for Qwen OCR to activate
OCR_PROVIDER=qwen_ocr
QWEN_OCR_PROVIDER_ENABLED=true
QWEN_API_KEY=sk-your-real-api-key-here
QWEN_OCR_MODEL=qwen-vl-max
QWEN_OCR_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
```

**Never commit `.env` to version control.** The file is already in `.gitignore`.

---

## 2. Verify the Gates Are Met

Run the health check to confirm Qwen OCR is active:

```bash
curl -s http://127.0.0.1:8787/health | node -e "
  var d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
    var j=JSON.parse(d);
    console.log('activeOcrProvider:', j.activeOcrProvider);
    console.log('realOcrEnabled:', j.realOcrEnabled);
  })
"
```

Expected output:

```
activeOcrProvider: qwen_ocr
realOcrEnabled: true
```

If you see `activeOcrProvider: mock_ocr` and `realOcrEnabled: false`, one of the
gates is not met. Check the `configWarnings` field in the health response for
clues.

---

## 3. Start the Backend

```bash
npm run dev
```

---

## 4. Send a Test Request

Create a sample image (any small JPEG with text) and base64-encode it, then send:

```bash
curl -s -X POST http://127.0.0.1:8787/api/analyze-menu \
  -H 'Content-Type: application/json' \
  -d '{
    "imageBase64": "'$(base64 -w0 path/to/menu-photo.jpg)'",
    "providerMode": "mock"
  }' | node -e "
    var d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
      var j=JSON.parse(d);
      console.log('ok:', j.ok);
      console.log('ocr.provider:', j.data && j.data.ocr && j.data.ocr.provider);
      console.log('ocr.text:', j.data && j.data.ocr && j.data.ocr.text && j.data.ocr.text.substring(0, 200));
    })
  "
```

**Note:** The `providerMode: "mock"` still works — the OCR provider selection is
controlled by `OCR_PROVIDER` env var, not by `providerMode`.

---

## 5. Confirm the Response

A successful response should include:

- `ok: true`
- `data.ocr.provider: "qwen_ocr"`
- `data.ocr.mode: "ocr"`
- `data.ocr.text` contains the extracted menu text
- `data.ocr.confidence` is between 0 and 1
- `data.ocr.languageHints` is an array of language tags
- `data.ocr.warnings` is an array (may be empty)
- `data.ocr.rawMetadata` contains safe metadata (e.g., `totalTokens`)

---

## 6. Error Scenarios

### Missing API Key

Remove or comment out `QWEN_API_KEY` in `.env` and restart:

```bash
# QWEN_API_KEY=sk-...
```

Health check should show `realOcrEnabled: false`. POST requests to
`/api/analyze-menu` with `OCR_PROVIDER=qwen_ocr` should get a controlled
`OCR_PROVIDER_NOT_CONFIGURED` error.

### Placeholder API Key

Set `QWEN_API_KEY=sk-placeholder` and restart. Same result as missing key.

### Disabled Flag

Set `QWEN_OCR_PROVIDER_ENABLED=false` and restart. Same result.

---

## 7. Turn It Back Off

To return to mock mode:

1. In `backend/.env`, set `OCR_PROVIDER=mock_ocr` (or remove the line entirely)
2. Set `QWEN_OCR_PROVIDER_ENABLED=false` (or remove it)
3. Restart the backend

The health check should show:

```
activeOcrProvider: mock_ocr
realOcrEnabled: false
```

No real Qwen API calls will occur.

---

## Safety Reminders

- **Never commit `.env`** — it contains your API key.
- **Never put API keys in Flutter code** — keys stay in backend env vars only.
- **Never log API keys** — the transport strips keys from all error messages.
- **Never expose raw provider responses** — the OCR contract normalizes all output.
- **Stack traces are always stripped** from errors before they leave the backend.
- **Automated tests never call the real API** — they use stubbed https.request.

---

## Troubleshooting

| Symptom | Likely Cause |
|---------|-------------|
| `activeOcrProvider: mock_ocr` | `OCR_PROVIDER` is not set to `qwen_ocr` |
| `realOcrEnabled: false` | `QWEN_OCR_PROVIDER_ENABLED` is not `true`, or API key is missing/placeholder |
| `OCR_PROVIDER_NOT_CONFIGURED` error | One or more env gates not satisfied |
| `OCR_FAILED` with HTTP 401 | API key is invalid or expired |
| `OCR_FAILED` with HTTP 429 | Rate limit exceeded |
| `OCR_FAILED` with network error | Cannot reach DashScope — check network/URL |
| Server won't start | Check `PORT` is not in use; check Node.js version >= 18 |
