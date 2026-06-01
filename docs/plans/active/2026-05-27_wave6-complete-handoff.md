# Session handoff — Wave 6 COMPLETE (Production Operations D5 spine + 20-wide merge) — the FULL Wave 5+6 push is DONE

**Date:** 2026-05-27 · **Branch:** `research-program-v0` (NOT merged to `main`) · **Resume at:** no further wave queued — editorial pick (review gate pending parent commit).

Supersedes `2026-05-27_wave5-complete-handoff.md` (which resumed at Wave 6 — now done). **This closes the full Wave 5 + Wave 6 push the user authorized** (both trios — D1 Agents & Orchestration + D5 Production Operations — plus the `capabilities_scaling` orphan bridge, run straight through in one session).

---

## Resume in one line

**Wave 6 is complete and bridged — and with it the whole authorized Wave 5+6 push.** Three strict-live dossiers (`ops_observability`, `ops_cost`, `ops_hitl`) — the **D5 Production Operations spine** — are built, audited, exported, and **bridged into the repo backbone** (all simple stub→strict-live flips; **no new nodes** this wave). The cross-project KG-compose merge **proves D1/D2/D5 at 20-wide** (1293 raw → 1253 composed, **0 claim/evidence ID collisions** asserted at merge). **20 topics are now strict-live across six bridged waves.** Wave 5's D1 spine + the orphan are already bridged in commits `32c3014` (bridge) / `f008429` (handoff). The Wave-6 bridge edits are staged but **NOT committed** (parent commits after review). **Next: no further wave queued** — the user's editorial pick (remaining D4 structured-output, the deferred eval-tooling/benchmarks/ops-sandboxes, or book authoring).

## What's done (this session — Wave 6)

| Dossier (slug) | Node (flip) | Sources | Atoms | Citation | CoVe r1 | Payload headline |
|---|---|---|---|---|---|---|
| `ops_observability` (`research_agent_ops_observability`) | `ops-observability` (stub→strict-live) | 9 | 19 | 19/19 | **0/0/0 clean** | Session logging (JSONL) + OTel GenAI semconv tracing + git attribution + cost/usage surfacing. Flagged the live **`/cost`→`/usage` rename**; OTel GenAI semconv still **Status: Development**. 6 `syn_ops_observability_*`. |
| `ops_cost` (`research_agent_ops_cost`) | `ops-cost` (stub→strict-live) | 6 | 13 | 13/13 | **0/0/0 clean** | Prompt-cache economics (**1.25× write / 0.1× read / 5-min TTL**) + input-heavy token ratios + the **4×/15× multi-agent figure** + model-tier/50%-batch levers. **Per-MTok dollars deliberately NOT anchored** (HTML table-cell splitting) — Haiku<Sonnet<Opus stated qualitatively, no laundered numbers. 5 `syn_ops_cost_*`. |
| `ops_hitl` (`research_agent_ops_hitl`) | `ops-hitl` (stub→strict-live) | 11 | 15 | 15/15 | **0/0/0 clean** | Approval gates + plan-mode + confidence-calibration escalation + branch-protection/PR-review/headless checkpoints — the oversight **workflow** on top of the guardrails permission **model**. CoVe confirmed the excluded **"3/20 denials"** mechanism is auto-mode-only (correctly out of scope). 6 `syn_ops_hitl_*`. |

All three are **simple stub→strict-live flips** — **no new nodes, no cache→strict-live promotions** this wave. `node_count` stays **45**.

**Wave-5 recap (already bridged — commits `32c3014`/`f008429`):** the **D1 Agents & Orchestration architecture spine** (`harness_frame` + `harness_buildvsbuy` stub→strict-live; `sub_agents` + `multi_agent` cache→strict-live) plus the `capabilities_scaling` **orphan bridged** as the new positioned node `agent-capabilities` (the only +1 node of the whole push). The D1 + D5 trios + the orphan = the full authorized push, now complete.

## 20-wide cross-project KG-compose

`WAVE=wave6 MERGE_DATE=2026-05-27 ~/Claude/_merge_projects.py` across all 20 projects: **1293 raw → 1253 composed** (40 shared nodes collapsed); **159 distinct sources, 20 shared, 6 shared caches**; HumanLayer same-as applied (1); **0 claim/evidence ID collisions** (disjoint-prefix discipline held at 20-wide — **asserted at merge**). Output: `~/Claude/research-kb/composed/wave6_*` (`wave6_source_registry.yml` + `wave6_claim_graph.jsonl` + `wave6_merge_report.md`). The 17-wide `wave5_*` **and** 12-wide `wave4_*` snapshots are **preserved byte-identical**.

