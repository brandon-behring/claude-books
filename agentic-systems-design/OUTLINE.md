# Agentic Systems Design — Volume 1: Environment & Context Engineering (outline v0)

> **Note (2026-06-01 reorg):** this is the standalone *Agentic Systems Design* book (formerly the env+context volume inside `architect-reference`). The cert-aligned `architect-reference` is now a sibling book that points *in* via plain-prose breadcrumbs only (no `<XRef>`). See `docs/BOOK-MAP.md` and `SPLIT.md`.
>
> **Vols 2–3 rich outlines appended below** (2026-06-13): **Volume 2 — Tools & Orchestration** (ch12–19) and **Volume 3 — Evaluation & Operations** (ch20–27), carved from the strict-live dossiers. This is now the book-wide outline — Vol 1 immediately below, Vols 2–3 at the end.

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

---
---

# Volume 2 — Tools & Orchestration (outline v0)

> **Appended 2026-06-13** (Design Vol 2–3 outline sprint). Rich blueprint carved from the
> strict-live dossiers; same genre / pedagogy / frontmatter conventions as Vol 1. `part: 2`;
> chapters continue the book-wide numbering (Vol 1 = ch01–11) as **ch12–ch19**. Status: all 🟡.

**The Volume's lens:** a tool is a slice of the context budget and a selection risk; an agent-unit is a context-isolation primitive. **Tools** = *what capability you give the agent and how its I/O is shaped*; **Orchestration** = *how many units you run and how they coordinate*.

**Arc:** Spine (ch12) → **Tools** (ch13 build-vs-buy → ch14 minimization → ch15 MCP) → **I/O shaping** (ch16) → **Orchestration** (ch17 sub-agents → ch18 multi-agent) → *(optional)* ch19 capstone.

**Spiral concepts carried from Vol 1** (re-applied, not re-derived): *subtract-first* (E1 "show don't tell" → tool minimization, MCP applying it to itself); *progressive disclosure / load-on-relevance* (E3 skills → on-demand tool loading); *context-as-budget* (tool defs + responses are budget; sub-agents quarantine it); *converged-craft-vs-measured honesty* (each chapter states its tier).

**Boundary discipline:** reference Vol 1 in prose, do not re-derive — the harness frame (ch01) underpins build-vs-buy + sub-agents; skills (ch05) is the parent of on-demand tool loading; guardrails (ch06) owns the sandbox/blast-radius layer (MCP covers design-time auth only); context-assembly (ch09) owns the JIT-context framing sub-agents lean on. **Defer to Vol 3:** the evaluate-then-prune loop + LLM-judge calibration (→ eval); quantified token/latency cost modeling (→ cost); the MCP threat model (→ security).

### ch12 — Spine: *Beyond One Agent, One Tool*
**Form:** explanatory (no pattern catalog). **Backing:** cross-dossier (light) — `harness_buildvsbuy` syn_01, `tool_minimization` syn_01, `sub_agents` syn_01, `multi_agent` syn_01. **Cert:** D1/D2. **Volatility:** architectural-pattern.
**Thesis:** capability is a context cost; coordination is a context-isolation move — the two axes that organize the volume.
**Sections:** the autocomplete→agent recap (what Vol 1 left to this volume) · capability-as-context-cost (tools are budget + selection risk) · coordination-as-isolation (a unit is a fresh window) · map of the volume.
**Claims:** subtract-first as the governing default (`tool_minimization` syn_01); start-simple/start-direct as the orchestration default (`harness_buildvsbuy` syn_01); primitive-vs-topology distinction (`sub_agents` syn_06).
**Tags:** official throughout; no convergence tag (framing chapter).

