# SEO Audit — Zeroth Store Website

**Date:** 2025-09-15
**Site type:** Local business — gaming booster / joki service (Indonesian market)
**Stack:** Vite + React (SPA, client-side rendered) → Vercel
**Pages audited:** /, /games, /games/:slug, /testimoni, /faq, /kontak

---

## Executive Summary

**Overall health: CRITICAL — currently not indexable by any search engine.**

The site ships `<meta name="robots" content="noindex, nofollow">` in the baked `index.html`, which means Google has never indexed, and will never index, any page on this site. This is the single most damaging SEO issue possible: everything else is irrelevant until this is removed. 

Beyond the noindex blocker, there are 3 critical structural gaps (no sitemap, no robots.txt, no per-page title/meta) and several high-impact on-page issues (wrong language attribute, missing OpenGraph, zero structured data) that, once the noindex tag is removed, will still limit ranking potential if not addressed.

**Priority 1 (blockers — fix before launch):**
1. Remove `<meta name="robots" content="noindex, nofollow">`
2. Fix `<html lang="en">` → `lang="id"`
3. Add robots.txt + sitemap.xml

**Priority 2 (high-impact — fix same week):**
4. Replace hardcoded title/description with per-page values
5. Add OpenGraph + Twitter Card meta tags
6. Add self-referencing canonical tag per page
7. Fix FAQ list accessibility (`role="listitem"` on `<li>`)

**Priority 3 (quick wins — easy, high value):**
8. Add favicon
9. Add LocalBusiness + FAQPage JSON-LD schema
10. Swap "Gaming Hero" alt text for meaningful game-specific descriptions

---

## Technical SEO Findings

### Finding 1 — CRITICAL: `noindex, nofollow` tag blocking all indexing

**Issue:** `index.html` ships with `<meta name="robots" content="noindex, nofollow">` baked into the static file. This is present in the built `dist/index.html` (verified: the Vite build preserves it verbatim).

**Impact:** CRITICAL — Google will not index any page. Bing will not index any page. The entire site is invisible to search engines. This is the equivalent of flipping the "off" switch on SEO.

**Evidence:** Confirmed in `dist/index.html` line 10 and verified at runtime via browser console: `document.querySelector('meta[name="robots"]').content === "noindex, nofollow"`.

**Fix:** Remove the line `<meta name="robots" content="noindex, nofollow" />` from `index.html`. For the public-facing site, you want `index, follow`. This was likely added during development to prevent search engines from crawling a dev/staging instance and was never removed.

**Priority:** 1 — CRITICAL. Must fix before deploying.

---

### Finding 2 — CRITICAL: No sitemap.xml

**Issue:** No `sitemap.xml` file exists at the project root, in `public/`, or served by Vite/Vercel. No sitemap is referenced anywhere.

**Impact:** CRITICAL — Without a sitemap, Google has no prioritized list of URLs to crawl. For a small site this is less damaging than for a large one, but it still means Google must discover pages through links alone, which slows indexation and means deep pages (like individual `/games/:slug`) may be crawled less frequently.

**Fix:** Create `public/sitemap.xml` with all canonical URLs. For a React Router SPA on Vercel, a static sitemap.xml in `public/` is simplest. Recommended content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://YOUR-DOMAIN/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://YOUR-DOMAIN/games</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://YOUR-DOMAIN/testimoni</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://YOUR-DOMAIN/faq</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://YOUR-DOMAIN/kontak</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <!-- Add one <url> per game: /games/genshin-impact, /games/honkai-star-rail, etc. -->
</urlset>
```

Dynamic generation from the games API is ideal long-term; static file is fine for launch.

**Priority:** 1 — CRITICAL.

---

### Finding 3 — CRITICAL: No robots.txt

**Issue:** No `robots.txt` file exists anywhere. When Google requests `https://YOUR-DOMAIN/robots.txt`, it gets a 404 or SPA fallback HTML.

**Impact:** HIGH — Without robots.txt, Google has no crawl directives, no sitemap reference, and must rely on default behavior (crawl everything). This also means the admin panel routes (`/admin/*`) are fully crawlable and may be indexed.

**Fix:** Add `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://YOUR-DOMAIN/sitemap.xml
```

**Priority:** 1 — CRITICAL.

---

### Finding 4 — CRITICAL: Wrong HTML lang attribute

**Issue:** `<html lang="en">` — the entire site content is in Indonesian (Bahasa Indonesia), but the page declares itself as English.

