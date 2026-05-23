---
source_url: https://linear.app/docs
canonical_url: https://linear.app/docs
source_title: "Linear Docs"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-doc-ux
tier: T3-practitioner
cert_domains: []
cert_task_areas: []
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Linear Docs — UX + visual presentation patterns

## Site context
- Linear's product documentation for the issue-tracking app. Audience: product / engineering teams using the Linear web + desktop apps. Reputation: opinionated minimalism with strong typographic restraint; widely cited as a benchmark for "the docs look like the product".
- The docs site is one of three Linear knowledge surfaces — alongside `linear.app/method` (philosophy/manifesto, distinct UX — see [[site-linear-method]]) and `developers.linear.app` (API reference). Each surface adopts a different visual register.

## Layout + IA observations
- Two-column layout: persistent left sidebar with primary categories (Getting started, Account, AI, Teams, Issues, Projects, etc.) and a wide main content area. No right "in this article" rail on the landing — content is short enough not to need one.
- Top navigation is sparse: Linear logo, "Docs" wordmark, sign-up / open-app CTAs. No mega-menu. Secondary nav layer surfaces Developers / Learn / Contact support as flat siblings rather than nested under a hamburger.
- Landing-page IA is **card-grid driven**, not tree-driven. Primary surface uses card components grouped under titled sections like "Popular" and "Linear basics". Each card carries a title, brief description, and click target.
- Breadcrumb appears (e.g., "Home"), but the visual weight is minimal — single chevron, gray text.

## Code + prose interleaving
- Largely irrelevant on the main docs surface — Linear's product docs are end-user-facing, not developer-facing, so code samples are rare. When code does appear (API webhooks, automation), it's syntax-highlighted in a separate fenced block, not the side-by-side panel style.
- Developer API documentation lives on `developers.linear.app` and uses a different visual treatment closer to standard GraphQL playgrounds.

## Multi-format coexistence pattern
- Card components treat tutorials ("Start Guide") and reference ("Workflows", "Notifications") with identical chrome — visual unity over visual differentiation. Distinction relies on the card's text content, not its style.
- Linear's broader knowledge ecosystem separates content types **by domain** rather than by visual badging: tutorials and changelog on `linear.app/docs`, philosophy on `linear.app/method`, API on `developers.linear.app`. The surface itself does the differentiation work.

## Visual hierarchy techniques
- Typography stratification: large display heading for "Linear Docs", sub-headings in small caps or muted weight for section grouping ("Popular", "Linear basics").
- Restrained color palette: high-contrast text on neutral background, minimal accent color (Linear's purple appears in CTAs but not as content emphasis).
- Generous whitespace between card groups; cards themselves are bordered/separated by subtle line weight rather than heavy fills.
- Icons appear within cards but are deliberately subdued — they signal section rather than draw attention.

## What's worth borrowing for claude-books
- The "two-column with no right rail by default" pattern is appropriate for chapter pages that aren't deeply technical. A book chapter on philosophy / theory (e.g., "what is an agent loop" framing) can drop the TOC rail entirely and let the prose breathe.
- Card-grid landing pages work as chapter-index surfaces — each volume's TOC could render as cards instead of a literal numbered list, especially the introductory volumes that don't have heavy code.
- Visual unity across content types (cards look the same whether they link to tutorial or reference) is a useful contrast to the explicit badging pattern (see [[site-cloudflare-docs]]) — both are defensible. For a book where readers move sequentially, unity is the safer default.

## What to avoid
- Linear's minimalism only works because the underlying product has aggressive feature naming (Cycles, Triage, Projects, Initiatives) that already carries semantic load. For claude-books, where chapter content is fundamentally explanatory, drop too much chrome and the page reads as a wireframe.
- The "no breadcrumb depth" choice depends on shallow hierarchy — Linear has maybe two clicks to anywhere. A multi-volume book with sub-chapters needs more wayfinding than Linear's landing model affords.

## Quoted (citation-ready)

> "Linear Docs — Get an overview of Linear's features and how to use them."
>
> — Linear Docs, landing hero
>
> Anchor: `landing hero + Get an overview of Linear's features`

> "Popular"
>
> — Linear Docs, primary card-grid section header
>
> Anchor: `primary card-grid section header + Popular`

## Cross-references
- See [[site-linear-method]] for the same company's manifesto-style content surface — same restraint, very different chrome.
- See [[site-cloudflare-docs]] for the opposite IA choice (explicit content-type badges on every card).
- See [[README]] for the cross-site synthesis.
