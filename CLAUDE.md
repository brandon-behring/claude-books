# claude-books — working conventions

A three-volume series + shared glossary. Each book covers Claude from a different angle:

- **handbook/** — how to *use* Claude effectively
- **architect-reference/** — how to *design* Claude-powered systems (Agent SDK + MCP + API)
- **field-guide/** — what teams actually *did* (audit of 67 production repos)
- **glossary/** — shared terminology, deep-linked by all books

Current project roadmap lives at `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md`.

## Source repos (drafts, not truth)

- `~/claude-best-practices/` — handbook draft. v2.9 LaTeX. 16 chapters in `chapters/`. Archived on GitHub once handbook v1.0 ships.
- `~/claude-code-field-guide/` — field-guide draft. 12 chapters + 3 appendices. Archived on GitHub once field-guide v1.0 ships.
- Don't use pandoc. Manual rewrite is the convention.

## Scaffold

Books consume `@brandon_m_behring/book-scaffold-astro` (sibling repo at `~/book-scaffold-astro/`). Scaffold gaps found while authoring go in `docs/scaffold-gaps.md` and get filed as upstream issues; do NOT edit the scaffold from inside this repo.

## Editorial standards (carried from both source repos)

**Practice tags** (inline assertion of source authority):
- `<Tag kind="official">` — Anthropic-stated practice (cite a source URL)
- `<Tag kind="practitioner">` — observed-in-the-wild practice from a real team
- `<Tag kind="convergence">` — multiple independent sources agree

**Margin note categories** (`<MarginNote variant="..." label="...">`):
- Variants: `note` / `warning` / `tip`
- Approved category labels: Official, Tip, Warning, Cost, Enterprise, Template, Note
- **25-word cap on body** — enforced by scaffold validator (Phase 2.6)

**Other editorial rules**:
- All Anthropic-attributed claims include a source URL (cite via `<Tag kind="official">` or footnote)
- Concrete but generic examples — no personal project names or identifying details in main text
- Field-guide may keep specific repo names for the audit subjects but anonymize unrelated mentions
- Cross-references use `<XRef id="...">` (resolves via `src/data/labels.json` built by `npm run build:labels`)

## Cert alignment

Books align to Anthropic's *Claude Certified Architect — Foundations* 5-domain taxonomy (publicly known). Tracked weekly in [`docs/cert-tracking.md`](./docs/cert-tracking.md) via a scheduled remote agent. Per-domain coverage matrix in [`docs/cert-coverage.md`](./docs/cert-coverage.md).

The confidential v0.1 PDF in this repo (`instructor_..._Claude+Certified+Architect+...pdf`) is **internal research aid only** — do not cite verbatim in book content. Public-facing material cites the publicly-available taxonomy and the free Anthropic Academy courses.

## Build

```bash
npm install                  # at repo root
cd handbook && npm run dev   # localhost:4321 — only book currently active
```

## Licensing

All book content: CC BY 4.0. Scaffold package: MIT (consumed via npm). "Edit this page" links + GitHub Discussions per chapter enable community contribution.
