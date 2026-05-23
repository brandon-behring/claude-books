---
source_url: https://code.claude.com/docs/en/best-practices
canonical_url: https://code.claude.com/docs/en/best-practices
source_title: "Best practices for Claude Code"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: claude-api
tier: T1-official
cert_domains: [4]
cert_task_areas:
  - "Iterative refinement (concrete examples, test-driven, interview pattern)"
  - "Few-shot prompting (targeting ambiguous cases, format consistency)"
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Iterative refinement + the interview pattern — Claude Code best practices

The Claude Code best-practices doc is the canonical Anthropic source for *interactive iterative refinement*: how to scope tasks, when to use the interview pattern, when to course-correct vs. clear context, and how to compose explore → plan → implement → commit. The patterns generalize beyond the CLI to any agentic prompting workflow.

## Key takeaways

- **The interview pattern is officially named and recommended for large features**: start with a minimal prompt and explicitly tell Claude to use the `AskUserQuestion` tool to interview you on technical implementation, UI/UX, edge cases, and tradeoffs *before* implementing. End with "write a complete spec to SPEC.md" then start a fresh session to execute.
- **Verification is "the single highest-leverage thing you can do"**: include tests, screenshots, or expected outputs in the prompt itself. Without verification criteria, the human becomes the only feedback loop and every mistake requires manual attention.
- **Four-phase recommended workflow**: Explore (plan mode, read-only) → Plan (detailed implementation plan, editable with `Ctrl+G`) → Implement (switch out of plan mode, verify against plan) → Commit (descriptive message + PR). Skip the plan only when the diff is one-sentence describable.
- **Concrete prompt deltas beat vague ones**, by an order of magnitude: every example in the docs shows a vague *before* and a concrete, scoped *after* with example test cases, file references, and explicit "fixed" criteria.
- **Course-correct early, not late**: Esc to stop mid-action with context preserved; Esc+Esc / `/rewind` to restore previous state. If you've corrected Claude more than twice on the same issue, the context is polluted — `/clear` and write a better initial prompt incorporating what you learned.
- **Sequential vs. detailed-single-message tradeoff**: ambiguous prompts conveyed progressively over multiple user turns reduce token efficiency and sometimes performance (per the Claude 4.7 best-practices note); specify task, intent, and constraints upfront in the first human turn.
- **Test-driven prompting is a first-class pattern**: have one Claude write tests, another write code to pass them (Writer/Reviewer fan-out); reproduce a bug by asking for "a failing test that reproduces the issue, then fix it"; cross-context-window: use the first context window to write tests + create `tests.json`, future windows iterate on the todo list.
- **CLAUDE.md is the persistent-context iteration target**: treat it like code — review when things go wrong, prune regularly, test by observing whether Claude's behavior actually shifts. If Claude asks questions answered in CLAUDE.md, the phrasing is ambiguous.

## Quoted (citation-ready)

> "For larger features, have Claude interview you first. Start with a minimal prompt and ask Claude to interview you using the `AskUserQuestion` tool. Claude asks about things you might not have considered yet, including technical implementation, UI/UX, edge cases, and tradeoffs."
>
> — Best practices for Claude Code, Communicate effectively → Let Claude interview you
>
> Anchor: `Let Claude interview you + For larger features, have Claude interview you first`

> "I want to build [brief description]. Interview me in detail using the AskUserQuestion tool. Ask about technical implementation, UI/UX, edge cases, concerns, and tradeoffs. Don't ask obvious questions, dig into the hard parts I might not have considered. Keep interviewing until we've covered everything, then write a complete spec to SPEC.md."
>
> — Best practices for Claude Code, Let Claude interview you (sample prompt)
>
> Anchor: `Let Claude interview you + I want to build [brief description]. Interview me in detail`

> "Include tests, screenshots, or expected outputs so Claude can check itself. This is the single highest-leverage thing you can do. Claude performs dramatically better when it can verify its own work, like run tests, compare screenshots, and validate outputs. Without clear success criteria, it might produce something that looks right but actually doesn't work."
>
> — Best practices for Claude Code, Give Claude a way to verify its work
>
> Anchor: `Give Claude a way to verify its work + Include tests, screenshots, or expected outputs`

