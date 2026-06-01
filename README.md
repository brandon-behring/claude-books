# claude-books

The Astro/MDX home for a multi-book **Claude reference** — Use / Cert / Design / Observe — plus a shared glossary. All members consume [`@brandon_m_behring/book-scaffold-astro`](https://github.com/brandon-behring/book-scaffold-astro). See [`docs/BOOK-MAP.md`](./docs/BOOK-MAP.md) for the canonical scopes.

## Workspace members

| Member | Lens | Source | Status |
|---|---|---|---|
| [`handbook/`](./handbook/) | **Use** | rewrite of [`claude-best-practices`](https://github.com/brandon-behring/claude-best-practices) (LaTeX, v2.9 sunset) | v1.0 prose (5 ch) |
| [`architect-reference/`](./architect-reference/) | **Cert** | from scratch, cert-aligned (CCA-F D1–D5) | slot + D1–D5 outline |
| [`agentic-systems-design/`](./agentic-systems-design/) | **Design** | from strict-live research dossiers | 11 ch (Environment & Context) |
| `field-guide/` *(planned)* | **Observe** | rewrite of [`claude-code-field-guide`](https://github.com/brandon-behring/claude-code-field-guide) | Phase 4 |
| `glossary/` *(planned)* | **Vocab** | shared terminology, deep-linked by all books | Phase 0.7 |

## What this is

The books, each from a different angle on Claude Code and the surrounding agent stack:

- **Handbook** — *how to use Claude effectively.* The practitioner's guide. (**Use**)
- **The Claude Architect's Reference** — *the cert-aligned volume.* Maps 1:1 to Anthropic's Claude Certified Architect — Foundations domains (D1–D5); points into Agentic Systems Design for design depth. (**Cert**)
- **Agentic Systems Design** — *engineering the environment + context around an agent.* The design discipline — formerly the env+context volume inside Architect's Reference. (**Design**)
- **Field-Guide** — *what teams actually did.* An empirical audit of 67 production Claude Code repos. (**Observe**)

All three are **free, CC BY 4.0** living documents (semver per book, per-chapter `last_updated`, RSS, changelog, "Edit this page" → PR).

## Background

This repo replaces two LaTeX books (`claude-best-practices` v2.9 and `claude-code-field-guide`) and adds a third volume that emerged from analyzing the *Claude Certified Architect — Foundations* taxonomy. The LaTeX repos are drafts, not sources of truth — each is archived on GitHub when its successor ships v1.0.

The current project roadmap and phase plan lives in `~/.claude/plans/`. Scaffold gaps surfaced while authoring are logged in [`docs/scaffold-gaps.md`](./docs/scaffold-gaps.md) and filed as upstream issues. Cert/Academy changes are tracked weekly in [`docs/cert-tracking.md`](./docs/cert-tracking.md) via a scheduled agent.

## Develop

```bash
npm install                    # at repo root
cd handbook && npm run dev     # localhost:4321
```

(Other workspace members come online in later phases.)

## License

Content: [CC BY 4.0](./LICENSE).
Scaffold package itself: MIT, consumed via npm.
