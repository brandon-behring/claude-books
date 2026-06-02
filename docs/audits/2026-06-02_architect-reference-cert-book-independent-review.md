# The Claude Architect's Reference (Cert book) — Independent Review

**Date:** 2026-06-02  
**Audited:** `architect-reference/` — all 30 chapters (D1.1–D5.6, Parts I–V), at commit `dec5e2b`.  
**Posture:** external + adversarial. The reviewers did not author the chapters; each was instructed to *falsify* every sourced claim against its primary source, not to confirm it.  
**Deliverable scope:** **review-only.** This report makes findings; it does **not** edit the chapters. Fixing is a separate, authorized follow-up.

**Method — Hybrid** (deterministic where a machine can settle it; independent agents where judgment is needed):

1. **Part A — deterministic linter** (`architect-reference/scripts/cert-audit.mjs`, 11 checks): frontmatter completeness, citation-key resolution, **citation→cache backing**, manifest duplicate-ids, MarginNote 25-word cap, approved labels, Tag/Citation pairing, instructor-PDF leakage, structural presence, strict-live phantom-guards, outward-link integrity. Result: **0 FAIL / 30 WARN** (Appendix A).
2. **Part B — 30 independent single-pass reviewers**, one per chapter, each reading its chapter plus the in-repo strict-live cache files backing its citations, and scoring claim-support / cert-depth / exam-item-quality / technical-accuracy against a 6-axis rubric. **31 agents · ~1.9M tokens · 515 tool calls.**
3. **Part C — synthesis** into the rubric-scored report below.

> **Confidence & limits.** The per-chapter reviews are a **single independent pass** (the proportionate "Hybrid" depth chosen for this run). The deterministic findings (Appendix A) and the two headline factual errors — **D5.6** (training-cutoff direction) and **D5.3** (seven-week concurrency) — were **re-verified by hand against the repo**. The **13 HIGH-severity _claim-support_ findings**, predominantly "overreach"/"misattributed" judgments, were the contestable category, so they were then put through an adversarial multi-vote **confirm pass** (3 distinct-lens skeptics each — see *Confirmation pass* below): **9 confirmed, 4 struck as reviewer over-reach → 36 HIGH effective**. Finding-instances by the raw structured-data count: **40 HIGH · 81 MEDIUM · 95 LOW**, across 23 of 30 chapters (the synthesis narrative rounds HIGH to ~41).

---

## Overall verdict

**Conditional pass.** The Cert book is a genuinely strong, evidence-disciplined draft: citation hygiene is the headline strength (overall evidence-honesty 4.13/5), the strict-live methodology demonstrably works (the deterministic linter returns 0 FAIL across all 11 checks, and reviewers repeatedly confirmed quotes verbatim against the in-repo cache — e.g. D2.3, D2.5, D3.1, D4.3, D5.1 are near-flawless on claim-support), and the book honestly *refuses* to invent phantom surfaces (`errorCategory` in D2.2, the "85%→20%" folklore in D5.3, lost-in-the-middle attributed outward in D5.1). It is not yet ready to ship: there are ~41 HIGH-severity finding-instances across 23 of 30 chapters, including four outright **technical errors** (D5.3's "three bugs concurrent ~7 weeks" — the bugs never all overlapped; D5.6's inverted "training cutoff is earlier"; D5.6's over-stated "grammar-guaranteed" Citations; D2.2's is_error/JSON-RPC layer conflation), a recurring **citation-fidelity** pattern where Tag-`official` is attached to cache *synthesis* rather than verbatim source text (worst in D4.2 ×3 and D5.6 ×3, dragging both to evidence-honesty 2), and a systemic **cert-depth** thinness — average cert-alignment is only 3.03/5 because many chapters under-cover in-cache, exam-testable surfaces a 60-MCQ scenario exam will probe. The fixes are overwhelmingly *surgical and additive* (re-tag/re-source citations, correct four facts, add in-cache depth beats, rebalance MCQ options) rather than structural, and the two systemic linter findings (3 uncached D1.1 sources; an unwired 25-word MarginNote validator) are real but bounded. I verified the load-bearing HIGH findings and both linter findings directly against the repo before issuing this verdict.

## Per-domain rollup

