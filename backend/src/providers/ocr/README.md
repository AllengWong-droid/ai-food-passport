# OCR Providers

This folder is a skeleton for backend OCR adapters.

Current status:

- `mockOcrProvider` is deterministic and local-only.
- `ocrProviderRegistry` selects the active OCR provider.
- `OCR_PROVIDER` defaults to `mock_ocr`.
- `qwen_ocr_skeleton`, `google_vision_skeleton`, and `openai_vision_skeleton` are disabled placeholders.
- Empty `OCR_PROVIDER` values safely use `mock_ocr`.
- Unknown `OCR_PROVIDER` values return `OCR_PROVIDER_INVALID`.
- Disabled skeleton providers return `OCR_PROVIDER_NOT_CONFIGURED`.
- It does not call Qwen OCR, Google Vision, Azure OCR, Tesseract, OpenAI Vision, or any external OCR service.
- It requires no API keys or secrets.

Future OCR providers should keep secrets on the backend and return the same basic shape: provider, mode, text, language hints, confidence, and warnings.
