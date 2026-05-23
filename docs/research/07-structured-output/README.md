# Structured output — research dossier

Primary-source research cache for **Domain 4: Prompt Engineering & Structured Output** (cert weight 20%), with secondary coverage of D5 "Information provenance". All notes are **T1-official** — Anthropic docs (`platform.claude.com`, `code.claude.com`), the Claude Cookbook, and Anthropic engineering blog content.

**Snapshot**: 2026-05-22. Refresh quarterly or when the `output_config.format` beta-to-stable transition completes / when `output-300k-2026-03-24` graduates.

## Topic summary

Structured output on the Claude API has graduated from "prompt-engineer a JSON template + retry on parse errors" to **constrained-decoding guarantees** with first-class API support. The current surface is:

1. **`output_config.format`** ([[docs-structured-outputs]]) — JSON outputs from a free-form response, grammar-constrained at decode time. Eliminates parse / type / schema errors. Replaces the deprecated `output_format` param + `structured-outputs-2025-11-13` beta header.
2. **`strict: true`** on tool definitions ([[docs-strict-tool-use]]) — same grammar-constrained-decoding pipeline applied to `tool_use.input`. The right primitive for agentic workflows that depend on type-safe function calls.
3. **Agent SDK retry loop** ([[docs-agent-sdk-structured-outputs]]) — the multi-turn-agent wrapper that adds re-prompting on schema mismatch. Returns `subtype: error_max_structured_output_retries` when it runs out of attempts.
4. **Tool_use cookbook pattern** ([[blog-extract-structured-json-cookbook]]) — the older "force a tool call, extract `tool_use.input`" pattern. Still the right tool for **open-ended schemas** (`additionalProperties: true`) which structured outputs can't do.
5. **Prompt-engineering fallbacks** ([[docs-increase-output-consistency]], [[docs-claude-4-best-practices-structured-output]]) — XML output, few-shot, role consistency, retrieval-grounded answers. The right tool when **strict JSON** is too restrictive (e.g., mixed prose + structure) and for Claude generations that still rely on retry-with-feedback.
6. **Semantic-error validation layer** ([[blog-semantic-vs-schema-errors]]) — what to do when JSON parses fine but data is wrong. Schema-design patterns for `detected_pattern`, `calculated_total`/`stated_total`, `conflict_detected`, "other"+detail, and provenance fields.
7. **Batch + structured outputs** ([[blog-batch-structured-output-pattern]]) — bulk extraction at scale; 50% off + grammar-cache reuse + extended-output 300k beta.
8. **OpenAI SDK compat caveat** ([[docs-openai-sdk-compat-structured-output]]) — `response_format` and `strict` are **silently ignored** through the compat layer. Migration teams must switch to native Anthropic SDK to keep their structured-output guarantees.

The cert task areas land on these notes as follows (D4 primary; D5 secondary):

## Cert task areas covered

| Cert task area | Primary notes |
|---|---|
| **Structured output via `tool_use` + JSON schemas** | [[docs-structured-outputs]], [[docs-strict-tool-use]], [[blog-extract-structured-json-cookbook]], [[docs-openai-sdk-compat-structured-output]] |
| **Validation, retry, feedback loops (semantic vs schema errors)** | [[blog-semantic-vs-schema-errors]], [[docs-agent-sdk-structured-outputs]], [[docs-increase-output-consistency]] |
| **Few-shot prompting (targeting ambiguous cases, format consistency)** | [[docs-claude-4-best-practices-structured-output]], [[docs-increase-output-consistency]] |
| **Batch processing (Message Batches API, custom_id, SLA matching)** *[D4, also covered in `05-claude-api/docs-batch-api.md`]* | [[blog-batch-structured-output-pattern]] (extraction-specific) |
| **Information provenance (claim-source mappings)** *[D5]* | [[blog-semantic-vs-schema-errors]] (Pattern 5), cross-reference to [[../05-claude-api/docs-citations]] |

## Notes table

