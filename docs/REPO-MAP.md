# Repo map — where everything lives, and why

> Git/branch topology for `claude-books`. For **what each book is**, see
> [`BOOK-MAP.md`](./BOOK-MAP.md). Last verified: **2026-06-01**.

## TL;DR

`main` is the **single content-bearing trunk** — it holds all books and the research program.
(Before 2026-06-01 it was a deliberately bare baseline with the real work on three stacked
worktrees; that stack was collapsed once the books were integrated.)

## Branches & recovery refs

| Ref | Kind | Role |
|---|---|---|
| `main` | branch | the trunk — all books + `docs/research-program/` + research cache. Author here. |
| `archive/part-i-v1.0-prose` | tag | retired snapshot — handbook Part I v1.0 prose; subsumed by the trunk. |
| `archive/research-program-v0` | tag | retired snapshot — research bridge; subsumed by the trunk. |
| `backup/*-pre-collapse` | tags | pre-reorg tips of every branch, for full recovery. |

The two snapshot branches were **ancestors of** the old `architect-reference-v0` superset (their
content is *inside* the trunk, not parallel), so they were archived as tags and retired. Restore
either anytime: `git switch -c <name> archive/<name>`.

## What's on the trunk

- `handbook/` — the *Use* book (v1.0 prose, 5 ch).
- `architect-reference/` — the *Cert* book (D1–D5 slot + outline; see [`BOOK-MAP.md`](./BOOK-MAP.md)).
- `agentic-systems-design/` — the *Design* book (Environment & Context, 11 ch).
- `docs/research-program/` — strict-live research bridge (taxonomy / content-map / decisions).
- `docs/research/` — legacy in-repo note cache (~171 notes).

## Where the non-repo pieces live

Paths below are for the **Linux clone**; a Mac clone differs.

- **Strict-live research dossiers (23):** external at `~/Claude/research_agent_*/` — *not*
  committed, by design. Composed KB: `~/Claude/research-kb/`.
- **Reorg-relocated scratch:** the loose launchpad seeds moved out of the repo root —
  `.md` seeds → gitignored `docs/research-program/launchpad/`; the external Manning bundle →
  `~/Claude/claude-books-research-inputs/`.
- **Referenced by `CLAUDE.md` but NOT on this Linux box:** the LaTeX drafts
  `~/claude-best-practices` (handbook) and `~/claude-code-field-guide` (field-guide). The
  **Field-Guide LaTeX source lives on another machine** — factor that in before authoring it here.

## How to work in it

1. `npm install` at root (workspaces: handbook, agentic-systems-design, architect-reference).
2. `npm -w <book> run dev` to preview a book (or `cd <book> && npm run dev`).
3. Commit to `main`; push when ready.

---
*Keep this current when the topology changes. Cross-session companion: the agent memory
`clone-worktree-topology` under `~/.claude/projects/<this-repo>/memory/`.*
