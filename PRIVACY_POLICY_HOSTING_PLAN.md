# Privacy Policy GitHub Pages Hosting Plan

> **Phase**: 21F
> **Date**: 2026-06-14
> **App**: AI Food Passport (MVP Alpha — mock-only)
> **Status**: Planning document only — no hosting actions have been taken

---

## 1. Why a Public Privacy Policy URL Is Needed

Apple **requires a public privacy policy URL** for:

| Use Case | Requirement |
|---|---|
| **TestFlight** (external testing) | Privacy policy URL is mandatory in App Store Connect before inviting external testers |
| **App Store submission** | Privacy policy URL is mandatory in App Store Connect metadata |
| **Internal TestFlight** | Apple may still require this field; better to have it ready |

Without a publicly accessible privacy policy URL, you cannot proceed past **Group 5 (Apple Account & App Store Connect Setup)** in the [TestFlight Preparation Plan](./TESTFLIGHT_PREPARATION_PLAN.md).

**Current state**: `PRIVACY_POLICY_DRAFT.md` exists but is only a local Markdown file. It must be converted to a publicly accessible HTML page at a stable URL.

---

## 2. Recommended Hosting Option

### Recommendation: **GitHub Pages (first), custom domain (later)**

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| **GitHub Pages** | Free, zero-config HTTPS, version-controlled via git, no additional accounts needed | URL includes `github.io` | **Use this first** — perfect for TestFlight MVP |
| **Custom domain** | Professional-looking URL (`privacy.aifoodpassport.com`) | Requires domain purchase (~$10/year), DNS setup, GitHub Pages CNAME config | Later upgrade, after Apple Developer membership |
| **Third-party privacy policy generator** | Quick, template-based | Another account, may inject ads, less control | Not recommended |

**Decision**: Host on GitHub Pages first. Add custom domain later when the app moves toward App Store submission.

---

## 3. Proposed URL Options

### Option A: Repository Pages (recommended)

**Format**: `https://<username>.github.io/ai-food-passport/privacy`

**Example**: `https://octocat.github.io/ai-food-passport/privacy`

- Hosted from the `ai-food-passport` repository's `docs/` folder or `gh-pages` branch
- Natural fit — privacy policy lives alongside the code
- Easy to update via the same git workflow

### Option B: User/Organization Pages

**Format**: `https://<username>.github.io/privacy/ai-food-passport`

**Example**: `https://octocat.github.io/privacy/ai-food-passport`

- Hosted from `<username>.github.io` repository
- Can serve multiple project privacy policies from one repo
- Slightly longer URL

### Option C: Custom Domain (later phase)

**Format**: `https://privacy.<yourdomain>.com`

- Requires domain purchase + DNS setup
- Most professional
- Not needed for TestFlight MVP

### Recommendation

| Priority | Option | When |
|---|---|---|
| **Now (MVP Alpha / TestFlight prep)** | Option A — Repository Pages | Before TestFlight external testing |
| **Later (App Store submission)** | Option C — Custom domain | After Apple Developer membership |

---

## 4. Recommended File Structure

```
ai-food-passport/
├── docs/
│   ├── index.html              ← Homepage (optional, redirects to privacy)
│   └── privacy/
│       └── index.html          ← Privacy policy page (the public URL)
│
├── PRIVACY_POLICY_DRAFT.md     ← Source markdown (kept for maintenance)
└── .github/
    └── workflows/
        └── deploy-privacy.yml  ← Optional: auto-deploy on push
```

Alternatively, if using a minimal setup:

```
ai-food-passport/
├── docs/
│   └── privacy.html            ← Single HTML file served at /privacy
└── PRIVACY_POLICY_DRAFT.md     ← Source markdown
```

**Recommendation**: Use `docs/privacy/index.html` for clean URLs (`/privacy/`), and keep `PRIVACY_POLICY_DRAFT.md` as the editable source.

---

## 5. Where to Host From

