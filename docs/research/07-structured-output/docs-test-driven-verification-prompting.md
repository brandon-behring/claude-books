---
source_url: https://code.claude.com/docs/en/best-practices
canonical_url: https://code.claude.com/docs/en/best-practices
source_title: "Best practices for Claude Code: Give Claude a way to verify its work"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: structured-output
tier: T1-official
cert_domains: [4]
cert_task_areas:
  - "Iterative refinement (concrete examples, test-driven, interview pattern)"
  - "Validation, retry, feedback loops (semantic vs schema errors)"
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Test-driven prompting + verification criteria for structured output

The Claude Code best-practices doc names *verification* as the single highest-leverage prompting technique. For structured-output workloads — extraction, classification, schema-constrained generation — this translates into a specific pattern: bake the validation criteria into the prompt, treat tests as first-class state, and let the model use the tests as a self-correction signal before it returns to you.

## Key takeaways

- **Verification criteria in the prompt itself** is the explicit Anthropic recommendation: include test cases (input → expected output) directly in the prompt, expected output shapes, screenshots, or a runnable check command. For structured output, this means putting example I/O pairs into the prompt alongside the schema.
- **The trust-then-verify gap is named as a failure pattern**: "Claude produces a plausible-looking implementation that doesn't handle edge cases." The recommended fix: "Always provide verification (tests, scripts, screenshots). If you can't verify it, don't ship it."
- **Tests as persistent state across context windows**: the multi-window pattern explicitly creates a structured test file (`tests.json` with `id`, `name`, `status`) so that future context windows can iterate on a todo list of failing tests rather than re-discovering what works.
- **Tests-are-the-contract semantics**: the docs recommend explicitly telling the model "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality." This makes the test file an immutable spec — the only allowed change is to the code that satisfies it.
- **Failing-test-first as a bug-fix pattern for structured output**: when an extractor returns the wrong shape on an edge case, the prompt is "write a failing test that reproduces the issue, then fix it" — the test asserts the *desired* schema-conformant output, and the model knows it's done when the test passes.
- **Writer/Reviewer fan-out for structured output validation**: one Claude generates the structured output, a second Claude (fresh context) reviews it against the schema and source data for hallucinated fields or missed extractions. Fresh context removes the "biased toward code it just wrote" problem.
- **Verification couples with structured outputs natively**: with `output_config.format` enforcing shape and prompt-side test cases enforcing semantics, you get a two-layer guarantee — the schema can't be violated, and the content has been validated against your examples before retry/escalation.
- **Iterate by scoping, not by re-asking**: the docs are explicit that correcting Claude more than twice on the same issue means the context is polluted — `/clear` and rewrite the prompt with the failure modes encoded as test cases.

## Quoted (citation-ready)

> "Include tests, screenshots, or expected outputs so Claude can check itself. This is the single highest-leverage thing you can do. Claude performs dramatically better when it can verify its own work, like run tests, compare screenshots, and validate outputs. Without clear success criteria, it might produce something that looks right but actually doesn't work. You become the only feedback loop, and every mistake requires your attention."
>
> — Best practices for Claude Code, Give Claude a way to verify its work
>
> Anchor: `Give Claude a way to verify its work + Include tests, screenshots, or expected outputs so Claude can check itself`

> "**Provide verification criteria** — Before: 'implement a function that validates email addresses' — After: 'write a validateEmail function. example test cases: user@example.com is true, invalid is false, user@.com is false. run the tests after implementing'"
>
> — Best practices for Claude Code, Give Claude a way to verify its work (table)
>
> Anchor: `Give Claude a way to verify its work + Provide verification criteria`

> "**The trust-then-verify gap.** Claude produces a plausible-looking implementation that doesn't handle edge cases. **Fix**: Always provide verification (tests, scripts, screenshots). If you can't verify it, don't ship it."
>
> — Best practices for Claude Code, Avoid common failure patterns
>
> Anchor: `Avoid common failure patterns + The trust-then-verify gap`

> "Have the model write tests in a structured format: Ask Claude to create tests before starting work and keep track of them in a structured format (e.g., `tests.json`). This leads to better long-term ability to iterate. Remind Claude of the importance of tests: 'It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality.'"
>
> — Prompting best practices, Agentic systems → Multi-context window workflows
>
> Anchor: `Multi-context window workflows + Have the model write tests in a structured format`

> "You can do something similar with tests: have one Claude write tests, then another write code to pass them."
>
> — Best practices for Claude Code, Automate and scale → Run multiple Claude sessions
>
> Anchor: `Run multiple Claude sessions + You can do something similar with tests`

## Three test-driven patterns for structured output

### Pattern 1 — Inline test cases in the extraction prompt

For a one-shot extraction call, the test cases *are* the few-shot examples (see [[../05-claude-api/docs-multishot-few-shot-prompting]] for the few-shot mechanics) but framed as assertions:

```text
Extract shipping info from the following message. The output must match the schema.

Validation:
- If no order number is present, order_id MUST be null (not "", not "unknown").
- carrier MUST be one of ["UPS", "FedEx", "DHL", "USPS", null].
- shipped_at MUST be ISO-8601 or null.

Test cases (must all pass):
1. Input: "Order #4815 shipped via UPS, tracking 1Z9..."
   Expected: {"order_id": "4815", "carrier": "UPS", ...}
2. Input: "Customer asked about status but no order number provided."
   Expected: {"order_id": null, "carrier": null, "tracking": null, "shipped_at": null}
3. Input: "Shipped via 'FedEx Express Saver' ref 7712-4488-9933."
   Expected: {"order_id": null, "carrier": "FedEx", "tracking": "7712-4488-9933", "shipped_at": null}

Before returning, mentally verify your output matches each test case's expected output for the relevant patterns.
```