**Impact:** HIGH — Google uses the `lang` attribute (among other signals) to determine page language. Setting it to `en` while serving Indonesian content confuses language targeting. It may cause the page to appear in English search results (where it would rank poorly due to language mismatch), or cause Google to misidentify the content language during its helpful content evaluation.

**Evidence:** Every visible heading, paragraph, button, FAQ answer, and testimonial on the site is in Bahasa Indonesia. The `lang` attribute is set to `en` in `index.html` line 3.

**Fix:** Change `<html lang="en">` to `<html lang="id">`.

**Priority:** 1 — CRITICAL.

---

### Finding 5 — SPA architecture limits per-page SEO

**Issue:** This is a single `index.html` with React Router handling all routing client-side. There is no server-side rendering (SSR), no static site generation (SSG), and no prerendering. Every route (`/`, `/games`, `/faq`, `/kontak`, `/testimoni`, `/games/:slug`) serves the exact same `index.html` shell.

**Impact:** HIGH — When Google crawls any URL, it receives the same HTML with the same title, same meta description, and no content (content is rendered by JavaScript after fetch). Google's JS renderer will execute React and see the content, but:
- The page title will be identical on every page ("Zeroth Store Website")
- The meta description will be the same generic e-commerce copy on every page
- Google may not wait for JS execution on every crawl (depends on crawl budget / rendering queue)
- Social media crawlers (Facebook, Twitter, LinkedIn) do NOT execute JavaScript, so they'll see an empty shell

**Fix options (in order of effort):**
1. **Least effort:** Use a library like `react-helmet-async` or `@tanstack/react-helmet` to set `<title>`, `<meta description>`, `<meta robots>`, and `<link rel="canonical">` per page inside each React component. This doesn't fix the SSR problem but ensures correct meta tags when JS runs.
2. **Moderate:** Use `vite-plugin-ssr` or `vike` to add prerendering/SSR to the Vite build, rendering the HTML server-side with correct meta tags.
3. **Best (but most work):** Migrate to Next.js with App Router for full SSR + SSG per route.

For a local business site with ~8 pages, option 1 is sufficient. Option 2 is better if you plan to grow.

**Priority:** 2 — HIGH.

---

### Finding 6 — No OpenGraph or Twitter Card meta tags

**Issue:** The site has zero OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) and zero Twitter Card (`twitter:card`, `twitter:title`, etc.) meta tags.

**Impact:** HIGH — When anyone shares a link to this site on Facebook, WhatsApp, Twitter, Discord, or Telegram, the preview will show: no title (or the generic "Zeroth Store Website"), no description, no image. This is a direct hit to click-through from social sharing — which for a gaming business is a primary traffic channel.

