# handbook — AI authoring guide

This book is built with `@brandon_m_behring/book-scaffold-astro` (tools profile, currently v4.25.0; v4 BREAKING `defineStyle` API in use — `astro.config.mjs` passes `styles: [toolsStyle]`). It's the practitioner **Use** volume of the claude-books series — the "how to *use* Claude effectively" angle.

**Status**: Part I prose complete (ch01–04 shipped); **Ch 6 ported as the Parts II–IV pilot** (2026-06-18, tutorial-first — see [`docs/port-recipe.md`](./docs/port-recipe.md)); ch05, 07–15 pending — see [`OUTLINE.md`](./OUTLINE.md) for the 15-chapter structure, source→target mapping, and per-chapter trim decisions.

**Where things live**:

- Chapters: `src/content/chapters/*.mdx`
- Components, layouts, default routes: `@brandon_m_behring/book-scaffold-astro/components/...`
- Custom consumer components (BeforeAfter, DecisionBox, MaturityLevel): `src/components/`
- Style customizations: `src/styles/` (overrides package styles)
- Bibliography source: `sources/manifest.yaml` (currently empty — populated per chapter as citations land) → `src/data/references.json` via `npm run build:bib`
- Cross-references: ids on labeled components → `src/data/labels.json` via `npm run build:labels`
- Outline + per-chapter rationale: [`OUTLINE.md`](./OUTLINE.md)

**Workspace-level conventions** (apply across handbook + architect-reference + agentic-systems-design):

- [`../AUTHORS.md`](../AUTHORS.md) — AI-collaboration scope + out-of-scope HITL disciplines
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — PR routing + issue routing + upstream-label policy + round-closeout discipline
- [`../LICENSE`](../LICENSE) (CC BY 4.0, content) + [`../LICENSE-SCRIPTS`](../LICENSE-SCRIPTS) (MIT, scripts). TikZ figure sources are content (CC BY 4.0), not scripts.

**Design docs** (in-repo, date-prefixed superseded chain — per `docs/guides-recon.md` §9):

- [`../docs/design/2026-05-22_initial-bootstrap.md`](../docs/design/2026-05-22_initial-bootstrap.md) — initial bootstrap (the three-volume-era scoping, decisions, cert ecosystem, Phase 0 → 5+, cross-cutting concerns)
- [`../docs/design/2026-05-23_visual-pedagogy.md`](../docs/design/2026-05-23_visual-pedagogy.md) — theoretical rationale for PEDAGOGY decisions (Bruner / Bjork / Mayer / Sweller / Miller-Cowan; companion to [`PEDAGOGY.md`](./PEDAGOGY.md) which holds the decisions + author-facing rules)
- [`../docs/guides-recon.md`](../docs/guides-recon.md) — 13-category comparative analysis of `~/guides/` patterns; drives ongoing adoption rounds

**Style guide**: [`./docs/style-guide.md`](./docs/style-guide.md) — author-facing rules derived from PEDAGOGY decisions + LaTeX-era lint rules.

## Frontmatter conventions (per `OUTLINE.md`)

Every chapter MDX file uses this frontmatter shape:

```yaml
title: <Chapter title>
chapter: <numeric, e.g. 5>
part: <numeric: 1=Foundations, 2=Personal Practice, 3=Scaling & Craft, 4=Team & Enterprise>
volatility: stable-principle | architectural-pattern | feature-surface
last_updated: YYYY-MM-DD
introduced_in_version: <semver string, e.g. "1.0.0">
cert_domains: [<int subset of 1..5>]   # which cert domains this chapter touches
tools_compared: [claude-code]           # tools schema field
description: <one-line meta description for SEO/social>
```

`volatility` drives the staleness banner: the scaffold (`src/lib/freshness.ts`) maps each class to a freshness threshold against `last_verified` — `feature-surface` = 90 days (shortest), `architectural-pattern` = 180, `stable-principle` = 365. `feature-surface` **is** the "fast-moving" tier (the enum has no `fast-moving` or `evolving` value — those names are retired). Chapter 16 (Enterprise Deployment) is the canonical `feature-surface` example, because of pricing/cert/auth changes.

## Cert-domain mapping

Each chapter declares `cert_domains` in frontmatter (a subset of `[1, 2, 3, 4, 5]`). The full domain × task-area × book/chapter ownership matrix lives at `../docs/cert-coverage.md`. The handbook is primary owner of **Domain 3** (Claude Code Configuration & Workflows) and shares Domain 4 + Domain 5.

## Toolkit reference + filing gaps

[PACKAGE_DESIGN.md](https://github.com/brandon-behring/book-scaffold-astro/blob/v3.0/PACKAGE_DESIGN.md) is the single source of truth for the scaffold API.

When you hit a gap or friction in the scaffold while authoring:
1. Log it in `../docs/scaffold-gaps.md` (one row).
2. File the upstream issue at https://github.com/brandon-behring/book-scaffold-astro/issues with label `consumer:claude-books`.
3. Update the gap log's "Filed?" column with the issue link.

`../docs/scaffold-gaps.md` has the historical examples (5 gaps filed during Phase 0).
