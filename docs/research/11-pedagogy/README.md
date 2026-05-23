# Topic 11 — Visual pedagogy + multi-format content design

The research foundation for `handbook/PEDAGOGY.md` and the handbook's chapter-rewrite conventions. Sprint executed 2026-05-23 across 4 parallel sub-area agents.

**Stats**: 38 source notes + 4 sub-topic READMEs across 4 nested directories. All notes follow the standard cache template (per-source frontmatter, citation-ready quotes with Anchor lines, `[[slug]]` cross-references).

## Sub-topics

| # | Sub-topic | Dir | Notes | Tier mix |
|---|---|---|---|---|
| 01 | Production technical-doc UX patterns | [01-doc-ux-patterns/](./01-doc-ux-patterns/) | 14 (Stripe, Linear, Vercel, Resend, Anthropic, Astro, MDN, MS Learn, Tailwind, React.dev, Diátaxis, Cloudflare, Docusaurus) | All T3 (third-party production sites) |
| 02 | Information design + IA literature | [02-information-design/](./02-information-design/) | 10 (Tufte ×2, NN/g ×3, Wurman, Krug, Boulton, CLT + Hick's, Diátaxis framework) | All T1 (foundational primary sources) |
| 03 | Multimedia learning + pedagogy theory | [03-multimedia-learning/](./03-multimedia-learning/) | 7 (Mayer, Sweller, Paivio, Bjork, Bruner, Bloom, Miller/Cowan) | All T1 (academic primary sources) |
| 04 | Established handbook-genre examples | [04-handbook-genre/](./04-handbook-genre/) | 7 (Pragmatic Programmer, Effective-* series, DDIA, SICP, CS:APP, Skiena, Refactoring) | T2/T3 (publisher metadata + practitioner reviews) |

## Headline findings (synthesized across sub-topics)

Each sub-topic README has its own detailed synthesis. The cross-cutting finds — those that show up in 3+ sub-areas independently — are:

1. **Big picture, then drill down — but the macro is the same content compressed** (Tufte micro/macro + Krug satisficing + NN/g F-pattern + Stripe quickstart-first IA + Effective-* item recap)
2. **Two-level disclosure max** (NN/g formal two-level + Sweller working-memory bound + React.dev DeepDive)
3. **Template differentiation by content type beats content-type labels** (Tailwind page templates + React.dev two-mode pivot + Refactoring uniform recipe template ≫ Cloudflare's explicit content-type pill badges)
4. **Rich callout vocabulary used sparingly** (React.dev's `<Pitfall>` / `<DeepDive>` / etc. > Docusaurus generic info/warn/danger)
5. **Worked examples + retrieval prompts > prose summaries** (Sweller worked-example effect + Bjork desirable difficulties + CS:APP two-tier exercises)
6. **Parallel structure / small multiples** (Tufte + Effective-* item template + Refactoring recipe template + the cache's own frontmatter convention)
7. **`llms.txt` + agent-readable IA is becoming standard** (Resend + Vercel + Anthropic + Cloudflare; 2024-2026 emergence)

See `handbook/PEDAGOGY.md` for the full pedagogical synthesis and the 14-item adoption shortlist.

## How the books consume this topic

- **Handbook** (Volume 1): uses principles 1 (macro→micro), 4 (template differentiation), 5 (worked examples + retrieval prompts), 6 (parallel structure across chapters). PEDAGOGY.md is the canonical interpretation.
- **Architect's Reference** (Volume 2): inherits the same principles; emphasizes Refactoring's uniform per-recipe template + Effective-series imperative item titles.
- **Field-Guide** (Volume 3): inherits; emphasizes Diátaxis "how-to" mode discipline + War Story sidebars (Skiena pattern).

## Open questions for this topic

- **Mintlify vs Astro Starlight vs custom MDX**: implementation generator choice unresolved. Each has tradeoffs noted in [[../01-doc-ux-patterns/site-resend-docs]] (Mintlify), [[../01-doc-ux-patterns/site-astro-docs]] (Starlight), [[../01-doc-ux-patterns/site-react-dev]] (custom MDX).
- **Versioning policy**: if claude-books v2 ships in 12 months, what happens to v1? Volume boundary as a soft versioning surface is the current hypothesis.
- **Illustration investment**: React.dev's cartoon style is a major differentiator. claude-books could match for "agent loop" / "context window" / "tool use" diagrams — but it's a sustained design commitment. Defer to v1.5+.
- **Search infrastructure**: Algolia DocSearch is free for OSS docs but claude-books license is undecided; may need Pagefind / Meilisearch / Orama as alternatives. Already in the project roadmap's Phase 1.5 open questions.
- **Specific docs-IA practitioner authors** (Andrew Etter's _Modern Technical Writing_, Tom Johnson's _I'd Rather Be Writing_) were not captured — Diátaxis is the dominant modern framework but practitioner-level treatments exist.

## Sprint log

- **2026-05-23**: Initial dossier — 4 parallel agents (one per sub-area), each capped at ~25 tool calls per `references/agent_discipline.md`. Total ~95 tool calls. No agent crashes; no Playwright fallback needed. All 38 notes lint clean.

## Cross-references

- `handbook/PEDAGOGY.md` — the canonical synthesis. Cites this topic extensively.
- `~/Claude/research_toolkit/references/agent_discipline.md` — the discipline this sprint followed (per-agent tool-call caps, parallel-wave dispatch).
- `docs/research/README.md` — master index. Topic 11 added 2026-05-23.
