# Research-program decisions — post-pilot review (2026-05-26)

The six parked decisions from the program's design, resolved in a co-drive review held after the context-assembly pilot completed (full v3, 22/22 citation-clean, all acceptance gates passed). Recorded ADR-style — dogfooding the program's own *ADRs-over-arch-docs* value. For these six, this supersedes the "Open decisions" parked lists in [`README.md`](./README.md) and the active plan file.

> **Meta-pattern (the principle the review surfaced):** *adopt the cheap discipline/structure now; defer the machinery to a real trigger.* Three of the six (D3, D4, D5) split into a cheap "thinking/structure" half worth adopting immediately and an expensive "machinery" half that should wait for a concrete need — so the program doesn't commit the very over-engineering it studies (tool minimization, subtract-first, "you don't need a framework"). Build the structure; defer the automation until a real pain or a real consumer demands it.

## D1 — Atomicity: the two-layer rule

- **Decision.** Topic (skeleton) nodes stay coarse and stable. Claim-families + atoms live *inside* the dossier and its `claim_graph.jsonl` (the flesh). Promote a sub-area to a sibling topic node **only when ≥2 dossiers corroborate the same boundary, or a sub-area grows its own distinct source base.**
- **Rationale.** The pilot's 5 claim-families held cleanly and its atoms composed into Ch5 subsections — at the *current* grain. Promoting them to nodes now would fit the taxonomy to n=1 and duplicate structure the claim-graph already encodes. The skeleton is the topic graph; the flesh is the per-dossier claim-graph that composes upward in Phase 4.
- **Changes.** `ctx-assembly` stays one node. Atom-grain + context-rot-as-sibling validated as-is. Cluster carving stays v1; re-assessed as waves land.
- **Status.** Resolved. *(Was: "true clusters / atomicity.")*

## D2 — Structure: per-topic projects + cross-project merge

- **Decision.** Each topic = its own `~/Claude/research_agent_<slug>/` (full v3, like the pilot). Generalize `_merge_tracks.py` from within-project (track) merge into a **cross-project KG-compose** step — same dedup-by-`primary_url`+`sha256` logic, run at the export/build layer.
- **Rationale.** The toolkit is built around self-contained per-project dossiers; a unified mega-project would blow the agent-discipline cap (~5 agents/topic), break the move-elsewhere dossier design, and make a single audit unwieldy. KG entity-resolution (one source cited by N topics → one node) happens at build time by URL+sha256. The pilot already proved the within-project merge; this extends the same logic one scope up.
- **Changes.** Generalize the merge script (finalized at first Wave-1 use, against real overlap). Defer a shared source-registry unless a wave reveals heavy cross-topic overlap.
- **Status.** Resolved. Supersedes both the earlier "11 isolated projects" and the "unified mega-project" options. *(Was: "separate-vs-unified project structure.")*

## D3 — Momentum: rubric now, machinery deferred

- **Decision.** Adopt the **quality rubric** as a thinking/scoring tool applied *by hand*. Defer *all* momentum automation to a real trigger.
- **Rubric.** Velocity (arXiv/blog/spec/GitHub dated-artifact rate) is a flash-in-the-pan *detector*, never a score on its own. Weight by **source-tier × sustained-vs-spike × convergence-count**. Demo-ware ≠ adoption (count real config / co-author traces, not stars; stars are corrupted in this niche). Keep a **revival** path (cooled topics can be "sleeping beauties").
- **Job (the reframing).** Momentum is a **staleness + field-movement radar** — *not* the master depth-gate. **Depth stays editorial** (importance + mastery-gap + book-need); letting "heating" auto-drive depth would chase fads — the exact failure the rubric guards against. This sharpens "trajectory-gated depth": *load-bearing* is primary; momentum informs.
- **Grounding.** Early citation velocity poorly predicts impact (Ke et al., *Sleeping Beauties*, PNAS 2015); HN→GitHub-stars is right-skewed by virality (arXiv 2511.04453); real-adoption is measured by config/co-author traces, not stars — 41% of config-adopters had zero AI commits (arXiv 2601.18341); benchmark trust is not automatable (arXiv 2502.06559). Prior art: ThoughtWorks Radar "Trial = production evidence required"; avoid the Gartner Hype-Cycle trap (keep calls traceable to measurable inputs). *(These are research-scan findings informing the decision, not strict-live-verified book sources.)*
- **The ultrathink catch.** A 4-factor automated model + a production-trace harvester *to prioritize ~4 dossiers* would itself be over-engineering. So: rubric now, machinery later.
- **Changes.** `trajectories.md` carries the rubric (not a momentum engine). Defer the scheduled agent to a real trigger (~10–15+ topics, ≈ Phase 4); then the *cheapest* increment (new-publication scan + source-tier + convergence). The production-trace harvester is **not** a core input (mis-targeted for topic-*literature* momentum; at most a late nice-to-have for the 2–3 practice-adoption topics).
- **Status.** Resolved. *(Was: "momentum signal" + "trajectory mechanism.")*

