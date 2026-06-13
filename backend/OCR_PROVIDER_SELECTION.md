# OCR Provider Selection — AI Food Passport

> **Status**: No real OCR provider is active yet. This document records the
> evaluation and recommendation for Phase 12A preparation. Real provider
> implementation is deferred to a future phase.

## Current State

- Active OCR provider: `mock_ocr` (deterministic local text generator)
- Real OCR enabled: `false`
- Qwen OCR adapter scaffold: `backend/src/providers/ocr/qwenOcrProvider.js` (disabled, testable via fake transport)
- Provider skeletons exist but are disabled: Qwen OCR (skeleton), Google Vision, OpenAI Vision
- The OCR provider contract (`ocrProviderContract.js`) defines the standard shape all future real providers must produce
- The `/health` endpoint reports all available and configured providers
- Provider safety guards (timeout, rate limit, cost budget, logging redaction) are already skeleton-ready

## Provider Candidates

### 1. Qwen OCR / Qwen-VL

**Provider type**: China-hosted vision-language model (Alibaba Cloud / ModelScope).

**Strengths**:
- **China region availability**: Native access from Alibaba Cloud regions; no VPN required for China-based deployments.
- **Chinese + CJK text**: Strong multilingual OCR for Chinese, Japanese, and Korean menus — directly relevant to the app's use cases (TWD, JPY, CNY travelers).
- **VL capability**: Qwen-VL can perform OCR and structured understanding in a single call, reducing cost compared to separate OCR + LLM pipelines.
- **Cost**: Competitive pricing on Alibaba Cloud (DashScope); often cheaper than OpenAI / Google for CJK workloads.
- **Privacy**: Data stays within Alibaba Cloud China regions (important for China-market compliance).

**Weaknesses**:
- **Non-CJK languages**: May underperform Google Vision on Latin scripts (English, German, French, Italian, Spanish menus).
- **API maturity**: Qwen OCR API is newer and less battle-tested than Google Vision or OpenAI Vision.
- **Documentation**: Primarily Chinese; limited English developer resources.
- **Deployment complexity**: Requires Alibaba Cloud account, DashScope API key management, and region-aware routing logic.
- **Accuracy benchmarks**: Fewer public OCR benchmarks compared to Google Vision.

**Best fit**: China-mode routing (`providerMode: china`), CJK menus, travelers in East Asia.

---

### 2. OpenAI Vision (GPT-4V / GPT-4o)

**Provider type**: Global vision-language model (OpenAI).

**Strengths**:
- **Multilingual OCR**: Strong across Latin, CJK, Arabic, and Cyrillic scripts.
- **Unified pipeline**: OCR + structured analysis in a single call — no separate OCR/AI provider needed.
- **API maturity**: Well-documented, widely adopted, rich SDK ecosystem.
- **Schema / structured output support**: Can return structured JSON directly, reducing parsing effort.
- **Region-independent**: Available globally through OpenAI's API (no regional lock-in for non-China deployments).

**Weaknesses**:
- **Cost**: Per-image pricing is higher than dedicated OCR APIs; GPT-4V is expensive for high-volume menu scanning.
- **China region**: Not directly accessible from mainland China without VPN/proxy; may violate China data residency regulations.
- **Latency**: Vision model inference latency (1–5 s) is higher than dedicated OCR APIs (200–800 ms).
- **Privacy**: Data processed on OpenAI's US/EU infrastructure; may not meet China data localization requirements.
- **Rate limits**: Tiered rate limits can constrain production throughput.

**Best fit**: Global-mode routing (`providerMode: global`), Latin-script menus, travelers in Europe and North America.

---

### 3. Google Cloud Vision

**Provider type**: Purpose-built OCR API (Google Cloud).

**Strengths**:
- **OCR-specialized**: Purpose-built for text detection — highest accuracy for printed and handwritten text.
- **Language support**: 200+ languages, best-in-class for Latin scripts and widely-used CJK.
- **Region detection**: Automatic language and script detection.
- **Cost**: Competitive per-image pricing; free tier suitable for development and QA.
- **Latency**: Fast (200–800 ms typical), optimized for OCR workloads.
- **API maturity**: Battle-tested, comprehensive documentation, multiple SDKs.

