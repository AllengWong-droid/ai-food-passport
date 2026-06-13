# Analysis Provider Selection

> **Status (2026-06-13): QWEN ANALYSIS ADAPTER SCAFFOLD EXISTS — DISABLED BY DEFAULT**
>
> Phase 12F Qwen analysis provider adapter scaffold is in place. It conforms to the
> analysis provider contract, supports fake transport offline testing (58 unit tests),
> and remains disabled by default. No real Qwen analysis API calls yet.
> `mock_ai` remains the only active default.

This document evaluates candidate AI menu analysis providers for the AI Food Passport backend.
It covers tradeoffs and recommends the first real analysis provider to implement.

---

## Candidate Providers

### 1. Qwen (DashScope VL)

| Attribute | Value |
|---|---|
| **Provider key** | `qwen_analysis` |
| **API** | DashScope `/api/v1/services/aigc/text2text/industry/DashScopeDondatafrext` (VL model) |
| **Strengths** | • China-friendly (DashScope, no GFW block)  • Strong CJK menu understanding  • Returns structured JSON when prompt-steered  • Single model handles both OCR + analysis (future consolidation) |
| **Weaknesses** | • Requires DashScope account + API key  • English menu performance good but CJK-optimised  • Rate limits on free tier |
| **Cost** | ¥0.02–0.08 / 1K tokens (qwen-vl-max) |
| **Region** | China (DashScope), global via DashScope endpoint |
| **CJK** | ⭐⭐⭐⭐⭐ Excellent |
| **Structured output** | Good with explicit JSON prompt steering |
| **Privacy** | Data processed in China (Alibaba Cloud) |

### 2. DeepSeek

| Attribute | Value |
|---|---|
| **Provider key** | `deepseek_analysis` |
| **API** | `https://api.deepseek.com/chat/completions` (DeepSeek-V3 or R1) |
| **Strengths** | • Lower-cost reasoning model  • Strong English + decent CJK  • OpenAI-compatible API (easy portability)  • Chain-of-thought useful for nutrition reasoning |
| **Weaknesses** | • CJK menu understanding good but not Qwen-level  • No native vision — requires OCR text first (same as current architecture)  • DeepSeek-R1 adds latency via reasoning tokens |
| **Cost** | $0.14 / 1M tokens (input), $0.28 / 1M (output) — very low |
| **Region** | Global (DeepSeek API), China (siliconflow.cn mirror) |
| **CJK** | ⭐⭐⭐⭐ Very good |
| **Structured output** | Good with JSON mode |
| **Privacy** | Data processed on DeepSeek infrastructure |

### 3. OpenAI (GPT-4o / GPT-4 Turbo)

| Attribute | Value |
|---|---|
| **Provider key** | `openai_analysis` |
| **API** | `https://api.openai.com/v1/chat/completions` (gpt-4o) |
| **Strengths** | • Global brand recognition  • Strong English menu understanding  • Native vision (can analyze image directly)  • Mature structured output (JSON mode, function calling) |
| **Weaknesses** | • Blocked in China without VPN  • Most expensive option  • CJK menu understanding good but not Qwen-level  • Requires separate OCR step for current architecture |
| **Cost** | $2.50 / 1M input tokens (gpt-4o), $10.00 / 1M output — expensive |
| **Region** | Global (OpenAI API), blocked in China mainland |
| **CJK** | ⭐⭐⭐⭐ Good |
| **Structured output** | ⭐⭐⭐⭐⭐ Excellent (JSON mode) |
| **Privacy** | Data processed on OpenAI infrastructure (may be used for training unless opted out) |

---

## Tradeoffs Matrix

| Criteria | Qwen | DeepSeek | OpenAI |
|---|---|---|---|
| **Cost** | Low-Medium | **Lowest** | High |
| **CJK menu** | **Best** | Good | Good |
| **China deployment** | **Native** | Via mirror | Blocked |
| **Structured output** | Good | Good | **Best** |
| **Vision (future)** | Native VL | Text only | Native |
| **API stability** | Good | Good | **Best** |
| **Latency** | ~2–4s | ~1–3s | ~2–5s |
| **Privacy (China)** | Alibaba Cloud | DeepSeek / SiliconFlow | Not applicable |

