# Book map — the model

> The single answer to "what is each book, and what goes where." Companion to
> [`REPO-MAP.md`](./REPO-MAP.md) (git/branch topology) and [`ROADMAP.md`](./ROADMAP.md) (forward
> plan + status). Last updated: **2026-06-17**.

`claude-books` is a multi-book Astro/MDX workspace: **4 public books + a shared glossary layer**.
Each book is a distinct **scope** with a one-word **lens** — the question it answers. All consume
`@brandon_m_behring/book-scaffold-astro`.

> **Single source.** This file is the canonical, *full* statement of the book model — scopes, status,
> volumes, and the cross-ref convention. Other meta-docs (`CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, …)
> carry only a short identity blurb + a pointer here, so the authoritative detail lives in one place.

| Book | Slug | Lens | Question it answers | Cert relation | Status |
|---|---|---|---|---|---|
| Handbook | `handbook/` | **Use** | How do I use Claude Code effectively, day to day? | use-side; D3 primary owner | Part I prose (4 ch, ch01–04); ch05–15 outline |
| Agentic Coding | `agentic-coding/` | **Use** | How do I build software with AI coding agents — across tools? | use-side; cross-tool (D1/D3) | 17 ch + 6 appendices (Claude Code · Gemini CLI · Codex CLI); folded in via PR #18 |
| The Claude Architect's Reference | `architect-reference/` | **Cert** | How do I design to (and pass) the CCA-F domains D1–D5? | **is** the cert map | 30 ch authored, Round-2 study-guide COMPLETE (2026-06-02) |
| Agentic Systems Design | `agentic-systems-design/` | **Design** | How do I engineer agentic systems? (broad — **multi-volume**) | reference-altitude depth for D1/D2/D5 | **Vols 1–3 drafted — Design v1.0 COMPLETE 2026-06-14** (28 ch); applied (v2.0) pending |
| Glossary | `glossary/` | **Vocabulary** | What does this term mean? | shared terms, deep-linked | v1 shipped 2026-06-13 (cert consumer) — **not a read-through book** |

## The depth ladder

The four books form a deliberate **depth ladder** — pick the rung that matches how deep you need to go:

1. **handbook** — *use Claude Code well, today.* Claude-specific daily practice.
2. **agentic-coding** — *understand why agentic coding works — and where the tools differ.* The principle / cross-tool "why" layer.
3. **agentic-systems-design** — *engineer agentic systems.* The deepest, reference-altitude rung.

**The Architect's Reference is orthogonal** — the exam path, self-contained, not a rung on the ladder.
**The Glossary is cross-cutting** — the shared vocabulary every rung links into.

Each rung is **standalone**: a breadcrumb *invites* the deeper book, it never says "see the other book
for the real version" (see *Cross-reference convention*). For a shared concept, the **principle core
canonically deepens one rung up** (e.g., the *why* of context rot lives in agentic-coding; the handbook
keeps the Claude-specific commands + a brief pointer). Grounded in the 2026-06-19 series pedagogy &
positioning audit ([`docs/audits/2026-06-19_series-pedagogy-and-positioning-audit.md`](./audits/2026-06-19_series-pedagogy-and-positioning-audit.md)),
which verified the handbook ↔ agentic-coding split is genuine (keep both) and mapped the de-dupe.

## Handbook = Use

Claude Code in **daily practice** — sessions, CLAUDE.md, workflows, config, productivity. How-to
altitude, scoped to the CLI/agent tool (not the API or claude.ai). The rewrite of the
`claude-best-practices` draft (16 ch). **Rung 1 of the depth ladder — lean-but-standalone:** full on
the Claude-specific *how*, brief on principles, with breadcrumbs inviting agentic-coding (rung 2) for
the cross-tool *why*.

## Agentic Coding = Use (cross-tool)

Building software with AI coding agents as a **single cross-tool practice** — Claude Code, Gemini CLI,
and Codex CLI side by side. Principle-first: each chapter uses a uniform Representation / Operation /
Evolution skeleton and tracks where the tools **converge** (stable practice) and **diverge** (open
design space). 17 chapters + 6 appendices (per-tool companions, a source archive, glossary, maturity
model). Distinct from the Handbook (Claude-Code-specific daily practice); this is the tool-agnostic layer
*above* any one tool — **rung 2 of the depth ladder**, the "why" layer the handbook's breadcrumbs point to
(the principle core of a shared concept canonically deepens here). Within the **Claude-centered** series,
**Claude Code is the home lens** here — Gemini CLI and Codex CLI appear as comparative context, not co-equal subjects. Folded into the series via PR #18
(which also added the Cloudflare deploy hub).

## Architect's Reference = Cert

Exam-prep altitude. Maps 1:1 to Anthropic's *Claude Certified Architect — Foundations* five domains.
A **self-contained study guide** (Round-2, 2026-06-02): a reader passes the cert using **only** this
book. It may **duplicate** Design material freely — being self-contained is the point — and links to
Design via optional "go deeper" breadcrumbs.

## Agentic Systems Design = Design (multi-volume)

Reference altitude. The broad discipline of designing agentic systems, delivered **foundation-first
across volumes**:

- **Vol 1 — Environment & Context** *(complete, 11 ch)* — the agent's world (repo / CLAUDE.md /
  skills / guardrails / cross-domain) + what it reasons over (context-rot / assembly / memory),
  opened by the harness frame.
- **Vol 2 — Tools & Orchestration** *(complete, ch12–20)* — tool/MCP design, tool minimization,
  sub-agents, multi-agent, build-vs-buy a harness.
- **Vol 3 — Evaluation & Operations** *(complete, ch21–28)* — evals/validation, observability, cost, oversight/HITL, security.
- **+ a problem-first applied volume** — re-traverses the material through real problems (reviews +
  breadcrumbs back to Vols 1–3). This carries the **public** "what teams actually did" mission (the
  retired Field-Guide's role).

**Design v1.0 = Vols 1–3** (the foundation set); the applied volume is v2.0. The 23 strict-live
dossiers back the volumes (Vol 2 ← tool / MCP / sub-agent / multi-agent / build-vs-buy; Vol 3 ← eval
+ ops). Still meant for an eventual clean repo extraction (see
[`SPLIT.md`](../agentic-systems-design/SPLIT.md)) — the breadcrumb convention keeps that possible
(outbound breadcrumbs are non-load-bearing).

## Glossary = shared infrastructure

Not a read-through book: a **deep-linkable term layer** — canonical one-paragraph definitions +
breadcrumb XRefs to where each term is covered in depth. Serves the whole series. **v1 (2026-06-13)**
is sourced from the **cert book's own vocabulary** (70 terms): the dossiers' `agent_index/` dirs were
found to hold no structured glossary sections, so the original "harvest the dossiers" premise was
dropped. Terms live once in the canonical `glossary/terms/` and sync (gitignored) into each book's
`src/content/glossary/`; inline `<Term id="…">` deep-links into `/glossary`.

## Retired from the public lineup — Field-Guide (Observe)

The "what teams actually did" 67-repo audit is **no longer a standalone public book**. Its public
mission folds into Design's problem-first applied volume. A **private self-audit** of your own work
remains a tentative *personal* artifact, outside the public series.

## Cross-reference convention

Refines the earlier "Design points outward only / zero inbound XRefs" rule:

- **Duplication is acceptable** — the Cert guide especially must stand fully alone.
- **Every explanation is complete where it sits** — never "see the other book for the real version."
- **Cross-refs are bidirectional breadcrumbs** — pointers to parallel coverage, so updating a topic
  surfaces every place it lives. Neither direction is load-bearing (each explanation is complete in
  place), which keeps Design cleanly extractable.
- **Link mechanism:** **in-book** links use `<XRef id="...">` (resolves via `src/data/labels.json`);
  **cross-book** links use `<BookLink>` (the books are separate Astro apps / subdomains) or plain prose —
  `<XRef>` cannot cross app boundaries. The depth-ladder breadcrumbs (handbook → agentic-coding → design)
  are `<BookLink>`s.

```
Depth ladder:  handbook ──invite──▶ agentic-coding ──invite──▶ agentic-systems-design
               (use today)          (why / cross-tool)         (engineer it)

Cert (orthogonal):  Architect's Reference ◀──breadcrumb──▶ Agentic Systems Design
```

## Cert ownership at a glance (matrix: [`docs/cert-coverage.md`](./cert-coverage.md))

- **D1 Orchestration (27%)** — Architect's Ref builds; breadcrumb Design Vol 1 (harness frame) + Vol 2 (orchestration).
- **D2 Tools & MCP (18%)** — Architect's Ref builds; breadcrumb Design Vol 2.
- **D3 Claude Code Config (20%)** — Handbook (use) + Architect's Ref (design); breadcrumb Design Vol 1.
- **D4 Prompt & Structured Output (20%)** — Handbook (basics) + Architect's Ref (tool_use / schemas).
- **D5 Context & Reliability (15%)** — mostly Design Vol 1 (context) + Vol 3 (ops); Architect's Ref fills gaps.
