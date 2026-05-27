# Session handoff — Wave 2 COMPLETE (3 dossiers + 7-wide merge + bridge + toolkit hygiene)

**Date:** 2026-05-26 · **Branch:** `research-program-v0` (NOT merged to `main`) · **Resume at:** Wave 3 (review gate passed).

Supersedes `2026-05-26_wave1-complete-handoff.md` (which resumed at Wave 2 — now all done).

---

## Resume in one line

**Wave 2 is complete and validated.** Three strict-live dossiers (`guardrails`, `cross-domain`, `memory`) are built, audited, exported, and **bridged into the repo**; the cross-project KG-compose merge **proves D2/D5 at 7-wide** (464→451 records, **0 atom-ID collisions**). Two flagged toolkit items are cleared. The review gate passed. **Next: Wave 3 — the next editorial-priority trio** (candidates below) using the now-five-times-proven per-dossier recipe + `_merge_projects.py`.

## What's done (this session)

1. **Dossier `guardrails`** (`~/Claude/research_agent_guardrails/`, node `env-guardrails`) — 8 sources, 19 atoms, 4 families (permission_model · read_boundaries · reversibility_and_failsafe · isolation_as_permission_relaxer). `verify_citations` **23/23**. CoVe audit r1: 0 DROP / 1 documentary CORRECT (the one-source-two-families `anthropic_permissions`) / 0 FLAG. `freshness --strict` OK. `synthesis.md` (5 `syn_guardrails_*`). Exported (66 records). **Catch:** **`.claudeignore` is a folk claim** — not an official feature; the real mechanism (`permissions.deny` `Read(...)`) anchored instead. The **84%** sandbox prompt-reduction anchored verbatim + tiered as a self-reported internal metric. Replit DB-deletion verified (1,200+/1,190+ deleted, kept distinct from ~4,000 *fabricated*).
2. **Dossier `cross-domain`** (`~/Claude/research_agent_cross_domain/`, node `env-cross-domain`) — 12 sources, 21 atoms, 4 families (interface_contracts · shallow_index_deep_links · adrs_over_arch_docs · monorepo_structure). `verify_citations` **21/21**. CoVe r1: 0 DROP / 0 CORRECT / 0 confirmed FLAG (one raised — "all monorepo offsets drifted" — **refuted** as a verifier char-vs-byte false positive; byte-level recheck 0/21 mismatches). `synthesis.md` (5 `syn_cross_domain_*`). Exported (78 records). **Catches:** **`INTERFACE.md`** and **"shallow index, deeply linked"** are folk coinages (zero attestation) — generalized to the real patterns; ADRs confirmed a real convention, kept distinct from `repo_design`'s Swan atom (zero source overlap).
3. **Dossier `memory`** (`~/Claude/research_agent_memory/`, node `mem-antipatterns`) — 13 sources, 17 atoms, 4 families (typed_memory · decay_and_staleness · doc_vs_memory_boundary · repo_as_memory_limits). `verify_citations` **25/25**. CoVe r1: 0 DROP / 1 CORRECT applied (chen pub-date 2025-02-18→2026-02-18 from cached JSON-LD) / 0 FLAG. `synthesis.md` (5 `syn_memory_*`). Exported (81 records). **Frames:** "memory unsolved mid-2026" attributed to ONE named vendor (Mem0), NOT consensus; the unifying thesis "memory = recalled context" bridges to `context_rot`. Mem0 post dated **2026-05-27** (one day after `current_as_of`) — flagged volatile, recheck after 2026-06-26.
4. **7-wide cross-project KG-compose** — ran `~/Claude/_merge_projects.py` across all 7 projects (pilot + 3 Wave-1 + 3 Wave-2): **464 raw → 451 composed** (13 shared nodes collapsed); **5 shared sources** (agentsmd_spec, liu2024lostmiddle, anthropic_ccbestpractices, ji2025manus, anthropic_contexteng) + **4 shared caches**, resolved by `primary_url` + `sha256`; HumanLayer same-as applied; **0 claim/evidence ID collisions** (disjoint-prefix discipline held at 7-wide). Output: `~/Claude/research-kb/composed/{wave2_source_registry.yml, wave2_claim_graph.jsonl, wave2_merge_report.md}` (the 4-wide `wave1_*` snapshot preserved).
5. **Bridge committed in-repo:** `taxonomy.graph.json` (3 nodes → `ingested`/`strict-live` + `project_slug`, summaries corrected to drop the folk coinages), `trajectories.md` (3 rows → DOSSIER COMPLETE), `content-map.md` (Wave-2 note + 7-wide KG pointer), `topic-backlog.yml` (sandbox-infra traceability note).
6. **Toolkit hygiene** (`~/Claude/research_toolkit/`, separate repo, not yet committed) — (A) **7 BURN_IN entries** formalized (`burn_in.yml` `w2-*` + a `BURN_IN_NOTES.md` Wave-2 section): the 4 carried candidates + 3 new lessons (one-excerpt-per-evidence, CoVe byte-vs-char false-positive, cross-track fetch-id). (B) **`validators/topic_backlog.py` reconciled** — a schema discriminator now validates both the `/topic-discovery` (`entries:`) and research-program (`candidates:`/`kind: topic-backlog`) schemas; +9 tests, `make test` **389 passed + 2 xfailed**; the repo backlog now validates clean.

