# Session handoff — Wave 7 COMPLETE (Prompting & Structured Output D4 cluster + 23-wide merge) — D4 CLOSED, all five cert domains now strict-live

**Date:** 2026-05-27 · **Branch:** `research-program-v0` (NOT merged to `main`) · **Resume at:** no further wave queued — likely pivot to book authoring (the KG now backs all 5 cert domains).

Supersedes `2026-05-27_wave6-complete-handoff.md` (which resumed at the editorial pick — D4 was one of the named options; this took it). **This closes D4 — the last cert domain without strict-live coverage — so the composed KG now backs all five cert domains D1–D5.**

---

## Resume in one line

**Wave 7 is complete and bridged.** Three strict-live dossiers (`prompt_engineering`, `structured_output`, `prompt_evaluation`) — the **D4 Prompting & Structured Output cluster** — are built, audited, exported, and **bridged into the repo backbone** (2 cache→strict-live escalations + **1 new node** `prompt-evaluation`). The cross-project KG-compose merge **proves the graph at 23-wide** (1446 raw → 1404 composed, **0 claim/evidence ID collisions** asserted at merge). **23 topics are now strict-live across seven bridged waves**, and **this CLOSES D4 — all five cert domains D1–D5 now have strict-live coverage.** The Wave-7 bridge edits are staged but **NOT committed** (parent commits after review). **Next: no further wave queued** — likely a pivot to book authoring, or the deferred eval-tooling / benchmarks / ops-sandboxes / field-patterns stubs.

## What's done (this session — Wave 7)

| Dossier (slug) | Node (flip) | Sources | Atoms | Citation | CoVe r1 | Payload headline |
|---|---|---|---|---|---|---|
| `prompt_engineering` (`research_agent_prompt_engineering`) | `prompt-eng` (cache→strict-live) | 9 | 16 | 16/16 | **0 dropped / 2 corrected / 0 flagged** | Clarity/directness · multishot/few-shot · chain-of-thought · system-prompt roles · chaining — the consolidated prompting-best-practices discipline. Notable: **prefill is now DEPRECATED on Claude 4.6+ (returns 400)**; the per-technique guides are consolidated into one "Prompting best practices" page. **7 `syn_prompt_engineering_*`**. |
| `structured_output` (`research_agent_structured_output`) | `structured-output` (cache→strict-live) | 8 | 15 | 15/15 | **0/0/0 clean** | tool_use + JSON Schema; the strict/structured-outputs **guarantee rendered WITH its caveats** (refusals/max_tokens/unsupported-schema-subset — not overstated); validation/retry loops; extraction patterns. Now GA (beta header transitioning to `output_config.format`). **6 `syn_structured_output_*`**. |
| `prompt_evaluation` (`research_agent_prompt_evaluation`) | `prompt-evaluation` (**NEW node**, D4) | 5 | 13 | 13/13 | **0/0/0 clean** | Success criteria + empirical prompt testing + the iteration/tooling loop + grading. **HARD scope boundary held vs `eval_harnesses`** (Wave 3) — judge-calibration cross-linked, NOT re-derived; an agent-transcript-grading source was correctly escalated out of scope. **6 `syn_prompt_evaluation_*`**. |

The syn-claim counts are **7 / 6 / 6** (prompt_engineering / structured_output / prompt_evaluation). Two are cache→strict-live promotions; `prompt-evaluation` is the only +1 node (`node_count` **45→46**).

## 23-wide cross-project KG-compose

`WAVE=wave7 MERGE_DATE=2026-05-27 ~/Claude/_merge_projects.py` across all 23 projects: **1446 raw → 1404 composed** (42 shared records collapsed); **179 distinct sources, 21 shared, 6 shared caches**; **0 claim/evidence ID collisions** (disjoint-prefix discipline held at 23-wide — **asserted at merge**). Output: `~/Claude/research-kb/composed/wave7_*` (`wave7_source_registry.yml` + `wave7_claim_graph.jsonl` + `wave7_merge_report.md`). The 20-wide `wave6_*`, 17-wide `wave5_*`, **and** 12-wide `wave4_*` snapshots are **preserved byte-identical**.

**The compose arc across the push: 12 → 17 → 20 → 23 projects** (waves 4 → 5 → 6 → 7), **0 collisions throughout**, every prior snapshot byte-identical. The notable Wave-7 cross-wave links:
- **New shared source this wave: `anthropic2026promptengoverview`** — bridges `prompt_engineering` ↔ `prompt_evaluation` (the consolidated prompting overview seeds both the technique families and the success-criteria/empirical-testing families).
- **`building-effective-agents` now spans 4 dossiers** — `harness_frame` (frame_definition) + `harness_buildvsbuy` (decision criteria) + `multi_agent` (topologies) + `prompt_engineering` (the chaining family).
- The judge-calibration material is **cross-linked, not duplicated** — `prompt_evaluation`'s grading family points at `eval_harnesses`'s `llm_judge_calibration` rather than re-deriving it (the hard scope boundary, kept as a graph edge intent in the node summary).

