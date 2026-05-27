# Session handoff — Wave 4 COMPLETE (Tools & Extensibility trio + 12-wide merge + bridge)

**Date:** 2026-05-27 · **Branch:** `research-program-v0` (NOT merged to `main`) · **Resume at:** Wave 5 (review gate passed).

Supersedes `2026-05-27_wave3-complete-handoff.md` (which resumed at Wave 4 — now done).

---

## Resume in one line

**Wave 4 is complete and validated.** Three strict-live dossiers (`env-skills`, `tool-minimization`, `mcp-design`) are built, audited, exported, and **bridged into the repo** (commit `2d08a22`); the cross-project KG-compose merge **proves D2/D5 at 12-wide** (828→813 records, **0 atom-ID collisions**). The user **confirmed the full trio** at the D3 editorial gate and **signed off the mcp-design scope** (design + governance/ecosystem) at `/research-plan`. A new reusable methodology — the **dual-layer "spec-in-transition" convention** — was adopted for the mid-transition MCP spec. The review gate passed. **Next: Wave 5** (candidates below) using the now-eleven-times-proven per-dossier recipe.

## What's done (this session)

1. **Dossier `env-skills`** (`~/Claude/research_agent_env_skills/`, node `env-skills`) — 7 sources, 22 atoms, 5 families (skill_artifact · progressive_disclosure · authoring_discipline · integration_surface · distribution_scale). `verify_citations` **22/22**. CoVe r1: **0/0/0 clean**. `freshness --strict` OK. `synthesis.md` (5 `syn_env_skills_*` — progressive disclosure is the payoff; the description is the load-bearing interface; Skill-vs-CLAUDE.md on the procedure-vs-fact axis; skills are ergonomics not a sandbox). Exported (65 records). **Catches:** the Agent Skills **launch date corrected to Oct 16 2025** (byline Zhang/Lazuka/Murag) from the launchpad's folk "Jan-2026"; the docs' per-level token figures ("~100 tokens") rendered as docs-stated, **not asserted as anchored claims**; the **adoption-prevalence** question escalated (no clean first-party primary — only uncitable aggregators); **all-first-party Anthropic** spine (no `<Tag kind="convergence">`).
2. **Dossier `tool-minimization`** (`~/Claude/research_agent_tool_minimization/`, node `tool-minimization`) — 6 sources, 18 atoms, 4 families (subtract_first_principle · case_studies · tool_design_heuristics · tool_evaluation). `verify_citations` **18/18**. CoVe r1: **0/0/0 clean** (the case-study figures verified verbatim against the live primaries). `freshness --strict` OK. `synthesis.md` (5 `syn_tool_minimization_*`). Exported (55 records). **Headline catch — the strict-live gather corrected the roadmap's folk case-study figures:** the real first-party numbers are **Vercel** "removed 80% → a single bash tool, 100% vs 80% success" (Dec 22 2025), **GitHub Copilot** "40 → 13 tools, +2-5pp" (Nov 19 2025), **Block** "30+ APIs/200+ endpoints → 3 MCP tools" (consolidation, *no* measured delta — `partial`; May 9 2025) — not the planned "16→1 / 30→2 / 8B-19-46-100 cliff". `syn_tool_minimization_02` is **the wave's one `<Tag kind="convergence">` candidate** (three *independent* teams), with the honest caveat each is a vendor self-report, not an independent benchmark. The escalated `advanced-tool-use` effect sizes (~85% token reduction; 79.5→88.1) were **not laundered** (backlog item added).
3. **Dossier `mcp-design`** (`~/Claude/research_agent_mcp_design/`, node `mcp-design`) — 12 sources, 32 atoms, 6 families (architecture · transports_lifecycle · primitives · authorization_design · spec_evolution · governance_ecosystem). `verify_citations` **32/32**. CoVe r1: **0/0/0 clean**. `freshness --strict` OK. `synthesis.md` (6 `syn_mcp_design_*`). Exported (100 records). **User-signed-off scope** (the wave's one checkpoint): **design + governance/ecosystem**, attack surface stays `ops_security` S3. **Catches:** the **dual-layer freshness convention** (below); the spec lists **four** key principles, not the cached "three" (no atom asserts a count); `04_authorization_design` renders the design-time OAuth posture, **not** the threat model (0109 is a MUST-NOT prohibition); the RC post is *version* 2026-07-28 but *posted* May 21 2026 (bib records both); two `synthesis.md` RC atom-refs were corrected pre-audit to match the anchored excerpts.
4. **12-wide cross-project KG-compose** — `WAVE=wave4 MERGE_DATE=2026-05-27 ~/Claude/_merge_projects.py` across all 12 projects: **828 raw → 813 composed** (15 shared nodes collapsed); **109 distinct sources, 7 shared, 4 shared caches**; HumanLayer same-as applied; **0 claim/evidence ID collisions** (disjoint-prefix held at 12-wide). Output: `~/Claude/research-kb/composed/wave4_*` (the 9-wide `wave3_*` and earlier snapshots **preserved byte-identical** — confirmed mtimes unchanged). **NOTABLE — first cross-wave source overlap:** unlike Waves 1–3 (where each new corpus was cleanly *disjoint*), Wave 4's Tools-&-Extensibility corpus **shares two sources with prior waves** — the Agent Skills post ↔ `claudemd_discipline` (`progressive_disclosure`), and the "writing effective tools" post ↔ `context_assembly` (`assembly_as_prompt`). The merge resolved both by `primary_url`+`sha256`, preserving both `claim_family` framings (D2/D6). Shared-source count rose 5→7.
5. **Bridge committed in-repo** (`2d08a22`): `taxonomy.graph.json` (3 nodes → `ingested`/`strict-live` + `project_slug`; **de-folked** the tool-minimization summary's 16→1/30→2 figures + env-skills' "Jan-2026"), `trajectories.md` (3 rows → DOSSIER COMPLETE), `content-map.md` (Wave-4 note + 12-project KG pointer + the dual-layer methodology), `topic-backlog.yml` (`mcp-primitives-resources-vs-tools` → covered; 3 new candidates).

## New methodology — the dual-layer "spec-in-transition" convention (the user's "best long-term solution")

MCP is mid-transition: the `2025-11-25` spec is authoritative today, the `2026-07-28` RC announces breaking changes. The durable pattern adopted (reuses existing schema fields — **cheap discipline, not new machinery**):
- **Anchor both layers as distinct atoms, each verbatim to a *dated* primary.** "What is" cites the current spec; "what's coming" cites the RC blog/changelog that *announces* it, phrased *"the 2026-07-28 RC announces X"* — **never asserted as current**.
- **"Coming" atoms get `stale_after_days` keyed to the transition date** (62 → 2026-07-28), so the freshness radar auto-flags the recheck the moment the RC lands; `supersedes`/`superseded_by` wire the replacement.
- Generalizes to any spec-in-transition topic. Logged to the toolkit burn-in (see below).

## Review-gate assessment

- **The per-topic pipeline is robust at eleven-times scale** (pilot + 11 dossiers). The 8-step recipe ran to all-gates-green for all three Wave-4 dossiers.
- **Verify-against-primary corrects *roadmap*-level folk figures, not just launchpad ones.** The tool-minimization case studies were stated in the program roadmap as 16→1/30→2; the gather found the real first-party numbers (80%→1, 30+→3). The discipline catches our own approximations.
- **The cross-project merge holds at 12-wide WITH genuine overlap.** The first cross-wave shared sources appeared and resolved cleanly (0 collisions, both framings kept) — a stronger D2 proof than the disjoint Waves 1–3.
- **The one human-checkpoint worked as designed.** Autonomous execution with a single scope sign-off (mcp-design) — the user broadened it to include governance/ecosystem and reframed the spec-version question into the reusable dual-layer convention.
- **CoVe stayed valuable.** Round-1 clean on all three, but the decoupled verifiers independently re-confirmed the case-study figures, the announced-not-current framing, the design-vs-threat boundary, and the "four principles" count.

## Wave 5 — candidates (pick by the editorial depth-gate, D3; not a momentum score)

Two coherent near-term clusters remain (both feed the greenfield Architect's Reference):
- **Agents & Orchestration** (cert D1): `harness-frame` (vocabulary crystallized Feb–Apr 2026), `build-vs-buy` (the active "use existing vs build" debate), and a deeper `sub-agents`/`multi-agent` pass. The D1 architecture spine.
- **Production Operations** (cert D5): `observability` (OTel + session logs + git attribution), `cost`/token-economics (KV-cache economics, cross-cutting), `human-in-the-loop` (approval gates, planning modes).

Still deferred (intentional, no active book-consumer trigger): `ops-sandboxes` (OS-isolation infra), `eval-tooling-landscape`, `benchmarks`. Confirm the Wave-5 pick with the user (the depth-gate is editorial).

## Per-dossier recipe + tooling (unchanged, proven 11×)

Recipe: `2026-05-26_wave1-progress-handoff.md` §"battle-tested per-dossier recipe" (8 steps). Tooling: the toolkit's **`scripts/build_excerpt_anchor.py`** (v2.5.0, self-verifying — Wave-4 gather briefs pointed here, the scratch twin untouched); `~/Claude/_merge_tracks.py` (within-project); `WAVE=wave5 MERGE_DATE=… ~/Claude/_merge_projects.py` (cross-project). Toolkit venv: `~/Claude/research_toolkit/.venv/bin/python`. Validators take a **file** path (not the dir); `verify_citations`/`build_dashboard`/`build_claim_graph` take the **dir**. **Bake forward the Wave-4 lessons** (below) into the next gather brief.

## Follow-ups / open items (none block Wave 5)

- **Orphan dossier `~/Claude/research_agent_capabilities_scaling/`** — a complete v3 dossier (built **May 20**, before the wave structure; green dashboard + citation-audit present) that is **not bridged, not in any composed KG, not in the repo backbone**. **Excluded from the 12-wide merge** (the program is the 9 + 3 = 12). Decide later whether to bridge it (it would need a taxonomy node + a wave slot) or formally retire it.
- **`w4-freshness-tier-no-fast-moving` (toolkit candidate):** the `freshness_tier` enum is `{volatile, active, stable, historical}` — no "fast-moving", and `volatile` caps `stale_after_days` at 30, too aggressive for a ~62-day known transition. The adopted convention is **`freshness_tier: active` + a `stale_after_days` keyed to the transition date**. Two gather agents hit this independently and adapted; reconcile in the toolkit (add a tier or document the convention).
- **MCP RC recheck (auto-flagged):** the 5 mcp-design "coming" atoms (`stale_after_days: 62`) go stale **exactly on 2026-07-28**; `/freshness-audit` will surface them then. Backlog item `mcp-rc-2026-final-deep-pass` covers the MCP Apps/ext-tasks/Extensions deep pass + the D5 supersede.
- **`advanced-tool-use-effect-sizes` (backlog):** the escalated Anthropic figures (~85% token reduction; 79.5→88.1) — gather that post as a primary to anchor them verbatim.
- **Mem0 volatile recheck:** the Wave-2 `memory` Mem0 source rechecks **after 2026-06-26** — not yet due.
- **Toolkit burn-in:** Wave-4 lessons logged to `~/Claude/research_toolkit` `BURN_IN_NOTES.md` (branch `wave4-burn-in`); the headline is the dual-layer convention + the `freshness_tier` gap.

## Tasks

Wave 4 (3 dossiers + 12-wide merge + in-repo bridge + handoff + memory + toolkit burn-in) **all completed**. Bridge on `research-program-v0` (`2d08a22`); this handoff committed separately (`docs(plans):`). Commits stay local (branch is ahead of origin across all four waves; push only on request). Wave 5 not yet started.
