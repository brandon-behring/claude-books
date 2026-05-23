---
source_url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting
canonical_url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
source_title: "Prompting best practices: Use examples effectively (multishot / few-shot)"
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: claude-api
tier: T1-official
cert_domains: [4]
cert_task_areas:
  - "Few-shot prompting (targeting ambiguous cases, format consistency)"
  - "Iterative refinement (concrete examples, test-driven, interview pattern)"
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Multishot / few-shot prompting — mechanics, count, edge-case targeting

The dedicated `multishot-prompting` URL now 302-redirects into the single Prompting best practices reference (the "Use examples effectively" section). This note collects the deep mechanics: how many examples, how to choose them, what to wrap them in, and what they're actually compensating for.

## Key takeaways

- **3–5 examples is the documented sweet spot**. The docs explicitly recommend this range; fewer than 3 risks the model picking up unintended patterns from a small sample, more than ~5 burns context without proportional gain.
- **Three quality criteria — relevant, diverse, structured**. *Relevant* = mirror the actual use case. *Diverse* = cover edge cases and vary enough that Claude doesn't latch onto a spurious surface pattern. *Structured* = wrap each example in `<example>` (or the group in `<examples>`) so Claude can distinguish examples from instructions and from user input.
- **Few-shot is the most reliable steering mechanism** for output format, tone, and structure — more reliable than negative instruction ("don't do X"), more reliable than verbose description.
- **Targeting ambiguous cases**: when extraction or classification has edge cases (null fields, "other" buckets, unusual format variants), include at least one example *on* that edge case with the desired handling shown. The model generalizes from the example treatment, not from a separate written rule.
- **Format-consistency examples specifically**: positive examples showing how Claude should communicate (concision, tone, structure) outperform negative examples or "don't" instructions. The docs are explicit: *"Positive examples showing how Claude can communicate with the appropriate level of concision tend to be more effective than negative examples or instructions that tell the model what not to do."*
- **Generalization**: Claude doesn't memorize the examples; it extracts the implicit pattern across them. This is why diversity matters — three examples that all share an irrelevant trait (e.g., all input strings end with a period) will teach the wrong pattern.
- **Few-shot composes with thinking and structured outputs**: use `<thinking>` tags *inside* few-shot examples to show the reasoning pattern Claude should generalize to its own extended-thinking blocks. With structured outputs, the schema locks the *shape* but examples still teach *content* and *edge-case handling*.
- **You can ask Claude to evaluate / extend your example set** — feed in your initial 3 examples and ask Claude to critique them for relevance + diversity or generate two more on under-covered cases.

## Quoted (citation-ready)

> "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples (known as few-shot or multishot prompting) can dramatically improve accuracy and consistency."
>
> — Prompting best practices, General principles → Use examples effectively
>
> Anchor: `Use examples effectively + Examples are one of the most reliable ways to steer`

> "When adding examples, make them: **Relevant:** Mirror your actual use case closely. **Diverse:** Cover edge cases and vary enough that Claude doesn't pick up unintended patterns. **Structured:** Wrap examples in `<example>` tags (multiple examples in `<examples>` tags) so Claude can distinguish them from instructions."
>
> — Prompting best practices, Use examples effectively
>
> Anchor: `Use examples effectively + When adding examples, make them`

> "Include 3–5 examples for best results. You can also ask Claude to evaluate your examples for relevance and diversity, or to generate additional ones based on your initial set."
>
> — Prompting best practices, Use examples effectively (Tip callout)
>
> Anchor: `Use examples effectively + Include 3–5 examples for best results`

> "If you see specific examples of kinds of verbosity (i.e. over-explaining), you can add additional instructions in your prompt to prevent them. Positive examples showing how Claude can communicate with the appropriate level of concision tend to be more effective than negative examples or instructions that tell the model what not to do."
>
> — Prompting best practices, Prompting Claude Opus 4.7 → Response length and verbosity
>
> Anchor: `Response length and verbosity + Positive examples showing how Claude can communicate`

> "Multishot examples work with thinking. Use `<thinking>` tags inside your few-shot examples to show Claude the reasoning pattern. It will generalize that style to its own extended thinking blocks."
>
> — Prompting best practices, Thinking and reasoning → Leverage thinking & interleaved thinking capabilities
>
> Anchor: `Leverage thinking & interleaved thinking capabilities + Multishot examples work with thinking`

## Why 3–5 — what each example is doing

| If you have | Risk |
|---|---|
| 0 examples | Model infers format from the instructions alone — works for trivial output shapes, breaks on edge cases |
| 1–2 examples | Model often picks up an incidental pattern (capitalization, sentence length, optional-field handling) instead of the intended one |
| 3–5 examples | Sweet spot: enough diversity to disambiguate the intended pattern; few enough to keep the context overhead small |
| 6+ examples | Diminishing returns; context cost rises; risk of contradicting examples confusing the model |

