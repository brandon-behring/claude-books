# Book map — the five scopes

> The single answer to "what is each book, and what goes where." Companion to
> [`REPO-MAP.md`](./REPO-MAP.md) (git/branch topology). Last updated: **2026-06-01**.

`claude-books` is a multi-book Astro/MDX workspace. Each book is a distinct **scope** with a
one-word **lens** — the question it answers. All consume `@brandon_m_behring/book-scaffold-astro`.

| Book | Slug | Lens | Question it answers | Cert relation | Status |
|---|---|---|---|---|---|
| Handbook | `handbook/` | **Use** | How do I use Claude effectively, day to day? | use-side; D3 primary owner | v1.0 prose (5 ch) + outline |
| The Claude Architect's Reference | `architect-reference/` | **Cert** | How do I design to (and pass) the CCA-F domains D1–D5? | **is** the cert map | slot + D1–D5 outline only |
| Agentic Systems Design | `agentic-systems-design/` | **Design** | How do I engineer the environment + context around an agent? | reference-altitude (📘) depth for D1/D3/D5 | 11 ch (Environment & Context) |
| Field-Guide | `field-guide/` | **Observe** | What did teams actually do? (67-repo production audit) | empirical evidence | planned (LaTeX port) |
| Glossary | `glossary/` | **Vocabulary** | What does this term mean? | shared terms, deep-linked | planned |

## Use vs Cert vs Design — the easy-to-confuse trio

The 2026-06-01 reorg **un-fused two identities** that had merged inside `architect-reference`:

- **Architect's Reference = Cert.** Exam-prep altitude. Maps 1:1 to Anthropic's *Claude
  Certified Architect — Foundations* five domains. Owns the cert spine; points outward to the
  Design book for depth. (Mostly to-be-built; see its `OUTLINE.md`.)
- **Agentic Systems Design = Design.** Reference altitude. The deep discipline of engineering
  the **environment** an agent acts in and the **context** it reasons over. Self-contained; the
  eventual one-day repo extraction (see [`SPLIT.md`](../agentic-systems-design/SPLIT.md)).
- **Handbook = Use.** How-to altitude. Using Claude Code in daily practice.

## Dependency direction

```
Architect's Reference (Cert) ──XRef──▶ Agentic Systems Design (Design)
```

The Design book points **outward only** (zero inbound XRefs) — that is what keeps it a clean
one-day extraction. The Cert book references the Design book where a domain needs design depth;
never the reverse.

## Cert ownership at a glance (matrix: [`docs/cert-coverage.md`](./cert-coverage.md))

- **D1 Orchestration (27%)** — Architect's Ref builds; XRef Design ch01/ch03/ch07.
- **D2 Tools & MCP (18%)** — Architect's Ref builds.
- **D3 Claude Code Config (20%)** — Handbook (use) + Architect's Ref (design); XRef Design ch04/ch05.
- **D4 Prompt & Structured Output (20%)** — Handbook (basics) + Architect's Ref (tool_use / schemas).
- **D5 Context & Reliability (15%)** — mostly Design ch08/ch09/ch10/ch06; Architect's Ref fills gaps.
