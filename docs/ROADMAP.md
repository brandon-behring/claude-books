# claude-books — project roadmap

> Canonical forward plan + current state. Companions: [`BOOK-MAP.md`](./BOOK-MAP.md) (book
> scopes), [`REPO-MAP.md`](./REPO-MAP.md) (git topology), [`cert-coverage.md`](./cert-coverage.md)
> (cert matrix). Last updated 2026-06-08.

## Current state (verified 2026-06-08)

Five books on a single content-bearing trunk (`main`):

| Book | Lens | Status |
|---|---|---|
| `handbook/` | Use | Part I shipped (ch01–04 prose); ch05–16 port pending |
| `architect-reference/` | Cert | 30 ch authored, Round-2 study-guide COMPLETE (audit fixes folded) |
| `agentic-systems-design/` | Design | 11 ch drafted (first full draft); cross-book XRefs not wired |
| `field-guide/` | Observe | not started (LaTeX port planned) |
| `glossary/` | Vocabulary | not started (shared terms planned) |

Research backbone: 23 strict-live dossiers (external `~/Claude/`), all D1–D5, Waves 1–7 done.
Scaffold: consumes `book-scaffold-astro ^4.3.0`; upstream latest `4.18.0`. Cert study apparatus =
scaffold epic #122 — only objective-map (#117) shipped; #110–#116 open.

### Known debt (tracked, not yet addressed)
- **CI:** `research-lint` red — 26 legacy `docs/research/` cache notes fail structural lint
  (15 in `04-agent-sdk/`, likely a WIP batch). `astro-build` + `content-validate` green.
- **Stale docs:** `content-map.md` ("three books / no dossiers"); `BOOK-MAP`/`REPO-MAP` cert
  status lines ("outline only").
- **Scaffold drift:** pinned `4.3` vs latest `4.18` (bump is a deliberate, separate call).

## Phases

**A — Stabilize (ACTIVE, 2026-06-08):** foundation trustworthy — this roadmap as source of truth,
memory reconciled, git synced to trunk. The debt above is logged but deferred within A.

**B/C/D — provisional, ordering decided after A lands:**
- **Finish drafted books → v1.0:** Cert (audit-fix pass + apparatus once scaffold #110–#116 ship)
  + Design (revision pass + wire cross-book XRefs, #96).
- **Breadth:** Handbook Parts II–IV port; stand up Field-Guide + Glossary.
- **Infra/polish:** figures pipeline, glossary infra, dossier freshness re-verify (MCP RC, ops_cost).

## Decisions log
- Single content-bearing trunk (`main`); feature branches retired to `archive/*` tags (2026-06-01).
- Five books, un-fused 2026-06-01: Cert (`architect-reference`) + Design (`agentic-systems-design`)
  are siblings; Cert XRefs → Design, never the reverse.
- Research program complete (Waves 1–7); dossiers external, bridge via `docs/research-program/`.
- Cert book genre = self-contained study guide (Round-2, 2026-06-02).
- Forward arc (B/C/D) ordering left provisional — decided after stabilize.
