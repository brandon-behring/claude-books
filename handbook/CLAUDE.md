# handbook — AI authoring guide

This book is built with `@brandon_m_behring/book-scaffold-astro` (tools profile, currently v4.2.0; v4 BREAKING `defineStyle` API in use — `astro.config.mjs` passes `styles: [toolsStyle]`). It's the practitioner volume of the three-book series — the "how to *use* Claude effectively" angle.

**Status**: v1.0 outline complete — see [`OUTLINE.md`](./OUTLINE.md) for the 15-chapter structure, source→target mapping, and per-chapter trim decisions. Chapter rewrites have not yet started. The existing `src/content/chapters/ch01-principles.mdx` is a Phase 0 smoke test and will be rewritten when Phase 1 Step 2 begins.

**Where things live**:

- Chapters: `src/content/chapters/*.mdx`
- Components, layouts, default routes: `@brandon_m_behring/book-scaffold-astro/components/...`
- Custom consumer components (BeforeAfter, DecisionBox, MaturityLevel): `src/components/`
- Style customizations: `src/styles/` (overrides package styles)
- Bibliography source: `sources/manifest.yaml` (currently empty — populated per chapter as citations land) → `src/data/references.json` via `npm run build:bib`
- Cross-references: ids on labeled components → `src/data/labels.json` via `npm run build:labels`
- Outline + per-chapter rationale: [`OUTLINE.md`](./OUTLINE.md)

## Frontmatter conventions (per `OUTLINE.md`)

Every chapter MDX file uses this frontmatter shape:

```yaml
title: <Chapter title>
chapter: <numeric, e.g. 5>
part: <numeric: 1=Foundations, 2=Personal Practice, 3=Scaling & Craft, 4=Team & Enterprise>
volatility: stable-principle | evolving | fast-moving
last_updated: YYYY-MM-DD
introduced_in_version: <semver string, e.g. "1.0.0">
cert_domains: [<int subset of 1..5>]   # which cert domains this chapter touches
tools_compared: [claude-code]           # tools schema field
description: <one-line meta description for SEO/social>
```

`volatility` drives the staleness banner: `fast-moving` + `last_updated > 90d` → banner renders. Chapter 15 (Enterprise Deployment) is the canonical `fast-moving` example because of pricing/cert/auth changes.

## Cert-domain mapping

Each chapter declares `cert_domains` in frontmatter (a subset of `[1, 2, 3, 4, 5]`). The full domain × task-area × book/chapter ownership matrix lives at `../docs/cert-coverage.md`. The handbook is primary owner of **Domain 3** (Claude Code Configuration & Workflows) and shares Domain 4 + Domain 5.

## Toolkit reference + filing gaps

[PACKAGE_DESIGN.md](https://github.com/brandon-behring/book-scaffold-astro/blob/v3.0/PACKAGE_DESIGN.md) is the single source of truth for the scaffold API.

When you hit a gap or friction in the scaffold while authoring:
1. Log it in `../docs/scaffold-gaps.md` (one row).
2. File the upstream issue at https://github.com/brandon-behring/book-scaffold-astro/issues with label `consumer:claude-books`.
3. Update the gap log's "Filed?" column with the issue link.

`../docs/scaffold-gaps.md` has the historical examples (5 gaps filed during Phase 0).
