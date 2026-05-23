---
source_url: https://docusaurus.io/showcase
canonical_url: https://docusaurus.io/showcase
source_title: "Docusaurus Showcase"
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

# Docusaurus Showcase — UX + visual presentation patterns

## Site context
- Docusaurus is Meta's open-source documentation site generator (React-based, static-site-generated). The showcase at `docusaurus.io/showcase` catalogs 274 production sites using Docusaurus — a representative cross-section of the "Docusaurus look" that dominates open-source doc sites circa 2020-2026.
- Meta-relevant: the dominant open-source competitor to Astro's Starlight (see [[site-astro-docs]]) and to commercial Mintlify (see [[site-anthropic-docs]] and [[site-resend-docs]]). Understanding what Docusaurus ships by default tells you what "default modern docs look" expectations are.

## Layout + IA observations (default Docusaurus pattern)
- **Three-column layout** is the Docusaurus default: top nav, left sidebar (collapsible hierarchical doc tree), main content column, right table-of-contents auto-generated from headings.
- Top nav typically includes: logo, "Docs" link, "Blog" link, version dropdown (e.g., "3.10.1"), language selector, GitHub link, dark-mode toggle.
- **Breadcrumb** on each doc page.
- **Search** via Algolia DocSearch is the canonical integration — free for open-source projects, available with cmd-K palette.
- **Edit this page** link at the bottom of each article — community-contribution affordance.
- Responsive collapse: left sidebar becomes a hamburger drawer; right TOC stacks or hides on mobile.

## Showcase categorization
- Sites are tagged across 10 categories: **Favorite / Open-Source / Product / Design / I18n / Versioning / Large / Meta / Personal / RTL Direction**. This taxonomy itself tells you what dimensions matter for a doc site's identity: source/audience (Open-Source/Product/Personal), differentiator (Design/I18n/Versioning), Meta/non-Meta lineage, RTL support.
- Featured "Favorites" section highlights sites the Docusaurus team curate as best-in-class — currently includes Algolia DocSearch, Ionic, Jest, React Native, Hasura, WebdriverIO.

## Common patterns across showcased sites
- **Versioning dropdown** in top nav for products that ship multiple supported versions (Jest, React Native).
- **Multi-language picker** for projects with i18n (about 30 of the 274 use i18n).
- **Algolia DocSearch** is near-universal — instant fuzzy search across headings, content, and section context.
- **Dark mode toggle** is default-on in the Docusaurus shipped theme.
- **Versioned sidebar nav** — same product, different sidebar tree per version.
- **Custom CSS theming** is the main differentiator between Docusaurus sites — site identity comes from typography choices, accent colors, and hero design rather than IA structure.

## Code + prose interleaving (default)
- Code blocks use Prism syntax highlighting.
- Tabs primitive for language/framework variants (`<Tabs>` / `<TabItem>`) is shipped MDX-level.
- Line highlighting via fence metadata (` ```js {3-5}`).
- Inline code with backticks.

## Multi-format coexistence pattern
- Docusaurus structures content as "Docs" (versioned, sidebar-organized) vs "Blog" (chronological, tag-organized) vs "Pages" (custom). Each has a different URL prefix and different chrome.
- Within "Docs", content types are not visually badged by default — IA does the work via sidebar grouping.
- Plugins exist for extra surfaces (`@docusaurus/plugin-content-blog`, `@docusaurus/plugin-content-pages`) — but the core triple covers most sites.

## Visual hierarchy techniques (default)
- Default theme uses Inter for body, JetBrains Mono for code. Many sites override.
- Restrained palette: white/dark background, single accent color from CSS variable `--ifm-color-primary`.
- Generous whitespace; standard "modern docs" aesthetic.
- Admonitions (`:::note`, `:::tip`, `:::warning`, `:::danger`, `:::info`) get distinct colored left borders + icon — same vocabulary as Astro Starlight's `<Aside>` and roughly the same as Mintlify's `<Tip>` / `<Note>` / `<Warning>`.

## What's worth borrowing for claude-books
- **The default three-column layout (left sidebar / main / right TOC) is the modern docs baseline.** If claude-books builds a web counterpart, this is what readers will expect — deviate intentionally, not by default.
- **Algolia DocSearch (or alternative) integration is non-negotiable** at any meaningful scale. Books with web counterparts need cmd-K search.
- **Versioning is a built-in concern for living references.** If claude-books v2 ships in a year, the v1 content shouldn't disappear; readers searching old chapters need them findable. Docusaurus's versioned-sidebar-nav model is the right primitive.
- **Edit-this-page links** at chapter footers signal "this is a living document; corrections welcome." Even if the book is closed-PR, the link can point to GitHub Issues for typo reports.
- The Docusaurus showcase categorization (Favorite / Product / Open-Source / Design / I18n / Versioning / Large / Meta / Personal / RTL Direction) is a useful checklist for evaluating any docs implementation.

## What to avoid
- Default Docusaurus looks generic — too many sites use it with minimal customization and they all look the same. A book aiming for editorial voice needs significant theme customization or a different generator (e.g., Astro Starlight, Mintlify, custom).
- Versioning is expensive to maintain — content has to be duplicated and kept consistent across versions. Books should think hard about whether they're truly versioned (each volume = an edition?) before committing.
- The "Blog" surface in Docusaurus is chronological by default; books are sequential. Don't reuse the Blog plugin for chapter pages.

## Quoted (citation-ready)

> "The best search experience for docs, integrates in minutes, for free"
>
> — Docusaurus Showcase, Algolia DocSearch site card
>
> Anchor: `Algolia DocSearch site card + The best search experience for docs`

> "Favorite / Open-Source / Product / Design / I18n / Versioning / Large / Meta / Personal / RTL Direction"
>
> — Docusaurus Showcase, category tags taxonomy
>
> Anchor: `category tags taxonomy + Favorite Open-Source Product Design`

## Cross-references
- See [[site-astro-docs]] for the main open-source competitor (Astro's Starlight theme).
- See [[site-anthropic-docs]] for Mintlify, the main commercial competitor.
- See [[site-react-dev]] for an example of "custom theme built specifically for React, ignoring generic generator defaults" — a useful contrast.
- See the topic README for the cross-site synthesis.