**The compose arc across the push: 12 → 17 → 20 projects** (waves 4 → 5 → 6), **0 collisions throughout**, every prior snapshot byte-identical. The richest Wave-6 cross-wave overlaps:
- **`anthropic2025multiagentresearch` is now 3-way** — `multi_agent` (`topologies`) + `sub_agents` (`isolation_mechanism`) + `ops_cost` (`multi_agent_cost`).
- The Claude Code **permission/security/github-actions/code-review docs** span `ops_hitl` (approval_gates/escalation/planning_modes) + `ops_observability` (attribution) + `guardrails` (read_boundaries/reversibility) + `sub_agents` (roles) + `ops_security` (supply_chain_registries) + `harness_frame` (frame_definition).
- **`anthropic_contexteng` (effective-context-engineering) is 4-way** — `ops_cost` (token_ratios) + `context_assembly` (compaction) + `harness_frame` (frame_definition) + `memory` (repo_as_memory_limits).
- The Anthropic **prompt-caching** doc bridges `ops_cost` (kv_cache_economics) ↔ `context_assembly` (cache_stability).

Every shared source resolved by `primary_url`+`sha256`, all `claim_family` framings preserved (D2/D6). Shared-source count rose 14→20; shared caches 5→6.

## Bridge staged in-repo (NOT committed — parent commits after review)