**Fix:** Add OpenGraph and Twitter Card tags via `react-helmet-async` (per page) or directly in `index.html` (single set for SPA). Minimum viable:

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Zeroth Store — Joki Game Profesional #1 Indonesia" />
<meta property="og:description" content="Joki game Genshin Impact, Honkai Star Rail, ZZZ, dan lainnya. Aman, cepat, harga terjangkau." />
<meta property="og:image" content="https://YOUR-DOMAIN/og-image.png" />
<meta property="og:url" content="https://YOUR-DOMAIN/" />
<meta name="twitter:card" content="summary_large_image" />
```

**Priority:** 2 — HIGH.

---

### Finding 7 — No canonical tags

**Issue:** No `<link rel="canonical">` tag on any page. For a Vercel-deployed SPA with Vercel URL normalization (trailing slashes, www/non-www), this risks duplicate content signals.

**Impact:** MEDIUM — Less critical for a small site, but canonical tags are a best practice that signals to Google which URL is the "real" one. Without them, Google guesses, which may lead to diluted ranking signals across URL variants.

**Fix:** Add a self-referencing canonical tag to each page via `react-helmet-async`:
```html
<link rel="canonical" href="https://YOUR-DOMAIN/" />
```

**Priority:** 2 — HIGH.

---

### Finding 8 — Zero structured data (JSON-LD schema)

**Issue:** No `<script type="application/ld+json">` tags on any page. No LocalBusiness, Organization, FAQPage, or BreadcrumbList schema.

**Impact:** MEDIUM-HIGH — Structured data enables rich snippets in Google search results. For a local business, `LocalBusiness` schema with `openingHours`, `telephone`, `address`, and `priceRange` is the single highest-ROI schema type. For the FAQ page, `FAQPage` schema can show expandable Q&A directly in search results (a significant CTR boost).

**Fix:** Add JSON-LD to key pages:
- Homepage: `LocalBusiness` + `Organization` schema
- FAQ page: `FAQPage` schema
- Games page: `ItemList` schema (optional)

Note: since this is an SPA, JSON-LD must be injected via `react-helmet-async` or a script tag in the component (browser renders it client-side). Google's JS renderer will pick it up, but social crawlers won't.

**Priority:** 2 — HIGH.

---

### Finding 9 — Wrong meta description (generic e-commerce copy)

**Issue:** The hardcoded `<meta name="description">` reads: *"An online store offering a seamless shopping experience with easy browsing, secure checkout, and diverse product selection for modern consumers."* This is generic template copy that describes a physical e-commerce store, not a gaming booster/joki service.

**Impact:** HIGH — Even if the noindex tag is removed, Google will display this irrelevant description in search results. Users searching for "joki Genshin Impact" will see a description about "online store" and "diverse product selection" — which is both irrelevant and unclickable.

**Fix:** Replace with Indonesian copy relevant to the service:
```html
<meta name="description" content="Zeroth Store — joki game profesional untuk Genshin Impact, Honkai Star Rail, Zenless Zone Zero, dan lainnya. Aman, cepat, harga terjangkau. Order via WhatsApp." />
```

Note: this only fixes the homepage. Per-page meta descriptions require `react-helmet-async` (see Finding 5).

**Priority:** 2 — HIGH.

---

### Finding 10 — No page title optimization

**Issue:** `<title>Zeroth Store Website</title>` — the same generic title is served on every page (SPA limitation). It doesn't contain any target keyword and uses "Website" which adds no value.

**Impact:** HIGH — The `<title>` tag is the single most important on-page SEO element. Every page should have a unique, keyword-rich title. Currently Google would see the same title on `/games`, `/faq`, `/kontak`, etc.

**Fix:** Minimum — change the root title to: `Zeroth Store — Joki Game Profesional & Terpercaya`
Full — use `react-helmet-async` to set unique titles per page:
- `/` → `Zeroth Store — Joki Game Profesional #1 Indonesia`
- `/games` → `Semua Game — Zeroth Store`
- `/games/genshin-impact` → `Joki Genshin Impact — Zeroth Store`
- `/testimoni` → `Testimoni Klien — Zeroth Store`
- `/faq` → `FAQ — Zeroth Store`
- `/kontak` → `Kontak — Zeroth Store`

**Priority:** 2 — HIGH.

---

## On-Page SEO Findings

### Finding 11 — Heading hierarchy is correct

**Status: OK.** Each page has exactly one H1, with H2/H3 following logically. The homepage H1 "Joki Game Profesional & Terpercaya #1 Indonesia" contains the target keyword. Game cards use H3 for game names — appropriate.

No action needed.

---

### Finding 12 — Image alt text present but generic

**Issue:** All images have `alt` attributes (no empty alts — verified via browser audit: 0 images missing alt), but some alt text is generic. Hero image uses `alt="Gaming Hero"` which describes nothing useful to search engines.

**Impact:** LOW — Images are mostly decorative (hero backgrounds, game card art). Search engines will derive some context from alt text. `alt="Gaming Hero"` should be `alt="Zeroth Store — joki game Genshin Impact, Honkai Star Rail, dan lainnya"` or similar keyword-rich alt text.

**Fix:** Replace generic alt text with descriptive, keyword-relevant alternatives on the homepage hero image. Game card images already use game names as alt text, which is fine.

**Priority:** 3 — LOW.

---

### Finding 13 — FAQ page `<li>` elements have redundant `role="listitem"`

**Issue:** The FAQ page renders `<li role="listitem">` — the `role="listitem"` attribute is redundant on an `<li>` element (which already has implicit `listitem` role). This is an accessibility anti-pattern that can confuse some screen readers.

**Evidence:** Confirmed in the browser DOM snapshot: `<listitem [level=1]>` elements in both the FAQ page and footer navigation.

**Impact:** LOW — Not a direct SEO issue, but accessibility issues can affect user engagement signals (time on page, bounce rate) which are indirect ranking factors.

**Fix:** Remove `role="listitem"` from `<li>` elements in FAQPage.tsx and Footer.tsx.

**Priority:** 3 — LOW.

---

### Finding 14 — API fetch failure causes default/zero stats

**Issue:** The homepage `AppContext` fetch to the API fails in dev mode (no backend running), causing stats to fall back to 0: "0+ Order Selesai", "0 Game Dilayani", "0% Tingkat Kepuasan", "0+ Klien Aktif". This is visible in the browser: the stats section shows "0" for all metrics.

