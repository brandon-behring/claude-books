# Session handoff — Wave 1 COMPLETE (3 dossiers + cross-project merge + bridge)

**Date:** 2026-05-26 · **Branch:** `research-program-v0` (NOT merged to `main`) · **Resume at:** Wave 2 (review gate passed).

Supersedes `2026-05-26_wave1-progress-handoff.md` (which resumed at dossier #2 — now all done).

---

## Resume in one line

**Wave 1 is complete and validated.** Three strict-live dossiers (`context_rot`, `repo_design`, `claudemd_discipline`) are built, audited, exported, and **bridged into the repo** (commit `b77fe26`); the cross-project KG-compose merge **proves D2 at 4-wide**. The review gate passed. **Next: Wave 2 — `guardrails` + `cross-domain` + `memory` (per D6)** using the now-twice-proven per-dossier recipe + the new `_merge_projects.py`.

## What's done (this session)

1. **Dossier #6 `repo_design`** (`~/Claude/research_agent_repo_design/`) — 8 sources, 14 atoms, 5 families. `verify_citations` 14/14. `/dossier-audit` r1: 0 DROP / 1 CORRECT / 0 FLAG (the CORRECT = HumanLayer same-essay, deferred to #8). `freshness --strict` OK. `synthesis.md` (5 `syn_repo_design_*`). Exported (54 records). **Caught:** the Phil Schmid seed had no verifiable repo-design claim (escalated, not laundered).
2. **Dossier #7 `claudemd_discipline`** (`~/Claude/research_agent_claudemd_discipline/`) — 6 sources, 14 atoms, 4 families. **First-merge-clean** + **audit r1 clean on first pass (0/0/0)** — because the #6 vocab + tiering lessons were baked into the gather prompts. `verify_citations` 14/14. `synthesis.md` (5 `syn_claudemd_discipline_*`); `syn_03` = the shipped-Ch2 `<Tag kind="convergence">` payload. Exported (47 records). **Wins:** the "41% zero-AI-commits" D3 lead promoted to a verified source (Robbes, arXiv 2601.18341); the ETH study (arXiv 2602.11988) anchored as the measured keystone (context files reduce success + >20% cost).
3. **#8 cross-project KG-compose + bridge** — wrote **`~/Claude/_merge_projects.py`** (fresh; the handoff's `rl_and_control/.../build_graph_export.py` mirror does NOT exist). Ran across 4 projects (pilot + the 3): 239 raw → 229 records; **3 shared sources** (liu2024lostmiddle, agents.md, anthropic best-practices) + **4 shared caches** resolved by `primary_url` + `sha256`, both `claim_family` framings preserved each; HumanLayer same-as applied; **0 claim/evidence ID collisions** (disjoint-prefix discipline held at 4-wide). Output: `~/Claude/research-kb/composed/{wave1_source_registry.yml, wave1_claim_graph.jsonl, wave1_merge_report.md}`. **Bridge committed (`b77fe26`):** `taxonomy.graph.json` (3 nodes → ingested/strict-live + project_slug), `trajectories.md`, `content-map.md`, `topic-backlog.yml`.
4. **#9 review gate** — passed (this doc + master-plan + memory updates).

## Review-gate assessment (the substance of #9)

- **The per-topic pipeline is robust at wave scale.** Two independent dossiers (plus the prior-session `context_rot`) ran the 8-step recipe to all-gates-green. The recipe is now twice-proven beyond the pilot.
- **Carry-forward compounds.** Baking #6's controlled-vocabulary + honest-tiering lessons into #7's gather prompts produced a *first-merge-clean* dossier whose independent audit was *clean on the first pass*. This is the verify-then-cache discipline compounding across dossiers — the single most useful operational finding.
- **The cross-project merge (D2) holds.** Entity resolution by `primary_url` + `sha256` (realized as record-id recurrence) resolved every shared source/cache; the disjoint topic-prefixed atom-ID discipline (D5) produced **zero** collisions across 4 dossiers — the union is clean.
- **Cost:** ~7 sub-agents per dossier this wave (3 gather + 1 agent-index + 3 CoVe-factored audit verifiers) + lead orchestration. The 3-verifier factored audit is the delta over the pilot's ~5/topic; batching it to fewer decoupled verifiers is a viable proportionality lever (see BURN_IN candidates).
- **Steady-state wave size:** 3-wide worked cleanly end-to-end. Keep 3-wide for Wave 2.

## Operational learnings (BURN_IN candidates → feed to `~/Claude/research_toolkit/`)

- **`bake-forward-lessons`** — carry the previous dossier's vocab/tiering corrections into the next dossier's gather-agent prompt. #7 was first-merge-clean + audit-clean because #6's fixes (controlled enums; cache_manifest schema_version 2; escalations stay out of `bib_ledger`; no "tertiary"/"playwright_rendered") were pre-stated. High value; cheap.
- **`merge-projects-fresh`** — the cross-project merge is `~/Claude/_merge_projects.py` (keys on record `id`; recurring `ent_`/`src_`/`graph_cache_` ids ARE the shared nodes; asserts no claim/evidence id recurs). The handoff's `rl_and_control` mirror does not exist — this corrects a stale reference.
- **`topic-backlog-validator-mismatch`** (toolkit scaffold-gap) — `validators/topic_backlog.py` expects top-level `entries:`, but `topic-backlog.yml` (and seemingly the workflow) uses `candidates:`. Pre-existing (HEAD fails too); the backlog is not a strict-live gate, but the validator/file should be reconciled.
- **`cove-audit-batched-verifiers`** — running the CoVe-factored audit as ~3 *batched* decoupled verifiers (partitioned by source, each WITHOUT the dossier prose) preserves the anti-post-rationalization property at a fraction of the one-agent-per-question cost. Proportionate.

## Wave 2 — queued (per D6; review-gated before Wave 3)

- **`guardrails`** (`env-guardrails` node) — .claudeignore, Always/Ask/Never, reversibility cues; sandbox shift + Replit lessons. Cross-links `repo_design` negative-space.
- **`cross-domain`** (`env-cross-domain` node) — INTERFACE.md, shallow-index-deeply-linked, ADRs-over-arch-docs, large-repo/monorepo structure (the deferred #6 boundary).
- **`memory`** (`mem-antipatterns` node) — typed/decay memory, the doc-vs-memory boundary (touched by #7), repo-as-memory limits.
- Reuse the proven recipe + disjoint atom-ID prefixes (`claim_guardrails_*`, `claim_cross_domain_*`, `claim_memory_*`) + `_merge_projects.py` (extend the project list to 7). Bake forward this wave's lessons.

## Per-dossier recipe + tooling (unchanged, proven)

Recipe: `2026-05-26_wave1-progress-handoff.md` §"battle-tested per-dossier recipe". Tooling: `~/Claude/_build_excerpt_anchor.py` (anchors), `~/Claude/_merge_tracks.py` (within-project), `~/Claude/_merge_projects.py` (cross-project, NEW). Toolkit venv: `~/Claude/research_toolkit/.venv/bin/python`. Skills all load.

## Tasks

Wave 1 tasks #1–#9 (this program's internal numbering) **all completed**. Wave 2 not yet started.