## Review-gate assessment

- **The per-topic pipeline is robust at five-times scale.** The 8-step recipe ran to all-gates-green for all three Wave-2 dossiers; it is now proven on pilot + 6 dossiers.
- **Carry-forward compounds (again).** Baking each dossier's enum/tiering corrections into the next one's gather prompts kept all three first-merge-clean. The two genuine validate-time catches (the one-excerpt-per-entry span bundling; the 5 JS-rendered anchor slices) were caught by the *mechanical* gates (`evidence_ledger.py` + `verify_citations`) and fixed deterministically — the gates work.
- **The cross-project merge (D2/D5) holds at 7-wide.** Entity resolution by `primary_url` + `sha256` resolved 5 shared sources + 4 shared caches; the disjoint topic-prefixed atom-ID discipline produced **zero** collisions across 7 dossiers.
- **Verify-then-cache reproduced three more times.** `.claudeignore`, `INTERFACE.md`, and "shallow index, deeply linked" were all folk coinages caught and generalized/escalated — never laundered. This is now the program's most reliable finding.
- **Cost:** ~7 sub-agents per dossier (3 gather + 1 agent-index + 3 CoVe verifiers) + lead orchestration; the batched-by-source CoVe verifiers (blind to the prose) held the anti-rationalization property at proportionate cost.
- **Steady-state wave size:** 3-wide worked cleanly a second time. Keep 3-wide for Wave 3.

## Wave 3 — candidates (pick by the editorial depth-gate, D3; not a momentum score)

D6 specified Waves 1–2; Wave 3 is the next trio, chosen by importance + mastery-gap + book-need (depth stays editorial). Strong candidates from `trajectories.md` (all 🔥) + natural cross-links:

- **`env-skills`** (Skills & progressive disclosure) — first-class Anthropic artifact (Jan-2026); cross-links cross-domain's progressive-disclosure-at-scale.
- **`tool-minimization`** (subtract-first) — strong 2026 case studies; pairs with **`mcp-design`** (MCP design & security; roadmap moving fast).
- **`eval-harnesses`** ("build evals before harnesses"; 2 Anthropic T1 sources).
- **`ops-security`** (prompt-injection / supply-chain / malicious-skill registries) — hot + serious; the adversarial counterpart to guardrails.
- **`ops-sandboxes`** (rel-sandboxes) — the **deferred guardrails infra** (OS-isolation internals, self-hosted Managed Agents sandboxes, MCP tunnels); the guardrails dossier's 2 `escalate_to_manual` rows already mark the seam, so this is a clean pickup.

A natural editorially-coherent trio: **`env-skills` + `tool-minimization` + `mcp-design`** (the "tools & extensibility" cluster), OR **`ops-security` + `ops-sandboxes` + `eval-harnesses`** (the "production safety & verification" cluster). Confirm the pick with the user (the depth-gate is editorial).

## Per-dossier recipe + tooling (unchanged, proven 6×)

Recipe: `2026-05-26_wave1-progress-handoff.md` §"battle-tested per-dossier recipe" (8 steps). Tooling: `~/Claude/_build_excerpt_anchor.py` (anchors — gather agents MUST use, never hand-author), `~/Claude/_merge_tracks.py` (within-project), `~/Claude/_merge_projects.py` (cross-project; relabel the output prefix per wave). Toolkit venv: `~/Claude/research_toolkit/.venv/bin/python`. **Bake forward the Wave-2 lessons** (`burn_in.yml` `w2-*`): one-excerpt-per-evidence-entry; distinctive `fetch_<bibkey>` ids per track; verifiers must not recompute byte offsets.

## Tasks

Wave 2 (this program's internal numbering: dossiers #10–#12 + merge #13 + review #14) **all completed**. Toolkit changes staged in `~/Claude/research_toolkit/` (commit separately). Wave 3 not yet started.