The 3–5 range gives you room for: one canonical case + one or two variants + one edge case + (optionally) one "tricky" example that exercises the failure mode you've seen.

## Targeting ambiguous cases (cert task area)

The cert task area phrasing — *"Few-shot prompting (targeting ambiguous cases, format consistency)"* — maps to two concrete patterns:

### Pattern 1 — Ambiguous-case targeting

For extraction / classification where some inputs don't have a clean answer:

```xml
<examples>
  <example>
    <input>Order #4815 shipped on Apr 3 via UPS tracking 1Z999AA10123456784.</input>
    <output>{"order_id": "4815", "carrier": "UPS", "tracking": "1Z999AA10123456784", "shipped_at": "2026-04-03"}</output>
  </example>
  <example>
    <input>Customer asked about order status yesterday but didn't provide an order number.</input>
    <output>{"order_id": null, "carrier": null, "tracking": null, "shipped_at": null}</output>
  </example>
  <example>
    <input>Shipped today via 'FedEx Express Saver' — see ref 7712-4488-9933.</input>
    <output>{"order_id": null, "carrier": "FedEx", "tracking": "7712-4488-9933", "shipped_at": "2026-05-23"}</output>
  </example>
</examples>
```

The middle example *is* the ambiguous case — the model now knows the desired behavior is `null`, not an empty string, not "unknown", not "n/a".

### Pattern 2 — Format-consistency

For tone / verbosity / structure consistency, the example is the spec:

```xml
<examples>
  <example>
    <user>What's the capital of France?</user>
    <assistant>Paris.</assistant>
  </example>
  <example>
    <user>What's the largest planet?</user>
    <assistant>Jupiter.</assistant>
  </example>
  <example>
    <user>How do I sort a list in Python?</user>
    <assistant>Use `sorted(list)` for a new list or `list.sort()` to sort in place.</assistant>
  </example>
</examples>
```

Three examples lock in the "single fact, no preamble, no follow-up offer" pattern more reliably than "respond concisely without preamble."

## Composition with adjacent features

- **With `<thinking>` tags** — show the reasoning trace inside examples; Claude generalizes that style to its own thinking blocks (works for both manual extended thinking and adaptive thinking).
- **With structured outputs** — examples teach *content semantics* (what to extract, how to handle `null`); the schema enforces *shape*. The two are complementary, not redundant.
- **With tool use** — for tool-use-as-classification (`enum`-constrained `category` parameter), a few example calls in the user/assistant history teach which label belongs with which input. Combine with `tool_choice: {type: "tool", name: ...}` and `strict: true`.
- **With XML-tagged inputs** — wrap inputs and outputs in tags inside the example, and the model learns the surrounding-tag convention.

## Anti-patterns

- **Single example** — the model may pick up incidental traits (a particular punctuation, a particular sentence structure) and treat them as required.
- **Examples that disagree** — two examples handling the same edge case differently teach the model that *either* is acceptable. Audit examples for consistency before adding more.
- **Negative-only examples** (showing only "what not to do") — the model learns from positive demonstration, not from being told what to avoid.
- **Examples wrapped in plain prose** — without `<example>` / `<examples>` tags, the model may treat the examples as new user input or part of the task description.
- **6+ near-identical examples** — burns context, raises latency cost, and doesn't teach more than 3–4 diverse examples would.

## Cross-references

- See [[docs-adaptive-thinking]] — multishot composes with adaptive thinking; `<thinking>`-tagged few-shot examples shape Claude's own thinking trace.
- See [[../07-structured-output/docs-claude-4-best-practices-structured-output]] — the structured-output framing of the same source (covers prefill migration and XML-tag-as-output substrate).
- See [[../07-structured-output/docs-strict-tool-use]] — strict tool use + few-shot for enum classification.
- See [[../03-advanced-tool-use/blog-tool-use-examples]] — the `input_examples` field on tool definitions (T1-blog), which is the tool-use-specific form of few-shot.
- See [[../01-academy-courses/course-building-with-the-claude-api]] — Academy course has a few-shot module; this note covers the deep mechanics, the course covers the introductory framing.

## Open questions / follow-ups

- **Exact `input_examples` count for tool definitions** — the docs say 3–5 for general few-shot; the tool-use docs don't specify a count for `input_examples`. Likely the same range applies but unverified.
- **Few-shot decay with very long context** — when few-shot examples are at the top of the prompt and the actual task is 100k+ tokens later, do the examples still steer? Docs recommend putting long-form data *at the top* and queries at the bottom, which suggests examples near the bottom (closer to the task) may steer better. Not explicitly addressed.
- **Few-shot interaction with Opus 4.7's "more literal" instruction-following** — does the more literal model also more literally copy example patterns? Anecdotally yes (the literal-following advice and the "examples are reliable" advice both point this way), but no explicit interaction study.