> "The best results come from tight feedback loops. Though Claude occasionally solves problems perfectly on the first attempt, correcting it quickly generally produces better solutions faster. ... If you've corrected Claude more than twice on the same issue in one session, the context is cluttered with failed approaches. Run `/clear` and start fresh with a more specific prompt that incorporates what you learned. A clean session with a better prompt almost always outperforms a long session with accumulated corrections."
>
> — Best practices for Claude Code, Manage your session → Course-correct early and often
>
> Anchor: `Course-correct early and often + The best results come from tight feedback loops`

> "Letting Claude jump straight to coding can produce code that solves the wrong problem. ... The recommended workflow has four phases: Explore [plan mode, read files] → Plan [create detailed implementation plan] → Implement [switch out of plan mode, verify against plan] → Commit [descriptive message + PR]."
>
> — Best practices for Claude Code, Explore first, then plan, then code
>
> Anchor: `Explore first, then plan, then code + Letting Claude jump straight to coding`

> "Of course, when limiting the number of required user interactions, it's important to specify the task, intent, and relevant constraints upfront in the first human turn. Providing well-specified, clear, and accurate task descriptions upfront can help maximize autonomy and intelligence while minimizing extra token usage after user turns. ... In contrast, ambiguous or underspecified prompts conveyed progressively over multiple user turns tend to relatively reduce token efficiency and sometimes performance."
>
> — Prompting best practices, Prompting Claude Opus 4.7 → Interactive coding products
>
> Anchor: `Interactive coding products + Of course, when limiting the number of required user interactions`

## The interview pattern in detail

The interview pattern inverts the usual interactive flow: instead of you specifying upfront and Claude asking clarifying questions reactively, Claude drives the questioning via the `AskUserQuestion` tool until the spec is complete, then a *fresh* session implements from the written spec.

**Why a fresh session for implementation**:
- The interview session's context is full of question-answer pairs and clarification thrashing.
- The implementation session has clean context focused entirely on the task — the written `SPEC.md` is its only input.
- This is the multi-context-window pattern (see "Multi-context window workflows" in the Prompting best practices doc) applied to the spec-then-build split.

**Anatomy of an interview prompt** (from the docs):
1. *Brief description* — enough to anchor what the project is.
2. *Interview directive* — explicitly ask for the `AskUserQuestion` tool to be used.
3. *Question scope* — "technical implementation, UI/UX, edge cases, concerns, tradeoffs".
4. *Quality filter* — "don't ask obvious questions, dig into the hard parts I might not have considered".
5. *Termination + artifact* — "Keep interviewing until we've covered everything, then write a complete spec to SPEC.md."

The artifact (`SPEC.md`) is the bridge between sessions. It's both a deliverable (you can review it before implementation) and a context bootstrap (the new session reads it).

## The four "before / after" iterative refinement patterns

The docs give explicit *before / after* examples that map directly to the cert task area "Iterative refinement (concrete examples)":

| Pattern | Vague *before* | Concrete *after* |
|---|---|---|
| **Provide verification criteria** | "implement a function that validates email addresses" | "write a validateEmail function. example test cases: user@example.com is true, invalid is false, user@.com is false. run the tests after implementing" |
| **Verify UI changes visually** | "make the dashboard look better" | "[paste screenshot] implement this design. take a screenshot of the result and compare it to the original. list differences and fix them" |
| **Address root causes, not symptoms** | "the build is failing" | "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error" |
| **Scope the task** | "add tests for foo.py" | "write a test for foo.py covering the edge case where the user is logged out. avoid mocks." |
| **Reference existing patterns** | "add a calendar widget" | "look at how existing widgets are implemented... HotDogWidget.php is a good example. follow the pattern... build from scratch without libraries other than the ones already used" |
| **Describe the symptom** | "fix the login bug" | "users report that login fails after session timeout. check the auth flow in src/auth/, especially token refresh. write a failing test that reproduces the issue, then fix it" |

