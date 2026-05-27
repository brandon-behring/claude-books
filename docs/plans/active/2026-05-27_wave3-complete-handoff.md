# Session handoff — Wave 3 COMPLETE (2 dossiers + 9-wide merge + bridge + toolkit hygiene)

**Date:** 2026-05-27 · **Branch:** `research-program-v0` (NOT merged to `main`) · **Resume at:** Wave 4 (review gate passed).

Supersedes `2026-05-26_wave2-complete-handoff.md` (which resumed at Wave 3 — now done).

---

## Resume in one line

**Wave 3 is complete and validated.** Two strict-live dossiers (`ops-security`, `eval-harnesses`) are built, audited, exported, and **bridged into the repo** (commit `a91d4a8`); the cross-project KG-compose merge **proves D2/D5 at 9-wide** (608→595 records, **0 atom-ID collisions**). `ops-sandboxes` was deliberately **deferred** per the D3 depth-gate. A high-severity toolkit trap (the merge-clobber) surfaced and was **resolved**. The review gate passed. **Next: Wave 4 — the Tools & Extensibility trio** (candidates below) using the now-seven-times-proven per-dossier recipe + the (now WAVE-parameterized) `_merge_projects.py`.

## What's done (this session)

1. **Dossier `ops-security`** (`~/Claude/research_agent_ops_security/`, node `ops-security`) — 18 sources, 26 atoms, 5 families (prompt_injection_mechanism · indirect_injection_incidents · supply_chain_registries · exposed_instances_secrets · defense_patterns). `verify_citations` **30/30**. CoVe audit r1: **0 DROP / 0 CORRECT / 0 FLAG** (clean). `freshness --strict` OK. `synthesis.md` (5 `syn_ops_security_*` — lethal-trifecta-as-necessary-conditions hinge; design-by-construction over evadable detection). Exported (110 records). **Catches:** the folk **"~12–20% malicious skills"** figure was **escalated, not asserted** — the gather agent found the real registry-scan primary (*Agent Skills in the Wild*, arXiv:2601.10338: 5.2% malicious-intent / 26.1% vuln, neither matching the folk band); **EchoLeak's CVE-2025-32711 id was anchored from the NVD primary**, not the Cato/Aim write-up that lacked it; Anthropic's Chrome ASR (23.6%→11.2%) tiered as self-reported; LaTeX-only defense-efficacy figures (CaMeL 77/84, DataFlip) deliberately left unanchored. **Validate-time catch:** 19 non-canonical enums (`source_type` spec/academic, `source_quality` tertiary) → deterministically fixed to standard/paper/secondary; claim_graph rebuilt (source_quality feeds confidence).
2. **Dossier `eval-harnesses`** (`~/Claude/research_agent_eval_harnesses/`, node `eval-harnesses`) — 4 sources, 11 atoms, 4 families (build_first_principle · task_suite_design · llm_judge_calibration · eval_harness_boundary). `verify_citations` **11/11**. CoVe r1: **0 DROP / 1 CORRECT / 0 FLAG** — the CORRECT is a real-world fact the gather agent couldn't infer: the **UK "AI Safety Institute" → "AI Security Institute"** rename (14 Feb 2025; Inspect docs publisher). `freshness --strict` OK. `synthesis.md` (5 `syn_eval_harnesses_*`). Exported (34 records). **Spine:** 2 Anthropic T1 primaries — *Demystifying evals* (Jan-2026) + *A statistical approach to model evals* (**Nov-2024** — bibkey corrected `anthropic2026statevals`→`anthropic2024statevals` to match the verified date) — plus Inspect `--epochs` (mechanism only) + Zheng et al. LLM-judge agreement.
3. **9-wide cross-project KG-compose** — ran `~/Claude/_merge_projects.py` across all 9 projects (pilot + 3 Wave-1 + 3 Wave-2 + 2 Wave-3): **608 raw → 595 composed** (13 shared nodes collapsed — unchanged from Wave 2: the security/eval corpus is cleanly **disjoint** from env/context/memory); **same 5 shared sources + 4 shared caches** as Wave 2; HumanLayer same-as applied; **0 claim/evidence ID collisions** (disjoint-prefix discipline held at 9-wide). Output: `~/Claude/research-kb/composed/{wave3_source_registry.yml, wave3_claim_graph.jsonl, wave3_merge_report.md}` (the 7-wide `wave2_*` and 4-wide `wave1_*` snapshots preserved).
4. **Bridge committed in-repo** (`a91d4a8`): `taxonomy.graph.json` (2 nodes → `ingested`/`strict-live` + `project_slug`; ops-security summary de-folked, dropped the `(~12–20%)`), `trajectories.md` (2 rows → DOSSIER COMPLETE), `content-map.md` (Wave-3 note + 9-project KG pointer), `topic-backlog.yml` (`llm-as-judge-calibration` → `covered`; new `agent-skills-wild-prevalence` candidate = the registry-scan primary that should replace the folk figure).
5. **Toolkit hygiene** (`~/Claude/research_toolkit/`, separate repo — branch `wave3-burn-in`, commit `e4d3cc3`, NOT merged/pushed) — **7 `w3-*` BURN_IN entries** (`burn_in.yml` + a `BURN_IN_NOTES.md` Wave-3 section). The headline: **`w3-merge-projects-not-wave-parameterized` (high) — RESOLVED.** `_merge_projects.py` hardcoded the `wave2_` output prefix and would have clobbered the prior snapshot; the wave plan's pre-flight caught it, and the toolkit's own `test_v1_5_artifacts` (no unresolved high-severity items) forced the fix — the script is now **WAVE/MERGE_DATE-parameterized** (defaults reproduce wave3; idempotent re-run verified; future waves run `WAVE=wave4 MERGE_DATE=… _merge_projects.py …`). `make test`: **404 passed + 2 xfailed.**

