# Research program — the living knowledge backbone for claude-books

This directory is the **content backbone** for the three-book series: a *living* topic graph
that grows into an explorable **knowledge graph** of everything relevant to the books, kept
current over time. It is the in-repo, version-controlled spine; the heavy verified research
lives **externally** as strict-live dossiers in `~/Claude/` and bridges in (see below).

> **Status: v0 (2026-05-26).** This is the *big-picture skeleton* produced by the Phase-1
> "thinking pass." The harness / environment-engineering / context-assembly region is the first
> deep focus; most other regions are honest **stubs** so coverage gaps stay visible. Clusters
> are **provisional** — the real sub-areas emerge from the research and the graph itself.

## Why this exists

- **Mastery first.** The point is deep, durable understanding of a fast-moving field (with the
  Architect's Reference as the eventual primary consumer). Comprehensive coverage + citation
  rigor are the quality bar.
- **One backbone for all three books.** Cert domains are a *derived floor* (the minimum that
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
→ `/research-gather` → `/agent-index` → `/dossier-audit` → `/citation-audit` → `/freshness-audit`
→ `/research-kb-export`, schema_version 3). The pipeline to this repo + the viewer:

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
- **Trajectory-gated depth.** Momentum decides *which* topics earn a dossier (heating /
  load-bearing → dossier; cooling / dormant → stub; revival → reactivate). Depth is always
  full-rigor; momentum gates depth.
- **Single-system endgame.** Everything eventually unifies under strict-live; the existing
  167-note `docs/research/` per-source cache is a transitional stepping stone.
- **Launchpads, never cited.** The two compass/deep-dive docs are verify-then-cache lead lists.

## Open decisions (settled after the gather phase)

Deliberately parked until there's evidence — see the plan file's *"Open decisions — settled
collaboratively AFTER the gather phase"* section: true clusters/atomicity, separate-vs-unified
project structure, the momentum signal, synthesis↔audit coexistence, graph↔published-book
citation consistency, the trajectory mechanism, the KG viewer's home, and the harness-vocabulary
editorial stance.

> Full plan: `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` (active execution plan).