## D4 — Synthesis ↔ audit: two layers, clean boundary

- **Decision.** Keep the audited atom layer pure; give interpretive synthesis its own grounded, typed home.
- **Mechanism.** (a) Atoms in the ledgers stay substring-clean — the "N/N citation-clean" guarantee uncompromised. (b) Relationship claims (convergence/corroboration/contrast *among verified atoms*) = typed edges that reuse verified anchors (the pilot's move; no new unanchored assertion). (c) Interpretive synthesis → a marked **`synthesis.md`** + the `00_overview` mental-model section, where every interpretive claim **cites the atom IDs it rests on**, is typed `synthesis` (distinct from `evidence`) with `grounds` edges, and is **kept out of the substring citation-audit** — audited instead by *grounding* (do its atom-citations resolve?) via the dossier-audit human pass.
- **Rationale.** Synthesis is the mastery payload but is inferential — it can't pass a substring audit. This buys all four at once: synthesis is first-class, grounded (can't launder), KG-representable, and the audit guarantee stays clean (evidence vs. interpretation always distinguishable). Same rule scales to the Phase-4 cross-topic memo (synthesis at the KG level).
- **Changes.** Each dossier gains a `synthesis.md`. No new automated synthesis-grounding validator now (the human pass covers it; build later if volume demands). Formalizes the toolkit fix for the agent-index SKILL's stale `verification_method: cross_reference`.
- **Status.** Resolved. *(Was: "synthesis ↔ audit coexistence.")*

## D5 — Graph ↔ book citations: stable-ID discipline now, forwarding deferred

- **Decision (discipline — adopt now).** Atom IDs are **permanent and never-reused** from creation. A revision **creates a new atom** and tombstones the old via the toolkit's existing `superseded_by`/`supersedes` — never mutate-in-place.
- **Decision (machinery — defer).** The tombstone-chain resolver + book-citation validator + meaning-drift review-trigger wait until the **first book citation exists** (book prose is out of scope this round).
- **Rationale.** Stable-from-birth beats retrofitting stability onto a pile of volatile IDs once we're generating many atoms across waves — and it costs ~nothing (the pilot's IDs are already structured/deterministic, e.g. `claim_ctxasm_b1_a1_kvcache_metric`). Stable IDs prevent *dangling*; *meaning-drift* (a resolved citation whose successor now says something different) is a content-review concern, handled later by the content-map's atom→section dependency triggering a review.
- **Changes.** Lock the never-reuse + revisions-create-new-atom discipline in the gather/agent-index step. No forwarding tooling yet.
- **Status.** Resolved. *(Was: "graph ↔ published-book citation consistency.")*

## D6 — Scaling: Wave 1 + cadence

- **Decision.** Wave 1 = **context-rot + repo-design + claudemd-discipline** (3-wide, **review-gated** before Wave 2). guardrails + cross-domain + memory → Wave 2.
- **Rationale.** Picked by the editorial depth-gate (importance + mastery + book-need + de-risking our own decisions), not a momentum score. context-rot is the pilot's sister and shares Liu/Chroma → the best test of the D2 cross-project merge; repo-design ↔ claudemd cross-link heavily → the intra-wave merge test; claudemd is the highest book-value topic (convergence ↔ shipped Ch2). The trio also completes the Context & Assembly core.
- **Changes.** Per-topic recipe = the proven pilot pipeline with D1–D5 folded in (stable atom IDs, `synthesis.md`, one node per topic, cross-project merge). Cost ≈ 5 agents / ~225 tool-calls per topic. Multi-session, resumable at any per-topic definition-of-done.
- **Status.** Resolved. *(Was: "scaling.")*

## Still deferred (intentionally — not part of this review)

- **KG-viewer home** (brandon-behring.dev vs in-repo) → decided at the viz phase.
- **Vocabulary stance** (adopt / bridge / diverge the harness vocabulary) → deferred to Vol-2.
