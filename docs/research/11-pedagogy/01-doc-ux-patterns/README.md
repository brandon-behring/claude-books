# Production technical-doc UX + visual presentation patterns

Per-site cache of UX / layout / IA observations from 11 production documentation surfaces. Captured 2026-05-23 for the `claude-books` visual-pedagogy research sprint.

## Sites captured

| # | Site | Type | Note | Distinctive signature |
|---|---|---|---|---|
| 1 | Stripe Docs | Commercial / single-product / large | [site-stripe-docs.md](./site-stripe-docs.md) | Two-column code+prose; polyglot code dumps; personalized API keys; LLM-instruction comments embedded in pages |
| 2 | Linear Docs | Commercial / product / mid | [site-linear-docs.md](./site-linear-docs.md) | Minimal chrome; card-grid landing; same visual register for all content types |
| 3 | Linear Method | Commercial / essay site | [site-linear-method.md](./site-linear-method.md) | Single-register manifesto; persistent whole-book TOC; numbered subheadings (1.1, 2.1); serif-leaning typography |
| 4 | Vercel Docs | Commercial / single-product / large | [site-vercel-docs.md](./site-vercel-docs.md) | URL-prefix separation by content type (/docs/ vs /kb/); link-dense bullet lists; dedicated "agent resources" pivot |
| 5 | Resend Docs | Commercial / single-product / small | [site-resend-docs.md](./site-resend-docs.md) | 13-card framework grid landing; Mintlify house style; `llms.txt` first-class |
| 6 | Anthropic Docs | Commercial / single-product / mid | [site-anthropic-docs.md](./site-anthropic-docs.md) | Mintlify components (`<Steps>`, `<CardGroup>`, `<Tip>`); URL-prefix content-type separation; comparison-table routing pages |
| 7 | Astro Docs | OSS / framework / large | [site-astro-docs.md](./site-astro-docs.md) | Four-mode top-nav pivot (Tutorial / Guide / Reference / Ecosystem); Starlight theme; terminal-window chrome |
| 8 | MDN Web Docs | OSS / reference / huge | [site-mdn.md](./site-mdn.md) | Strongest example of scale; inline glossary cross-links; Previous/Next at top and bottom; yellow-bordered Notes |
| 9 | Microsoft Learn | Enterprise / multi-product / huge | [site-microsoft-learn.md](./site-microsoft-learn.md) | Hub-as-card-grid; 4-callout featured row; multi-surface architecture (Docs / Training / Cert / Q&A) |
| 10 | Tailwind Docs | OSS / framework / mid | [site-tailwind-docs.md](./site-tailwind-docs.md) | Distinct page templates by content type; numbered procedural steps; live previews; "Are you stuck?" escape-hatch callouts |
| 11 | React.dev | OSS / framework / mid | [site-react-dev.md](./site-react-dev.md) | Two-mode Learn/Reference pivot (cleanest Diátaxis reduction); Sandpack interactive code; rich callout vocabulary (Note / Pitfall / DeepDive / Recipes / YouWillLearn); cartoon illustrations |
| 12 | Diátaxis | OSS / meta-framework | [site-diataxis.md](./site-diataxis.md) | The framework most production docs in this set implement; compass diagram; bridge pages between adjacent quadrants |
| 13 | Cloudflare Docs | Commercial / multi-product / large | [site-cloudflare-docs.md](./site-cloudflare-docs.md) | Most overt Diátaxis implementation: explicit content-type pill badges on every page; question-based troubleshooting collapsibles |
| 14 | Docusaurus Showcase | OSS / generator survey | [site-docusaurus-showcase.md](./site-docusaurus-showcase.md) | The 274-site cross-section that defines the modern "default docs look"; Algolia DocSearch, versioning, edit-this-page as standard primitives |

**14 sites covered** (the original 13 listed plus Linear Method as a separate surface, since its UX register diverges sharply from Linear Docs).

## Cross-site patterns

### 1. Three-column is the modern default; deviate intentionally

Left sidebar (IA navigation) + main column (prose + code) + right rail ("in this article" anchors) is the baseline across **MDN, Tailwind, Astro, React.dev, Anthropic, Vercel, Cloudflare, Diátaxis, default Docusaurus**. The columns that vary:

- **Right rail behavior** — most sites use it for "on this page" anchors; **Linear Method** uses it for the whole-book TOC (sequential reading signal). The choice signals "you're scanning this page" vs "you're reading sequentially across pages."
- **Left sidebar tree** — depth varies enormously. MDN goes 4-5 levels deep with breadcrumbs; Linear / Resend stay flat with card-grid landings instead.
- **No right rail** — appropriate for short pages (Linear Docs landing, Stripe quickstart) or essay content (Linear Method).

