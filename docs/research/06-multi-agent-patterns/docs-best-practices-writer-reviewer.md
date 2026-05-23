---
source_url: https://code.claude.com/docs/en/best-practices
canonical_url: https://code.claude.com/docs/en/best-practices
source_title: Best practices for Claude Code
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: multi-agent-patterns
tier: T1-official
cert_domains: [4]
cert_task_areas:
  - "Multi-instance / multi-pass review (independent reviewers, attention dilution)"
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Claude Code Docs — Best practices (Writer/Reviewer pattern + fresh-context review)

The official Claude Code best-practices page (formerly `anthropic.com/engineering/claude-code-best-practices`, now `code.claude.com/docs/en/best-practices`). This is the **canonical Anthropic-authored statement of the Writer/Reviewer pattern, fresh-context independent review, and subagent-based verification** — the multi-instance review primitives that scale up to the Code Review product fleet. The "Run multiple Claude sessions" section explicitly motivates parallel sessions as a quality-focused affordance (not just speed-focused) because *a fresh context improves code review since Claude won't be biased toward code it just wrote*.

## Key takeaways

- **The core multi-instance principle**: *a fresh context improves code review since Claude won't be biased toward code it just wrote*. This is Anthropic's direct statement of why self-review is structurally weaker than fresh-context independent review.
- **Writer/Reviewer pattern (concrete)**: two sessions, one writes, the other reviews. The page provides a worked example: Session A implements a rate limiter; Session B reviews `@src/middleware/rateLimiter.ts` looking for edge cases, race conditions, and consistency with existing middleware patterns; Session A then addresses the review feedback. Same pattern works for test/code separation (one writes tests, another writes code to pass them).
- **Subagent-based verification within a single session**: *use a subagent to review this code for edge cases*. Subagents run in *separate context windows* — they get a clean slate without the implementer's assumptions, blind spots, or context bias. The verification subagent is the lightweight one-Claude analog of the Writer/Reviewer two-session pattern.
- **Attention dilution is acknowledged as a root cause**: *LLM performance degrades as context fills. When the context window is getting full, Claude may start "forgetting" earlier instructions or making more mistakes. The context window is the most important resource to manage.* The whole rationale for fresh-context review derives from this constraint.
- **`/clear` between unrelated tasks** is the single-session analog: when a context is *cluttered with failed approaches*, the recommendation is to clear and start fresh, because *a clean session with a better prompt almost always outperforms a long session with accumulated corrections*. The "fresh context wins" principle applies even within one human session.
- **Scratchpad-based inter-Claude communication** is supported: *you can even have your Claude instances communicate with each other by giving them separate working scratchpads and telling them which one to write to and which one to read from* (this exact phrasing appears in indexed snippets of the prior URL; the current Writer/Reviewer table demonstrates the pattern by having Session A consume `[Session B output]` directly).
- **Subagents for investigation also enable multi-pass research**: research subagents *run in separate context windows and report back summaries* — keeping the main conversation clean and uncluttered for implementation, the same architectural shape as fresh-context review.
- **Overfitting-to-tests countermeasure** (paraphrased from indexed snippets): *verify with independent subagents that the implementation isn't overfitting to the tests*. The independent-reviewer pattern protects against the implementer's blind spots about its own tests.
- **The "fan out across files" pattern**: for large migrations, distribute work across many parallel `claude -p` invocations. Each one operates on its own file with its own context. This is the multi-instance pattern applied to throughput rather than quality.
- **Parallel-session affordances**: worktrees, desktop-app sessions, Claude Code on the web (Anthropic-managed cloud VMs), agent teams. Four officially-supported routes to parallel multi-instance work.
- **Sub-second-opinion via a spec interview**: the *let Claude interview you* pattern explicitly recommends *start a fresh session to execute it. The new session has clean context focused entirely on implementation*. Fresh context is the recommendation **across** task phases, not just for review.

## Quoted (citation-ready)

> "Beyond parallelizing work, multiple sessions enable quality-focused workflows. A fresh context improves code review since Claude won't be biased toward code it just wrote."
>
> — Best practices for Claude Code, Run multiple Claude sessions
>
> Anchor: `Run multiple Claude sessions + "Pick the parallel approach that fits"`

> "For example, use a Writer/Reviewer pattern: [Session A (Writer)] Implement a rate limiter for our API endpoints. [Session B (Reviewer)] Review the rate limiter implementation in @src/middleware/rateLimiter.ts. Look for edge cases, race conditions, and consistency with our existing middleware patterns. [Session A (Writer)] Here's the review feedback: [Session B output]. Address these issues."
>
> — Best practices for Claude Code, Run multiple Claude sessions
>
> Anchor: `Run multiple Claude sessions + "For example, use a Writer/Reviewer"`

> "You can do something similar with tests: have one Claude write tests, then another write code to pass them."
>
> — Best practices for Claude Code, Run multiple Claude sessions
>
> Anchor: `Run multiple Claude sessions + "You can do something similar"`

> "Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills."
>
> — Best practices for Claude Code, (top, pre-sections)
>
> Anchor: `(top) + "Most best practices are based on"`

> "LLM performance degrades as context fills. When the context window is getting full, Claude may start \"forgetting\" earlier instructions or making more mistakes. The context window is the most important resource to manage."
>
> — Best practices for Claude Code, (top, pre-sections)
>
> Anchor: `(top) + "This matters since LLM performance degrades"`