| File | Tier | What it covers |
|---|---|---|
| [`docs-structured-outputs.md`](./docs-structured-outputs.md) | T1 | The dedicated Structured Outputs page; `output_config.format`; JSON Schema subset; schema-complexity limits; grammar caching; feature compat |
| [`docs-strict-tool-use.md`](./docs-strict-tool-use.md) | T1 | `strict: true` on tool definitions; the agentic-workflow primitive for type-safe tool calls |
| [`docs-agent-sdk-structured-outputs.md`](./docs-agent-sdk-structured-outputs.md) | T1 | Agent SDK retry loop; `subtype: error_max_structured_output_retries`; Zod / Pydantic helpers |
| [`docs-increase-output-consistency.md`](./docs-increase-output-consistency.md) | T1 | Prompt-engineering siblings: format spec, prefill (legacy), examples, retrieval, chaining |
| [`docs-claude-4-best-practices-structured-output.md`](./docs-claude-4-best-practices-structured-output.md) | T1 | 4.x-specific guidance; prefill is dead on 4.6/4.7; few-shot for structured output |
| [`docs-openai-sdk-compat-structured-output.md`](./docs-openai-sdk-compat-structured-output.md) | T1 | Compat-layer gotcha: `response_format` + `strict` are silently ignored |
| [`blog-extract-structured-json-cookbook.md`](./blog-extract-structured-json-cookbook.md) | T1 | The classic tool_use-as-structured-output pattern; 5 worked examples; the `additionalProperties: true` niche |
| [`blog-semantic-vs-schema-errors.md`](./blog-semantic-vs-schema-errors.md) | T1 | Schema-design patterns that encode semantic-validation hooks; the validation-retry-feedback macro pattern |
| [`blog-batch-structured-output-pattern.md`](./blog-batch-structured-output-pattern.md) | T1 | Bulk extraction; batch + structured outputs; 300k output beta; cost-stack |

## Schema-design heuristic block (citation-ready summary)

When designing JSON schemas for structured-output use, the following heuristics are baked into Anthropic's docs (per the cited notes above):

1. **`additionalProperties: false` is mandatory** on every object node in a structured-outputs schema. The single most common 400 cause for hand-rolled schemas.
2. **Mark optional what might be genuinely missing in the source.** Don't add a field to `required` just because you want it; the agent will fail (or fabricate) when the source lacks it. ([[docs-agent-sdk-structured-outputs]])
3. **Always-nullable secondary fields** model "the model declined to provide this" without breaking the schema: `{"type": ["string", "null"]}`. Pair with `"other"`-style enum sentinel.
4. **`"other"` + detail string** is the canonical safety valve for closed-vocabulary fields: enum includes `"other"`, paired with a nullable `other_detail: string` that's required when category is `"other"`. ([[blog-semantic-vs-schema-errors]] Pattern 4)
5. **`detected_pattern` field** for type inference on heterogeneous data — declares what category was detected, callers verify against `value`. ([[blog-semantic-vs-schema-errors]] Pattern 1)
6. **`calculated_total` vs `stated_total`** for arithmetic-relationship cross-checks (invoices, financial reports). Mismatch → human review. ([[blog-semantic-vs-schema-errors]] Pattern 2)
7. **`conflict_detected: boolean` + `conflict_reason: string|null`** for documents with potentially-conflicting fields. Delegates semantic-error detection to the model in measurable form. ([[blog-semantic-vs-schema-errors]] Pattern 3)
8. **Information-provenance triples**: `claim` + `source.document_id` + `source.span_quote` + `source.confidence`. Caller verifies the quote actually appears in the document. ([[blog-semantic-vs-schema-errors]] Pattern 5; the API-native alternative is [[../05-claude-api/docs-citations]] when not combined with structured outputs.)
9. **Field descriptions matter more than constraints**: unsupported constraints (`minLength`, `minimum`, regex backrefs) get stripped by SDKs; pack the constraint into the `description` so the model is steered toward it ("Must be at least 100"). The SDK runs your full schema for client-side validation on the way back. ([[docs-structured-outputs]] SDK Schema Transformation)
10. **Use `enum` for closed categorical fields with `strict: true`** — token-level grammar-constrained classification, no fuzzy matching needed. ([[blog-extract-structured-json-cookbook]])
11. **Keep schemas focused; flatten before going deep**. Deeply nested + many-required → retries exhaust → `error_max_structured_output_retries`. ([[docs-agent-sdk-structured-outputs]])
12. **Don't include PHI in schema definitions** — property names, enum values, const values, regex patterns. Schemas are cached for 24h separately from message content and don't receive HIPAA protections. ([[docs-structured-outputs]])

## Mental model — which structured-output primitive

```
Want guaranteed schema-valid JSON response  →  output_config.format  (docs-structured-outputs)
Want guaranteed schema-valid tool inputs    →  strict: true          (docs-strict-tool-use)
Want both, same request                     →  combine them          (docs-structured-outputs ─ combined example)
Multi-turn agent + final structured payload →  Agent SDK outputFormat (docs-agent-sdk-structured-outputs)
Open-ended fields (additionalProperties:true) →  Cookbook tool_use   (blog-extract-structured-json-cookbook)
Mixed prose + structure                     →  XML tags + few-shot   (docs-increase-output-consistency)
Bulk extraction (≥100 rows, no multi-turn)  →  Batch + structured    (blog-batch-structured-output-pattern)
Migration from OpenAI SDK                   →  Native Anthropic SDK  (docs-openai-sdk-compat-structured-output)
```

## Headline numbers

