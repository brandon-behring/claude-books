# Session handoff — post-pilot review COMPLETE + Wave 1 dossier 1/3 done

**Date:** 2026-05-26 · **Branch:** `research-program-v0` (NOT merged to `main`) · **Resume at:** Wave 1 dossier 2 (`repo_design`) — task #6.

Supersedes `2026-05-26_session_handoff.md` (which resumed at the co-drive review — now done).

---

## Resume in one line

The six parked decisions are **resolved** (D1–D6, canonical in [`docs/research-program/decisions.md`](../../research-program/decisions.md)) and committed; **Wave 1 dossier #1 `context_rot` is complete + validated + exported**. **Next: build dossiers #2 `repo_design` and #3 `claudemd_discipline`** with the now-battle-tested per-dossier recipe (below), then **task #8** (cross-project merge + bridge into the repo), then **task #9** (review gate → Wave 2). The user paused here to bank dossier 1; resume cleanly.

## What's done (this session)

1. **Co-drive post-pilot review — COMPLETE.** All six parked decisions resolved one-at-a-time. Canonical ADR-style record: `docs/research-program/decisions.md`. Folded into `taxonomy.md` / `trajectories.md` / `README.md` / `content-map.md`; the active plan file's parked list flipped to resolved. **Committed `0f8be5b`.** Meta-pattern surfaced: *cheap discipline/structure now; machinery on a real trigger* (memory: `feedback_anti_overengineering`).
2. **Phase A — COMPLETE + committed (`0f8be5b`).** Backbone docs + BURN_IN notes (`ctxasm-1..6` in the toolkit's `BURN_IN_NOTES.md` + `burn_in.yml`) + memory pointer.
3. **Wave 1 dossier #1 `context_rot` — COMPLETE, all gates green** (external: `~/Claude/research_agent_context_rot/`):
   - 8 verified primaries, 13 atoms / 5 claim-families. `/citation-audit` **13/13 verbatim-clean**. `/dossier-audit` (CoVe) **round-1 clean**. `/freshness-audit --strict` exit 0. `synthesis.md` (D4 typed layer, 5 grounded `syn_` claims). `agent_index/` (README + overview + 5 family files + `pre_selection_manifest`). Exported + validated: `~/Claude/research-kb/inbox/research_toolkit/research_agent_context_rot.jsonl`.
   - **2 launchpad errors caught** (verify-then-cache, reproduced): the ~1M-token ceiling (escalated, not laundered) and the "dumb zone/40%" figure misattributed to HumanLayer's Factor-3 doc (escalated — the doc doesn't contain it).
   - **Cross-project merge test primed:** `liu2024lostmiddle` is in *both* `context_rot` and the pilot at the same `primary_url` (`arxiv.org/abs/2307.03172`) — task #8 must dedup it and reconcile its `claim_family` (pilot: `attention_placement`; rot: `positional_degradation`).

## New, reusable tooling built this session (battle-tested — use for dossiers 2–3)