### Recommendation: **`ai-food-passport` repository, `docs/` folder**

| Hosting Source | Pros | Cons | Verdict |
|---|---|---|---|
| `ai-food-passport` repo (`docs/`) | Same repo, easy to update alongside code changes | Privacy page is mixed with Flutter code | **Use this** — simplest setup |
| `<username>.github.io` profile repo | Clean separation, can host multiple policies | Two repos to maintain, longer URL | Only if you plan multiple apps |
| Separate `ai-food-passport-privacy` repo | Cleanest separation | Overkill for a single page | Not recommended |

**Setup**: In the GitHub repository Settings → Pages, set:
- **Source**: `Deploy from a branch`
- **Branch**: `main` (or `master`)
- **Folder**: `/docs`

This makes `https://<username>.github.io/ai-food-passport/docs/privacy/` accessible publicly. To get a shorter URL, place the HTML directly in `docs/index.html` and set it as the repository's Pages root.

---

## 6. Recommended Privacy Policy Page Title

**Page `<title>` tag**: `AI Food Passport — Privacy Policy`

**Page heading (`<h1>`)**: `Privacy Policy for AI Food Passport`

The page should be clean, readable, and clearly identify the app. Avoid marketing language — this is a legal/informational page.

---

## 7. Copy Source

**Use `PRIVACY_POLICY_DRAFT.md` as the starting text.**

The existing draft covers all required sections:
- App identity (MVP Alpha, mock-only)
- Current data collection (none, with accurate two-mode explanation)
- Future production data processing
- Data handling principles
- Third-party services (Render, future providers)
- User choices
- Contact information placeholder
- App Store privacy label preparation

**Conversion steps**:
1. Copy the Markdown content from `PRIVACY_POLICY_DRAFT.md`
2. Convert to clean HTML (a simple `<h2>`/`<p>`/`<table>` structure — no frameworks needed)
3. Add the page title and required disclaimers
4. Apply minimal CSS for readability (system font stack, max-width container)
5. Publish via GitHub Pages

---

## 8. Required Disclaimers

The hosted privacy policy page **MUST** include these disclaimers (verbatim or equivalent):

| # | Disclaimer | Reason |
|---|---|---|
| 1 | **Draft only — not legal advice.** This privacy policy is a draft template. It has not been reviewed by a qualified professional. | Required by legal safety |
| 2 | **MVP Alpha — mock-only.** This app is in MVP Alpha stage. No real OCR/AI provider is enabled. All scan results are deterministic mock data. | Required for accuracy |
| 3 | **Render mock backend may receive requests when configured.** When BACKEND_BASE_URL is set to the Render-hosted mock backend, requests are sent to `https://ai-food-passport.onrender.com`. No real OCR/AI provider is enabled and no API keys are stored in Flutter. | Required for accuracy (Phase 21E revision) |
| 4 | **`productionReady` is `false`.** This app is not production-ready. Do not rely on it for food safety or allergen decisions. | Required for honesty |
| 5 | **No API keys in Flutter.** All provider credentials are server-side only. | Required for completeness |
| 6 | **Contact placeholder.** Support contact information is a placeholder. Update before submission. | Reminder to fill in |

These disclaimers must be **prominently displayed** at the top of the privacy policy page.

---

## 9. Step-by-Step Manual GitHub Pages Setup Instructions

### Prerequisites

- [ ] GitHub account with access to the `ai-food-passport` repository
- [ ] `PRIVACY_POLICY_DRAFT.md` content finalized and reviewed
- [ ] Git installed locally

### Step 1: Create the `docs/` directory

```bash
cd ai-food-passport
mkdir -p docs
```

### Step 2: Convert privacy policy to HTML

