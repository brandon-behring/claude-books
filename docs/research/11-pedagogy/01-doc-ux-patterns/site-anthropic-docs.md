---
source_url: https://platform.claude.com/docs/en/welcome
canonical_url: https://platform.claude.com/docs/en/welcome
source_title: "Anthropic Claude Docs"
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

# Anthropic Claude Docs — UX + visual presentation patterns

## Site context
- Anthropic's developer documentation, served from `platform.claude.com/docs/` (the older `docs.claude.com` 302-redirects here as of 2026-05). Audience: Claude API consumers, Claude Code users, Managed Agents customers. Scale and visual register sit between Stripe (denser code) and Linear (more restrained chrome).
- Built on **Mintlify** — visible in the MDX-component syntax used in pages (`<Tip>`, `<Note>`, `<Steps>`, `<Step>`, `<CardGroup>`, `<Card>`). This makes it a same-platform cousin to Resend (see [[site-resend-docs]]).
- Two related URL pivots: `code.claude.com/docs/` for Claude Code product docs and `claude.com/docs/en/api/` for API reference. The IA splits product surfaces by URL prefix.

## Layout + IA observations
- Three-column layout on most pages: left sidebar (collapsible product/topic tree), wide center prose + Mintlify components, right "On this page" anchor list.
- Top nav includes section pivots (Docs / API Reference / Cookbook / Help Center) and a global search. Cmd-K search palette is standard.
- Landing page uses Mintlify's `<CardGroup cols={2|3}>` to render feature/capability cards with icons — "Developer Console / API Reference / Claude Cookbook" as a 3-up grid, then "Text and code generation / Vision" as a 2-up.
- Recommended-path section uses Mintlify's `<Steps>` + `<Step title="...">` components — gives an explicit numbered onboarding ladder ("1. Make your first API call → 2. Understand the Messages API → 3. Choose the right model → 4. Explore features and tools").
- Comparison table at the top contrasts "Messages API vs Claude Managed Agents" with three rows ("What it is / Best for / Learn more"). Tables-as-routing surface is a Mintlify-friendly pattern.

## Code + prose interleaving
- Per-feature docs interleave code samples (Python, Node/TS, curl) in syntax-highlighted blocks with language tabs. Examples are intentionally short — not the Stripe-style polyglot dump.
- Cookbook lives separately as Jupyter notebooks at `platform.claude.com/cookbooks` — heavier code lives there, freeing docs to stay concept-leaning.
- API reference uses a request/response schema layout typical of OpenAPI-rendered docs.

## Multi-format coexistence pattern
- Hard URL-prefix separation for content types: `/docs/` (conceptual + how-to) vs `/docs/en/api/` (reference) vs `/cookbooks/` (tutorials/recipes) vs `/code.claude.com/docs/` (Claude Code product). Each gets its own sidebar tree.
- Within `/docs/`, Mintlify components do the badging — `<Tip>`, `<Note>`, `<Warning>` carry distinct color treatments (green/blue/yellow respectively in Mintlify's default theme). These are the closest thing to Diátaxis-style content badges.
- `<Steps>` blocks are visually distinct from prose — boxed ladder with numbered ovals — and signal "do this in order".

## Visual hierarchy techniques
- Mintlify house style: muted background, generous whitespace, subtle borders on components. Cards have soft shadows; callouts have left-border color stripes (green for Tip, blue for Note).
- Icons inline with cards (`icon="computer"`, `icon="code"`, `icon="chef-hat"`) — Lucide-ish icon set rendered consistently.
- Typography is sans-serif throughout; no serif for "book-like" registers (compare [[site-linear-method]] which goes serif for essay content).
- Horizontal rules between sections (`---`) create breathable section boundaries.

## What's worth borrowing for claude-books
- The Mintlify `<Steps>` component is a great primitive for the book — onboarding paths and "do these things in order" walkthroughs benefit from the visual numbered-ladder treatment.
- `<CardGroup>` + `<Card>` is the right primitive for chapter-index pages and "what's next" closers. The 2-col/3-col adaptive layout works at any screen width.
- The "comparison table at the top of a routing page" pattern (Messages API vs Managed Agents) is a clean way to disambiguate product paths early without prose digression.
- URL-prefix separation by content type is the same pattern Vercel uses — see [[site-vercel-docs]]. For claude-books, this maps to volume separation.

## What to avoid
- The Mintlify default cards can feel uniform across the site — "every section looks like every other section". Books need to vary visual register between chapters to signal narrative shifts. Drop into a different layout register at major chapter boundaries.
- The `<Tip>` callout pattern is overused on some Anthropic docs pages — when every paragraph has a Tip above it, the callout loses signal. Use sparingly.
- The "Looking to chat with Claude? Visit claude.ai" Note is a product-marketing escape hatch that's appropriate for product docs but doesn't transfer to a book.

## Quoted (citation-ready)

> "Claude is a highly performant, trustworthy, and intelligent AI platform built by Anthropic. Claude excels at tasks involving language, reasoning, analysis, coding, and more."
>
> — Anthropic Docs, Welcome page intro
>
> Anchor: `Welcome page intro + Claude is a highly performant`

> "Anthropic offers two ways to build with Claude, each suited to different use cases."
>
> — Anthropic Docs, comparison table preamble
>
> Anchor: `comparison table preamble + Anthropic offers two ways to build`

> "Follow these steps to go from zero to a working Claude integration."
>
> — Anthropic Docs, Recommended path for new developers section header
>
> Anchor: `Recommended path for new developers + Follow these steps to go from zero`

## Cross-references
- See [[site-resend-docs]] for another Mintlify-built site applying the same primitives.
- See [[site-stripe-docs]] for the contrasting "polyglot code dump" approach to multi-language support.
- See [[site-cloudflare-docs]] for an alternative Diátaxis-leaning content-type badging system.
- See [[README]] for the cross-site synthesis.