- **`taxonomy.graph.json`** — 3 nodes (`ops-observability`, `ops-cost`, `ops-hitl`) flipped `not_ingested`→`ingested` / `stub`→`strict-live` / `near-term`→`researched`, each with `project_slug` + per-dossier stats appended to `summary`; meta `note` got the Wave-6 sentence (`node_count` **UNCHANGED at 45**, **20 topics strict-live**, 20-wide composed KG 1253 records 0 collisions, edges unchanged). **Valid JSON confirmed; strict-live count = 20 confirmed.**
- **`trajectories.md`** — the 3 Production Operations rows → **DOSSIER COMPLETE** + stats + date 2026-05-27 (mirrors the Wave-5 rows).
- **`content-map.md`** — a **Wave 6 complete (2026-05-27)** note: the 3 dossiers + the 20-wide KG stats + book targets (Architect's-Reference Production-Operations chapters observability/cost/oversight; Field-guide cost+observability patterns; Handbook Ch5 cost). Explicitly notes this **CLOSES the D5 Production Operations cluster's near-term stubs**.
- **`topic-backlog.yml`** — `prompt-caching-economics` → **covered** (now the ops_cost `kv_cache_economics` family); 3 new candidates appended (`ops-cost-per-mtok-dollar-pricing` — re-gather if a chapter needs exact dollars; `otel-genai-semconv-stabilization` — recheck when the OTel GenAI semconv reaches Stable; `ops-cost-pricing-volatile-recheck` — recheck after 2026-06-26). **Valid YAML confirmed.**

## Methodology notes (this wave)

- **Escalate-don't-launder under a numeric-extraction failure (`ops_cost`).** The per-MTok dollar prices on the Anthropic pricing page could not be cleanly extracted (HTML table-cell splitting fragmented the digits). Rather than launder a partially-parsed number, the dossier anchors only what extracts cleanly — the cache-write **1.25×** / cache-read **0.1×** *multipliers*, the 5-min TTL, the 50% batch discount — and states the **Haiku<Sonnet<Opus** ladder **qualitatively**. The exact dollars are a backlog re-gather item, not a book claim.
- **Announced-not-stable, reusing the dual-layer freshness convention (`ops_observability`).** The OpenTelemetry GenAI semantic conventions are anchored at **Status: Development** — phrased announced-not-stable, same discipline as the Wave-4 MCP "spec-in-transition" layer. Recheck when it reaches Stable (backlog `otel-genai-semconv-stabilization`). The live **`/cost`→`/usage`** command rename was caught and flagged.
- **Workflow-on-model scope boundary (`ops_hitl`).** `ops_hitl` is the oversight **workflow** (approval gates, plan-mode, escalation, branch-protection/PR/headless checkpoints) layered on top of the `guardrails` permission **model** — the two are kept distinct, not merged. CoVe confirmed the excluded **"3/20 denials"** mechanism is auto-mode-only and correctly out of scope.

## Review-gate assessment

- **The per-topic pipeline is robust at nineteen-times scale** (pilot + 19 dossiers). The recipe ran to all-gates-green for all three Wave-6 dossiers; **CoVe round-1 was 0/0/0 clean on every one** — the cleanest wave of the push.
- **The cross-project merge holds at 20-wide.** The Production-Operations corpus is *not* disjoint — it shares the multi-agent-research, prompt-caching, context-engineering, and the Claude Code permission/security/actions/review docs widely with D1/D2/D5 neighbors, and the merge resolved all of them (0 collisions, every framing kept). Shared sources rose 14→20.
- **D5 Production Operations is now complete (near-term).** `ops_observability` + `ops_cost` + `ops_hitl` join the already-strict-live `ops_security`; the cluster's near-term stubs are closed. Only `ops-sandboxes` remains deferred (intentional — no active book-consumer for OS-isolation infra).
- **Escalate-don't-launder held under extraction pressure.** The ops_cost dollar-figure extraction failure was handled by anchoring multipliers + a qualitative ladder, not a laundered number — tier/honesty discipline intact.

## What is NOT done (for the parent)

Wave 6 (3 D5 dossiers + 20-wide merge + in-repo bridge + this handoff) **all completed except the parent commit + memory update + toolkit burn-in**. Bridge edits staged on `research-program-v0` (uncommitted by design). Commits stay local (branch is ahead of origin across all six waves; push only on request).

## Open items (none block the commit)

- **(a) `sub_agents` `claude.com/blog` SPA live↔cache drift FLAG (still pending, non-blocking).** The blog is a client-rendered SPA whose live DOM diverged from the cached snapshot at gather time; the anchored excerpt is verbatim to the **cache** (the cache is the source of truth), the CoVe FLAG records the drift. Recheck whether the live SPA content stabilizes (or moves to a static URL); if it diverges materially, mint a corrected atom. No book claim is at risk.
- **(b) MCP RC recheck (auto-flagged, still pending from Wave 4 — 2026-07-28).** The 5 `mcp_design` "coming" atoms (`stale_after_days: 62`) go stale **exactly on 2026-07-28**; `/freshness-audit` will surface them then. Backlog `mcp-rc-2026-final-deep-pass` covers the MCP Apps / ext-tasks / Extensions deep pass + the D5 supersede. **Not yet due.**
- **(c) `ops_cost` pricing volatile recheck + Mem0 recheck — both after 2026-06-26.** The ops_cost cache multipliers / TTL / batch discount / tier ladder are vendor-published and move (backlog `ops-cost-pricing-volatile-recheck`); re-gather the exact per-MTok dollars if a chapter needs them (backlog `ops-cost-per-mtok-dollar-pricing`). The Wave-2 Mem0 volatile recheck shares the **after-2026-06-26** window. **Neither yet due.**
- **(d) Toolkit burn-in candidates surfaced this push (flagged for the SEPARATELY-MANAGED toolkit — NOT actioned here).** Two recurring friction points logged for the research-toolkit's own workflow: (1) the **`confidence.domains` 'medium'→'moderate' enum slip** (the gather step recurrently emits `medium` where the schema expects `moderate`), and (2) **YAML colon / leading-quote friction** in gather output (un-quoted values containing colons, and leading-quote escaping, repeatedly need a hand-fix before parse). These belong to `~/Claude/research_toolkit`'s `BURN_IN_NOTES.md` and its own dev loop — **out of scope for this repo's bridge**; recorded here only so the lesson isn't lost.
- **Open items inherited from Wave 5 (unchanged):** harness-engineering vocabulary still settling (backlog `harness-engineering-vocabulary-settling`); Anthropic-vs-Cognition multi-agent tension deliberately unresolved (backlog `anthropic-vs-cognition-multiagent-tension`); `twelve-factor-agents` / `deep-agents-pattern` / `agentic-engineering-vibe-coding` parents went strict-live but the sub-topics stayed out of anchored scope; `advanced-tool-use-effect-sizes` (Wave 4) escalated figures to anchor.

## Next (no wave queued — editorial pick)

The full authorized Wave 5+6 push is done. There is **no further wave queued by default** — the next move is the user's editorial pick:
- **Remaining D4 structured-output** (`structured-output` node — currently positioned/cache), or
- The **deferred eval-tooling / benchmarks / ops-sandboxes** stubs (each intentionally deferred for want of an active book-consumer — promote only on a real book need), or
- **Book authoring** — the strict-live backbone (20 dossiers, atom-grain, 20-wide composed KG) is now deep enough to drive Architect's-Reference + Handbook chapters directly.

Confirm the pick with the user before starting; the per-dossier recipe + 20-wide merge tooling are proven and ready if another research wave is chosen.

## Per-dossier recipe + tooling (unchanged, proven 19×)

Recipe: `2026-05-26_wave1-progress-handoff.md` §"battle-tested per-dossier recipe" (8 steps). Tooling: the toolkit's `scripts/build_excerpt_anchor.py` (v2.5.0, self-verifying); `~/Claude/_merge_tracks.py` (within-project); `WAVE=… MERGE_DATE=… ~/Claude/_merge_projects.py` (cross-project). Toolkit venv: `~/Claude/research_toolkit/.venv/bin/python`. Validators take a **file** path; `verify_citations`/`build_dashboard`/`build_claim_graph` take the **dir**.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