Create `docs/privacy-policy.html` (or `docs/index.html` if you want it at the root Pages URL):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Food Passport — Privacy Policy</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
      line-height: 1.6;
      color: #333;
    }
    .disclaimer {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 2rem;
    }
    .disclaimer h3 { margin-top: 0; color: #856404; }
    h1 { border-bottom: 2px solid #1a365d; padding-bottom: 0.5rem; }
    h2 { color: #1a365d; margin-top: 2rem; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    th { background: #f5f5f5; }
    .last-updated { color: #666; font-size: 0.9rem; margin-top: 3rem; }
  </style>
</head>
<body>
  <h1>Privacy Policy for AI Food Passport</h1>

  <div class="disclaimer">
    <h3>⚠️ Important Disclaimers</h3>
    <ul>
      <li><strong>Draft only — not legal advice.</strong> This privacy policy is a draft template. It has not been reviewed by a qualified professional.</li>
      <li><strong>MVP Alpha — mock-only.</strong> No real OCR/AI provider is enabled. All scan results are deterministic mock data.</li>
      <li><strong>Render mock backend may receive requests when configured.</strong> When BACKEND_BASE_URL points to the Render-hosted mock backend, requests are sent to <code>https://ai-food-passport.onrender.com</code>. No real OCR/AI provider is enabled and no API keys are stored in Flutter.</li>
      <li><strong>productionReady is false.</strong> Do not rely on this app for food safety or allergen decisions.</li>
    </ul>
  </div>

  <!-- COPY SECTIONS 1–11 FROM PRIVACY_POLICY_DRAFT.md HERE -->
  <!-- Convert Markdown to HTML: ## → <h2>, tables → <table>, etc. -->

  <p class="last-updated">Last updated: [DATE]</p>
</body>
</html>
```

### Step 3: Commit and push

```bash
git add docs/
git commit -m "Add privacy policy page for GitHub Pages hosting"
git push origin main
```

### Step 4: Enable GitHub Pages

1. Go to the repository on GitHub: `https://github.com/<username>/ai-food-passport`
2. Click **Settings** → **Pages** (left sidebar, under "Code and automation")
3. Under **"Build and deployment"**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or `master`)
   - **Folder**: `/docs`
4. Click **Save**

GitHub will show a message: `Your site is ready to be published at https://<username>.github.io/ai-food-passport/`.

### Step 5: Verify the URL

Wait 1–2 minutes for GitHub Pages to build (check the **Actions** tab for the `pages-build-deployment` workflow). Then open:

```
https://<username>.github.io/ai-food-passport/privacy-policy.html
```

### Step 6: Use the URL in App Store Connect

In App Store Connect, under **App Privacy** → **Privacy Policy**, paste:

```
https://<username>.github.io/ai-food-passport/privacy-policy.html
```

---

## 10. Validation Checklist

Before using this URL in any TestFlight or App Store submission, verify **every item**:

| # | Check | Criteria | Status |
|---|---|---|---|
| 1 | **URL opens publicly** | Page loads in a browser with no authentication required | ☐ |
| 2 | **HTTPS works** | URL starts with `https://` (GitHub Pages auto-provides this) | ☐ |
| 3 | **Page title is clear** | `<title>` contains "AI Food Passport — Privacy Policy" | ☐ |
| 4 | **App name visible** | "AI Food Passport" appears in the heading | ☐ |
| 5 | **Draft disclaimer present** | "Draft only — not legal advice" is visible | ☐ |
| 6 | **Mock-only disclaimer present** | "MVP Alpha — mock-only" is visible | ☐ |
| 7 | **Render backend disclaimer present** | "Render mock backend may receive requests when configured" is visible | ☐ |
| 8 | **productionReady disclaimer present** | "productionReady is false" is visible | ☐ |
| 9 | **No broken links** | All internal links work; no 404s | ☐ |
| 10 | **No overbroad privacy claims** | No "fully local," "no data leaves the device," or similar absolute statements | ☐ |
| 11 | **No real provider claims** | No claim that real OCR/AI is enabled or functional | ☐ |
| 12 | **No production-ready claims** | No claim that the app is production-ready or App Store ready | ☐ |
| 13 | **No API key leakage** | No embedded API keys, tokens, or secrets visible in page source | ☐ |
| 14 | **Contact info present** | Contact/support section is visible (placeholder is acceptable for TestFlight MVP) | ☐ |
| 15 | **Last updated date present** | A "Last updated" date is shown | ☐ |
| 16 | **Mobile responsive** | Page is readable on a phone screen (max-width: 800px + padding) | ☐ |

**All 16 items must pass before the URL is used in App Store Connect.**

---

## 11. Future Update Process

### When to update the privacy policy

| Trigger | Action Required | Priority |
|---|---|---|
| **Real OCR provider enabled** | Update data collection section. Add provider name as third-party service. Update App Store privacy label from "Data Not Collected" to appropriate labels. | Must-do before any real provider is enabled |
| **Real AI analysis provider enabled** | Same as above — update third-party services and data processing description. | Must-do before any real provider is enabled |
| **Firebase or analytics added** | Major update — declare analytics collection, purpose, and data types. | Must-do before enabling any analytics |
| **Account/login system added** | Major update — declare account data collection, authentication methods, data retention. | Must-do before enabling accounts |
| **Payments added** | Major update — declare payment processing, PCI compliance, third-party payment processor. | Must-do before enabling payments |
| **App Store submission** | Full review. Remove "draft" status. Have reviewed by qualified professional. Update privacy label in App Store Connect. | Must-do before App Store submission |
| **Custom domain enabled** | Update URL in App Store Connect. Consider adding a redirect from old GitHub Pages URL. | Optional, after domain purchase |

### Update workflow

1. Edit `PRIVACY_POLICY_DRAFT.md` first (source of truth)
2. Convert changes to the HTML page in `docs/`
3. Commit both files together
4. Push — GitHub Pages auto-deploys
5. Verify the live page reflects changes
6. If submitted to App Store, update privacy label in App Store Connect to match

**DO NOT** edit only the HTML file — the Markdown draft should always be the authoritative source.

---

## 12. Final Recommendation

### What to do now (free, no Apple membership needed)

| # | Action | Effort | Status |
|---|---|---|---|
| 1 | Create `docs/privacy-policy.html` from `PRIVACY_POLICY_DRAFT.md` | ~30 min | Not done |
| 2 | Push to `ai-food-passport` repository | ~1 min | Not done |
| 3 | Enable GitHub Pages in repository Settings → Pages | ~1 min | Not done |
| 4 | Verify the public URL loads correctly | ~2 min | Not done |
| 5 | Run validation checklist (Section 10) against live page | ~5 min | Not done |

### What NOT to do

| # | Do NOT | Reason |
|---|---|---|
| 1 | Do NOT submit to App Store | App is not ready (MVP Alpha mock-only, productionReady: false) |
| 2 | Do NOT publish App Store metadata | Metadata draft exists but is for planning only |
| 3 | Do NOT enable real providers | No API keys available; preflight gates not satisfied |
| 4 | Do NOT set productionReady to true | Backend remains mock-only |
| 5 | Do NOT buy Apple Developer Program membership yet | Wait until macOS + real provider demo are ready |
| 6 | Do NOT buy a custom domain yet | GitHub Pages `github.io` URL is sufficient for TestFlight MVP |
| 7 | Do NOT claim the privacy policy as legal advice | It is a draft template only |

### Recommended next phase

**Phase 21G: Create and publish the privacy policy page** — convert `PRIVACY_POLICY_DRAFT.md` to HTML, push to `docs/`, enable GitHub Pages. This is the **single most impactful free action** you can take right now toward TestFlight readiness.

After that:
- **Phase 16B**: Qwen OCR real smoke test (blocked by API key)
- **Phase 21H**: iOS config patch plan (apply Phase 21D identity decisions to actual config files, blocked by macOS)

---

## Document History

| Date | Change | Phase |
|---|---|---|
| 2026-06-14 | Initial hosting plan created | 21F |
