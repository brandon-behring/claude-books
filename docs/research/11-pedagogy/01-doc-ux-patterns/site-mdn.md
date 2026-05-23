---
source_url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction
canonical_url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction
source_title: "MDN Web Docs — JavaScript Guide Introduction"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: pedagogy-doc-ux
tier: T3-practitioner
cert_domains: []
cert_task_areas: []
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# MDN Web Docs — UX + visual presentation patterns

## Site context
- MDN Web Docs at `developer.mozilla.org`. The canonical reference for web platform APIs (HTML, CSS, JS, Web APIs, HTTP, Accessibility, plus Learn/Tutorials). Audience: web developers at every level; scale: tens of thousands of pages, dozens of locales, multi-decade content lineage.
- The de facto largest professionally-maintained technical reference on the web. Useful as a study not because it's beautiful (it isn't, especially) but because it's **at scale** — patterns survive only if they actually work for tens of millions of monthly readers.

## Layout + IA observations
- Three-column layout: left sidebar (per-section navigation tree, e.g., all 19+ chapters of the JS Guide), wide center content, right "In this article" anchor TOC.
- Breadcrumb at the top: "Web > JavaScript > Guide > Introduction" — strong wayfinding because the IA goes 4-5 levels deep.
- Top nav splits by domain (HTML / CSS / JavaScript / Web APIs / Learn / Tools / etc.) — content-type-flavored but more like "platform area" than Diátaxis quadrants.
- Search top-right, sticky.
- Previous/Next links **at top and bottom** of every guide article — strong signal that MDN's Guide content is read sequentially when followed, despite individual pages also working as reference.
- Sidebar shows current page italicized for state awareness.

## Code + prose interleaving
- Prose-first introduction sections; code arrives later in the article, not above the fold.
- Code blocks use language tag (`js`) and basic syntax highlighting. No tabs for package managers or language switching — MDN documents *the language*, not multi-platform integrations.
- Inline code with backticks for terms (`Array`, `console.log`, `eval`).
- Browser compatibility tables ("BCD" — Browser Compat Data) appear on API reference pages as a structured matrix of browser × version × support — distinctive MDN signature visible nowhere else.

## Multi-format coexistence pattern
- MDN partitions content surfaces by URL path: `/docs/Web/JavaScript/Guide/` (sequential guide / tutorial), `/docs/Web/JavaScript/Reference/` (API reference), `/docs/Learn/` (introductory tutorials), `/docs/Glossary/` (term definitions). Visual chrome is consistent across all four, but the sidebar trees are content-type-shaped.
- Inline glossary links are a strong MDN pattern: any technical term has a one-click definition link to `/docs/Glossary/...`. This is "progressive disclosure via cross-references" — keep the prose lean, push definitions out of line.
- Comparison tables (e.g., the famous "JavaScript and Java" table) compare two related concepts side-by-side — useful for disambiguation pages.

## Visual hierarchy techniques
- Header hierarchy goes H1 → H2 → H3 → H4 with consistent type scale; H2 sections are large enough that "In this article" rail is a strong reading aid for long articles.
- Yellow-bordered "Note" boxes are the canonical MDN callout (yellow left border, light background, "Note:" prefix). Distinct from warnings (red), tips (blue).
- Tables (comparison + browser-compat) are heavily styled with bordered cells and consistent column widths.
- Whitespace is *not* generous — MDN packs information densely; you can fit a lot of reference material above the fold. The opposite end of the spectrum from Linear Method.
- Footer carries last-modified date + GitHub edit link + "Report a problem with this content" — community-contribution affordances are first-class.

## What's worth borrowing for claude-books
- **Breadcrumbs are non-optional at scale.** Any book chapter that nests beyond 2 levels deep needs them.
- **Previous/Next at top and bottom** of articles is the right pattern for a book read sequentially. Save readers from scrolling to the end to navigate forward.
- **Inline glossary cross-links** are the cleanest "progressive disclosure" pattern in any of the sites studied — keeping definitions out of prose while making them one click away. The book should have a top-level glossary using the same double-bracket slug convention as this research cache.
- **"In this article" sidebar** on long chapters is important once content exceeds ~3 H2 sections. Use the right rail.
- Comparison tables for disambiguation (e.g., "Skill vs Subagent vs MCP Server" — three things readers conflate) are a great chapter-opener device.
- **Last-modified + edit link + report-problem** in the footer of every page is a contribution-affordance pattern worth carrying into the book repo.

## What to avoid
- MDN's density makes it intimidating for newcomers — the JS Guide intro is 8+ H2 sections before the first code block. Books should arrive at code faster.
- The yellow Note box has been used on so many pages that it's effectively part of the background — when everything is highlighted, nothing is. Books should use callouts sparingly.
- Browser compat tables are MDN-specific; no analog in a book about Claude Code unless similarly structured "matrix" reference fits (e.g., Skill × runtime support matrix).

## Quoted (citation-ready)

> "This guide assumes you have the following basic background: A general understanding of the Internet... Good working knowledge of HyperText Markup Language... Some programming experience..."
>
> — MDN, JavaScript Guide / Introduction / What you should already know
>
> Anchor: `What you should already know + This guide assumes you have the following basic background`

> "This page was last modified on Jul 19, 2025 by MDN contributors."
>
> — MDN, JavaScript Guide / Introduction / footer
>
> Anchor: `footer + This page was last modified`

## Cross-references
- See [[site-microsoft-learn]] for a comparable scale of reference content (enterprise-scoped).
- See [[site-diataxis]] for the framework MDN partly approximates (Guide / Reference split).
- See [[site-react-dev]] for an example of "what newer reference docs took from MDN and improved on" (inline glossary, comparison tables, kept the Previous/Next pattern).
- See the topic README for the cross-site synthesis.
