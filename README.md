# claude-books

The Astro/MDX home for a multi-book **Claude reference** — four books across **Use / Cert / Design** lenses — plus a shared glossary layer. All members consume [`@brandon_m_behring/book-scaffold-astro`](https://github.com/brandon-behring/book-scaffold-astro).

**The books** — canonical scopes in [`docs/BOOK-MAP.md`](./docs/BOOK-MAP.md); status + roadmap in [`docs/ROADMAP.md`](./docs/ROADMAP.md):

- **Handbook** (`handbook/`) — **Use, today**: how to use Claude Code effectively, day to day. Lean-but-standalone (rung 1 of the depth ladder).
- **Agentic Coding** (`agentic-coding/`) — **Use, cross-tool**: building software with AI coding agents across Claude Code, Gemini CLI, and Codex CLI — the principle / "why" layer (rung 2).
- **The Claude Architect's Reference** (`architect-reference/`) — **Cert**: a self-contained study guide mapped 1:1 to Anthropic's *Claude Certified Architect — Foundations* (domains D1–D5).
- **Agentic Systems Design** (`agentic-systems-design/`) — **Design**: the broad, multi-volume discipline of engineering agentic systems (rung 3, deepest).
- **Glossary** (`glossary/`) — a shared, deep-linkable term layer (infrastructure, not a read-through book).

The Use and Design books form a **depth ladder** — *use it today (handbook) → why, across tools (agentic-coding) → engineer it (design)*; the cert book is the orthogonal exam path.

All books are **free, CC BY 4.0** living documents — per-book semver, per-chapter `last_updated`, RSS, changelog, "Edit this page" → PR.

## Background

The series grew out of two LaTeX drafts — `claude-best-practices` (→ Handbook) and `claude-code-field-guide` (retired from the public lineup; its "what teams did" mission now folds into Design's problem-first applied volume) — plus the cert-aligned and design books that emerged from the *Claude Certified Architect — Foundations* taxonomy and the environment+context split. The LaTeX repos are drafts, not sources of truth — each is archived on GitHub once its successor ships.

Scaffold gaps surfaced while authoring are logged in [`docs/scaffold-gaps.md`](./docs/scaffold-gaps.md) and filed as upstream issues. Cert/Academy changes are tracked weekly in [`docs/cert-tracking.md`](./docs/cert-tracking.md) via a scheduled agent.

## Develop

```bash
npm install                    # at repo root
cd handbook && npm run dev     # localhost:4321  (or: npm -w agentic-systems-design run dev)
```

## License

Content: [CC BY 4.0](./LICENSE).
Scaffold package itself: MIT, consumed via npm.
