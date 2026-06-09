# architect-reference — AI authoring guide

This book is built with `@brandon_m_behring/book-scaffold-astro` (tools profile, currently v4.18.0). It's the **Cert** book of the claude-books series — the self-contained study guide cert-aligned to Anthropic's *Claude Certified Architect — Foundations* (CCA-F), domains **D1–D5**.

**Status**: 30 chapters authored; Round-2 self-contained study-guide conversion **complete** (2026-06-02) — every chapter opens with a "Do I Know This Already?" diagnostic and carries an expanded `<WorkedExample>`. Factual-accuracy audit **done** (2026-06-08). Study-apparatus **spine wired** (2026-06-09): `examDomains` (the five CCA-F domains) + the `questions` content collection + the static `/practice-exam` route + `<ObjectiveMap>` on the landing page, with a **seeded 10-question bank** (2 per domain, grounded in the chapters). **In progress — not v1.0.** Remaining: expand the question bank toward per-chapter coverage; the heavier apparatus components (scaffold issues **#110** diagnostic / **#111** part-review / **#113** assessment / **#115** glossary / **#116** flashcards) are still open upstream. The spine (#112/#114/#117) shipped in scaffold v4.17 and is consumed here. See [`../docs/ROADMAP.md`](../docs/ROADMAP.md) for the v1.0 gate.

**Authoring questions**: `src/content/questions/<id>.mdx` — frontmatter `id` (unique) / `type` (`mcq`|`free`|`cloze`) / `chapter` (kebab slug, e.g. `d1-01`) / `domain` (must be one of the `examDomains` in `astro.config.mjs`, else the build throws); MDX body = the stem; MCQ `options:` carry exactly one `correct: true` (no `answer` field — explanations go in a `<Rationale>` body block). `defineBookSchemas()` auto-registers the collection once the directory exists. Run `npm run validate` (schema + dup-id + unknown-domain) then `npm run build`.

**Where things live**:

- Chapters: `src/content/chapters/d{1..5}-NN-*.mdx` (D-domain × task-area; e.g. `d1-01-agentic-loops.mdx`)
- Outline + per-chapter rationale: [`OUTLINE.md`](./OUTLINE.md)
- Cert coverage matrix (authority): [`../docs/cert-coverage.md`](../docs/cert-coverage.md)
- Components / layouts / default routes: `@brandon_m_behring/book-scaffold-astro`

**Genre — self-contained study guide.** A reader passes the cert using **only** this book: teach-from-scratch prose, worked examples, retrieval practice with rationales. Duplicating *Agentic Systems Design* material is fine — being self-contained is the point. Links to the Design book are **optional "Further reading" breadcrumbs (plain prose, not `<XRef>`)**: separate Astro apps can't cross-`<XRef>`, and the cert book carries **no build-time dependency** on Design (keeps both cleanly extractable — see [`../agentic-systems-design/SPLIT.md`](../agentic-systems-design/SPLIT.md)).

**Workspace-level conventions** (whole series): [`../CLAUDE.md`](../CLAUDE.md) (book model + editorial standards), [`../docs/BOOK-MAP.md`](../docs/BOOK-MAP.md) (**single source** for the book model), [`../AUTHORS.md`](../AUTHORS.md), [`../CONTRIBUTING.md`](../CONTRIBUTING.md), [`../LICENSE`](../LICENSE) (CC BY 4.0) + [`../LICENSE-SCRIPTS`](../LICENSE-SCRIPTS) (MIT).

**Cert-domain footprint**: this book **is** the cert map — primary across **D1–D5**. Full domain × task-area × book matrix: [`../docs/cert-coverage.md`](../docs/cert-coverage.md).

**Filing scaffold gaps**: log in [`../docs/scaffold-gaps.md`](../docs/scaffold-gaps.md) and file upstream with label `consumer:claude-books` — do **not** patch the scaffold locally.
