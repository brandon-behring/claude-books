# claude-books — working conventions

A multi-book series + shared glossary. Each book covers Claude from a different angle (canonical scopes: [`docs/BOOK-MAP.md`](./docs/BOOK-MAP.md)):

- **handbook/** — the **Use** book: how to *use* Claude Code effectively, day to day
- **agentic-coding/** — the cross-tool **Use** book: building software with AI coding agents across Claude Code, Gemini CLI, and Codex CLI (principle-first; distinct from the Claude-Code-specific handbook)
- **architect-reference/** — the **Cert** book: self-contained study guide, cert-aligned to *Claude Certified Architect — Foundations* (D1–D5)
- **agentic-systems-design/** — the **Design** book: the broad, **multi-volume** book on engineering agentic systems (Vols 1–3 drafted — v1.0 complete 2026-06-14; applied vol pending)
- **glossary/** — shared term layer (v1 shipped 2026-06-13: canonical `glossary/terms/` synced into each book; not a read-through book)

Current project roadmap + status lives at [`docs/ROADMAP.md`](./docs/ROADMAP.md) (canonical).

## Source repos (drafts, not truth)

- `~/claude-best-practices/` — handbook draft. v2.9 LaTeX. 16 chapters in `chapters/`. Archived on GitHub once handbook v1.0 ships.
- `~/claude-code-field-guide/` — field-guide draft (**retired** from the public lineup). Its "what teams did" mission now feeds Design's problem-first applied volume; the draft is archived on GitHub.
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
- **Asides only — function, not word count.** A `<MarginNote>` is the chapter's *one* secondary-disclosure layer (NN/g progressive disclosure): an aside the median reader can skip without losing the thread. Smell test: if a note is load-bearing, **promote it into the body**; if it holds two ideas, split or cut; keep them sparse. Use `<Sidenote>` (numbered) for a source-pointer, `<MarginNote>` (unnumbered) for an aside. (Grounded in `docs/research/11-pedagogy/02-information-design/`. The old "25-word cap, validator-enforced" was guidance only — never actually wired — and is retired.)

**Other editorial rules**:
- All Anthropic-attributed claims include a source URL (cite via `<Tag kind="official">` or footnote)
- Concrete but generic examples — no personal project names or identifying details in main text
- The applied/field-cases material (Design's problem-first volume) may keep specific repo names for audit subjects but anonymizes unrelated mentions
- Cross-references use `<XRef id="...">` (resolves via `src/data/labels.json` built by `npm run build:labels`)

## Cert alignment

Books align to Anthropic's *Claude Certified Architect — Foundations* 5-domain taxonomy (publicly known). Tracked weekly in [`docs/cert-tracking.md`](./docs/cert-tracking.md) via a scheduled remote agent. Per-domain coverage matrix in [`docs/cert-coverage.md`](./docs/cert-coverage.md).

The confidential v0.1 PDF in this repo (`instructor_..._Claude+Certified+Architect+...pdf`) is **internal research aid only** — do not cite verbatim in book content. Public-facing material cites the publicly-available taxonomy and the free Anthropic Academy courses.

## Build

```bash
npm install                  # at repo root
cd handbook && npm run dev   # localhost:4321  (or: npm -w agentic-systems-design run dev)
```

## Licensing

All book content: CC BY 4.0. Scaffold package: MIT (consumed via npm). "Edit this page" links + GitHub Discussions per chapter enable community contribution.
