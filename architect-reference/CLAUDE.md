# architect-reference — AI authoring guide

This book is built with `@brandon_m_behring/book-scaffold-astro` (tools profile, currently v4.18.0). It's the **Cert** book of the claude-books series — the self-contained study guide cert-aligned to Anthropic's *Claude Certified Architect — Foundations* (CCA-F), domains **D1–D5**.

**Status**: 30 chapters authored; Round-2 self-contained study-guide conversion **complete** (2026-06-02) — every chapter opens with a "Do I Know This Already?" diagnostic and carries an expanded `<WorkedExample>`. **In progress — not v1.0.** More improvement rounds are expected: a factual-accuracy audit pass and the interactive study apparatus (scaffold issues #110 diagnostic / #113 assessment / #115 glossary / #116 flashcards; the static spine #112/#114/#117 already ships). See [`../docs/ROADMAP.md`](../docs/ROADMAP.md) for the v1.0 gate.

**Where things live**:

- Chapters: `src/content/chapters/d{1..5}-NN-*.mdx` (D-domain × task-area; e.g. `d1-01-agentic-loops.mdx`)
- Outline + per-chapter rationale: [`OUTLINE.md`](./OUTLINE.md)
- Cert coverage matrix (authority): [`../docs/cert-coverage.md`](../docs/cert-coverage.md)
- Components / layouts / default routes: `@brandon_m_behring/book-scaffold-astro`

**Genre — self-contained study guide.** A reader passes the cert using **only** this book: teach-from-scratch prose, worked examples, retrieval practice with rationales. Duplicating *Agentic Systems Design* material is fine — being self-contained is the point. Links to the Design book are **optional "Further reading" breadcrumbs (plain prose, not `<XRef>`)**: separate Astro apps can't cross-`<XRef>`, and the cert book carries **no build-time dependency** on Design (keeps both cleanly extractable — see [`../agentic-systems-design/SPLIT.md`](../agentic-systems-design/SPLIT.md)).

**Workspace-level conventions** (whole series): [`../CLAUDE.md`](../CLAUDE.md) (book model + editorial standards), [`../docs/BOOK-MAP.md`](../docs/BOOK-MAP.md) (**single source** for the book model), [`../AUTHORS.md`](../AUTHORS.md), [`../CONTRIBUTING.md`](../CONTRIBUTING.md), [`../LICENSE`](../LICENSE) (CC BY 4.0) + [`../LICENSE-SCRIPTS`](../LICENSE-SCRIPTS) (MIT).

**Cert-domain footprint**: this book **is** the cert map — primary across **D1–D5**. Full domain × task-area × book matrix: [`../docs/cert-coverage.md`](../docs/cert-coverage.md).

**Filing scaffold gaps**: log in [`../docs/scaffold-gaps.md`](../docs/scaffold-gaps.md) and file upstream with label `consumer:claude-books` — do **not** patch the scaffold locally.