Every shared source resolved by `primary_url`+`sha256`, all `claim_family` framings preserved (D2/D6). Shared-source count rose 20→21; shared caches held at 6.

## Bridge staged in-repo (NOT committed — parent commits after review)

- **`taxonomy.graph.json`** — `prompt-eng` + `structured-output` flipped `cache`→`strict-live` / `cached`→`researched` (`kb_status` stays `ingested`, **`frontier` stays `positioned`** — minimal change, band untouched), each with `project_slug` + per-dossier stats appended to `summary`; the **new node `prompt-evaluation`** added (section "Prompting & Structured Output", `frontier: positioned`, `type: topic`, `kb_status: ingested`, `tier: strict-live`, `priority: researched`, `project_slug: research_agent_prompt_evaluation`, `cert_domains: [4]`, `book_targets: ["architect-reference","handbook"]`, `volatility: evolving`); meta `note` got the Wave-7 sentence (`node_count` **45→46**, **23 topics strict-live**, 23-wide composed KG 1404 records 0 collisions, **D4 closed → all five cert domains strict-live**, edges unchanged). **Valid JSON confirmed; strict-live count = 23 confirmed; node_count = 46 confirmed.**
- **`trajectories.md`** — the 2 Prompting & Structured Output rows (`prompt-eng`, `structured-output`) → **DOSSIER COMPLETE** + stats + date 2026-05-27, and a new **`prompt-evaluation`** row added (mirrors the Wave-6 rows).
- **`content-map.md`** — a **Wave 7 complete (2026-05-27)** note: the 3 dossiers (syn counts **7 / 6 / 6**) + the 23-wide KG stats + book targets (Handbook **prompting chapters Ch3–4**; Architect's-Reference **D4 chapters** `prompt_engineering → structured_output → prompt_evaluation`). Explicitly notes this **CLOSES D4 and completes strict-live coverage across all five cert domains D1–D5**.
- **`topic-backlog.yml`** — no pre-existing D4 candidates to mark covered; 3 new candidates appended (`prefill-deprecation-migration` — teach the migration to structured outputs; `extended-thinking-as-api-feature` — deep pass on extended thinking as an API surface, distinct from prompt-level CoT; `prompt-eng-doc-consolidation-recheck` — spec-in-transition recheck on the per-technique→consolidated-page doc reshuffle + redirect churn). **Valid YAML confirmed.**

## Methodology notes (this wave)

- **Don't-overstate-the-guarantee (`structured_output`).** The strict/structured-outputs guarantee is rendered **WITH its caveats** — refusals, `max_tokens` truncation, and the unsupported-schema-subset are anchored alongside the guarantee, so the book teaches it as bounded, not absolute. Structured outputs are now GA (the beta header is transitioning to `output_config.format`).
- **Hard scope boundary held under topical adjacency (`prompt_evaluation` vs `eval_harnesses`).** `prompt_evaluation` (Wave 7, D4) is the prompt-level discipline — success criteria, empirical prompt testing, iteration/tooling, grading. `eval_harnesses` (Wave 3) is the systems-level measurement layer. The two are adjacent and tempting to merge; judge-calibration was **cross-linked, not re-derived**, and an agent-transcript-grading source was **correctly escalated out of scope** rather than pulled into the prompt-eval dossier.
- **Spec-in-transition reused twice (`prompt_engineering`).** Two transition facts captured cleanly: (1) **prefill is DEPRECATED on Claude 4.6+ (returns 400)** — anchored as a deprecation fact, migration recipe deferred to backlog; (2) the per-technique prompting guides are **consolidated into one "Prompting best practices" page** — the anchored excerpts are verbatim to the current consolidated page, with the redirect churn (302→308) flagged. Same dual-layer freshness discipline as the Wave-4 MCP and Wave-6 OTel items.

## The 2 `prompt_engineering` CoVe CORRECTs (non-blocking, already applied)

CoVe round-1 on `prompt_engineering` was **0 dropped / 2 corrected / 0 flagged**. Both CORRECTs were **confidence-factor prose nits, not excerpt/claim changes**:
1. **Redirect codes 302→308** — the multishot and chain-prompts per-technique URLs return a **permanent 308** redirect to the consolidated page, not a temporary 302 (the confidence-factor prose had said 302).
2. **"404s"→soft-404 wording** — an old per-technique URL was described as returning a hard 404; it actually returns a **soft-404** (200 with a not-found body / redirect-to-index). Wording corrected.

Neither touched an anchored excerpt or a `syn_*` claim — the 7 `syn_prompt_engineering_*` claims and all 16 atoms stand as-gathered.

## Review-gate assessment

- **The per-topic pipeline is robust at twenty-two-times scale** (pilot + 22 dossiers). The recipe ran to all-gates-green for all three Wave-7 dossiers; **CoVe round-1 was 0/0/0 clean on two of three**, and the third (`prompt_engineering`) had only 2 prose-nit CORRECTs (no excerpt/claim impact).
- **The cross-project merge holds at 23-wide.** The D4 corpus is *not* disjoint — `prompt_engineering` shares `building-effective-agents` with the D1 spine (now 4-way) and the new `anthropic2026promptengoverview` bridges the two D4 dossiers — and the merge resolved all of them (0 collisions, every framing kept). Shared sources rose 20→21.
- **D4 is now complete — and with it, every cert domain has strict-live coverage.** `prompt_engineering` + `structured_output` + `prompt_evaluation` close the Prompting & Structured Output cluster; combined with D1 (Agents & Orchestration), D2 (Tools & MCP), D3 (Environment Engineering), and D5 (Production Operations), **all five cert domains D1–D5 are now backed by strict-live, atom-grain research.**
- **Scope discipline intact under adjacency pressure.** The `prompt_evaluation` ↔ `eval_harnesses` boundary was held (cross-link, don't re-derive); the structured-outputs guarantee was rendered with its caveats, not overstated.

## What is NOT done (for the parent)

Wave 7 (3 D4 dossiers + 23-wide merge + in-repo bridge + this handoff) **all completed except the parent commit + memory update + toolkit burn-in**. Bridge edits staged on `research-program-v0` (uncommitted by design). Commits stay local (branch is ahead of origin across all seven waves; push only on request).

## Open items (none block the commit)

- **(a) Dated rechecks still pending (auto-flagged, not yet due).**
  - **MCP RC recheck — 2026-07-28.** The 5 `mcp_design` "coming" atoms (`stale_after_days: 62`, Wave 4) go stale exactly on **2026-07-28**; `/freshness-audit` will surface them then. Backlog `mcp-rc-2026-final-deep-pass` covers the MCP Apps / ext-tasks / Extensions deep pass + the D5 supersede.
  - **`ops_cost` pricing volatile recheck + Mem0 recheck — both after 2026-06-26.** The ops_cost cache multipliers / TTL / batch discount / tier ladder are vendor-published and move (backlog `ops-cost-pricing-volatile-recheck`); re-gather the exact per-MTok dollars if a chapter needs them (backlog `ops-cost-per-mtok-dollar-pricing`). The Wave-2 Mem0 volatile recheck shares the **after-2026-06-26** window. **Neither yet due.**
- **(b) Prefill-deprecation noted — migrate to structured outputs.** `prompt_engineering` captured that **prefill is DEPRECATED on Claude 4.6+ (returns 400)**; the book treatment should teach the migration to structured outputs (`output_config.format` / JSON Schema, see `structured-output`) and system-prompt roles. Backlog `prefill-deprecation-migration` holds the migration-recipe gather. Pairs with the structured-outputs GA transition.
- **(c) Toolkit burn-in candidates still unactioned (left to the toolkit's own workflow per the user).** The recurring friction points logged across the push — the `confidence.domains` 'medium'→'moderate' enum slip, the YAML colon / leading-quote friction — belong to `~/Claude/research_toolkit`'s `BURN_IN_NOTES.md` and its own dev loop. **Out of scope for this repo's bridge**; recorded here only so the lesson isn't lost.
- **Open items inherited from prior waves (unchanged, non-blocking):** the `sub_agents` `claude.com/blog` SPA live↔cache drift FLAG (cache is source of truth); harness-engineering vocabulary still settling (backlog `harness-engineering-vocabulary-settling`); Anthropic-vs-Cognition multi-agent tension deliberately unresolved (backlog `anthropic-vs-cognition-multiagent-tension`); the `twelve-factor-agents` / `deep-agents-pattern` / `agentic-engineering-vibe-coding` sub-topics still out of anchored scope; `advanced-tool-use-effect-sizes` (Wave 4) escalated figures to anchor; OTel GenAI semconv stabilization (backlog `otel-genai-semconv-stabilization`).

## Next (no wave queued — editorial pick)

There is **no further wave queued by default**. With D4 closed, the KG now backs **all five cert domains**, so the natural next move is the user's editorial pick:
- **Book authoring** — the strict-live backbone (22 dossiers, atom-grain, 23-wide composed KG spanning D1–D5) is now deep enough to drive Handbook + Architect's-Reference chapters directly; the D4 cluster specifically backs **Handbook prompting Ch3–4** + the Architect's-Reference **D4 chapters**, or
- The **deferred eval-tooling / benchmarks / ops-sandboxes / field-patterns stubs** (each intentionally deferred for want of an active book-consumer — promote only on a real book need).

Confirm the pick with the user before starting; the per-dossier recipe + 23-wide merge tooling are proven and ready if another research wave is chosen.

## Per-dossier recipe + tooling (unchanged, proven 22×)

Recipe: `2026-05-26_wave1-progress-handoff.md` §"battle-tested per-dossier recipe" (8 steps). Tooling: the toolkit's `scripts/build_excerpt_anchor.py` (v2.5.0, self-verifying); `~/Claude/_merge_tracks.py` (within-project); `WAVE=… MERGE_DATE=… ~/Claude/_merge_projects.py` (cross-project). Toolkit venv: `~/Claude/research_toolkit/.venv/bin/python`. Validators take a **file** path; `verify_citations`/`build_dashboard`/`build_claim_graph` take the **dir**.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