**Impact:** LOW (dev-only) — In production with the API running, stats load correctly from the database. However, if the API goes down in production, visitors see "0" stats which damages trust and E-E-A-T signals. The hardcoded fallback values in `gameData.ts` (`totalOrders: 2847`, `satisfactionRate: 98`) should be used as defaults when the API fails, rather than `0`.

**Fix:** In `AppContext.tsx`, when the stats fetch fails, fall back to the hardcoded values from `gameData.ts` instead of the current `0` defaults.

**Priority:** 3 — MEDIUM (trust/E-E-A-T impact).

---

## Content Quality Assessment

### Finding 15 — Content is in Indonesian but lang="en" (affects Google language detection)

**Issue:** All visible content — headings, paragraphs, FAQ answers, testimonials, product descriptions — is in Bahasa Indonesia. The `lang="en"` attribute (Finding 4) directly conflicts with this. Google uses visible content to determine language, but the `lang` attribute provides an additional (strong) signal.

**Impact:** HIGH — Combined with Finding 4, this creates a contradictory language signal that may cause Google to misclassify the page's language in search results.

**Fix:** Covered in Finding 4 — change `lang="en"` to `lang="id"`.

**Priority:** 1.

---

### Finding 16 — E-E-A-T signals are weak

**Issue:** The site has no visible author credentials, no "About" page, no team bios, no physical address (beyond "Malang, Jawa Timur" in the footer WhatsApp link), and no business registration information.

**Impact:** MEDIUM — For a local business, Google's local search algorithm looks for E-E-A-T signals: consistent NAP (Name, Address, Phone) across the web, a Google Business Profile, and visible trust signals. The site has:
- Name: "Zeroth Store" ✓
- Phone: WhatsApp number ✓
- Address: Only in footer link text ("Malang, Jawa Timur"), no structured address ✗
- Google Business Profile: Unknown (not visible on site)

**Fix (low-effort, high-impact):**
1. Add a visible business address to the footer (not just in a WA link)
2. Create/claim a Google Business Profile and link to it
3. Add LocalBusiness JSON-LD schema (see Finding 8)

**Priority:** 3 — MEDIUM.

---

## Prioritized Action Plan

### 🔴 Critical — Fix before any deployment (Day 1)

| # | Issue | File | Effort |
|---|-------|------|--------|
| 1 | Remove `noindex, nofollow` | `index.html` | 1 line delete |
| 2 | Change `lang="en"` → `lang="id"` | `index.html` | 1 line edit |
| 3 | Add `robots.txt` | `public/robots.txt` | New file |
| 4 | Add `sitemap.xml` | `public/sitemap.xml` | New file |
| 5 | Fix meta description | `index.html` | 1 line edit |
| 6 | Fix page title | `index.html` | 1 line edit |

### 🟡 High Impact — Fix same week (Days 2-7)

| # | Issue | Effort |
|---|-------|--------|
| 7 | Install `react-helmet-async`, add per-page `<title>` + `<meta>` to every page component | Medium |
| 8 | Add OpenGraph + Twitter Card tags | Medium (with #7) |
| 9 | Add self-referencing canonical tags per page | Medium (with #7) |
| 10 | Add LocalBusiness + FAQPage JSON-LD schema | Medium |
| 11 | Fix API fallback to show hardcoded stats on fetch failure | Small |

### 🟢 Quick Wins — Easy, immediate value (Week 1-2)

| # | Issue | Effort |
|---|-------|--------|
| 12 | Add favicon (ico/png) to `public/` | Tiny |
| 13 | Improve hero image alt text | Tiny |
| 14 | Remove redundant `role="listitem"` from `<li>` elements | Tiny |
| 15 | Add visible business address to footer | Small |
| 16 | Set up Google Search Console + submit sitemap | External |

### 🔵 Long-term Recommendations

| # | Recommendation |
|---|----------------|
| 17 | Consider SSR/prerendering (vite-plugin-ssr/vike or Next.js migration) for full crawlability |
| 18 | Set up Google Business Profile for local SEO |
| 19 | Build an "About" / "Tim Kami" page for E-E-A-T |
| 20 | Add hreflang if expanding to English/Malay markets |
| 21 | Add breadcrumbs (BreadcrumbList schema + visible breadcrumbs) |
| 22 | Monitor Core Web Vitals in Search Console after launch |

---

*Generated by seo-audit skill (coreyhaines31/marketingskills v2.0.1)*