> "Since context is your fundamental constraint, subagents are one of the most powerful tools available. When Claude researches a codebase it reads lots of files, all of which consume your context. Subagents run in separate context windows and report back summaries."
>
> — Best practices for Claude Code, Use subagents for investigation
>
> Anchor: `Use subagents for investigation + "Since context is your fundamental"`

> "You can also use subagents for verification after Claude implements something: use a subagent to review this code for edge cases"
>
> — Best practices for Claude Code, Use subagents for investigation
>
> Anchor: `Use subagents for investigation + "You can also use subagents for"`

> "If you've corrected Claude more than twice on the same issue in one session, the context is cluttered with failed approaches. Run `/clear` and start fresh with a more specific prompt that incorporates what you learned. A clean session with a better prompt almost always outperforms a long session with accumulated corrections."
>
> — Best practices for Claude Code, Course-correct early and often
>
> Anchor: `Course-correct early and often + "The best results come from"`

> "Once the spec is complete, start a fresh session to execute it. The new session has clean context focused entirely on implementation, and you have a written spec to reference."
>
> — Best practices for Claude Code, Let Claude interview you
>
> Anchor: `Let Claude interview you + "Claude asks about things you might"`

## Pattern summary (per cert task area)

| Pattern | Anti-dilution mechanism | When to reach for it |
|---|---|---|
| **Writer/Reviewer (two sessions)** | Reviewer has no inherited context from the writer; cannot rationalize the writer's choices | Quality-critical changes where bias toward the just-written code is a known risk |
| **Test/Code split (two sessions)** | Tests are written first by one Claude; implementation by a second Claude with no view of the test internals | Spec-first / TDD-style flows where you want the test author and implementer to be genuinely independent |
| **Verification subagent (single session)** | Subagent inherits no context from the parent's main conversation, runs in its own window | Lightweight quality check during a single working session — no need to spin up a separate session |
| **Investigation subagent** | Same isolated-context property; subagent's findings come back as a summary, not the raw files | Codebase exploration where reading all the files in the main session would blow context |
| **Fan-out across files (`claude -p` loop)** | Each invocation is a fresh context per file | Bulk migration / analysis where each unit of work fits in one context |
| **`/clear` between tasks** | Single-session reset; nullifies accumulated drift / failed-approach pollution | When a session has accumulated too many corrections or unrelated context |
| **Fresh-session execution of a spec** | Implementation phase starts with no interview context | After a heavy planning / interview phase; reduces dilution from planning artifacts |
| **Multiple-session routes** | Worktrees / Desktop / Claude Code on the web / Agent teams | When isolation between sessions also requires filesystem / git isolation |

## Why fresh context wins (Anthropic's own framing)

The page presents three converging arguments for fresh-context review:

1. **Performance-vs-context decay**: full context = worse performance. Fresh context = peak performance.
2. **Implementer bias**: a writer is biased toward defending what they just wrote; a reviewer with no inheritance has no such bias.
3. **Context-management hygiene**: corrected-context > polluted-context. `/clear` is universally recommended after two failed corrections.

The Code Review product ([[docs-code-review]]) is the productized fleet-scale embodiment of all three principles; this best-practices page is the documentation of the principles themselves.

## Cross-references

- See [[docs-code-review]] for the productized fleet-of-specialists embodiment of these patterns — Code Review runs the multi-instance independent-reviewer pattern at scale on Anthropic infrastructure.
- See [[blog-multi-agent-research-system]] for the canonical hub-and-spoke / isolated-context multi-agent reference (Research feature), which the subagent-for-verification pattern miniaturizes.
- See [[blog-when-to-use-multi-agent]] for the decision framework.
- See [`/Users/brandonbehring/claude-books/docs/research/04-agent-sdk/`](../04-agent-sdk/) for the Agent SDK primitives that let you instantiate the Writer/Reviewer pattern programmatically.

## Open questions / follow-ups

- **Quantification of "fresh context wins"**: the docs assert it; no published A/B numbers. Possible chapter-level eval.
- **Scratchpad-based inter-Claude communication**: the snippet *"give them separate working scratchpads and tell them which one to write to and which one to read from"* appears in indexed earlier versions of the page but isn't in the current text — the current Writer/Reviewer example shows the pattern via direct `[Session B output]` paste. Worth verifying whether the older scratchpad guidance has migrated to a different page (e.g., a dedicated page on parallel coordination or session-scratchpads).
- **Overfitting-to-tests subagent verification**: the snippet *"verify with independent subagents that the implementation isn't overfitting to the tests"* surfaces in indexed search results but isn't in the current page text. Possible upstream drift between web index and current docs.
- **Agent-teams as a multi-instance-review primitive**: Agent Teams is mentioned briefly as one of the parallel-session routes. Whether it has built-in Writer/Reviewer or reviewer-as-team-member semantics is not specified here — needs a separate doc-page read.
- **Cost of multi-instance review** vs single-pass at the local CLI level: no published per-session number. Code Review's \$15-25 / 20 min is for the managed fleet, not for a local Writer/Reviewer pair.
- **Interaction with auto mode / sandboxing** for the reviewer session: if the reviewer is read-only by nature, can it run in a more permissive `--permission-mode` than the writer? Not addressed; chapter material.