## Review-gate assessment

- **The per-topic pipeline is robust at seven-times-plus scale** (pilot + 8 dossiers). The 8-step recipe ran to all-gates-green for both Wave-3 dossiers.
- **Carry-forward compounds (again).** The new `w3-gather-enum-drift` lesson — **pin the exact `source_type`/`source_quality` enums in the gather brief** — was applied between dossiers and made `eval-harnesses` first-merge-clean after `ops-security`'s 19-error enum drift.
- **The cross-project merge (D2/D5) holds at 9-wide** — 0 collisions; the new corpus added 144 records (110 + 34) with no new shared nodes, confirming clean disjointness.
- **Verify-then-cache + honest tiering reproduced.** Folk % escalated (not laundered); CVE id from the NVD primary; efficacy figures unanchored; vendor ASR attributed. CoVe also caught a real-world **attribution/recency drift** (the AISI rename) that the substring-clean guarantee structurally cannot.
- **A high-severity trap was surfaced AND resolved.** The merge-clobber is the kind of latent data-loss risk the program's mechanical gates exist to catch; the toolkit's own test refused to let it sit as `surfaced`.
- **Wave size:** 2-wide worked cleanly (the D3-trimmed wave). `ops-sandboxes` stays deferred — guardrails made it *tractable* but no active book-consumer *triggers* the OS-isolation-infra research yet.

## Wave 4 — candidates (pick by the editorial depth-gate, D3; not a momentum score)

The remaining coherent near-term cluster is **Tools & Extensibility** (cert D2; feeds Handbook Ch8 + the greenfield Architect's-Reference tool/MCP chapters):

- **`env-skills`** (Skills & progressive disclosure) — first-class Anthropic artifact (Jan-2026); cross-links `cross-domain`'s progressive-disclosure-at-scale.
- **`tool-minimization`** (subtract-first) — strong 2026 case studies (Vercel 16→1, Copilot 40→13, Block 30→2); the program's own meta-principle.
- **`mcp-design`** (MCP design & security) — **carries spec-churn freshness risk** (roadmap moving fast: Apps, Tasks, Tunnels); `ops-security`'s S3 already took the *trust/attack* surface, so this is the *design* side only. There is a cached `02-mcp-spec/` corpus (~30 notes) but it is spec docs, not design/security research.

Still deferred (intentional): `ops-sandboxes`, `eval-tooling-landscape`, `benchmarks`. Confirm the Wave-4 pick with the user (the depth-gate is editorial).

## Per-dossier recipe + tooling (unchanged, proven 8×)

Recipe: `2026-05-26_wave1-progress-handoff.md` §"battle-tested per-dossier recipe" (8 steps). Tooling: prefer the toolkit's **`scripts/build_excerpt_anchor.py`** (v2.5.0, self-verifying) over the `~/Claude/_build_excerpt_anchor.py` scratch twin; `~/Claude/_merge_tracks.py` (within-project); `~/Claude/_merge_projects.py` (cross-project — **now WAVE-parameterized**, run `WAVE=wave4 MERGE_DATE=…`). Toolkit venv: `~/Claude/research_toolkit/.venv/bin/python`. **Bake forward the Wave-3 lessons** (`burn_in.yml` `w3-*`): pin the exact enums in the gather brief; one-excerpt-per-evidence-entry; distinctive `fetch_<bibkey>_t{X}` ids per track; avoid a leading `"` in factor strings; verifiers must not recompute byte offsets.

## Follow-ups / open items (none block Wave 4)

- **Anchor producer:** the toolkit ships the canonical `scripts/build_excerpt_anchor.py` (v2.5.0); both it and the `~/Claude/` scratch twin produced 41/41 clean anchors this wave. Point future gather briefs at the toolkit script; the scratch twin is retireable by the user (left in place — may be referenced by other `~/Claude/` projects).
- **Mem0 volatile recheck:** the Wave-2 `memory` dossier's Mem0 source (dated 2026-05-27) is due for recheck **after 2026-06-26** — not yet due.
- **Toolkit branch:** `wave3-burn-in` (`e4d3cc3`) is unmerged/unpushed (consistent with the Wave-2 norm); the toolkit repo is left checked out on it.
- **`w3-audit-verification-method-enum` (low):** the `/dossier-audit` SKILL's v2-propagation example suggests `verification_method: webfetch_<date>`, which the `evidence_ledger.py` enum rejects — reconcile the skill example when convenient.

## Tasks

Wave 3 (2 dossiers + 9-wide merge + in-repo bridge + toolkit hygiene) **all completed**. Bridge on `research-program-v0` (`a91d4a8`); toolkit BURN_IN on `wave3-burn-in` (`e4d3cc3`), commit separately if merging. Wave 4 not yet started.
