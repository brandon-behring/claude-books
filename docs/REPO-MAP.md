# Repo map — where everything lives, and why

> Orientation for `claude-books`. **If you just checked out `main` and it looks nearly
> empty, that's expected** — read on. Last verified: **2026-05-30**.

## TL;DR

`main` is a deliberately **bare baseline**. The real work lives on three long-lived feature
branches, each materialized as a git **worktree**. The newest branch,
**`architect-reference-v0`, is a superset that already contains the other two branches'
content** plus the Architect's Reference. Everything is pushed to `origin` — nothing is lost.

## Branches (run `git worktree list`)

| Branch `@HEAD` | Handbook | `docs/research-program/` | `architect-reference/` | Role |
|---|---|---|---|---|
| `main` | stale (2 ch, pre-prose) | — | — | bare baseline; only unique content is a `.gitignore` chore |
| `part-i-v1.0-prose` | v1.0 (5 ch) | — | — | handbook Ch 1–4 v1.0 prose + Part-I summary |
| `research-program-v0` | v1.0 (5 ch) | ✅ | — | strict-live research bridge (taxonomy / trajectories / content-map / decisions) |
| **`architect-reference-v0`** | v1.0 (5 ch) | ✅ | ✅ env+context, 11 ch | **integration superset — the de-facto trunk** |

`part-i-v1.0-prose` and `research-program-v0` are **ancestors of** `architect-reference-v0`
— their content is *inside* it, not parallel. The only thing `architect-reference-v0` lacks
is `main`'s lone gitignore chore.

## Why it's laid out this way

A **stacked-worktree workflow**: each workstream gets its own branch off a bare `main` so it
can be pushed, backed up, and worked independently (including across machines). The Architect's
Reference is *authored from* the research program, so its branch was stacked on the research
branch and pulled the handbook prose along too — which is why `architect-reference-v0` ended up
holding everything.

**Convention:** push to the feature branches; keep `main` bare. Merging
`architect-reference-v0 → main` would consolidate everything in one step (optional, not pending).

## Where the non-repo pieces live

Paths below are for the **Linux clone**; a Mac clone differs.

- **Strict-live research dossiers (23):** external at `~/Claude/research_agent_*/` — *not*
  committed to this repo, by design. Composed knowledge base: `~/Claude/research-kb/`. Legacy
  in-repo note cache: `docs/research/` (~171 notes).
- **Referenced by `CLAUDE.md` but NOT present on this Linux box:** the LaTeX drafts
  `~/claude-best-practices` (handbook) and `~/claude-code-field-guide` (field-guide), and the
  scaffold repo `~/book-scaffold-astro`. The scaffold is consumed via npm
  (`@brandon_m_behring/book-scaffold-astro`); the **Field-Guide LaTeX source lives on another
  machine** — factor that in before authoring that volume here.

## How to work in it

1. `git worktree list` to see branches/worktrees.
2. Author/preview in the matching worktree (each needs its own `npm install`).
   `architect-reference-v0` is the trunk that has everything.
3. Commit + push to the feature branch. Don't merge to `main` unless consolidating.

## The three books (status)

- **Handbook** — Part I (Ch 1–4) shipped v1.0; Parts II–IV (Ch 5–16) remain. *(cert Domain 3 owner.)*
- **Architect's Reference** — Part I *Environment & Context* (11 ch) **complete + pushed**. Next
  Parts, all greenfield: **D1 Orchestration**, **D2 Tools/MCP**, **D4 structured output**.
- **Field-Guide** — 67-repo production audit; still LaTeX, not yet in this repo (and not on this machine).
- **Glossary** — shared terms, to populate.

---
*Keep this current when branches/worktrees change. Cross-session companion: the agent memory
`clone-worktree-topology` under `~/.claude/projects/<this-repo>/memory/`.*