- **`~/Claude/_build_excerpt_anchor.py`** — deterministic v3 `excerpt_anchor` producer (byte offsets + `sha256_of_span`), matching `validators/v2_common.verify_excerpt_anchor` exactly; self-verifies. **Verified: reproduces a known-good pilot anchor byte-for-byte.** Closes the pilot's BURN_IN "no mechanical anchor producer" gap. Usage: `printf '%s' "<excerpt>" | python3 ~/Claude/_build_excerpt_anchor.py --text-path "~/Claude/research_cache/<text_path>" --cache-id <id>`. Gather agents MUST use this (never hand-author offsets/sha256).
- **`~/Claude/_merge_tracks.py`** — generalized within-project track merge (takes `<project_dir>` as argv[1]; dedups bib by `primary_url`, unions evidence/cache IDs, remaps aliases). Run with the toolkit venv python.
- (Both are `~/Claude/` scratch helpers, like the pilot's `_anchor_tmp.py` — promote to the toolkit only if they earn it across waves.)

## KEY FINDING — skills ARE available this session (the prior handoff is wrong on this)

All toolkit skills are symlinked + load unconditionally (the `paths:`-frontmatter bug `cc-skills-paths-hides-pipeline` was fixed): `research-plan`, `research-gather`, `agent-index`, `dossier-audit`, `citation-audit`, `freshness-audit`, `research-kb-export`. A clean session can invoke them directly (or have sub-agents invoke them). The prior handoff's "/research-plan absent" note is OUTDATED.

## The battle-tested per-dossier recipe (just ran it clean on `context_rot`)

Each topic → `~/Claude/research_agent_<slug>/`. Toolkit venv python = `~/Claude/research_toolkit/.venv/bin/python`.

1. **Hand-author `research_plan.md`** from `~/Claude/research_toolkit/templates/research_plan.template.md` (4–6 sub-areas + claim families + out-of-scope + landmarks). Validate: `validators/research_plan.py <dir>/research_plan.md`.
2. **Gather via ~3 parallel per-track sub-agents** (general-purpose), each ~2 sub-areas, cap ~28 calls, writing **per-track files** `{bib,evidence,cache,gather_trace}_ledger.<trackX>.yml`. **CRITICAL lessons from dossier 1:**
   - **Assign WIDE DISJOINT evidence_id + claim_id ranges per track up front** (e.g., trackA `_0001+`, trackB `_0101+`, trackC `_0201+`). Dossier 1 hit a near-collision (B and C both started at `_0005`); the merge asserts unique `evidence_id`, so overlap fails it.
   - Each agent: WebFetch+VERIFY title/author/year from the primary (the launchpad had 2 errors) → `cache_source.py "<url>" --topic <slug> --escalate-on-failure` → exact verbatim sub-sentence excerpts → `_build_excerpt_anchor.py` → v3 entries. Honest tiering; folk figures → `escalate_to_manual`, never launder.
   - One gather agent hit a transient 500; recover by inspecting partial files + re-running that track with sources pre-specified + disjoint IDs.
3. **Merge:** `python ~/Claude/_merge_tracks.py <dir>` → canonical files; then `scripts/build_claim_graph.py <dir>`.
4. **Validate canonical:** `validators/{bib_ledger,evidence_ledger,cache_manifest,gather_trace,claim_graph}.py` + `scripts/verify_citations.py <dir> --today 2026-05-26` (must be N/N clean; this fires the anchor checks on canonical filenames).
5. **`/agent-index`** — ONE cohesive agent. Attribute-First, group by claim_family, 5-bullet atomic blocks w/ stable atom IDs. **D4 constraint:** NO `verification_method: cross_reference` synthesis rows (the skill's literal example predates v3 — `ctxasm-4`); interpretive synthesis → `synthesis.md`.
6. **`synthesis.md`** — hand-author the D4 typed grounded layer: `syn_<slug>_NN` claims, each citing the atom IDs it rests on, marked grounded-not-substring-audited. Add the book-facing content-map hook.
7. **`/dossier-audit`** — independent CoVe agent, narrow focus (claim-support, attribution, tiering, no-laundering, synthesis grounding). Expect round-1 clean; apply CORRECT/DROP, write `dossier_audit_report.md` + a round-1 note in `agent_index/README.md`.
8. **`freshness.py --strict` + `build_dashboard.py` + `research_kb_export.py <dir> --date 2026-05-26`** (validate the export jsonl).

## Wave 1 topics remaining

- **#2 `repo_design`** (env-eng foundation). Seeds: HumanLayer, Phil Schmid, Morph, the ETH AGENTS.md study, agents.md, SIG study. claim families e.g. legibility-for-agents · examples-as-constraints · negative-space · failure-breadcrumbs.
- **#3 `claudemd_discipline`** (highest book-value — convergence with *shipped* Handbook Ch2). Seeds: HumanLayer <60-line discipline, ETH study (auto-gen −3%/+20% cost; human +4%/+19%), 60k AGENTS.md repos, progressive disclosure.
- These two **cross-link heavily and likely share sources** (HumanLayer, ETH study, agents.md) → the intra-wave merge test (D6). Give them **disjoint atom-ID prefixes across dossiers** too if you want clean cross-project IDs.

## Then: task #8 (cross-project merge + bridge) and task #9 (review → Wave 2)

- **#8 cross-project KG-compose merge:** generalize `_merge_tracks.py` one scope up — dedup bib + cache by `primary_url` + `sha256` ACROSS the 3 dossiers + the pilot; union claim-graphs; reconcile `liu2024lostmiddle`'s two `claim_family` framings; normalize the `cache_manifest` `schema_version` (Track C used 3, Track A used 2 — cosmetic). Mirror `rl_and_control/scripts/build_graph_export.py`. **Bridge:** flip the 3 nodes to `ingested`/`strict-live` in `docs/research-program/taxonomy.graph.json`, update `trajectories.md` + `content-map.md`, **commit** (the only in-repo writes; dossiers stay external).
- **#9 review gate → Wave 2:** confirm the per-topic pipeline + cross-project merge held at 3-wide; settle steady-state wave size; queue Wave 2 (`guardrails` + `cross-domain` + `memory`).

## Tasks

Task list: #1–#5 **completed**; #6 `repo_design`, #7 `claudemd_discipline`, #8 merge+bridge (blocked by #3,#5,#6,#7), #9 review (blocked by #8) **pending**. Resume by setting #6 `in_progress`.

## Operational learnings (candidate BURN_IN / carry forward)

- Disjoint per-track ID ranges (above) — add to the gather-agent prompt template.
- `dossier-audit` FLAG-B: `build_claim_graph` writes coarse source-tier claim confidences (0.95/0.6) that diverge from finer `evidence_ledger` link_confidence — cosmetic, evidence_ledger is authoritative; toolkit-level fix candidate.
- The launchpad docs ("compass" + "Environment Engineering and Context Assembly…") remain useful seed lists but **keep erroring** (2 catches in dossier 1 alone) — always verify against primaries.