| Claim | Source | Note |
|---|---|---|
| Strict tools per request: 20 | [[docs-structured-outputs]] | Non-strict tools don't count |
| Optional parameters across strict schemas: 24 | [[docs-structured-outputs]] | Cumulative |
| Parameters using union types: 16 | [[docs-structured-outputs]] | `anyOf` or type arrays |
| Grammar cache TTL: 24 hours | [[docs-structured-outputs]] | From last use |
| Batch discount: 50% | [[../05-claude-api/docs-batch-api]] | Stacks with structured outputs |
| Extended output cap: 300,000 tokens | [[blog-batch-structured-output-pattern]] | Beta `output-300k-2026-03-24` on Opus 4.7/4.6 + Sonnet 4.6, batch only |

## Anti-patterns

- **Don't** assume `response_format` works through the OpenAI compat layer — it's silently ignored ([[docs-openai-sdk-compat-structured-output]]).
- **Don't** forget `additionalProperties: false` on every object node — it's mandatory in structured outputs and the #1 cause of 400 errors for hand-rolled schemas.
- **Don't** mark fields `required` when the source may not contain them — you'll get retry-exhausted errors instead of usable partial data. Use nullable / optional.
- **Don't** use prefill on Mythos / Opus 4.7 / Opus 4.6 / Sonnet 4.6 — returns 400. Use structured outputs or system-prompt instructions instead ([[docs-claude-4-best-practices-structured-output]]).
- **Don't** combine Citations + Structured Outputs in one request — returns 400 ([[../05-claude-api/docs-citations]]). Two-pass (cite, then schema-coerce) or use the prompt-engineered provenance pattern.
- **Don't** put PHI into the schema (`enum`, `const`, property names, `pattern` regex) — schema is cached separately from messages and doesn't get HIPAA protections.
- **Don't** treat structured outputs as a substitute for semantic validation — it eliminates schema errors, not wrong-data errors ([[blog-semantic-vs-schema-errors]]).
- **Don't** duplicate tool-use mechanics ([[../03-advanced-tool-use/]]) — this dossier cross-references.
- **Don't** duplicate batch API mechanics ([[../05-claude-api/docs-batch-api]]) — this dossier captures only the structured-extraction-on-batch pattern.

## Open questions / verification follow-ups

Aggregated from per-note "Open questions" sections:

1. **`output_format` (legacy) deprecation date**: docs say "continue working during a transition period" without a date. Watch changelog.
2. **Refusal handling in production**: `200 + stop_reason: refusal` is the documented behavior, billable. Best-practice wrapper code not in docs — chapter material.
3. **Retry-budget number for Agent SDK**: not disclosed; empirical check needed.
4. **Retry-feedback message shape in Agent SDK**: does the SDK feed the validation error to the model, or just re-issue? "Re-prompting on mismatch" implies the former.
5. **Grammar cache scope**: per-API-key, per-workspace, or org-wide? Matters for parallel-batch scenarios.
6. **Latency impact of `strict` mode** beyond first-call grammar compile: not quantified.
7. **External `$ref` is unsupported** — aligned with MCP 2026-07-28 RC's posture (don't auto-dereference). Worth cross-noting in `02-mcp-spec/`.
8. **Per-platform availability matrix** (Bedrock / Vertex / Foundry) for structured outputs: docs say "varies" without enumeration. Verify per cloud before any platform-specific chapter content.
9. **Anthropic-published evals on semantic-error patterns**: nothing benchmarks `calculated_total`/`stated_total` etc. as a class. Chapter author A/B opportunity.
10. **Migration recipe** from cookbook tool_use to `output_config.format`: not in docs as a worked example; chapter material.

## Cross-references to other dossiers

- **`03-advanced-tool-use/`** — Tool Search Tool, Programmatic Tool Calling, Tool Use Examples, define-tools mechanics. Strict tool use ([[docs-strict-tool-use]]) is the D4 cross-cutting member of that surface.
- **`05-claude-api/`** — Citations (mutually exclusive with structured outputs, 400), Batch API (compatible, 50% off, no multi-turn), Files API (compatible inputs), pricing, models overview.
- **`04-agent-sdk/`** — the Agent SDK structured-outputs surface ([[docs-agent-sdk-structured-outputs]]); see for broader `ClaudeAgentOptions` context.
- **`02-mcp-spec/`** — MCP 2026-07-28 RC adopts JSON Schema 2020-12 for tool input schemas; structured outputs accepts a subset. Cross-check when chapters cover MCP-tool extraction.
- **`../../landscape-2026-05.md` §1.5** — structured outputs is implicit in the "tool use" line of the Claude API features; this dossier deepens that summary.
- **`../../cert-coverage.md` Domain 4 + Domain 5** — primary coverage matrix.