### ch13 — *Build vs Buy: Choosing a Harness*
**Backing:** `harness_buildvsbuy` (syn_01–06). **Cert:** D1. **Volatility:** architectural-pattern (the *decision* is durable; the framework landscape is volatile).
**Thesis:** start direct on the API; add a harness abstraction only when earned — the middle path is configure/wrap/extend, not build-from-scratch.
**Sections:** the start-simple default · abstraction-cost vs convenience (the core tradeoff) · the maintenance cost of building (staleness as the model moves) · the framework landscape (LangGraph/CrewAI/Claude Agent SDK/OpenAI Agents SDK) · the middle path + a sequenced rule.
**Claims:** start direct, add abstraction only when earned (syn_01, syn_06); abstraction is what you pay for convenience and it obscures prompts (syn_02); a custom harness is a standing maintenance liability (syn_03); configure/wrap/extend dominates the binary (syn_05).
**Tags:** build-vs-buy *guidance* = official. Framework-capability claims = official **relative to each vendor** — render "CrewAI leading" / "OpenAI few abstractions" as vendor self-descriptions, **not a ranking**; no convergence tag. Octomind T3 case uncached (no anchored claim); framework landscape carries a 90-day recheck.

### ch14 — *Tool Minimization: Subtract First*
**Backing:** `tool_minimization` (syn_01–05). **Cert:** D2/D1. **Volatility:** architectural-pattern (principle); the Tool Search surface is feature-surface.
**Thesis:** the smallest tool set that covers the workflow beats a complete one — consolidate, make responses high-signal, load on demand when scale forces it.
**Sections:** subtract-first (the principle) · the case studies (the convergence evidence) · consolidate + high-signal returns (the two highest-leverage heuristics) · on-demand loading when you can't subtract (progressive disclosure applied to tools) · *brief* pointer to evaluate-then-prune (Vol 3 boundary).
**Claims:** more tools degrades the agent; overlap induces wrong-tool selection (syn_01); the three converging case studies — Vercel single-bash 80%→100%, GitHub Copilot 40→13 tools +2–5pp, Block 30+ APIs→3 MCP tools (syn_02); a tool's response is a context-management decision (syn_03); on-demand loading keeps the active set small, 3–5 most-used non-deferred (syn_04).
**Tags:** **the one place a convergence tag is warranted in Vol 2** — three *independent* teams, same direction — tag as *convergent practitioner reports*, stating each is a vendor self-report (Block's is a consolidation count, no quality delta). Do **not** launder Anthropic's escalated-not-anchored ~85%-token / 79.5→88.1% figures.

### ch15 — *MCP: Designing External Capability*
**Backing:** `mcp_design` (syn_01–06). **Cert:** D2/D1. **Volatility:** feature-surface (spec mid-transition; 2026-07-28 RC dated). **Recheck:** after 2026-07-28.
**Thesis:** wire external capability against a least-privilege, capability-negotiated protocol — and design against a known moving target.
**Sections:** the host/client/server capability-negotiated split · three primitives = three control modes (tools model-controlled, resources app-driven, prompts user-controlled) · the OAuth-2.1 design-time posture (not the threat model) · MCP mid-transition: the stateless-core RC + governance move to Linux Foundation/AAIF · designing against a moving target (build to the stable core, isolate what the RC changes).
**Claims:** capability negotiation + server isolation, and the spec "cannot enforce security at the protocol level" — design-time obligations, not runtime guarantees (syn_01); primitive choice = who is in control (syn_02); auth posture = OAuth 2.1 / RFC 8707 / no-passthrough / PKCE (syn_03); the RC makes the core stateless and prunes the surface (syn_04); governance moved out of Anthropic (syn_05).
**Tags:** official (the spec is authoritative by construction); no convergence. RC-change claims = official-but-volatile (render each "announced for 2026-07-28; recheck after"). **Boundary:** threat model is Vol 3 `ops_security`; enumerate the *four* verified key principles, not three.

### ch16 — *Shaping I/O: Prompting Craft & Structured Output*
**Backing:** `prompt_engineering` (syn_01–07) + `structured_output` (syn_01–06) **(merged — sibling Wave-7 dossiers; split later if too large)**. **Cert:** D4/D2. **Volatility:** feature-surface (most volatile material in the volume). **Recheck:** per model release.
**Thesis:** the two sides of the agent's text I/O — the prompting craft that shapes what goes in, and the four levers that force reliable machine-readable output.
**Sections:** the five-move prompting craft in source order (clear → examples → reasoning → structure/roles → chain) · examples as the most reliable lever (the 3–5 dosage) · what changed (CoT reframed as fallback; prefill deprecated) · the four output levers, strongest-guarantee to lightest · the structured-outputs guarantee and its limits (prevent-beats-recover); a "chaining ≠ orchestration" handoff to ch18.
**Claims:** brilliant-but-new-employee as the lead mental model (PE syn_02); examples are the most reliable lever, 3–5, mirror the use case (PE syn_03); manual CoT is now the fallback (adaptive thinking default) (PE syn_04); prefill on the last assistant turn is deprecated → migrate to structured outputs (PE syn_05 = SO syn_05); four levers ordered guarantee→flexibility (SO syn_01); `tool_choice` forces the call, `strict` guarantees the args (SO syn_02); the guarantee holds **except** refusals/`max_tokens`, over the supported schema subset — never "always valid JSON" (SO syn_03); prevent-then-recover ordering (SO syn_04).
**Tags:** official (Anthropic docs + one corroborating tutorial); no convergence. Prefill-deprecation, CoT-fallback, structured-outputs-GA, prefill model-gate = official-but-volatile (carry "current as of …; recheck per model release"). The 3–5 examples Tip is the only anchored number in the prompting dossier.

### ch17 — *Sub-Agents: The Context-Isolation Primitive*
**Backing:** `sub_agents` (syn_01–06). **Cert:** D1/D2. **Volatility:** architectural-pattern (mechanism durable; `fork_session` API surface is feature-surface).
**Thesis:** a sub-agent is isolation, not capability — a fresh window that inherits nothing and returns only the relevant result.
**Sections:** isolation, not capability (the whole value is the separate window) · the fresh-in / relevant-result-only-out contract (and how `fork_session` inverts the input side) · separation of concerns (distinct tools/prompts/trajectories) · roles = description + system prompt + scoped tools (Planner/Generator/Evaluator + the clean-room verifier) · when it earns its keep vs when it's overhead.
**Claims:** a sub-agent is a context-isolation primitive, not added capability (syn_01); "fresh in, relevant-result-only out" is the composable contract (syn_02); isolation buys non-interfering separation of concerns (syn_03); one-task-per-subagent + generate-then-verify (separate evaluator beats self-evaluation) (syn_04); reach for it to quarantine context / parallelize / clean-room review — stay on the main thread when latency dominates or task value doesn't clear cost (syn_05).
**Tags:** official; no convergence. Flag that "isolation-not-capability" and the P/G/E naming are the book's *framing/imported vocabulary* (grounded, not verbatim Anthropic terms). Quantified cost deferred to Vol 3 `ops_cost`.

### ch18 — *Multi-Agent: Coordinating Many*
**Backing:** `multi_agent` (syn_01–06). **Cert:** D1. **Volatility:** architectural-pattern (topology names durable; framework APIs volatile).
**Thesis:** multi-agent design is one decision chain — topology → coordinator → verifier → cost gate — and the gate is whether the work is parallelizable enough to clear ~15× tokens.
**Sections:** the topology→coordinator→verifier→cost decision chain · orchestrator-worker as the spine + the centralized↔decentralized axis (supervisor/swarm) · the decompose→delegate→aggregate coordinator loop · the verifier as the coordinator's complement (LLM-judge in-orchestration) · the anti-patterns + the worth-it parallelizability test (**preserve the Anthropic↔Cognition disagreement**).
**Claims:** one decision chain, topology→coordinator→verifier→cost (syn_01); orchestrator-worker = supervisor (centralized) / swarm (decentralized) (syn_02); the decompose→delegate→aggregate loop, stated by two independent T1 posts (syn_03 — a fair convergence candidate); the verifier separates generation from review (syn_04); three failure modes — cost (~15× tokens, verbatim first-party), role-decomposition limits, dispersed decision-making (syn_05); worth-it test = parallelizability; Anthropic & Cognition converge on the test, disagree on the window width (syn_06).
**Tags:** Anthropic mechanics = official; LangGraph topology *names* = practitioner-corroborated; the two-independent-T1 coordinator loop (syn_03) is a fair **convergence** candidate; Cognition atoms = **practitioner** ("Cognition argues"), never load-bearing — **preserve both sides, do not flatten.** The ~15× is a single first-party datapoint quoted verbatim as a cost gate — don't generalize; cost modeling → Vol 3 `ops_cost`, judge calibration → Vol 3 `eval_harnesses`.

### *(Optional)* ch19 — *Composing Tools & Orchestration* (capstone)
**Backing:** authored synthesis grounded in ch12–18 (no dedicated dossier). **Cert:** D1/D2. **Volatility:** architectural-pattern.
**Thesis:** the two halves as one system — a sequenced decision workflow (subtract-first tools → minimal harness → reach for sub-agents/multi-agent only when parallelizability + task value clear the cost). Mirrors Vol 1's capstone.
**Tags:** authored synthesis — mark integrative, not dossier-backed. **Flagged optional** (decide once ch13–18 are drafted).

### Provenance (Vol 2)
7 dossiers: `harness_buildvsbuy`, `sub_agents`, `multi_agent`, `tool_minimization`, `mcp_design`, `prompt_engineering`, `structured_output` (+ references `harness_frame`/`env_skills`, already Vol 1). Per-chapter atom→section detail in each dossier's `agent_index/`. Map: `docs/research-program/content-map.md`.

---
---

# Volume 3 — Evaluation & Operations (outline v0)

> **Appended 2026-06-13.** `part: 3`; chapters continue as **ch20–ch27**. Status: all 🟡.

**The Volume's lens:** you cannot operate what you cannot measure. The five operational surfaces — eval, observability, cost, oversight, security — each with a distinct mental model and (mostly) a distinct, single-vendor evidence base.

**Arc:** Spine (ch20) → **Eval** (ch21 prompt-eval → ch22 agent-eval) → **Observability** (ch23) → **Cost** (ch24) → **Oversight/HITL** (ch25) → **Security** (ch26) → *(optional)* ch27 capstone. *(measure → see → spend → oversee → defend.)*

**Volume-wide evidence honesty (state in the spine):** five of six dossiers are **single-vendor / first-party by construction** (Anthropic docs + Claude Code mechanics + the OTel spec) — authoritative but **NOT convergence**; do not tag `<Tag kind="convergence">` in eval/prompt-eval/observability/cost/HITL. **Security is the exception** — design-by-construction-over-detection is a genuine multi-paper convergence.

**Boundary discipline:** ch25 HITL = the oversight *workflow* on top of Vol-1 guardrails' permission *model* (restate the model briefly in prose; standalone, no XRef). ch26 security = `authorized-but-forged` vs Vol-1 guardrails' `authorized-but-risky`. ch24 cost = the *economics* of ch09's cache *mechanism*. ch22 owns judge *calibration*; ch21 only *uses* the judge. ch23 telemetry records *what ran*; ch22 eval scores *whether it was correct*.

### ch20 — Spine: *Measuring & Operating Agents: The Discipline*
**Form:** explanatory (no pattern catalog). **Backing:** cross-dossier (light), authored synthesis. **Cert:** D4/D5. **Volatility:** stable-principle.
**Thesis:** measure before you scale/operate; most of ops is first-party-authoritative, not triangulated — and we say so.
**Sections:** the measure-before-operate thesis · the five operational surfaces map · the evidence-tier honesty rule (5 dossiers single-vendor; security is the one real convergence) · what each chapter owns.
**Claims:** eval-first ordering as the volume's entry premise (`eval_harnesses` syn_01); the inverse-honesty note from the five vendor dossiers.
**Tags:** authored framing over first-party atoms; no convergence claims.

### ch21 — *Evaluating a Prompt: The Four-Step Loop*
**Backing:** `prompt_evaluation`. **Cert:** D4. **Volatility:** feature-surface (Console tooling ships per release). **Recheck:** after 2026-08-25.
**Thesis:** how you know a *prompt* is good and iterate it — a four-step loop, not a one-shot check. Unit = a prompt.
**Sections:** the four-step loop (criteria → test cases → tooling → grading) · criteria + tests as *preconditions* (anti-vibes) · engineering the eval set (representativeness × automatable volume) · tool-assisted iteration (improver drafts, Console eval measures) · grading ranked by reliability-per-effort.
**Claims:** the loop is central to prompt engineering — four steps (syn_01); criteria + tests fixed *before* iteration; improvement is measured not asserted (syn_02); grading hierarchy — code-based best where feasible; LLM grading is "test reliability first, then scale" — a **use**, not a calibration project (syn_05 — the seam to ch22).
**Tags:** 100% T1-official Anthropic — `<Tag kind="official">`, **never convergence** (single-vendor). Console-tooling atoms = official-but-volatile.

### ch22 — *Evaluating an Agent: Harnesses, Suites & the Judge*
**Backing:** `eval_harnesses`. **Cert:** D4. **Volatility:** stable-principle (foundational methodology; tooling deferred).
**Thesis:** agent/system eval — task-suites, statistical reading of results, the LLM judge as a calibrated instrument. Unit = a trajectory.
**Sections:** evals-before-harnesses (the ordering *is* the discipline) · a good suite is small, discriminating, failure-derived — and the grader is half the design · results are measurements with uncertainty (resample → error bars → significance) · the LLM judge as calibrated instrument, not oracle · the eval/harness boundary.
**Claims:** "evals get harder to build the longer you wait" — define the measurable target first (syn_01); 20–50 failure-derived tasks; inter-rater reproducibility as the bar (syn_02); a score without an error bar is not a result — resample (Inspect `--epochs`), report CIs, test significance (syn_03); LLM judge ≈80% human agreement = an instrument with known error, wrapped in the statistics (syn_04).
**Tags:** first-party methodology spine (2 Anthropic posts) + one official framework mechanism (Inspect) + one peer-reviewed judge study (Zheng et al.). **Do NOT tag eval-first as convergence** (first-party-sourced) (syn_05).

### ch23 — *Observability: Seeing What the Agent Did*
**Backing:** `ops_observability`. **Cert:** D5. **Volatility:** feature-surface (Claude Code commands + OTel GenAI convention both volatile). **Recheck:** after 2026-08-25.
**Thesis:** four surfaces over one ground truth — the session log — instrumented to a vendor-neutral convention.
**Sections:** four surfaces over one ground truth (the session-log transcript) · logging = two records, two retention stories (local 30-day sweep vs SDK `SessionStore`) · OTel GenAI semantic conventions as the substrate · attribution as the provenance hook (not the approval gate) · surfacing cost at three altitudes (surfacing ≠ modeling).
**Claims:** the session log (per-session JSONL) is the ground truth the other surfaces derive from (syn_01); instrument to the OTel GenAI *convention*, not a vendor schema — Claude Code's span tree is one realization (syn_03); the surfaced dollar figure is a local estimate that "may differ from your actual bill" — surfacing shows it, ch24 models it (syn_05).
**Tags:** T1 by construction (Claude Code docs + OTel spec); not convergence. OTel GenAI convention is **Status: Development** — render names with a "recheck after 2026-08-25" caveat; note the `/cost`→`/usage` rename and the traces-beta vs metrics-GA split.

### ch24 — *Cost: The Economics of Running Agents ("Context Is Compute")*
**Backing:** `ops_cost`. **Cert:** D5. **Volatility:** feature-surface (pricing figures volatile, 30-day staleness). **Recheck:** after 2026-06-26.
**Thesis:** input context, not output, is the cost driver — and four composable levers manage it.
**Sections:** "context is compute" · prompt-cache economics (read-vs-write asymmetry) · the multi-agent token multiplier as a modeling input, not a flat anti-pattern · model-tier routing + batch as the cheapen-the-spend levers · the four levers composed.
**Claims:** input context is the spend (no first-party numeric ratio asserted) (syn_01); cache asymmetry — write 1.25×, read ≈0.1×, 5-min free-refresh TTL → pays off after one read (syn_02); multi-agent ≈15× a chat but token spend explains ≈80% of performance variance → burn is a lever (syn_03); tier ladder Haiku<Sonnet<Opus + Batch 50%, stackable with caching (syn_04).
**Tags:** T1 first-party; not convergence. **Render the tier ladder QUALITATIVELY; print no per-MTok dollar figures.** The 4×/15× and 80%-variance are Anthropic's measurements on *their* workload, not universal constants.

### ch25 — *Human-in-the-Loop: Keeping a Human in Control*
**Backing:** `ops_hitl`. **Cert:** D5/D1. **Volatility:** feature-surface (Claude Code modes/checks shift per release).
**Thesis:** one move — human control over irreversible/wrong actions — expressed four ways (approval gates, plan mode, calibration, escalation), layered on the permission model.
**Sections:** one move, four expressions · the approval gate (blocking, default-on, on irreversible actions) · plan mode = the gate moved earlier · calibration = agent-initiated escalation · escalation in automation (non-blocking by default, opt-in merge gate, fail-closed when no human present) · the workflow-on-model split.
**Claims:** the dossier is one move inserted at each risky transition (syn_01); the gate is the **workflow**, *which* actions trip it (Always/Ask/Never, `permissions.deny`) is the permission **model** owned by Vol-1 guardrails — workflow-on-model (syn_02, syn_06; restate briefly in prose); calibration is agent-initiated and *imperfect* (syn_04); escalation fails closed — headless aborts on an unapproved tool call; managed Code Review is non-blocking by default (syn_05).
**Tags:** T1 Claude Code docs + Anthropic posts; not convergence. **Do NOT assert the unverified "3-consecutive / 20-total denials → escalate" folk mechanism.** Present the default-ask gate + "approval fatigue" together (an open trade-off, not solved).

### ch26 — *Security: The Adversarial-Input Layer*
**Backing:** `ops_security`. **Cert:** D5/D1. **Volatility:** architectural-pattern (the defense thesis is durable; incidents/registries fast-moving).
**Thesis:** who is *really* issuing the instruction — prompt injection, the lethal trifecta, supply-chain trust, and design-by-construction defense. The authorized-but-*forged* counterpart to Vol-1 guardrails.
**Sections:** the lethal trifecta as the necessary-conditions threat model · the incidents as one attack shape (EchoLeak, Comet, ShadowPrompt) · detection-only fails by construction → design-by-construction backbone · defenses reduce, not eliminate (defense-in-depth) · supply-chain trust is delegated to the user (the registry does not audit).
**Claims:** the lethal trifecta — private data + untrusted content + exfiltration path — is the hinge; every robust defense cuts one leg (syn_01); detection-only is evadable by construction (DataFlip ≤100% evasion); CaMeL/SecAlign defend by structure — "do not buy a PI detector as your primary control" (syn_02); defenses reduce not eliminate — Anthropic browser ASR 23.6%→11.2% (not zero); WASP ≈86% partial = "security by incompetence" (syn_03); the MCP directory "does not security-audit … any MCP server" — listing ≠ vetting (syn_04).
**Tags:** deliberately mixed and *stated as the finding* (syn_05). **Design-by-construction thesis IS genuine convergence — tag `<Tag kind="convergence">`** (multiple independent T1 papers). But lethal-trifecta = practitioner coinage (Willison) → `<Tag kind="practitioner">`; ASR figures = vendor self-reported; the "~12–20% malicious skills" folk figure is **NOT asserted** (use *Agent Skills in the Wild* 5.2% high-severity / 26.1% ≥1-vuln only if anchoring a number); keep the EchoLeak CVSS score out (unsettled).

### *(Optional)* ch27 — *Operating the Whole: Eval + Ops as One Loop* (capstone)
**Backing:** authored synthesis over the six dossiers. **Cert:** D4/D5. **Volatility:** architectural-pattern.
**Thesis:** the closed operate-and-improve loop — production failures (seen via ch23) → eval suite (ch22) → fixes; plus the unsolved trade-offs (autonomy↔control, cost↔performance, utility↔security) presented honestly.
**Tags:** authored framing — **flag clearly as not dossier-backed.** Decide once ch20–26 drafted.

### Provenance (Vol 3)
6 dossiers: `eval_harnesses`, `prompt_evaluation`, `ops_observability`, `ops_cost`, `ops_hitl`, `ops_security`. Per-chapter atom→section detail in each dossier's `agent_index/`. Map: `docs/research-program/content-map.md`.
