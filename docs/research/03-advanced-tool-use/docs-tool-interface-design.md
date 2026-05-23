---
source_url: https://www.anthropic.com/engineering/writing-tools-for-agents
canonical_url: https://www.anthropic.com/engineering/writing-tools-for-agents
source_title: Writing tools for agents
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: advanced-tool-use
tier: T1-official
cert_domains: [2]
cert_task_areas: ["Effective tool interfaces", "Structured error responses", "Tool distribution + tool_choice"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Tool interface design — principles, naming, consolidation, response shaping

Synthesis note pulling together tool-design principles from the **Writing tools for agents** engineering blog post and the [[docs-define-tools]] / [[docs-handle-tool-calls]] best-practices boxes. This is the citation source for the architect-reference chapter on tool surface design.

## Key takeaways

- **Tools are a new kind of software contract**: between deterministic systems and non-deterministic agents. They must be ergonomic for the *agent caller*, not just the human developer.
- **Five design principles**, all reinforced across the blog post and the docs:
  1. **Choose tools that match agent affordances, not just APIs** — don't wrap CRUD; combine common patterns (e.g., `schedule_event` not `list_users` + `list_events` + `create_event`).
  2. **Namespace consistently** — `github_list_prs`, `slack_send_message`. Prefix-by-service is documented in both sources.
  3. **Return high-signal context only** — semantic IDs over opaque references; aggregate when possible; ResponseFormat enums when client needs both detailed and concise.
  4. **Write instructive error messages** — "Rate limit exceeded. Retry after 60 seconds." beats `"failed"`.
  5. **Tool descriptions are the most important factor** — both sources agree; aim for 3–4 sentences minimum.
- **Quantitative finding from the blog post**: precise refinements to tool descriptions yielded SWE-bench Verified state-of-the-art improvements with Claude Sonnet 3.5; "dramatically reducing error rates."
- **Consolidate, don't proliferate**: rather than `create_pr`, `review_pr`, `merge_pr`, use `pr_action(action="...")`. Fewer, more capable tools reduce selection ambiguity.

## The contract framing (citation-ready)

> "Tools are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents."
>
> — Writing tools for agents, Why tool design matters
>
> Anchor: `Why tool design matters + Tools are a new kind`

> "Even small refinements to tool descriptions can yield dramatic improvements."
>
> — Writing tools for agents, Prompt-engineering tool descriptions
>
> Anchor: `Prompt-engineering tool descriptions + Even small refinements`

## Principle 1 — Don't wrap APIs; design for the agent

The blog post's lead example: a `list_contacts` tool that returns ALL contacts wastes agent context. Agents must read token-by-token instead of searching efficiently. Better: `search_contacts` or `message_contact`.

Consolidation patterns from the post:
- Instead of `list_users` + `list_events` + `create_event` → `schedule_event`
- Instead of `read_logs` → `search_logs` (returns only relevant lines + context)
- Instead of `get_customer_by_id` + `list_transactions` + `list_notes` → `get_customer_context`

> "LLM agents have limited 'context' ... whereas computer memory is cheap and abundant."
>
> — Writing tools for agents, Choosing the right tools
>
> Anchor: `Choosing the right tools + LLM agents have limited`

## Principle 2 — Namespace tools

The docs page [[docs-define-tools]] cites this directly:

> "Use meaningful namespacing in tool names. When your tools span multiple services or resources, prefix names with the service (e.g., `github_list_prs`, `slack_send_message`). This makes tool selection unambiguous as your library grows, and is especially important when using tool search."

The blog post notes that prefix vs suffix naming **shows "non-trivial effects on tool-use evaluations"** with variable performance by LLM. Prefix is the documented recommendation.

Examples:
- `asana_search`, `jira_search` for cross-service
- `asana_projects_search`, `asana_users_search` for cross-resource within a service

This is also a Tool Search Tool prerequisite (see [[docs-tool-search-tool]]) — the search reads names, descriptions, argument names, and argument descriptions; consistent prefixes make group-targeting via regex (e.g., `"github_.*"`) trivial.

## Principle 3 — Return high-signal context

The blog post's `ResponseFormat` enum pattern:

```text
enum ResponseFormat {
   DETAILED = "detailed",
   CONCISE = "concise"
}
```

Slack thread response token costs from the post:
- **Detailed format**: 206 tokens (includes `thread_ts`, `channel_id`, `user_id` for chained calls)
- **Concise format**: 72 tokens (only thread content)

Return semantic identifiers (`name`, `image_url`, `file_type`); avoid `uuid`, `256px_image_url`, `mime_type` low-level fields unless the agent needs them.

The docs page reinforces this:

> "Design tool responses to return only high-signal information. Return semantic, stable identifiers (e.g., slugs or UUIDs) rather than opaque internal references, and include only the fields Claude needs to reason about its next step. Bloated responses waste context and make it harder for Claude to extract what matters."
>
> — Define tools, Best practices
>
> Anchor: `Best practices + Design tool responses`

Claude Code's documented restriction: **25,000-token default limit per tool response**. Pagination, filtering, range selection, and truncation are first-class concerns.

## Principle 4 — Write instructive error messages

From [[docs-handle-tool-calls]]:

> "Write instructive error messages. Instead of generic errors like 'failed', include what went wrong and what Claude should try next, e.g., 'Rate limit exceeded. Retry after 60 seconds.' This gives Claude the context it needs to recover or adapt without guessing."

Combined with `is_error: true`, this is the entire "structured error responses" cert task area in two lines:
1. Set `is_error: true` on the `tool_result` block.
2. Make the `content` text *actionable* — what went wrong + what to try next.

For schema-violation errors, use `strict: true` to prevent the failure mode entirely (see [[docs-define-tools]] strict-mode reference).

## Principle 5 — Descriptions are the highest-leverage tuning surface

Both sources rank descriptions as the #1 design factor:

> "Provide extremely detailed descriptions. This is by far the most important factor in tool performance. Your descriptions should explain every detail about the tool, including:
> - What the tool does
> - When it should be used (and when it shouldn't)
> - What each parameter means and how it affects the tool's behavior
> - Any important caveats or limitations"
>
> — Define tools, Best practices
>
> Anchor: `Best practices + Provide extremely detailed`

Aim: 3–4 sentences minimum, more for complex tools. Use `input_examples` (the Tool Use Examples feature) as a complement, not a replacement.

The blog post's claim about Claude Sonnet 3.5 + SWE-bench Verified is the strongest empirical signal here: "after precise refinements to tool descriptions, dramatically reducing error rates."

## The "analyze_content vs analyze_document" overlap question

The task asked for guidance on handling tool overlap (e.g., `analyze_content` vs `analyze_document`). Neither source provides explicit examples of this pair, but both address the underlying principle:

1. **Consolidate when possible**: if `analyze_content` and `analyze_document` do similar things, fold into one tool with a parameter that disambiguates. The docs page is explicit: "Consolidate related operations into fewer tools."
2. **Disambiguate descriptions** when separation is justified: make the description boundary unambiguous ("Use `analyze_document` only when the input is a stored file with a `document_id`; use `analyze_content` for ad-hoc strings."). Vague boundaries cause selection ambiguity.
3. **Namespace by domain**: if both tools belong to the same service, prefix consistently (`docs_analyze_content`, `docs_analyze_document`) so the relationship is visible at a glance.

The blog post's evaluation methodology (build → evaluate → optimize on held-out test sets) is the documented way to surface and fix actual selection-ambiguity bugs.

## Evaluation methodology (from the blog post)

The post recommends a **build → evaluate → optimize** loop:

1. Build prototype locally (MCP server / Desktop extension)
2. Generate evaluation tasks (dozens, grounded in real-world use — "strong" tasks, not toy queries)
3. Run evaluation with simple agentic loops (while-loops)
4. Analyze: read reasoning blocks, examine transcripts, track tool-calling patterns
5. **Collaborate with Claude Code to optimize tools iteratively**
6. Validate on held-out test sets

Metrics to track per the post:
- Accuracy
- Runtime
- Tool call count
- Token consumption
- Errors

Quoted insight on automation:

> "Claude is an expert at analyzing transcripts and refactoring lots of tools all at once."
>
> — Writing tools for agents, Process overview
>
> Anchor: `Process overview + Claude is an expert at analyzing`

## "Strong" vs "weak" evaluation tasks (from the blog post)

Strong (multi-step, realistic):
- "Schedule a meeting with Jane next week to discuss our latest Acme Corp project. Attach the notes from our last project planning meeting and reserve a conference room."
- "Customer ID 9182 reported being charged three times for a single purchase. Find all relevant log entries and determine if other customers were affected by the same issue."

Weak (superficial, single-tool):
- "Schedule a meeting with jane@acme.corp next week."
- "Search payment logs for `purchase_complete` and `customer_id=9182`."

The evaluation point: weak tasks measure schema-conformance, not tool-design quality. Strong tasks force the agent to use the *interface* (multiple tools, dependencies, judgment).

## Quoted (citation-ready)

> "Claude Sonnet 3.5 achieved state-of-the-art on SWE-bench Verified after precise refinements to tool descriptions, dramatically reducing error rates."
>
> — Writing tools for agents, Prompt-engineering tool descriptions
>
> Anchor: `Prompt-engineering tool descriptions + Claude Sonnet 3.5 achieved`

> "Namespacing (grouping related tools under common prefixes) can help delineate boundaries between lots of tools."
>
> — Writing tools for agents, Namespacing tools
>
> Anchor: `Namespacing tools + Namespacing (grouping related tools)`

## Cross-references

- See [[docs-define-tools]] for the schema-side reference of name / description / input_schema.
- See [[docs-handle-tool-calls]] for the structured-error-response reference (`is_error: true` + actionable text).
- See [[docs-tool-search-tool]] — namespacing best practices apply doubly when Tool Search is in use.
- See [[docs-programmatic-tool-calling]] — "Provide detailed output descriptions" is especially important for PTC since Claude deserializes results in code.
- See [[blog-tool-use-examples]] — `input_examples` is the documented complement to detailed descriptions for complex parameter handling.
- See `docs/landscape-2026-05.md` §6.3 — "Tool selection misrouting (similar tool descriptions)" is documented as a silent-failure pattern that good tool design prevents.

## Open questions / follow-ups

- The blog post mentions automation: "Claude is an expert at analyzing transcripts and refactoring lots of tools all at once." Is there a public skill / cookbook for this workflow? Worth a search.
- The ResponseFormat enum pattern is canonical in the blog post but is **not** an Anthropic-API feature — it's a host-side convention. Chapter content should make that distinction clear.
- The 25K-token tool-response limit in Claude Code is documented in the blog post but not in the platform docs; this is a Claude Code product constraint, not an API constraint. Worth tagging precisely.
- The blog post's MCP server evaluations (Slack, Asana) show measurable improvement of Claude-optimized tools over manual implementations, but the exact accuracy numbers are in a graph that the WebFetch did not capture verbatim. Treat numerically as illustrative until cross-checked against the post images.
