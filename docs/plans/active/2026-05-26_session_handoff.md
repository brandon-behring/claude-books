# Session handoff — research program bootstrapped: taxonomy v1 + context-assembly pilot complete

**Date:** 2026-05-26 · **Branch:** `research-program-v0` (NOT merged to `main`) · **Resume at:** the co-drive **post-pilot review** (task #64)

---

## Resume in one line

The living strict-live research program is bootstrapped — **taxonomy v1** (in-repo) + the **context-assembly pilot** (external, fully validated) are done. **Next: the co-drive post-pilot review** — resolve the parked decisions (below) *with the pilot evidence in hand*, then decide scaling. Work the parked decisions **one at a time** (the user's preferred mode), user-driven.

## What this program is (full context in the plan file)

A *living* research backbone for all three books → an eventual explorable **knowledge graph**. Shape: **taxonomy-first → pilot → scale**; full three-books scope with a tagged **active frontier** vs positioned stubs; topic/capability axis (cert domains + books are lenses); **uniform full strict-live rigor** on any dossier built; **trajectory-gated depth** (momentum decides which topics earn a dossier); meta-artifacts in-repo, heavy dossiers external in `~/Claude/`; KG renders via the existing `brandon-behring.dev` `CitationGraph.astro` (Cytoscape) viewer. Motivation: **mastery first** (then Vol-2 foundation); success bar = **comprehensive + citation-rigorous**.
Full plan: `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` (active execution plan).

## State — what's done

**Phase 1 — Taxonomy v0 → v1 (in-repo).** `claude-books/docs/research-program/`:
- `taxonomy.graph.json` — **44 nodes / 45 edges / 14 clusters**, frontier-tagged, in the `CitationGraph` schema (renders in the Cytoscape viewer once wired). `ctx-assembly` now flipped to `ingested`/`strict-live`.
- `taxonomy.md` (narrative), `trajectories.md` (momentum dashboard, every topic incl. stubs), `content-map.md` (research→book mapping), `topic-backlog.yml` (16 emerging sub-topics), `README.md`.
- Commits: `c540511` (v0) → `07ef99a` (v1) → `8e04730` (pilot bridge).

**Phase 2 — Context-assembly pilot (external, COMPLETE + validated).** `~/Claude/research_agent_context_assembly/`:
- Full v3 strict-live: `research_plan.md` (5 sub-areas), `bib_ledger.yml` (**15 verified sources**), `evidence_ledger.yml` (schema 3; 17 evidence / **21 atoms**), `cache_manifest.yml` (17 cached `ok`), `claim_graph.jsonl` (81 records), `gather_trace.yml` (23 fetches, 6 escalations), `citation_audit_report.md` (**22/22 substring-clean**), `dashboard.md` (green: 0 stale, 0 conflicts, 4 weak), `agent_index/` (README + `00_overview` + `01_cache_stability`…`05_assembly_as_prompt` + `pre_selection_manifest.yml`).
- Exported: `~/Claude/research-kb/inbox/research_toolkit/research_agent_context_assembly.jsonl`.
- Pipeline run end-to-end: research-plan → research-gather → agent-index → dossier-audit (round-1 clean) → freshness-audit (`--strict` OK) → research-kb-export. **All toolkit validators pass.**

**Pilot verdict — all acceptance gates pass:** (a) comprehensive + rigorous ✅ (15 sources, 22/22) · (b) atoms compose into chapter units ✅ (per-block map to Ch5 / Architect's-Ref) · (c) trajectory signal ◐ (publication/release-velocity is the available signal) · (d) effort measured: **~5 sub-agents / ~225 sub-agent tool-calls per topic** (the scaling cost) · (e) clustering held ✅.
**Headline:** verify-then-cache caught **4 real launchpad errors** (ManyIFEval "Shi"→Harada; unverifiable Apigene 98%; absent "150–200" figure; laundered "~1M ceiling") — the thesis, demonstrated.

## Settled decisions (do NOT re-litigate)

Two launchpad docs are **launchpads, never cited**. Methodology = **full strict-live** (schema v3). **Full three-books scope + phased frontier.** Axis = topic/capability. **Production Operations** is its own cluster. `Academy` is a source, not a node. `ctx-assembly` stays ONE node for v1 (sub-topics promoted post-pilot). Meta in-repo, dossiers external. KG via the brandon-behring.dev CitationGraph viewer. Uniform rigor; trajectory-gated depth; single-system endgame (the 167-note cache eventually migrates). Pilot = context assembly.

## Parked decisions — resolve at the co-drive review (evidence now in hand)

1. **True clusters / atomicity** — pilot held the 5 sub-areas; context-rot correctly stayed a sibling. Re-assess as more topics land.
2. **Separate-vs-unified project structure** — pilot was 1 project; the KG wants shared/mergeable claim-graphs. Decide before scaling (leaning shared/mergeable, or per-topic projects + a merge step — the pilot's per-track-merge worked).
3. **Momentum signal** — breadth-scan finding: **publication/release velocity** (arXiv/blog/spec/GH dates) is the reliable automatable signal; community signals noisier. Finalize the mechanism (likely a scheduled agent, à la cert-tracking).
4. **Synthesis↔audit coexistence** — pilot bound the one cross-cutting claim as `supports[]` inside contributing primaries (corroboration_count 2), reusing verified anchors — passed all validators. Formalize this as the pattern.
5. **Graph↔published-book citation consistency** — leaning permanent atom IDs + deprecation tombstones; still TBD.
6. **Scaling** — gated on this review. Cost known (~5 agents/topic). Decide cadence + next topics (candidate first wave: the env-eng convergence cluster — `env-claudemd-discipline`, `env-repo-design`, `env-guardrails`).

## How to resume

1. Re-read: **this doc** → the plan file's active section → `docs/research-program/taxonomy.md` + `trajectories.md` → the pilot's `~/Claude/research_agent_context_assembly/agent_index/README.md`.
2. Mode: **co-drive / Socratic**, one decision at a time, user-driven.
3. Task #64 is `in_progress` (the review). After it, create scaling tasks per the chosen cadence.

## Per-topic pipeline RECIPE (proven; reuse for scaling)

1. Hand-author `research_plan.md` (3–5 sub-areas + claim-family taxonomy) — `/research-plan` isn't in the session skill set, so author from the toolkit template.
2. **Gather via parallel agents** writing **per-track files** (`bib_ledger.<track>.yml` etc.) to avoid races; ~2 sub-areas / ~5–6 sources per agent; cap ~28 calls. Each does: WebFetch+verify → `cache_source.py --escalate-on-failure` → verbatim excerpt from cached text → v3 anchor (offset+sha256) → bib/evidence/cache/gather_trace entries.
3. **Merge** per-track → canonical, **dedup by `primary_url`** (not just bibkey — caught the effective-context double-bibkey), union evidence_ids/cache_ids, remap aliases in gather_trace. (Merge logic saved at `_merge_tracks.py` in the pilot dir — generalize it.) Then `build_claim_graph.py`.
4. `/agent-index` — **one cohesive agent** (not parallel); Attribute-First 2a→2b→2c; group by claim_family; 5-bullet blocks.
5. `/dossier-audit` — **CoVe-factored** (verifier decoupled from the synthesis); right-size to one verification agent for a narrow focus.
6. Validate + `freshness.py --strict` + `build_dashboard.py` + `research_kb_export.py`.
7. **Bridge** into `docs/research-program/`: flip the node (`ingested`/`strict-live`), update `trajectories.md` + `content-map.md`, commit.

## Operational lessons (candidate BURN_IN_NOTES for the toolkit)

- **Dedup by primary_url, not bibkey** — two agents gave the same Anthropic post two bibkeys (`rajasekaran2025effectivecontext` vs `anthropic2025context`).
- **Slate/JS-rendered blogs** (Manus) fragment prose across `<span>` nodes → only sub-sentence verbatim anchors work; reuse gather-time anchors rather than re-selecting.
- **`cache_source.py` is content-addressed** — same URL, different render (urllib vs Playwright) → different `cache_id`; that's fine, both anchors stay valid.
- **Phase-4b schema drift**: the agent-index SKILL's literal "verification_method: cross_reference" predates v3; bind synthesis claims as extra `supports[]` in contributing primaries instead (matches `research_eval_drift`).
- **`/research-plan` absent** from the consumer session's skill set — author `research_plan.md` from the template.