The pattern across all six: a vague verb + a noun is replaced with a verb + concrete example/test/file/reference + a verification step.

## Sequential vs. single-detailed-message decision

| Situation | Recommended pattern |
|---|---|
| Exploring an unfamiliar codebase, can afford to course-correct | Vague prompt OK — "what would you improve in this file?" surfaces things you wouldn't have thought to ask |
| Implementing a known feature | Single detailed message with task + verification criteria + reference files |
| Large feature with unknown design space | Interview pattern → SPEC.md → fresh session |
| Bug fix with known repro | Single detailed message: symptom + likely location + "what fixed looks like" |
| Bug fix with unknown repro | "write a failing test that reproduces the issue, then fix it" — concrete intermediate artifact |
| Repeated correction (twice on the same issue) | `/clear` and rewrite the initial prompt incorporating what you learned |

The general rule from the Opus 4.7 best-practices section: "Providing well-specified, clear, and accurate task descriptions upfront can help maximize autonomy and intelligence while minimizing extra token usage after user turns."

## Test-driven prompting variants

The docs give multiple patterns that all reduce to "verifiable output beats unverifiable output":

1. **Include verification in the prompt itself** — example test cases inline, expected outputs, "run the tests after implementing".
2. **Failing-test-first for bug fixes** — "write a failing test that reproduces the issue, then fix it".
3. **Writer/Reviewer fan-out** — Session A implements, Session B reviews; rotate so each Claude has fresh context for its role.
4. **Tests-first across context windows** — first context window writes tests + `tests.json`, future windows iterate on the todo list. ("Have the model write tests in a structured format: Ask Claude to create tests before starting work and keep track of them in a structured format (e.g., `tests.json`). This leads to better long-term ability to iterate.")
5. **Tests-as-state**: "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality" — tests become the persistent contract.

## Common failure patterns (anti-patterns enumerated by the docs)

- **The kitchen sink session** — multiple unrelated tasks in one context. *Fix*: `/clear` between unrelated tasks.
- **Correcting over and over** — context polluted with failed approaches. *Fix*: After two failed corrections, `/clear` and rewrite the prompt.
- **The over-specified CLAUDE.md** — rules buried in noise. *Fix*: ruthlessly prune, convert reliable behavior to hooks.
- **The trust-then-verify gap** — plausible-looking implementation without verification. *Fix*: always provide verification (tests, scripts, screenshots).
- **The infinite exploration** — open-ended "investigate" reads hundreds of files. *Fix*: scope narrowly or delegate to a subagent so exploration doesn't consume main context.

## Cross-references

- See [[docs-adaptive-thinking]] — `xhigh` effort is recommended for coding/agentic loops; interview-pattern question generation benefits from higher effort.
- See [[docs-multishot-few-shot-prompting]] — few-shot examples and iterative-refinement patterns are the two halves of "concrete-examples-over-vague-descriptions" guidance.
- See [[../07-structured-output/docs-test-driven-verification-prompting]] — test-driven framing applied to structured-output validation specifically.
- See [[../06-multi-agent-patterns/docs-best-practices-writer-reviewer]] — the Writer/Reviewer fan-out has its own dedicated note in the multi-agent dossier.
- See [[../08-claude-code-internals/docs-permission-modes]] — plan mode is the substrate for the Explore→Plan→Implement workflow.

## Open questions / follow-ups

- **Interview-pattern token cost** — the `AskUserQuestion` interview can produce a long Q&A transcript before SPEC.md is written. No documented guidance on token-budget ceilings for the interview phase before splitting to a fresh session.
- **Spec-handoff format** — `SPEC.md` is the documented artifact; structured alternatives (e.g., JSON spec + acceptance criteria array) aren't compared.
- **Interview pattern outside Claude Code** — the `AskUserQuestion` tool is Claude Code-specific. For pure API agentic loops, the same pattern requires the developer to wire question-asking into their own UX. Not addressed.
- **When the interview pattern is *wrong*** — for tasks where the user genuinely doesn't know what they want, an interview can crystallize the wrong constraints. No documented heuristic for when to skip.
