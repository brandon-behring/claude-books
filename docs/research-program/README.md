# Research program — the living knowledge backbone for claude-books

This directory is the **content backbone** for the book series: a *living* topic graph
that grows into an explorable **knowledge graph** of everything relevant to the books, kept
current over time. It is the in-repo, version-controlled spine; the heavy verified research
lives **externally** as strict-live dossiers in `~/Claude/` and bridges in (see below).

> **Status: v1 (2026-05-26).** Big-picture map produced by the Phase-1 "thinking pass" + an
> eyeball-pass revision: full series scope, **14 clusters** in two bands (active frontier
> vs positioned), 44 topic nodes. The harness / environment / context-assembly region + a new
> **Production Operations** cluster are the active frontier; most nodes are honest **stubs** so
> coverage gaps stay visible. Clusters are still **provisional** — the pilot + the emergent KG
> reveal the true sub-areas.

> **Update (2026-05-27): research COMPLETE.** Waves 1–7 built **23 strict-live dossiers** across all
> D1–D5 — the active-frontier stubs are now flipped to strict-live. Current book model:
> [`BOOK-MAP.md`](../BOOK-MAP.md).

## Why this exists

- **Mastery first.** The point is deep, durable understanding of a fast-moving field (with the
  Architect's Reference as the eventual primary consumer). Comprehensive coverage + citation
  rigor are the quality bar.
- **One backbone for the whole series.** Cert domains are a *derived floor* (the minimum that
  must be covered), not the organizing spine — the topic graph is bigger than the cert.
- **Trajectory-aware.** Topics heat up, cool, dead-end, or revive. The program tracks each
  topic's momentum so nothing silently rots and depth follows where the field is moving.

## The files

| File | What it is |
|---|---|
| [`taxonomy.graph.json`](./taxonomy.graph.json) | **The graph itself** — nodes = topics, edges = relationships, `metadata.sections` = clusters. Emitted in the `brandon-behring.dev` `CitationGraph.astro` schema, so it renders/zooms in that Cytoscape viewer as-is. `data.kb_status`: `ingested` = has research (full color); `not_ingested` = stub / not yet researched (greyed + dashed). |
| [`taxonomy.md`](./taxonomy.md) | The narrative topic map — clusters, what's deep vs stub, the provisional/emergent caveat, cert + book lenses. |
| [`trajectories.md`](./trajectories.md) | The living **momentum dashboard** — one row per topic (heating / stable / cooling / dormant / revived), last-checked, notable shifts. Lists *every* topic from day one (even stubs) so gaps + staleness are visible. |
| [`content-map.md`](./content-map.md) | The **research → book** mapping (which topics/atoms back which planned chapters/sections), cert-coverage-matrix style. Versioned/living — atoms grow and mappings change. |
| [`topic-backlog.yml`](./topic-backlog.yml) | Append-only **emerging sub-topic** candidates surfaced during research (the `/topic-discovery` output). |

## How the external strict-live dossiers bridge in

Heavy verified research is **not** committed here. Each topic that earns depth becomes a
strict-live project in `~/Claude/research_agent_<slug>/` (full toolkit pipeline: `/research-plan`
→ `/research-gather` → `/agent-index` → `synthesis.md` → `/dossier-audit` → `/citation-audit` →
`/freshness-audit` → `/research-kb-export`, schema_version 3; **permanent never-reused atom IDs**).
The pipeline to this repo + the viewer:

```
~/Claude/research_agent_<slug>/   →  /research-kb-export  →  ~/Claude/research-kb/
        (strict-live dossier)              (claim_graph.jsonl, atoms)
                                                   │
                                    build-graph-export step
                                   (mirror rl_and_control/scripts/build_graph_export.py)
                                                   │
                                                   ▼
                              graph.json (CitationGraph schema)  →  Cytoscape viewer
                                   (this taxonomy is the topic-level skeleton;
                                    per-dossier claim_graphs compose upward into the KG)
```

A topic node's `data.project_slug` points to its external dossier once one exists.

## Working model: gather-first → co-drive

- **Phase A (gather, Claude-led):** Phase 1 = this taxonomy v0 + scaffolding; Phase 2 = pilot
  `context assembly` end-to-end + a breadth scan of what momentum signals actually exist.
- **Phase B (co-drive, collaborative):** after the pilot review, synthesis + mastery + resolving
  the parked open decisions *with evidence in hand* — then scale the re-clustered set in waves.

## Policies (locked)

- **Uniform rigor.** Any dossier that gets built is full strict-live (substring-audited),
  regardless of topic volatility.
- **Editorial depth-gating** (refined 2026-05-26, [`decisions.md`](./decisions.md) D3).
  *Editorial judgment* (importance + mastery-gap + book-need) decides which topics earn a
  dossier; momentum is a **staleness + field-movement radar** that informs it, not an auto-gate
  (heating ≠ "research it"). Depth is always full-rigor.
- **Single-system endgame.** Everything eventually unifies under strict-live; the existing
  167-note `docs/research/` per-source cache is a transitional stepping stone.
- **Launchpads, never cited.** The two compass/deep-dive docs are verify-then-cache lead lists.

## Decisions (post-pilot review — resolved 2026-05-26)

The six parked decisions are **resolved** — see [`decisions.md`](./decisions.md): D1 atomicity
(two-layer rule), D2 structure (per-topic projects + cross-project merge), D3 momentum (a
hand-applied quality rubric; machinery deferred), D4 synthesis↔audit (pure atoms + grounded
`synthesis.md`), D5 graph↔book (stable-ID discipline now, forwarding deferred), D6 scaling
(Wave 1 = context-rot + repo-design + claudemd). **Still deferred:** the KG-viewer's home
(→ viz phase) and the harness-vocabulary stance (→ Vol-2).

> Canonical roadmap: [`docs/ROADMAP.md`](../ROADMAP.md) (the buzzing-eclipse plan is superseded).