| Domain | Weight | Chapters | Evidence-honesty (avg) | Cert-depth (avg) | Notes |
|---|---|---|---|---|---|
| **D1** Agentic Architecture & Orchestration | 27% | 7 | 3.86 | 3.00 | Strongest chapter in the book (D1.3) *and* the weakest (D1.7) live here. Recurring gaps: missing reliability/maintainability trade-off axes, unquantified 3-10x/15x token cost, and the 3 uncached D1.1 sources (the book's opening definitional claim is also a likely misattribution). |
| **D2** Tool Design & MCP Integration | 18% | 5 | 4.40 | 3.00 | Cleanest citation discipline in the book (D2.3, D2.5). Depth gaps are about *named surfaces left on the table* (input_examples, ResponseFormat, strict+any, connection-failure detection) — all in-cache. One real accuracy bug: D2.2 conflates the Messages-API `is_error` layer with the MCP JSON-RPC layer. |
| **D3** Claude Code Configuration & Workflows | 20% | 6 | 4.67 | 3.33 | Best-sourced *and* best-aligned domain (D3.1, D3.3, D3.4 all near-clean). Gaps are user-level rules (D3.3), the Skills lazy-load absolute that's false for `disable-model-invocation` (D3.2), and the promised-but-absent CI exit semantics (D3.6). |
| **D4** Prompt Engineering & Structured Output | 20% | 6 | 3.83 | 3.00 | Pulled down almost entirely by D4.2 (three misattributed citations → evidence 2). Otherwise strong (D4.3 improved on a flaw in its own cache). Shared depth gap: the `max_tokens` truncation failure mode and refusal-billing are documented in-cache but omitted across D4.3/D4.4/D4.5. |
| **D5** Context Management & Reliability | 15% | 6 | 4.00 | 2.83 | Lowest cert-depth in the book. Two chapters carry the most serious factual problems (D5.3 date arithmetic + MAST 100% overreach; D5.6 cutoff inversion + grammar overreach). D5.4 omits `/clear` entirely. D5.1 is a model of honest outward attribution. |
| **Overall** | 100% | 30 | **4.13** | **3.03** | Honesty high and consistent; depth uniformly ~3 and the binding constraint on exam-readiness. Freshness strong (4.53) — the volatility-class discipline is working. |

## Rubric

| Axis | Avg (/5) | One-line justification |
|---|---|---|
| **Evidence honesty** | 4.13 | Most chapters quote verbatim and tag-official correctly; a recurring minority attach `official` to cache *synthesis/takeaways* (D4.2, D5.6, D5.5, D4.4, D1.5, D2.2) or to the wrong one of two cross-referencing keys (D1.3, D1.5, D3.1). |
| **Cert alignment (depth)** | 3.03 | The binding weakness: chapters teach durable contracts well but omit in-cache, exam-testable feature surfaces and failure modes a 60-MCQ scenario exam will probe — nearly uniform across all five domains. |
| **Item quality** | 3.20 | Exercises are genuinely good application vignettes with real per-option rationale, but a recurring longest-option-is-correct testwiseness cue, thin MCQ density (often one MCQ per task area), and bare-recall Practice items hold the axis down. |
| **Structural / editorial** | 4.03 | Tight, well-sequenced reference prose with strong ConceptBox/KeyIdea/Pitfall use and exemplary Exam-essentials recaps; minor demerits for the unwired 25-word MarginNote cap and a few quotation-ellipsis mismatches. |
| **Technical accuracy** | 4.37 | High overall, but four outright errors (D5.3 concurrency, D5.6 cutoff direction, D5.6 grammar-guaranteed, D2.2 API/MCP layer) and a handful of over-strong absolutes (D3.2 description-always-loaded, D1.7 fork-as-standalone-control) keep it short of clean. |
| **Freshness** | 4.53 | Volatility classes are correctly assigned and named surfaces are current as of 2026-06-02; the only systemic exposure is that the cache (and a few chapters) predate Opus 4.8 and the 10 feature-surface chapters need disciplined re-verification. |

## Findings

_The 13 HIGH **claim-support** findings were subsequently put through an adversarial confirm pass (see **Confirmation pass** below): 9 stand, **4 were struck as reviewer over-reach** — D1.5:95, the D4.2 XML-block citation, D4.5:69 (batch billing), and D5.3:40 (MAST percentages). Do not act on those four._

| Chapter | Dimension | Severity | Location | Issue | Cache-trace / evidence | Recommendation |
|---|---|---|---|---|---|---|
| **Systemic (linter)** | claim-support | HIGH | manifest.yaml (44 sources); all cited in D1.1 | 3 of 44 manifest sources have no in-repo cache copy (`building-effective-agents`, `building-agents-with-the-sdk`, `how-claude-code-works`); claims citing them cannot be verified against the strict-live cache. | Verified: only an incidental cross-ref mention of building-effective-agents in one academy file; zero content hits for the other two. The line-44 opening definitional quote is additionally a likely misattribution (SDK-blog phrasing). | Capture all three into `docs/research/`; re-confirm or re-attribute the D1.1:44 and D1.1:113 quotes; until then soften the `official` tag to paraphrase. |
| **Systemic (linter)** | structural | HIGH | All 5 parts; up to 51 words | 26-27 MarginNote bodies exceed the 25-word cap that CLAUDE.md says is "enforced by the scaffold validator (Phase 2.6)"; `validate` passes anyway, so the documented enforcement is not wired. | Verified: 42 MarginNotes, 26 over cap, max 51 words (ironically the audited cache contains the very "≤25 words" verbosity bug). | Wire the validator or correct the CLAUDE.md claim; trim offending bodies. |
| D5.6 | technical-accuracy | HIGH | d5-06:75 | "the training-data cutoff is a separate, earlier date" is factually inverted. | Verified vs cache: training cutoff = reliable for Opus (both Jan 2026), LATER for Sonnet (Jan 2026 vs Aug 2025) and Haiku (Jul 2025 vs Feb 2025); never earlier. | State the accurate relationship (training cutoff is equal-or-later; the *reliable* cutoff is the conservative bound). |
| D5.6 | technical-accuracy / claim-support | HIGH | d5-06:48 (KeyIdea, uncited) | Central thesis "Citations is grammar-guaranteed / the model cannot fabricate a citation" over-states the API and is sourced from an uncited cache synthesis gloss. | docs-citations.md never uses grammar/constrained-decoding language; the guarantee is only that API-populated `cited_text` matches the cited span — the model can still cite an *irrelevant* span. | Downgrade to "cited_text cannot be fabricated; span relevance is still your job"; reserve "grammar-constrained" for Structured Outputs; add a citation. |
| D5.3 | technical-accuracy | HIGH | d5-03:56 | "three production bugs running concurrently for roughly seven weeks" is falsified by the source's own dates. | Verified vs cache: Bug 3 (Apr 16-20) began *after* Bug 1 (fixed Apr 7) and Bug 2 (fixed Apr 10); max overlap was two bugs. The ~7 weeks is the union degradation window. | Rewrite to "overlapped across a ~7-week degradation window (Mar 4-Apr 20)"; drop "concurrently for seven weeks." |
| D5.3 | claim-support | HIGH | d5-03:40 (+:104, Practice) | MAST percentages (41.77/36.94/21.30) sum to ~100% under "covering most of them," implying the three categories partition all failures. | Cache says these categories "cover 79% of breakdowns"; the figures are shares *within* the 79%. Imprecision is propagated into a Practice item. | Adopt the cache's "cover 79%" framing; drop the within-category percentages or label them as shares of the 79%. |
| D5.3 | cert-depth | HIGH | d5-03:62-71 | "Structured error context" is half the named task area but handled only by reference — no error-envelope example, no halt-vs-route-vs-retry/idempotency, no circuit-breaker states. | Cache + sibling D2.2 carry concrete mechanics the chapter never shows. | Add a concrete cross-boundary error envelope + 2-3 sentences each on halt/route/retry and breaker states. |
| D4.2 | claim-support | HIGH | d4-02:116, :86, :69-86 | Three times, Tag-`official` (twice with quotation marks + "the docs are explicit that…") is attached to material that exists *only* in the cache author's synthesized takeaways, incl. the entire Order-#4815 worked example. | Cache flags these as paraphrase/extrapolation, not in its verbatim Quoted block. | De-quote and attribute the *principle* (not the artifact); reserve quotation marks for the four genuine docs quotes. |
| D4.5 | claim-support / cert-depth | HIGH | d4-05:69, :111 | "you pay only for what works / billed only for `succeeded`" over-claims: the chapter's own second cited source documents that refusals are still billed in batch (and carry a `succeeded` result type). | blog-batch-structured-output-pattern.md:135; the series treats this as load-bearing in D4.3. | Reframe to "not billed for the three non-result types"; add the refusal/`stop_reason` failure mode. |
| D5.4 | cert-depth | HIGH | whole chapter | For a task area on context levers, `/clear` appears nowhere despite being a first-class lever in three of four cited caches; scratchpads headline the title but get ~1.5 sentences. | Verified: zero `/clear` hits; richer scratchpad mechanic (inter-agent scratchpads) in the cache is unused. | Add a `/compact`-vs-`/clear` decision beat and a real scratchpad treatment (survives compaction). |
| D1.7 | cert-depth + item-quality | HIGH | d1-07 table :57; Practice :107-111 | Literal SDK param spellings (`fork_session`/`forkSession`/`continue_conversation`) never appear though the task title advertises them; both Practice items are bare-recall flashcards with no solutions and zero MCQs. | grep confirms zero `fork_session` hits; cache gives the exact surfaces. | Add the Python/TS parameter names to the controls table; convert ≥1 Practice into a 4-option scenario MCQ with rationale. |
| D1.3 | cert-depth | HIGH | whole chapter | The subagent *return* path is absent: the chapter teaches "the prompt string is the only channel IN" but never that the parent receives the final message verbatim BUT may summarize it. | docs-subagents.md:30 (citation-ready); classic scenario trap. | Add a KeyIdea on the return channel and the "instruct the main agent to preserve verbatim" fix. |
| D1.5 | claim-support | HIGH | d1-05:95 | "subagents do not inherit permissions" cited to `agent-sdk-permissions`, whose cache only *cross-references* the fact (states it nowhere in its own body). | Fact is first-hand in the hooks cache (:163) and in docs-subagents. | Re-point the citation to `agent-sdk-hooks` or `agent-sdk-subagents`. |
| D1.5 | cert-depth | HIGH | whole chapter | `defer` appears 7×, is used in an "Analyze the precedence" objective, but is never defined. | Cache plainly defines it ("ends the query so the host can resume later"; `updatedInput` ignored). | Add one sentence defining `defer`. |
| D3.2 | technical-accuracy | HIGH | d3-02:58-60, :121 | "the description is the ONLY part loaded at startup / always in context" is an absolute the chapter's own cache contradicts. | docs-skills.md:156 — a `disable-model-invocation: true` skill's description is NOT in context. | Qualify: descriptions of model-invocable skills load at startup; user-only skills carry none. |
| D3.2 | cert-depth | HIGH | whole chapter | Omits several quantitative/lifecycle surfaces in its own cache (description-budget overflow, compaction carry-forward, `$ARGUMENTS` substitution, live change detection, paths-scoped activation). | docs-skills.md lines 79-86, 187, 30. | Add the description-budget and argument-substitution beats at minimum. |
| D3.3 | cert-depth | HIGH | whole chapter | User-level rules (`~/.claude/rules/`) and their precedence are never covered; the "concatenation-not-precedence" framing understates that a precedence *does* exist across rule scopes. | Live source: "user-level loaded before project, project wins"; D3.1 has no `rules` content either. | Add a paragraph on `~/.claude/rules/` and the user-before-project precedence. |
| D3.6 | cert-depth | HIGH | d3-06:41 + whole chapter | Promises "exit semantics" but never teaches non-zero exit codes — the mechanism by which a CI job fails. | Cache supplies exit codes (auth-status 0/1, ultrareview 0/1, stdin-cap non-zero). | Add an exit-semantics subsection fulfilling the line-41 promise. |
| D1.4 | cert-depth | HIGH | "control flow" / "handoff contract" | The programmatic/handoff half of the task area is taught only abstractly — no schema-vs-semantic validation gate, no reject-and-retry loop, no SPEC.md/tests.json artifact. | The chapter's own cited caches are full of exactly this. | Add a "what a validation gate does" beat with a concrete handoff artifact. |
| D1.6 | cert-depth | HIGH | "Choosing the structure" / Exam essentials | Pipeline-vs-adaptive cost axis asserted qualitatively but never quantified, though both cited sources hand it the numbers. | ~3-10x / ~15x token multipliers; "thoroughness not speed." | Add one or two sentences grounding cost/latency with the existing citations. |
| D2.1 | cert-depth | HIGH | "description is the highest-leverage surface" | Omits `input_examples` (Tool Use Examples) — the documented complement to descriptions — and never names ResponseFormat or MCP `outputSchema`; all in-cache and D2.1-testable. | docs-define-tools.md:35,140-160; grep: input_examples in no chapter. | Add an input_examples subsection; name ResponseFormat (host-side) and outputSchema. |
| D2.2 | technical-accuracy | HIGH | d2-02:58-66 | Silently conflates `is_error` (Messages API) with `isError`+JSON-RPC `-32602` (MCP) and presents the MCP two-channel split as universal. | API-side cache never mentions JSON-RPC; a direct-Messages-API scenario has no correct answer under the chapter's framing. | Add one sentence distinguishing the two layers; keep casing consistent within each. |
| D2.3 | cert-depth | HIGH | whole chapter (×2) | Omits two citation-ready facts in its own cache: `tool_choice: any`+`strict: true` guarantees a schema-valid call (the chapter's own Exercise sets up exactly this), and changing `tool_choice` invalidates cached message blocks. | docs-define-tools.md:90-96, 100-106. | Add a paragraph on strict+any and a Cost MarginNote on tool_choice cache invalidation. |
| D2.4 | cert-depth | HIGH | whole chapter | For a config chapter that promises "the agent silently never sees the tools," omits `claude mcp add --scope` (how scopes are actually set), connection-failure detection (`system:init` status enum + 60s timeout), and `strictMcpConfig`. | All present in the cited caches. | Add a "verifying a server connected" beat; name `--scope` and `strictMcpConfig`. |
| D4.3 | cert-depth | HIGH | d4-03:100, :137 | Declares refusal "THE one failure constrained decoding cannot prevent," omitting the co-equal `max_tokens`-truncation failure (200 + possibly-invalid mid-grammar JSON) the cache stresses three times. | docs-structured-outputs.md:68; blog-batch:136. | Add max_tokens truncation as a second post-decode failure; soften "the one failure." |
| D4.4 | claim-support | HIGH | d4-04:40 | Headline semantic-error "quote" is presented in quotation marks + `official` but the backing cache labels it "Anthropic docs synthesis (search result)," not verbatim. | blog-semantic-vs-schema-errors.md:44-46; real page text differs. | Drop quotation marks / "the docs are explicit," or swap in a genuinely verbatim quote. |
| D4.6 | cert-depth | HIGH | "The fleet" / Exam essentials | Under-covers exam-classic Code Review surfaces in-cache: the 🔴/🟡/🟣 severity taxonomy, `@claude review once`, and the research-preview/Team+Enterprise/non-ZDR/neutral-conclusion facts. | docs-code-review.md:33, 26, 23-24. | Add a ConceptBox on severity tiers, the review-once trigger, and availability. |
| D5.2 | cert-depth | HIGH | d5-02:48, :71 | Treats AskUserQuestion as essentially the only escalation mechanism; the tool-approval path and the six canUseTool response patterns (incl. deny-with-guidance) are barely surfaced. | docs-user-input.md:23, 28-34. | Add a ConceptBox distinguishing the two escalation triggers and the suggest-alternative / approve-with-changes patterns. |
| D5.5 | claim-support | HIGH | d5-05:49 | Triple `official` citation to the SDK doc for `calculated_total`/`stated_total`/`conflict_detected`/`confidence` fields the true-fetch cache never contains. | Fields live only in a synthesis cache that itself flags them "extrapolated." | Re-tag as convergence/practitioner and cite the synthesis as a distinct key, or keep `official` only for the narrow true claim. |
| D5.5 | cert-depth | HIGH | d5-05:70-72 + title | Never engages the *measurement* sense of "confidence calibration" (does stated confidence match accuracy; ECE/over-confidence) despite it being the literal task-area name. | Cache supports the distinction. | Add a subsection separating routing calibration from signal calibration. |
| D5.6 | claim-support | HIGH | d5-06:67 | Provenance-triple verification rule tagged `official` is an extrapolated schema pattern, not Anthropic-documented. | blog-semantic-vs-schema-errors.md:146 (synthesis prose); open-questions flag it as extrapolation. | Re-tag the triple as practitioner/convergence. |
| D5.6 | claim-support | HIGH | d5-06:48 (KeyIdea) | Load-bearing "cannot fabricate / grammar-constrained" thesis carries NO citation and rests on uncited synthesis prose. | Term appears nowhere in docs-citations.md. | Attach a citation and frame as the book's interpretation, not an Anthropic guarantee. |
| D1.1 | cert-depth | MEDIUM | "The loop is a control structure" (×2) | `is_error` named once but never explained; the all-tool_results-must-return-together rule for parallel `tool_use` is absent — both high-probability MCQ traps in a "tool-result handling" task area. | docs-tool-use.md:67,92; agent-loop:77. | Add an is_error sentence and a parallel-result clause; cross-ref D2.3. |
| D1.2 | claim-support | MEDIUM | d1-02:47 | 90.2% gain presented as a general pattern benchmark, dropping the Opus-4-vs-(Opus-4-lead+Sonnet-4-subs) pairing the cache (and its README) require. | blog-multi-agent-research-system.md:40; README:108 warns against generalizing. | Restore the model qualifier; keep 90.2% as illustrative, not generalizable. |
| D1.2 / D1.6 (2 chapters) | cert-depth | MEDIUM | trade-off / "When the pattern earns its cost" | The reliability (SPOF vs multiple failure points) and maintainability (multiple prompt sets) trade-off axes appear nowhere in D1 despite being canonical "downside-of-multi-agent" MCQ fodder. | blog-when-to-use-multi-agent.md:129-130. | Add the two rows to the cost discussion / Exam essentials. |
| D1.4 / D1.2 (2 chapters) | claim-support | MEDIUM | d1-04:53, d1-02:81 | The "telephone game" quote stitches three separate cache bullets into one run-on sentence presented as continuous verbatim; the cache (itself a paraphrase) pins only the phrase "the telephone game." | blog-when-to-use-multi-agent.md:107-113. | Quote only the pinned phrase; paraphrase the rest. Fix both chapters. |
| D3.1 | claim-support | MEDIUM | d3-01:57 | Settings-precedence quotation rendered with an ellipsis that drops CLI and Local, showing a three-level ladder while the prose calls it "five-level." | docs-settings.md:38 (full ladder). | Quote the full ladder or paraphrase with all five levels named. |
| D2.2 / D4.3 (2 chapters) | claim-support | MEDIUM | d2-02:42, d4-03 Pitfall | An `official`-grade claim wraps a cache *synthesis* paraphrase in quotation marks (D2.2:42), and an official-grade strict-OpenAI-compat fact is delivered entirely uncited (D4.3). | docs-handle-tool-calls.md:25; D4.3 source not in frontmatter. | Drop quotation marks where paraphrasing; add the missing citation + frontmatter source. |
| D3.4 | cert-depth | MEDIUM | d3-04:73 | Alludes to model hybridization but never names the `opusplan` alias — the single most exam-relevant adjacent term, already cached in-repo. | docs-model-config.md:23,50. | Name and cite `opusplan`. |
| (recurring, ~14 chapters) | cert-depth | MEDIUM | Practice sections | Practice items frequently lack Solutions and/or are bare recall, and MCQ density is thin (often one MCQ per task area) for a 60-MCQ scenario exam. | Confirmed house convention (Practice solution-free) in some chapters; in others the asymmetry leaves the hardest content unkeyed. | Decide/document the Practice-answer-key convention; add 1-2 scenario MCQs per thin chapter. |
| (recurring, ~6 chapters) | item-quality | MEDIUM/LOW | Exercise options | Longest-option-is-correct testwiseness cue: the keyed option is the longest and/or the only multi-clause one (D4.1, D5.1, D5.3, D5.5, D4.3, D3.4). | Measured option lengths in each review. | Rebalance option lengths so correctness does not correlate with length. |
| D1.1 | technical-accuracy | LOW | d1-01:72-79 | The stop_reason table silently blends raw Messages-API `tool_use` with SDK-ResultMessage values; a "ResultMessage.stop_reason == tool_use" scenario could exploit it. | Both layers individually correct (tool-use cache; agent-loop:42). | Add a column note distinguishing the layer. |
| D2.5 | claim-support | LOW | d2-05:72 | acceptEdits command list drops `rmdir` (cache lists seven, chapter prints six) — matters because this is a feature-surface chapter whose value is exact named flags. | docs-permissions.md:32. | Add `rmdir` or say "filesystem commands." |
| D1.7 | claim-support | HIGH→LOW (overreach) | d1-07:93 | Scratchpad sentence tagged `official` to claude-code-best-practices, but that cache explicitly flags the scratchpad phrasing as drifted out of the current page (indexed-only). | docs-best-practices-writer-reviewer.md:29,125. | De-officialize or re-anchor to the research-system cache (different sense). |

## Strengths

- **Citation discipline is genuinely strong and verifiable.** Across the majority of chapters, every sentence ending in a `Tag`+`Citation` traces to a real manifest key and is verbatim-or-faithful against the in-repo cache. D2.3 and D2.5 survived adversarial falsification of every sourced claim; D3.1, D4.3, D5.1, D1.6 are near-clean. The book also splits attribution carefully (e.g. D1.2's 15x→research-system, 3-10x→when-to-use; D2.3 single-citing the prefill quote to the one page that carries it).
- **The strict-live methodology demonstrably suppresses fabrication.** The book repeatedly *declines* to invent plausible surfaces: `errorCategory` is correctly treated as a phantom (D2.2), the "85%→20%" compounding folklore the cache warns against is omitted (D5.3), and lost-in-the-middle / context-rot are attributed *outward* to the Design book with a real on-disk blob link rather than dressed in a fabricated T1 cite (D5.1). D4.3 even *improved* on a flaw in its own source cache.
- **Honest hedging on volatile surfaces.** Feature-surface enums (stop_reason long tail, the 10/19 hook events, MCP transports) are pinned to "verify against the API reference" rather than asserted as exhaustive (D1.1's stop_sequence/pause_turn MarginNote is called "a model of honest hedging"), and volatility classes are correctly assigned book-wide (freshness 4.53).
- **Tight, well-sequenced reference prose.** Reviewers consistently rate structural-editorial 4/5: clean section flow, effective ConceptBox/KeyIdea/Pitfall usage, and exemplary "Exam essentials" recaps. D1.3's Exam-essentials recap and D2.5's per-option Exercise rationale are called out as models.
- **The best Exercises are real application vignettes, not recall.** Where the book builds an MCQ it usually builds it well — cover-the-options-answerable stems, homogeneous distractors drawn from the chapter's own named misconceptions, and Solutions that give per-option reasoning rather than a bare letter (D2.5, D3.3, D3.4, D4.6, D5.1).
- **Correct cert-taxonomy scoping and clean deferral.** Chapters defer adjacent material to the right siblings (D1.2→D1.3/D1.6; D3.5's Writer/Reviewer→D4.6; D3.1 correctly leaves `.claude/rules/` to D3.3) instead of duplicating or over-claiming, and the deterministic linter confirms 0 instructor-PDF leakage and 0 phantom-guard regressions.

## Round-2 cross-links

- **Cross-book `XRef` remains blocked on scaffold #96.** Every cert→handbook and cert→design reference is currently a bare-prose or blob link by necessity. The reviews confirm the convention is being followed correctly (real blob link only when the target is on disk — verified for `ch01-harness-frame.mdx` and `ch08-context-rot.mdx`); keep prose-only links until #96 lands an XRef that resolves across book boundaries.
- **Two-tier practice-exam pools are still deferred.** The single most common item-quality observation — that all-constructed-response Practice items and one-MCQ-per-task-area density under-rehearse the 60-MCQ scenario format — is partly a function of this deferral. An appendix-level item bank with homogeneous distractors (per the misconceptions each chapter already surfaces) is the structural fix, separate from per-chapter polish.
- **`last_verified` refresh due for the 10 feature-surface chapters** — D1.5, D2.3, D2.4, D2.5, D3.2, D3.3, D3.6, D4.3, D4.5, D5.6 — whose named enums/flags/paths drift fastest. The cache snapshot (2026-05-22) and several model-name exemplars predate Opus 4.8 (current 2026-06-02); the stable-principle chapters are unaffected, but these named surfaces should be re-checked on the next cache pull.

## Recommended actions

1. **Run a book-wide citation-fidelity pass.** De-quote or re-attribute every `Tag kind="official"` sentence whose backing is a cache *synthesis/takeaway* rather than verbatim source text — concentrated in D4.2 (×3), D5.6 (×3), D5.5, D4.4, D1.5, D2.2, D1.3, D3.1 — and capture the 3 missing D1.1 sources, re-confirming or re-attributing the D1.1:44 / D1.1:113 quotes. This directly lifts the lowest evidence-honesty scores (D4.2 and D5.6 at 2).
2. **Correct the four outright factual errors:** D5.3 "~7-week concurrency," D5.6 "training cutoff is earlier," D5.6 "grammar-guaranteed Citations" (→ "cited_text cannot be fabricated; span relevance still your job"), and D2.2's `is_error`/JSON-RPC layer conflation.
3. **Wire (or de-document) the 25-word MarginNote validator** so the 26-27 over-cap bodies fail `validate`, then trim them.
4. **Close the highest-yield cert-depth gaps with material already in-cache:** D1.7/D5.4 literal SDK param names + `/clear`-vs-`/compact`; D2.1 `input_examples`+ResponseFormat; D2.3 strict+any + tool_choice cache invalidation; D1.3 subagent return path; D1.5 `defer` definition; D3.6 exit codes; D4.3/D4.5 max_tokens + refusal failure modes; D5.6 all-or-none Citations enablement; D3.3 user-level rules; D3.2 description-budget + arguments.
5. **Quantify the asserted-but-unmeasured trade-offs:** add the multi-agent reliability/maintainability axes (SPOF, multiple prompt sets) and the 3-10x/15x token-cost + latency numbers in D1.2, D1.6, D1.4, and D5.3.
6. **Strengthen the assessment surface:** add 1-2 distractor-bearing scenario MCQs per thin chapter, rebalance option lengths to remove the recurring longest-option-is-correct tell (D4.1, D5.1, D5.3, D5.5, D4.3, D3.4), and explicitly decide/document whether Practice items carry answer keys.
7. **Schedule the `last_verified` refresh** for the 10 feature-surface chapters and re-check Opus 4.7→4.8 exemplars on the next cache pull.
8. **Track the two deferred structural items** — cross-book XRef (scaffold #96) and the two-tier practice-exam pools — so they are not lost between Round 2 polish and v1.0.

---

## Confirmation pass — adversarial verification of the claim-support findings (2026-06-02)

Each of the 13 HIGH-severity **claim-support** findings was stress-tested by **3 independent skeptics** working distinct lenses — *literal-verbatim*, *substance*, and *book-convention* — each tasked to **refute** the finding by going back to the source. Majority-refute kills the finding; a finding that survives is hardened. **39 skeptic agents; some consulted the live source pages beyond the cache.**

**Outcome: 9 CONFIRMED · 4 KILLED · 0 SPLIT.** The 4 killed findings were reviewer over-reach — the cited claims are adequately supported — and are **struck from the Round-2 fix list**. The 9 confirmed findings survived refutation and stand.

| # | Chapter | Location | Charge | Votes (R/U) | Verdict | Majority rationale |
|---|---|---|---|---|---|---|
| 1 | D1.1 | d1-01-agentic-loops.mdx:44 | unsupported | 1R / 2U | **CONFIRMED** | Quoted phrase "an LLM autonomously using tools in a loop" is in no backing cache; live-fetching the cited post shows it says "LLMs using tools based on environmental feedback in a loop" — faithful in substance, but the quotation marks assert verbatim text not in the source. |
| 2 | D1.1 | d1-01-agentic-loops.mdx:113 | unsupported | 0R / 3U | **CONFIRMED** | Neither quoted string ("powered by two components", "primary building blocks of execution") exists in any cache; the two cited sources were never captured. |
| 3 | D1.5 | d1-05-agent-sdk-hooks.mdx:95 | misattributed | 3R / 0U | **KILLED** | The cited file docs-permissions.md (= agent-sdk-permissions) *does* state the permission-inheritance fact at line 97, matching both clauses — the citation is correct. |
| 4 | D1.7 | d1-07-session-state.mdx:93 | overreach | 0R / 3U | **CONFIRMED** | The scratchpad sentence is tagged official to claude-code-best-practices, but that cache flags the scratchpad phrasing as drifted out of the current page. |
| 5 | D4.2 | d4-02 Exercise solution (ambiguous edge), :116 | misattributed | 1R / 2U | **CONFIRMED** | The sentence is quote-marked and prefixed "the docs are explicit that," but the string is not verbatim in the cited docs — it is the cache author's synthesis. |
| 6 | D4.2 | "Target the ambiguous case directly":86 | misattributed | 1R / 2U | **CONFIRMED** | The quoted "schema locks the shape but examples still teach content" clause is not verbatim in the backing source. |
| 7 | D4.2 | "Target the ambiguous case", XML block | misattributed | 2R / 1U | **KILLED** | Under the book convention, the official Tag attaches to the *interpretive principle* (a faithful paraphrase of the T1-backed dossier), not to the worked XML artifact — defensible. |
| 8 | D4.4 | d4-04-validation-retry-feedback.mdx:40 | overreach | 0R / 3U | **CONFIRMED** | The quoted semantic-error sentence appears only in blog-semantic-vs-schema-errors.md, whose next line flags it as "Anthropic docs synthesis," not verbatim source. |
| 9 | D4.5 | d4-05-batch-processing.mdx:69 / :111 | overreach | 2R / 1U | **KILLED** | docs-batch-api.md:25 states near-verbatim "not billed for errored, canceled, or expired requests" — the billing claim is supported. |
| 10 | D5.3 | d5-03-error-propagation.mdx:40 | overreach | 3R / 0U | **KILLED** | The MAST percentages (41.77/36.94/21.30) and the "cover 79% of breakdowns" framing are both present verbatim in the cited cache; the chapter's "covering most of them" is faithful. |
| 11 | D5.5 | d5-05-human-review-confidence.mdx:49 | overreach | 0R / 3U | **CONFIRMED** | The three cited field names live only in a synthesis cache that itself flags them "extrapolated"; the SDK true-fetch cache does not contain them. |
| 12 | D5.6 | d5-06-information-provenance.mdx:75 | unsupported | 0R / 3U | **CONFIRMED** | The "training-data cutoff is a separate, earlier date" assertion has no support in docs-models-overview.md — and is contradicted by its cutoff table (training ≥ reliable). |
| 13 | D5.6 | d5-06-information-provenance.mdx:48 | misattributed | 1R / 2U | **CONFIRMED** | The uncited KeyIdea's load-bearing "the model cannot fabricate a citation" claim does not appear in docs-citations.md. |

### The 4 struck (KILLED) findings — do not act on these

- **D1.5 — d1-05-agent-sdk-hooks.mdx:95** (charge `misattributed`, refuted 3–0): the cited `agent-sdk-permissions` cache (docs-permissions.md:97) *does* contain the permission-inheritance fact matching both clauses; the citation is correct, not misattributed.
- **D4.2 — "Target the ambiguous case directly", XML block** (charge `misattributed`, refuted 2–1): the official Tag attaches to the interpretive principle (a faithful paraphrase of the T1-backed dossier), not to the worked XML artifact — defensible under the book's convention.
- **D4.5 — d4-05-batch-processing.mdx:69 / :111** (charge `overreach`, refuted 2–1): docs-batch-api.md states verbatim "not billed for errored, canceled, or expired requests"; the chapter's billing claim is supported near-verbatim.
- **D5.3 — d5-03-error-propagation.mdx:40** (charge `overreach`, refuted 3–0): the cited cache states the three MAST percentages and the "cover 79% of breakdowns" framing verbatim; the chapter reports them faithfully. (Note: D5.3's *separate* HIGH technical-accuracy finding — the "~7-week concurrency" — is unaffected and stands.)

## Reproduction & evidence

- **Linter (Part A):** `node architect-reference/scripts/cert-audit.mjs` — deterministic and re-runnable; intended to re-run on each Round-2 `last_verified` refresh (it also closes the manifest→cache backing gap that the astro build cannot see).
- **Review (Part B):** workflow `cert-book-independent-review` (31 agents — 30 chapter reviewers + 1 synthesizer). Each reviewer returned structured findings for its chapter (exact location, `cache_trace` verdict, evidence quote, and 6-axis rubric scores); the *Findings* table above is the deduplicated, severity-ranked synthesis of all 30. The full per-chapter detail is retained in the Part-B run output and is available on request.

---

## Appendix A — Deterministic linter report

Generated by `architect-reference/scripts/cert-audit.mjs` over 30 chapters, 44 manifest keys, 180 cached source URLs.

**Totals:** 0 FAIL · 30 WARN · 0 INFO.

| # | Check | FAIL | WARN | Status |
|---|---|---:|---:|---|
| 1 | Frontmatter completeness | 0 | 0 | 🟢 PASS |
| 2 | Citation key resolution | 0 | 0 | 🟢 PASS |
| 3 | Citation→cache backing | 0 | 3 | 🟡 WARN |
| 4 | Manifest duplicate ids | 0 | 0 | 🟢 PASS |
| 5 | MarginNote 25-word cap | 0 | 27 | 🟡 WARN |
| 6 | Approved MarginNote labels | 0 | 0 | 🟢 PASS |
| 7 | Tag/Citation pairing | 0 | 0 | 🟢 PASS |
| 8 | Instructor-PDF leakage | 0 | 0 | 🟢 PASS |
| 9 | Structural presence | 0 | 0 | 🟢 PASS |
| 10 | Phantom-guard regressions | 0 | 0 | 🟢 PASS |
| 11 | Outward-link integrity | 0 | 0 | 🟢 PASS |

### Check 3 — Citation→cache backing

- **WARN** `manifest:building-agents-with-the-sdk` — url not backed by any cached source_url: https://claude.com/blog/building-agents-with-the-claude-agent-sdk
- **WARN** `manifest:building-effective-agents` — url not backed by any cached source_url: https://www.anthropic.com/engineering/building-effective-agents
- **WARN** `manifest:how-claude-code-works` — url not backed by any cached source_url: https://code.claude.com/docs/en/how-claude-code-works

### Check 5 — MarginNote 25-word cap

- **WARN** `d1-01-agentic-loops.mdx:81` — MarginNote body is 40 words (cap 25)
- **WARN** `d1-02-coordinator-subagent-patterns.mdx:59` — MarginNote body is 33 words (cap 25)
- **WARN** `d1-03-subagent-invocation.mdx:51` — MarginNote body is 26 words (cap 25)
- **WARN** `d1-03-subagent-invocation.mdx:69` — MarginNote body is 42 words (cap 25)
- **WARN** `d1-04-multi-step-workflows.mdx:77` — MarginNote body is 30 words (cap 25)
- **WARN** `d1-04-multi-step-workflows.mdx:89` — MarginNote body is 31 words (cap 25)
- **WARN** `d1-05-agent-sdk-hooks.mdx:38` — MarginNote body is 39 words (cap 25)
- **WARN** `d1-05-agent-sdk-hooks.mdx:75` — MarginNote body is 31 words (cap 25)
- **WARN** `d1-06-task-decomposition.mdx:59` — MarginNote body is 36 words (cap 25)
- **WARN** `d1-06-task-decomposition.mdx:89` — MarginNote body is 32 words (cap 25)
- **WARN** `d2-01-tool-interfaces.mdx:66` — MarginNote body is 33 words (cap 25)
- **WARN** `d2-01-tool-interfaces.mdx:84` — MarginNote body is 42 words (cap 25)
- **WARN** `d2-02-structured-errors.mdx:72` — MarginNote body is 49 words (cap 25)
- **WARN** `d2-03-tool-choice-distribution.mdx:41` — MarginNote body is 43 words (cap 25)
- **WARN** `d2-03-tool-choice-distribution.mdx:65` — MarginNote body is 50 words (cap 25)
- **WARN** `d2-04-mcp-configuration.mdx:40` — MarginNote body is 52 words (cap 25)
- **WARN** `d2-04-mcp-configuration.mdx:74` — MarginNote body is 43 words (cap 25)
- **WARN** `d2-04-mcp-configuration.mdx:84` — MarginNote body is 48 words (cap 25)
- **WARN** `d2-05-builtin-tools.mdx:39` — MarginNote body is 47 words (cap 25)
- **WARN** `d3-01-claude-md-hierarchy.mdx:49` — MarginNote body is 31 words (cap 25)
- **WARN** `d3-01-claude-md-hierarchy.mdx:71` — MarginNote body is 31 words (cap 25)
- **WARN** `d3-02-slash-commands-skills.mdx:38` — MarginNote body is 39 words (cap 25)
- **WARN** `d3-03-rules-path-scoping.mdx:37` — MarginNote body is 35 words (cap 25)
- **WARN** `d3-06-cicd-integration.mdx:40` — MarginNote body is 43 words (cap 25)
- **WARN** `d4-03-structured-output-tool-use.mdx:39` — MarginNote body is 51 words (cap 25)
- **WARN** `d4-05-batch-processing.mdx:38` — MarginNote body is 44 words (cap 25)
- **WARN** `d5-06-information-provenance.mdx:39` — MarginNote body is 41 words (cap 25)
