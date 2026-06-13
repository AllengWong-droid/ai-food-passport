# OCR Providers

This folder is a skeleton for backend OCR adapters.

Current status:

- `mockOcrProvider` is deterministic and local-only.
- It does not call Qwen OCR, Google Vision, Azure OCR, Tesseract, OpenAI Vision, or any external OCR service.
- It requires no API keys or secrets.

Future OCR providers should keep secrets on the backend and return the same basic shape: provider, mode, text, language hints, confidence, and warnings.