For claude-books: **adopt three-column as default**; drop the right rail on chapter intros and short essays; use whole-book TOC instead of per-page anchors when reading is intentionally sequential.

### 2. Content-type signaling: four schools

How sites tell readers "this is tutorial vs reference vs explanation" splits into four approaches:

1. **Explicit content-type pill badges on every page** — **Cloudflare** is the most rigorous implementation (Tutorial / How-to / Reference / Conceptual labels in sidebar and page header). Highest discipline cost.
2. **Top-nav pivots** — **Astro** (Tutorial / Guide / Reference / Ecosystem as top-level peers) and **React.dev** (Learn / Reference as a two-mode toggle). High-signal; works at moderate scale.
3. **URL-prefix separation** — **Vercel** (`/docs/` vs `/kb/`), **Anthropic** (`/docs/` vs `/docs/en/api/` vs `/cookbooks/`), **Linear** (docs vs method vs developers as separate domains). Low-cost, low-friction; relies on reader picking the URL.
4. **Page-template differentiation** — **Tailwind**: installation pages look different from utility-class reference pages, no badges, the template itself signals content type. Requires high consistency *within* each template.

Most production sites combine 2+ approaches. **Tailwind + URL-prefix** seems to be the sweet spot for moderate-scale docs; **Cloudflare's explicit badges** are best for multi-product portals where readers genuinely confuse content types.

For claude-books: **template differentiation by chapter type + URL-prefix by volume** is the right baseline. Volume boundaries do URL-level work; chapter templates (intro vs reference appendix vs case study) signal type within a volume.

### 3. Code + prose interleaving: density choices

Three patterns repeat:

- **Polyglot dump on one page** (Stripe) — every language sequentially on the same long page. Comprehensive but intimidating.
- **Language tabs above a single code block** (Tailwind, Vercel, Cloudflare, Anthropic) — pick your language, see one block. Modal but cleaner.
- **Per-language sub-pages, card-grid landing** (Resend) — 13 cards, one per language. Spreads the cognitive load.

The **language-tabs-above-block** model wins on signal-to-noise but requires editorial commitment to maintain parity across tabs. The **card-grid-of-quickstarts** is best when each language quickstart is short enough to fit on its own page.

For claude-books: language is a smaller axis than for general dev docs (Python + TypeScript SDKs dominate); tabs work. **Don't go Stripe-style polyglot.**

### 4. Callout vocabularies range from generic to bespoke

Three tiers visible:

- **Generic info/warning/danger triple** — Docusaurus (`:::note` / `:::tip` / `:::warning` / `:::danger` / `:::info`), Starlight (`<Aside type=...>`), Mintlify (`<Tip>` / `<Note>` / `<Warning>`). Common; readable but low signal.
- **MDN's distinctive yellow-bordered Note** — a single canonical callout style that's recognizable across the entire site. High signal because it's *one* style.
- **React.dev's rich callout taxonomy** — `<Note>`, `<Pitfall>` (red, common-bug warnings), `<DeepDive>` (collapsible optional content), `<Recipes>` (grouped examples), `<YouWillLearn>` (outcome list). Highest signal; highest implementation cost.

For claude-books: adopt **React.dev's rich vocabulary**. Specifically `<YouWillLearn>` at chapter open, `<DeepDive>` for advanced asides, `<Pitfall>` for common mistakes, plus a custom `<TryIt>` for hands-on Claude Code prompts.

### 5. Progressive disclosure via cross-references, not collapsibles

The pattern that recurs most: **don't collapse content; link to it.**

- **MDN** uses inline glossary cross-links — every technical term becomes a one-click definition lookup.
- **React.dev** links inline from Learn pages to Reference pages — keep the narrative clean, push details out of line.
- **Stripe** links sideways from "advanced integration" pages to "checkout sessions" recommendation pages — both stay first-class.

The exception: **React.dev's `<DeepDive>`** is genuinely collapsible (in-place) for content that's optional but contextual. This works because the surrounding prose makes sense without it.

