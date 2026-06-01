# Agentic Systems Design — Environment & Context Engineering (outline v0)

> **Note (2026-06-01 reorg):** this is the standalone *Agentic Systems Design* book (formerly the env+context volume inside `architect-reference`). The cert-aligned `architect-reference` is now a sibling book that XRefs into this one. See `docs/BOOK-MAP.md` and `SPLIT.md`.

**The Part's lens:** the design discipline that makes an agent *more than code autocomplete* — engineering the **environment** the model operates in and the **context** it reasons over. As a combined subject this is the hardest and most important area of using coding agents in the big picture, and the most underappreciated/newest. This Part is the deep dive into layers 1–2 of the three-layer frame established in Ch1 (`Agent = Model + Harness`): **environment → context-assembly → context**.

**Position:** immediately after Ch1 (the frame); leads the book's substantive content, ahead of the D1 orchestration spine (build-vs-buy → sub-agents → multi-agent) and the D2/D5/D4 Parts. Provisional book chapters Ch2–Ch10/11 (numbering is an open decision — see §Open decisions).

**Genre (PEDAGOGY decision #6):** reference + explanation. **Form (decided):** *hybrid* — a short explanatory spine + per-topic chapters that each carry a scannable pattern section (Refactoring's shell+catalog shape, in shipped-Ch1's explanatory voice).

**Standalone (decided):** self-contained and comprehensive this round. **No** `<XRef>`-to-handbook, **no** adopt/bridge/diverge vocabulary yet — depth over de-duplication. Overlap with shipped handbook Ch2/Ch5 is revisited later.

**Cert-domain footprint** (floor; see `docs/cert-coverage.md`): Context chapters → **D5** primary (Context Management & Reliability, 15%); Environment chapters → **D1/D3** (architecture + Claude Code configuration). The Part is the architect/design angle on all of it.

**Status legend:** ⬜ not started · 🟡 outlined (this doc) · 🟢 in rewrite · ✅ shipped. All entries below are 🟡.

---

## Narrative arc (decided)

Foundation-first, problem-first within context:

> **Spine** → **Environment** (E1 Repo → E2 CLAUDE.md → E3 Skills → E4 Guardrails → E5 Scale) → **Context** (C1 Rot = the problem → C2 Assembly = the response → C3 Memory = persistence) → *(optional)* **Capstone**.

**Spiral concepts** (named per PEDAGOGY #1; each recurs at increasing depth, surfaced via prose call-backs — `<XRef>` once labels exist):
1. **The three layers** (environment → context-assembly → context) — introduced in the spine, re-applied every chapter.
2. **Context as a budget** — E2 (the always-loaded file is budget) → C1 (why the budget degrades) → C2 (how to spend it).
3. **Progressive disclosure / load-on-relevance** — E3 (skills) → E5 (shallow-index-deeply-linked) → C2 (just-in-time assembly).
4. **Signal-in / machine-checkable-feedback-out** — E1 spine → E4 (guardrails as feedback) → C2.
5. **Converged-craft vs measured-effect honesty** — every chapter states its evidence tier (most of this discipline is converged craft, not effect sizes).

---

## Spine — *Beyond Autocomplete: The Environment & Context Discipline*
**Form:** explanatory (no pattern catalog). **Backing:** cross-dossier (light). **Cert:** D1/D5 framing.
**Thesis:** what turns a model from autocomplete into an agent is the engineered environment + context around it; this discipline is new, underappreciated, and the highest-leverage thing an architect designs.
**Sections:** the autocomplete→agent shift · recap of Ch1's three layers as the Part's organizing frame · why it's the frontier (vocabulary is young; mostly converged craft, little measured) · map of the Part (what each chapter owns).

## Environment — *the substrate the agent operates in*

### E1. Repo & Doc Design for Agents
**Backing:** `repo_design` (14 atoms, `syn_repo_design_01–05`). **Cert:** D1+D3. **Evidence:** converged craft, **no effect sizes**.
**Thesis:** the repository *is* the agent's environment — **maximize signal going in, maximize machine-checkable feedback coming out.**
**Explanatory sections:** input-vs-feedback framing (`syn_01`) · legibility ⇄ structural-fitness are one property (`syn_02`) · "show, don't tell" = "subtract first" (`syn_03`) · the compounding harness-engineering ratchet (`syn_04`) — **fold the "failure breadcrumbs" stub here.**
**Pattern section:** entry-point map · examples-as-constraints · negative-space pruning · failure-log/instructions/ADR breadcrumbs · structural-fitness sensors (Böckeler).
**Tags/caveats:** `<Tag kind="convergence">` for legibility + examples-as-constraints (HumanLayer+Hashimoto+Böckeler+Anthropic+agents.md); rest official/practitioner. State `syn_05`: converged craft, recovery evidence is n=1; the ETH measured contrast lives in E2.

### E2. The Instruction Layer: CLAUDE.md & AGENTS.md
**Backing:** `claudemd_discipline` (14 atoms, `syn_claudemd_discipline_01–05`). **Cert:** D3.
**Thesis:** the always-loaded config file is a permanent slice of the **context budget**, not "documentation" — spend it only on broadly-applicable, can't-infer-from-code context.
**Explanatory sections:** always-loaded-file-as-budget (`syn_01`) · the one measured result inverts the naive prior — the ETH study: context files can *reduce* success and add >20% cost (`syn_02`) · official + practitioner + study **converge** (`syn_03`) · presence ≠ usage (`syn_04`, the 60k-vs-41% trace gap).
**Pattern section:** what belongs in / out of the always-loaded file · short + hand-curated + no auto-generation · push the rest to load-on-demand.
**Tags/caveats:** `<Tag kind="convergence">` (the headline — official + practitioner + ETH study). **Never quantify a line budget** ("60" is one practitioner's stricter heuristic; field consensus is "<300"); present as well-converged + once-measured, not a law.

### E3. Skills & Progressive Disclosure
**Backing:** `env_skills` (22 atoms, `syn_env_skills_01–05`). **Cert:** D2/D3. **Recheck:** 2026-08-24 (SDK behaviors). **Evidence:** **100% first-party Anthropic** — authoritative on mechanism, not yet corroborated.
**Thesis:** a Skill is **just-in-time procedural knowledge** — context you don't pay for until it's relevant.
**Explanatory sections:** progressive disclosure is the whole point (`syn_01`) · teach-once: the portable, self-contained artifact (`syn_02`) · the `description` is the load-bearing interface — authoring it is a *retrieval* problem (`syn_03`) · which-mechanism (skill vs CLAUDE.md vs tool vs subagent) on the procedure-vs-fact axis; a skill is **ergonomics, not a sandbox** (`syn_04`) · filesystem discovery + distribution + managed-settings governance (`syn_05`).
**Pattern section:** SKILL.md authoring · third-person description discipline · enterprise>personal>project override.
**Tags/caveats:** `<Tag kind="official">` only — **do NOT tag convergence** (first-party-only). Note the security-boundary disclaimer (frontmatter scoping is a context filter, not isolation; not even honored via SDK).

### E4. Guardrails, Permissions & Reversibility
**Backing:** `guardrails` (19 atoms, `syn_guardrails_01–05`). **Cert:** D5/D1.
**Thesis:** two layers, defense-in-depth — **express intent in policy, contain failure in mechanism**; sandbox-as-permission-relaxer is the hinge.
**Explanatory sections:** policy gates intent / isolation contains blast radius (`syn_01`) · operational-freeze ≠ technical-enforcement — the Replit lesson generalized (`syn_02`) · reversibility must be **out-of-band** (the agent's self-report can't be trusted) (`syn_03`) · even read-denial is layered; `.claudeignore` is a folk-claim trap → use `permissions.deny` (`syn_04`).
**Pattern section:** permission/deny rules · read-boundaries · out-of-band reversibility (git, dev/prod, backups) · sandbox relaxation.
**Tags/caveats:** mostly `<Tag kind="official">` (mechanics are documented behavior); Replit is a **single-source T3 anecdote** — present as cautionary, not data; the 84% prompt-reduction is vendor-self-reported. **Completeness gap:** OS-level sandbox *infrastructure* (`ops_sandboxes`) is deferred — see §Completeness.

### E5. Environments at Scale: Large Codebases & Monorepos
**Backing:** `cross_domain` (21 atoms, `syn_cross_domain_01–05`). **Cert:** D1/D3.
**Thesis:** at scale, legibility means **bounding what the agent must load**, not documenting everything.
**Explanatory sections:** bound-the-loadable-surface (`syn_01`) · progressive disclosure at scale = index + interface-contract (`syn_02`) · interface (the *what*) + ADR (the *why*) make a domain legible without loading it (`syn_03`) · tags/dependency-graph = navigate-before-you-read (`syn_04`).
**Pattern section:** per-domain interface/contract docs · shallow-root/deep-link index · scoped ADRs · monorepo project-graph/tags.
**Tags/caveats:** `<Tag kind="convergence">` for the navigate-before-read primitive (practitioner + vendor). **Erratum:** `INTERFACE.md` and "shallow index, deeply linked" are folk coinages — name the real patterns, not the catchy labels. Converged craft, no effect sizes (`syn_05`).

## Context — *the assembly boundary the harness owns (problem → response → persistence)*

### C1. Context Rot: Why Windows Degrade *(the problem)*
**Backing:** `context_rot` (13 atoms, `syn_context_rot_01–05`; **full dossier-audit**). **Cert:** D5.
**Thesis:** long context does **not** degrade gracefully — so context engineering is a response to a measured failure, not a style preference.
**Explanatory sections:** four distinct failure modes — positional / length / reasoning / effective-vs-claimed-window (`syn_01`) · the robust claim is **directional, not numeric** — cite RULER+Chroma, never a folk "% at N tokens" (`syn_02`) · "architectural & unsolved" overshoots — 2026 work (PCD, monitor post-training) is eroding it (`syn_03`) · two builder-surprises: coherence-can-hurt + retrieval≠reasoning (`syn_04`) · **rot reaches the overseer** (LLM-judge degrades on long transcripts) (`syn_05`).
**Pattern section:** degradation symptoms → which failure mode → which mitigation (decompose, shorten, reorder). Every "what do I do" routes to C2.
**Tags/caveats:** official/practitioner mix; **never launder a portable context-rot percentage.** Live research front (architectural-vs-trainable) — recheck.

### C2. Context Assembly: Engineering the Window *(the response)*
**Backing:** `context_assembly` (21 atoms; **pilot / deepest**; source = `agent_index/` + `dashboard.md`, no `synthesis.md`). **Cert:** D5. **Recheck:** volatile 2026-06-25 / active 2026-08-24. **Richest pattern catalog.**
**Thesis:** the harness owns the boundary deciding what enters the window, and when — assembly is the engineering discipline that answers context rot.
**Explanatory sections** (5 claim families): KV-cache stability · loading strategy (just-in-time vs preload; pre/post-commitment) · compaction · attention/positional placement · assembly-as-prompt (filesystem-as-state, context budget).
**Pattern section** (the deepest): cache-stable prefixes · JIT loading · compaction protocol · positional placement · budget allocation. (The three Lumer cache atoms → cost-lever / dynamic-tail rule / caching-can-hurt caveat.)
**Tags/caveats:** mostly official + practitioner; 1/21 corroborated (positional bias). Pull section detail from the dossier's `agent_index/` during authoring.

### C3. Memory: Persisting Context Across Sessions
**Backing:** `memory` (17 atoms, `syn_memory_01–05`). **Cert:** D5. **Recheck:** 2026-06-26 (Mem0 volatility). **Evidence:** openly unsolved.
**Thesis:** **memory is just recalled context** — so every memory anti-pattern is a context anti-pattern.
**Explanatory sections:** memory = recalled context (`syn_01`) · typing enables decay (you can't invalidate what you can't address) (`syn_02`) · the doc-vs-memory boundary: durable-shared-reviewable vs fast-private-decaying (`syn_03`) · repo-as-memory is the cheap floor you outgrow predictably (`syn_04`) · openly unsolved — honest framing is the finding (`syn_05`).
**Pattern section:** type → decay → boundary → repo-as-memory floor; anti-patterns (pollution, >5MB bloat, over-recall).
**Tags/caveats:** `<Tag kind="convergence">` for the doc-vs-memory boundary (2 Anthropic docs + 2 practitioners); architecture (MemGPT/Generative Agents) are **proposals**, unsolved framing is **one vendor** (Mem0) — tier honestly, no effect sizes.

## *(Optional)* Capstone — *Designing the Whole: Environment + Context as One System*
**Backing:** authored synthesis grounded in the above atoms (no dedicated dossier). **Form:** explanatory + decision guide.
**Thesis:** the two halves are one discipline; an integrated design workflow for engineering an agent's environment + context together. **Flagged optional** — see §Completeness (not dossier-backed).

---

## Completeness audit (per "make sure this is complete")
Gaps to close before the Part is truly complete, and how each resolves:
- **Sandboxes / execution-isolation infrastructure** (`ops_sandboxes`, deferred) — belongs in E4 (the OS-level mechanism layer). **→ needs a research stub before E4 is complete.**
- **Failure breadcrumbs** (stub) — **folded into E1** (the ratchet); confirm depth is sufficient or promote to its own pattern.
- **`env_skills` first-party-only** — no independent corroboration; E3 must NOT claim convergence. Watch for practitioner/academic evidence (evidence gap).
- **Reference architectures** combining env+context — the capstone is authored synthesis, not dossier-backed; mark clearly or defer the capstone.
- **context_assembly has no `synthesis.md`** (dashboard + agent_index only) — C2's interpretive layer must be drawn from `agent_index/` at authoring; flag if a synthesis pass is wanted first.

## Pedagogy constraints to honor (PEDAGOGY.md + `docs/research/11-pedagogy/`)
- Each chapter: macro-summary → detail; **two-level disclosure max**; diagram-or-example per non-trivial concept; F-pattern headings (distinctive first word); first sentence states the claim.
- Chunking (Miller-Cowan): ≤3 new concepts/section, ≤5 bullets/list, ≤5 diagram nodes, ≤30 words/sentence.
- **Reference-genre pattern template** (uniform across all pattern sections; decisions #6/#12): *Sketch → When-to-use → Mechanics → Example → Things-to-remember.* Mark explanatory asides (`<InsightBox>`) distinctly from reference material.
- Components: reuse Ch1's set (`YouWillLearn`, `KeyIdea`, `ConceptBox`, `Convergence`, `InsightBox`, `WorkedExample`, `Pitfall`, `MarginNote`, `Tag`, `Citation`, `Exercise`, `Practice`, `Solution`) — scaffold-only, sparingly.
- Frontmatter per chapter (mirror `ch01-harness-frame.mdx`): `title, part, chapter, volatility, tools_compared, cert_domains, introduced_in_version, last_updated, last_verified, sources, description`.

## Provenance
8 strict-live dossiers (~138 atoms), all citation-clean, in `~/Claude/research_agent_<slug>/` (`synthesis.md` + `agent_index/`); cross-project KG at `~/Claude/research-kb/composed/`. Per-chapter atom→section detail lives in each dossier's `agent_index/`. Mapping skeleton: `docs/research-program/content-map.md`.

## Open decisions (resolve at authoring)
1. **Chapter numbering / slugs** — semantic slugs (e.g. `environment-repo-design`) are reorder-safe and reference-genre-appropriate; Ch1 used numbered. Recommend **semantic slugs** here given the Part may shift in the full-book sequence.
2. **Where the Part sits book-wide** — leads after Ch1 per the reprioritization; final absolute numbering waits on the full-book OUTLINE (orchestration/tools/ops/prompting Parts).
3. **Include the capstone?** — strong for the "one discipline" thesis but not dossier-backed; decide once E/C chapters drafted.
4. **C2 synthesis pass** — author from `agent_index/`, or write a `synthesis.md` for context_assembly first?

## Verification
- All 8 ready dossiers represented (E1–E5, C1–C3); spine present; every completeness gap listed.
- Arc matches the decision (spine → E1–E5 → C1 rot → C2 assembly → C3 memory).
- Spiral concepts named; chunking + two-level disclosure + reference-genre pattern template stated.
- Cert tags consistent with `docs/cert-coverage.md`; recheck dates captured (E3 2026-08-24, C2 2026-06-25/08-24, C3 2026-06-26).
- Markdown only — no build needed now; once chapters are authored, `npm -w agentic-systems-design run validate && build` applies.