---

## Recommended First Real Analysis Provider: **Qwen (DashScope)**

### Why Qwen first?

1. **China-friendly deployment** — The app targets travellers who visit China. A backend deployed in China (or accessible from China) avoids GFW issues. DashScope is the natural choice.

2. **CJK menu strength** — Qwen VL models are trained on Chinese/日本語/한국어 menus. This gives the highest-quality analysis for the core use case.

3. **Unified OCR + analysis path** — Qwen VL can both OCR and analyze in one call. Future phases can consolidate the two-step mock pipeline into a single Qwen call, reducing latency.

4. **Cost reasonable** — Cheaper than OpenAI, similar to DeepSeek-V3 for typical menu sizes.

5. **Structured output achievable** — With prompt steering (JSON-only, no markdown), Qwen VL can return valid JSON dishes.

### When to add DeepSeek?

- As a **lower-cost fallback** for non-China deployments
- When the user wants **reasoning-level nutrition explanation** (DeepSeek-R1)
- When China deployment is not needed

### When to add OpenAI?

- For **global deployments** where China access is not required
- When **native vision** (analyze image directly) is desired and cost is acceptable
- When **best-in-class structured output** is needed

---

## Implementation Order (Recommended)

1. **Phase 12F** — Qwen analysis provider adapter (skeleton → scaffold, fake transport, disabled) ✅ COMPLETE
2. **Phase 12G** — Qwen analysis transport (HTTPS, timeout, retries)
3. **Phase 12H** — Provider fallback routing (Qwen → DeepSeek → mock)
4. **Phase 13** — Unified Qwen VL OCR + analysis call (consolidate two steps)
5. **Future** — DeepSeek and OpenAI adapters

---

## Env Gate Design (Preview)

When Phase 12F is started, the following env gates will be used:

```bash
# Analysis provider selection
ANALYSIS_PROVIDER=qwen_analysis
QWEN_ANALYSIS_PROVIDER_ENABLED=true
QWEN_ANALYSIS_API_KEY=<DashScope API key>
QWEN_ANALYSIS_MODEL=qwen-vl-max
QWEN_ANALYSIS_BASE_URL=https://dashscope.aliyuncs.com

# DeepSeek (future)
# DEEPSEEK_ANALYSIS_PROVIDER_ENABLED=true
# DEEPSEEK_API_KEY=...

# OpenAI (future)
# OPENAI_ANALYSIS_PROVIDER_ENABLED=true
# OPENAI_API_KEY=...
```

Same safety pattern as Qwen OCR:
- All gates must be satisfied → real provider active
- Missing/invalid → `ANALYSIS_PROVIDER_NOT_CONFIGURED`
- No real calls in automated tests
- No API keys in source code or git

---

## Current Status

- [x] Analysis provider contract defined (`analysisProviderContract.js`)
- [x] Normalization helpers implemented (dishes, scores, prices, warnings)
- [x] Fixture-based tests (101 tests) passing
- [x] `mock_ai` remains the only active analysis provider
- [x] Qwen analysis adapter scaffold (`qwenAnalysisProvider.js`) — Phase 12F
- [x] Qwen analysis adapter unit tests (58 tests) passing — all offline
- [x] Qwen analysis disabled by default (`realAnalysisEnabled: false`)
- [ ] Qwen analysis real transport (Phase 12G — not started)
- [ ] DeepSeek analysis adapter (not started)
- [ ] OpenAI analysis adapter (not started)
- [ ] Real analysis provider calls (blocked until API key obtained)

---

## References

- DashScope Qwen VL API: https://help.aliyun.com/zh/model-studio/
- DeepSeek API docs: https://platform.deepseek.com/docs
- OpenAI GPT-4o docs: https://platform.openai.com/docs/models/gpt-4o