For claude-books: **inline `[[slug]]` cross-references are already the cache convention**. Adopt for chapter body too. Use collapsibles sparingly (only React's `<DeepDive>` model — optional but contextual).

### 6. Numbered procedural steps for setup; feature-driven sections for reference

Sites split cleanly on procedural ordering:

- **Tailwind installation, Cloudflare get-started, React.dev quickstart** — explicit numbered steps ("01 Create your project / 02 Install / 03 Configure").
- **Stripe payments quickstart, MDN guide articles** — feature-driven H2 headers without explicit numbers, even on tutorial-shaped pages.
- **Reference pages everywhere** — never numbered; structured by API surface (Parameters / Returns / Caveats — React.dev) or by property (Tailwind utility pages).

For claude-books: number setup chapters explicitly; don't number conceptual chapters or reference appendices.

### 7. Search is non-negotiable at scale

Every site with more than ~50 pages has a global search. cmd-K palette is the universal modern pattern (Tailwind, Resend, Anthropic, Astro, Docusaurus default, React.dev). **Algolia DocSearch** is the dominant integration for OSS docs; commercial sites use whatever Mintlify / custom infra provides.

For claude-books web counterpart: ship cmd-K search day one.

### 8. AI-era patterns that are becoming standard

Three patterns appearing in 2024-2026 docs that didn't exist in 2020:

- **`llms.txt` / `llms-full.txt`** at site root — agent-readable site index. Visible on **Resend, Anthropic, Cloudflare**. Becoming table-stakes.
- **Dedicated "agent resources" pivot pages** — **Vercel** has `/docs/agent-resources` collecting AI-relevant docs in one place. **Stripe** embeds LLM-instruction comments inside otherwise-human pages.
- **Mintlify / Fern / Scalar** as platforms — commercial doc-as-a-service offerings have proliferated; the per-product Mintlify house style is now recognizable across **Resend** and **Anthropic** simultaneously.

For claude-books: ship `llms.txt` for any web counterpart; include an explicit "for agents reading this book" pivot page in Volume 1.

## Recommended for claude-books (shortlist)

If forced to pick **5 most-borrowable patterns** for claude-books v1:

1. **React.dev's two-mode Learn/Reference pivot** — clean Diátaxis reduction; visually different chrome per mode. Map to volumes: Volume 1 = Learn-mode (narrative), Volume 3 = Reference-mode (lookup), Volume 2 sits in between as how-to.
2. **Tailwind's distinct page templates by content type** — installation chapters look different from concept chapters look different from reference appendices, no badges needed.
3. **React.dev's rich callout vocabulary** — `<YouWillLearn>`, `<DeepDive>`, `<Pitfall>`, `<Recipes>` (or claude-books equivalents like `<TryIt>` for hands-on prompts). Stop using generic info/warning/danger.
4. **MDN's inline glossary cross-links** + the existing `[[slug]]` cache convention extended into chapter prose. Lean narrative; definitions one click away.
5. **Cloudflare's question-based troubleshooting collapsibles** at chapter end ("Seeing X error? / Skill not loading? / Hook not firing?") — scannable problem-solution pairs.

Plus three structural choices:

6. **Linear Method's whole-book TOC as right rail** instead of per-page "in this article" — signals sequential read, gives readers their place in the larger arc.
7. **Diátaxis compass diagram on every chapter opener** — visual cue for "you are in tutorial-mode / reference-mode / etc."
8. **`llms.txt` + dedicated "for agents reading this book" pivot page** — claude-books is *about* AI agents; the book itself should be agent-discoverable.

## Open questions / follow-ups

- **Implementation generator choice**: Mintlify (commercial, polished components, Anthropic+Resend lineage) vs Astro Starlight (OSS, customizable, Astro lineage) vs custom MDX (Vercel/React.dev model). Each has tradeoffs not resolved here.
- **Versioning policy**: if claude-books v2 ships in 12 months, what happens to v1? Docusaurus's versioned-sidebar model is well-known but expensive. Could volumes themselves be the versioning surface (Volume 1 = first edition, sub-released as content corrections).
- **Illustration investment**: React.dev's cartoon illustrations are a major differentiator. claude-books could match this for "agent loop" / "context window" / "tool use" diagrams — but it's a sustained design commitment.
- **Search infrastructure**: Algolia DocSearch is free for OSS docs but claude-books is unclear-license; may need paid Algolia or alternative (Pagefind, Meilisearch, Orama).

## Provenance

- **Captured**: 2026-05-23 via WebFetch (primary) — all 14 surfaces were reachable without authentication. No Playwright fallback needed.
- **Method**: per-site prompt asking for IA, layout, code/prose interleaving, supplementary material, progressive disclosure, visual hierarchy, content-type differentiation. Cross-site synthesis done after all 14 notes were drafted.
- **Tier**: T3-practitioner for all (third-party production sites).
- **Refresh policy**: `volatility: evolving` for most (sites iterate); `stable` for MDN, Diátaxis, Linear Method (mature/canonical). Re-verify before citing if `last_verified_at` > 90 days.