Combine with `output_config.format` to enforce shape; the prompt enforces semantics.

### Pattern 2 — Tests as persistent state across context windows

For a long-running extraction pipeline (e.g., processing thousands of records with periodic schema changes):

```json
// tests.json
{
  "schema_version": "v3",
  "tests": [
    {"id": "null_order_id", "input": "...", "expected": {...}, "status": "passing"},
    {"id": "unknown_carrier", "input": "...", "expected": {...}, "status": "failing"},
    {"id": "iso_date_normalization", "input": "...", "expected": {...}, "status": "not_started"}
  ]
}
```

Each new context window starts by reading `tests.json`, picks a failing test, fixes the prompt or schema, and updates the file. The persistent test file decouples the multi-session work from any single context window.

### Pattern 3 — Writer/Reviewer fan-out for hallucination detection

The classic structured-output failure mode is *hallucinated* fields — the model invents data that wasn't in the source. The Writer/Reviewer pattern catches it:

| Session A (Writer) | Session B (Reviewer, fresh context) |
|---|---|
| `Extract structured invoice data from this PDF` | (does not see Session A's output yet) |
| (returns JSON) | `Here is the source PDF and an extracted JSON. Verify every field appears in the source. List any fields in the JSON not supported by the source text.` |
| `Here's the review: [hallucinated fields list]. Re-extract, leaving those fields null.` | |

Session B's fresh context is the key — it has no commitment to defending Session A's output.

## Where this composes with the structured-output stack

| Layer | What it enforces | What can still go wrong |
|---|---|---|
| `output_config.format` / structured outputs | Shape: types, required fields, enums | Wrong content within valid shape (hallucinated values, missed extractions) |
| Strict tool use (`strict: true` + enum) | Closed-set classification | Wrong label within the valid set |
| **In-prompt test cases (this note)** | Semantics: edge-case handling, null vs "" vs "unknown" | Behavior on inputs not represented by any test case |
| Writer/Reviewer fan-out | Hallucination detection, schema-source alignment | Cost (2 model calls per record) |
| Citations | Provenance: every claim traceable to source | Not all structured-output tasks support citations |

In-prompt test cases sit between the shape-enforcers (structured outputs / strict tools) and the post-hoc reviewers (Writer/Reviewer pattern) — they reduce how often the reviewer has to escalate.

## Iterative refinement loop (D4 cert task area canonical)

The cert task phrasing — *"Iterative refinement (concrete examples, test-driven, interview pattern)"* — has three concrete loops in the docs:

1. **Per-call refinement**: prompt → output → diff against tests → if any fail, retry with the failure encoded as a new in-prompt test case → repeat. Bounded by a retry budget (semantic vs schema errors: schema errors retry against the schema; semantic errors retry with the test case).
2. **Cross-session refinement**: write tests in session A, implement in session B, review in session C. State lives in `tests.json` or `SPEC.md`, not in any single context.
3. **Prompt-as-code refinement**: treat the prompt itself as a version-controlled artifact; when a new edge case appears in production, add a test case to the prompt and re-run the regression on prior records to catch regressions.

## Anti-patterns flagged

- **Asking the same Claude to re-verify its own output** in the same context window — confirmation bias is real; use a fresh context (Writer/Reviewer) for the verification step.
- **Tests that only assert shape**, not content — structured outputs already enforces shape; in-prompt tests should assert *what* the values are, not *that there are values*.
- **Removing tests when they fail** — the docs explicitly call this out as unacceptable. The failing test is the bug; fix the prompt or schema, don't delete the assertion.
- **Iterating without a `/clear` after the second correction** — context pollution makes each subsequent retry strictly worse, not better.
- **Vague "should be valid" criteria** — if you can't enumerate test cases, structured outputs is the wrong tool; switch to a generative task with a separate evaluation step.

## Cross-references

- See [[docs-structured-outputs]] — the structured outputs feature; this note describes how to make it production-grade via verification.
- See [[blog-semantic-vs-schema-errors]] — the schema-vs-semantic-error taxonomy; this note's "in-prompt test cases" are the semantic-error retry surface.
- See [[docs-strict-tool-use]] — strict tool use + enum gives shape correctness; tests in the prompt give content correctness.
- See [[../05-claude-api/docs-iterative-refinement-interview-pattern]] — the full set of iterative-refinement patterns (interview, four-phase workflow, course-correction) of which test-driven is one.
- See [[../05-claude-api/docs-multishot-few-shot-prompting]] — in-prompt test cases compose with few-shot; the two are different framings of "concrete examples in the prompt".
- See [[../06-multi-agent-patterns/docs-best-practices-writer-reviewer]] — the multi-agent dossier covers the Writer/Reviewer pattern in depth.

## Open questions / follow-ups

- **Retry budget for in-prompt test failures** — the docs don't specify how many retries before escalation. Practically: 1 retry for shape errors (structured outputs already corrects most), 2–3 for semantic errors before kicking to a reviewer.
- **Test case count per prompt** — the few-shot guidance is 3–5; whether test cases follow the same number is unstated. Likely 3–5 covering edge cases, plus 1–2 canonical happy-path cases, but unverified.
- **Test-driven + adaptive thinking** — does higher effort (xhigh/max) reduce the per-call failure rate enough to skip the in-prompt tests on the first attempt? Unstated; would be measurable but isn't in the docs.
- **Token cost of in-prompt tests** — for very long extraction prompts, the test cases burn context. At what point does it pay to move tests to a post-hoc validator rather than in-prompt? No documented heuristic.