**Weaknesses**:
- **No structured understanding**: Google Vision extracts text only — menu analysis still requires a separate AI provider (Qwen/DeepSeek/OpenAI), adding pipeline complexity.
- **China region**: Not directly accessible from mainland China without VPN/proxy.
- **Privacy**: Data processed on Google Cloud infrastructure; does not meet China data localization requirements.
- **Two-stage pipeline**: OCR → AI analysis introduces more failure modes, higher combined latency, and dual provider dependency.

**Best fit**: OCR-first pipeline where OCR and analysis are separated; global-mode deployments with separate AI analysis provider.

---

## Comparison Matrix

| Dimension | Qwen OCR/VL | OpenAI Vision | Google Vision |
|---|---|---|---|
| **OCR accuracy (CJK)** | High | High | High |
| **OCR accuracy (Latin)** | Medium | High | Very High |
| **Structured output** | Yes (VL) | Yes (GPT-4V) | No (text only) |
| **Pipeline stages** | 1 (OCR+analysis) | 1 (OCR+analysis) | 2 (OCR then analysis) |
| **Latency (per image)** | 1–3 s | 1–5 s | 200–800 ms |
| **Cost per image (est.)** | $0.002–0.01 | $0.01–0.03 | $0.001–0.005 |
| **China accessibility** | Native | VPN/proxy needed | VPN/proxy needed |
| **China data compliance** | Yes | No | No |
| **Global accessibility** | Limited | Full | Full |
| **Privacy posture** | China-local | US/EU | US/EU |
| **Deployment complexity** | Medium | Low | Medium |
| **SDK maturity** | Growing | High | High |

## Recommended First Real OCR Provider Candidate

### Recommendation: **Qwen OCR/VL** (for `china` mode)

**Rationale**:

1. **China-first market fit**: AI Food Passport's initial target users are Chinese travelers in East Asia (Japan, Taiwan, Korea). Qwen's native CJK OCR accuracy and China data compliance make it the right first provider.

2. **Unified pipeline**: Qwen-VL performs OCR and structured understanding in a single API call. This reduces latency, cost, and failure modes compared to the Google Vision + separate analysis provider two-stage approach.

3. **Privacy and compliance**: Data stays within Alibaba Cloud China regions. This is critical if the app ever needs to pass China app store review or handle user-uploaded menu photos under China data regulations.

4. **Cost efficiency**: Competitive DashScope pricing for CJK workloads; lower than OpenAI Vision for the expected user base.

5. **Skeleton readiness**: The `qwen_ocr_skeleton` provider already exists in the registry. The `ocrProviderContract.js` normalization layer is ready. Routing logic for `providerMode: china` already records future Qwen intent.

**Second candidate**: Google Cloud Vision (for `global` mode), to be implemented after Qwen OCR is validated and stable.

**Third candidate**: OpenAI Vision (for `global` mode fallback), reserved for regions where Google Vision is unavailable or as a premium unified-pipeline option.

### Implementation Sequencing

```
Phase 12A (current): Contract + selection prep
  → Phase 12B: Real OCR adapter for first candidate (Qwen)
  → Phase 12C: Integration tests with provider safety guards
  → Phase 12D: Real analysis provider adapter
  → Phase 12E: Full provider routing with real calls
  → Phase 12F: Second candidate (Google Vision) adapter
```

## Key Constraints

- **No provider is active yet**: All real provider implementations are pending future phases.
- **API keys must never be in Flutter**: All real provider calls go through the backend proxy.
- **Mock OCR remains the default**: Real OCR is only engaged when `OCR_PROVIDER` is explicitly set and the provider adapter is implemented.
- **Fallback safety**: If real OCR fails, the system must fall back to a friendly error recovery — never expose raw provider errors to users.
- **Cost guard**: Monthly budget and daily request limits must be enforced before any real provider goes to production.
- **Rollback**: Ability to switch back to `mock_ocr` quickly by unsetting `OCR_PROVIDER`.

## References

- `backend/src/providers/ocr/ocrProviderContract.js` — Standardized OCR result contract
- `backend/src/providers/ocr/ocrProviderTypes.js` — Provider names, modes, warning codes
- `backend/src/providers/ocr/ocrProviderRegistry.js` — Provider discovery and config validation
- `backend/REAL_PROVIDER_READINESS_CHECKLIST.md` — Full readiness checklist before enabling real providers
- `backend/SECURITY_AND_SECRETS.md` — Secret handling policy
- `backend/src/utils/safeErrorResponse.js` — Safe error code extraction
- `backend/src/utils/redactForLogs.js` — Logging redaction utility
